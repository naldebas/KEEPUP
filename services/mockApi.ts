// Fix: Implement the mock API service with sample data and functions.

import type {
  User,
  Customer,
  CustomerFormData,
  TopCustomer,
  QuickStatsData,
  LoyaltyTier,
  LoyaltyReward,
  CampaignTemplate,
  Reservation,
  TimeSeriesData,
  LoyaltyEngagementData,
  ReservationStatus,
  LoyaltyRule,
  TopLoyaltyMember,
  Tier,
  UserSignUpData,
  Activity,
  UserFormData,
} from '../types';

// Utility to generate random IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Dynamic Date Helpers ---
const today = new Date();
const yesterday = new Date(new Date().setDate(today.getDate() - 1)).toISOString().split('T')[0];
const tomorrow = new Date(new Date().setDate(today.getDate() + 1)).toISOString().split('T')[0];
const twoDaysFromNow = new Date(new Date().setDate(today.getDate() + 2)).toISOString().split('T')[0];
const threeDaysFromNow = new Date(new Date().setDate(today.getDate() + 3)).toISOString().split('T')[0];
const lastWeek = new Date(new Date().setDate(today.getDate() - 7)).toISOString().split('T')[0];
const todayStr = today.toISOString().split('T')[0];
const nextMonth = new Date(new Date().setMonth(today.getMonth() + 1)).toISOString().split('T')[0];


// Mock Data Store
let customers: Customer[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone: '+12223334444', dob: '1990-05-15', tier: 'Gold', lastSeen: '2023-10-26', points: 5250 },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '+13334445555', dob: '1985-11-20', tier: 'Platinum', lastSeen: '2023-10-25', points: 12100 },
  { id: '3', name: 'Alice Johnson', email: 'alice.j@example.com', phone: '+14445556666', dob: '1992-02-10', tier: 'Silver', lastSeen: '2023-10-22', points: 1800 },
  { id: '4', name: 'Bob Brown', email: 'bob.b@example.com', phone: '+15556667777', dob: '1988-07-30', tier: 'Discovery', lastSeen: '2023-09-15', points: 450 },
  { id: '5', name: 'Charlie Davis', email: 'charlie.d@example.com', phone: '+16667778888', dob: '1995-09-05', tier: 'Gold', lastSeen: '2023-10-27', points: 6300 },
  { id: '6', name: 'Diana Prince', email: 'diana.p@example.com', phone: '+17778889999', dob: '1980-03-25', tier: 'Platinum', lastSeen: '2023-10-28', points: 15000 },
  { id: '7', name: 'Bruce Wayne', email: 'bruce.w@example.com', phone: '+18889990000', dob: '1975-04-17', tier: 'Discovery', lastSeen: '2023-08-10', points: 150 },
  { id: '8', name: 'Clark Kent', email: 'clark.k@example.com', phone: '+19990001111', dob: '1982-06-18', tier: 'Silver', lastSeen: '2023-10-15', points: 2200 },
];

let loyaltyRewards: LoyaltyReward[] = [
    { id: 'rew1', name: 'Free Appetizer', points: 1000, status: 'Active' },
    { id: 'rew2', name: '$10 Off Coupon', points: 2500, status: 'Active' },
    { id: 'rew3', name: 'Free Main Course', points: 5000, status: 'Archived' },
    { id: 'rew4', name: '20% Off Entire Bill', points: 7500, status: 'Active' },
];

