const fs = require('fs')
const path = require('path')
const spawn = require('cross-spawn')
const test = require('tape')

test('jasmine diff matchers failure output', t => {
  t.plan(3)

  function normalizeOutput (str) {
    return str
      .replace(/\d+ secs/g, 'XXX secs')
      .replace(/(Linux|Mac OS X)/g, 'Host OS')
      .replace(/\/[a-zA-Z0-9_\-/]+\.(js|browserify)/g, '/NORMALIZED_PATH')
  }

  const tests = [
    'karma.conf.js',
    'karma.conf.colors.js',
    'karma.conf.inline.js'
  ]

  tests.forEach(function (configFilename) {
    const actual = spawn.sync('karma', [
      'start',
      'test/functional/' + configFilename
    ]).stdout.toString()
    const expected = fs.readFileSync(path.join(__dirname, 'fixtures', configFilename + '.output'), 'utf8')
    t.equal(normalizeOutput(actual), normalizeOutput(expected),
      'output for ' + configFilename + ' matches expected output')
  })

  t.end()
})
