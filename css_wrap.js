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
  get_rule = function (sel, s) {
    if (typeof sel === 'object') {
      var ret = [];
      if (sel.sibling && (/:/.test(s) === false)) {
        if (/^\./.test(sel.text) && /^\./.test(s) ||
          /^#/.test(sel.text) && /^[#\.]/.test(s) ||
          /^[^#.]/.test(sel.text) && /^[#.]/.test(s)) {
          ret.push(sel.text + s);
        }
        else if (/^[#.]/.test(sel.text) && /^[^#.]/.test(s) ||
          /^\./.test(sel.text) && /^#/.test(s)) {
          ret.push(s + sel.text);
        }
      }
      if (/^body|html/g.test(s) === false) {
        ret.push(sel.text + ' ' + s);
      }
      else {
        var parts = s.split(" ");
        if (parts.length > 1) {
          var bodyOrHtmlPart = parts[0];
          var otherParts = parts.filter((part, index) => index !== 0).join(" ");
          ret.push(bodyOrHtmlPart + ' ' + sel.text + ' ' + otherParts);
        }
        // } else if (parts.length === 1) {
        //   // ret.push(sel.text);
        //   if(/^body|html$/.test(s) === false)
        //   ret.push(s + ' ' + sel.text);
        // }
        else {
          ret.push(s + ' ' + sel.text)
        }
      }
      if (ret.length > 0)
        return ret.join(', ');
      else
        return '';
    }
    else {
      if (/^body|html/g.test(s) === false) {
        return (sel + ' ' + s);
      }
      else {
        return (s + ' ' + sel);
      }
    }
  },
  processRules = function (list, options) {
    return list.map(function (r) {
      if (r.selectors) {
        r.selectors.forEach(function (s, index) {
          if (options.skip && options.skip.test(s)) return
          var selector = '';
          if (typeof options.selector === 'object' && options.selector.length) {
            var selectors = [];
            options.selector.forEach((sel) => {
              if (typeof sel === 'object' && sel.text) {
                if (sel.regex && sel.regex.test(s)) {
                  selectors.push(get_rule(sel, s))
                }
                else if (sel.regex) { }
                else {
                  selectors.push(get_rule(sel, s));
                }
              } else if (typeof sel === 'string') {
                selectors.push(get_rule(sel, s));
              }
              else {
                throw "text property must be defined";
              }
            });
            selector = selectors.filter((sel) => sel && sel.length > 0).join(", ");
          }
          else {
            selector = get_rule(options.selector, s);
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