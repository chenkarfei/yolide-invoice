import { InvoiceData } from '@/lib/types';
import { format } from 'date-fns';

interface Props {
  data: InvoiceData;
}

export function ModernTemplate({ data }: Props) {
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
    <div className="bg-white p-0 w-full mx-auto text-sm text-gray-800 flex flex-col font-sans overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6 flex justify-between items-center rounded-b-3xl">
        <div className="flex flex-col max-w-[50%]">
          {data.companyLogo ? (
            <div className="bg-white p-2 rounded-lg inline-block mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={data.companyLogo} alt="Company Logo" className="max-h-16 object-contain" />
            </div>
          ) : (
            <div className="text-3xl font-extrabold tracking-tight mb-2">{data.companyName || 'YOUR COMPANY'}</div>
          )}
          {data.companyRegNum && <p className="text-indigo-200">SSM: {data.companyRegNum}</p>}
        </div>
        <div className="text-right">
          <h1 className="text-5xl font-black text-white/20 uppercase tracking-widest -mt-4 mb-2">Invoice</h1>
          <div className="text-2xl font-bold">{data.invoiceNum || 'INV-0001'}</div>
        </div>
      </div>

      <div className="px-10 py-8 flex justify-between">
        <div className="w-[45%]">
            <h3 className="text-indigo-600 font-bold uppercase tracking-wider text-xs mb-2">Invoice To</h3>
            <p className="text-xl font-bold text-gray-900 mb-1">{data.clientName || 'Client Name'}</p>
            {data.clientAddress && <p className="whitespace-pre-line text-gray-600">{data.clientAddress}</p>}
            {data.clientContact && <p className="text-gray-600 mt-1">{data.clientContact}</p>}
        </div>
        <div className="w-[45%] flex flex-col items-end text-right">
            <div className="bg-gray-50 p-4 rounded-xl w-full">
                <div className="flex justify-between mb-2">
                    <span className="text-gray-500 font-medium">Issue Date</span>
                    <span className="font-semibold text-gray-900">{customFormat(data.issueDate)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">Due Date</span>
                    <span className="font-semibold text-gray-900">{customFormat(data.dueDate)}</span>
                </div>
            </div>
             <div className="mt-4 text-right">
                <h3 className="text-indigo-600 font-bold uppercase tracking-wider text-xs mb-1">Company Details</h3>
                <p className="whitespace-pre-line text-gray-600">{data.companyAddress}</p>
                <p className="text-gray-600 mt-1">{data.companyContact}</p>
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
            <span className="text-xl font-black text-indigo-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Notes & Terms */}
      <div className="px-10 mt-auto pb-10">
        <div className="grid grid-cols-2 gap-8 text-sm text-gray-500 bg-gray-50 p-6 rounded-xl border border-gray-100">
          {data.notes && (
            <div>
              <h4 className="font-bold text-indigo-900 uppercase tracking-wider text-xs mb-2">Notes</h4>
              <p className="whitespace-pre-line leading-relaxed">{data.notes}</p>
            </div>
          )}
          {data.terms && (
            <div>
              <h4 className="font-bold text-indigo-900 uppercase tracking-wider text-xs mb-2">Terms & Conditions</h4>
              <p className="whitespace-pre-line leading-relaxed">{data.terms}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
