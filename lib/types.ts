export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number | string;
  unitPrice: number | string;
}

export type TemplateType = 'standard' | 'modern';

export interface InvoiceData {
  companyName: string;
  companyAddress: string;
  companyRegNum: string;
  companyContact: string;
  companyLogo: string;

  clientName: string;
  clientAddress: string;
  clientContact: string;

  invoiceNum: string;
  issueDate: string;
  dueDate?: string;

  items: InvoiceItem[];

  taxRate: number | string; // For SST
  discount: number | string;

  notes: string;
  terms: string;

  template: TemplateType;
}
