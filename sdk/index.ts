// Fix: Create the main SDK entry point to export all API modules.
import { authApi } from './auth.sdk';
import { customerApi } from './customer.sdk';
import { loyaltyApi } from './loyalty.sdk';
import { commsApi } from './comms.sdk';
import { bookingApi } from './booking.sdk';
import { analyticsApi } from './analytics.sdk';
import { activityApi } from './activity.sdk';
import { userApi } from './user.sdk';

/**
 * A single, unified SDK client for interacting with all backend services.
 */
export const api = {
  auth: authApi,
  customers: customerApi,
  loyalty: loyaltyApi,
  comms: commsApi,
  booking: bookingApi,
  analytics: analyticsApi,
  activity: activityApi,
  users: userApi,
};