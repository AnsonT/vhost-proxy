import proxy from '../proxy'
import { loadVhosts } from '../proxy/vhosts'

async function startServers (servers) {
  console.log('startServer', __filename, servers)
  const vhosts = await loadVhosts()
  // const vhosts = {
  //   'test1.localhost': {
  //     port: 3000,
  //     https: true
  //   },
  //   'test2.localhost': {
  //     port: 3001
  //   }
  // }
  const options = {
    // certsPath: '.certs'
  }
  const { http, https } = proxy(vhosts, options)
  http.listen(80)
  https.listen(443)
}

export default startServers
