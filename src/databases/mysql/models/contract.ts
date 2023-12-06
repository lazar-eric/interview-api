import { DataTypes } from 'sequelize';

import { AmauiDate } from '@amaui/date';

export default {
  name: 'contract',
  object: {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },

    name: {
      type: DataTypes.STRING(1500),
      allowNull: false
    },

    description: {
      type: DataTypes.TEXT
    },

    date: {
      type: DataTypes.INTEGER.UNSIGNED
    },

    signature: {
      type: DataTypes.TEXT
    },

    reviewed: {
      type: DataTypes.BOOLEAN
    },

    user: {
      type: DataTypes.INTEGER,
      allowNull: false,

      references: {
        model: 'users',
        key: 'id'
      }
    },

    added_at: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: () => AmauiDate.unix
    }
  },
  options: {
    timestamps: false
  }
} as any;
