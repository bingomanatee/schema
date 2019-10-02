import propper from '@wonderlandlabs/propper';
import { ABSENT } from './utils/absent';
import FieldState from './FieldState';

class RecordState {
  constructor(record, schema, filter) {
    this.record = record;
    this.schema = schema;
    this.filter = filter;
    this.validate(record, filter);
  }

  validate(record, filter = null) {
    this.schema.fields.forEach((validator, name) => {
      if (Array.isArray(filter) && !filter.includes(name)) {
        this.fields.set(name, new FieldState(name, { checked: false }));
        return;
      }
      const validationResult = validator.validate(record[name]);
      this.fields.set(name, validationResult);
    });
  }

  get isValid() {
    return Array.from(this.fields.values)
      .reduce((v, state) => v && state.isValid, true);
  }
}

propper(RecordState)
  .addProp('fields', {
    defaultValue: () => new Map(),
  });

export default RecordState;
