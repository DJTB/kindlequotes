#!/usr/bin/env node

const fs = require('fs');
const util = require('util');
const path = require('path');
const args = require('args');
const { transformQuotes } = require('../src/utils');

const readAsync = util.promisify(fs.readFile);
const writeAsync = util.promisify(fs.writeFile);

args
  .option('infile', 'Filename to read from [Default: My Clippings.txt]', 'My Clippings.txt')
  .option('outfile', 'Filename to write to [Default: quotes.json]', 'quotes.json')
  .option('dirname', 'Path to write outfile to [Default: .]', process.cwd());

// TODO: optional stream output
// TODO: export transform function from src as main package entry for local install usage (as well as keeping CLI in bin for global)

const flags = args.parse(process.argv);
const outPath = path.join(flags.dirname, flags.outfile);

(async () => {
  try {
    const input = await readAsync(flags.infile, 'utf8');
    const output = transformQuotes(input);
    await writeAsync(outPath, JSON.stringify(output));
    console.log(`${output.length} entries processed to: ${outPath}`);
  } catch (err) {
    console.warn('Something went wrong...');
    console.error(err);
  }
})();
