'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

// Define navigation item interface
interface NavItem {
  title: string;
  href: string;
  icon: string;
  description: string;
  badge?: string;
}

// Navigation items for different user roles
const userNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: '🏠',
    description: 'Overview of your transactions'
  },
  {
    title: 'Deposit',
    href: '/deposit',
    icon: '💰',
    description: 'Create deposit request'
  },
  {
    title: 'Withdrawal',
    href: '/withdrawal',
    icon: '💸',
    description: 'Create withdrawal request'
  },
  {
    title: 'Transactions',
    href: '/transactions',
    icon: '📊',
    description: 'View transaction history'
  },
  {
    title: 'Matches',
    href: '/matches',
    icon: '🔗',
    description: 'Your matched transactions'
  },
  {
    title: 'Profile',
    href: '/profile',
    icon: '👤',
    description: 'Manage your account'
  }
];

const adminNavItems: NavItem[] = [
  {
    title: 'Admin Dashboard',
    href: '/admin',
    icon: '⚡',
    description: 'Admin overview'
  },
  {
    title: 'Approvals',
    href: '/admin/approvals',
    icon: '✅',
    description: 'Pending approvals',
    badge: '5' // Mock pending count
  },
  {
    title: 'Users',
    href: '/admin/users',
    icon: '👥',
    description: 'User management'
  },
  {
    title: 'Transactions',
    href: '/admin/transactions',
    icon: '💳',
    description: 'All transactions'
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: '📈',
    description: 'Platform analytics'
  }
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user'); // Mock user role
  const pathname = usePathname();

  const navItems = userRole === 'admin' ? adminNavItems : userNavItems;

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        'flex flex-col bg-white border-r border-gray-200 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header with hamburger menu */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">P2P</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                P2P Finance
              </h1>
              <p className="text-xs text-gray-500">
                {userRole === 'admin' ? 'Admin Panel' : 'User Portal'}
              </p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleCollapsed}
          className="p-2 hover:bg-gray-100"
        >
          <span className="text-lg">☰</span>
        </Button>
      </div>

      {/* User Role Toggle (Mock) */}
      {!collapsed && (
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Button
              variant={userRole === 'user' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUserRole('user')}
              className="flex-1 text-xs"
            >
              User
            </Button>
            <Button
              variant={userRole === 'admin' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setUserRole('admin')}
              className="flex-1 text-xs"
            >
              Admin
            </Button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-gray-100',
                  isActive 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:text-gray-900'
                )}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        {!collapsed && (
          <div className="text-center">
            <p className="text-xs text-gray-500">
              © 2024 P2P Finance Platform
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Secure • Transparent • Fast
            </p>
          </div>
        )}
        {collapsed && (
          <div className="text-center">
            <span className="text-xs text-gray-400">v1.0</span>
          </div>
        )}
      </div>
    </div>
  );
}