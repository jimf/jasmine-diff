/* global jasmine, describe, beforeEach, it, expect */
var jasmineDiff = require('../../')
var jasmineDiffMatchers = jasmineDiff(jasmine, { colors: true })

describe('Jasmine Diff Matchers', function () {
  beforeEach(function () {
    jasmine.addMatchers(jasmineDiffMatchers)
  })

  describe('toEqual', function () {
    it('should show diff with colors', function () {
      expect({ foo: 'foo', bar: 'bar' }).toEqual({ foo: 'foo', baz: 'baz' })
    })
  })
})
