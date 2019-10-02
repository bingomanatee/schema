/* eslint-disable camelcase */
const tap = require('tap');
const p = require('./../package.json');

const { FieldState } = require('./../lib/index');

tap.test(p.name, (suite) => {
  suite.test('FieldState', (testFS) => {
    testFS.test('constructor', (testFS_constructor) => {
      const errors = ['must be odd', 'must be > 2'];
      const fs = new FieldState('alpha', 2, errors);

      testFS_constructor.equal(fs.name, 'alpha');
      testFS_constructor.equal(fs.value, 2);
      testFS_constructor.same(fs.errors, errors);

      testFS_constructor.notOk(fs.isValid);

      const fsNoError = new FieldState('beta', 3);
      testFS_constructor.same(fsNoError.errors, []);
      testFS_constructor.ok(fsNoError.isValid);
      testFS_constructor.end();
    });

    testFS.end();
  });

  suite.end();
});
