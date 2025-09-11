export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  remainingAmount: number; // For partial matching
  status: TransactionStatus;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  matches: Match[];
  completionPercentage: number;
}

export type TransactionStatus = 
  | 'pending'
  | 'matched'
  | 'partially_matched'
  | 'admin_pending'
  | 'approved'
  | 'completed'
  | 'rejected'
  | 'cancelled';

export interface Match {
  id: string;
  withdrawalId: string;
  depositId: string;
  amount: number;
  status: MatchStatus;
  adminApproved: boolean;
  createdAt: Date;
  approvedAt?: Date;
  withdrawalUser: MatchUser;
  depositUser: MatchUser;
  receipt?: Receipt;
}

export type MatchStatus = 
  | 'pending'
  | 'payment_pending'
  | 'receipt_uploaded'
  | 'admin_review'
  | 'approved'
  | 'completed'
  | 'rejected';

export interface MatchUser {
  id: string;
  name: string;
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName: string;
  };
}

export interface Receipt {
  id: string;
  matchId: string;
  utrNumber: string;
  receiptUrl: string;
  uploadedAt: Date;
  verified: boolean;
}

export interface CreateTransactionRequest {
  type: 'deposit' | 'withdrawal';
  amount: number;
  description?: string;
}

export interface EditTransactionRequest {
  transactionId: string;
  newAmount: number;
  reason: string;
}

export interface UploadReceiptRequest {
  matchId: string;
  utrNumber: string;
  receiptFile: File;
}

export interface TransactionSummary {
  totalDeposits: number;
  totalWithdrawals: number;
  pendingMatches: number;
  completedTransactions: number;
  totalVolume: number;
}