'use client';

import { useState } from 'react';
import { InvoiceData } from '@/lib/types';
import { InvoiceForm } from '@/components/InvoiceForm';
import { InvoicePreview } from '@/components/InvoicePreview';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';

export default function Home() {
  const { user } = useAuth();
  const [invoiceData, setInvoiceData] = useState<InvoiceData>(() => ({
    companyName: '',
    companyAddress: '',
    companyRegNum: '',
    companyContact: '',
    companyLogo: '',
    clientName: '',
    clientAddress: '',
    clientContact: '',
    invoiceNum: 'INV-0001',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    items: [],
    taxRate: 8,
    discount: 0,
    notes: '',
    terms: 'Payment is due within 14 days of the invoice date.\n\nPlease make payment to:\nBank Name:\nAccount Name:\nAccount No:',
    template: 'standard',
  }));

  const { saveProfile, saveInvoice } = useFirestoreData(user, invoiceData, setInvoiceData);

  return (
    <main className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans text-slate-900 flex-col lg:flex-row print:flex-col print:h-auto print:overflow-visible print:bg-white">
      <div className="w-full lg:w-96 h-[50vh] lg:h-screen border-r border-slate-200 bg-white shadow-sm z-10 relative print:hidden">
        <InvoiceForm 
          data={invoiceData} 
          onChange={setInvoiceData} 
          onSaveProfile={saveProfile}
          onSaveInvoice={saveInvoice}
        />
      </div>
      <div className="flex-1 h-[50vh] lg:h-screen flex flex-col relative z-0 print:h-auto print:block">
         <InvoicePreview data={invoiceData} />
      </div>
    </main>
  );
}
