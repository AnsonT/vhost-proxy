import program from 'commander'
import stringArgv from 'string-argv'
import startServersCommand from './commands/start-servers'
import proxyCommand from './commands/proxy'
import listCommand from './commands/list'
import deleteCommand from './commands/delete'
import echoCommand from './commands/echo'
import mockCommand from './commands/mock'

function setupCli () {
  var argv = process.argv

  // For Neutrino Debugging:
  // neutrino start --options.env.COMMAND_LINE='--help'
  if (process.env.COMMAND_LINE) {
    argv = stringArgv(
      process.env.COMMAND_LINE,
      'node',
      __filename
    )
  }

  program
    .version('0.0.1', '-v, --version')

  program
    .command('start')
    .alias('s')
    .description('Start')
    .option('-d, --debug', 'debug')
    .action(startServersCommand)

  program
    .command('proxy <domain>')
    .alias('p')
    .option('-p, --port <port>', 'target port', parseInt)
    .option('-t, --target <target>', 'target domain', '127.0.0.1')
    .option('--https', 'https')
    .option('--cors', 'cors support')
    .option('-c, --cert <certPath>', 'path to TLS certificate')
    .option('-k, --key <keyPath> ', 'path to TLS private key')
    .description('Proxy a virtual host')
    .action(proxyCommand)

  program
    .command('echo <domain>')
    .alias('e')
    .option('-p, --port <port>', 'echo server port', parseInt)
    .option('--https', 'https')
    .option('--cors', 'cors support')
    .option('-c, --cert <certPath>', 'path to TLS certificate')
    .option('-k, --key <keyPath> ', 'path to TLS private key')
    .description('Start an echo server')
    .action(echoCommand)

  program
    .command('mock <domain> <apiSpec>')
    .alias('m')
    .option('-p, --port <port>', 'echo server port', parseInt)
    .option('--https', 'https')
    .option('--cors', 'cors support')
    .option('-c, --cert <certPath>', 'path to TLS certificate')
    .option('-k, --key <keyPath> ', 'path to TLS private key')
    .action(mockCommand)

  program
    .command('list')
    .alias('l')
    .action(listCommand)

  program
    .command('delete <domain> [domains...]')
    .alias('d')
    .description('Remove the virtual host proxy for the domain')
    .action(deleteCommand)

  program
    .command('*')
    .action(() => { program.help() })

  program
    .parse(argv)

  if (!process.argv.slice(2).length) {
    program.help()
  }
}

export default setupCli
