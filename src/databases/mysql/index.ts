import { Sequelize } from 'sequelize';

import config from 'config';
import { invoice, user } from './models';
import { Invoice, User } from 'models';

export class MySQL {
  public sequelize: Sequelize;
  public connected = false;

  public constructor() {

  }

  public async init() {
    // init all the models
    // User
    User.model = this.sequelize.define(user.name, user.object, user.options);

    await User.model.sync();

    // Invoice
    Invoice.model = this.sequelize.define(invoice.name, invoice.object, invoice.options);

    await Invoice.model.sync();
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
