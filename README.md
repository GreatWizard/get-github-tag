# get-github-tag

[![CI](https://github.com/GreatWizard/get-github-tag/actions/workflows/ci.yml/badge.svg)](https://github.com/GreatWizard/get-github-tag/actions/workflows/ci.yml)

Retrieve a github tag that can be used to reference the latest build for that keyword or version.

## Usage

### Command Line API

```shell
npx get-github-tag emberjs data beta
```

Will print out:

```shell
The git tag for the latest emberjs/data's beta is:

	v4.2.0-beta.0
```

If you'd like to update `ember-data` in your `package.json` with the new tag, you can use the `--write` option:

```shell
npx get-github-tag emberjs data beta --write ember-data
```

### Programmatic API

```js
const getTagFor = require('get-github-tag');

getTagFor('emberjs', 'data', 'beta').then((tag) => {
  // use the tag here
});
```
