# kindlequotes
##### Transforms Kindle 'My Clippings' file to JSON.

## Requirements
Ensure you have [https://nodejs.org/en/](Node) installed on your system.

```
Usage: ./index.js -i 'My Clippings.txt'

Options:

  -o, --outfile [value]  Filename to write JSON [Default; quotes.json]
  -i, --infile [value]   Filename to read kindle highlights [Default: My Clippings.txt]
  -d, --dirname [value]  Path to write outfile to [Default: ./]
  -n, --no-reorder       Prevent re-ordering author names from "Surname, FirstName" to "FirstName Surname"
  -v, --version          Output the version number
  -h, --help             Output usage information

```

## Features include:
* Replacing dumbquotes ' ' " " with smartquotes ‘ ’ “ ”
* Prepending highlights mid-sentence with an… ellpisis
* Stripping large sections of spacing (possibly from epub or pdf highlights)
* Re-ordering author names to FirstName Surname.
* Skip sequential duplicates or empty highlights


### Transforms this:
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

### Into this:
```
[
  {
    "title": "The Third Bear",
    "author": "Jeff VanderMeer",
    "loc": "1856-1857",
    "date": {
      "human": "Monday, 1 September 2014",
      "dateTime": "2014-09-01T02:58:20.000Z"
    },
    "content": "Blake says, “Where?” He’s a man who measures words as if he had only a few given to him by Fate; too generous a syllable from his lips, and he might fall over dead."
  },
   {
    "title": "Songs of the Dying Earth",
    "author": "Gardner Dozois, George R.R. Martin",
    "loc": "11849-11850",
    "date": {
      "human": "Thursday, 30 April 2015",
      "dateTime": "2015-04-30T10:58:20.000Z"
    },
    "content": "…and eyeing the wizard speculatively across the room. A glance was enough to tell Molloqos that she was a woman of the evening, though in her case evening was edging on toward night."
  }
]
```
