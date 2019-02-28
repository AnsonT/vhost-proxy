
async function mock (domain, respFile, { https, cors, certPath, keyPath }) {
  console.log(domain, respFile)
  process.exit(0)
}

export default mock
