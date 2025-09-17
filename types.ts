// Fix: Add all necessary type definitions for the application.

// User and Authentication
export type UserPlan = 'Free' | 'Pro' | 'Enterprise';
export type UserRole = 'Admin' | 'Branch Manager' | 'Staff';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: UserPlan;
  role: UserRole;
}

export type UserSignUpData = Pick<User, 'name' | 'email'> & { password_unused: string };

// Data for creating/updating a user from the settings page
export type UserFormData = Pick<User, 'name' | 'email' | 'role'>;


// Customers
export type Tier = 'Discovery' | 'Silver' | 'Gold' | 'Platinum';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string; // YYYY-MM-DD
  tier: Tier;
  lastSeen: string;
  points: number;
}

export type CustomerFormData = Omit<Customer, 'id' | 'lastSeen' | 'points'>;

export interface TopCustomer {
  id: string;
  name: string;
  clv: number; // Customer Lifetime Value
  tier: Tier;
}

export interface TopLoyaltyMember {
  id: string;
  name: string;
  points: number;
  tier: Tier;
}

// Dashboard and Analytics
export interface KpiData {
    value: number;
    change: number;
}

export interface QuickStatsData {
  totalRevenue: KpiData;
  newCustomers: KpiData;
  avgRevenuePerUser: KpiData;
  conversionRate: KpiData;
}

export interface TimeSeriesData {
    date: string;
    value: number;
}

export interface LoyaltyEngagementData {
    tier: Tier;
    memberCount: number;
}

// Loyalty Program
export type BenefitType = 'descriptive' | 'rule';
export type RuleType = 'PERCENTAGE_DISCOUNT' | 'FREE_ITEM';

export interface DescriptiveBenefit {
  id: string;
  type: 'descriptive';
  description: string;
}

export interface RuleBenefit {
  id: string;
  type: 'rule';
  description: string;
  ruleType: RuleType;
  value: number; // e.g., 5 for 5% discount
}

export type LoyaltyBenefit = DescriptiveBenefit | RuleBenefit;


export interface LoyaltyRule {
  pointsPerDollar: number;
}

export interface LoyaltyTier {
    name: Tier;
    pointsThreshold: number;
    benefits: LoyaltyBenefit[];
}

export interface LoyaltyReward {
    id: string;
    name: string;
    points: number;
    status: 'Active' | 'Archived';
}

// Campaigns and Communications
export interface CampaignTemplate {
    id: string;
    name: string;
    channel: 'Email' | 'WhatsApp';
    subject?: string;
    whatsappTemplateName?: string;
    content: string;
    createdAt: string;
    occasionName?: string;
    occasionDate?: string; // YYYY-MM-DD
    activityId?: string;
}

// Reservations
export type ReservationStatus = 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
export interface Reservation {
    id: string;
    customerName: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    partySize: number;
    status: ReservationStatus;
    tableNumber?: number;
    notes?: string;
    activityId?: string;
}

// Calendar and Activities
export interface Activity {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    startTime?: string; // HH:MM
    endTime?: string; // HH:MM
    description?: string;
    targetAudience: Tier | 'All';
    color: string; // e.g., 'blue', 'green', 'red'
}


// UI and Context
export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ToastContextType {
  addToast: (message: string, type?: ToastMessage['type']) => void;
}