import BaseService from "./base.service";

export class InvoiceService extends BaseService<undefined> {

  public constructor() {
    super(undefined, 'invoices', 'invoice');
  }

}

export default new InvoiceService();
