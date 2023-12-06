import { DataTypes } from 'sequelize';

import { AmauiDate } from '@amaui/date';

export default (User: any) => ({
  name: 'invoice',
  object: {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },

    to: {
      type: DataTypes.STRING(1500),
      allowNull: false
    },

    city: {
      type: DataTypes.STRING(500)
    },

    country: {
      type: DataTypes.STRING(500)
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
