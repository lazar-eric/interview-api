import { DataTypes } from 'sequelize';

import { AmauiDate } from '@amaui/date';

export default (User: any) => ({
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

    added_at: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: () => AmauiDate.unix
    }
  },
  options: {
    timestamps: false
  }
}) as any;
