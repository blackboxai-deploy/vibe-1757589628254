'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { formatINR, validateAmount } from '@/lib/currency';
import { toast } from 'sonner';

// Mock data for available withdrawals to match
const mockAvailableWithdrawals = [
  {
    id: '1',
    userId: 'user123',
    userName: 'Amit Patel',
    amount: 25000,
    remainingAmount: 15000,
    bankDetails: {
      accountNumber: '****1234',
      ifscCode: 'HDFC0001234',
      bankName: 'HDFC Bank'
    },
    createdAt: new Date('2024-01-15'),
    status: 'partially_matched'
  },
  {
    id: '2',
    userId: 'user456',
    userName: 'Priya Sharma',
    amount: 50000,
    remainingAmount: 50000,
    bankDetails: {
      accountNumber: '****5678',
      ifscCode: 'ICICI0005678',
      bankName: 'ICICI Bank'
    },
    createdAt: new Date('2024-01-14'),
    status: 'pending'
  },
  {
    id: '3',
    userId: 'user789',
    userName: 'Rajesh Kumar',
    amount: 10000,
    remainingAmount: 10000,
    bankDetails: {
      accountNumber: '****9876',
      ifscCode: 'SBI0009876',
      bankName: 'State Bank of India'
    },
    createdAt: new Date('2024-01-13'),
    status: 'pending'
  }
];

export default function DepositPage() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = (value: string) => {
    // Allow only numbers
    const numericValue = value.replace(/[^\d]/g, '');
    setAmount(numericValue);
  };

  const handleSubmit = async () => {
    const numericAmount = parseInt(amount);
    const validation = validateAmount(numericAmount);

    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    if (!selectedWithdrawal) {
      toast.error('Please select a withdrawal to match with');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Deposit request created successfully! Awaiting admin approval.');
      setAmount('');
      setDescription('');
      setSelectedWithdrawal(null);
      setIsSubmitting(false);
    }, 2000);
  };

  const getMatchType = (withdrawalAmount: number, depositAmount: number) => {
    if (depositAmount >= withdrawalAmount) {
      return 'Full Match';
    }
    return 'Partial Match';
  };

  const selectedWithdrawalData = mockAvailableWithdrawals.find(w => w.id === selectedWithdrawal);
  const numericAmount = parseInt(amount) || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          💰 Create Deposit Request
        </h1>
        <p className="text-gray-600">
          Enter your deposit amount and select a withdrawal to match with. All transactions require admin approval.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Deposit Details</CardTitle>
            <CardDescription>
              Enter the amount you want to deposit and select a withdrawal to match
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Deposit Amount (INR)</Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <Input
                  id="amount"
                  type="text"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="pl-8 text-lg font-medium"
                />
              </div>
              {amount && (
                <p className="text-sm text-gray-500">
                  Amount: {formatINR(parseInt(amount) || 0)}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Add a note about this deposit..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Match Preview */}
            {selectedWithdrawalData && numericAmount > 0 && (
              <Alert className="border-blue-200 bg-blue-50">
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Match Type:</span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {getMatchType(selectedWithdrawalData.remainingAmount, numericAmount)}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Your Deposit:</span>
                      <span className="font-semibold text-green-600">
                        {formatINR(numericAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Available to Match:</span>
                      <span className="font-semibold text-blue-600">
                        {formatINR(selectedWithdrawalData.remainingAmount)}
                      </span>
                    </div>
                    {numericAmount < selectedWithdrawalData.remainingAmount && (
                      <div className="flex justify-between items-center">
                        <span>Remaining After Match:</span>
                        <span className="font-semibold text-yellow-600">
                          {formatINR(selectedWithdrawalData.remainingAmount - numericAmount)}
                        </span>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Button 
              onClick={handleSubmit} 
              className="w-full bg-green-600 hover:bg-green-700"
              disabled={!amount || !selectedWithdrawal || isSubmitting}
            >
              {isSubmitting ? 'Creating Deposit...' : 'Create Deposit Request'}
            </Button>
          </CardContent>
        </Card>

        {/* Available Withdrawals */}
        <Card>
          <CardHeader>
            <CardTitle>Available Withdrawals</CardTitle>
            <CardDescription>
              Select a withdrawal request to match with your deposit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAvailableWithdrawals.map((withdrawal) => (
                <div
                  key={withdrawal.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedWithdrawal === withdrawal.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedWithdrawal(withdrawal.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{withdrawal.userName}</p>
                      <p className="text-sm text-gray-500">
                        {withdrawal.bankDetails.bankName}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        withdrawal.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-purple-100 text-purple-700'
                      }
                    >
                      {withdrawal.status === 'pending' ? 'Available' : 'Partially Matched'}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium">{formatINR(withdrawal.amount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available:</span>
                      <span className="font-semibold text-blue-600">
                        {formatINR(withdrawal.remainingAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Account:</span>
                      <span>{withdrawal.bankDetails.accountNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">IFSC:</span>
                      <span>{withdrawal.bankDetails.ifscCode}</span>
                    </div>
                  </div>

                  {selectedWithdrawal === withdrawal.id && (
                    <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                      <p className="text-sm text-blue-700 font-medium">
                        ✓ Selected for matching
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        You will transfer money to this account after admin approval
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ℹ️ How Deposit Matching Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">1️⃣</div>
              <h4 className="font-semibold mb-2">Create Request</h4>
              <p className="text-sm text-gray-600">
                Enter your deposit amount and select a withdrawal to match
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">2️⃣</div>
              <h4 className="font-semibold mb-2">Admin Approval</h4>
              <p className="text-sm text-gray-600">
                Our admin team reviews and approves the match
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">3️⃣</div>
              <h4 className="font-semibold mb-2">Transfer Money</h4>
              <p className="text-sm text-gray-600">
                Transfer the amount to the provided account details
              </p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl mb-2">4️⃣</div>
              <h4 className="font-semibold mb-2">Confirm Receipt</h4>
              <p className="text-sm text-gray-600">
                Upload receipt and UTR number to complete the transaction
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}