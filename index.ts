/**
 * Services Index
 * Centralized export of all business logic services
 * Import services from this file for consistency
 */

// Authentication Services
export { authService } from './auth-service';

// Wallet Services  
export { walletService } from './wallet-service';

// Match Services
export { matchService } from './match-service';

// Notification Services
export { notificationService } from './notification-service';

// User Services
export { userService } from './user-service';

// Payment Gateway Service
export { PaymentGatewayService, getPaymentGateway } from './payment-gateway-service';
export type {
  PaymentGatewayConfig,
  PaymentRequest,
  PaymentResponse
} from './payment-gateway-service';

// OTP Service
export { OTPService, getOTPService } from './otp-service';
export type {
  OTPConfig,
  OTPSession,
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse
} from './otp-service';

// Database Service
export { DatabaseService, getDatabase, initializeDatabase } from './database-service';
export type { DatabaseConfig } from './database-service';

// Analytics Service
export { AnalyticsService, getAnalytics } from './analytics-service';
export type {
  AnalyticsEvent,
  GameMetrics,
  UserMetrics
} from './analytics-service';

// Security Service
export { SecurityService, getSecurityService } from './security-service';
export type {
  SecurityEvent,
  RateLimitConfig
} from './security-service';

/**
 * Initialize all services
 * Call this once during app startup
 */
export async function initializeServices(): Promise<{
  database: boolean;
  paymentGateway: boolean;
  analytics: boolean;
}> {
  const results = {
    database: false,
    paymentGateway: false,
    analytics: false
  };

  try {
    // Initialize database
    const dbService = getDatabase();
    results.database = await dbService.initialize();
    console.log('✅ Database initialized');

    // Initialize payment gateway
    const pgService = getPaymentGateway();
    results.paymentGateway = await pgService.initialize();
    console.log('✅ Payment gateway initialized');

    // Initialize analytics
    const analyticsService = getAnalytics();
    results.analytics = analyticsService !== null;
    console.log('✅ Analytics initialized');

    console.log('🚀 All services initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize services:', error);
  }

  return results;
}

/**
 * Get all service instances
 */
export function getAllServices() {
  return {
    database: getDatabase(),
    paymentGateway: getPaymentGateway(),
    otp: getOTPService(),
    analytics: getAnalytics(),
    security: getSecurityService()
  };
}

/**
 * Service health check
 */
export async function checkServicesHealth(): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, boolean>;
}> {
  const services = {
    database: false,
    paymentGateway: false,
    otp: false,
    analytics: false,
    security: false
  };

  try {
    // Check database
    const db = getDatabase();
    services.database = db !== null;

    // Check payment gateway
    const pg = getPaymentGateway();
    const info = pg.getGatewayInfo();
    services.paymentGateway = info !== null;

    // Check OTP service
    const otp = getOTPService();
    services.otp = otp !== null;

    // Check analytics
    const analytics = getAnalytics();
    services.analytics = analytics !== null;

    // Check security
    const security = getSecurityService();
    services.security = security !== null;

    // Determine overall health
    const healthyCount = Object.values(services).filter(Boolean).length;
    const totalCount = Object.keys(services).length;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyCount === totalCount) {
      status = 'healthy';
    } else if (healthyCount >= totalCount / 2) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return { status, services };
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'unhealthy', services };
  }
}
