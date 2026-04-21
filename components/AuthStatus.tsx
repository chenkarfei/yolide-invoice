'use client';

import { useAuth } from '@/hooks/useAuth';
import { LogIn, LogOut, User } from 'lucide-react';

export function AuthStatus() {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  if (loading) {
    return <div className="h-10 w-full animate-pulse bg-slate-50 rounded-lg"></div>;
  }

  if (user) {
    return (
      <div className="flex flex-col gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-6">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt={user.displayName || 'User'} className="h-8 w-8 rounded-full border border-slate-200" />
          ) : (
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
               <User size={16} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-800 truncate">{user.displayName}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
          </div>
          <button 
            onClick={logout}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-red-100"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-6 flex flex-col gap-3">
      <div className="flex flex-col">
          <p className="text-xs font-bold text-blue-900">Sync with Cloud</p>
          <p className="text-[10px] text-blue-600">Login to save your invoices and company profile.</p>
      </div>
      <button
        onClick={loginWithGoogle}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors"
      >
        <LogIn size={16} />
        Sign in with Google
      </button>
    </div>
  );
}
