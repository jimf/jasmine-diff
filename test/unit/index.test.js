const test = require('tape')
const jasmineDiff = require('../..')

test('initialize', t => {
  t.throws(jasmineDiff, 'throws if not passed any args')
  t.throws(jasmineDiff.bind(null, {}), {}, 'throws if Jasmine arg does not have matchers')
  t.throws(jasmineDiff.bind(null, { matchers: {} }), {}, 'throws if required matchers cannot be found')
  t.end()
})
