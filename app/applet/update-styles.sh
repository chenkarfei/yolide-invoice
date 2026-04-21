#!/bin/bash
sed -i 's/text-lg font-semibold text-slate-800 border-b pb-2/text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3 border-b-0 pb-0/g' ./components/InvoiceForm.tsx
sed -i 's/block text-sm font-medium text-slate-700 mb-1/block text-xs font-medium text-slate-600 mb-1/g' ./components/InvoiceForm.tsx
sed -i 's/w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500/w-full text-sm border border-slate-300 rounded px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-blue-500 transition-colors/g' ./components/InvoiceForm.tsx
sed -i 's/focus:border-indigo-500/focus:border-blue-500/g' ./components/InvoiceForm.tsx
sed -i 's/text-lg font-semibold text-slate-800/text-xs font-semibold text-slate-400 uppercase tracking-widest/g' ./components/InvoiceForm.tsx
sed -i 's/items-center justify-between border-b pb-2/items-center justify-between border-b-0 pb-0/g' ./components/InvoiceForm.tsx
sed -i 's/bg-indigo-600/bg-blue-600/g' ./components/InvoicePreview.tsx
sed -i 's/hover:bg-indigo-700/hover:bg-blue-700/g' ./components/InvoicePreview.tsx
sed -i 's/text-indigo-600/text-blue-600/g' ./components/InvoiceForm.tsx
sed -i 's/hover:text-indigo-800/hover:text-blue-800/g' ./components/InvoiceForm.tsx
