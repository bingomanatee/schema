/* eslint-disable no-param-reassign */
import propper from '@wonderlandlabs/propper';
import is from 'is';
import { ABSENT } from './utils/absent';

export default class FieldState {
  constructor(name, value, errors = [], checked = true) {
    if (is.object(name)) {
      value = name.value;
      errors = name.errors;
      name = name.name;
      checked = name.checked;
    }
    this.name = name;
    this.value = value;
    this.errors = errors;
    this.checked = checked;
  }

  get isValid() {
    return !this.errors.length;
  }

  toString() {
    if (!this.errors.length) return '';
    return `${this.name} errors: ${this.errors.join(',')}`;
  }
}

propper(FieldState)
  .addProp('errors', {
    required: true,
    type: 'array',
    defaultValue: () => ([]),
  })
  .addProp('checked', {
    type: 'boolean',
    defaultValue: ABSENT,
  })
  .addProp('name', {
    required: true,
    type: 'string',
  });
