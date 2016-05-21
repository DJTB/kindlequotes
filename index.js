#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const args = require('args');

args
  .option('infile', 'Filename to read kindle quotes, default is quotes.txt', 'quotes.txt')
  .option('outfile', 'Filename to write JSON, default is quotes.json', 'quotes.json')
  .option('dirname', 'Path to write outfile to, default is pwd', __dirname)
  .option('formatnames',
    'Boolean to re-order author names from "Surname, Name" to "Name Surname, default true"', true);

const flags = args.parse(process.argv);

/////////////
// helpers //
/////////////

function stripBOM(str) { return str.replace(/[\u200B-\u200D\uFEFF]/g, ''); }
function parseTitle(str) { return stripBOM(str).match(/.+(?=\s\()/)[0]; }
function swapWords(w1, w2) { return `${w2} ${w1}`; }
function last(arr) { return arr[arr.length - 1]; }
function isEmptyOrDuplicateOf(a, b) { return a == null || a === '' || a === b; }

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
  if (flags.formatnames) authors = authors.map(orderNames);
  return authors.join(', ');
}

function parseDate(str) {
  // kindle human readable dates follow 'on ' and end with ' HH:MM:SS'
  const re = /\son\s(.*)(?=\s\d\d:)/;

  return str.match(re)[1];
}

function parseLine(prev, quote, index) {
  const [header, date, content] = quote.trim().split(/\s?\n\s?/);

  if (prev.length && isEmptyOrDuplicateOf(content, last(prev).content)) return prev;

  return prev.concat({
    title: parseTitle(header),
    author: parseAuthor(header),
    date: parseDate(date),
    // Some of my quotes had huge chunks of spaces - probably from epub to mobi conversions?
    content: contractSpaces(content),
  });
}


/////////////////////
// main logic here //
/////////////////////

fs.readFile(flags.infile, 'utf8', (err, data) => {
  if (err) throw err;

  const dest = path.join(flags.dirname, flags.outfile);
  const kindleQuoteBreak = /={2,}/;

  let quotes = data.split(kindleQuoteBreak)
                   .slice(1, -1)
                   .reduce(parseLine, []);

  fs.writeFile(dest, JSON.stringify(quotes), (writeErr) => {
    if (writeErr) {
      throw writeErr;
    } else console.log(`Output quotes to ${dest}`);
  });
});
