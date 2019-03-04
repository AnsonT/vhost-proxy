export function httpName (isHttps) {
  return isHttps ? 'https' : 'http'
}

export function validateUrl (url) {
  try {
    const re = /^(https?:\/\/)?((\*\.)?(([\w-]+){1})(\.[\w-]+)+)(:([0-9]+))?(\/.*)?$/
    const match = re.exec(url.toLowerCase())
    if (!match) return ({ isValid: false })
    const isHttps = match[1] === 'https://'
    const hostname = match[2]
    const isWildcard = match[3] === '*.'
    const port = match[8] && parseInt(match[8])
    const path = match[9]
    return {
      isValid: true,
      isHttps,
      hostname,
      pathname: hostname.replace('*', '_'),
      isWildcard,
      port,
      path
    }
  } catch (err) {
    console.log(err)
    return {
      isValid: false,
      error: err
    }
  }
}
