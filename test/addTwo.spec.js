/* eslint-disable camelcase */
const tap = require('tap');
const p = require('./../package.json');

const { addTwo } = require('./../lib/index');

tap.test(p.name, (suite) => {
  suite.test('addTwo', (testAddTwo) => {
    testAddTwo.test('adding numbers', (testAddTwo_numbers) => {
      testAddTwo_numbers.equal(addTwo(1, 5), 6, '1 + 5 = 6');
      testAddTwo_numbers.end();
    });

    testAddTwo.test('adding non numbers', (testAddTwo_nonNumbers) => {
      try {
        addTwo(1, '5');
        testAddTwo_nonNumbers.fail('should not continue');
      } catch (err) {
        testAddTwo_nonNumbers.ok(/values must be a number/i.test(err.message));
      }

      testAddTwo_nonNumbers.end();
    });

    testAddTwo.end();
  });

  suite.end();
});
