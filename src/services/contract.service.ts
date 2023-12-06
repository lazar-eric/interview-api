import BaseService from "./base.service";

export class ContractService extends BaseService<undefined> {

  public constructor() {
    super(undefined, 'contracts', 'contract');
  }

}

export default new ContractService();
