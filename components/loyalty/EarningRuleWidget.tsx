

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../sdk';
import { useToasts } from '../../context/ToastContext';
import type { LoyaltyRule } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/Skeleton';
import { PencilIcon } from '../shared/icons';
import Modal from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

const EarningRuleWidget: React.FC = () => {
    const [rule, setRule] = useState<LoyaltyRule | null>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [points, setPoints] = useState<number | ''>('');
    const { addToast } = useToasts();
    
    const fetchRule = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.loyalty.getLoyaltyRule();
            setRule(data);
            setPoints(data.pointsPerDollar);
        } catch (error) {
            addToast('Failed to fetch loyalty rule.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);
    
    useEffect(() => {
        fetchRule();
    }, [fetchRule]);

    const handleSave = async () => {
        if (typeof points !== 'number') return;
        setIsSaving(true);
        try {
            const updatedRule = await api.loyalty.updateLoyaltyRule({ pointsPerDollar: points });
            setRule(updatedRule);
            addToast('Earning rule updated successfully!', 'success');
            setIsModalOpen(false);
        } catch (error) {
            addToast('Failed to update rule.', 'error');
        } finally {
            setIsSaving(false);
        }
    };
    
    const openModal = () => {
        if(rule) setPoints(rule.pointsPerDollar);
        setIsModalOpen(true);
    }
    
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Earning Rule</CardTitle>
                <button onClick={openModal} className="text-slate-500 hover:text-slate-700" aria-label="Edit earning rule">
                    <PencilIcon className="h-4 w-4" />
                </button>
            </CardHeader>
            <CardContent className="flex items-center justify-center text-center h-[calc(100%-70px)]">
                {loading ? (
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-24 mx-auto" />
                        <Skeleton className="h-4 w-32 mx-auto" />
                    </div>
                ) : rule ? (
                    <div>
                        <p className="text-4xl font-bold text-primary-700">{rule.pointsPerDollar} points</p>
                        <p className="text-sm text-slate-500 mt-1">for every $1 spent</p>
                    </div>
                ) : (
                    <p className="text-slate-500">No rule set.</p>
                )}
            </CardContent>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Earning Rule">
                <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
                    <div className="space-y-1">
                        <p className="text-sm text-slate-700 font-medium">Set Earning Rule</p>
                        <p className="text-sm text-slate-500">Define how many loyalty points customers earn for each dollar spent.</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <label htmlFor="points" className="block text-sm font-medium text-slate-700 mb-2">
                            Points per Dollar
                        </label>
                        <div className="flex items-center space-x-3">
                            <Input
                                id="points"
                                type="number"
                                value={points}
                                onChange={(e) => setPoints(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                required
                                min="0"
                                className="w-28 text-center font-semibold text-lg"
                            />
                            <span className="text-slate-600 font-medium">=</span>
                            <span className="text-sm text-slate-700 font-medium">
                                $1.00 spent
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4 border-t border-slate-200">
                        <Button type="button" onClick={() => setIsModalOpen(false)} disabled={isSaving}>Cancel</Button>
                        <Button type="submit" variant="primary" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Rule'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </Card>
    )
}

export default EarningRuleWidget;