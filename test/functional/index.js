const fs = require('fs')
const path = require('path')
const test = require('tape')
const { runJasmine } = require('./spec_util')

const tests = [
  {
    name: 'failure.js',
    showColors: false
  },
  {
    name: 'failure_colored.js',
    showColors: true
  },
  {
    name: 'failure_inline.js',
    showColors: true
  }
]

function runTests () {
  return tests.reduce(function (acc, testcase) {
    return acc.then(function (results) {
      return runJasmine(testcase.name).then(function (nextResult) {
        return [...results, nextResult]
      })
    })
  }, Promise.resolve([]))
}

function getFixturePath (filename) {
  return path.join(__dirname, `fixtures/${filename}.output`)
}

function runTape () {
  test('jasmine diff matchers failure output', t => {
    t.plan(tests.length)
    runTests().then(results => {
      results.forEach((actual, idx) => {
        const name = tests[idx].name
        const expected = fs.readFileSync(getFixturePath(name), 'utf8')
        t.equal(actual, expected, 'output for "' + name + '" matches expected output')
      })
    })
  })
}

function writeToFixtureFiles (results) {
  results.forEach(function (output, idx) {
    fs.writeFileSync(getFixturePath(tests[idx].name), output, 'utf8')
  })
}

function writeToStdout (results) {
  results.forEach(function (output) {
    console.log(output)
  })
}

if (require.main === module) {
  runTests().then(
    process.argv.includes('--update-fixtures')
      ? writeToFixtureFiles
      : writeToStdout
  )
} else {
  runTape()
}
