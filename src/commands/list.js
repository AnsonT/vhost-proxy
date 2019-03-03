import { loadVhosts } from '../vhostsServer/vhosts'
import _ from 'lodash'

async function list () {
  const vhosts = await loadVhosts()
  _.forEach(vhosts, (vhost) => {
    const protocol = vhost.https ? 'https' : 'http'
    console.log(`${protocol}://${vhost.srcHost} -> ${vhost.target}`)
  })
}
export default list
