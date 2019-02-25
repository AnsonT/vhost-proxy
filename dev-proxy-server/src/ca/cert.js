import forge, { pki, rsa, sha256 } from 'node-forge'
const isIp = require('is-ip')

// a hexString is considered negative if it's most significant bit is 1
// because serial numbers use ones' complement notation
// this RFC in section 4.1.2.2 requires serial numbers to be positive
// http://www.ietf.org/rfc/rfc5280.txt
function toPositiveHex (hexString) {
  var mostSiginficativeHexAsInt = parseInt(hexString[0], 16)
  if (mostSiginficativeHexAsInt < 8) {
    return hexString
  }

  mostSiginficativeHexAsInt -= 8
  return mostSiginficativeHexAsInt.toString() + hexString.substring(1)
}

function randomSerialNumber () {
  return toPositiveHex(forge.util.bytesToHex(forge.random.getBytesSync(16)))
}

// export function mkCertCA () {
export async function createCA ({ commonName, organization, organizationalUnit, countryCode, state, locality, validityDays }) {
  const rootCertAuthorityAttr = [
    { name: 'commonName', value: commonName || organization },
    // { name: 'countryName', value: countryCode },
    // { name: 'localityName', value: locality },
    { name: 'organizationName', value: organization },
    { shortName: 'OU', value: organizationalUnit }
    // { shortName: 'ST', value: state }
  ]

  const certAuthorityExtensions = [
    {
      name: 'basicConstraints',
      critical: true,
      cA: true,
      pathLenConstraint: 0
    }, {
      name: 'keyUsage',
      critical: true,
      keyCertSign: true,
      cRLSign: true
    }
  ]

  const caKeyPair = rsa.generateKeyPair(2048)
  const caCert = pki.createCertificate()
  caCert.publicKey = caKeyPair.publicKey
  caCert.serialNumber = randomSerialNumber() // see Appendix for implementation
  caCert.validity.notBefore = new Date()
  caCert.validity.notAfter = new Date()
  // caCert.validity.notAfter.setFullYear(cert.validity.notBefore.getFullYear() + 1)
  caCert.validity.notAfter.setDate(caCert.validity.notAfter.getDate() + validityDays)

  caCert.setSubject(rootCertAuthorityAttr)
  caCert.setIssuer(rootCertAuthorityAttr)
  caCert.setExtensions(certAuthorityExtensions)
  caCert.sign(caKeyPair.privateKey, sha256.create())

  // const caCertKeyPem = pki.encryptRsaPrivateKey(caKeyPair.privateKey, 'password for CA')
  // const caCertPem = pki.certificateToPem(caCert)

  return {
    pem: {
      key: pki.privateKeyToPem(caKeyPair.privateKey),
      cert: pki.certificateToPem(caCert)
    },
    cert: caCert
  }
}

export async function createCert ({ domains, validityDays, caKey, caCert }) {
  const ca = pki.certificateFromPem(caCert)
  const serverAttr = [
    // { name: 'commonName', value: domains[0] },
    { shortName: 'OU', value: ca.subject.getField('OU').value },
    { name: 'organizationName', value: 'devProxy development certificate' }
  ]
  const serverExtensions = [
    // Authority Key Identifier?
    {
      name: 'basicConstraints',
      critical: true,
      cA: false
    },
    {
      name: 'keyUsage',
      critical: true,
      digitalSignature: true,
      keyEncipherment: true
    },
    {
      name: 'extKeyUsage',
      serverAuth: true
    }, {
      name: 'authorityKeyIdentifier',
      keyIdentifier: ca.generateSubjectKeyIdentifier().getBytes()
    },
    {
      name: 'subjectAltName',
      altNames: domains.map(domain => (
        isIp(domain)
          ? { type: 7, ip: domain }
          : { type: 2, value: domain }
      ))
    }
  ]

  const serverKeyPair = await rsa.generateKeyPair(2048)
  const serverCert = pki.createCertificate()
  serverCert.publicKey = serverKeyPair.publicKey
  serverCert.serialNumber = randomSerialNumber()
  serverCert.validity.notBefore = new Date()
  serverCert.validity.notAfter = new Date()
  serverCert.validity.notAfter.setDate(serverCert.validity.notAfter.getDate() + validityDays)

  serverCert.setSubject(serverAttr)
  serverCert.setIssuer(ca.subject.attributes)
  serverCert.setExtensions(serverExtensions)

  // const signingKey = pki.decryptRsaPrivateKey(intCaCertKeyPem, 'password for interm CA')
  const signingKey = pki.privateKeyFromPem(caKey)

  serverCert.sign(signingKey, sha256.create())

  const serverKeyPem = pki.privateKeyToPem(serverKeyPair.privateKey)
  const serverCertPem = pki.certificateToPem(serverCert)

  return {
    pem: {
      key: serverKeyPem,
      cert: serverCertPem
    },
    cert: serverCert
  }
}
