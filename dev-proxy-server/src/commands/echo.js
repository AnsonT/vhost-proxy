import { addVHost } from './addVhost'

async function echo (domain, { https, certPath, keyPath }) {
  const ret = await addVHost('echo', domain, { port: 'auto', https, certPath, keyPath })
  process.exit(ret)
}

export default echo
