'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatINR, getStatusColor, formatStatus } from '@/lib/currency';
import { Transaction } from '@/types/transaction';

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: 'user_123',
    type: 'withdrawal',
    amount: 25000,
    remainingAmount: 15000,
    status: 'partially_matched',
    description: 'Emergency fund withdrawal',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-15T14:20:00'),
    completionPercentage: 40,
    matches: [
      {
        id: 'm1',
        withdrawalId: '1',
        depositId: 'd1',
        amount: 10000,
        status: 'completed',
        adminApproved: true,
        createdAt: new Date('2024-01-15T11:00:00'),
        approvedAt: new Date('2024-01-15T14:00:00'),
        withdrawalUser: {
          id: 'user_123',
          name: 'You',
          bankDetails: {
            accountNumber: '****1234',
            ifscCode: 'HDFC0001234',
            accountHolderName: 'Current User',
            bankName: 'HDFC Bank'
          }
        },
        depositUser: {
          id: 'user_456',
          name: 'Priya Sharma',
          bankDetails: {
            accountNumber: '****5678',
            ifscCode: 'ICIC0005678',
            accountHolderName: 'Priya Sharma',
            bankName: 'ICICI Bank'
          }
        },
        receipt: {
          id: 'r1',
          matchId: 'm1',
          utrNumber: 'UTR123456789',
          receiptUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cbcf3a0b-a04b-4d46-8751-3cab34ef4914.png',
          uploadedAt: new Date('2024-01-15T13:30:00'),
          verified: true
        }
      }
    ]
  },
  {
    id: '2',
    userId: 'user_123',
    type: 'deposit',
    amount: 15000,
    remainingAmount: 0,
    status: 'completed',
    description: 'Investment deposit',
    createdAt: new Date('2024-01-14T09:15:00'),
    updatedAt: new Date('2024-01-14T16:45:00'),
    completionPercentage: 100,
    matches: [
      {
        id: 'm2',
        withdrawalId: 'w2',
        depositId: '2',
        amount: 15000,
        status: 'completed',
        adminApproved: true,
        createdAt: new Date('2024-01-14T09:30:00'),
        approvedAt: new Date('2024-01-14T16:00:00'),
        withdrawalUser: {
          id: 'user_789',
          name: 'Rajesh Kumar',
          bankDetails: {
            accountNumber: '****9012',
            ifscCode: 'SBIN0009012',
            accountHolderName: 'Rajesh Kumar',
            bankName: 'SBI Bank'
          }
        },
        depositUser: {
          id: 'user_123',
          name: 'You',
          bankDetails: {
            accountNumber: '****1234',
            ifscCode: 'HDFC0001234',
            accountHolderName: 'Current User',
            bankName: 'HDFC Bank'
          }
        },
        receipt: {
          id: 'r2',
          matchId: 'm2',
          utrNumber: 'UTR987654321',
          receiptUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/73f8c3da-1738-4dd6-8c20-001e79198a89.png',
          uploadedAt: new Date('2024-01-14T15:30:00'),
          verified: true
        }
      }
    ]
  },
  {
    id: '3',
    userId: 'user_123',
    type: 'withdrawal',
    amount: 50000,
    remainingAmount: 50000,
    status: 'pending',
    description: 'Business expenses',
    createdAt: new Date('2024-01-13T14:20:00'),
    updatedAt: new Date('2024-01-13T14:20:00'),
    completionPercentage: 0,
    matches: []
  },
  {
    id: '4',
    userId: 'user_123',
    type: 'deposit',
    amount: 8000,
    remainingAmount: 0,
    status: 'admin_pending',
    description: 'Small deposit',
    createdAt: new Date('2024-01-12T11:45:00'),
    updatedAt: new Date('2024-01-12T16:30:00'),
    completionPercentage: 100,
    matches: [
      {
        id: 'm3',
        withdrawalId: 'w3',
        depositId: '4',
        amount: 8000,
        status: 'admin_review',
        adminApproved: false,
        createdAt: new Date('2024-01-12T12:00:00'),
        withdrawalUser: {
          id: 'user_101',
          name: 'Amit Patel',
          bankDetails: {
            accountNumber: '****3456',
            ifscCode: 'AXIS0003456',
            accountHolderName: 'Amit Patel',
            bankName: 'Axis Bank'
          }
        },
        depositUser: {
          id: 'user_123',
          name: 'You',
          bankDetails: {
            accountNumber: '****1234',
            ifscCode: 'HDFC0001234',
            accountHolderName: 'Current User',
            bankName: 'HDFC Bank'
          }
        },
        receipt: {
          id: 'r3',
          matchId: 'm3',
          utrNumber: 'UTR555666777',
          receiptUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e6a33dc8-a7d1-4a50-9379-291531b0215a.png',
          uploadedAt: new Date('2024-01-12T15:45:00'),
          verified: false
        }
      }
    ]
  }
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdrawal'>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount'>('newest');

  // Filter and sort transactions
  const filteredTransactions = mockTransactions
    .filter(transaction => {
      const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          transaction.id.includes(searchTerm);
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'amount':
          return b.amount - a.amount;
        default:
          return 0;
      }
    });

  const getTransactionIcon = (type: string) => {
    return type === 'deposit' ? '💰' : '💸';
  };

  const getTotalStats = () => {
    const totalDeposits = mockTransactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalWithdrawals = mockTransactions
      .filter(t => t.type === 'withdrawal')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const completedTransactions = mockTransactions.filter(t => t.status === 'completed').length;
    
    return { totalDeposits, totalWithdrawals, completedTransactions };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 border border-blue-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          📊 Transaction History
        </h1>
        <p className="text-gray-600">
          View and manage all your deposit and withdrawal transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💰</span>
              <div>
                <p className="text-sm text-gray-600">Total Deposits</p>
                <p className="text-2xl font-bold text-green-600">{formatINR(stats.totalDeposits)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💸</span>
              <div>
                <p className="text-sm text-gray-600">Total Withdrawals</p>
                <p className="text-2xl font-bold text-blue-600">{formatINR(stats.totalWithdrawals)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-purple-600">{stats.completedTransactions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <Input
                placeholder="Search by ID or description"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="matched">Matched</SelectItem>
                  <SelectItem value="partially_matched">Partially Matched</SelectItem>
                  <SelectItem value="admin_pending">Admin Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="amount">Highest Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-500">Try adjusting your filters or search terms</p>
            </CardContent>
          </Card>
        ) : (
          filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getTransactionIcon(transaction.type)}</span>
                    <div>
                      <CardTitle className="text-lg">
                        {transaction.type === 'deposit' ? 'Deposit Request' : 'Withdrawal Request'}
                      </CardTitle>
                      <CardDescription>
                        ID: {transaction.id} • {transaction.createdAt.toLocaleDateString()} • {transaction.createdAt.toLocaleTimeString()}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <Badge className={getStatusColor(transaction.status)}>
                    {formatStatus(transaction.status)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Transaction Details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Total Amount:</span>
                        <span className="font-semibold">{formatINR(transaction.amount)}</span>
                      </div>
                      
                      {transaction.type === 'withdrawal' && transaction.remainingAmount > 0 && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Remaining:</span>
                            <span className="font-semibold text-blue-600">
                              {formatINR(transaction.remainingAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Received:</span>
                            <span className="font-semibold text-green-600">
                              {formatINR(transaction.amount - transaction.remainingAmount)}
                            </span>
                          </div>
                        </>
                      )}
                      
                      {transaction.description && (
                        <div>
                          <span className="text-sm text-gray-600">Description:</span>
                          <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{transaction.description}</p>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar for Withdrawals */}
                    {transaction.type === 'withdrawal' && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Completion Progress</span>
                          <span>{transaction.completionPercentage.toFixed(0)}%</span>
                        </div>
                        <Progress value={transaction.completionPercentage} className="h-2" />
                      </div>
                    )}
                  </div>

                  {/* Matches */}
                  <div>
                    <h4 className="font-semibold mb-3">
                      Matches ({transaction.matches.length})
                      {transaction.matches.length > 0 && (
                        <Badge variant="secondary" className="ml-2">
                          {transaction.matches.filter(m => m.status === 'completed').length} completed
                        </Badge>
                      )}
                    </h4>
                    
                    {transaction.matches.length > 0 ? (
                      <div className="space-y-3 max-h-40 overflow-y-auto">
                        {transaction.matches.map((match) => (
                          <div key={match.id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">
                                  {transaction.type === 'deposit' ? match.withdrawalUser.name : match.depositUser.name}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {formatINR(match.amount)}
                                </p>
                              </div>
                              <Badge 
                                variant="secondary"
                                className={getStatusColor(match.status)}
                              >
                                {formatStatus(match.status)}
                              </Badge>
                            </div>
                            
                            {match.receipt && (
                              <div className="text-xs text-gray-500">
                                <p>UTR: {match.receipt.utrNumber}</p>
                                <p>Uploaded: {match.receipt.uploadedAt.toLocaleDateString()}</p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                        <p className="text-sm">No matches yet</p>
                        <p className="text-xs">
                          {transaction.type === 'deposit' ? 'Waiting for withdrawers' : 'Waiting for depositors'}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredTransactions.length >= 10 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Transactions
          </Button>
        </div>
      )}
    </div>
  );
}