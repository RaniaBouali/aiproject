export type Role = 'CLIENT' | 'PROVIDER' | 'ADMIN';

export type PriceType = 'HOURLY' | 'FIXED' | 'ESTIMATE';

export type BookingStatus = 
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  badgeCount?: number;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  priceType: PriceType;
  durationMinutes?: number;
}

export interface Review {
  id: string;
  bookingId?: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  addressText: string;
  latitude: number;
  longitude: number;
  operationalRadiusKm: number; // coverage radius
  isVerified: boolean;
  ratingAverage: number;
  reviewCount: number;
  status: 'AVAILABLE' | 'BUSY' | 'OFF_DUTY';
  bio: string;
  experienceYears: number;
  categories: Category[];
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  reviews: Review[];
  distanceKm?: number; // Dynamically computed based on user's search point
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientAddress: string;
  providerId: string;
  providerName: string;
  serviceId: string;
  serviceTitle: string;
  servicePrice: number;
  servicePriceType: PriceType;
  scheduledAt: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeoSearchFilters {
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  category?: string;
  minRating?: number;
  maxPrice?: number;
  sortBy?: 'distance' | 'rating' | 'price_asc' | 'reviews';
  query?: string;
}
