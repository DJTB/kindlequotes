
<h1 align="center">Kindle Quotes</h1>
<h5 align="center">Transform Kindle 'My Clippings' text file to JSON.</h5>
<div align="center">
  <!-- Npm Version -->
  <a href="https://www.npmjs.com/package/kindlequotes">
    <img src="https://img.shields.io/npm/v/kindlequotes.svg" alt="NPM package" />
  </a>
  <!-- Test Coverage -->
  <a href="https://coveralls.io/github/DJTB/kindleQuotes">
    <img src="https://img.shields.io/coveralls/DJTB/kindlequotes.svg" alt="Test Coverage" />
  </a>
</div>

### Features
* Replaces dumbquotes ' ' " " with smartquotes ‘ ’ “ ”
* Prepends highlights starting mid-sentence with an …ellipsis
* Trims large sections of spacing (from epub or pdf highlights)
* Standardises author format as Firstname Lastname
* Skips bookmarks, duplicates, and empty highlights

#### Transform this:
```
==========
The Third Bear (VanderMeer, Jeff)
- Your Highlight at location 1856-1857 | Added on Monday, 1 September 2014 12:58:20

Blake says, "Where?" He's a man who measures words as if he had only a few given to him by Fate; too generous a syllable from his lips, and he might fall over dead.
==========
Songs of the Dying Earth (Dozois, Gardner;Martin, George R.R.)
- Your Highlight at location 11849-11850 | Added on Thursday, 30 April 2015 20:58:20

and eyeing the wizard speculatively across the room. A glance was enough to tell Molloqos that she was a woman of the evening, though in her case evening was edging on toward night.
==========
```

#### Into this:
```
[
  {
    "title": "The Third Bear",
    "authors": ["Jeff VanderMeer"],
    "loc": "1856-1857",
    "date": "2014-09-01T12:58:20.000Z",
    "content": "Blake says, “Where?” He’s a man who measures words as if he had only a few given to him by Fate; too generous a syllable from his lips, and he might fall over dead."
  },
   {
    "title": "Songs of the Dying Earth",
    "authors": ["Gardner Dozois", "George R.R. Martin"],
    "loc": "11849-11850",
    "date": "2015-04-30T20:58:20.000Z",
    "content": "…and eyeing the wizard speculatively across the room. A glance was enough to tell Molloqos that she was a woman of the evening, though in her case evening was edging on toward night."
  }
]
```

### Usage
#### As Global CLI
```bash
$ npm install -g kindlequotes
$ kindlequotes -i 'My Clippings.txt' -o 'my-quotes.json'
```

##### Options
```
-i, --infile [value]   Filename to read kindle highlights [Default: My Clippings.txt]
-o, --outfile [value]  Filename to write JSON [Default: quotes.json]
-d, --dirname [value]  Path to write outfile to [Default: current working directory]
-v, --version          Output the version number
-h, --help             Output this usage information
```

#### As Import in a Local Project
```bash
$ npm install kindlequotes
```
```javascript
const transformQuotes = require('kindlequotes');
const fs = require('fs');
const quotes = transformQuotes(
  fs.readFileSync('./My Clippings.txt', 'utf8')
);
```
