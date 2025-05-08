#!/usr/bin/env node

const fs = require('node:fs');
const luaparse = require('../luaparse');
const indent = '  ';
let verbose = true;
let testName;
const snippets = [];
const notifications = [];
const intro = [
      "(function (root, name, factory) {"
    , "  'use strict';"
    , ""
    , "  var freeExports = typeof exports === 'object' && exports"
    , "    , freeModule = typeof module === 'object' && module && module.exports === freeExports && module"
    , "    , freeGlobal = typeof global === 'object' && global;"
    , "  if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) root = freeGlobal;"
    , ""
    , "  if (typeof define === 'function' && define.amd) define(['exports'], factory);"
    , "  else if (freeExports && !freeExports.nodeType) {"
    , "    if (freeModule) factory(freeModule.exports);"
    , "    else factory(freeExports);"
    , "  }"
    , "  else factory((root[name] = {}));"
    , "}(this, '%NAME%', function (exports) {"
    , "  'use strict';"
    , ""
    , "  exports.name = '%NAME%';"
    , "  exports.spec = "
  ].join('\n');
  const outro = [
      ";"
    , "}));"
  ].join('\n');


// Scaffold content of a test file. If no test name is specified, simply return
// the tests as objects.
function scaffoldFile() {
  // Scaffold the test
  let expected = JSON.stringify(scaffoldTest(), null, indent);
  let firstline;
  if (!testName) return expected;

  // The frist line should not be indented so we separate it from the result.
  expected = expected.split('\n');
  firstline = expected.splice(0, 1);
  expected = expected.join('\n');

  /* silence lint warnings */
  expected = expected.replace(/[\x7f-\x9f]/g, (c) => '\\u00' + c.charCodeAt(0).toString(16));

  return `${intro.replace(/%NAME%/g, testName) +
    firstline}\n${expected.replace(/^([\s\S])/gm, `${indent}$1`)}${outro}`;
}

// Scaffold the test
function scaffoldTest() {
  const output = [];
  const defaultOptions = { comments: true, locations: true, ranges: true, scope: true };
  let options = defaultOptions;

  // Iterate over all snippets and generate their tests.
  // biome-ignore lint/complexity/noForEach: <explanation>
    snippets.forEach((snippet) => {
    // Lines containing ^//{...}$ are luaparse options, use them.
    // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        // biome-ignore lint/correctness/noInvalidUseBeforeDeclaration: <explanation>
                if (result = /^\/\/\s*(\{[\s\S]+\})\s*$/.exec(snippet)) {
      options = Object.assign({}, options, JSON.parse(result[1]), defaultOptions);
      return;
    }
    // Skip lines beginning with `//` and that are not option objects.
    if (/^\/\//.test(snippet)) return;

    // Interpret "@@" escapes.
    snippet = snippet.replace(/@(.)@/g, (_m, s) => ({ 'n': '\n'
              , 'r': '\r'
              , 't': '\t'
              , 'f': '\f'
              , 'v': '\v'
              , 'b': '\b'
              })[s] || s);

    // Generate the assertion.
    var result = scaffoldTestAssertion(snippet, options);

    // Remove the trailing FAIL flag as this will later be parsed as is by the
    // test suite. To identify failing tests we will check the type of the
    // expected result, an object is an assertion, while a string is a thrown
    // error.
    snippet = snippet.replace(/\s*-- FAIL\s*$/, '');

    const testcase = {
      source: snippet,
      result: result
    };

    if (options !== defaultOptions)
      testcase.options = Object.assign({}, options);
    output.push(testcase);
  });

  return output;
}

// Scaffold a test case.
function scaffoldTestAssertion(snippet, options) {
  const name = snippet; // Store the original name with the FAIL flag.;
  let expected;
  let success = true;

  if (/-- FAIL\s*$/.test(snippet)) {
    snippet = snippet.replace(/\s*-- FAIL\s*$/, '');
    try {
      luaparse.parse(snippet, options);
      // For some reason it didnt throw a error.
      notifications.push(`\x1B[33mExpected failure: \x1B[0m${name}`);
    } catch (exception) {
      if (!(exception instanceof luaparse.SyntaxError))
        throw exception;
      expected = exception.message;
    }
  } else {
    try {
      expected = luaparse.parse(snippet, options);
    } catch (exception) {
      if (!(exception instanceof luaparse.SyntaxError))
        throw exception;
      notifications.push(`\x1B[31m${exception}:\x1B[0m ${name}`);
      success = false;
    }
  }

  if (verbose && !success) return '';

  return expected;
}

// Main ---------------------------------------------------

const args = process.argv.splice(2);

if (!args.length) {
  console.log([
      "Usage:"
    , "\tscaffold-test [snippet|file]..."
    , "\tscaffold-test \"locale foo = \\\"bar\\\"\""
    , "\tscaffold-test ./tests"
    , "\nOptions:"
    , "\t--ignore-errors"
    , "\t--name=<NAME>"
  ].join('\n'));
  return;
}

let previous;
args.forEach((arg, _index) => {
  if (/^--ignore-errors/.test(arg)) return verbose = false;

  // Argument flags
  if (/^--name=/.test(arg)) {
    testName = arg.replace(/^--name=/, '');
    return;
  }

  // Snippet
  if (!fs.existsSync(arg)) {
    snippets.push(arg);
  }
  // File
  else {
    // biome-ignore lint/complexity/noForEach: <explanation>
    fs.readFileSync(arg, 'utf8')
      .split("\n")
      .forEach((snippet) => {
        if (!snippet.length) return;
        snippets.push(snippet.replace(/\n$/, ''));
      });
  }
  return;
});

console.log(scaffoldFile());

if (verbose && notifications.length) {
  console.warn("\nNotices: \n-----------------------------");
  // biome-ignore lint/complexity/noForEach: <explanation>
  notifications.forEach((notice) => {
    console.warn(notice);
  });
}

/* vim: set sw=2 ts=2 et tw=80 ft=javascript : */
