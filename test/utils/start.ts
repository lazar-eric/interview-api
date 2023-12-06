import { Sequelize } from 'sequelize';

import { wait } from '@amaui/utils';

import config from 'config';
import { contract, invoice, media, user } from 'databases/mysql/models';
import { IUser } from 'models/user.model';
import { IInvoice } from 'models/invoice.model';

const models: any = {
  user: undefined,
  media: undefined,
  invoice: undefined,
  contract: undefined
};

const init = async (sequelize: Sequelize) => {
  // init all the models
  const options = config.value.env === 'test' ? {} : undefined;

  // User
  const userModel = user();

  models.user = sequelize.define(userModel.name, userModel.object, userModel.options);

  // Media
  const mediaModel = media(models.user);

  models.media = sequelize.define(mediaModel.name, mediaModel.object, mediaModel.options);

  models.media.belongsTo(models.user, { foreignKey: 'user', as: 'user_id' });

  // Invoice
  const invoiceModel = invoice(models.user);

  models.invoice = sequelize.define(invoiceModel.name, invoiceModel.object, invoiceModel.options);

  models.invoice.belongsTo(models.user, { foreignKey: 'user', as: 'user_id' });

  // Contract
  const contractModel = contract(models.user);

  models.contract = sequelize.define(contractModel.name, contractModel.object, contractModel.options);

  models.contract.belongsTo(models.user, { foreignKey: 'user', as: 'user_id' });

  await sequelize.sync(options);
};

const users = async () => {
  const values: Partial<IUser>[] = [
    { name: 'Lazar Eric', email: 'lazareric2@gmail.com' }
  ];

  const response = await models.user.bulkCreate(values);

  console.log('Users added', values.length);

  return response;
};

const invoices = async () => {
  const values: Partial<IInvoice>[] = [
    { to: 'Lazar Eric', city: 'Cacak', country: 'Serbia', user: 1 },
    { to: 'John Doe', city: 'Paris', country: 'France', user: 1 },
    { to: 'Mary Jane', city: 'Rome', country: 'Italy', user: 1 },
    { to: 'Anne Jany', city: 'Tokyo', country: 'Japan', user: 1 }
  ];

  const response = await models.invoice.bulkCreate(values);

  console.log('Invoices added', values.length);

  return response;
};

const add = async () => {
  await users();

  await invoices();
};

preEveryGroup(async () => {
  try {
    const uri = config.value.db.mysql.uri;

    const sequelize = new Sequelize(uri);

    await sequelize.authenticate();

    await init(sequelize);

    await add();
  }
  catch (error) {
    console.log('preEveryGroup error', error);
  }
});

postEveryGroup(async () => {
  try {
    const uri = config.value.db.mysql.uri;

    const sequelize = new Sequelize(uri);

    // drop all the tables
    if (uri.includes('company-test')) {
      console.log(`Removing test db ${uri}`);

      await sequelize.authenticate();

      await models.media.sync({ force: true });

      await models.invoice.sync({ force: true });

      await models.contract.sync({ force: true });

      await models.user.destroy({ where: {} });
    }
  }
  catch (error) {
    console.log('postEveryGroup error', error);
  }
});
