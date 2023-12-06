
export class BaseModel {

  public toObjectResponse() {
    const value: any = { ...this };

    const toRemove = [];

    toRemove.forEach(item => delete value[item]);

    return value;
  }

  public toObjectMySQL() {
    const value: any = { ...this };

    const toRemove = [];

    toRemove.forEach(item => delete value[item]);

    return value;
  }
}

export default BaseModel;
