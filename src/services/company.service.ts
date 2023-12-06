import { IInvoice } from 'models/invoice.model';
import { Invoice } from 'models';

export class CompanyService {

  public invoices() {
    const values: Partial<IInvoice>[] = [
      { to: 'Lazar Eric', city: 'Cacak', country: 'Serbia', user: 1 },
      { to: 'John Doe', city: 'Paris', country: 'France', user: 1 },
      { to: 'Mary Jane', city: 'Rome', country: 'Italy', user: 1 },
      { to: 'Anne Jany', city: 'Tokyo', country: 'Japan', user: 1 }
    ];


  }

  public async init() {
    // insert dummy data
    // for the example only
    await this.invoices();
  }

}

export default new CompanyService();
