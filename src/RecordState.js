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
    this.schema.fields.forEach((fieldDef, name) => {
      const value = record[name];
      if (Array.isArray(filter) && !filter.includes(name)) {
        this.fields.set(name, new FieldState(name, value, [], false));
        return;
      }
      const validationResult = fieldDef.validate(value);
      this.fields.set(name, validationResult);
    });
  }

  get isValid() {
    return Array.from(this.fields.values())
      .reduce((v, state) => v && state.isValid, true);
  }
}

propper(RecordState)
  .addProp('fields', {
    defaultValue: () => new Map(),
  });

export default RecordState;
