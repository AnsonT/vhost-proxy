import proxy from '../proxy'
import { loadVhosts } from '../proxy/vhosts'

async function startServers (servers) {
  console.log('startServer', __filename, servers)
  const vhosts = await loadVhosts()
  const options = {
    // certsPath: '.certs'
  }
  const { http, https } = await proxy(vhosts, options)
  console.log('------------------')
  http.listen(80, () => { console.log('listening on 127.0.0.1:80') })
  https.listen(443, () => { console.log('listening on 127.0.0.1:443') })
}

export default startServers
