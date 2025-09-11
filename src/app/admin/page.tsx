'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatINR } from '@/lib/currency';
import { toast } from 'sonner';

// Mock data for pending matches
const mockPendingMatches = [
  {
    id: '1',
    withdrawalUser: {
      name: 'Amit Patel',
      amount: 25000,
      bankDetails: {
        accountNumber: 'HDFC****1234',
        ifscCode: 'HDFC0001234'
      }
    },
    depositUser: {
      name: 'Priya Sharma',
      amount: 10000
    },
    matchAmount: 10000,
    type: 'partial',
    createdAt: new Date('2024-01-15T10:30:00'),
    priority: 'high'
  },
  {
    id: '2',
    withdrawalUser: {
      name: 'Rajesh Kumar',
      amount: 50000,
      bankDetails: {
        accountNumber: 'SBI****5678',
        ifscCode: 'SBI0005678'
      }
    },
    depositUser: {
      name: 'Neha Gupta',
      amount: 50000
    },
    matchAmount: 50000,
    type: 'full',
    createdAt: new Date('2024-01-15T09:15:00'),
    priority: 'medium'
  },
  {
    id: '3',
    withdrawalUser: {
      name: 'Vikram Singh',
      amount: 30000,
      bankDetails: {
        accountNumber: 'ICICI****9012',
        ifscCode: 'ICICI0009012'
      }
    },
    depositUser: {
      name: 'Ravi Mehta',
      amount: 15000
    },
    matchAmount: 15000,
    type: 'partial',
    createdAt: new Date('2024-01-15T08:45:00'),
    priority: 'low'
  }
];

// Mock analytics data
const mockAnalytics = {
  totalTransactions: 1247,
  totalVolume: 45678000,
  approvedToday: 23,
  rejectedToday: 2,
  pendingApproval: 5,
  successRate: 94.2,
  averageMatchTime: 45, // minutes
  activeUsers: 156
};

// Mock recent activities
const mockRecentActivities = [
  {
    id: '1',
    type: 'approval',
    message: 'Match approved: Amit Patel → Priya Sharma (₹10,000)',
    timestamp: new Date('2024-01-15T11:30:00'),
    status: 'success'
  },
  {
    id: '2',
    type: 'rejection',
    message: 'Match rejected: Invalid bank details verification',
    timestamp: new Date('2024-01-15T11:15:00'),
    status: 'error'
  },
  {
    id: '3',
    type: 'new_match',
    message: 'New match created: Rajesh Kumar ↔ Neha Gupta (₹50,000)',
    timestamp: new Date('2024-01-15T10:45:00'),
    status: 'info'
  },
  {
    id: '4',
    type: 'completion',
    message: 'Transaction completed: UTR verification successful',
    timestamp: new Date('2024-01-15T10:20:00'),
    status: 'success'
  }
];

export default function AdminPage() {
  const [processingMatch, setProcessingMatch] = useState<string | null>(null);

  const handleApproval = async (matchId: string, approved: boolean) => {
    setProcessingMatch(matchId);
    
    // Simulate API call
    setTimeout(() => {
      if (approved) {
        toast.success('Match approved successfully! Users have been notified.');
      } else {
        toast.success('Match rejected. Users have been notified with reason.');
      }
      setProcessingMatch(null);
    }, 1500);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approval': return '✅';
      case 'rejection': return '❌';
      case 'new_match': return '🔗';
      case 'completion': return '🎉';
      default: return '📝';
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ⚡ Admin Dashboard
        </h1>
        <p className="text-gray-600">
          Manage P2P transactions, approve matches, and monitor platform activity.
        </p>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <span className="text-2xl">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatINR(mockAnalytics.totalVolume)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {mockAnalytics.totalTransactions} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <span className="text-2xl">⏳</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockAnalytics.pendingApproval}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Awaiting your review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <span className="text-2xl">🎯</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockAnalytics.successRate}%
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Platform success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <span className="text-2xl">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {mockAnalytics.activeUsers}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending" className="flex items-center gap-2">
            ⏳ Pending Approvals ({mockPendingMatches.length})
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            📊 Recent Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-4">
            {mockPendingMatches.map((match) => (
              <Card key={match.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        Match #{match.id}
                        <Badge className={getPriorityColor(match.priority)}>
                          {match.priority} priority
                        </Badge>
                        <Badge variant="outline">
                          {match.type} match
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Created on {match.createdAt.toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatINR(match.matchAmount)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Withdrawal User */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-red-600 flex items-center gap-2">
                        💸 Withdrawal Request
                      </h4>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">User:</span>
                            <span className="text-sm">{match.withdrawalUser.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Total Amount:</span>
                            <span className="text-sm font-semibold">
                              {formatINR(match.withdrawalUser.amount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Account:</span>
                            <span className="text-sm">{match.withdrawalUser.bankDetails.accountNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">IFSC:</span>
                            <span className="text-sm">{match.withdrawalUser.bankDetails.ifscCode}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Deposit User */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-green-600 flex items-center gap-2">
                        💰 Deposit Request
                      </h4>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">User:</span>
                            <span className="text-sm">{match.depositUser.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Deposit Amount:</span>
                            <span className="text-sm font-semibold">
                              {formatINR(match.depositUser.amount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Match Amount:</span>
                            <span className="text-sm font-bold text-blue-600">
                              {formatINR(match.matchAmount)}
                            </span>
                          </div>
                          {match.type === 'partial' && (
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Remaining:</span>
                              <span className="text-sm text-yellow-600">
                                {formatINR(match.withdrawalUser.amount - match.matchAmount)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Match Summary */}
                  <Alert className="border-blue-200 bg-blue-50 mb-4">
                    <AlertDescription>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {match.depositUser.name} will transfer {formatINR(match.matchAmount)} to {match.withdrawalUser.name}
                        </span>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {match.type === 'full' ? 'Complete Match' : 'Partial Match'}
                        </Badge>
                      </div>
                    </AlertDescription>
                  </Alert>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApproval(match.id, true)}
                      disabled={processingMatch === match.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {processingMatch === match.id ? 'Processing...' : '✅ Approve Match'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleApproval(match.id, false)}
                      disabled={processingMatch === match.id}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      ❌ Reject Match
                    </Button>
                    <Button variant="outline">
                      👀 View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Platform Activity</CardTitle>
              <CardDescription>
                Latest transactions and system events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRecentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="text-2xl">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.timestamp.toLocaleString()}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        activity.status === 'success'
                          ? 'bg-green-100 text-green-700'
                          : activity.status === 'error'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-blue-100 text-blue-700'
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📈 Today's Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {mockAnalytics.approvedToday}
              </div>
              <p className="text-sm text-gray-600 mt-1">Matches Approved</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {mockAnalytics.rejectedToday}
              </div>
              <p className="text-sm text-gray-600 mt-1">Matches Rejected</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {mockAnalytics.averageMatchTime}m
              </div>
              <p className="text-sm text-gray-600 mt-1">Avg. Match Time</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {mockAnalytics.successRate}%
              </div>
              <p className="text-sm text-gray-600 mt-1">Success Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}