import { Sequelize } from 'sequelize';

import config from 'config';

export class MySQL {
  public sequelize: Sequelize;
  public connected = false;

  public constructor() {
    this.sequelize = new Sequelize({ dialect: 'mysql' });
  }

  public async connection() {
    if (this.connected) return this.sequelize;

    return this.connect();
  }

  public async connect() {
    try {
      this.sequelize = new Sequelize(config.value.db.mysql.uri);

      await this.sequelize.authenticate();

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
