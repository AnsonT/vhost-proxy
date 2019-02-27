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

function proxyHandler (target) {
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

function echoHandler () {
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

async function setupProxy ({ http, https, host, options }) {
  if (options.https) {
    console.log(`https://${host} -> ${options.target}`)
    https.use(vhost(host, proxyHandler(options.target)))
  } else {
    console.log(`http://${host} -> ${options.target}`)
    http.use(vhost(host, proxyHandler(options.target)))
  }
}

async function setupEcho ({ http, https, host, options }) {
  if (options.https) {
    console.log(`echo https://${host}`)
    https.use(vhost(host, echoHandler()))
  } else {
    console.log(`echo http://${host}`)
    http.use(vhost(host, echoHandler()))
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

      if (options.type === 'proxy') {
        await setupProxy({ http, https, host, options })
        cb()
      } else if (options.type === 'echo') {
        await setupEcho({ http, https, host, options })
        cb()
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
