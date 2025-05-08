#!/usr/bin/env node
const cr = require('complexity-report');
const fs = require('node:fs');
const script = fs.readFileSync(`${__dirname}/../luaparse.js`, 'utf-8');
const args = process.argv.slice(2);
let threshold = 10;
const options = { logicalor: false, switchcase: false };

// biome-ignore lint/complexity/noForEach: <explanation>
args.forEach((arg) => {
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  if (/-l/.test(arg)) return options.logicalor = true;
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  if (/-w/.test(arg)) return options.switchcase = true;
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  if (/-i/.test(arg)) return options.forin = true;
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  if (/-c/.test(arg)) return options.trycatch = true;
  if (arg >= 0) threshold = arg;
});

// biome-ignore lint/complexity/noForEach: <explanation>
cr.run(script, options).functions
  .map((fn) => ({ name: fn.name, value: fn.complexity.cyclomatic }))
  .sort((a, b) => b.value - a.value)
  .forEach((fn) => {
    if (fn.value >= threshold) console.log(`${fn.name}(): ${fn.value}`);
  });

