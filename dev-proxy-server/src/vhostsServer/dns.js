import _ from 'lodash'
import { execSync } from 'child_process'
import path from 'path'

export function ensureResolver (options) {
  const cmd = `mkdir -p /etc/resolver && touch ${path.resolve('/etc/resolver', options.pathname)}`
  execSync(`sudo -- sh -c '${cmd}'`)
}
export function removeResolver (options) {

}
export default function dnsServer (vhosts) {
  let server = require('dns-express')()

  _.forEach(_.toPairs(vhosts), ([vhost, options]) => {
    ensureResolver(options)
    console.log(vhost)
  })
  server.a(/^.*$/i, (req, res, next) => {
    console.log(`Resoving: ${req.name}`)
    res.a({ name: req.name, address: '127.0.0.1', ttl: 600 })
    res.end()
  })

  server.use(function (req, res) {
    // End the response if no "routes" are matched
    res.end()
  })
  console.log('DNS Listening on 53535')
  server.listen(53535)
}
