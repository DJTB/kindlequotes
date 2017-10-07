const stripBOM = (str = '') => str.replace(/[\u200B-\u200D\uFEFF]/g, '');
const swapJoin = (a = '', b = '') => `${b} ${a}`.trim();
const isEmpty = (x = '') => x == null || x.length === 0;
const prependEllipsis = (str = '') => /^[a-z]/.test(str) ? `…${str}` : str;
const contractSpaces = (str = '') => str.replace(/\s{2,}/g, ' ');
const reorderNames = (str = '') => /\w+, \w+/.test(str) ? swapJoin(...str.split(/,\s?/)) : str;
const safeMatch = (str = '', test = null) => (str.match(test) || []);

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
        author: parseAuthor(header),
        date: parseDate(meta),
        content: parseContent(content),
      });
    }, []);
}

function parseTitle(str = '') {
  return smartQuotes(safeMatch(str, /.+(?=\s\()/)[0]);
}

function parseAuthor(str = '') {
  // capture author names from string format: "Book title (maybe with parens) (AUTHOR NAMES)"
  const authorRE = /(?:\((?!.*\())(.+)(?:\))/;
  const [_, authors] = safeMatch(str, authorRE);

  return (authors || '').split(/;\s?/)
    .map(reorderNames)
    .join(', ');
}

function parseLoc(str = '') {
  const [_, loc] = safeMatch(str, /(?:location )(\d+-?\d+)/);
  return loc || '';
}

function parseDate(str = '') {
  const [_, dateStr] = safeMatch(str, /Added on \w+, (.*)/);
  return dateStr ? new Date(dateStr) : '';
}

function parseContent(content = '') {
  return smartQuotes(prependEllipsis(contractSpaces(content)));
}

function smartQuotes(str = '') {
  return str.replace(/'''/g, '\u2034') // triple prime
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
}

module.exports = {
  contractSpaces,
  isEmpty,
  parseAuthor,
  parseContent,
  parseDate,
  parseLoc,
  parseTitle,
  prependEllipsis,
  reorderNames,
  safeMatch,
  smartQuotes,
  stripBOM,
  swapJoin,
  transformQuotes,
};
