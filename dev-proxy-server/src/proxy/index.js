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

async function setupProxy ({ http, https, host, options, creds }) {
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
    console.log(`https://${host} -> ${options.target}`)
    https.use(vhost(host, createHandler(options.target)))
  } else {
    console.log(`http://${host} -> ${options.target}`)
    http.use(vhost(host, createHandler(options.target)))
  }
}

function setupVhosts (config, proxyOptions = {}) {
  return new Promise((resolve, reject) => {
    const https = connect()
    const http = connect()
    config = config || {}
    const creds = []

    async.eachSeries(_.toPairs(config), async ([host, options], cb) => {
      if (options.type === 'proxy') {
        await setupProxy({ http, https, host, options, creds })
        cb()
      } else if (options.type === 'echo') {
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
