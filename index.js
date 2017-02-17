var diff = require('diff')
var jsonStringify = require('json-stable-stringify')

/**
 * Return whether value is an array.
 *
 * @param {*} val Value to test
 * @return {boolean}
 */
function isArray (val) {
  return Object.prototype.toString.call(val) === '[object Array]'
}

/**
 * Return whether value is an object.
 *
 * @param {*} val Value to test
 * @return {boolean}
 */
function isObject (val) {
  var type = typeof val
  return type === 'function' || type === 'object' && !!val
}

/**
 * Return whether value should be diffed.
 *
 * @param {*} val Value to test
 * @return {boolean}
 */
function isDiffable (val) {
  return isObject(val) || isArray(val)
}

/**
 * Deterministically stringify value.
 *
 * @param {*} val Value to stringify
 * @return {string}
 */
function stringify (val) {
  return jsonStringify(val, { space: 2 })
}

/**
 * Return unified diff of actual vs expected.
 *
 * @param {*} actual Actual value
 * @param {*} expected Expected value
 * @return {string}
 */
function errorDiff (actual, expected) {
  return [
    '+ expected',
    '- actual',
    ''
  ]
  .concat(
    diff.createPatch('string', stringify(actual), stringify(expected))
      .split('\n')
      .slice(4)
      .filter(function (line) {
        return line[0] === '+' || line[0] === '-'
      })
  )
  .join('\n')
}

/**
 * Jasmine Diff Matchers
 *
 * Main export. Returns jasmine matchers for overriding default functionality
 * to include additional error diffs where it makes sense.
 *
 * @param {object} j$ Jasmine instance
 * @return {object}
 */
module.exports = function jasmineDiffMatchers (j$) {
  if (!(j$ && j$.matchers && j$.addMatchers && j$.matchers.toEqual)) {
    throw new Error('Jasmine Diff Matchers must be initialized with Jasmine v2 instance')
  }

  var origToEqual = j$.matchers.toEqual

  function toEqual (util, customEqualityTesters) {
    function defaultMessage (actual, expected) {
      return 'Expected ' + j$.pp(expected) + ' to equal ' + j$.pp(actual) + '.'
    }

    return {
      compare: function (actual, expected) {
        var result = origToEqual(util, customEqualityTesters).compare(actual, expected)

        if (result.pass || !(isDiffable(actual) && isDiffable(expected))) {
          return result
        }

        result.message = (result.message || defaultMessage(actual, expected)) +
          '\n\n' + errorDiff(actual, expected) + '\n'

        return result
      }
    }
  }

  return {
    toEqual: toEqual
  }
}
