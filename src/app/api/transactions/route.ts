import { NextRequest, NextResponse } from 'next/server';
import { CreateTransactionRequest, Transaction } from '@/types/transaction';

// Mock transaction data (in a real app, this would be in a database)
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
    matches: []
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
    matches: []
  }
];

// GET - Fetch all transactions for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Filter transactions based on query parameters
    let filteredTransactions = mockTransactions;
    
    if (userId) {
      filteredTransactions = filteredTransactions.filter(t => t.userId === userId);
    }
    
    if (type && type !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.type === type);
    }
    
    if (status && status !== 'all') {
      filteredTransactions = filteredTransactions.filter(t => t.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedTransactions,
      pagination: {
        page,
        limit,
        total: filteredTransactions.length,
        totalPages: Math.ceil(filteredTransactions.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const body: CreateTransactionRequest = await request.json();
    const { type, amount, description } = body;

    // Validation
    if (!type || !amount) {
      return NextResponse.json(
        { success: false, error: 'Type and amount are required' },
        { status: 400 }
      );
    }

    if (amount < 100) {
      return NextResponse.json(
        { success: false, error: 'Minimum amount is ₹100' },
        { status: 400 }
      );
    }

    if (amount > 500000) {
      return NextResponse.json(
        { success: false, error: 'Maximum amount is ₹5,00,000 per transaction' },
        { status: 400 }
      );
    }

    // Create new transaction
    const newTransaction: Transaction = {
      id: `txn_${Date.now()}`,
      userId: 'user_123', // In a real app, get this from the authenticated user
      type,
      amount,
      remainingAmount: amount,
      status: 'pending',
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      completionPercentage: 0,
      matches: []
    };

    // Add to mock data (in a real app, save to database)
    mockTransactions.push(newTransaction);

    // Simulate automatic matching logic
    setTimeout(() => {
      // This would trigger the matching engine in a real application
      console.log(`Attempting to match transaction ${newTransaction.id}`);
    }, 1000);

    return NextResponse.json({
      success: true,
      data: newTransaction,
      message: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} request created successfully`
    });
  } catch (error) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create transaction' },
      { status: 500 }
    );
  }
}

// PUT - Update a transaction
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { transactionId, newAmount, reason } = body;

    if (!transactionId || !newAmount) {
      return NextResponse.json(
        { success: false, error: 'Transaction ID and new amount are required' },
        { status: 400 }
      );
    }

    // Find transaction
    const transactionIndex = mockTransactions.findIndex(t => t.id === transactionId);
    if (transactionIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Transaction not found' },
        { status: 404 }
      );
    }

    const transaction = mockTransactions[transactionIndex];

    // Validate that the transaction can be edited
    if (transaction.status === 'completed') {
      return NextResponse.json(
        { success: false, error: 'Cannot edit completed transactions' },
        { status: 400 }
      );
    }

    // Update transaction
    const updatedTransaction: Transaction = {
      ...transaction,
      remainingAmount: newAmount,
      updatedAt: new Date(),
      completionPercentage: ((transaction.amount - newAmount) / transaction.amount) * 100
    };

    mockTransactions[transactionIndex] = updatedTransaction;

    return NextResponse.json({
      success: true,
      data: updatedTransaction,
      message: 'Transaction updated successfully'
    });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update transaction' },
      { status: 500 }
    );
  }
}