#!/usr/bin/env node

// TODO: package up as an NPM module so it can be -g installed and run from path with node

const fs = require('fs');
const path = require('path');
const args = require('args');

args
  .option('infile', 'Filename to read kindle quotes, default is quotes.txt', 'quotes.txt')
  .option('outfile', 'Filename to write JSON, default is quotes.json', 'quotes.json')
  .option('dirname', 'Path to write outfile to, default is pwd', __dirname)
  .option('no-reorder', 'Prevent re-ordering author names from "Surname, Name" to "Name Surname"');

const flags = args.parse(process.argv);

/////////////
// helpers //
/////////////

function stripBOM(str) { return str.replace(/[\u200B-\u200D\uFEFF]/g, ''); }
function parseTitle(str) { return str.match(/.+(?=\s\()/)[0]; }
function swapWords(w1, w2) { return `${w2} ${w1}`; }
function last(arr) { return arr[arr.length - 1]; }
function isEmpty(x) { return x === '' || x == null; }
function isDuplicate(a, b) { return a === b; }

/**
 * Reduce all occurrences of multiple spaces to a single space char.
 * So that '      ' becomes ' '
 * @param  {String} str
 * @return {String}
 */
function contractSpaces(str) { return str.replace(/\s{2,}/g, ' '); }

/**
 *  re-order names in the format of "surname, name" to "name surname"
 * @param  {String} str String containing more than one name
 * @return {String}     Re-ordered name
 */
function orderNames(str) { return /,/.test(str) ? swapWords(...str.split(/,\s?/)) : str; }

function parseAuthor(str) {
  // capture author names from string format: "Book title (maybe with parens) (AUTHOR NAMES)"
  const re = /(?:\((?!.*\())(.+)(?:\))/;

  // match names, and split any multiple authors delineated by ";" and format as Firstname Last
  let authors = str.match(re)[1].split(/;\s?/);
  if (!flags.n) authors = authors.map(orderNames);
  return authors.join(', ');
}

// TODO: use moment.js or roll-your-own date parsing into a proper JS Date() object.
function parseDate(str) {
  // kindle human readable dates follow 'on ' and end with ' HH:MM:SS'
  // NOTE: keep the time in string if parsing to a JS date
  const re = /\son\s(.*)(?=\s\d\d:)/;

  return str.match(re)[1];
}

function parseLine(prev, quote, index) {
  const [header, date, content] = quote.trim().split(/\s?\n\s?/);

  if (isEmpty(content) || prev.length && isDuplicate(content, last(prev).content)) return prev;

  return prev.concat({
    title: parseTitle(header),
    author: parseAuthor(header),
    date: parseDate(date),
    // Some of my quotes had huge chunks of spaces - probably from epub to mobi conversions?
    content: contractSpaces(content),
  });
}

function buildJSON(data) {
  // entries are separated with ============
  const kindleQuoteBreak = /={2,}/;
  const clippings = data.split(kindleQuoteBreak).reduce(parseLine, []);

  return JSON.stringify(clippings);
}


/////////////////////
// main logic here //
/////////////////////

fs.readFile(flags.infile, 'utf8', (err, data) => {
  if (err) throw err;

  const dest = path.join(flags.dirname, flags.outfile);
  const clippings = buildJSON(data);

  fs.writeFile(dest, clippings, (writeErr) => {
    if (writeErr) {
      throw writeErr;
    } else console.log(`Output quotes to ${dest}`);
  });
});
