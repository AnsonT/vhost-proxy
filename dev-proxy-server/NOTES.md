# Notes

- Using node-forge for self-signed certs
  - https://medium.com/@ansont/step-by-step-creating-your-own-self-signed-certificate-authority-in-node-js-7500550a943a
- Debug certificate issues with https connection
  - ```openssl s_client -connect test1.localhost:443 -servername test1.localhost -CAfile ~/.dev-proxy/ca/rootCA.pem```

* npm

  ```bash
  yarn version --patch # increment 0.0.x
  yarn version --minor # increment 0.x.0
  yarn version --major # increment x.0.0	
  ```

* ```bash
  npm login
  username: ansont
  ```

* 