let loyaltyTiers: LoyaltyTier[] = [
  { name: 'Discovery', pointsThreshold: 0, benefits: [{ id: 'd1', type: 'descriptive', description: 'Access to member-only events' }] },
  { name: 'Silver', pointsThreshold: 1500, benefits: [{ id: 's1', type: 'descriptive', description: 'Free birthday dessert' }, { id: 's2', type: 'descriptive', description: 'Early access to sales' }] },
  { name: 'Gold', pointsThreshold: 5000, benefits: [{ id: 'g1', type: 'descriptive', description: 'All Silver benefits' }, { id: 'g2', type: 'rule', description: '5% permanent discount', ruleType: 'PERCENTAGE_DISCOUNT', value: 5 }, { id: 'g3', type: 'descriptive', description: 'Dedicated support line' }] },
  { name: 'Platinum', pointsThreshold: 10000, benefits: [{ id: 'p1', type: 'descriptive', description: 'All Gold benefits' }, { id: 'p2', type: 'rule', description: '10% permanent discount', ruleType: 'PERCENTAGE_DISCOUNT', value: 10 }, { id: 'p3', type: 'descriptive', description: 'Guaranteed seating' }] },
];

let loyaltyRule: LoyaltyRule = {
    pointsPerDollar: 10,
};

let campaignTemplates: CampaignTemplate[] = [
    { id: 'tmp1', name: 'Welcome Email', channel: 'Email', subject: 'Welcome to KEEPUP!', content: 'Hi {{name}}, welcome!', createdAt: '2023-10-01' },
    { id: 'tmp2', name: 'Weekly WhatsApp Promo', channel: 'WhatsApp', whatsappTemplateName: 'weekly_promo_v2', content: 'This week get 20% off!', createdAt: '2023-10-05' },
    { id: 'tmp3', name: 'Birthday Email', channel: 'Email', subject: 'Happy Birthday!', content: 'Happy birthday, {{name}}! Here is a free gift.', createdAt: '2023-09-15' },
    { id: 'tmp4', name: 'New Tier Notification', channel: 'Email', subject: 'You have a new tier!', content: 'Congratulations, {{name}}! You reached a new tier.', createdAt: '2023-08-20' },
    { id: 'tmp5', name: 'New Year Greeting', channel: 'Email', subject: 'Happy New Year!', content: 'Wishing you all the best for the new year!', createdAt: '2023-07-01', occasionName: "New Year's Day", occasionDate: '2024-01-01'},
    { id: 'tmp6', name: 'Big Match Promo', channel: 'WhatsApp', whatsappTemplateName: 'match_day_special', content: 'The big game is on! Join us for live screening and special offers.', createdAt: '2023-10-20', activityId: 'act1' },

];

let reservations: Reservation[] = [
  { id: 'res1', customerName: 'Alice Johnson', date: todayStr, time: '18:30', partySize: 2, status: 'Confirmed', tableNumber: 5, notes: 'Window seat requested' },
  { id: 'res2', customerName: 'Bob Brown', date: todayStr, time: '19:00', partySize: 4, status: 'Confirmed', tableNumber: 12, notes: 'Birthday celebration' },
  { id: 'res3', customerName: 'Charlie Davis', date: todayStr, time: '20:15', partySize: 3, status: 'Pending', tableNumber: 8, notes: '' },
  { id: 'res4', customerName: 'Diana Prince', date: tomorrow, time: '12:00', partySize: 2, status: 'Confirmed', tableNumber: 2, notes: '' },
  { id: 'res5', customerName: 'John Doe', date: tomorrow, time: '19:30', partySize: 5, status: 'Confirmed', tableNumber: 15, notes: 'High chair needed' },
  { id: 'res6', customerName: 'Jane Smith', date: twoDaysFromNow, time: '18:00', partySize: 2, status: 'Pending', tableNumber: 3, notes: '' },
  { id: 'res7', customerName: 'Bruce Wayne', date: yesterday, time: '21:00', partySize: 2, status: 'Completed', tableNumber: 7, notes: '' },
  { id: 'res8', customerName: 'Clark Kent', date: lastWeek, time: '20:00', partySize: 4, status: 'Completed', tableNumber: 1, notes: '' },
  { id: 'res9', customerName: 'Peter Parker', date: threeDaysFromNow, time: '19:00', partySize: 2, status: 'Confirmed', tableNumber: 9, notes: 'Anniversary' },
  { id: 'res10', customerName: 'Tony Stark', date: todayStr, time: '21:00', partySize: 6, status: 'Confirmed', tableNumber: 20, notes: 'Quiet table please' },
  { id: 'res11', customerName: 'Steve Rogers', date: tomorrow, time: '20:00', partySize: 4, status: 'Confirmed', tableNumber: 11, notes: 'Watching the match', activityId: 'act1' },
];

