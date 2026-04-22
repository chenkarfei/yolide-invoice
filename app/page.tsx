'use client';

import { useState } from 'react';
import { InvoiceData } from '@/lib/types';
import { InvoiceForm } from '@/components/InvoiceForm';
import { InvoicePreview } from '@/components/InvoicePreview';
import { InvoiceLibrary } from '@/components/InvoiceLibrary';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { useFirestoreData } from '@/hooks/useFirestoreData';
import { Library, X } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const [showLibrary, setShowLibrary] = useState(false);
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

  const { saveProfile, saveInvoice, deleteInvoice, savedInvoices, isLoadingInvoices, fetchInvoices } = useFirestoreData(user, invoiceData, setInvoiceData);

  const handleSelectInvoice = (invoice: InvoiceData) => {
    setInvoiceData(invoice);
    if (window.innerWidth < 1024) {
      setShowLibrary(false);
    }
  };

  return (
    <main className="flex h-screen w-full bg-slate-100 overflow-hidden font-sans text-slate-900 flex-col lg:flex-row print:flex-col print:h-auto print:overflow-visible print:bg-white">
      {/* Library Sidebar (Desktop: Persistent or Toggleable, Mobile: Overlay) */}
      <div className={`
        fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:inset-auto lg:z-10
        ${showLibrary ? 'translate-x-0' : '-translate-x-full lg:hidden'}
        w-80 h-full border-r border-slate-200 bg-white shadow-xl lg:shadow-none print:hidden
      `}>
        <InvoiceLibrary 
          invoices={savedInvoices} 
          onSelect={handleSelectInvoice} 
          onDelete={deleteInvoice}
          isLoading={isLoadingInvoices}
          onClose={() => setShowLibrary(false)}
        />
      </div>

      <div className="w-full lg:w-96 h-[50vh] lg:h-screen border-r border-slate-200 bg-white shadow-sm z-10 relative print:hidden">
        <InvoiceForm 
          data={invoiceData} 
          onChange={setInvoiceData} 
          onSaveProfile={saveProfile}
          onSaveInvoice={saveInvoice}
          onToggleLibrary={() => setShowLibrary(!showLibrary)}
          isLibraryOpen={showLibrary}
        />
      </div>
      <div className="flex-1 h-[50vh] lg:h-screen flex flex-col relative z-0 print:h-auto print:block">
         <InvoicePreview data={invoiceData} />
      </div>
    </main>
  );
}
