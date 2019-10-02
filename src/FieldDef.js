import propper from '@wonderlandlabs/propper';
import is from 'is';
import FieldState from './FieldState';

import { ABSENT, isAbsent } from './utils/absent';
import { s } from './utils';

function doValidator(value, test, def) {
  if (is.string(test)) {
    if (!is[test]) {
      throw new Error(`test string ${test} not in is.js`);
    }
    return !is[test](value);
  }
  if (is.function(test)) {
    return test(value);
  }
  throw new Error(`bad test ${test}`);
}

/**
 * a structure for validating fields.
 * note validator is either
 * 1. a function that returns false if there are NO ERRORS
 *    and true (or a stgring - error message) if there ARE ERRORS,
 * 2. a string (name of an is.js method)
 * 3. an array of (1) and/or (2)
 *
 *
 */
class FieldDef {
  constructor(name, params = {}) {
    if (is.string(params) || is.function(params) || is.array(params)) {
      // eslint-disable-next-line no-param-reassign
      params = { validator: params };
    }
    const {
      type = ABSENT,
      validator = ABSENT,
      required = false,
      defaultValue = ABSENT,
      requiredMessage = ABSENT,
      invalidMessage = ABSENT,
      stopIfInvalid = true,
    } = params;
    this.name = name;
    this.type = type || '';
    this.validator = validator;
    this.required = !!required;
    this.stopIfInvalid = stopIfInvalid; //  you want to stop on the first error
    this.invalidMessage = isAbsent(invalidMessage) ? `${name} invalid` : invalidMessage;
    this.requiredMessage = isAbsent(requiredMessage) ? `${name} required` : requiredMessage;
    this.defaultValue = defaultValue;
  }

  /**
   *
   * @param value
   * @returns FieldState
   */
  validate(value = ABSENT) {
    const out = new FieldState(this.name, value);
    if ((isAbsent(value) || !value) && !this.required) {
      return out;
    }

    if (!isAbsent(this.type)) {
      const testError = doValidator(value, this.type, this);
      if (testError) {
        out.errors.push(`${this.name}: ${s(value)} is not a ${this.type}`);
      }
    }

    if (this.stopIfInvalid && out.errors.length) {
      return out;
    }

    if (Array.isArray(this.validator)) {
      this.validator.forEach((validator) => {
        if (out.errors.length && this.stopIfInvalid) {
          return;
        }
        const error = doValidator(value, validator, this);
        if (error) {
          out.errors.push(error === true ? this.invalidMessage : error);
        }
      });
    } else if (!isAbsent(this.validator)) {
      const error = doValidator(value, this.validator, this);
      if (error) {
        out.errors.push((error === true || (!is.string(error))) ? this.invalidMessage : error);
      }
    }
    return out;
  }
}

propper(FieldDef)
  .addProp('validator', {
    defaultValue: ABSENT,
  })
  .addProp('type', {
    defaultValue: ABSENT,
    required: false,
  })
  .addProp('defaultValue', {
    defaultValue: ABSENT,
  })
  .addProp('invalidMessage', {
    type: 'string',
    defaultValue: 'invalid',
    required: true,
  })
  .addProp('stopIfInvalid', {
    type: 'boolean',
    defaultValue: false,
  })
  .addProp('requiredMessage', {
    type: 'string',
    defaultValue: 'required',
    required: true, // ha!
  })
  .addProp('name', {
    type: 'string',
    required: true,
  });

export default FieldDef;
