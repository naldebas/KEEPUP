// Fix: Create the Header component for top-level navigation and user actions.
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserIcon, BellIcon, SettingsIcon, ChevronDownIcon } from '../shared/icons';
import { Logo } from '../shared/Logo';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side can have a logo or search bar */}
          <div className="flex-shrink-0">
            <Logo className="h-7 w-auto" />
          </div>

          {/* Right side for user actions */}
          <div className="flex items-center space-x-4">
            <button className="text-slate-500 hover:text-slate-700">
              <BellIcon className="h-6 w-6" />
            </button>
            <button className="text-slate-500 hover:text-slate-700">
              <SettingsIcon className="h-6 w-6" />
            </button>
            
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800"
              >
                <UserIcon className="h-8 w-8 rounded-full bg-slate-200 p-1" />
                <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Your Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100">Settings</a>
                  <button
                    onClick={logout}
                    className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;