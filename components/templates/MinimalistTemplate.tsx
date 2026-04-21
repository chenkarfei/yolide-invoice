import { InvoiceData } from '@/lib/types';
import { format } from 'date-fns';

interface Props {
  data: InvoiceData;
}

export function MinimalistTemplate({ data }: Props) {
  const customFormat = (dateStr: string) => {
    try {
      if (!dateStr) return '';
      return format(new Date(dateStr), 'dd/MM/yyyy');
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
    <div className="bg-white p-12 h-full w-full mx-auto text-sm text-black flex flex-col font-mono border border-gray-200">
      
      <div className="flex justify-between items-end mb-16 border-b-2 border-black pb-4">
        {data.companyLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={data.companyLogo} alt="Company Logo" className="max-h-16 object-contain grayscale" />
          ) : (
            <div className="text-2xl font-bold tracking-tighter uppercase">{data.companyName || 'COMPANY NAME'}</div>
        )}
        <div className="text-right text-lg uppercase tracking-widest font-bold">
           INVOICE #{data.invoiceNum || '0001'}
        </div>
      </div>

      <div className="flex justify-between mb-16">
        <div className="w-1/2 pr-4">
            <h3 className="uppercase tracking-widest text-xs font-bold mb-4 border-b border-gray-300 pb-1">From</h3>
            {data.companyRegNum && <p className="mb-1 text-xs">REG: {data.companyRegNum}</p>}
            <p className="whitespace-pre-line leading-relaxed text-sm mb-1">{data.companyAddress}</p>
            <p className="text-sm">{data.companyContact}</p>
        </div>
        <div className="w-1/2 pl-4">
            <h3 className="uppercase tracking-widest text-xs font-bold mb-4 border-b border-gray-300 pb-1">To</h3>
            <p className="font-bold text-base mb-1">{data.clientName || 'Client Name'}</p>
            {data.clientAddress && <p className="whitespace-pre-line leading-relaxed text-sm mb-1">{data.clientAddress}</p>}
            {data.clientContact && <p className="text-sm">{data.clientContact}</p>}
        </div>
      </div>

      <div className="flex justify-between mb-8 pb-4 border-b-2 border-black">
        <div className="w-1/2">
            <h3 className="uppercase tracking-widest text-xs font-bold mb-1">Issue Date</h3>
            <p className="text-base">{customFormat(data.issueDate)}</p>
        </div>
        <div className="w-1/2 text-right">
            <h3 className="uppercase tracking-widest text-xs font-bold mb-1">Due Date</h3>
            <p className="text-base">{customFormat(data.dueDate)}</p>
        </div>
      </div>

      <div className="flex-1">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-black">
              <th className="py-2 px-0 font-bold uppercase text-xs tracking-widest">Desc</th>
              <th className="py-2 px-0 font-bold uppercase text-xs tracking-widest text-center w-24">Qty</th>
              <th className="py-2 px-0 font-bold uppercase text-xs tracking-widest text-right w-32">Price</th>
              <th className="py-2 px-0 font-bold uppercase text-xs tracking-widest text-right w-32">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={item.id} className="border-b border-dotted border-gray-300">
                <td className="py-3 px-0 whitespace-pre-wrap">{item.description || `Item ${index + 1}`}</td>
                <td className="py-3 px-0 text-center">{item.quantity}</td>
                <td className="py-3 px-0 text-right">{formatCurrency(Number(item.unitPrice))}</td>
                <td className="py-3 px-0 text-right font-bold">{formatCurrency(Number(item.quantity) * Number(item.unitPrice))}</td>
              </tr>
            ))}
             {data.items.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400 italic">No items</td>
                </tr>
              )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-8 mb-12">
        <div className="w-64">
          <div className="flex justify-between py-1 text-sm">
            <span className="uppercase tracking-widest text-xs">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          {data.discount > 0 && (
            <div className="flex justify-between py-1 text-sm">
              <span className="uppercase tracking-widest text-xs">Discount</span>
              <span>-{formatCurrency(discountAmount)}</span>
            </div>
          )}
          {data.taxRate > 0 && (
            <div className="flex justify-between py-1 text-sm">
              <span className="uppercase tracking-widest text-xs">Tax (SST)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
          )}
          <div className="flex justify-between py-2 mt-2 border-y-2 border-black font-bold text-lg">
            <span className="uppercase tracking-widest">Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        {data.notes && (
          <div className="mb-4">
            <h4 className="font-bold uppercase tracking-widest text-xs border-b border-gray-300 mb-2 pb-1 inline-block">Notes</h4>
            <p className="whitespace-pre-line text-sm leading-relaxed">{data.notes}</p>
          </div>
        )}
        {data.terms && (
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs border-b border-gray-300 mb-2 pb-1 inline-block">Terms</h4>
            <p className="whitespace-pre-line text-sm leading-relaxed">{data.terms}</p>
          </div>
        )}
      </div>
    </div>
  );
}
