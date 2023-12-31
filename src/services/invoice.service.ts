import { Invoice } from 'models';
import BaseService from './base.service';

export class InvoiceService extends BaseService<undefined> {

  public constructor() {
    super(Invoice, 'invoices', 'invoice');
  }

}

export default new InvoiceService();
