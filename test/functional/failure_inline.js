/* global jasmine, describe, beforeEach, it, expect */
var jasmineDiff = require('../../')
var jasmineDiffMatchers = jasmineDiff(jasmine, { colors: true, inline: true })

describe('Jasmine Diff Matchers', function () {
  beforeEach(function () {
    jasmine.addMatchers(jasmineDiffMatchers)
  })

  describe('toEqual', function () {
    it('should show inline diff with colors', function () {
      expect({ foo: 'foo', bar: 'bar' }).toEqual({ foo: 'foo', bar: 'baz' })
    })

    it('should include line numbers when diff exceeds 4 lines', function () {
      expect({ foo: 'foo', bar: 'bar', baz: 'qux' }).toEqual({ foo: 'foo', bar: 'bar', baz: 'baz' })
    })
  })
})
