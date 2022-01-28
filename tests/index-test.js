const fs = require('fs')
const path = require('path')
const execa = require('execa')
const createServer = require('./helpers/server').createServer
const tmp = require('tmp')

tmp.setGracefulCleanup()

const ROOT = process.cwd()
const EXECUTABLE_PATH = path.join(__dirname, '..', 'bin', 'get-github-tag.js')

QUnit.module('get-github-tag', function (hooks) {
  hooks.beforeEach(async function () {
    let dir = tmp.dirSync()
    process.chdir(dir.name)

    this.server = await createServer()
    // eslint-disable-next-line require-atomic-updates
    process.env.GET_TAG_HOST = `http://localhost:${this.server.port}`

    this.expected = 'v1.3-canary3'

    this.server.on('/repos/emberjs/data/tags', (req, res) => {
      res.end(
        JSON.stringify([
          { name: 'v1.3-canary3' },
          { name: 'v1.3-canary2' },
          { name: 'v1.3-canary1' },
          { name: 'v1.2-beta3' },
          { name: 'v1.2-beta2' },
          { name: 'v1.2-beta1' },
          { name: 'v1.1-release3' },
          { name: 'v1.1-release2' },
          { name: 'v1.1-release1' },
          { name: 'v1.0.0' },
          { name: 'v0.7.2' },
          { name: 'v0.3.6' },
        ]),
      )
    })

    return this.server.listen(this.server.port)
  })

  hooks.afterEach(function () {
    process.chdir(ROOT)

    return this.server.close()
  })

  QUnit.test('works', async function (assert) {
    const getTagFor = require('../src')
    let actual = await getTagFor('emberjs', 'data', 'canary')
    assert.equal(actual, this.expected)
  })

  QUnit.module('binary', function () {
    QUnit.test('works', async function (assert) {
      let results = await execa(EXECUTABLE_PATH, ['emberjs', 'data', 'canary'])
      assert.ok(results.stdout.includes(this.expected), 'Tag is present in stdout')
    })

    QUnit.test('when the terminal is not a TTY return only the tag', async function (assert) {
      let file = tmp.fileSync()
      await execa(EXECUTABLE_PATH, ['emberjs', 'data', 'canary'], {
        stdout: file.fd,
      })
      assert.equal(fs.readFileSync(file.name, { encoding: 'utf8' }), this.expected, 'stdout is the tag')
    })

    QUnit.test('updates local package.json when --write is passed (dependencies)', async function (assert) {
      fs.writeFileSync('package.json', JSON.stringify({ dependencies: { data: '^1.10.0' } }), {
        encoding: 'utf8',
      })

      let results = await execa(EXECUTABLE_PATH, ['emberjs', 'data', 'canary', '--write'])
      assert.ok(results.stdout.includes(this.expected), 'Tag is present in stdout')
      assert.deepEqual(JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' })), {
        dependencies: {
          data: this.expected,
        },
      })
    })

    QUnit.test(
      'updates local package.json with a dependency name when --write is passed (dependencies)',
      async function (assert) {
        fs.writeFileSync('package.json', JSON.stringify({ dependencies: { 'ember-data': '^1.10.0' } }), {
          encoding: 'utf8',
        })

        let results = await execa(EXECUTABLE_PATH, ['emberjs', 'data', 'canary', '--write', 'ember-data'])
        assert.ok(results.stdout.includes(this.expected), 'Tag is present in stdout')
        assert.deepEqual(JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' })), {
          dependencies: {
            'ember-data': this.expected,
          },
        })
      },
    )

    QUnit.test('updates local package.json when --write is passed (devDependencies)', async function (assert) {
      fs.writeFileSync('package.json', JSON.stringify({ devDependencies: { data: '^1.10.0' } }), {
        encoding: 'utf8',
      })

      let results = await execa(EXECUTABLE_PATH, ['emberjs', 'data', 'canary', '--write'])
      assert.ok(results.stdout.includes(this.expected), 'Tag is present in stdout')
      assert.deepEqual(JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' })), {
        devDependencies: {
          data: this.expected,
        },
      })
    })

    QUnit.test(
      'updates local package.json with a dependency name when --write is passed (devDependencies)',
      async function (assert) {
        fs.writeFileSync('package.json', JSON.stringify({ devDependencies: { 'ember-data': '^1.10.0' } }), {
          encoding: 'utf8',
        })

        let results = await execa(EXECUTABLE_PATH, ['emberjs', 'data', 'canary', '--write', 'ember-data'])
        assert.ok(results.stdout.includes(this.expected), 'Tag is present in stdout')
        assert.deepEqual(JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' })), {
          devDependencies: {
            'ember-data': this.expected,
          },
        })
      },
    )

    QUnit.test('updates local package.json when -w is passed (dependencies)', async function (assert) {
      fs.writeFileSync('package.json', JSON.stringify({ dependencies: { data: '^1.10.0' } }), {
        encoding: 'utf8',
      })

      let results = await execa(EXECUTABLE_PATH, ['emberjs', 'data', 'canary', '-w'])
      assert.ok(results.stdout.includes(this.expected), 'Tag is present in stdout')
      assert.deepEqual(JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' })), {
        dependencies: {
          data: this.expected,
        },
      })
    })

    QUnit.test(
      'updates local package.json with a dependency name when -w is passed (dependencies)',
      async function (assert) {
        fs.writeFileSync('package.json', JSON.stringify({ dependencies: { 'ember-data': '^1.10.0' } }), {
          encoding: 'utf8',
        })

        let results = await execa(EXECUTABLE_PATH, ['emberjs', 'data', 'canary', '-w', 'ember-data'])
        assert.ok(results.stdout.includes(this.expected), 'Tag is present in stdout')
        assert.deepEqual(JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' })), {
          dependencies: {
            'ember-data': this.expected,
          },
        })
      },
    )

    QUnit.test('updates local package.json when -w is passed (devDependencies)', async function (assert) {
      fs.writeFileSync('package.json', JSON.stringify({ devDependencies: { data: '^1.10.0' } }), {
        encoding: 'utf8',
      })

      let results = await execa(EXECUTABLE_PATH, ['emberjs', 'data', 'canary', '-w'])
      assert.ok(results.stdout.includes(this.expected), 'Tag is present in stdout')
      assert.deepEqual(JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' })), {
        devDependencies: {
          data: this.expected,
        },
      })
    })

    QUnit.test(
      'updates local package.json with a dependency name when -w is passed (devDependencies)',
      async function (assert) {
        fs.writeFileSync('package.json', JSON.stringify({ devDependencies: { 'ember-data': '^1.10.0' } }), {
          encoding: 'utf8',
        })

        let results = await execa(EXECUTABLE_PATH, ['emberjs', 'data', 'canary', '-w', 'ember-data'])
        assert.ok(results.stdout.includes(this.expected), 'Tag is present in stdout')
        assert.deepEqual(JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' })), {
          devDependencies: {
            'ember-data': this.expected,
          },
        })
      },
    )

    QUnit.test('preserves line ending when updating package.json', async function (assert) {
      fs.writeFileSync('package.json', JSON.stringify({ dependencies: { data: '^3.10.0' } }, null, 2) + '\n', {
        encoding: 'utf8',
      })

      let results = await execa(EXECUTABLE_PATH, ['emberjs', 'data', 'canary', '-w'])
      assert.ok(results.stdout.includes(this.expected), 'Tag is present in stdout')
      let expected = JSON.stringify({ dependencies: { data: this.expected } }, null, 2) + '\n'
      assert.deepEqual(fs.readFileSync('package.json', { encoding: 'utf8' }), expected)
    })

    QUnit.test('fails when package.json is missing', async function (assert) {
      try {
        await execa(EXECUTABLE_PATH, ['emberjs', 'data', 'canary', '-w'])
      } catch (results) {
        assert.ok(results.stdout.includes(this.expected), 'Tag is present in stdout')
        assert.ok(
          results.stdout.includes('no package.json is available to update'),
          'warning is printed indicating -w failed',
        )
      }
    })

    QUnit.test('fails when dependency name is not a dep', async function (assert) {
      fs.writeFileSync('package.json', JSON.stringify({}), {
        encoding: 'utf8',
      })

      try {
        await execa(EXECUTABLE_PATH, ['emberjs', 'data', 'canary', '-w'])
      } catch (results) {
        assert.ok(results.stdout.includes(this.expected), 'Tag is present in stdout')
        assert.ok(
          results.stdout.includes('data is not included in dependencies or devDependencies'),
          'warning is printed indicating -w failed',
        )
      }
    })
  })
})
