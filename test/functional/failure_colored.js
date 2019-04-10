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

  describe('toHaveBeenCalledWith', function () {
    it('should show diff of arguments', function () {
      const spy = jasmine.createSpy('test')

      spy({
        just: {
          call: ['0118999', 88199, 9119725, 3]
        }
      })

      spy({
        just: {
          call: [911]
        }
      })

      expect(spy).toHaveBeenCalledWith({
        just: {
          call: [false, true, 0, 1]
        }
      })
    })
  })
})
