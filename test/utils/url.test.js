import { httpName, validateUrl } from '../../src/utils/url'

it('test isValid simple http url', () => {
  const r1 = validateUrl('http://test.com')
  expect(r1.isValid).toBe(true)
  expect(r1.hostname).toBe('test.com')
})

it('test isValid simple https url', () => {
  const r2 = validateUrl('https://test.com')
  expect(r2.isValid).toBe(true)
  expect(r2.hostname).toBe('test.com')
  expect(r2.isHttps).toBe(true)
})

it('test isValid longer https url', () => {
  const r3 = validateUrl('http://www.test.com')
  expect(r3.isValid).toBe(true)
  expect(r3.hostname).toBe('www.test.com')
  expect(r3.isHttps).toBe(false)

})

it('test isValid http with port', () => {
  const r4 = validateUrl('https://www.test.com:80')
  expect(r4.isValid).toBe(true)
  expect(r4.hostname).toBe('www.test.com')
  expect(r4.isHttps).toBe(true)
  expect(r4.port).toBe(80)
})

it('test isValid http with path', () => {
  const r4 = validateUrl('https://www.test.com:80/testing?abc')
  expect(r4.isValid).toBe(true)
  expect(r4.hostname).toBe('www.test.com')
  expect(r4.isHttps).toBe(true)
  expect(r4.port).toBe(80)
  expect(r4.path).toBe('/testing?abc')
})

it('test simple wildcard', () => {
  const r1 = validateUrl('http://*.test.com')
  expect(r1.isValid).toBe(true)
  expect(r1.hostname).toBe('*.test.com')
  expect(r1.pathname).toBe('_.test.com')
})

it('test complex wildcard', () => {
  const r1 = validateUrl('http://*.www.test.com')
  expect(r1.isValid).toBe(true)
  expect(r1.hostname).toBe('*.www.test.com')
  expect(r1.pathname).toBe('_.www.test.com')
})


it('test invalid hostname', () => {
  const r1 = validateUrl('testdotcom')
  expect(r1.isValid).toBe(false)
  const r2 = validateUrl('test..com')
  expect(r2.isValid).toBe(false)
})

it('test invalid  port', () => {
  const r4 = validateUrl('https://www.test.com:a0')
  expect(r4.isValid).toBe(false)
  const r5 = validateUrl('https://www.test.com:')
  expect(r5.isValid).toBe(false)
})

it('test invalid wildcard', () => {
  const r1 = validateUrl('http://*.*.test.com')
  expect(r1.isValid).toBe(false)
  const r2 = validateUrl('http://www.*.test.com')
  expect(r2.isValid).toBe(false)
  const r3 = validateUrl('http://*test.com')
  expect(r3.isValid).toBe(false)
})

it('test httpName for https', () => {
  expect(httpName(true)).toBe('https')
})

it('test httpName for http', () => {
  expect(httpName(false)).toBe('http')
})
