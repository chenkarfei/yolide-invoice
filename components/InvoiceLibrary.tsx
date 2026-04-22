'use client';

import { InvoiceData } from '@/lib/types';
import { FileText, Calendar, User, ArrowRight, Loader2, X, Sparkles, Trash2, Check, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

interface Props {
  invoices: InvoiceData[];
  onSelect: (invoice: InvoiceData) => void;
  onDelete: (invoiceNum: string) => void;
  isLoading: boolean;
  onClose: () => void;
}

export function InvoiceLibrary({ invoices, onSelect, onDelete, isLoading, onClose }: Props) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const customFormat = (dateStr: string) => {
    try {
      if (!dateStr) return 'N/A';
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch (e) {
      return dateStr;
    }
  };

  const handleDelete = (e: React.MouseEvent, invoiceNum: string) => {
    e.stopPropagation();
    if (confirmDelete === invoiceNum) {
       onDelete(invoiceNum);
       setConfirmDelete(null);
    } else {
       setConfirmDelete(invoiceNum);
       // Auto reset after 3 seconds
       setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight">Invoice Library</h2>
          <p className="text-xs text-slate-500 font-medium tracking-wide uppercase">Your saved documents</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={32} />
            <p className="text-sm font-medium">Fetching your invoices...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
              <FileText size={32} />
            </div>
            <h3 className="text-slate-800 font-bold mb-1">No invoices found</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create and save your first invoice to see it appear here in your library.
            </p>
          </div>
        ) : (
          invoices.map((invoice) => (
            <div key={invoice.invoiceNum} className="group relative">
               <button
                 onClick={() => onSelect(invoice)}
                 className={`w-full text-left bg-white border rounded-xl p-4 transition-all relative overflow-hidden ${confirmDelete === invoice.invoiceNum ? 'border-red-500 shadow-lg shadow-red-50' : 'border-slate-200 hover:border-blue-500 hover:shadow-md hover:shadow-blue-50/50'}`}
               >
                 <div className="flex items-center justify-between mb-2">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#155DFC]">
                     {invoice.invoiceNum}
                   </span>
                   <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider">
                     <Calendar size={10} /> {customFormat(invoice.issueDate)}
                   </span>
                 </div>
                 
                 <h3 className="font-extrabold text-slate-900 mb-1 truncate pr-10 group-hover:text-blue-600 transition-colors">
                   {invoice.clientName || 'Unnamed Client'}
                 </h3>
                 
                 <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                       <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                          <User size={10} />
                       </div>
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight truncate max-w-[120px]">
                          {invoice.companyName || 'My Company'}
                       </span>
                    </div>
                    <div className="text-xs text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">
                       <ArrowRight size={14} />
                    </div>
                 </div>
                 
                 {confirmDelete === invoice.invoiceNum && (
                    <div className="absolute inset-0 bg-red-600/95 flex flex-col items-center justify-center text-white z-20 animate-in fade-in duration-200">
                       <AlertTriangle size={24} className="mb-2" />
                       <p className="text-[10px] font-black uppercase tracking-widest mb-1">Confirm Delete?</p>
                       <p className="text-[8px] font-bold opacity-80 uppercase tracking-tighter">Click red icon again to confirm</p>
                    </div>
                 )}
               </button>
               
               <button
                 onClick={(e) => handleDelete(e, invoice.invoiceNum || '')}
                 className={`absolute top-4 right-4 p-2 rounded-lg transition-all z-30 ${confirmDelete === invoice.invoiceNum ? 'text-white bg-red-800 scale-125' : 'text-slate-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100'}`}
                 title={confirmDelete === invoice.invoiceNum ? "Click again to confirm delete" : "Delete Invoice"}
               >
                 {confirmDelete === invoice.invoiceNum ? <Check size={16} /> : <Trash2 size={16} />}
               </button>
            </div>
          ))
        )}
      </div>
      
      <div className="p-6 bg-slate-50 border-t border-slate-200">
         <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600">
               <Sparkles size={16} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest leading-none mb-1">Storage Status</p>
               <p className="text-[10px] text-slate-500 font-medium">Cloud Sync Enabled</p>
            </div>
         </div>
      </div>
    </div>
  );
}
