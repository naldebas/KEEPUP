

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../sdk';
import type { LoyaltyTier, LoyaltyReward, Tier } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/Table';
import Modal from '../ui/Modal';
import RewardForm from '../loyalty/RewardForm';
import TierForm from '../loyalty/TierForm';
import { useToasts } from '../../context/ToastContext';
import { Badge } from '../ui/Badge';
import TableSkeleton from '../skeletons/TableSkeleton';
import { Skeleton } from '../ui/Skeleton';
import { PencilIcon, TrashIcon, TagIcon } from '../shared/icons';
import ConfirmationModal from '../ui/ConfirmationModal';
import { cn } from '../../lib/utils';
import EarningRuleWidget from '../loyalty/EarningRuleWidget';
import TopLoyaltyMembersWidget from '../loyalty/TopLoyaltyMembersWidget';

const LoyaltyPage: React.FC = () => {
  const [tiers, setTiers] = useState<LoyaltyTier[]>([]);
  const [rewards, setRewards] = useState<LoyaltyReward[]>([]);
  const [loadingTiers, setLoadingTiers] = useState(true);
  const [loadingRewards, setLoadingRewards] = useState(true);
  const { addToast } = useToasts();
  
  // State for Reward Modal
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [isSavingReward, setIsSavingReward] = useState(false);
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);

  // State for Tier Modal
  const [isTierModalOpen, setIsTierModalOpen] = useState(false);
  const [isSavingTier, setIsSavingTier] = useState(false);
  const [selectedTier, setSelectedTier] = useState<LoyaltyTier | null>(null);

  // State for Confirmation Modal
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [rewardToDelete, setRewardToDelete] = useState<LoyaltyReward | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTiers = useCallback(async () => {
    setLoadingTiers(true);
    try {
      const data = await api.loyalty.getLoyaltyTiers();
      setTiers(data);
    } catch (error) {
      addToast('Failed to fetch loyalty tiers.', 'error');
    } finally {
      setLoadingTiers(false);
    }
  }, [addToast]);

  const fetchRewards = useCallback(async () => {
    setLoadingRewards(true);
    try {
      const data = await api.loyalty.listRewards();
      setRewards(data);
    } catch (error) {
      addToast('Failed to fetch loyalty rewards.', 'error');
    } finally {
      setLoadingRewards(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchTiers();
    fetchRewards();
  }, [fetchTiers, fetchRewards]);

  // Handlers for Reward Modal
  const handleOpenRewardModal = (reward: LoyaltyReward | null = null) => {
    setSelectedReward(reward);
    setIsRewardModalOpen(true);
  };

  const handleCloseRewardModal = () => {
    setIsRewardModalOpen(false);
    setSelectedReward(null);
  };

  const handleSaveReward = async (formData: Omit<LoyaltyReward, 'id'>) => {
    setIsSavingReward(true);
    try {
      if (selectedReward) {
        await api.loyalty.updateReward(selectedReward.id, formData);
        addToast('Reward updated successfully!', 'success');
      } else {
        await api.loyalty.createReward(formData);
        addToast('Reward created successfully!', 'success');
      }
      handleCloseRewardModal();
      fetchRewards();
    } catch (error) {
      addToast('Failed to save reward.', 'error');
    } finally {
      setIsSavingReward(false);
    }
  };
  
  // Handlers for Tier Modal
  const handleOpenTierModal = (tier: LoyaltyTier) => {
      setSelectedTier(tier);
      setIsTierModalOpen(true);
  }

  const handleCloseTierModal = () => {
      setIsTierModalOpen(false);
      setSelectedTier(null);
  }
  
  const handleSaveTier = async (formData: Partial<Omit<LoyaltyTier, 'name'>>) => {
      if (!selectedTier) return;
      setIsSavingTier(true);
      try {
          await api.loyalty.updateLoyaltyTier(selectedTier.name, formData);
          addToast('Loyalty tier updated successfully!', 'success');
          handleCloseTierModal();
          fetchTiers();
      } catch (error) {
          addToast('Failed to update tier.', 'error');
      } finally {
          setIsSavingTier(false);
      }
  }

  // Handlers for Delete Confirmation
  const openDeleteConfirmation = (reward: LoyaltyReward) => {
    setRewardToDelete(reward);
    setIsConfirmModalOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setRewardToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const handleDeleteReward = async () => {
    if (!rewardToDelete) return;
    setIsDeleting(true);
    try {
      await api.loyalty.deleteReward(rewardToDelete.id);
      addToast('Reward deleted successfully!', 'success');
      fetchRewards();
      closeDeleteConfirmation();
    } catch (error) {
      addToast('Failed to delete reward.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const tierColorMap: Record<Tier, string> = {
    Platinum: 'border-t-accent-500',
    Gold: 'border-t-primary-500',
    Silver: 'border-t-slate-400',
    Discovery: 'border-t-slate-300',
  };

  return (
    <main className="flex-1 p-6 bg-slate-50">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-slate-900">Loyalty Program</h1>
        
        {/* Top Section: Rules & Top Members */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
                <EarningRuleWidget />
            </div>
            <div className="lg:col-span-2">
                <TopLoyaltyMembersWidget />
            </div>
        </div>

        {/* Middle Section: Loyalty Tiers */}
        <div>
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Loyalty Tier Progression</h2>
          {loadingTiers ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}><CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent></Card>
              ))}
            </div>
          ) : (
             <div className="relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 hidden lg:block" />
                <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tiers.map((tier) => (
                        <Card key={tier.name} className={cn("border-t-4", tierColorMap[tier.name])}>
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <div className={cn("w-3 h-3 rounded-full", tierColorMap[tier.name].replace('border-t-', 'bg-'))}></div>
                                    <span>{tier.name}</span>
                                </CardTitle>
                                <button onClick={() => handleOpenTierModal(tier)} className="text-slate-400 hover:text-slate-600">
                                    <PencilIcon className="h-4 w-4" />
                                </button>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-slate-500 mb-3">
                                    <span className="font-semibold text-slate-700">{tier.pointsThreshold.toLocaleString()}</span> points to unlock
                                </p>
                                <ul className="text-sm space-y-1.5">
                                    {tier.benefits.map((benefit) => (
                                    <li key={benefit.id} className="flex items-start text-slate-800">
                                        {benefit.type === 'rule' ? (
                                            <TagIcon className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <svg className="w-4 h-4 mr-2 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        )}
                                        <span>{benefit.description}</span>
                                    </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
          )}
        </div>

        {/* Bottom Section: Redeemable Rewards */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Redeemable Rewards</h2>
            <Button variant="primary" onClick={() => handleOpenRewardModal()}>
              Add Reward
            </Button>
          </div>
          <div className="bg-white rounded-xl shadow-md min-h-[300px]">
            {loadingRewards ? (
              <div className="p-4">
                  <TableSkeleton rows={5} columns={4} />
              </div>
            ) : rewards.length === 0 ? (
               <div className="text-center py-12 flex flex-col items-center justify-center h-full min-h-[300px]">
                  <h3 className="text-lg font-medium text-slate-800">No Rewards Created</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-sm">Create rewards that your customers can redeem with their loyalty points.</p>
                  <Button variant="primary" onClick={() => handleOpenRewardModal()} className="mt-4">
                      Add Reward
                  </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reward Name</TableHead>
                    <TableHead>Points Required</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell className="font-medium text-slate-900">{reward.name}</TableCell>
                      <TableCell className="text-slate-700">{reward.points.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={reward.status === 'Active' ? 'success' : 'default'}>
                            {reward.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-2">
                           <button onClick={() => handleOpenRewardModal(reward)} className="p-1 text-slate-500 hover:text-slate-700" aria-label="Edit reward">
                                <PencilIcon className="h-4 w-4" />
                            </button>
                            <button onClick={() => openDeleteConfirmation(reward)} className="p-1 text-slate-500 hover:text-red-600" aria-label="Delete reward">
                                <TrashIcon className="h-4 w-4" />
                            </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isRewardModalOpen}
        onClose={handleCloseRewardModal}
        title={selectedReward ? 'Edit Reward' : 'Add Reward'}
      >
        <RewardForm
          reward={selectedReward}
          onSubmit={handleSaveReward}
          onCancel={handleCloseRewardModal}
          isSaving={isSavingReward}
        />
      </Modal>
      
      {selectedTier && (
          <Modal
            isOpen={isTierModalOpen}
            onClose={handleCloseTierModal}
            title={`Edit ${selectedTier.name} Tier`}
          >
            <TierForm
                tier={selectedTier}
                onSubmit={handleSaveTier}
                onCancel={handleCloseTierModal}
                isSaving={isSavingTier}
            />
          </Modal>
      )}

      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={handleDeleteReward}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the reward "${rewardToDelete?.name}"? This action cannot be undone.`}
        confirmButtonText="Delete"
        isConfirming={isDeleting}
      />
    </main>
  );
};

export default LoyaltyPage;