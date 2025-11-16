
export type User = { 
  id: string; // Firestore document ID
  name?: string; 
  email: string; 
  phone?: string;
  photoUrl?: string;
  // password hash should be stored, not the password itself. For simplicity, we might omit it on client type.
  registered: boolean; 
  pageSubmitted: boolean;
  schoolId: string;
  year: string;
  classId?: string;
  role: 'student' | 'admin';
  createdAt?: string;
};

export type School = {
  id: string;
  name: string;
  createdAt: string;
  studentCount: number;
};

export type ContactRequest = {
  id: string;
  schoolName: string;
  name: string;
  email: string;
  phone: string;
  date: string;
};

export type PrintedProduct = {
    id: string;
    name: string;
    features: string;
    price: string;
    photoUrl?: string;
};

export type PaymentSettings = {
    creditCard: {
        iyzico: {
            enabled: boolean;
            apiKey: string;
            apiSecret: string;
            mode: 'sandbox' | 'live';
        },
        paytr: {
            enabled: boolean;
            merchantId: string;
            merchantKey: string;
            merchantSalt: string;
        },
         param: {
            enabled: boolean;
            clientCode: string;
            clientUsername: string;
            clientPassword: string;
        }
    };
    bankTransfer: {
        enabled: boolean;
        accountHolder: string;
        iban: string;
        bankName: string;
    }
}

export type Order = {
    id: string;
    productId: string;
    productName: string;
    price: string;
    customerName: string;
    customerEmail?: string;
    shippingAddress: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        zip: string;
    };
    paymentMethod: 'creditCard' | 'bankTransfer';
    orderDate: string;
    status: 'pending' | 'paid' | 'shipped';
    tracking?: {
        company: string;
        number: string;
    };
}
