/**
 * Minimal test reporter that is mostly interested in collecting failure messages.
 */
module.exports = function (options) {
  const print = (options && options.print) || process.stdout.write.bind(process.stdout)
  let specCount
  let failureCount
  let failedSpecs = []

  this.jasmineStarted = function () {
    specCount = 0
    failureCount = 0
    print('Started\n')
  }

  this.jasmineDone = function () {
    print('\n')
    if (failedSpecs.length) {
      print('\nFailures:\n')
      failedSpecs.forEach(function (result, idx) {
        print(`${idx + 1}) ${result.fullName}`)
        result.failedExpectations.forEach(function (expected) {
          print('\n')
          print(expected.message)
        })
        print('\n')
      })
    }

    print(`${specCount} spec(s) / ${failureCount} failure(s)\n`)

    if (options && options.onComplete) {
      options.onComplete(failureCount === 0)
    }
  }

  this.specDone = function (result) {
    specCount += 1

    if (result.status === 'failed') {
      failureCount += 1
      failedSpecs.push(result)
      print('F')
    } else {
      print('.')
    }
  }

  return this
}
