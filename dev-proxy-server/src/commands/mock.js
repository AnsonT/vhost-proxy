
import resolvePath from 'resolve-path'
import { addVHost } from './addVhost'

async function mock (domain, respFile, { https, cors, certPath, keyPath }) {
  respFile = resolvePath(respFile)
  console.log(respFile)
  const ret = await addVHost('mock', domain, {
    port: 'auto',
    https,
    cors,
    certPath,
    keyPath,
    respFile })
  process.exit(ret)
}

export default mock
