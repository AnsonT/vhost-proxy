import convict from 'convict'
import fs from 'fs'
import path from 'path'
import { cleanupPath, ensurePath } from './utils/path'

const configSchema = {
  root: {
    doc: 'Root config directory',
    default: '~/.dev-proxy',
    env: 'DEV_PROXY_ROOT'
  },
  caPath: {
    doc: 'Certificate Authority directory',
    default: null, // '/Users/ansont/Library/Application Support/mkcert',
    env: 'DEV_PROXY_CA_PATH'
  },
  vhostsPath: {
    doc: 'Virtual hosts directory',
    default: null,
    env: 'DEV_PROXY_VHOSTS_PATH'
  },
  vhostConfig: {
    doc: 'vhost config filename',
    default: 'vhost.config.json'
  }
}

function initConfig () {
  const config = convict(configSchema)

  config.set('root', cleanupPath(config.get('root')))
  const root = config.get('root')
  const configPath = path.resolve(root, 'dev-proxy.config.json')

  config.get('caPath') || config.set('caPath', path.resolve(root, 'ca'))
  config.get('vhostsPath') || config.set('vhostsPath', path.resolve(root, 'vhosts'))

  ensurePath(root)
  ensurePath(config.get('caPath'))
  ensurePath(config.get('vhostsPath'))

  if (fs.existsSync(configPath)) {
    config.loadFile(configPath)
  }
  // config.validate({ allowed: 'strict' })

  return config
}

const config = initConfig()

export default config
