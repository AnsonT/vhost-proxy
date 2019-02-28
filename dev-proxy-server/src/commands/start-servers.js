import vhostServer from '../vhostsServer'
import { loadVhosts } from '../vhostsServer/vhosts'

async function startServers ({ debug }) {
  console.log('Starting server')
  const vhosts = await loadVhosts()
  const options = {
    // certsPath: '.certs'
  }
  try {
    const { http, https } = await vhostServer(vhosts, options)
    http.listen(80, () => { console.log('listening on 127.0.0.1:80') })
    https.listen(443, () => { console.log('listening on 127.0.0.1:443') })
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

export default startServers
