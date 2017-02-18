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

function lpad (str, width) {
  while (String(str).length < width) {
    str = ' ' + str
  }
  return str
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
module.exports = function jasmineDiffMatchers (j$, options) {
  if (!(j$ && j$.matchers && j$.addMatchers && j$.matchers.toEqual)) {
    throw new Error('Jasmine Diff Matchers must be initialized with Jasmine v2 instance')
  }

  var origToEqual = j$.matchers.toEqual
  var opts = {
    colors: options && options.colors === true,
    inline: options && options.inline === true
  }

  function red (str) {
    return opts.colors ? '\x1B[31m' + str + '\x1B[0m' : str
  }

  function green (str) {
    return opts.colors ? '\x1B[32m' + str + '\x1B[0m' : str
  }

  /**
   * Return unified diff of actual vs expected.
   *
   * @param {*} actual Actual value
   * @param {*} expected Expected value
   * @return {string}
   */
  function unifiedDiff (actual, expected) {
    return [
      green('+ expected'),
      red('- actual'),
      ''
    ]
    .concat(
      diff.createPatch('string', stringify(actual), stringify(expected))
        .split('\n')
        .slice(4)
        .filter(function (line) {
          return line[0] === '+' || line[0] === '-'
        })
        .map(function (line) {
          return line[0] === '+' ? green(line) : red(line)
        })
    )
    .join('\n')
  }

  /**
   * Return inline diff of actual vs expected.
   *
   * @param {*} actual Actual value
   * @param {*} expected Expected value
   * @return {string}
   */
  function inlineDiff (actual, expected) {
    var result = diff.diffWordsWithSpace(stringify(actual), stringify(expected))
      .map(function (line, idx) {
        return line.added ? green(line.value)
          : line.removed ? red(line.value)
          : line.value
      })
      .join('')

    var lines = result.split('\n')
    if (lines.length > 4) {
      result = lines
        .map(function (line, idx) {
          return lpad(idx + 1, String(lines.length).length) + ' | ' + line
        })
        .join('\n')
    }

    return red('actual') + ' ' + green('expected') + '\n\n' + result
  }

  function errorDiff (actual, expected) {
    return opts.inline ? inlineDiff(actual, expected) : unifiedDiff(actual, expected)
  }

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
