import propper from '@wonderlandlabs/propper';

export default class FieldState {
  constructor(name, value, errors = []) {
    this.name = name;
    this.value = value;
    if (errors) this.errors = errors;
  }

  get isValid() {
    return !this.errors.length;
  }
}

propper(FieldState)
  .addProp('errors', {
    required: true,
    type: 'array',
    defaultValue: () => ([]),
  })
  .addProp('name', {
    required: true,
    type: 'string',
  });
