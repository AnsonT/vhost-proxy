import { ensurePath } from '../../src/utils/path'
import fs from 'fs'
jest.mock('fs')



it('ensurePath create non-existing path', () => {
    fs.existsSync.mockReturnValue(false)
    fs.mkdirSync.mockReset()

    ensurePath('/User/user1/test')

    expect(fs.mkdirSync).toHaveBeenCalled()
})


it('ensurePath create existing path', () => {
  fs.existsSync.mockReturnValue(true)
  fs.mkdirSync.mockReset()

  ensurePath('/User/user2/test')

  expect(fs.mkdirSync).not.toHaveBeenCalled()
})

