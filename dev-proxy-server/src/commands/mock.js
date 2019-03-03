
import resolvePath from 'resolve-path'
import { addVHost } from './addVhost'

async function mock (domain, apiSpec, { https, cors, certPath, keyPath }) {
  apiSpec = resolvePath(apiSpec)
  console.log(apiSpec)
  const ret = await addVHost('mock', domain, {
    port: 'auto',
    https,
    cors,
    certPath,
    keyPath,
    apiSpec })
  process.exit(ret)
}

export default mock
