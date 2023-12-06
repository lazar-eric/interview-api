import { Sequelize } from 'sequelize';

import config from 'config';
import { contract, invoice, media, user } from './models';
import { Contract, Invoice, Media, User } from 'models';

export class MySQL {
  public sequelize: Sequelize;
  public connected = false;

  public constructor() {

  }

  public async init() {
    // init all the models
    const options = config.value.env === 'test' ? { force: true } : undefined;

    // User
    const userModel = user();

    User.model = this.sequelize.define(userModel.name, userModel.object, userModel.options);

    // Media
    const mediaModel = media(User.model);

    Media.model = this.sequelize.define(mediaModel.name, mediaModel.object, mediaModel.options);

    Media.model.belongsTo(User.model, { foreignKey: 'user', as: 'user_id' });

    // Invoice
    const invoiceModel = invoice(User.model);

    Invoice.model = this.sequelize.define(invoiceModel.name, invoiceModel.object, invoiceModel.options);

    Invoice.model.belongsTo(User.model, { foreignKey: 'user', as: 'user_id' });

    // Contract
    const contractModel = contract(User.model);

    Contract.model = this.sequelize.define(contractModel.name, contractModel.object, contractModel.options);

    Contract.model.belongsTo(User.model, { foreignKey: 'user', as: 'user_id' });

    // create tables
    await this.sequelize.sync(options);
  }

  public async connection() {
    if (this.connected) return this.sequelize;

    return this.connect();
  }

  public async connect() {
    try {
      this.sequelize = new Sequelize(config.value.db.mysql.uri);

      await this.sequelize.authenticate();

      await this.init();

      console.log(`MySQL connected`);
    }
    catch (error) {
      console.error(`MySQL connection error`, error);

      // throw error
      // to terminate the server
      // no point of the API running without the db usage
      throw error;
    }

    return this.sequelize;
  }

  public async disconnect() {
    if (this.connected) {
      try {
        await this.sequelize.close();

        this.connected = false;

        console.log(`MySQL disconnected`);
      }
      catch (error) {
        console.error(`MySQL disconnect error`, error);

        // throw error
        // to terminate the server
        // no point of the API running without the db usage
        throw error;
      }
    }
  }

}

export default new MySQL();
