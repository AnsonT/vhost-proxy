Local Development Proxy
=======================
[![Build Status](https://travis-ci.org/AnsonT/vhost-proxy.svg?branch=master)](https://travis-ci.org/AnsonT/vhost-proxy) [![dependencies Status](https://david-dm.org/AnsonT/vhost-proxy/status.svg)](https://david-dm.org/AnsonT/vhost-proxy) [![devDependencies Status](https://david-dm.org/AnsonT/vhost-proxy/dev-status.svg)](https://david-dm.org/AnsonT/vhost-proxy?type=dev) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
##### Setup virtual hosts and self signed certificates to proxy custom domains to local servers

### Features

- Setup virtual hosts for any domain on local port 80, 443
- Automatically setup self-signed certificates for SSL/TLS endpoints
- Authomatically setup local dns resolve domains to local virtual host without having to edit host file
- Proxy web requests to local port or remote targets
- Echo web requests
- Mock REST API using Swagger/OpenAPI specification
- Serve local files

### Commands
```
Usage: vhost-proxy [options] [command]

Options:
  -v, --version                         output the version number
  -h, --help                            output usage information

Commands:
  start|s [options]                     Start
  proxy|p [options] <domain>            Proxy a virtual host
  echo|e [options] <domain>             Start an echo server
  mock|m [options] <domain> <apiSpec>
  list|l
  delete|d <domain> [domains...]        Remove the virtual host proxy for the domain
```

### Example Usage
```
# Proxy https://www.testdomain.com to the local server 127.0.0.1:8080
> vhost-proxy proxy https://www.testdomain.com -p 8080

# Mock REST API at https://api.testdomain.com using swagger spec
> vhost-proxy mock https://api.testdomain.com examples/PetStore.yaml

# Start servers
> vhost-proxy start
```

#### Appendix
This project uses the following libraries
- https://github.com/davewasmer/devcert
- https://github.com/kevinkassimo/vhttps
- https://github.com/expressjs/vhost
- https://github.com/wankdanker/node-dns-express
- https://github.com/dzdrazil/swagger-mock-api

