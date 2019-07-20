const { single, multiple, withDuplicates, withBookmarks, alternateFormat } = require('./fixtures');

const {
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
  match,
  smartQuotes,
  stripBOM,
  swapJoin,
  to24Hr,
  transformQuotes,
} = require('../utils');

describe('stripBom()', () => {
  it('has a sane default', () => {
    expect(stripBOM()).toBe('');
  });
});

describe('monthNameToNum()', () => {
  it('has a sane default', () => {
    expect(monthNameToNum()).toBe(-1);
  });
  it('works as expected', () => {
    const expected = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const actual = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    expect(expected.map(monthNameToNum)).toEqual(expect.arrayContaining(actual));
  });
});

describe('match()', () => {
  it('has a sane default', () => {
    expect(match()).toEqual([]);
  });
  it('returns matches', () => {
    expect(match('anapple', /(an)(apple)/)).toEqual(
      expect.arrayContaining(['anapple', 'an', 'apple'])
    );
  });
  it('returns empty array instead of null if no match', () => {
    expect(match('anapple', /oranges/)).toEqual([]);
  });
});

describe('contractSpaces()', () => {
  it('sane default', () => {
    expect(contractSpaces()).toBe('');
  });
  it('works as expected', () => {
    expect(contractSpaces('          ')).toBe(' ');
  });
});

describe('isEmpty()', () => {
  it('sane default', () => {
    expect(isEmpty()).toBe(true);
  });
  it('works as expected', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty(null)).toBe(true);
  });
});

describe('prependZero()', () => {
  it('sane default', () => {
    expect(prependZero()).toBe('');
  });
  it('works as expected', () => {
    expect(prependZero(0)).toBe('00');
    expect(prependZero(1)).toBe('01');
    expect(prependZero(10)).toBe('10');
  });
});

describe('prependEllipsis()', () => {
  it('sane default', () => {
    expect(prependEllipsis()).toBe('');
  });
  it('works as expected', () => {
    expect(prependEllipsis('Starting sentence')).toBe('Starting sentence');
    expect(prependEllipsis('mid sentence')).toBe('…mid sentence');
  });
});

describe('reorderNames()', () => {
  it('sane default', () => {
    expect(reorderNames()).toBe('');
  });
  it('works as expected', () => {
    expect(reorderNames('First Last')).toBe('First Last');
    expect(reorderNames('Last, First')).toBe('First Last');
  });
});

describe('smartQuotes()', () => {
  it('sane default', () => {
    expect(smartQuotes()).toBe('');
  });
  it('works as expected', () => {
    expect(smartQuotes('"He said \'wow man\'"')).toBe('“He said ‘wow man’”');
  });
});

describe('swapJoin()', () => {
  it('sane default', () => {
    expect(swapJoin()).toBe('');
  });
  it('works as expected', () => {
    expect(swapJoin('one', 'two')).toBe('two one');
  });
});

describe('parseTitle()', () => {
  it('sane default', () => {
    expect(parseTitle()).toBe('');
  });
  it('works as expected', () => {
    expect(parseTitle('Acceptance: A Novel (The Southern Reach Trilogy) (Jeff VanderMeer)')).toBe(
      'Acceptance: A Novel (The Southern Reach Trilogy)'
    );
  });
});

describe('parseAuthors()', () => {
  it('sane default', () => {
    expect(parseAuthors()).toEqual([]);
  });
  it('works as expected', () => {
    expect(
      parseAuthors('Acceptance: A Novel (The Southern Reach Trilogy) (Jeff VanderMeer)')
    ).toEqual(expect.arrayContaining(['Jeff VanderMeer']));
    expect(parseAuthors('Songs of the Dying Earth (Dozois, Gardner;Martin, George R.R.)')).toEqual(
      expect.arrayContaining(['Gardner Dozois', 'George R.R. Martin'])
    );
  });
});

describe('parseDate()', () => {
  it('sane default', () => {
    expect(parseDate()).toBe('');
  });
  it('works as expected', () => {
    expect(
      parseDate(
        '- Your Highlight at location 11849-11850 | Added on Thursday, 30 April 2015 12:58:20'
      )
    ).toEqual('2015-04-30T12:58:20.000Z');
  });
});

describe('parseLoc()', () => {
  it('sane default', () => {
    expect(parseLoc()).toBe('');
  });
  it('works as expected', () => {
    expect(
      parseLoc(
        '- Your Highlight at location 11849-11850 | Added on Thursday, 30 April 2015 20:58:20'
      )
    ).toBe('11849-11850');
  });
});

describe('to24Hr()', () => {
  it('sane default', () => {
    expect(to24Hr()).toBe('');
  });
  it('works as expected', () => {
    expect(to24Hr('1:10:10 PM')).toBe('13:10:10');
    expect(to24Hr('11:10:10 PM')).toBe('23:10:10');
    expect(to24Hr('1:10:10 AM')).toBe('1:10:10');
    expect(to24Hr('11:10:10 AM')).toBe('11:10:10');
    expect(to24Hr('12:10:10 AM')).toBe('12:10:10');
    expect(to24Hr('12:10:10 PM')).toBe('24:10:10');
  });
});

describe('parseContent()', () => {
  it('sane default', () => {
    expect(parseContent()).toBe('');
  });
  it('works as expected', () => {
    expect(
      parseContent(
        'Blake says, "Where?" He\'s a man who measures words as if he had only a few given to him by Fate; too generous a syllable from his lips, and he might fall over dead.'
      )
    ).toBe(
      'Blake says, “Where?” He’s a man who measures words as if he had only a few given to him by Fate; too generous a syllable from his lips, and he might fall over dead.'
    );

    expect(
      parseContent(
        'and eyeing the wizard speculatively across the room. A glance was enough to tell Molloqos that she was a woman of the evening, though in her case evening was edging on toward night.'
      )
    ).toBe(
      '…and eyeing the wizard speculatively across the room. A glance was enough to tell Molloqos that she was a woman of the evening, though in her case evening was edging on toward night.'
    );
  });
});

describe('transformQuotes()', () => {
  it('sane default', () => {
    expect(transformQuotes()).toEqual([]);
  });
  it('works for a single entry', () => {
    expect(transformQuotes(single)).toMatchSnapshot();
  });
  it('works for multiple entries', () => {
    expect(transformQuotes(multiple)).toMatchSnapshot();
  });
  it('removes duplicates', () => {
    expect(transformQuotes(withDuplicates)).toMatchSnapshot();
  });
  it('ignores bookmarks', () => {
    expect(transformQuotes(withBookmarks)).toMatchSnapshot();
  });
  it('handles alternate format', () => {
    expect(transformQuotes(alternateFormat)).toMatchSnapshot();
  });
});
