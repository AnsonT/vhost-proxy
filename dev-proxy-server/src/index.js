import setupCli from './cli'

setupCli()

if (module.hot) {
  module.hot.accept('./cli')
}
