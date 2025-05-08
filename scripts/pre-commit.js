#!/usr/bin/env node

const spawn = require('node:child_process').spawn;

run('npm run-script quality-assurance');

function run(args) {
  args = args.split(' ');
  const cmd = args.shift();
  const ch = spawn(cmd, args);
  ch.stdout.pipe(process.stdout);
  ch.stderr.pipe(process.stderr);
  ch.on('exit', (code) => {
    if (code) process.exit(code);
    ch.emit('next');
  });
  return ch;
}

/* vim: set sw=2 ts=2 et tw=80 ft=javascript : */