let activities: Activity[] = [
    { id: 'act1', title: 'Champions League Final', date: tomorrow, startTime: '20:00', endTime: '22:00', description: 'Live screening on all TVs.', targetAudience: 'All', color: 'blue' },
    { id: 'act2', title: 'Gold Tier Wine Tasting', date: twoDaysFromNow, startTime: '18:00', endTime: '19:30', description: 'Exclusive wine tasting event for Gold members.', targetAudience: 'Gold', color: 'yellow' },
    { id: 'act3', title: 'New Year\'s Eve Dinner', date: '2024-12-31', startTime: '19:00', description: 'Special set menu for New Year\'s Eve.', targetAudience: 'All', color: 'red' },
    { id: 'act4', title: 'Local Band Night', date: threeDaysFromNow, startTime: '21:00', targetAudience: 'All', color: 'green' },
];


// --- Mock API Functions ---

// Simulate network delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Auth & Users
let users: User[] = [
    { id: 'user-ent', name: 'Admin User', email: 'admin@example.com', plan: 'Enterprise', role: 'Admin' },
    { id: 'user-pro', name: 'Manager User', email: 'manager@example.com', plan: 'Pro', role: 'Branch Manager' },
    { id: 'user-free', name: 'Staff User', email: 'staff@example.com', plan: 'Free', role: 'Staff' },
    { id: 'user-staff-2', name: 'Jane Doe', email: 'jane.doe@example.com', plan: 'Pro', role: 'Staff'},
    { id: 'user-staff-3', name: 'Peter Jones', email: 'peter.jones@example.com', plan: 'Pro', role: 'Staff'},
];

export const login = async (email: string): Promise<{ token: string; user: User }> => {
  await delay(500);
  const user = users.find(u => u.email === email);
  if (user) {
    return { token: `mock-token-for-${user.id}`, user };
  }
  throw new Error('Invalid email or password');
};

export const signup = async (data: UserSignUpData): Promise<{ token: string; user: User }> => {
    await delay(700);
    if (users.some(u => u.email === data.email)) {
        throw new Error('An account with this email already exists.');
    }
    const newUser: User = {
        id: generateId(),
        name: data.name,
        email: data.email,
        plan: 'Free', // Default to free plan on signup
        role: 'Admin', // The user who signs up is the admin of their account
    };
    users.push(newUser);
    return { token: `mock-token-for-${newUser.id}`, user: newUser };
};

export const logout = async (): Promise<void> => {
  await delay(200);
  return;
};

// User management by admins/managers
export const listUsers = async (): Promise<User[]> => {
    await delay(400);
    return [...users];
};

export const createUser = async (data: Omit<User, 'id' | 'plan'>, creator: User): Promise<User> => {
    await delay(300);
    if (users.some(u => u.email === data.email)) {
        throw new Error('A user with this email already exists.');
    }
    const newUser: User = {
        id: generateId(),
        plan: creator.plan, // Inherit plan from the creator's account
        ...data,
    };
    users.push(newUser);
    return newUser;
};

export const updateUser = async (id: string, data: Partial<Omit<User, 'id' | 'plan'>>): Promise<User> => {
    await delay(300);
    const index = users.findIndex(u => u.id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...data };
    return users[index];
};

export const deleteUser = async (id: string): Promise<void> => {
    await delay(400);
    users = users.filter(u => u.id !== id);
};


// Customers
export const listCustomers = async (): Promise<Customer[]> => {
  await delay(500);
  return [...customers];
};

