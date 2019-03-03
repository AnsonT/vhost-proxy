import { installCert, isCertInstalled, createCA } from '../ca/certStore'
import path from 'path'
import { promptCADetails } from '../ca/prompts'
import config from '../config'

async function install () {
  try {
    console.log('install: ')
    await promptCADetails()
    const cert = 'rootCA.pem'
    const isCert = await isCertInstalled(cert)
    if (isCert) {
      console.log('cert already installed')
    } else {
      console.log('cert not installed')
      console.log('generate CA cert:')
      const caPath = config.get('caPath')
      const certPath = path.resolve(path.join(caPath, 'rootCA.pem'))
      const keyPath = path.resolve(path.join(caPath, 'rootCA-key.pem'))

      const cert = await createCA(certPath, keyPath)
      console.log('install cert', cert)
      await installCert(cert.certPath)
      console.log('cert installed')
    }
  } catch (error) {
    console.log(error)
  }
}

export default install
