// Import types from transaction.ts
import type { Transaction, Match, MatchStatus, MatchUser } from './transaction';

export interface MatchingEngine {
  findMatches(transaction: Transaction): Promise<PotentialMatch[]>;
  createMatch(withdrawalId: string, depositId: string, amount: number): Promise<Match>;
  updateMatchStatus(matchId: string, status: MatchStatus): Promise<void>;
}

export interface PotentialMatch {
  transactionId: string;
  userId: string;
  userName: string;
  amount: number;
  matchAmount: number; // Amount that can be matched
  compatibility: number; // Matching score 0-100
  isPartial: boolean;
}

export interface MatchingResult {
  success: boolean;
  matches: Match[];
  remainingAmount: number;
  message?: string;
}

export interface MatchingCriteria {
  amountRange?: {
    min: number;
    max: number;
  };
  userPreferences?: {
    preferredUsers?: string[];
    excludedUsers?: string[];
  };
  priority: 'fifo' | 'amount_based' | 'user_rating';
}

export interface AdminApprovalRequest {
  matchId: string;
  approved: boolean;
  reason?: string;
  adminId: string;
}

export interface MatchingStats {
  totalMatches: number;
  partialMatches: number;
  fullMatches: number;
  averageMatchTime: number; // in minutes
  successRate: number; // percentage
}