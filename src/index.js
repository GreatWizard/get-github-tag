const fetch = require('node-fetch')

const HOST = process.env.GET_TAG_HOST || 'https://api.github.com'

let __tags__ = []

module.exports = function (owner, repo, name = '') {
  let key = `${owner}--${repo}`
  if (__tags__[key] === undefined) {
    __tags__[key] = fetch(`${HOST}/repos/${owner}/${repo}/tags`).then((res) => res.json())
  }
  let regexp = new RegExp(name)
  return __tags__[key]
    .then((json) => {
      let tag = json.find((tag) => {
        return tag.name.match(regexp) !== null
      })
      return tag && tag.name
    })
    .catch((e) => {
      console.log('An error occurred: ', e)
    })
}
