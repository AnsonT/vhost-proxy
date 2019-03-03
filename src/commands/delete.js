import path from 'path'
import fs from 'fs'
import eachSeries from 'async/eachSeries'
import rimraf from 'rimraf'
import { validateUrl } from '../utils/url'
import config from '../config'
import _ from 'lodash'
import { removeResolver } from '../vhostsServer/dns'

export default async function deleteVhost (domain, domains) {
  const vhostsPath = config.get('vhostsPath')

  domains.push(domain)
  const vhosts = domains.map(url => {
    const srcUrl = validateUrl(url)
    var vhostPath
    if (srcUrl.isValid) {
      vhostPath = path.resolve(vhostsPath, srcUrl.pathname)
      if (!fs.existsSync(vhostPath)) vhostPath = undefined
    }
    return { domain: url, vhostPath }
  })
  vhosts.forEach(vhost => {
    removeResolver(vhost.domain)
  })
  const rimrafPaths = _.compact(_.map(vhosts, vhost => vhost.vhostPath))
  return new Promise((resolve, reject) => {
    eachSeries(rimrafPaths, (p, cb) => {
      console.log(`deleting ${p}`)
      rimraf(p, cb)
    }, (err) => {
      if (err) {
        reject(err)
      } else {
        console.log('completed')
        resolve()
      }
    })
  })
}
