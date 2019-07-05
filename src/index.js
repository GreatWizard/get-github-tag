'use strict';
const fetch = require('node-fetch');

const HOST = process.env.GET_TAG_HOST || 'https://api.github.com';

let __tags__ = [];

module.exports = function(owner, repo, name = '') {
  let key = `${owner}--${repo}__${name}`;
  if (__tags__[key] === undefined) {
    __tags__[key] = fetch(`${HOST}/repos/${owner}/${repo}/tags`).then(res => res.json());
  }
  return __tags__[key]
    .then(json => {
      let tag = json.find(tag => {
        return tag.name.indexOf(name) !== -1;
      });
      return tag.name;
    })
    .catch(e => {
      console.log('An error occurred: ', e);
    });
};