export const createCustomer = async (data: CustomerFormData): Promise<Customer> => {
  await delay(300);
  const newCustomer: Customer = {
    id: generateId(),
    ...data,
    lastSeen: new Date().toISOString().split('T')[0],
    points: 0,
  };
  customers.push(newCustomer);
  return newCustomer;
};

export const updateCustomer = async (id: string, data: Partial<CustomerFormData>): Promise<Customer> => {
    await delay(300);
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Customer not found');
    customers[index] = { ...customers[index], ...data };
    return customers[index];
};

export const deleteCustomer = async (id: string): Promise<void> => {
    await delay(400);
    customers = customers.filter(c => c.id !== id);
};

export const getTopCustomers = async (): Promise<TopCustomer[]> => {
    await delay(800);
    // Mock CLV for simplicity
    return customers.slice(0, 5).map(c => ({
        ...c,
        clv: c.tier === 'Platinum' ? 5000 : c.tier === 'Gold' ? 2500 : 1000,
    })).sort((a,b) => b.clv - a.clv);
};

// Analytics
export const getQuickStats = async (): Promise<QuickStatsData> => {
    await delay(300);
    return {
        totalRevenue: { value: 71897, change: 12.2 },
        newCustomers: { value: 231, change: 5.8 },
        avgRevenuePerUser: { value: 128, change: -1.2 },
        conversionRate: { value: 4.8, change: 0.5 },
    };
};

export const getRevenueTrends = async (days: number): Promise<TimeSeriesData[]> => {
    await delay(600);
    return Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'),
        value: Math.floor(Math.random() * 2000) + 1000,
    }));
};

