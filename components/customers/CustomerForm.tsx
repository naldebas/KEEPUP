// Fix: Implement the CustomerForm for adding and editing customers.
import React, { useState, useEffect } from 'react';
import type { Customer, CustomerFormData, Tier } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface CustomerFormProps {
  customer: Customer | null;
  onSubmit: (data: CustomerFormData) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ customer, onSubmit, onCancel, isSaving }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [tier, setTier] = useState<Tier>('Discovery');

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setEmail(customer.email);
      setPhone(customer.phone || '');
      setDob(customer.dob || '');
      setTier(customer.tier);
    } else {
      // Reset form for new customer
      setName('');
      setEmail('');
      setPhone('');
      setDob('');
      setTier('Discovery');
    }
  }, [customer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, email, phone, dob, tier });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
          Name
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Phone Number</label>
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+1234567890"/>
        </div>
        <div>
            <label htmlFor="dob" className="block text-sm font-medium text-slate-700">Date of Birth</label>
            <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
        </div>
      </div>
      <div>
        <label htmlFor="tier" className="block text-sm font-medium text-slate-700">
          Loyalty Tier
        </label>
        <select
            id="tier"
            value={tier}
            onChange={(e) => setTier(e.target.value as Tier)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg"
        >
            <option>Discovery</option>
            <option>Silver</option>
            <option>Gold</option>
            <option>Platinum</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Customer'}
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;