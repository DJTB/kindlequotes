const parse = require('date-fns/parse');

const stripBOM = (str = '') => str.replace(/[\u200B-\u200D\uFEFF]/g, '');
const swapJoin = (a = '', b = '') => `${b} ${a}`;
const last = (arr = []) => (Array.isArray(arr) && arr.slice(-1).pop()) || undefined;
const isEmpty = (x = '') => !x.length || x == null;
const prependEllipsis = (str = '') => /[a-z]/.test(str[0]) ? `…${str}` : str;
const contractSpaces = (str = '') => str.replace(/\s{2,}/g, ' ');
const reorderNames = (str = '') => /\w+, \w+/.test(str) ? swapJoin(...str.split(/,\s?/)) : str;

const smartQuotes = (str = '') =>
  str.replace(/'''/g, '\u2034') // triple prime
    .replace(/(\W|^)"(\S)/g, '$1\u201c$2') // beginning "
    .replace(/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, '$1\u201d$2') // ending "
    .replace(/([^0-9])"/g, '$1\u201d') // remaining " at end of word
    .replace(/''/g, '\u2033') // double prime
    .replace(/(\W|^)'(\S)/g, '$1\u2018$2') // beginning '
    .replace(/([a-z])'([a-z])/ig, '$1\u2019$2') // conjunction's possession
    .replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/ig, '$1\u2019$3') // ending '
    // backwards apostrophe
    .replace(/(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/ig, '$1\u2019')
    // abbrev. years like '93
    .replace(/(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/ig, '\u2019$2$3')
    .replace(/'/g, '\u2032');


function transformQuotes(data) {
  return stripBOM(data)
    .split(/={2,}/) // ==========
    .filter((line) => !isEmpty(line))
    .reduce(parseLine, []);
}

function parseLine(list = [], line = '') {
  const [header, meta, content] = line.trim().split(/\s?\n\s?/);
  const previous = last(list);

  if (isEmpty(content) || previous && previous.loc === parseLoc(meta)) {
    return list;
  }

  return list.concat({
    title: parseTitle(header),
    author: parseAuthor(header),
    loc: parseLoc(meta),
    date: parseDate(meta),
    content: parseContent(content),
  });
}

function parseTitle(str = '') {
  return smartQuotes(str.match(/.+(?=\s\()/)[0]);
}

function parseAuthor(str = '') {
  // capture author names from string format: "Book title (maybe with parens) (AUTHOR NAMES)"
  const authorRE = /(?:\((?!.*\())(.+)(?:\))/;

  // split any multiple authors delineated by ";" and format as "Firstname Lastname"
  return str.match(authorRE)[1]
    .split(/;\s?/)
    .map(reorderNames)
    .join(', ');
}

function parseLoc(str = '') {
  return str.match(/(?:location )(\d+-?\d+)/)[1];
}

function parseDate(str) {
  const [_, dateStr] = str.match(/Added on (.*)/);
  return parse(dateStr);
}

function parseContent(content = '') {
  return smartQuotes(prependEllipsis(contractSpaces(content)));
}

module.exports = {
  contractSpaces,
  isEmpty,
  last,
  parseAuthor,
  parseContent,
  parseDate,
  parseLine,
  parseLoc,
  parseTitle,
  prependEllipsis,
  reorderNames,
  smartQuotes,
  stripBOM,
  swapJoin,
  transformQuotes,
};
