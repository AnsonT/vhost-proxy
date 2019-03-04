import path from 'path'
import fs from 'fs'
import { homedir } from 'os'

export function cleanupPath (pathName) {
  // TODO '~/path' should be treated differently than '~path'
  if (pathName[0] === '~' ) {
    return path.join(homedir(), pathName.slice(1))
  }
  return path.resolve(pathName)
}

export function ensurePath (pathName) {
  fs.existsSync(pathName) || fs.mkdirSync(pathName)
}
