/* global jasmine, describe, beforeEach, it, expect */
var jasmineDiff = require('../../')
var jasmineDiffMatchers = jasmineDiff(jasmine)

describe('Jasmine Diff Matchers', function () {
  beforeEach(function () {
    jasmine.addMatchers(jasmineDiffMatchers)
  })

  describe('toEqual', function () {
    it('should omit diff when comparing null/undefined', function () {
      expect(null).toEqual(undefined)
    })
    it('should omit diff when comparing scalars', function () {
      expect(42).toEqual(true)
    })
    it('should show diff when comparing arrays', function () {
      expect([1, 2, 3]).toEqual([1, 2, 3, 4])
    })
    it('should show diff when comparing objects', function () {
      expect({ foo: 'foo', bar: 'bar' }).toEqual({ foo: 'foo', baz: 'baz' })
    })
  })

  describe('not.toEqual', function () {
    it('should omit diff when comparing null/undefined', function () {
      expect(null).not.toEqual(null)
    })
    it('should omit diff when comparing scalars', function () {
      expect(42).not.toEqual(42)
    })
    it('should show diff when comparing arrays', function () {
      expect([1, 2, 3]).not.toEqual([1, 2, 3])
    })
    it('should show diff when comparing objects', function () {
      expect({ foo: 'foo', bar: 'bar' }).not.toEqual({ foo: 'foo', bar: 'bar' })
    })
  })
})
