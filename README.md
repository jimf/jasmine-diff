# Jasmine Diff Matchers

Decorate default [Jasmine][] matchers to provide additional diff output in
error messages.

[![npm Version][npm-badge]][npm]
[![Build Status][build-badge]][build-status]
[![Test Coverage][coverage-badge]][coverage-result]
[![Dependency Status][dep-badge]][dep-status]

_Work in progress._

__Jasmine Diff Matchers__ takes the standard Jasmine matchers and decorates
them, adding diff output where it makes sense, i.e., when comparing objects and
arrays where noticing differences by eye with the standard Jasmine output can
be cumbersome. By tackling this problem directly at the matcher level, this
plugin should be compatible with all of your favorite Jasmine reporters.

## Installation

Install using [npm][]:

    $ npm install jasmine-diff-matchers --save-dev

## Usage

Integrate the matchers with your test environment (currently only Jasmine 2.x
supported):

```js
beforeEach(function () {
  jasmine.addMatchers(require('jasmine-diff-matchers')(jasmine, {
    // Specify options here
  }))
})
```

## Available Options

#### `colors` (boolean, default: `false`)

Enables colored diff output.

## License

MIT

[build-badge]: https://img.shields.io/travis/jimf/karma-min-reporter/master.svg
[build-status]: https://travis-ci.org/jimf/karma-min-reporter
[npm-badge]: https://img.shields.io/npm/v/karma-min-reporter.svg
[npm]: https://www.npmjs.org/package/karma-min-reporter
[coverage-badge]: https://img.shields.io/coveralls/jimf/karma-min-reporter.svg
[coverage-result]: https://coveralls.io/r/jimf/karma-min-reporter
[dep-badge]: https://img.shields.io/david/jimf/karma-min-reporter.svg
[dep-status]: https://david-dm.org/jimf/karma-min-reporter
[Jasmine]: https://jasmine.github.io/
