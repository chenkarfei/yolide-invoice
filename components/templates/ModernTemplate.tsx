import { InvoiceData } from '@/lib/types';
import { format } from 'date-fns';

interface Props {
  data: InvoiceData;
}

export function ModernTemplate({ data }: Props) {
  const customFormat = (dateStr?: string) => {
    try {
      if (!dateStr) return '';
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch (e) {
      return dateStr || '';
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
    <div className="bg-white p-0 w-full mx-auto text-sm text-gray-800 flex flex-col font-sans overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#155DFC] via-[#155DFC] to-[#0A3D91] text-white p-8 flex justify-between items-center rounded-b-[40px] shadow-2xl overflow-hidden">
        {/* Abstract Geometric Overlays */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-10 -left-10 w-64 h-64 border-[40px] border-white rounded-full"></div>
          <div className="absolute -bottom-20 -right-10 w-80 h-80 border-[60px] border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl opacity-30"></div>
        </div>

        <div className="flex flex-col max-w-[50%] relative z-10">
          {data.companyLogo ? (
            <div className="mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.companyLogo} alt="Company Logo" className="max-h-20 object-contain drop-shadow-md" />
            </div>
          ) : (
            <div className="text-3xl font-black tracking-tighter mb-2 uppercase leading-none">{data.companyName || 'YOUR COMPANY'}</div>
          )}
          {data.companyRegNum && (
            <div className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded mt-1 w-fit">
              <p className="text-[10px] text-white font-bold tracking-widest">REG: {data.companyRegNum}</p>
            </div>
          )}
        </div>

        <div className="text-right relative z-10">
          <h1 className="text-6xl font-black text-white/10 uppercase tracking-tighter absolute -top-4 right-0 scale-y-125 select-none ornament-text">Invoice</h1>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-inner mt-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">Invoice Number</p>
            <div className="text-2xl font-black tracking-tighter">{data.invoiceNum || 'INV-0001'}</div>
          </div>
        </div>
      </div>

      <div className="px-10 py-8 flex justify-between">
        <div className="w-[45%]">
            <h3 className="text-[#155DFC] font-black uppercase tracking-widest text-[10px] mb-2 border-b-2 border-[#155DFC]/10 pb-1 w-fit">Invoice To</h3>
            <p className="text-xl font-black text-slate-900 mb-1">{data.clientName || 'Client Name'}</p>
            {data.clientAddress && <p className="whitespace-pre-line text-slate-600 font-medium leading-relaxed">{data.clientAddress}</p>}
            {data.clientContact && <p className="text-slate-400 mt-2 font-bold text-xs">{data.clientContact}</p>}
        </div>
        <div className="w-[45%] flex flex-col items-end text-right">
            <div className="bg-slate-50 p-5 rounded-2xl w-full border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-[#155DFC]"></div>
                <div className={`flex justify-between ${data.dueDate ? 'mb-3' : ''}`}>
                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Issue Date</span>
                    <span className="font-black text-slate-900">{customFormat(data.issueDate)}</span>
                </div>
                {data.dueDate && (
                  <div className="flex justify-between">
                      <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Due Date</span>
                      <span className="font-black text-red-500">{customFormat(data.dueDate)}</span>
                  </div>
                )}
            </div>
             <div className="mt-6 text-right">
                <h3 className="text-[#155DFC] font-black uppercase tracking-widest text-[10px] mb-2 border-b-2 border-[#155DFC]/10 pb-1 w-fit ml-auto">Company Details</h3>
                <p className="whitespace-pre-line text-slate-600 font-medium leading-relaxed italic">{data.companyAddress}</p>
                {data.companyContact && <p className="text-slate-900 mt-1 font-black text-xs">{data.companyContact}</p>}
             </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="px-10 flex-1">
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-900">
              <tr>
                <th className="py-4 px-4 font-bold uppercase text-xs tracking-wider">Description</th>
                <th className="py-4 px-4 font-bold uppercase text-xs tracking-wider text-center w-24">QTY</th>
                <th className="py-4 px-4 font-bold uppercase text-xs tracking-wider text-right w-32">Price</th>
                <th className="py-4 px-4 font-bold uppercase text-xs tracking-wider text-right w-32">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.items.map((item, index) => (
                <tr key={item.id} className="bg-white">
                  <td className="py-4 px-4 whitespace-pre-wrap font-medium text-gray-800">{item.description || `Item ${index + 1}`}</td>
                  <td className="py-4 px-4 text-center text-gray-500">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-gray-500">{formatCurrency(Number(item.unitPrice))}</td>
                  <td className="py-4 px-4 text-right font-bold text-gray-900">{formatCurrency(Number(item.quantity) * Number(item.unitPrice))}</td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-400 italic bg-white">No items added to the invoice</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="px-10 mt-6 mb-8 flex justify-end">
        <div className="w-80 bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="flex justify-between py-1.5 text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium text-gray-900">{formatCurrency(subtotal)}</span>
          </div>
          {Number(data.discount) > 0 && (
            <div className="flex justify-between py-1.5 text-gray-600">
              <span>Discount ({data.discount}%)</span>
              <span className="text-red-500 font-medium">-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          {Number(data.taxRate) > 0 && (
            <div className="flex justify-between py-1.5 text-gray-600">
              <span>SST ({data.taxRate}%)</span>
              <span className="font-medium text-gray-900">{formatCurrency(taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between py-4 mt-3 border-t border-gray-200">
            <span className="text-xl font-bold text-gray-900">Total Due</span>
            <span className="text-xl font-black text-[#155DFC]">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      <div className="px-10 mt-auto pb-10">
        <div className="grid grid-cols-2 gap-8 text-sm text-gray-500 bg-gray-50 p-6 rounded-xl border border-gray-100">
          {data.notes && (
            <div>
              <h4 className="font-black text-[#155DFC] uppercase tracking-widest text-[10px] mb-2">Notes</h4>
              <p className="whitespace-pre-line leading-relaxed font-medium text-slate-700">{data.notes}</p>
            </div>
          )}
          {data.terms && (
            <div>
              <h4 className="font-black text-slate-400 uppercase tracking-widest text-[10px] mb-2">Terms & Conditions</h4>
              <p className="whitespace-pre-line leading-relaxed italic text-slate-400 text-xs">{data.terms}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
