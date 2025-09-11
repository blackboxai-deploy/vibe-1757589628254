'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { formatINR, formatINRCompact, calculateCompletionPercentage } from '@/lib/currency';

// Mock data for dashboard
const mockStats = {
  totalDeposits: 2450000,
  totalWithdrawals: 1875000,
  pendingMatches: 12,
  completedTransactions: 45,
  successRate: 94.2
};

const mockRecentTransactions = [
  {
    id: '1',
    type: 'withdrawal',
    amount: 25000,
    remainingAmount: 15000,
    status: 'partially_matched',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    type: 'deposit',
    amount: 10000,
    remainingAmount: 0,
    status: 'completed',
    createdAt: new Date('2024-01-14')
  },
  {
    id: '3',
    type: 'withdrawal',
    amount: 50000,
    remainingAmount: 50000,
    status: 'pending',
    createdAt: new Date('2024-01-13')
  }
];

const mockMatches = [
  {
    id: '1',
    type: 'Your withdrawal matched',
    amount: 10000,
    otherUser: 'Priya Sharma',
    status: 'payment_pending',
    timeAgo: '2 hours ago'
  },
  {
    id: '2',
    type: 'Your deposit matched',
    amount: 25000,
    otherUser: 'Amit Patel',
    status: 'admin_review',
    timeAgo: '5 hours ago'
  }
];

export default function Dashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'approved': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'partially_matched': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTransactionType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to P2P Finance Platform
        </h1>
        <p className="text-gray-600 mb-4">
          Securely match your deposits and withdrawals with other users. All transactions are supervised by our admin team.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button className="bg-blue-600 hover:bg-blue-700">
            💰 Create Deposit
          </Button>
          <Button variant="outline">
            💸 Create Withdrawal
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
            <span className="text-2xl">📈</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatINRCompact(mockStats.totalDeposits)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
            <span className="text-2xl">📉</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatINRCompact(mockStats.totalWithdrawals)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              +8% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Matches</CardTitle>
            <span className="text-2xl">⏳</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockStats.pendingMatches}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <span className="text-2xl">🎯</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {mockStats.successRate}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Platform success rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Recent Transactions
            </CardTitle>
            <CardDescription>
              Your latest deposit and withdrawal requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {formatTransactionType(transaction.type)}
                      </span>
                      <Badge variant="secondary" className={`text-xs ${getStatusColor(transaction.status)} text-white`}>
                        {transaction.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {formatINR(transaction.amount)}
                    </div>
                    {transaction.type === 'withdrawal' && transaction.remainingAmount > 0 && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>
                            {calculateCompletionPercentage(transaction.amount, transaction.remainingAmount).toFixed(0)}%
                          </span>
                        </div>
                        <Progress 
                          value={calculateCompletionPercentage(transaction.amount, transaction.remainingAmount)}
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Remaining: {formatINR(transaction.remainingAmount)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Transactions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Matches */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔗 Recent Matches
            </CardTitle>
            <CardDescription>
              Your latest matched transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockMatches.map((match) => (
                <div key={match.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {match.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        with {match.otherUser}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {match.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-blue-600">
                      {formatINR(match.amount)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {match.timeAgo}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Matches
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ⚡ Quick Actions
          </CardTitle>
          <CardDescription>
            Common actions you can perform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-green-600 hover:bg-green-700">
              <span className="text-2xl">💰</span>
              <span>Create Deposit</span>
            </Button>
            <Button className="h-20 flex flex-col items-center justify-center space-y-2 bg-blue-600 hover:bg-blue-700">
              <span className="text-2xl">💸</span>
              <span>Create Withdrawal</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <span className="text-2xl">📋</span>
              <span>View History</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}