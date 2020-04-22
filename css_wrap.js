/*
 * css-wrap
 * https://github.com/benignware/css-wrap
 *
 * @See https://github.com/benignware/grunt-css-wrap
 *
 * Forked and enhanced
 * https://github.com/zanzamar/grunt-css-wrap
 *
 * Copyright (c) 2014 Rafael Nowrotek
 * Licensed under the MIT license.
 *
 * Copyright (c) 2014 Zanzamar
 *
 */
var
  path = require('path'),
  fs = require('fs'),
  css_parse = require('css-parse'),
  css_stringify = require('css-stringify'),
  processRules = function (list, options) {
    return list.map(function (r) {
      if (r.selectors) {
        r.selectors.forEach(function (s, index) {
          if (options.skip && options.skip.test(s)) return
          var selector = '';
          if (typeof options.selector === 'object' && options.selector.length) {
            var selectors = [];
            options.selector.forEach((sel) => selectors.push(sel ? (sel + " " + s + ", " + sel + s) : s));
            selector = selectors.join(", ");
          }
          else {
            selector = options.selector ? options.selector + " " + s : s;
          }
          r.selectors[index] = selector;
        });
      }
      if (r.type === "media") {
        r.rules = processRules(r.rules, options);
      }
      return r;
    });
  },
  css_wrap = function (string, options) {
    if (!options)
      options = { selector: '.css-merge', skip: null };
    if (!options.selector)
      options.selector = '.css-merge';
    if (!options.skip)
      options.skip = null;
    if (fs.existsSync(path.resolve(string))) {
      string = fs.readFileSync(string).toString();
    }
    var css = css_parse(string);
    css.stylesheet.rules = processRules(css.stylesheet.rules, options);
    return css_stringify(css);
  };
module.exports = css_wrap;