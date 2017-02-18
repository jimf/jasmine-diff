# Jasmine Diff

Decorate default [Jasmine][] matchers to provide additional diff output in
error messages.

[![npm Version][npm-badge]][npm]
[![Build Status][build-badge]][build-status]
[![Test Coverage][coverage-badge]][coverage-result]
[![Dependency Status][dep-badge]][dep-status]

__Jasmine Diff__ takes the standard Jasmine matchers and decorates them, adding
diff output where it makes sense, i.e., when comparing objects and arrays where
noticing differences by eye with the standard Jasmine output can be cumbersome.
By tackling this problem directly at the matcher level, this plugin should be
compatible with all of your favorite Jasmine reporters.

## Installation

Install using [npm][]:

    $ npm install jasmine-diff --save-dev

## Usage

Integrate the matchers with your test environment (currently only Jasmine 2.x
supported):

```js
beforeEach(function () {
  jasmine.addMatchers(require('jasmine-diff')(jasmine, {
    // Specify options here
  }))
})
```

## Available Options

#### `colors` (boolean, default: `false`)

Enables colored diff output.

#### `inline` (boolean, default: `false`)

Display inline diffs (best paired with `colors:true`).

## License

MIT

[build-badge]: https://img.shields.io/travis/jimf/jasmine-diff/master.svg
[build-status]: https://travis-ci.org/jimf/jasmine-diff
[npm-badge]: https://img.shields.io/npm/v/jasmine-diff.svg
[npm]: https://www.npmjs.org/package/jasmine-diff
[coverage-badge]: https://img.shields.io/coveralls/jimf/jasmine-diff.svg
[coverage-result]: https://coveralls.io/r/jimf/jasmine-diff
[dep-badge]: https://img.shields.io/david/jimf/jasmine-diff.svg
[dep-status]: https://david-dm.org/jimf/jasmine-diff
[Jasmine]: https://jasmine.github.io/
