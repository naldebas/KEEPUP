
import React, { useState, useEffect } from 'react';
import type { User, UserFormData, UserRole } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

interface UserFormProps {
  user: User | null;
  onSubmit: (data: UserFormData) => void;
  onCancel: () => void;
  isSaving?: boolean;
  currentUserRole: UserRole;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, isSaving, currentUserRole }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Staff');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    } else {
      setName('');
      setEmail('');
      setRole('Staff');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, role });
  };
  
  const availableRoles: UserRole[] = currentUserRole === 'Admin' ? ['Admin', 'Branch Manager', 'Staff'] : ['Staff'];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Full Name
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-slate-700">
          Role
        </label>
        <Select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value as UserRole)}
            disabled={isSaving || (currentUserRole === 'Branch Manager' && user?.role !== 'Staff' && user !== null)}
        >
          {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
        </Select>
        {currentUserRole === 'Branch Manager' && <p className="text-xs text-slate-500 mt-1">Managers can only create or assign the Staff role.</p>}
      </div>
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save User'}
        </Button>
      </div>
    </form>
  );
};

export default UserForm;
