import { Cert } from 'selfsigned-ca'
import path from 'path'
import os from 'os'

export async function ensureRootCA () {
  const rootCaCert = new Cert('dev-proxy.root-ca')
  const uniqueName = `${os.userInfo().username}@${os.hostname()}`
  const rootCaCertOptions = {
    days: 9999,
    algorithm: 'sha256',
    subject: {
      commonName: `dev-proxy ${uniqueName}}`,
      organizationName: 'dev-proxy development CA',
      organizationalUnitName: uniqueName
    }
  }

  try {
    console.log('trying to load existing root CA certificate and use it for signing')
    await rootCaCert.load()
    if (!await rootCaCert.isInstalled()) {
      console.log('installing root CA')
      await rootCaCert.install()
      console.log('root CA installed')
    }
  } catch (err) {
    console.log(`couldn't load existing CA cert, creating new one`)
    rootCaCert.createRootCa(rootCaCertOptions)
    console.log('created root CA')
    await rootCaCert.save()
    console.log('saved root CA certificate at')
    console.log(path.join(process.cwd(), rootCaCert.crtPath))
    console.log(path.join(process.cwd(), rootCaCert.keyPath))
    try {
      // Install the newly created CA to device's keychain so that all server certificates
      // signed by the CA are automatically trusted and green.
      console.log('installing root CA')
      await rootCaCert.install()
      console.log('installed root CA')
    } catch (err) {
      console.log('root CA could not be installed & trusted on the device')
    }
  }
}
