# kindlequotes
##### Transforms Kindle clippings text file to JSON.

```
Usage: ./index.js -i 'My Clippings.txt'

Options:

  -o, --outfile [value]  Filename to write JSON [Default; quotes.json]
  -i, --infile [value]   Filename to read kindle highlights [Default: My Clippings.txt]
  -d, --dirname [value]  Path to write outfile to [Default: ./]
  -n, --no-reorder       Prevent re-ordering author names from "Surname, Name" to "Name Surname"
  -v, --version          Output the version number
  -h, --help             Output usage information

```

### Transforms this (taken from "My Clippings.txt" located on your Kindle device) :
```
==========
CivilWarLand in Bad Decline (George Saunders)
- Your Highlight at location 297-297 | Added on Thursday, 11 June 2015 16:07:21

The police arrive and we all lie like rugs.
==========
```

### Into this:
```
[
  {
    "title": "CivilWarLand in Bad Decline",
    "author": [
      "George Saunders"
    ],
    "date": "Thursday, 11 June 2015",
    "content": "The police arrive and we all lie like rugs."
  }
]
```
