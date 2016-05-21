# kindlequotes
Transform a kindle clippings text file to JSON.

```
Options:

  -o, --outfile [value]  Filename to write JSON, default is quotes.json
  -d, --dirname [value]  Path to write outfile to, default is pwd
  -i, --infile [value]   Filename to read kindle quotes, default is quotes.txt
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
