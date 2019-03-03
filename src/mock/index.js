import mockApi from 'swagger-mock-api'
import path from 'path'
import { httpName } from '../utils/url'

async function createMockHandler (host, options) {
  console.log(`mock:${httpName(options.https)}://${host} with ${options.apiSpec}`)

  return mockApi({
    swaggerFile: path.resolve(options.apiSpec),
    watch: true // enable reloading the routes and schemas when the swagger file changes
  })
}

export default createMockHandler
