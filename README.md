Local Development Proxy
=======================
[![Build Status](https://travis-ci.org/AnsonT/dev-proxy.svg?branch=master)](https://travis-ci.org/AnsonT/dev-proxy) [![dependencies Status](https://david-dm.org/AnsonT/dev-proxy/status.svg)](https://david-dm.org/AnsonT/dev-proxy) [![devDependencies Status](https://david-dm.org/AnsonT/dev-proxy/dev-status.svg)](https://david-dm.org/AnsonT/dev-proxy?type=dev) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
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
Usage: dev-proxy [options] [command]

Options:
  -v, --version                         output the version number
  -h, --help                            output usage information

Commands:
  start|s [options]                     Start
  proxy|p [options] <domain>            Proxy a virtual host
  echo|e [options] <domain>             Start an echo server
  mock|m [options] <domain> <respFile>
  list|l
  delete|d <domain> [domains...]        Remove the virtual host proxy for the domain
```


#### Appendix
This project uses the following libraries
- https://github.com/davewasmer/devcert
- https://github.com/kevinkassimo/vhttps
- https://github.com/expressjs/vhost
- https://github.com/wankdanker/node-dns-express
- https://github.com/APIDevTools/swagger-express-middleware

