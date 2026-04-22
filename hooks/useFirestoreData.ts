import { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, setDoc, getDocFromServer, collection, getDocs, orderBy, query, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { handleFirestoreError } from '@/lib/firestore-utils';
import { InvoiceData } from '@/lib/types';

export function useFirestoreData(user: any, invoiceData: InvoiceData, setInvoiceData: (data: InvoiceData) => void) {
  const [savedInvoices, setSavedInvoices] = useState<InvoiceData[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  
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

  // Load invoices list
  const fetchInvoices = useCallback(async () => {
    if (!user) return;
    setIsLoadingInvoices(true);
    try {
      const q = query(
        collection(db, 'users', user.uid, 'invoices'),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const invoices: InvoiceData[] = [];
      querySnapshot.forEach((doc) => {
        invoices.push(doc.data() as InvoiceData);
      });
      setSavedInvoices(invoices);
    } catch (err) {
      handleFirestoreError(err, 'list', `users/${user.uid}/invoices`);
    } finally {
      setIsLoadingInvoices(false);
    }
  }, [user]);

  // Load invoices when user changes
  useEffect(() => {
    if (user) {
      fetchInvoices();
    } else {
      setSavedInvoices([]);
    }
  }, [user, fetchInvoices]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, setInvoiceData]);

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
        
        // Check if invoice exists to preserve createdAt
        const docSnap = await getDoc(docRef);
        let createdAt = new Date().toISOString();
        
        if (docSnap.exists()) {
            createdAt = docSnap.data().createdAt || createdAt;
        }

        await setDoc(docRef, {
            ...invoiceData,
            userId: user.uid,
            createdAt: createdAt,
            updatedAt: new Date().toISOString(),
        });
        alert('Invoice saved successfully!');
        fetchInvoices(); // Refresh list after saving
    } catch (err) {
        handleFirestoreError(err, 'write', `users/${user.uid}/invoices/new`);
    }
  };

  const deleteInvoice = async (invoiceNum: string) => {
    if (!user) return;
    
    try {
      const docRef = doc(db, 'users', user.uid, 'invoices', invoiceNum);
      await deleteDoc(docRef);
      fetchInvoices();
    } catch (err) {
      handleFirestoreError(err, 'delete', `users/${user.uid}/invoices/${invoiceNum}`);
    }
  };

  return { saveProfile, saveInvoice, deleteInvoice, savedInvoices, isLoadingInvoices, fetchInvoices };
}
