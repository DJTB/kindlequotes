const stripBOM = (str = '') => str.replace(/[\u200B-\u200D\uFEFF]/g, '');
const swapJoin = (a = '', b = '') => `${b} ${a}`.trim();
const isEmpty = (x = '') => x == null || x.length === 0;
const prependEllipsis = (str = '') => (/^[a-z]/.test(str) ? `…${str}` : str);
const contractSpaces = (str = '') => str.replace(/\s{2,}/g, ' ');
const safeMatch = (str = '', test = null) => str.match(test) || [];
const reorderNames = (str = '') => /\w+, \w+/.test(str) ? swapJoin(...str.split(/,\s?/)) : str;
const prependZero = (num = NaN) => {
  if (Number.isNaN(+num)) return '';
  return num < 10 ? `${0}${num}` : `${num}`;
};

function transformQuotes(str = '') {
  const entrySeparator = /={2,}/; // ==========
  let locs = new Set();

  return stripBOM(str)
    .split(entrySeparator)
    .reduce((list, line) => {
      const [header, meta, content] = line.trim().split(/\s?\n\s?/);
      const loc = parseLoc(meta);

      // skip bookmarks and duplicates
      if (isEmpty(content) || locs.has(loc)) {
        return list;
      }

      locs = locs.add(loc);

      return list.concat({
        loc,
        title: parseTitle(header),
        authors: parseAuthors(header),
        date: parseDate(meta),
        content: parseContent(content),
      });
    }, []);
}

function parseTitle(str = '') {
  return smartQuotes(safeMatch(str, /.+(?=\s\()/)[0]);
}

function parseAuthors(str = '') {
  // capture author names from string format: "Book title (maybe with parens) (AUTHOR NAMES)"
  const authorRE = /(?:\((?!.*\())(.+)(?:\))/;
  const [, authors] = safeMatch(str, authorRE);

  return authors ? authors.split(/;\s?/).map(reorderNames) : [];
}

function parseLoc(str = '') {
  const [, loc] = safeMatch(str, /(?:location )(\d+-?\d+)/);
  return loc || '';
}

function parseDate(str = '') {
  const [, dayNum, monthName, year, time] = safeMatch(
    str,
    /Added on \w+, (\d+) (\w+) (\d+) (.*)/,
  );
  const day = prependZero(dayNum);
  const month = prependZero(monthNameToNum(monthName));
  return year ? `${year}-${month}-${day}T${time}.000Z` : '';
}

function parseContent(content = '') {
  return smartQuotes(prependEllipsis(contractSpaces(content)));
}

function smartQuotes(str = '') {
  return (
    str
      .replace(/'''/g, '\u2034') // triple prime
      .replace(/(\W|^)"(\S)/g, '$1\u201c$2') // beginning "
      .replace(/(\u201c[^"]*)"([^"]*$|[^\u201c"]*\u201c)/g, '$1\u201d$2') // ending "
      .replace(/([^0-9])"/g, '$1\u201d') // remaining " at end of word
      .replace(/''/g, '\u2033') // double prime
      .replace(/(\W|^)'(\S)/g, '$1\u2018$2') // beginning '
      .replace(/([a-z])'([a-z])/gi, '$1\u2019$2') // conjunction's possession
      .replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/gi, '$1\u2019$3') // ending '
      // backwards apostrophe
      .replace(
        /(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/gi,
        '$1\u2019',
      )
      // abbrev. years like '93
      .replace(
        /(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/gi,
        '\u2019$2$3',
      )
      .replace(/'/g, '\u2032')
  );
}

function monthNameToNum(monthName = '') {
  return [
    null,
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ].indexOf(monthName.slice(0, 3).toLowerCase());
}

module.exports = {
  contractSpaces,
  isEmpty,
  monthNameToNum,
  parseAuthors,
  parseContent,
  parseDate,
  parseLoc,
  parseTitle,
  prependEllipsis,
  prependZero,
  reorderNames,
  safeMatch,
  smartQuotes,
  stripBOM,
  swapJoin,
  transformQuotes,
};
