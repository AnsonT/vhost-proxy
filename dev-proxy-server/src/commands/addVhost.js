import Url from 'url'
import path from 'path'
import fs from 'fs'
import { validateUrl } from '../utils/url'
import { ensurePath } from '../utils/path'
import config from '../config'
import { certificateFor } from 'devcert'

export async function addVHost (type, domain, { port, target, https, cors, certPath, keyPath }) {
  if (port !== 'auto' && (!port && target === '127.0.0.1')) {
    console.error('At least one of --port or --target must be specified')
    return 1
  }
  const srcUrl = validateUrl(domain)
  if (!srcUrl.isValid) {
    console.error(`${domain} is an invalid domain`)
    return 1
  }
  if (port === 'auto') {
    target = 'auto'
  } else {
    const targetUrl = Url.parse(target)
    target = Url.format({
      protocol: targetUrl.protocol || 'http',
      hostname: targetUrl.hostname || targetUrl.pathname,
      port: targetUrl.port || port
    })
  }

  const vhost = {
    type,
    srcHost: srcUrl.hostname,
    https: https || srcUrl.isHttps,
    isWildcard: srcUrl.isWildcard,
    target,
    pathname: srcUrl.pathname,
    cors,
    certPath,
    keyPath
  }
  const vhostPath = path.resolve(config.get('vhostsPath'), srcUrl.pathname)
  ensurePath(vhostPath)

  if (vhost.https && !vhost.certPath) {
    await certificateFor(vhost.srcHost, { skipHostsFile: true })
    console.log(`Certificate for ${vhost.srcHost} generated`)
  }
  const vhostConfigPath = path.resolve(vhostPath, config.get('vhostConfig'))
  fs.writeFileSync(vhostConfigPath, JSON.stringify(vhost, null, 2))
  console.log(`Written config to ${vhostPath}`)
  return 0
}