export const getCustomerGrowth = async (days: number): Promise<TimeSeriesData[]> => {
    await delay(600);
    let total = 150;
    return Array.from({ length: days }, (_, i) => {
        total += Math.floor(Math.random() * 10) + 1;
        return {
            date: new Date(Date.now() - (days - i - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('en-CA'),
            value: total,
        }
    });
};

export const getLoyaltyEngagement = async (): Promise<LoyaltyEngagementData[]> => {
    await delay(450);
    return [
        { tier: 'Platinum', memberCount: 15 },
        { tier: 'Gold', memberCount: 42 },
        { tier: 'Silver', memberCount: 88 },
        { tier: 'Discovery', memberCount: 153 },
    ];
};

export const getBookingStatusCounts = async (): Promise<Record<ReservationStatus, number>> => {
    await delay(300);
    const today = new Date().toISOString().split('T')[0];
    const todaysBookings = reservations.filter(r => r.date === today);
    return todaysBookings.reduce((acc, res) => {
        acc[res.status] = (acc[res.status] || 0) + 1;
        return acc;
    }, { 'Pending': 0, 'Confirmed': 0, 'Cancelled': 0, 'Completed': 0 });
};

export const getTodaysBookings = async (): Promise<Reservation[]> => {
    await delay(400);
    const today = new Date().toISOString().split('T')[0];
    return reservations
        .filter(r => r.date === today && r.status !== 'Cancelled' && r.status !== 'Completed')
        .sort((a, b) => a.time.localeCompare(b.time));
};

export const exportDashboardData = async (timePeriod: number): Promise<string> => {
    await delay(1000);
    const revenue = await getRevenueTrends(timePeriod);
    let csv = 'Date,Revenue\n';
    revenue.forEach(row => {
        csv += `${row.date},${row.value}\n`;
    });
    return csv;
};

// Loyalty
export const getLoyaltyTiers = async (): Promise<LoyaltyTier[]> => {
  await delay(400);
  return loyaltyTiers;
};

export const updateLoyaltyTier = async (name: Tier, data: Partial<Omit<LoyaltyTier, 'name'>>): Promise<LoyaltyTier> => {
    await delay(300);
    const index = loyaltyTiers.findIndex(t => t.name === name);
    if (index === -1) throw new Error('Tier not found');
    loyaltyTiers[index] = { ...loyaltyTiers[index], ...data };
    return loyaltyTiers[index];
};

export const getLoyaltyRule = async (): Promise<LoyaltyRule> => {
    await delay(200);
    return loyaltyRule;
};
export const updateLoyaltyRule = async (rule: LoyaltyRule): Promise<LoyaltyRule> => {
    await delay(250);
    loyaltyRule = rule;
    return loyaltyRule;
};
export const getTopLoyaltyMembers = async (): Promise<TopLoyaltyMember[]> => {
    await delay(700);
    return [...customers]
        .sort((a, b) => b.points - a.points)
        .slice(0, 4)
        .map(c => ({ id: c.id, name: c.name, points: c.points, tier: c.tier }));
};

export const listRewards = async (): Promise<LoyaltyReward[]> => {
    await delay(400);
    return [...loyaltyRewards];
};

export const createReward = async (data: Omit<LoyaltyReward, 'id'>): Promise<LoyaltyReward> => {
    await delay(300);
    const newReward: LoyaltyReward = { id: generateId(), ...data };
    loyaltyRewards.push(newReward);
    return newReward;
};

export const updateReward = async (id: string, data: Partial<Omit<LoyaltyReward, 'id'>>): Promise<LoyaltyReward> => {
    await delay(300);
    const index = loyaltyRewards.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Reward not found');
    loyaltyRewards[index] = { ...loyaltyRewards[index], ...data };
    return loyaltyRewards[index];
};

export const deleteReward = async (id: string): Promise<void> => {
    await delay(400);
    loyaltyRewards = loyaltyRewards.filter(r => r.id !== id);
};

// Comms
export const listTemplates = async (): Promise<CampaignTemplate[]> => {
    await delay(400);
    return [...campaignTemplates];
};
export const createTemplate = async (data: Omit<CampaignTemplate, 'id' | 'createdAt'>): Promise<CampaignTemplate> => {
    await delay(300);
    const newTemplate: CampaignTemplate = {
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString().split('T')[0],
    };
    campaignTemplates.push(newTemplate);
    return newTemplate;
};
export const updateTemplate = async (id: string, data: Partial<Omit<CampaignTemplate, 'id'>>): Promise<CampaignTemplate> => {
    await delay(300);
    const index = campaignTemplates.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Template not found');
    campaignTemplates[index] = { ...campaignTemplates[index], ...data };
    return campaignTemplates[index];
};
export const deleteTemplate = async (id: string): Promise<void> => {
    await delay(400);
    campaignTemplates = campaignTemplates.filter(t => t.id !== id);
};

// Bookings
export const listReservations = async (): Promise<Reservation[]> => {
    await delay(500);
    return [...reservations];
};
export const createReservation = async (data: Omit<Reservation, 'id'>): Promise<Reservation> => {
    await delay(300);
    const newReservation: Reservation = { id: generateId(), ...data };
    reservations.push(newReservation);
    return newReservation;
};
export const updateReservation = async (id: string, data: Partial<Omit<Reservation, 'id'>>): Promise<Reservation> => {
    await delay(300);
    const index = reservations.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Reservation not found');
    reservations[index] = { ...reservations[index], ...data };
    return reservations[index];
};
export const deleteReservation = async (id: string): Promise<void> => {
    await delay(400);
    reservations = reservations.filter(r => r.id !== id);
};

// Activities
export const listActivities = async (): Promise<Activity[]> => {
    await delay(500);
    return [...activities];
};
export const createActivity = async (data: Omit<Activity, 'id'>): Promise<Activity> => {
    await delay(300);
    const newActivity: Activity = { id: generateId(), ...data };
    activities.push(newActivity);
    return newActivity;
};
export const updateActivity = async (id: string, data: Partial<Omit<Activity, 'id'>>): Promise<Activity> => {
    await delay(300);
    const index = activities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Activity not found');
    activities[index] = { ...activities[index], ...data };
    return activities[index];
};
export const deleteActivity = async (id: string): Promise<void> => {
    await delay(400);
    activities = activities.filter(a => a.id !== id);
};