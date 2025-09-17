import {
  exportDashboardData,
  getRevenueTrends,
  getCustomerGrowth,
  getLoyaltyEngagement,
  getBookingStatusCounts,
  getTodaysBookings
} from '../services/mockApi';
import type { TimeSeriesData, LoyaltyEngagementData, ReservationStatus, Reservation } from '../types';

const exportDashboard = async (timePeriod: 7 | 30 | 90): Promise<string> => {
  return exportDashboardData(timePeriod);
};

const mockGetRevenueTrends = (days: number): Promise<TimeSeriesData[]> => getRevenueTrends(days);
const mockGetCustomerGrowth = (days: number): Promise<TimeSeriesData[]> => getCustomerGrowth(days);
const mockGetLoyaltyEngagement = (): Promise<LoyaltyEngagementData[]> => getLoyaltyEngagement();
const mockGetBookingStatusCounts = (): Promise<Record<ReservationStatus, number>> => getBookingStatusCounts();
const mockGetTodaysBookings = (): Promise<Reservation[]> => getTodaysBookings();

export const analyticsApi = {
  exportDashboard,
  getRevenueTrends: mockGetRevenueTrends,
  getCustomerGrowth: mockGetCustomerGrowth,
  getLoyaltyEngagement: mockGetLoyaltyEngagement,
  getBookingStatusCounts: mockGetBookingStatusCounts,
  getTodaysBookings: mockGetTodaysBookings,
};