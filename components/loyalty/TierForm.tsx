
import React, { useState, useEffect } from 'react';
import type { LoyaltyTier, LoyaltyBenefit, RuleType } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { TrashIcon } from '../shared/icons';
import { Select } from '../ui/Select';

interface TierFormProps {
  tier: LoyaltyTier;
  onSubmit: (data: Partial<Omit<LoyaltyTier, 'name'>>) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const TierForm: React.FC<TierFormProps> = ({ tier, onSubmit, onCancel, isSaving }) => {
  const [pointsThreshold, setPointsThreshold] = useState<number | ''>('');
  const [benefits, setBenefits] = useState<LoyaltyBenefit[]>([]);

  useEffect(() => {
    if (tier) {
      setPointsThreshold(tier.pointsThreshold);
      // Deep copy to avoid mutating the original state object
      setBenefits(JSON.parse(JSON.stringify(tier.benefits)));
    }
  }, [tier]);

  const handleBenefitChange = (id: string, field: string, value: any) => {
    setBenefits(prev => prev.map(b => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const addBenefit = (type: 'descriptive' | 'rule') => {
    const newId = generateId();
    if (type === 'descriptive') {
      setBenefits(prev => [...prev, { id: newId, type: 'descriptive', description: '' }]);
    } else {
      setBenefits(prev => [...prev, { id: newId, type: 'rule', description: '', ruleType: 'PERCENTAGE_DISCOUNT', value: 0 }]);
    }
  };

  const removeBenefit = (id: string) => {
    setBenefits(prev => prev.filter(b => b.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof pointsThreshold === 'number') {
      // Filter out any benefits where the description hasn't been filled out
      const cleanedBenefits = benefits.filter(b => b.description.trim() !== '');
      onSubmit({ pointsThreshold, benefits: cleanedBenefits });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="pointsThreshold" className="block text-sm font-medium text-gray-700">
          Points to Unlock
        </label>
        <Input
          id="pointsThreshold"
          type="number"
          value={pointsThreshold}
          onChange={(e) => setPointsThreshold(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          required
          min="0"
          disabled={tier.name === 'Discovery'}
          className="mt-1"
        />
        {tier.name === 'Discovery' && (
            <p className="text-xs text-gray-500 mt-1">The Discovery tier is the default starting tier and must be 0 points.</p>
        )}
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Benefits</h4>
        <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {benefits.map((benefit, index) => (
                <div key={benefit.id} className="p-4 border rounded-lg bg-white space-y-3">
                <div className="flex items-end">
                    <div className="flex-grow pr-2">
                        <label htmlFor={`benefit-desc-${index}`} className="block text-sm font-medium text-gray-700">
                            Benefit Description
                        </label>
                        <Input
                            id={`benefit-desc-${index}`}
                            type="text"
                            placeholder={benefit.type === 'rule' ? "e.g., 5% off all purchases" : "e.g., Priority support"}
                            value={benefit.description}
                            onChange={(e) => handleBenefitChange(benefit.id, 'description', e.target.value)}
                            className="mt-1 text-sm w-full"
                        />
                    </div>
                    <button type="button" onClick={() => removeBenefit(benefit.id)} className="p-1 mb-1.5 text-gray-400 hover:text-red-500 flex-shrink-0">
                        <TrashIcon className="h-4 w-4" />
                    </button>
                </div>

                {benefit.type === 'rule' && (
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div>
                        <label htmlFor={`rule-type-${index}`} className="block text-sm font-medium text-gray-700">Rule Type</label>
                        <Select
                        id={`rule-type-${index}`}
                        value={benefit.ruleType}
                        onChange={(e) => handleBenefitChange(benefit.id, 'ruleType', e.target.value as RuleType)}
                        className="mt-1"
                        >
                        <option value="PERCENTAGE_DISCOUNT">Percentage Discount</option>
                        <option value="FREE_ITEM" disabled>Free Item (Coming Soon)</option>
                        </Select>
                    </div>
                    <div>
                        <label htmlFor={`rule-value-${index}`} className="block text-sm font-medium text-gray-700">Value (%)</label>
                        <Input
                        id={`rule-value-${index}`}
                        type="number"
                        min="0"
                        value={benefit.value}
                        onChange={(e) => handleBenefitChange(benefit.id, 'value', parseInt(e.target.value, 10) || 0)}
                        className="mt-1 text-sm"
                        disabled={benefit.ruleType !== 'PERCENTAGE_DISCOUNT'}
                        />
                    </div>
                    </div>
                )}
                </div>
            ))}
            </div>
          </div>
          <div className="flex space-x-3 pt-3">
            <Button type="button" onClick={() => addBenefit('descriptive')} className="text-sm">Add Descriptive Benefit</Button>
            <Button type="button" onClick={() => addBenefit('rule')} className="text-sm">Add Rule-Based Benefit</Button>
          </div>
      </div>
      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
        <Button type="button" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default TierForm;
