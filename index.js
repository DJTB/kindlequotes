#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const args = require('args');
const moment = require('moment');

args
  .option('infile', 'Filename to read from [Default: My Clippings.txt]', 'My Clippings.txt')
  .option('outfile', 'Filename to write to [Default: quotes.json]', 'quotes.json')
  .option('dirname', 'Path to write outfile to [Default: ./]', __dirname)
  .option('no-reorder', 'Prevent re-ordering author names from "Surname, Name" to "Name Surname"');

const flags = args.parse(process.argv);

/////////////
// helpers //
/////////////

function stripBOM(str) { return str.replace(/[\u200B-\u200D\uFEFF]/g, ''); }
function swapWords(w1, w2) { return `${w2} ${w1}`; }
function last(arr) { return arr.length && arr[arr.length - 1]; }
function isEmpty(x) { return x === '' || x == null; }
function isSame(a, b) { return a === b; }
function isHighlight(str) { return str.match(/Your\s(\w+)\b/)[1] === 'Highlight'; }
// for mid-sentence quotes
function prependEllipsis(str) { return /[a-z]/.test(str[0]) ? `…${str}` : str; }

function smartQuotes(str) {
  return str
  .replace(/'''/g, '\u2034')                                           // triple prime
  .replace(/(\W|^)"(\S)/g, '$1\u201c$2')                               // beginning "
  .replace(/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, '$1\u201d$2')  // ending "
  .replace(/([^0-9])"/g,'$1\u201d')                                    // remaining " at end of word
  .replace(/''/g, '\u2033')                                            // double prime
  .replace(/(\W|^)'(\S)/g, '$1\u2018$2')                               // beginning '
  .replace(/([a-z])'([a-z])/ig, '$1\u2019$2')                          // conjunction's possession
  .replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/ig, '$1\u2019$3')         // ending '
  // backwards apostrophe
  .replace(/(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/ig, '$1\u2019')
  // abbrev. years like '93
  .replace(/(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/ig, '\u2019$2$3')
  .replace(/'/g, '\u2032');
}

/**
 * Reduce all occurrences of multiple spaces to a single space char.
 * So that '      ' becomes ' '
 * @param  {String} str
 * @return {String}
 */
function contractSpaces(str) {
  return str.replace(/\s{2,}/g, ' ');
}

/**
 * Re-order names in the format of "surname, name" to "name surname"
 * @param  {String} str String containing more than one name
 * @return {String}     Re-ordered name
 */
function orderNames(str) {
  return /,/.test(str) ? swapWords(...str.split(/,\s?/)) : str;
}

function parseTitle(str) {
  const titleRE = /.+(?=\s\()/;

  return smartQuotes(str.match(titleRE)[0]);
}

function parseAuthor(str) {
  // capture author names from string format: "Book title (maybe with parens) (AUTHOR NAMES)"
  const authorRE = /(?:\((?!.*\())(.+)(?:\))/;

  // match names, and split any multiple authors delineated by ";" and format as Firstname Last
  let authors = str.match(authorRE)[1].split(/;\s?/);
  if (!flags.n) authors = authors.map(orderNames);
  return authors.join(', ');
}


function parseDate(str) {
  const dateRE = /Added\son\s(.*)/;
  const dateStr = str.match(dateRE)[1];

  return {
    human: dateStr.slice(0, -9),
    dateTime: moment(dateStr, 'dddd, DD MMMM YYYY HH-mm-ss').toDate(),
  };
}

function parseLoc(str) {
  const locRE = /(?:location\s)(\d+-?\d+)/;
  return str.match(locRE)[1];
}

function parseLine(prev, quote, index) {
  const [header, meta, content] = quote.trim().split(/\s?\n\s?/);

  if (isEmpty(content)) return prev;
  if (isSame(last(prev).content, content)) return prev;
  if (!isHighlight) return prev;

  return prev.concat({
    title: parseTitle(header),
    author: parseAuthor(header),
    loc: parseLoc(meta),
    date: parseDate(meta),
    content: smartQuotes(prependEllipsis(contractSpaces(content))),
  });
}

function buildJSON(data) {
  // entries are separated with ==========
  const clipSeparator = /={2,}/;
  const clippings = stripBOM(data).split(clipSeparator).reduce(parseLine, []);

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
    } else console.log(`Output: ${dest}`);
  });
});
