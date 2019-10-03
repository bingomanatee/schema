/* eslint-disable camelcase */
const tap = require('tap');
const lGet = require('lodash.get');
const p = require('./../package.json');
const { Schema } = require('./../lib/index');

tap.test(p.name, (suite) => {
  suite.test('Schema', (testSchema) => {
    testSchema.test('constructor', (testS_constructor) => {
      const sch = new Schema('user', {
        name: 'string',
        age: 'integer',
        created: {
          required: false,
          type: 'date',
          validator: (value) => value.getTime() < Date.now(),
        },
      });

      const fieldNames = Array.from(sch.fields.keys());
      testS_constructor.equal(sch.name, 'user');
      testS_constructor.same(['name', 'age', 'created'], fieldNames);

      testS_constructor.end();
    });

    testSchema.test('validation', (testS_validation) => {
      const sch = new Schema('user', {
        name: { type: 'string', required: true },
        age: 'integer',
        created: {
          required: false,
          type: 'date',
          validator: (value) => value.getTime() < Date.now(),
        },
      });

      testS_validation.test('valid record', (testSV_validRecord) => {
        const result = sch.validate({
          name: 'Bob',
          age: 22,
        });
        testSV_validRecord.ok(result.isValid, 'Bob is valid');

        const r2 = sch.validate({ age: 14 });
        testSV_validRecord.notOk(r2.isValid, 'name missing');
        const nameErrors = r2.fields.get('name').errors;
        testSV_validRecord.same(nameErrors, ['name: undefined is not a string']);

        testSV_validRecord.end();
      });

      testS_validation.end();
    });

    testSchema.test('instance', (testS_instance) => {
      const now = new Date();

      const sch = new Schema('user', {
        name: 'string',
        age: 'integer',
        created: {
          required: false,
          type: 'date',
          defaultValue: () => now,
          validator: (value) => value.getTime() < Date.now(),
        },
      });

      const i = sch.instance();

      testS_instance.same(i, { created: now });

      const j = sch.instance({ name: 'Bob' });

      testS_instance.same(j, { name: 'Bob', created: now });

      const then = new Date(2010, 10, 10);

      const k = sch.instance({ name: 'Sue', created: then });

      testS_instance.same(k, { name: 'Sue', created: then });

      testS_instance.end();
    });

    testSchema.end();
  });

  suite.end();
});
