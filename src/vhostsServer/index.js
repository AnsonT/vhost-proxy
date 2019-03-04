import vhost from 'vhost'
import vhttps from 'vhttps'
import express from 'express'
import proxy from 'http-proxy-middleware'
import _ from 'lodash'
import async from 'async'
import { certificateFor } from 'devcert'
import fs from 'fs'
import morganBody from 'morgan-body'
import bodyParser from 'body-parser'
import createMockHandler from '../mock'

function httpName (isHttps) {
  return isHttps ? 'https' : 'http'
}
async function createProxyHandler (host, options) {
  console.log(`proxy:${httpName(options.https)}://${host} -> ${options.target}`)
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

async function createEchoHandler (host, options) {
  console.log(`echo: ${httpName(options.https)}://${host}`)
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
    const https = express()
    const http = express()
    config = config || {}
    const creds = []

    https.use(bodyParser.json())
    http.use(bodyParser.json())
    morganBody(https)
    morganBody(http)

    async.eachSeries(_.toPairs(config), async ([host, options], cb) => {
      if (options.https) {
        let cert
        if (options.certPath) {
          cert = {
            cert: fs.readFileSync(options.certPath),
            key: fs.readFileSync(options.keyPath)
          }
        } else {
          cert = await certificateFor(host, { skipHostsFile: true })
        }
        creds.push({
          hostname: host,
          cert: cert.cert,
          key: cert.key
        })
      }
      var createHandler = null

      if (options.type === 'proxy') createHandler = createProxyHandler
      else if (options.type === 'echo') createHandler = createEchoHandler
      else if (options.type === 'mock') createHandler = createMockHandler
      else {
        console.error(`Invalid vhost type: ${options.type}`)
        cb()
        return
      }

      if (createHandler) {
        if (options.https) {
          https.use(vhost(host, await createHandler(host, options)))
        } else {
          http.use(vhost(host, await createHandler(host, options)))
        }
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
