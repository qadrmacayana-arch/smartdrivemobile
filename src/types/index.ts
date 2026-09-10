export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  memberTier: string;
  walletBalance: number;
}

export interface BookingRecord {
  id: string;
  vehicleName: string;
  pickupDate: string;
  returnDate: string;
  days: number;
  totalAmount: number;
  paymentMethod: 'Credit / Debit Card' | 'GCash' | 'Maya' | 'SR Digital Cash Wallet';
  status: 'Confirmed' | 'Active' | 'Completed';
}

export interface VehicleReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}
