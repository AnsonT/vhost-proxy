import path from 'path'
import { uninstallCert } from '../ca/certStore'
import config from '../config'
function uninstall () {
  console.log('uninstall')
  const caPath = config.get('caPath')
  const caCertPath = path.resolve(path.join(caPath, 'rootCA.pem'))
  uninstallCert(caCertPath)
}

export default uninstall
