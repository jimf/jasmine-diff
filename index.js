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

function red (str) {
  return '\x1B[31m' + str + '\x1B[0m'
}

function green (str) {
  return '\x1B[32m' + str + '\x1B[0m'
}

function identity (x) {
  return x
}

/**
 * Return unified diff of actual vs expected.
 *
 * @param {*} actual Actual value
 * @param {*} expected Expected value
 * @param {function} formatAdd Addition formatter
 * @param {function} formatRem Removal formatter
 * @return {string}
 */
function unifiedDiff (actual, expected, formatAdd, formatRem) {
  return [
    formatAdd('+ expected'),
    formatRem('- actual'),
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
        return line[0] === '+' ? formatAdd(line) : formatRem(line)
      })
  )
  .join('\n')
}

/**
 * Return inline diff of actual vs expected.
 *
 * @param {*} actual Actual value
 * @param {*} expected Expected value
 * @param {function} formatAdd Addition formatter
 * @param {function} formatRem Removal formatter
 * @return {string}
 */
function inlineDiff (actual, expected, formatAdd, formatRem) {
  var result = diff.diffWordsWithSpace(stringify(actual), stringify(expected))
    .map(function (line, idx) {
      return line.added ? formatAdd(line.value)
        : line.removed ? formatRem(line.value)
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

  return formatRem('actual') + ' ' + formatAdd('expected') + '\n\n' + result
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
  var annotateAdd = opts.colors ? green : identity
  var annotateRemove = opts.colors ? red : identity
  var errorDiff = opts.inline ? inlineDiff : unifiedDiff

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
          '\n\n' + errorDiff(actual, expected, annotateAdd, annotateRemove) + '\n'

        return result
      }
    }
  }

  return {
    toEqual: toEqual
  }
}
