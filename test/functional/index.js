const spawn = require('cross-spawn')
const test = require('tape')

test('jasmine diff matchers failure output', t => {
  const result = spawn.sync('karma', [
    'start',
    'test/functional/karma.conf.js'
  ]).stdout.toString().replace(/\t/g, '        ').replace(/^\s+$/gm, '')

  t.ok(result.includes('(20 FAILED)'), 'covers expected number of failure cases')

  const numDiffs = result
    .split('\n')
    .filter(line => line.includes('+ expected'))
    .length
  t.equal(numDiffs, 10, 'selectively displays diff output based on actual/expected values')

  t.ok(result.includes(`
        + expected
        - actual

        -The quick brown fox jumped over the lazy dog
        +The quick black cat hissed at the lazy dog
  `.trim()), 'displays diff output for long strings')

  t.ok(result.includes(`
        + expected
        - actual

        -The quick brown fox
        -jumped over the lazy dog
        +The quick black cat
        +hissed at the lazy dog
  `.trim()), 'displays diff output for multiline strings')

  t.ok(result.includes(`
        Expected [ 1, 2, 3, 4 ] to equal [ 1, 2, 3 ].

        + expected
        - actual

        +  4
  `.trim()), 'displays diff output for arrays')

  t.ok(result.includes(`
        Expected Object({ foo: 'foo', baz: 'baz' }) to equal Object({ foo: 'foo', bar: 'bar' }).

        + expected
        - actual

        -  'bar': 'bar'
        +  'baz': 'baz'
  `.trim()), 'displays diff output for objects')

  t.equal((result.match(/not to equal/g) || []).length, 4, 'omits diffs for .not negations')

  t.ok(result.includes(`
        + expected
        - actual

        -{}
        +{
        +  'a': null
        +  'b': undefined
        +  'c': 1
        +  'd': -1
        +  'e': 'a'
        +  'f': Function
        +  'g': /[aeiou]/
        +  'h': []
        +  'i': [
        +    1
        +    2
        +    3
        +  ]
        +  'j': [
        +    [
        +      1
        +    ]
        +    [
        +      2
        +      3
        +    ]
        +  ]
        +  'k': {}
        +  'l': {
        +    'a': 1
        +    'b': 2
        +    'c': 3
        +  }
        +  'm': {
        +    'a': {
        +      'b': {
        +        'c': 1
        +      }
        +    }
        +  }
        +}
  `.trim()), 'properly stringifies values')

  t.end()
})

test('jasmine diff with colors enabled', t => {
  const result = spawn.sync('karma', [
    'start',
    'test/functional/karma.conf.colors.js'
  ]).stdout.toString().replace(/\t/g, '        ').replace(/^\s+$/gm, '')

  t.ok(result.includes(`
        \x1B[32m+ expected\x1B[0m
        \x1B[31m- actual\x1B[0m

        \x1B[31m-  'bar': 'bar'\x1B[0m
        \x1B[32m+  'baz': 'baz'\x1B[0m
  `.trim()), 'displays diff output with color')

  t.end()
})

test('jasmine diff with inline mode enabled', t => {
  const result = spawn.sync('karma', [
    'start',
    'test/functional/karma.conf.inline.js'
  ]).stdout.toString().replace(/\t/g, '        ').replace(/^\s+$/gm, '')

  t.ok(result.includes(`
        \x1B[31mactual\x1B[0m \x1B[32mexpected\x1B[0m

        {
          'bar': '\x1B[31mbar\x1B[0m\x1B[32mbaz\x1B[0m'
          'foo': 'foo'
        }
  `.trim()), 'displays inline diffs')

  t.ok(result.includes(`
        \x1B[31mactual\x1B[0m \x1B[32mexpected\x1B[0m

        1 | {
        2 |   'bar': 'bar'
        3 |   'baz': '\x1B[31mqux\x1B[0m\x1B[32mbaz\x1B[0m'
        4 |   'foo': 'foo'
        5 | }
  `.trim()), 'shows line numbers when diff exceeds 4 lines')

  t.end()
})
