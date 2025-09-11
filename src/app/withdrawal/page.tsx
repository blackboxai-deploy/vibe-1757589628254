'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { formatINR, validateAmount, calculateCompletionPercentage } from '@/lib/currency';
import { toast } from 'sonner';

// Mock data for available deposits to match
const mockAvailableDeposits = [
  {
    id: '1',
    userId: 'user456',
    userName: 'Priya Sharma',
    amount: 10000,
    createdAt: new Date('2024-01-15'),
    status: 'pending'
  },
  {
    id: '2',
    userId: 'user789',
    userName: 'Rajesh Kumar',
    amount: 15000,
    createdAt: new Date('2024-01-14'),
    status: 'pending'
  },
  {
    id: '3',
    userId: 'user101',
    userName: 'Neha Gupta',
    amount: 25000,
    createdAt: new Date('2024-01-13'),
    status: 'pending'
  },
  {
    id: '4',
    userId: 'user202',
    userName: 'Vikram Singh',
    amount: 20000,
    createdAt: new Date('2024-01-12'),
    status: 'pending'
  }
];

// Mock user's existing withdrawals
const mockExistingWithdrawals = [
  {
    id: '1',
    amount: 25000,
    remainingAmount: 15000,
    status: 'partially_matched',
    matches: [
      { amount: 10000, userName: 'Amit Patel', status: 'completed' }
    ],
    createdAt: new Date('2024-01-10')
  },
  {
    id: '2',
    amount: 50000,
    remainingAmount: 50000,
    status: 'pending',
    matches: [],
    createdAt: new Date('2024-01-08')
  }
];

export default function WithdrawalPage() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'create' | 'manage'>('create');

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

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success('Withdrawal request created successfully! We are finding matches for you.');
      setAmount('');
      setDescription('');
      setIsSubmitting(false);
    }, 2000);
  };

  const getMatchingDeposits = (withdrawalAmount: number) => {
    return mockAvailableDeposits.filter(deposit => deposit.amount <= withdrawalAmount);
  };

  const numericAmount = parseInt(amount) || 0;
  const matchingDeposits = getMatchingDeposits(numericAmount);
  const totalMatchable = matchingDeposits.reduce((sum, deposit) => sum + deposit.amount, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          💸 Withdrawal Management
        </h1>
        <p className="text-gray-600">
          Create new withdrawal requests or manage your existing ones. Our system will automatically find matching deposits.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setSelectedTab('create')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'create'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Create New Withdrawal
        </button>
        <button
          onClick={() => setSelectedTab('manage')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            selectedTab === 'manage'
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Manage Existing ({mockExistingWithdrawals.length})
        </button>
      </div>

      {selectedTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Withdrawal Form */}
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Details</CardTitle>
              <CardDescription>
                Enter the amount you want to withdraw. Our system will find matching deposits automatically.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Withdrawal Amount (INR)</Label>
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
                  placeholder="Add a note about this withdrawal..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Matching Preview */}
              {numericAmount > 0 && (
                <Alert className="border-blue-200 bg-blue-50">
                  <AlertDescription>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Available Matches:</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {matchingDeposits.length} deposits found
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Your Withdrawal:</span>
                        <span className="font-semibold text-blue-600">
                          {formatINR(numericAmount)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Immediate Match Available:</span>
                        <span className="font-semibold text-green-600">
                          {formatINR(Math.min(totalMatchable, numericAmount))}
                        </span>
                      </div>
                      {totalMatchable < numericAmount && (
                        <div className="flex justify-between items-center">
                          <span>Remaining to Match:</span>
                          <span className="font-semibold text-yellow-600">
                            {formatINR(numericAmount - totalMatchable)}
                          </span>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleSubmit} 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!amount || isSubmitting}
              >
                {isSubmitting ? 'Creating Withdrawal...' : 'Create Withdrawal Request'}
              </Button>
            </CardContent>
          </Card>

          {/* Available Deposits */}
          <Card>
            <CardHeader>
              <CardTitle>Available Deposits for Matching</CardTitle>
              <CardDescription>
                These deposits can immediately match with your withdrawal
              </CardDescription>
            </CardHeader>
            <CardContent>
              {numericAmount > 0 ? (
                <div className="space-y-3">
                  {matchingDeposits.map((deposit) => (
                    <div
                      key={deposit.id}
                      className="p-4 border border-green-200 bg-green-50 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{deposit.userName}</p>
                          <p className="text-sm text-gray-500">
                            Available for immediate matching
                          </p>
                        </div>
                        <Badge className="bg-green-500 hover:bg-green-600">
                          Available
                        </Badge>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Deposit Amount:</span>
                        <span className="font-semibold text-green-600">
                          {formatINR(deposit.amount)}
                        </span>
                      </div>
                    </div>
                  ))}

                  {matchingDeposits.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">😔</div>
                      <p className="text-gray-500">
                        No matching deposits available for this amount right now.
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        Your withdrawal will be queued until matching deposits are available.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">💡</div>
                  <p className="text-gray-500">
                    Enter a withdrawal amount to see available matches
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Manage Existing Withdrawals */
        <div className="space-y-4">
          {mockExistingWithdrawals.map((withdrawal) => (
            <Card key={withdrawal.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Withdrawal Request #{withdrawal.id}
                      <Badge
                        variant="secondary"
                        className={
                          withdrawal.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : withdrawal.status === 'partially_matched'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {withdrawal.status.replace('_', ' ')}
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Created on {withdrawal.createdAt.toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatINR(withdrawal.amount)}
                    </div>
                    {withdrawal.remainingAmount > 0 && (
                      <div className="text-sm text-yellow-600">
                        {formatINR(withdrawal.remainingAmount)} remaining
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {withdrawal.remainingAmount > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>
                        {calculateCompletionPercentage(withdrawal.amount, withdrawal.remainingAmount).toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={calculateCompletionPercentage(withdrawal.amount, withdrawal.remainingAmount)}
                      className="h-3"
                    />
                  </div>
                )}

                {withdrawal.matches.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h4 className="font-semibold text-sm">Matched Deposits:</h4>
                    {withdrawal.matches.map((match, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-green-50 rounded">
                        <span className="text-sm">{match.userName}</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-green-600">
                            {formatINR(match.amount)}
                          </span>
                          <Badge className="bg-green-500 text-xs">
                            {match.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  {withdrawal.remainingAmount > 0 && (
                    <>
                      <Button variant="outline" size="sm">
                        Edit Amount
                      </Button>
                      <Button variant="outline" size="sm">
                        View Matches
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* How it Works */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ℹ️ How Withdrawal Matching Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">1️⃣</div>
              <h4 className="font-semibold mb-2">Create Request</h4>
              <p className="text-sm text-gray-600">
                Enter your withdrawal amount and description
              </p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">2️⃣</div>
              <h4 className="font-semibold mb-2">Auto Matching</h4>
              <p className="text-sm text-gray-600">
                Our system automatically finds matching deposits
              </p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">3️⃣</div>
              <h4 className="font-semibold mb-2">Admin Approval</h4>
              <p className="text-sm text-gray-600">
                Matches are reviewed and approved by admin
              </p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl mb-2">4️⃣</div>
              <h4 className="font-semibold mb-2">Receive Payment</h4>
              <p className="text-sm text-gray-600">
                Depositors transfer money to your account
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}