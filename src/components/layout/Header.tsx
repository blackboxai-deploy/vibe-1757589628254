'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatINR } from '@/lib/currency';

// Mock user data
const mockUser = {
  name: 'Rajesh Kumar',
  email: 'rajesh@example.com',
  role: 'user' as 'user' | 'admin',
  balance: 125000,
  kycStatus: 'verified' as 'verified' | 'pending' | 'rejected'
};

export function Header() {
  const [notifications] = useState(3); // Mock notification count

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getKycBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600">✓ Verified</Badge>;
      case 'pending':
        return <Badge variant="secondary">⏳ Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">✗ Rejected</Badge>;
      default:
        return <Badge variant="secondary">Not Verified</Badge>;
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title and Breadcrumb */}
        <div className="flex items-center space-x-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Dashboard
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, {mockUser.name}
            </p>
          </div>
        </div>

        {/* Right side - Balance, Notifications, User Menu */}
        <div className="flex items-center space-x-4">
          {/* Current Balance */}
          <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 rounded-lg border">
            <span className="text-sm font-medium text-gray-600">Balance:</span>
            <span className="text-lg font-bold text-blue-700">
              {formatINR(mockUser.balance)}
            </span>
          </div>

          {/* KYC Status */}
          <div className="hidden md:block">
            {getKycBadge(mockUser.kycStatus)}
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button variant="ghost" size="sm" className="relative p-2">
              <span className="text-xl">🔔</span>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-2">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-medium">
                    {getInitials(mockUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {mockUser.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {mockUser.role === 'admin' ? 'Administrator' : 'User'}
                  </p>
                </div>
                <span className="text-gray-400">▼</span>
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span>{mockUser.name}</span>
                  <span className="text-xs font-normal text-gray-500">
                    {mockUser.email}
                  </span>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              {/* Mobile Balance Display */}
              <div className="md:hidden px-2 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Balance:</span>
                  <span className="text-sm font-bold text-blue-700">
                    {formatINR(mockUser.balance)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">KYC:</span>
                  <div className="scale-75">
                    {getKycBadge(mockUser.kycStatus)}
                  </div>
                </div>
              </div>
              
              <DropdownMenuSeparator className="md:hidden" />
              
              <DropdownMenuItem>
                <span className="mr-2">👤</span>
                Profile Settings
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <span className="mr-2">📊</span>
                Transaction History
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <span className="mr-2">💳</span>
                Bank Details
              </DropdownMenuItem>
              
              <DropdownMenuItem>
                <span className="mr-2">🔒</span>
                Security Settings
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem>
                <span className="mr-2">❓</span>
                Help & Support
              </DropdownMenuItem>
              
              <DropdownMenuItem className="text-red-600">
                <span className="mr-2">🚪</span>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}