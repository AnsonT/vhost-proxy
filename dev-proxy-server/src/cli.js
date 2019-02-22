import os from 'os'
import program from 'commander'
import stringArgv from 'string-argv'
import startServersCommand from './commands/start-servers'
import installCommand from './commands/install'
import uninstallCommand from './commands/uninstall'
import genCACommand from './commands/genCA'

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
    .command('genca')
    .description('Generate root cert authority')
    .option('-p, --path [path]', 'Path to cert authority', '.ca')
    .option('-n, --name [name]', 'Name of cert authority', os.hostname())
    .alias('g')
    .action(genCACommand)

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
    .command('start <servers>')
    .alias('s')
    .description('Start servers [all|dns|proxy]')
    .action(startServersCommand)

  program
    .parse(argv)
}

export default setupCli
