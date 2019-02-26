import { addVHost } from './addVhost'

async function proxy (domain, { port, target, https, certPath, keyPath }) {
  const ret = await addVHost('proxy', domain, { port, target, https, certPath, keyPath })
  process.exit(ret)
}

export default proxy
