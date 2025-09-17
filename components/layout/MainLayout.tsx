// Fix: Implement the MainLayout component with header, sidebar, and content area.
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Header from './Header';
import { cn } from '../../lib/utils';
// Fix: Import BellIcon from shared icons to resolve used-before-declaration error.
import { BellIcon, CalendarIcon, SettingsIcon, SparkleIcon, TagIcon, UserIcon } from '../shared/icons';

const navItems = [
  { name: 'Dashboard', href: '/', icon: SparkleIcon },
  { name: 'Customers', href: '/customers', icon: UserIcon },
  { name: 'Loyalty', href: '/loyalty', icon: TagIcon },
  { name: 'Campaigns', href: '/campaigns', icon: BellIcon },
  { name: 'Reservations', href: '/reservations', icon: UserIcon },
  { name: 'Calendar', href: '/calendar', icon: CalendarIcon },
  { name: 'Settings', href: '/settings', icon: SettingsIcon },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-slate-900 text-white flex-col hidden md:flex">
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-slate-700">
        Admin Panel
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md group',
                isActive
                  ? 'bg-primary-500/20 text-primary-300'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              )
            }
          >
            {/* Fix: Use a render prop for NavLink children to correctly scope `isActive` for styling the icon. */}
            {({ isActive }) => (
              <>
                <item.icon className={cn(
                    "mr-3 h-5 w-5", 
                    isActive ? "text-primary-400" : "text-slate-400 group-hover:text-slate-300"
                )} />
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};


const MainLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
