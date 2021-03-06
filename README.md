# css-wrap

> Wrap CSS rules in a namespace

## Install

```shell
npm install grunt-css-wrap --save-dev
```

## Usage

`csswrap(string|file, options)`

```js
var
  css_wrap = require('css-wrap'),
  output = css_wrap('.some-css-selector { background: green; }', {
    selector: '.my-app'
  });
console.log(output)
// .my-app .some-css-selector {
//   background: green;
// }
```

## Options

#### options.selector
Type: `String`
Default value: `.css-wrap`

Provide a namespace selector in which to wrap CSS.

#### options.skip
Type: `Regular expression`
Default value: `null`

Skip css rules by regular expressions

## Changelog

v0.0.1 - Initial Release
v0.0.2 - Added options.skip