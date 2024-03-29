#!/usr/bin/env node

const fs = require('fs')
const getTagFor = require('../src')
const shouldWriteHelp = process.argv.includes('-h') || process.argv.includes('--help')
const shouldUpdatePackage = process.argv.includes('-w') || process.argv.includes('--write')
const DETECT_TRAILING_WHITESPACE = /\s+$/

function printUsage() {
  console.log(`
get-github-tag is a utility module to easily obtain the git tag representing
the latest tag for a given keyword/version.

USAGE:
  get-github-tag [OWNER] [REPO] [KEYWORD/VERSION] [FLAGS] [DEPENDENCY NAME]

FLAGS:

  -w, --write   Update the local package.json to use the retrieved git tag
  -h, --help    Prints help information

EXAMPLE:

  * Print the most recent git tag for the specified keyword or version:

    $ get-github-tag emberjs data
    $ get-github-tag emberjs data alpha
    $ get-github-tag emberjs data beta
    $ get-github-tag emberjs data 3.9 -w ember-data

  * Update the local project's \`package.json\` to use the most recent git tag for the emberjs/data repository with the "beta" keyword:

    $ get-github-tag emberjs data beta --write ember-data
`)
}

async function main() {
  if (shouldWriteHelp || process.argv.length < 4) {
    printUsage()
    process.exitCode = 1
  } else {
    let owner = process.argv[2]
    let repo = process.argv[3]
    let version = process.argv.length >= 5 ? process.argv[4] : ''
    let dependencyName = process.argv.length >= 7 ? process.argv[6] : repo
    let tag = await getTagFor(owner, repo, version)
    if (process.stdout.isTTY) {
      console.log(`The git tag for the latest ${owner}/${repo}'s ${version} is:\n\n\t${tag}\n`)
    } else {
      process.stdout.write(tag)
    }

    if (shouldUpdatePackage) {
      if (!fs.existsSync('package.json')) {
        console.log(`You passed --write to get-github-tag but no package.json is available to update.`)

        process.exitCode = 2
      }

      let contents = fs.readFileSync('package.json', { encoding: 'utf8' })
      let trailingWhitespace = DETECT_TRAILING_WHITESPACE.exec(contents)
      let pkg = JSON.parse(contents)

      let dependencyType = ['dependencies', 'devDependencies'].find((type) => pkg[type] && pkg[type][dependencyName])

      if (dependencyType) {
        pkg[dependencyType][dependencyName] = tag

        let updatedContents = JSON.stringify(pkg, null, 2)

        if (trailingWhitespace) {
          updatedContents += trailingWhitespace[0]
        }

        fs.writeFileSync('package.json', updatedContents, { encoding: 'utf8' })
      } else {
        console.log(
          `You passed --write to get-github-tag but ${dependencyName} is not included in dependencies or devDependencies in the package.json.`,
        )

        process.exitCode = 3
      }
    }
  }
}

main()
