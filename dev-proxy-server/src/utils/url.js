export function formatUrl (url, port) {
  return ''
}
export function validateUrl (url) {
  try {
    const re = /^(https?:\/\/)?((\*\.)?(([\w-]+){1})(\.[\w-]+)+)$/
    const match = re.exec(url.toLowerCase())
    if (!match) return ({ isValid: false })
    const isHttps = match[1] === 'https://'
    const hostname = match[2]
    const isWildcard = match[3] === '*.'
    return {
      isValid: true,
      isHttps,
      hostname,
      pathname: hostname.replace('*', '_'),
      isWildcard
    }
  } catch (err) {
    console.log(err)
    return {
      isValid: false,
      error: err
    }
  }
}
