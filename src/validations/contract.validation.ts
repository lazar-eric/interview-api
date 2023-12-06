import { IValidateModel, IValidateModelValue } from '@amaui/api';
import { ValidationError } from '@amaui/errors';

import { IRequest } from '../types';

export default function model(version: 'add' = 'add'): IValidateModel {
  const values: Record<string, IValidateModelValue> = {
    '': {
      name: 'Contract',
      is: 'object',
      properties: ['name', 'description', 'date', 'reviewed', 'signature']
    },

    name: {
      name: 'Name',
      is: 'string',
      min: 1,
      max: 1400
    },

    description: {
      name: 'Description',
      is: 'string',
      min: 1,
      max: 1400
    },

    date: {
      name: 'Date',
      is: 'number',
      isValid: 'unix'
    },

    reviewed: {
      name: 'Reviewed',
      is: 'boolean'
    },

    signature: {
      name: 'Signature',
      is: 'string',
      min: 1,
      max: 4e4
    }
  };

  // add
  if (version === 'add') return {
    '': {
      ...values['']
    },

    'name': {
      ...values.name,

      required: true
    },

    'description': {
      ...values.description
    },

    'date': {
      ...values.date,

      required: true
    },

    'reviewed': {
      ...values.reviewed,

      required: true
    },

    'signature': {
      ...values.signature,

      required: true
    }
  };

}
