import vhost from 'vhost'
import vhttps from 'vhttps'
import connect from 'connect'
import proxy from 'http-proxy-middleware'
import _ from 'lodash'
// import path from 'path'
import fs from 'fs'
// import async from 'async'
// import { certificateFor } from 'devcert'

function createHandler (target) {
  const redir = proxy({
    target,
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    logLevel: 'debug'
  })
  return (req, res, next) => {
    console.log(req.vhost)
    redir(req, res, next)
  }
}

function setupVhosts (config, proxyOptions = {}) {
  const https = connect()
  const http = connect()
  config = config || {}
  const creds = []

  _.forEach(config, (options, host) => {
    if (options.https) {
      // const cert = options.certPath || path.join(options.configPath, `${options.pathname}.pem`)
      // const key = options.keyPath || path.join(options.configPath, `${options.pathname}-key.pem`)
      const cert = `/Users/ansont/Library/Application Support/devcert/domains/${options.pathname}/certificate.crt`
      const key = `/Users/ansont/Library/Application Support/devcert/domains/${options.pathname}/private-key.key`

      creds.push({ hostname: host,
        cert: fs.readFileSync(cert),
        key: fs.readFileSync(key) })
      console.log(`https://${host} -> ${options.target}`)
      https.use(vhost(host, createHandler(options.target)))
    } else {
      console.log(`http://${host} -> ${options.target}`)
      http.use(vhost(host, createHandler(options.target)))
    }
  })
  return {
    https: vhttps.createServer({}, creds, https),
    http }
}

export default setupVhosts
