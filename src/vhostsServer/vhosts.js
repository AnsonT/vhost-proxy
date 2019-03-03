import fs from 'fs'
import path from 'path'
import config from '../config'

export async function loadVhosts () {
  const vhostsPath = config.get('vhostsPath')
  const paths = fs.readdirSync(vhostsPath)
  return new Promise((resolve, reject) => {
    var vhosts = {}
    try {
      paths.forEach((vhostPath) => {
        const configPath = path.resolve(vhostsPath, vhostPath)
        const configFilePath = path.resolve(configPath, config.get('vhostConfig'))
        const vhostConfig = JSON.parse(fs.readFileSync(configFilePath))
        vhosts[vhostConfig.srcHost] = Object.assign({ configPath }, vhostConfig)
      })
      resolve(vhosts)
    } catch (err) {
      reject(err)
    }
  })
}
