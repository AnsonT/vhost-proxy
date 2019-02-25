import sudo from 'sudo-prompt'
import { exec } from 'child_process'
import fs from 'fs'
import { pki } from 'node-forge'
import { userInfo, hostname } from 'os'
// import * as mkcert from './mkcert'
import { createCA as createCACert } from './cert'

const systemKeyChain = '/Library/Keychains/System.keychain'

export async function installCert (certPath) {
  const addTrustCmd = `security add-trusted-cert -d -p ssl -r trustRoot -k "${systemKeyChain}" "${certPath}"`
  const options = {
    name: 'Dev Proxy'
  }
  return new Promise((resolve, reject) => {
    sudo.exec(addTrustCmd, options, (error, stdout, stderr) => {
      if (error) return reject(error)
      console.log(stdout)
      return resolve()
    })
  })
}

export async function uninstallCert (certPath) {
  const cert = await loadCert(certPath)
  const commonName = cert.subject.getField('CN').value
  const delTrustCmd = `security delete-certificate -c "${commonName}"`
  const options = {
    name: 'Dev Proxy'
  }
  return new Promise((resolve, reject) => {
    sudo.exec(delTrustCmd, options, (error, stdout, stderr) => {
      if (error) return reject(error)
      console.log(stdout)
      return resolve()
    })
  })
}

async function loadCert (certPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(certPath, (err, data) => {
      if (err) return reject(err)
      const cert = pki.certificateFromPem(data)
      resolve(cert)
    })
  })
}

export async function isCertInstalled (certPath) {
  if (!fs.existsSync(certPath)) {
    return false
  }
  const cert = await loadCert(certPath)
  const commonName = cert.subject.getField('CN').value
  const findCertCmd = `security find-certificate -p -c "${commonName}"`
  return new Promise((resolve, reject) => {
    console.log(findCertCmd)
    exec(findCertCmd, (error, stdout, stderr) => {
      if (error) return resolve(false)
      const isCert = stdout.includes('-BEGIN CERTIFICATE-')
      return resolve(isCert)
    })
  })
}

export async function createCA (certPath, keyPath) {
  if (fs.existsSync(certPath)) {
    console.log('CA cert already exists')
    const cert = await loadCert(certPath)
    return {
      certPath,
      keyPath,
      cert
    }
  }

  const uniqueName = `${userInfo().username}@${hostname()}`
  const options = {
    organization: 'devProxy development CA',
    organizationalUnit: uniqueName,
    commonName: `devProxy ${uniqueName}`,
    validityDays: 9999
  }
  const cert = await createCACert(options) // mkcert.createCA(options)
  console.log(certPath, keyPath)
  fs.writeFileSync(certPath, cert.pem.cert)
  fs.writeFileSync(keyPath, cert.pem.key)
  return {
    certPath: certPath,
    keyPath: keyPath,
    cert: cert.cert
  }
}
