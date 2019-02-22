import vhost from 'vhost'
import vhttps from 'vhttps'
import connect from 'connect'
import proxy from 'http-proxy-middleware'
import _ from 'lodash'
import fs from 'fs'
import path from 'path'

function createHandler (port) {
  const redir = proxy({
    target: `http://localhost:${port}`,
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
  const certPath = proxyOptions.certsPath || path.join(process.cwd(), '.certs')

  console.log(process.cwd())

  _.forEach(config, (options, host) => {
    if (options.https) {
      const cert = fs.readFileSync(path.join(certPath, `${host}.pem`))
      const key = fs.readFileSync(path.join(certPath, `${host}-key.pem`))
      creds.push({ hostname: host, cert, key })
      https.use(vhost(host, createHandler(options.port || 8080)))
    } else {
      http.use(vhost(host, createHandler(options.port || 8080)))
    }
  })
  console.log(creds)
  return {
    https: vhttps.createServer({}, creds, https),
    http }
}

export default setupVhosts
