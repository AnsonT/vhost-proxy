import program from 'commander'
import stringArgv from 'string-argv'
import startServersCommand from './commands/start-servers'
import installCommand from './commands/install'
import uninstallCommand from './commands/uninstall'
import proxyCommand from './commands/proxy'
import listCommand from './commands/list'
import deleteCommand from './commands/delete'

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
    .command('install')
    .description('Install root cert authority')
    .alias('i')
    .action(installCommand)

  program
    .command('uninstall')
    .alias('u')
    .description('Uninstall root cert authority')
    .action(uninstallCommand)

  program
    .command('start <server> [servers]')
    .alias('s')
    .description('Start servers [all|dns|proxy]')
    .option('-d, --debug <domain>', 'debug')
    .action(startServersCommand)

  program
    .command('proxy <domain>')
    .alias('p')
    .option('-p, --port <port>', 'target port', parseInt)
    .option('-t, --target <target>', 'target domain', '127.0.0.1')
    .option('--https', 'https')
    .option('-c, --cert <certPath>', 'path to TLS certificate')
    .option('-k, --key <keyPath> ', 'path to TLS privaet key')
    .description('Proxy a virtual host')
    .action(proxyCommand)

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
    .command('pause <domain> [domains...]')
    .alias('P')
    .description('Pause proxying domain(s)')

  program
    .command('resume <domain> [domains...]')
    .alias('r')
    .description('Resume proxying domain(s)')

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
