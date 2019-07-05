# get-github-tag

[![Build Status](https://travis-ci.org/GreatWizard/get-github-tag.svg?branch=master)](https://travis-ci.org/GreatWizard/get-github-tag)

Retrieve a github tag that can be used to reference the latest build for that
keyword or version.

## Usage

### Command Line API

```
npx get-github-tag emberjs data canary
```

Will print out:

```
The git tag for the latest emberjs/data's canary is:

        v3.12.0-canary.2
```

If you'd like to update `ember-data` in your `package.json` with the new tag, you can use the `--write` option:

```
npx get-github-tag emberjs data canary --write ember-data
```

### Progamatic API

```js
const getTagFor = require("get-github-tag");

getTagFor("emberjs", "data", "canary").then(tag => {
  // use the tag here
});
```
