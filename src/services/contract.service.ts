import { Contract } from 'models';
import BaseService from './base.service';

export class ContractService extends BaseService<undefined> {

  public constructor() {
    super(Contract, 'contracts', 'contract');
  }

}

export default new ContractService();
