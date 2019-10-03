import is from 'is';
import propper from '@wonderlandlabs/propper';
import lGet from 'lodash.get';
import FieldDef from './FieldDef';
import { ABSENT, isAbsent } from './utils/absent';
import RecordState from './RecordState';

export default class Schema {
  constructor(name, fields, fieldDefaults = {}) {
    this.name = name;
    if (fields) {
      if (Array.isArray(fields)) {
        fields.forEach((field) => {
          if (Array.isArray(field)) {
            this.addField(...field);
          } else this.addField(field);
        });
      } else if (is.object(fields)) {
        Object.keys(fields).forEach((fieldName) => {
          const def = fields[fieldName];
          this.addField(fieldName, def);
        });
      }
    }
    this.fieldDefaults = {};
  }

  addField(name, def) {
    if (is.object(name)) {
      if ('name' in name) {
        this.addField(name.name, name);
      } else {
        this.fields.set(name, new FieldDef(name, def));
      }
    } else {
      this.fields.set(name, new FieldDef(name, def));
    }
  }

  validate(record, fields) {
    return new RecordState(record, this, fields);
  }

  /**
   * create a properly typed instance, optionally with passed in values,
   * respecting the default values when none provided.
   * @param config
   */
  instance(record = {}, config = {}) {
    const fields = lGet(config, 'fields', Array.from(this.fields.keys()));
    const limitToSchema = lGet(config, 'limitToSchema', true);

    fields.forEach((fieldName) => {
      if (!(this.fields.has(fieldName))) {
        if (limitToSchema) {
          throw new Error(`schema ${this.name} has no field ${fieldName}`);
        }
      } else if (!(fieldName in record)) {
        const def = this.fields.get(fieldName);
        if (!isAbsent(def.defaultValue)) {
          if (is.function(def.defaultValue) && (def.type !== 'function')) {
            record[fieldName] = def.defaultValue();
          } else {
            record[fieldName] = def.defaultValue;
          }
        }
      }
    });

    return record;
  }
}

propper(Schema)
  .addProp('fieldDefaults', {}, 'object')
  .addProp('fields', {
    defaultValue: () => new Map(),
  });
