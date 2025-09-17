// Fix: Implement the loyalty SDK module.
import * as mockApi from '../services/mockApi';
import type { LoyaltyTier, LoyaltyReward, LoyaltyRule, TopLoyaltyMember, Tier } from '../types';

const getLoyaltyTiers = (): Promise<LoyaltyTier[]> => mockApi.getLoyaltyTiers();

const updateLoyaltyTier = (name: Tier, data: Partial<Omit<LoyaltyTier, 'name'>>): Promise<LoyaltyTier> => mockApi.updateLoyaltyTier(name, data);

const getLoyaltyRule = (): Promise<LoyaltyRule> => mockApi.getLoyaltyRule();
const updateLoyaltyRule = (rule: LoyaltyRule): Promise<LoyaltyRule> => mockApi.updateLoyaltyRule(rule);
const getTopLoyaltyMembers = (): Promise<TopLoyaltyMember[]> => mockApi.getTopLoyaltyMembers();

const listRewards = (): Promise<LoyaltyReward[]> => mockApi.listRewards();

const createReward = (data: Omit<LoyaltyReward, 'id'>): Promise<LoyaltyReward> => mockApi.createReward(data);

const updateReward = (id: string, data: Partial<Omit<LoyaltyReward, 'id'>>): Promise<LoyaltyReward> => mockApi.updateReward(id, data);

const deleteReward = (id: string): Promise<void> => mockApi.deleteReward(id);

export const loyaltyApi = {
  getLoyaltyTiers,
  updateLoyaltyTier,
  listRewards,
  createReward,
  updateReward,
  deleteReward,
  getLoyaltyRule,
  updateLoyaltyRule,
  getTopLoyaltyMembers,
};