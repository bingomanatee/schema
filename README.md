# Schema

Schema is a detailed object validation system for objects. Unlike Yup which defines
defines validation tests as methods Schema takes straight functions or 
`is.js` function name strings and can return multiple errors (if configured to).

## Assumptions

* The object under test is an object  whose properties can be accessed and tested value by value. 
  It can be a POJO, instance, or anything else with readable props. 
  If you want to test single values look `is.js`.
* Some of the objects' properties might be absent. 
* The object is (relatively) flat. Deep schema with nested validation requires a little work by the user. 

## Features

* In some use cases you may only want to validate a subset of 
  fields; i.e., a record without an ID might be valid as a 
  pre-sent item, but not when fetched from the server; or 
  you may be working on a multi-part form. 
* Validation works in one of two modes: 
  1. **stopIfInvalid**: when a field has an error, 
     no further tests are executed. 
  2. **(not stopIfInvalid)**: even if one error is found,
     fetch the others for a full diagnostic. 
     
* The second mode is more difficult to code as your tests 
  cannot assume that the value has passed previous filters. 
* Schemas can generate instances pre-seeded with defaults, and 
  optionally blended with a set of values via the `instance()` 
  method of schema.

## API

### Schema 

#### Constructor:(name, fieldDefs)

* **name**: string
* **fieldDefs**: object|array <br />
  either a key/value list of field defs
  or an array of field def objects

```javascript

const sch = new Schema('user', {
    name: 'string',
    age: 'integer',
    created: {
      required: false,
      type: 'date',
      validator: (value) => value.getTime() < Date.now(),
    },
});

```

#### validate(record)

returns a RecordState object; useful properties are:

* **errors{Array}** errors from all fields
* **fields{Map}**  errors by field
* **isValid{Boolean}**

#### instance(values?)

returns a new instance with defaults provided by the field schema

### FieldDef

#### constructor(name: string, params: object, schema: Schema)

Parameters (all optional) include:

* **type{String}** any value present in `is.js`
* **validator{var}** a validator, or an array of validators (see below)
* **required{boolean}** (default: false) if false, then 'falsy'
  values will not generate errors. Note -- 'falsy' values might
  violate type so use with care. 
* **stopIfInvalid{boolean}** (default: false) if a single validator in a series
  fails (including the type validator) do not perform subsequent tests.
* **defaultValue{var}** a value to be used (by `Schema.instance` method)
  if a record doesn't have a value. Useful for forms. 
  note - can be a function - which will be called *unless the type of the field IS a function*
  for each instance call; this ensures objects, arrays, etc., can be made 
  unique.
* **invalidMessage{String}** (default: "[name] required") Any validation test that returns `true` (not just truthy)
  will display this message. 
* **requiredMessage{String}** (default: "[name] required") Displayed when
  a required field tests an absent value.
  
#### validators

Validators are either:

1. a string (name of an `is.js` method)
2. a function
3. an array of the above in any combination

Validators return either false (when value is good) or a string
(when value is bad). 

Note that type is a validator -- however it is always a string, 
and it is evaluated before the validator tests. 
