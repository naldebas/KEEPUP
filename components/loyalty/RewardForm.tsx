
import React, { useState, useEffect } from 'react';
import type { LoyaltyReward } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';

interface RewardFormProps {
  reward: LoyaltyReward | null;
  onSubmit: (data: Omit<LoyaltyReward, 'id'>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const RewardForm: React.FC<RewardFormProps> = ({ reward, onSubmit, onCancel, isSaving }) => {
  const [name, setName] = useState('');
  const [points, setPoints] = useState<number | ''>('');
  const [status, setStatus] = useState<'Active' | 'Archived'>('Active');

  useEffect(() => {
    if (reward) {
      setName(reward.name);
      setPoints(reward.points);
      setStatus(reward.status);
    } else {
      setName('');
      setPoints('');
      setStatus('Active');
    }
  }, [reward]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof points === 'number') {
        onSubmit({ name, points, status });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm text-gray-500">
        Create rewards that customers can redeem using their loyalty points. Set a name and the required points value.
      </p>
      <div className="space-y-4">
        <div>
          <label htmlFor="reward-name" className="block text-sm font-medium text-gray-700">
            Reward Name
          </label>
          <Input
            id="reward-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="points" className="block text-sm font-medium text-gray-700">
            Points Required
          </label>
          <Input
            id="points"
            type="number"
            value={points}
            onChange={(e) => setPoints(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
            required
            min="0"
            className="mt-1"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <Select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'Active' | 'Archived')}
              className="mt-1"
          >
              <option>Active</option>
              <option>Archived</option>
          </Select>
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="button" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Reward'}
        </Button>
      </div>
    </form>
  );
};

export default RewardForm;
