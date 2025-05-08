#!/usr/bin/env node

const Benchmark = require('benchmark');
let luaparse = require('../luaparse');
const fs = require('node:fs');
const path = require('node:path');
const files = process.argv.slice(2);
const suites = {};
const suite = new Benchmark.Suite();
let verbose = false;
let minSamples = 5;
let minTime = 0;

// biome-ignore lint/complexity/noForEach: <explanation>
files.forEach((file) => {
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  if (/^-v|--verbose/.test(file)) return verbose = true;
  if (/^--samples=/.test(file)) {
    minSamples = file.replace(/^--samples=/, '');
    return;
  }
  if (/^--minTime=/.test(file)) {
    minTime = file.replace(/^--minTime=/, '');
    return;
  }
  if (/^--luaparse=/.test(file)) {
    luaparse = require(file.replace(/^--luaparse=/, ''));
    return;
  }

  if (!fs.existsSync(file)) suites[path.basename(file)] = file;
  else suites[file] = fs.readFileSync(file, 'utf8');
});

if (!files.length || !Object.keys(suites).length) {
  console.log("Usage:\n\tbenchmark [snippet|file]...");
  console.log("Flags:\n\t-v|--verbose\n\t--samples=\n\t--minTime=");
  process.exit(1);
}

// biome-ignore lint/complexity/noForEach: <explanation>
Object.keys(suites).forEach((file) => {
  const source = suites[file];
  const settingsSets = {
      'defaults': { },
      'scope: true': { scope: true },
      'comments: false': { comments: false },
      'locations: true': { locations: true }
    };

  // biome-ignore lint/complexity/noForEach: <explanation>
  Object.keys(settingsSets).forEach((set) => {
    suite.add(`${file} ${set}`, () => {
      luaparse.parse(source, settingsSets[set]);
    }, { minSamples: minSamples, minTime: minTime });
  });
});

suite.on('cycle', (event) => {
  const stats = event.target.stats;
  const mean = (stats.mean * 1000).toFixed(4);
  const variance = (stats.variance * 1000 * 1000).toFixed(4);

  if (verbose) console.log(`${String(event.target)} (${mean}ms)`);
  else console.log(`${mean}\t${variance}`);
});
suite.run();

/* vim: set sw=2 ts=2 et tw=80 ft=javascript : */
