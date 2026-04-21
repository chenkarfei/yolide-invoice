import { InvoiceData } from '@/lib/types';
import { format } from 'date-fns';
import Image from 'next/image';

interface Props {
  data: InvoiceData;
}

export function StandardTemplate({ data }: Props) {
  const customFormat = (dateStr: string) => {
    try {
      if (!dateStr) return '';
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  const subtotal = data.items.reduce((acc, item) => acc + Number(item.quantity) * Number(item.unitPrice), 0);
  const discountAmount = subtotal * (Number(data.discount) / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (Number(data.taxRate) / 100);
  const total = taxableAmount + taxAmount;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
    }).format(amount);
  };

  return (
    <div className="w-[700px] bg-white shadow-none print:shadow-none flex flex-col border-0 sm:border border-slate-200 text-slate-900 mx-auto relative overflow-hidden font-sans">
      {/* Background Geometry - Sublte purely for visual layer feeling */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-40 -left-20 w-48 h-48 bg-blue-50/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Layer - Subly tinted */}
      <div className="bg-slate-50/80 border-b border-slate-100 p-10 pt-10 relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600"></div>
        
        <div className="flex justify-between items-start">
          <div className="max-w-[60%]">
            {data.companyLogo ? (
               <div className="mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.companyLogo} alt="Company Logo" className="max-h-20 object-contain drop-shadow-sm" />
               </div>
            ) : (
              <div className="mb-6">
                <h3 className="font-black text-3xl tracking-tighter text-slate-900 uppercase">
                  {data.companyName || 'YOUR COMPANY NAME'}
                </h3>
                {data.companyRegNum && (
                  <div className="inline-block px-2 py-0.5 bg-slate-200/50 rounded mt-1">
                    <p className="text-[10px] text-slate-600 font-bold tracking-widest uppercase">Reg: {data.companyRegNum}</p>
                  </div>
                )}
              </div>
            )}
            <div className="text-xs text-slate-500 leading-relaxed max-w-xs font-medium">
              <span className="block whitespace-pre-line truncate">{data.companyAddress}</span>
              {data.companyContact && <span className="block mt-1 font-bold text-slate-600">{data.companyContact}</span>}
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-5xl font-black text-indigo-950 mb-1 tracking-tighter uppercase leading-none">Invoice</h1>
            <div className="inline-flex items-center gap-2 mb-6">
               <span className="h-px w-8 bg-indigo-200"></span>
               <p className="text-sm text-indigo-600 font-black tracking-tight">{data.invoiceNum || 'INV-0001'}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-1 text-[10px] uppercase font-bold tracking-widest text-slate-400">
               <div>Date Issue</div>
               <div className="text-slate-800 text-xs tracking-normal">{customFormat(data.issueDate)}</div>
               <div className="mt-2 text-indigo-400">Due Date</div>
               <div className="text-indigo-900 text-xs tracking-normal">{customFormat(data.dueDate)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-10 pt-6 flex-1 relative bg-white">
        {/* Client Info Grid - With Vertical Vertical Structural Anchors */}
        <div className="grid grid-cols-2 gap-12 mb-8 client-info">
          <div className="relative pl-6">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-full"></div>
            <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Invoice To</h4>
            <div className="space-y-1">
              <p className="font-black text-slate-950 text-base">{data.clientName || 'CLIENT NAME'}</p>
              {data.clientAddress && (
                 <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-line font-medium pr-4">
                   {data.clientAddress}
                 </p>
              )}
              {data.clientContact && <p className="text-xs text-slate-400 mt-2 font-bold">{data.clientContact}</p>}
            </div>
          </div>
        </div>

        {/* Embedded Items Table Well */}
        <div className="mb-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="py-4 font-bold px-6 text-[10px] uppercase tracking-[0.15em]">Item Description</th>
                  <th className="py-4 font-bold text-center w-20 px-4 text-[10px] uppercase tracking-[0.15em]">Qty</th>
                  <th className="py-4 font-bold text-right w-32 px-4 text-[10px] uppercase tracking-[0.15em]">Rate (RM)</th>
                  <th className="py-4 font-bold text-right w-36 px-6 text-[10px] uppercase tracking-[0.15em]">Amount (RM)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((item, index) => (
                  <tr key={item.id} className="group hover:bg-indigo-50/30 transition-colors">
                    <td className="py-5 px-6">
                      <div className="flex gap-4">
                         <span className="text-[10px] font-black text-slate-300 mt-1">{(index + 1).toString().padStart(2, '0')}</span>
                         <p className="font-bold text-slate-800 whitespace-pre-wrap leading-snug">{item.description || `Generic Item Detail`}</p>
                      </div>
                    </td>
                    <td className="py-5 text-center px-4 text-slate-600 font-bold">{item.quantity}</td>
                    <td className="py-5 text-right px-4 text-slate-500 font-medium">{formatCurrency(Number(item.unitPrice)).replace('RM', '').trim()}</td>
                    <td className="py-5 text-right px-6 text-slate-950 font-black tracking-tight">{formatCurrency(Number(item.quantity) * Number(item.unitPrice)).replace('RM', '').trim()}</td>
                  </tr>
                ))}
                {data.items.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <p className="text-slate-300 font-bold p-1 bg-slate-50 rounded italic text-xs inline-block">Awaiting invoice items...</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Layer Block */}
        <div className="flex justify-end gap-10 items-end financial-block">
          <div className="w-64 space-y-2 pb-4">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 px-2">
              <span>Subtotal</span>
              <span className="text-slate-900 tracking-normal">{formatCurrency(subtotal).replace('RM', '').trim()}</span>
            </div>
            {Number(data.discount) > 0 && (
              <div className="flex justify-between text-xs px-2 font-bold uppercase tracking-widest text-slate-400">
                <span>Discount <span className="text-[10px] text-red-400">(-{data.discount}%)</span></span>
                <span className="text-red-500 tracking-normal">-{formatCurrency(discountAmount).replace('RM', '').trim()}</span>
              </div>
            )}
            {Number(data.taxRate) > 0 && (
              <div className="flex justify-between text-xs px-2 font-bold uppercase tracking-widest text-slate-400">
                <span>SST <span className="text-[10px] text-slate-400">({data.taxRate}%)</span></span>
                <span className="text-slate-900 tracking-normal">{formatCurrency(taxAmount).replace('RM', '').trim()}</span>
              </div>
            )}
          </div>
          
          <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col gap-1 min-w-[240px] relative overflow-hidden shadow-xl shadow-indigo-100">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300/80 mb-2">Grand Total</span>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-bold text-slate-400">MYR</span>
              <span className="text-4xl font-black tracking-tighter leading-none">{formatCurrency(total).replace('RM', '').trim()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Styled Footer Layer */}
      <div className="p-8 pt-6 bg-slate-50/50 border-t border-slate-100 invoice-footer">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
          {data.notes && (
             <div>
               <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-600 mb-2">Office Notes</h5>
               <p className="whitespace-pre-line text-xs text-slate-500 leading-relaxed font-medium">{data.notes}</p>
             </div>
          )}
          {data.terms && (
             <div>
               <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Terms & Conditions</h5>
               <p className="whitespace-pre-line text-[10px] text-slate-400 leading-relaxed italic">{data.terms}</p>
             </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-200/50 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 underline decoration-blue-200 decoration-2 underline-offset-4">Digital Invoice Copy</p>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">
             Terima Kasih // Thank You
          </p>
        </div>
      </div>
    </div>
  );
}
