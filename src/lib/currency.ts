/**
 * Currency utilities for Indian Rupees (INR) formatting and validation
 */

export const formatINR = (amount: number): string => {
  // Handle edge cases
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  // Format with Indian number system (lakhs and crores)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  return formatter.format(amount);
};

export const formatINRCompact = (amount: number): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }

  // Convert to compact format (K, L, Cr)
  if (amount >= 10000000) { // 1 Crore
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) { // 1 Lakh
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) { // 1 Thousand
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const parseINR = (value: string): number => {
  // Remove currency symbol and spaces
  const cleaned = value.replace(/₹|,|\s/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const validateAmount = (amount: number): { valid: boolean; error?: string } => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return { valid: false, error: 'Please enter a valid amount' };
  }

  if (amount <= 0) {
    return { valid: false, error: 'Amount must be greater than zero' };
  }

  if (amount < 100) {
    return { valid: false, error: 'Minimum amount is ₹100' };
  }

  if (amount > 500000) {
    return { valid: false, error: 'Maximum amount is ₹5,00,000 per transaction' };
  }

  // Check for decimal places
  if (amount % 1 !== 0) {
    return { valid: false, error: 'Amount should be a whole number' };
  }

  return { valid: true };
};

export const calculateCompletionPercentage = (
  totalAmount: number, 
  remainingAmount: number
): number => {
  if (totalAmount === 0) return 0;
  
  const completed = totalAmount - remainingAmount;
  const percentage = (completed / totalAmount) * 100;
  
  return Math.min(Math.max(percentage, 0), 100); // Clamp between 0-100
};

export const getAmountColor = (amount: number): string => {
  if (amount >= 100000) return 'text-purple-600'; // 1L+
  if (amount >= 50000) return 'text-blue-600';    // 50K+
  if (amount >= 25000) return 'text-green-600';   // 25K+
  if (amount >= 10000) return 'text-yellow-600';  // 10K+
  return 'text-gray-600';                         // Below 10K
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'approved':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'pending':
    case 'matched':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'rejected':
    case 'cancelled':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'partially_matched':
      return 'text-purple-600 bg-purple-50 border-purple-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

// Format transaction status for display
export const formatStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'pending': 'Pending',
    'matched': 'Matched',
    'partially_matched': 'Partially Matched',
    'admin_pending': 'Admin Review',
    'approved': 'Approved',
    'completed': 'Completed',
    'rejected': 'Rejected',
    'cancelled': 'Cancelled',
    'payment_pending': 'Payment Pending',
    'receipt_uploaded': 'Receipt Uploaded',
    'admin_review': 'Admin Review'
  };

  return statusMap[status] || status;
};