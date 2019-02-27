import vhost from 'vhost'
import vhttps from 'vhttps'
import connect from 'connect'
import proxy from 'http-proxy-middleware'
import _ from 'lodash'
// import path from 'path'
// import fs from 'fs'
import async from 'async'
import { certificateFor } from 'devcert'
import fs from 'fs'
// import util from 'util'

function httpName (isHttps) {
  return  isHttps ? 'https' : 'http'
}
function proxyHandler (host, options) {
  console.log(`proxy:${httpName(host.https)}://${host} -> ${options.target}`)
  const redir = proxy({
    target: options.target,
    changeOrigin: true, // for vhosted sites, changes host header to match to target's host
    logLevel: 'error'
  })
  return (req, res, next) => {
    console.log(req.vhost)
    redir(req, res, next)
  }
}

function echoHandler (host, options) {
  console.log(`echo: ${httpName(host.https)}://${host}`)
  return (req, res, next) => {
    // res.end(util.inspect(req))
    const out = {
      originalUrl: req.originalUrl,
      url: req.url,
      hostname: req.hostname,
      method: req.method,
      headers: req.headers,
      body: []
    }
    req
      .on('data', (chunk) => {
        out.body.push(chunk)
      })
      .on('end', () => {
        out.body = Buffer.concat(out.body).toString()
        if (req.headers['content-type'] === 'application/json') {
          out.body = JSON.parse(out.body)
        }
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(out, null, 2))
      })
  }
}

function setupVhosts (config, proxyOptions = {}) {
  return new Promise((resolve, reject) => {
    const https = connect()
    const http = connect()
    config = config || {}
    const creds = []

    async.eachSeries(_.toPairs(config), async ([host, options], cb) => {
      if (options.https) {
        let cert
        if (options.certPath) {
          cert = {
            cert: fs.readFileSync(options.certPath),
            key: fs.readFileSync(options.keyPath)
          }
        } else {
          cert = await certificateFor(host)
        }
        creds.push({
          hostname: host,
          cert: cert.cert,
          key: cert.key
        })
      }
      var handler = null

      if (options.type === 'proxy') handler = proxyHandler
      else if (options.type === 'echo') handler = echoHandler
      else {
        console.error(`Invalid vhost type: %{options.type}`)
        cb()
        return
      }

      if (handler) {
        if (options.https) {
          https.use(vhost(host, handler(host, options)))
        } else {
          http.use(vhost(host, handler(host, options)))
        }
      }
    }, (err) => {
      if (err) reject(err)
      else {
        resolve({
          https: vhttps.createServer({}, creds, https),
          http
        })
      }
    })
  })
}

export default setupVhosts