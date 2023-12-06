import { IInvoice } from 'models/invoice.model';
import { Invoice, User } from 'models';

export class CompanyService {

  public async users() {
    const usersPrevious = await User.model.findAll({ limit: 1 });

    if (!usersPrevious.length) {
      const values: Partial<IInvoice>[] = [
        { name: 'Lazar Eric', email: 'lazareric2@gmail.com' }
      ];

      const response = await User.model.bulkCreate(values);

      console.log('Users added');

      return response;
    }
  }

  public async invoices() {
    const invoicesPrevious = await Invoice.model.findAll({ limit: 1 });

    if (!invoicesPrevious.length) {
      const values: Partial<IInvoice>[] = [
        { to: 'Lazar Eric', city: 'Cacak', country: 'Serbia', user: 1 },
        { to: 'John Doe', city: 'Paris', country: 'France', user: 1 },
        { to: 'Mary Jane', city: 'Rome', country: 'Italy', user: 1 },
        { to: 'Anne Jany', city: 'Tokyo', country: 'Japan', user: 1 }
      ];

      const response = await Invoice.model.bulkCreate(values);

      console.log('Invoices added');

      return response;
    }
  }

  public async init() {
    // insert dummy data
    // for the example only
    // users
    await this.users();

    // invoices
    await this.invoices();
  }

}

export default new CompanyService();
