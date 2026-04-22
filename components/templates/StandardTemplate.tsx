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
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-40 -left-20 w-48 h-48 bg-blue-50/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Layer - Premium Gradient */}
      <div className="relative bg-gradient-to-r from-[#155DFC] to-[#0A3D91] border-b-4 border-[#082F6D] p-6 pb-8 overflow-hidden">
        {/* Subtle Pattern Grid */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="flex justify-between items-start relative z-10 text-white">
          <div className="max-w-[60%]">
            {data.companyLogo ? (
               <div className="mb-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={data.companyLogo} alt="Company Logo" className="max-h-16 object-contain drop-shadow-md" />
               </div>
            ) : (
              <div className="mb-4">
                <h3 className="font-black text-2xl tracking-tighter text-white uppercase leading-none">
                  {data.companyName || 'YOUR COMPANY NAME'}
                </h3>
                {data.companyRegNum && (
                  <div className="inline-block px-2 py-0.5 bg-white/20 rounded mt-1 backdrop-blur-sm">
                    <p className="text-[10px] text-white font-bold tracking-widest uppercase">Reg: {data.companyRegNum}</p>
                  </div>
                )}
              </div>
            )}
            <div className="text-xs text-blue-100 leading-relaxed max-w-xs font-medium">
              <span className="block whitespace-pre-line truncate">{data.companyAddress}</span>
              {data.companyContact && <span className="block mt-1 font-bold text-white">{data.companyContact}</span>}
            </div>
          </div>

          <div className="text-right">
            <h1 className="text-5xl font-black text-white/10 mb-0 tracking-tighter uppercase leading-none select-none">Invoice</h1>
            <div className="inline-flex items-center gap-2 mb-4 bg-white/10 px-3 py-1 rounded-full backdrop-blur-md border border-white/10">
               <span className="h-2 w-2 bg-blue-400 rounded-full animate-pulse"></span>
               <p className="text-xs text-white font-black tracking-tight">{data.invoiceNum || 'INV-0001'}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-1 text-[10px] uppercase font-bold tracking-widest text-blue-200">
               <div>Date Issue</div>
               <div className="text-white text-xs tracking-normal">{customFormat(data.issueDate)}</div>
               <div className="mt-2 text-blue-300 opacity-60">Due Date</div>
               <div className="text-white text-xs tracking-normal font-black underline decoration-blue-400/50 underline-offset-4">{customFormat(data.dueDate)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 py-6 relative bg-white">
        {/* Client Info Grid - With Vertical Vertical Structural Anchors */}
        <div className="grid grid-cols-2 gap-12 mb-4 client-info break-inside-avoid">
          <div className="relative pl-6">
            <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#155DFC] rounded-full"></div>
            <h4 className="text-[10px] font-black text-[#155DFC] uppercase tracking-[0.2em] mb-2">Invoice To</h4>
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
        <div className="mb-4 break-inside-avoid">
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
                    <td className="py-3 px-6">
                      <div className="flex gap-4">
                         <span className="text-[10px] font-black text-slate-300 mt-0.5">{(index + 1).toString().padStart(2, '0')}</span>
                         <p className="font-bold text-slate-800 whitespace-pre-wrap leading-tight text-xs">{item.description || `Generic Item Detail`}</p>
                      </div>
                    </td>
                    <td className="py-3 text-center px-4 text-slate-600 font-bold text-xs">{item.quantity}</td>
                    <td className="py-3 text-right px-4 text-slate-500 font-medium text-xs">{formatCurrency(Number(item.unitPrice)).replace('RM', '').trim()}</td>
                    <td className="py-3 text-right px-6 text-slate-950 font-black tracking-tight text-xs">{formatCurrency(Number(item.quantity) * Number(item.unitPrice)).replace('RM', '').trim()}</td>
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
        <div className="flex justify-end gap-10 items-end financial-block break-inside-avoid">
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
          
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col gap-1 min-w-[220px] relative overflow-hidden shadow-xl shadow-blue-100">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -mr-10 -mt-10"></div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300/80 mb-1">Grand Total</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-bold text-slate-400">MYR</span>
              <span className="text-3xl font-black tracking-tighter leading-none">{formatCurrency(total).replace('RM', '').trim()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Styled Footer Layer */}
      <div className="p-6 pt-4 bg-slate-50/50 border-t border-slate-100 invoice-footer break-inside-avoid">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
          {data.notes && (
             <div>
               <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-[#155DFC] mb-1">Office Notes</h5>
               <p className="whitespace-pre-line text-[10px] text-slate-500 leading-relaxed font-medium">{data.notes}</p>
             </div>
          )}
          {data.terms && (
             <div>
               <h5 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">Terms & Conditions</h5>
               <p className="whitespace-pre-line text-[9px] text-slate-400 leading-tight italic">{data.terms}</p>
             </div>
          )}
        </div>

        <div className="pt-3 border-t border-slate-200/50 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="w-1.5 h-1.5 bg-[#155DFC] rounded-full animate-pulse"></div>
             <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 underline decoration-blue-200 decoration-1 underline-offset-4">Digital Invoice Copy</p>
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">
             Terima Kasih // Thank You
          </p>
        </div>
      </div>
    </div>
  );
}
