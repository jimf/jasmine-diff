const test = require('tape')
const jasmineDiff = require('../..')

const createJasmineStub = (options = {}) => {
  const stub = {
    addMatchers: () => {},
    matchers: {
      toEqual: () => {
        return {
          compare: () => options.toEqualResult || { pass: true }
        }
      }
    },
    pp: arg => JSON.stringify(arg)
  }

  return stub
}

test('initialize', t => {
  t.throws(jasmineDiff, 'throws if not passed any args')
  t.throws(jasmineDiff.bind(null, {}), {}, 'throws if Jasmine arg does not have matchers')
  t.throws(jasmineDiff.bind(null, { matchers: {} }), {}, 'throws if required matchers cannot be found')

  const subject = jasmineDiff(createJasmineStub())
  t.deepEqual(Object.keys(subject), ['toEqual'], 'returns object with expected matchers')

  t.end()
})

test('toEqual', t => {
  let subject
  let actual

  subject = jasmineDiff(createJasmineStub())
  actual = subject.toEqual().compare({ foo: true }, { foo: true })
  t.deepEqual(actual, { pass: true }, 'does not modify passing results')

  subject = jasmineDiff(createJasmineStub({ toEqualResult: { pass: false } }))
  actual = subject.toEqual().compare(1, 2)
  t.deepEqual(actual, { pass: false }, 'does not specify result message if args are scalars')

  subject = jasmineDiff(createJasmineStub({ toEqualResult: { pass: false } }))
  actual = subject.toEqual().compare(1, [2])
  t.deepEqual(actual, { pass: false }, 'does not specify result message if only one arg is an array')

  subject = jasmineDiff(createJasmineStub({ toEqualResult: { pass: false } }))
  actual = subject.toEqual().compare(1, { foo: 2 })
  t.deepEqual(actual, { pass: false }, 'does not specify result message if only one arg is an object')

  subject = jasmineDiff(createJasmineStub({ toEqualResult: { pass: false } }))
  actual = subject.toEqual().compare([1], [2])
  t.ok((
    actual.pass === false &&
    actual.message.includes('+ expected') &&
    actual.message.includes('- actual')
  ), 'specifies result message if both args are diffable')
  t.ok(actual.message.match(/Expected \[2] to equal \[1]\./), 'diff message also includes default message')

  subject = jasmineDiff(createJasmineStub({ toEqualResult: { pass: false, message: 'Custom error message' } }))
  actual = subject.toEqual().compare([1], [2])
  t.ok((
    actual.pass === false &&
    actual.message.includes('Custom error message') &&
    !actual.message.match(/Expected \[2] to equal \[1]\./) &&
    actual.message.includes('+ expected') &&
    actual.message.includes('- actual')
  ), 'uses custom error message along with diff if custom message is specified')

  subject = jasmineDiff(createJasmineStub({ toEqualResult: { pass: false } }), { colors: true })
  actual = subject.toEqual().compare([1], [2])
  t.ok((
    actual.pass === false &&
    actual.message.includes('\x1B[32m+ expected\x1B[0m') &&
    actual.message.includes('\x1B[31m- actual\x1B[0m')
  ), 'colorizes output when colors:true is specified')

  subject = jasmineDiff(createJasmineStub({ toEqualResult: { pass: false } }), { inline: true })
  actual = subject.toEqual().compare({ foo: 'bar' }, { foo: 'baz' })
  t.ok((
    actual.pass === false &&
    actual.message.includes('actual expected') &&
    actual.message.includes('"foo": "barbaz"')
  ), 'outputs inline diff when inline:true is specified')

  subject = jasmineDiff(createJasmineStub({ toEqualResult: { pass: false } }), { inline: true })
  actual = subject.toEqual().compare({ a: 1, b: 2, c: 3 }, { a: 1, b: 2, c: '3po' })
  t.ok((
    actual.pass === false &&
    actual.message.includes('actual expected') &&
    actual.message.includes('4 |   "c": 3"3po"')
  ), 'adds line numbers to inlne diff output when diff exceeds 4 lines')

  subject = jasmineDiff(createJasmineStub({ toEqualResult: { pass: false } }), { inline: true })
  actual = subject.toEqual().compare('0123456789'.split(''), '0123456780'.split(''))
  t.ok((
    actual.pass === false &&
    actual.message.includes('actual expected') &&
    actual.message.includes(' 9 |   "7",') &&
    actual.message.includes('10 |   "8",') &&
    actual.message.includes('11 |   "90"')
  ), 'pads line numbers correctly when inline diff exceeds 10+ lines')

  t.end()
})
