import is from 'is';
import propper from '@wonderlandlabs/propper';
import lGet from 'lodash.get';
import FieldDef from './FieldDef';
import { ABSENT, isAbsent } from './utils/absent';


export default class Schema {
  constructor(name, fields) {
    this.name = name;
    if (!fields) {
      return;
    }
    if (fields) {
      if (Array.isArray(fields)) {
        fields.forEach((field) => {
          this.addField(field);
        });
      } else if (is.object(fields)) {
        Object.keys(fields).forEach((fieldName) => {
          const def = fields[fieldName];
          this.addField(fieldName, def);
        });
      }
    }
  }

  addField(name, def) {
    if (is.object(name)) {
      if ('name' in name) {
        this.addField(name.name, name);
      } else {
        this.fields.set(name, new FieldDef(name, def));
      }
    }
  }

  instance(config = {}) {
    const fields = lGet(config, 'fields', this.fields.keys());
    const record = lGet(config, 'values', {});
    const limitToSchema = lGet(config, 'limitToSchema', true);

    fields.forEach((fieldName) => {
      if (!(this.fields.has(fieldName))) {
        if (limitToSchema) {
          throw new Error(`schema ${this.name} has no field ${fieldName}`);
        }
      } else if (!(fieldName in record)) {
        const def = this.fields.get(fieldName);
        if (def.defaultValue !== ABSENT) {
          record[fieldName] = def.defaultValue;
        }
      }
    });
  }
}

propper(Schema)
  .addProp('fields', {
    defaultValue: () => new Map(),
  });
