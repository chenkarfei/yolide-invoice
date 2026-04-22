'use client';

import { InvoiceData } from '@/lib/types';
import { StandardTemplate } from './templates/StandardTemplate';
import { ModernTemplate } from './templates/ModernTemplate';
import { Printer } from 'lucide-react';

interface Props {
  data: InvoiceData;
}

export function InvoicePreview({ data }: Props) {
  const handlePrint = () => {
    try {
      const isIframe = window.self !== window.top;
      if (isIframe) {
        console.log('Printing from iframe... if dialog does not appear, click the "Open App" icon at the top.');
      }
      
      const printWindow = window.top || window;
      printWindow.focus();
      printWindow.print();
    } catch (e) {
      window.focus();
      window.print();
    }
  };

  const renderTemplate = () => {
    switch (data.template) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'standard':
      default:
        return <StandardTemplate data={data} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-100/50 relative print:bg-white" id="invoice-root">
      <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white border-b border-slate-200 shadow-sm print:hidden">
        <h2 className="text-lg font-semibold text-slate-800 tracking-tight">Live Preview</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded shadow-lg hover:bg-blue-700 transition-colors font-bold text-sm"
          >
            <Printer size={18} />
            Export to PDF / Print
          </button>
        </div>
      </div>
      
      {/* Zoom container to fit preview in right panel */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center bg-slate-100 pb-20 print:p-0 print:overflow-visible print:bg-white print:block">
        <div className="w-[700px] origin-top shadow-2xl bg-white transition-transform duration-300 print:transform-none print:shadow-none print:m-0 print:w-full print:min-h-0 scale-[0.8] sm:scale-90 md:scale-100 lg:scale-[0.8] xl:scale-90 2xl:scale-100">
          <div className="w-full h-full print:w-full">
            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
}
