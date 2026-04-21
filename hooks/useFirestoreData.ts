import { useEffect } from 'react';
import { doc, getDoc, setDoc, getDocFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError } from '@/lib/firestore-utils';
import { InvoiceData } from '@/lib/types';

export function useFirestoreData(user: any, invoiceData: InvoiceData, setInvoiceData: (data: InvoiceData) => void) {
  
  // Test connection on boot as per instructions
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error: any) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  // Load profile when user logs in
  useEffect(() => {
    if (!user) return;

    async function loadProfile() {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const profile = docSnap.data();
          setInvoiceData({
            ...invoiceData,
            companyName: profile.companyName || invoiceData.companyName,
            companyAddress: profile.companyAddress || invoiceData.companyAddress,
            companyRegNum: profile.companyRegNum || invoiceData.companyRegNum,
            companyContact: profile.companyContact || invoiceData.companyContact,
            companyLogo: profile.companyLogo || invoiceData.companyLogo,
            taxRate: profile.defaultTaxRate ?? invoiceData.taxRate,
            terms: profile.defaultTerms || invoiceData.terms,
          });
        }
      } catch (err) {
        handleFirestoreError(err, 'get', `users/${user.uid}`);
      }
    }

    loadProfile();
  }, [user, setInvoiceData, invoiceData]);

  const saveProfile = async () => {
    if (!user) return;
    
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        companyName: invoiceData.companyName,
        companyAddress: invoiceData.companyAddress,
        companyRegNum: invoiceData.companyRegNum,
        companyContact: invoiceData.companyContact,
        companyLogo: invoiceData.companyLogo,
        defaultTaxRate: invoiceData.taxRate,
        defaultTerms: invoiceData.terms,
        updatedAt: new Date().toISOString(),
      });
      alert('Profile saved successfully!');
    } catch (err) {
      handleFirestoreError(err, 'write', `users/${user.uid}`);
    }
  };

  const saveInvoice = async () => {
    if (!user) {
        alert('Please sign in to save invoices.');
        return;
    }

    try {
        const invoiceId = invoiceData.invoiceNum || `INV-${Date.now()}`;
        const docRef = doc(db, 'users', user.uid, 'invoices', invoiceId);
        await setDoc(docRef, {
            ...invoiceData,
            userId: user.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });
        alert('Invoice saved successfully!');
    } catch (err) {
        handleFirestoreError(err, 'write', `users/${user.uid}/invoices/new`);
    }
  };

  return { saveProfile, saveInvoice };
}
