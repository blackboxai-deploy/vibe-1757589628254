import { NextRequest, NextResponse } from 'next/server';

// Mock admin approval data
interface ApprovalRequest {
  matchId: string;
  action: 'approve' | 'reject';
  reason?: string;
}

interface ApprovalResponse {
  success: boolean;
  message: string;
  data?: any;
}

// POST - Admin approve/reject matches
export async function POST(request: NextRequest): Promise<NextResponse<ApprovalResponse>> {
  try {
    const body: ApprovalRequest = await request.json();
    const { matchId, action, reason } = body;

    // Validation
    if (!matchId || !action) {
      return NextResponse.json({
        success: false,
        message: 'Match ID and action are required'
      }, { status: 400 });
    }

    if (action === 'reject' && !reason) {
      return NextResponse.json({
        success: false,
        message: 'Reason is required for rejection'
      }, { status: 400 });
    }

    // Simulate admin approval process
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful approval/rejection
    const mockUpdatedMatch = {
      id: matchId,
      status: action === 'approve' ? 'approved' : 'rejected',
      adminApproved: action === 'approve',
      approvedAt: action === 'approve' ? new Date() : undefined,
      rejectionReason: action === 'reject' ? reason : undefined,
      approvedBy: 'admin_001' // Mock admin ID
    };

    // In a real application, this would:
    // 1. Update the match status in the database
    // 2. Send notifications to both users
    // 3. Update transaction statuses
    // 4. Trigger any necessary financial processes
    // 5. Log the admin action for audit

    const message = action === 'approve' 
      ? 'Match approved successfully. Users will be notified.'
      : 'Match rejected. Users will be notified with the reason.';

    return NextResponse.json({
      success: true,
      message,
      data: mockUpdatedMatch
    });

  } catch (error) {
    console.error('Error processing approval:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to process approval request'
    }, { status: 500 });
  }
}

// GET - Get pending approvals for admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Mock pending approvals data
    const mockPendingApprovals = [
      {
        id: 'm1',
        withdrawalId: 'w1',
        depositId: 'd1',
        amount: 25000,
        status: 'admin_review',
        adminApproved: false,
        createdAt: new Date('2024-01-15T10:30:00'),
        withdrawalUser: {
          id: 'user_123',
          name: 'Rajesh Kumar',
          kycStatus: 'verified',
          transactionCount: 15,
          successRate: 96.8
        },
        depositUser: {
          id: 'user_456',
          name: 'Priya Sharma',
          kycStatus: 'verified',
          transactionCount: 8,
          successRate: 100
        },
        receipt: {
          id: 'r1',
          utrNumber: 'UTR123456789',
          uploadedAt: new Date('2024-01-15T14:20:00'),
          verified: false
        },
        priority: 'high', // Based on amount and user history
        riskScore: 'low' // Automated risk assessment
      },
      {
        id: 'm2',
        withdrawalId: 'w2',
        depositId: 'd2',
        amount: 15000,
        status: 'receipt_uploaded',
        adminApproved: false,
        createdAt: new Date('2024-01-14T16:45:00'),
        withdrawalUser: {
          id: 'user_789',
          name: 'Amit Patel',
          kycStatus: 'verified',
          transactionCount: 3,
          successRate: 100
        },
        depositUser: {
          id: 'user_101',
          name: 'Kavya Singh',
          kycStatus: 'pending',
          transactionCount: 1,
          successRate: 0
        },
        receipt: {
          id: 'r2',
          utrNumber: 'UTR987654321',
          uploadedAt: new Date('2024-01-14T18:30:00'),
          verified: false
        },
        priority: 'medium',
        riskScore: 'medium' // New user with pending KYC
      }
    ];

    // Filter by status
    const filteredApprovals = mockPendingApprovals.filter(approval => {
      if (status === 'all') return true;
      if (status === 'pending') return !approval.adminApproved;
      if (status === 'high_priority') return approval.priority === 'high';
      if (status === 'low_risk') return approval.riskScore === 'low';
      return approval.status === status;
    });

    // Sort by priority and creation date
    const sortedApprovals = filteredApprovals.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 1;
      const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 1;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority; // Higher priority first
      }
      
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(); // Older first
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedApprovals = sortedApprovals.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedApprovals,
      pagination: {
        page,
        limit,
        total: filteredApprovals.length,
        totalPages: Math.ceil(filteredApprovals.length / limit)
      },
      summary: {
        totalPending: mockPendingApprovals.filter(a => !a.adminApproved).length,
        highPriority: mockPendingApprovals.filter(a => a.priority === 'high').length,
        lowRisk: mockPendingApprovals.filter(a => a.riskScore === 'low').length
      }
    });

  } catch (error) {
    console.error('Error fetching pending approvals:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch pending approvals'
    }, { status: 500 });
  }
}