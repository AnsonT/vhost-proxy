import fs from 'fs'
import _ from 'lodash'

function httpName (isHttps) {
  return isHttps ? 'https' : 'http'
}

function findResponse (request) {
  return (response) => {
    if (response.request.url === request.url) {
      return response
    }
    return null
  }
}
function mockHandler (host, options) {
  console.log(`mock: ${httpName(options.https)}://${host} -> ${options.respFile}`)
  const responses = JSON.parse(fs.readFileSync(options.respFile))
  return (req, res, next) => {
    const response = _.find(responses, findResponse(req))
    if (response) {
      res.statusCode = 200
      res.end()
    } else {
      res.statusCode = 404
      res.statusMessage = 'Not Found'
      res.end()
    }
  }
}

export default mockHandler
