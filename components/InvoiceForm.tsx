'use client';

import { InvoiceData, InvoiceItem, TemplateType } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Trash2, Image as ImageIcon, Sparkles, Save } from 'lucide-react';
import { ChangeEvent } from 'react';
import { AuthStatus } from './AuthStatus';

interface Props {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
  onSaveProfile?: () => void;
  onSaveInvoice?: () => void;
}

export function InvoiceForm({ data, onChange, onSaveProfile, onSaveInvoice }: Props) {
  const updateField = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('companyLogo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    const newItem: InvoiceItem = { id: uuidv4(), description: '', quantity: 1, unitPrice: '' };
    updateField('items', [...data.items, newItem]);
  };

  const removeItem = (id: string) => {
    updateField('items', data.items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    updateField(
      'items',
      data.items.map(item => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  return (
    <div className="p-6 space-y-8 bg-white h-full overflow-y-auto w-full max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold">MY</div>
          <h1 className="text-lg font-bold tracking-tight text-slate-800 uppercase">InvoisPro</h1>
        </div>
        <button 
           onClick={onSaveInvoice} 
           className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
        >
          <Save size={16} /> Save Invoice
        </button>
      </div>

      <AuthStatus />

      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 border-b-0 pb-0">Settings</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Template</label>
            <select
              title="Select Template"
              className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={data.template}
              onChange={(e) => updateField('template', e.target.value as TemplateType)}
            >
              <option value="standard">Standard</option>
              <option value="modern">Modern</option>
              <option value="minimalist">Minimalist</option>
            </select>
          </div>
          <div>
             <label className="block text-xs font-medium text-slate-600 mb-1">SST / Tax Rate (%)</label>
             <input
                title="SST Rate"
                type="number"
                min="0"
                step="0.1"
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={data.taxRate}
                onChange={(e) => updateField('taxRate', e.target.value)}
              />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-0 pb-0 mb-3">
           <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Your Company Info</h2>
           <button 
            onClick={onSaveProfile}
            className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded font-bold transition-colors flex items-center gap-1.5"
           >
              <Sparkles size={12} className="text-blue-500" /> Remember My Info
           </button>
        </div>
        
        <div className="mb-4">
           <label className="block text-xs font-medium text-slate-600 mb-1">Company Logo</label>
           <div className="flex items-center gap-4">
               {data.companyLogo ? (
                   <>
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={data.companyLogo} alt="Logo Preview" className="h-16 object-contain border rounded-md bg-white p-1" />
                     <button onClick={() => updateField('companyLogo', '')} className="text-xs text-red-500 hover:text-red-700 px-3 py-1.5 border border-red-200 rounded bg-red-50 hover:bg-red-100 transition-colors shadow-sm">Remove Logo</button>
                   </>
               ) : (
                   <label className="h-20 w-40 border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100">
                       <ImageIcon size={20} className="mb-1" />
                       <span className="text-[10px]">Upload PNG/JPG</span>
                       <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" title="Upload company logo" />
                   </label>
               )}
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Company Name</label>
            <input
              type="text"
              placeholder="e.g. Acme SDN BHD"
              className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500"
              value={data.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              title="Company Name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">SSM / Registration No</label>
            <input
              type="text"
              placeholder="e.g. 202301001234"
              className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500"
              value={data.companyRegNum}
              onChange={(e) => updateField('companyRegNum', e.target.value)}
              title="Registration number"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
            <textarea
              placeholder="Full address"
              rows={2}
              className="w-full text-sm border border-slate-300 rounded px-3 py-2 h-16 resize-none bg-slate-50 focus:ring-2 focus:ring-blue-500"
              value={data.companyAddress}
              onChange={(e) => updateField('companyAddress', e.target.value)}
              title="Company address"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Contact Info (Phone / Email)</label>
            <input
              type="text"
              placeholder="hello@acme.com.my | +6012-3456789"
              className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500"
              value={data.companyContact}
              onChange={(e) => updateField('companyContact', e.target.value)}
              title="Company contact info"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 border-b-0 pb-0">Client Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Client Name / Business Name</label>
            <input
              type="text"
              className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500"
              value={data.clientName}
              onChange={(e) => updateField('clientName', e.target.value)}
              title="Client name"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
            <textarea
              rows={2}
              className="w-full text-sm border border-slate-300 rounded px-3 py-2 h-16 resize-none bg-slate-50 focus:ring-2 focus:ring-blue-500"
              value={data.clientAddress}
              onChange={(e) => updateField('clientAddress', e.target.value)}
              title="Client address"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-slate-600 mb-1">Contact Info</label>
            <input
              type="text"
              className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500"
              value={data.clientContact}
              onChange={(e) => updateField('clientContact', e.target.value)}
              title="Client contact info"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 border-b-0 pb-0">Invoice Details</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Invoice Number</label>
            <input
              type="text"
              className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500"
              value={data.invoiceNum}
              onChange={(e) => updateField('invoiceNum', e.target.value)}
              title="Invoice number"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Issue Date</label>
            <input
              type="date"
              className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500"
              value={data.issueDate}
              onChange={(e) => updateField('issueDate', e.target.value)}
              title="Issue date"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Due Date</label>
            <input
              type="date"
              className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500"
              value={data.dueDate}
              onChange={(e) => updateField('dueDate', e.target.value)}
              title="Due date"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b-0 pb-0 mb-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Items</h2>
          <button
            onClick={addItem}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
        
        {data.items.length === 0 ? (
           <div className="text-center p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm">
               No items added yet. Click &quot;Add Item&quot; to begin.
           </div>
        ) : (
          <div className="space-y-3">
            {data.items.map((item) => (
              <div key={item.id} className="flex gap-3 items-start bg-slate-50 p-3 rounded-lg border border-slate-200 shadow-sm relative group">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Item description"
                    className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    title="Item description"
                  />
                </div>
                <div className="w-20">
                  <input
                    type="number"
                    min="1"
                    className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                    title="Quantity"
                  />
                </div>
                <div className="w-28 relative">
                   <span className="absolute left-2 text-slate-400 top-2 text-sm">RM</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    className="w-full text-sm border border-slate-300 rounded pl-8 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                    title="Unit Price"
                  />
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                  title="Remove Item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

       <div className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 border-b-0 pb-0">Discount & Extras</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
             <label className="block text-xs font-medium text-slate-600 mb-1">Discount (%)</label>
             <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={data.discount}
                onChange={(e) => updateField('discount', e.target.value)}
                title="Discount format"
              />
          </div>
        </div>
      </div>

      <div className="space-y-4 pb-8">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 border-b-0 pb-0">Notes & Terms</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Notes to Client</label>
            <textarea
              placeholder="e.g. Thank you for your business!"
              rows={2}
              className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500 resize-none h-16"
              value={data.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              title="Notes to client"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Terms & Conditions (e.g. Bank Details)</label>
            <textarea
              placeholder="Please make payment to:
Bank Name: Maybank
Account No: 1122334455
Account Name: Acme SDN BHD"
              rows={4}
              className="w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500 resize-none h-24"
              value={data.terms}
              onChange={(e) => updateField('terms', e.target.value)}
              title="Terms and Conditions"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
