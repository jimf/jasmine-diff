const Jasmine = require('jasmine')
const TestReporter = require('./jasmine-test-reporter')

exports.runJasmine = function runJasmine (filename) {
  const jasmine = new Jasmine()
  let output = ''

  jasmine.loadConfig({
    spec_dir: __dirname,
    spec_files: [
      'failure*.js'
    ],
    helpers: [],
    stopSpecOnExpectationFailure: false,
    random: false
  })
  jasmine.configureDefaultReporter({
    timer: {
      start () {},
      elapsed () { return 0 }
    },
    print () {},
    showColors: false
  })
  jasmine.addReporter(new TestReporter({
    print (...args) {
      args.forEach(arg => {
        output += arg.toString()
      })
    }
  }))

  return new Promise(function (resolve) {
    jasmine.onComplete(() => {
      resolve(output)
    })
    jasmine.execute([`**/${filename}`])
  })
}
