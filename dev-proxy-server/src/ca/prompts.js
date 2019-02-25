import inquirer from 'inquirer'
import { userInfo, hostname } from 'os'

export async function promptCADetails () {
  const uniqueName = `${userInfo().username}@${hostname()}`
  const answers = await inquirer.prompt([
    {
      name: 'organization',
      default: 'devProxy development CA'
    }, {
      name: 'organizationUnit',
      default: uniqueName
    }, {
      name: 'commonName',
      default: `devProxy ${uniqueName}`
    }, {
      name: 'validityDays',
      type: 'number',
      default: 9999
    }, {
      name: 'confirm',
      message: 'create CA certificate?',
      type: 'confirm'
    }
  ])
  console.log(answers)
  return answers
}
