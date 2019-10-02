/* eslint-disable camelcase */
const tap = require('tap');
const p = require('./../package.json');

const { FieldDef, isAbsent, ABSENT } = require('./../lib/index');

tap.test(p.name, (suite) => {
  suite.test('FieldDef', (testFieldDef) => {
    testFieldDef.test('simple unvalidated untyped', (testFieldDef_simple) => {
      const anyVal = new FieldDef('alpha');

      testFieldDef_simple.equal(anyVal.name, 'alpha');
      testFieldDef_simple.ok(isAbsent(anyVal.type));
      testFieldDef_simple.ok(isAbsent(anyVal.validator));
      testFieldDef_simple.notOk(anyVal.required);

      testFieldDef_simple.test('validation', (testFDS_validation) => {
        testFDS_validation.ok(anyVal.validate(2).isValid);
        testFDS_validation.ok(anyVal.validate(null).isValid);
        testFDS_validation.ok(anyVal.validate().isValid);
        testFDS_validation.end();
      });

      testFieldDef_simple.end();
    });

    testFieldDef.test('simple unvalidated typed', (testFieldDef_string) => {
      const anyString = new FieldDef('beta', { type: 'string' });

      testFieldDef_string.equal(anyString.name, 'beta');
      testFieldDef_string.equal((anyString.type), 'string');
      testFieldDef_string.ok(isAbsent(anyString.validator));
      testFieldDef_string.notOk(anyString.required);

      testFieldDef_string.test('validation', (testFDS_validation) => {
        testFDS_validation.notOk(anyString.validate(2).isValid, 'fails type validation');
        testFDS_validation.ok(anyString.validate(null).isValid);
        testFDS_validation.ok(anyString.validate().isValid);
        testFDS_validation.ok(anyString.validate('a good string').isValid);
        testFDS_validation.end();
      });

      testFieldDef_string.end();
    });

    testFieldDef.test('simple validated typed', (testFieldDef_string) => {
      const anyString = new FieldDef('beta', {
        type: 'string',
        validator: [
          (value) => (/\s/.test(value) ? 'beta value cannot have spaces' : false),
          (value) => (value.length < 4 ? 'beta value must be 4 or more characters' : false),
        ],
      });

      testFieldDef_string.equal(anyString.name, 'beta');
      testFieldDef_string.equal((anyString.type), 'string');
      testFieldDef_string.notOk(isAbsent(anyString.validator));
      testFieldDef_string.notOk(anyString.required);

      testFieldDef_string.test('validation', (testFDS_validation) => {
        testFDS_validation.notOk(anyString.validate(2).isValid, 'fails type validation');
        testFDS_validation.ok(anyString.validate(null).isValid);
        testFDS_validation.ok(anyString.validate().isValid);
        testFDS_validation.notOk(anyString.validate('a space string').isValid,
          'fails string with spaces');
        testFDS_validation.ok(anyString.validate('aLongGoodString').isValid,
          'allows long, no space string');
        testFDS_validation.notOk(anyString.validate('sht').isValid,
          'fails if string too short');
        testFDS_validation.end();
      });

      testFieldDef_string.end();
    });

    testFieldDef.end();
  });

  suite.end();
});
