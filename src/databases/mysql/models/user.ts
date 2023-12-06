import { DataTypes } from 'sequelize';

import { AmauiDate } from '@amaui/date';

export default () => ({
  name: 'user',
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

    email: {
      type: DataTypes.STRING(1500),
      allowNull: false
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
