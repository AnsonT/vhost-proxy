import { addVHost } from './addVhost'

async function echo (domain, { https, cors, certPath, keyPath }) {
  const ret = await addVHost('echo', domain, { port: 'auto', https, cors, certPath, keyPath })
  process.exit(ret)
}

export default echo
