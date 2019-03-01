import _ from 'lodash'
import { execSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import config from '../config'

export function ensureResolver (options) {
  const resolver =
`cat >${path.resolve('/etc/resolver', options.pathname)} <<EOF
nameserver=127.0.0.1
port=${config.get('dnsPort')}
EOF
`
  const mkdir = `mkdir -p /etc/resolver`
  execSync(`sudo -- sh -c '${mkdir} && ${resolver}'`)
}
export function removeResolver (domain) {
  const resolverPath = path.resolve('/etc/resolver', domain)

  if (fs.existsSync(resolverPath)) {
    const rm = `sudo rm "${resolverPath}"`
    execSync(rm)
  }
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
  console.log(`DNS Listening on ${config.get('dnsPort')}`)
  server.listen(config.get('dnsPort'))
}
