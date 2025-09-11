import { NextRequest, NextResponse } from 'next/server';
import { Match } from '@/types/transaction';

// Mock matching data
const mockMatches: Match[] = [
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
      bankDetails: {
        accountNumber: '1234567890',
        ifscCode: 'HDFC0001234',
        accountHolderName: 'Rajesh Kumar',
        bankName: 'HDFC Bank'
      }
    },
    depositUser: {
      id: 'user_456',
      name: 'Priya Sharma',
      bankDetails: {
        accountNumber: '9876543210',
        ifscCode: 'ICIC0005678',
        accountHolderName: 'Priya Sharma',
        bankName: 'ICICI Bank'
      }
    },
    receipt: {
      id: 'r1',
      matchId: 'm1',
      utrNumber: 'UTR123456789',
      receiptUrl: '/receipts/receipt1.jpg',
      uploadedAt: new Date('2024-01-15T14:20:00'),
      verified: false
    }
  }
];

// GET - Get matches for a user or admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const adminView = searchParams.get('admin') === 'true';
    const status = searchParams.get('status');

    let filteredMatches = mockMatches;

    if (!adminView && userId) {
      // Filter matches for specific user
      filteredMatches = filteredMatches.filter(match => 
        match.withdrawalUser.id === userId || match.depositUser.id === userId
      );
    }

    if (status && status !== 'all') {
      filteredMatches = filteredMatches.filter(match => match.status === status);
    }

    return NextResponse.json({
      success: true,
      data: filteredMatches
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch matches' },
      { status: 500 }
    );
  }
}

// POST - Create a new match
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { withdrawalId, depositId, amount } = body;

    if (!withdrawalId || !depositId || !amount) {
      return NextResponse.json(
        { success: false, error: 'Withdrawal ID, Deposit ID, and amount are required' },
        { status: 400 }
      );
    }

    // Create new match
    const newMatch: Match = {
      id: `match_${Date.now()}`,
      withdrawalId,
      depositId,
      amount,
      status: 'pending',
      adminApproved: false,
      createdAt: new Date(),
      withdrawalUser: {
        id: 'user_123', // Mock data - in real app, fetch from database
        name: 'Mock Withdrawer',
        bankDetails: {
          accountNumber: '****1234',
          ifscCode: 'MOCK0001',
          accountHolderName: 'Mock User',
          bankName: 'Mock Bank'
        }
      },
      depositUser: {
        id: 'user_456',
        name: 'Mock Depositor',
        bankDetails: {
          accountNumber: '****5678',
          ifscCode: 'MOCK0002',
          accountHolderName: 'Mock User 2',
          bankName: 'Mock Bank 2'
        }
      }
    };

    mockMatches.push(newMatch);

    return NextResponse.json({
      success: true,
      data: newMatch,
      message: 'Match created successfully'
    });
  } catch (error) {
    console.error('Error creating match:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create match' },
      { status: 500 }
    );
  }
}

// Matching Algorithm - Find potential matches (Internal function)
function findPotentialMatches(transactionId: string, type: 'deposit' | 'withdrawal', amount: number) {
  // This is a simplified matching algorithm
  // In a real application, this would be more sophisticated with various matching criteria
  
  const oppositeType = type === 'deposit' ? 'withdrawal' : 'deposit';
  
  // Mock logic: Find opposite type transactions that can be matched
  const potentialMatches = mockMatches.filter(match => {
    if (type === 'deposit') {
      return match.withdrawalUser.id !== 'current_user' && 
             parseInt(match.withdrawalId) <= amount; // Can fulfill partial or full amount
    } else {
      return match.depositUser.id !== 'current_user' &&
             parseInt(match.depositId) >= amount; // Deposit amount is sufficient
    }
  });

  // Sort by best match criteria (amount compatibility, user ratings, etc.)
  return potentialMatches.sort((a, b) => {
    // Simple sorting by amount compatibility
    const aCompatibility = Math.abs(a.amount - amount);
    const bCompatibility = Math.abs(b.amount - amount);
    return aCompatibility - bCompatibility;
  });
}