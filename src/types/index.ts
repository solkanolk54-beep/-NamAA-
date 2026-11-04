export type UserRole = 'volunteer' | 'organizer' | 'sponsor' | 'admin';

export type FitnessLevel = 'beginner' | 'moderate' | 'athlete';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  weightKg: number;
  fitnessLevel: FitnessLevel;
  skills: string[];
  impactPoints: number;
  totalTreesAdopted: number;
  totalCaloriesBurned: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export type TreeSpecies = 'زيتون (Olive)' | 'خروب (Carob)' | 'صنوبر حلبي (Aleppo Pine)' | 'سدر بري (Wild Jujube)';

export type TreeHealthStatus = 'healthy' | 'needs_water' | 'pruned' | 'dormant';

export interface TreeItem {
  id: string;
  tagCode: string;
  species: TreeSpecies;
  lat: number;
  lng: number;
  plantedAt: string;
  adopterId?: string;
  adopterName?: string;
  healthStatus: TreeHealthStatus;
  lastWatered: string;
  nextWateringDue: string;
  estimatedAnnualCo2Kg: number;
  photoUrl?: string;
}

export type TaskType = 'digging' | 'tree_planting' | 'carrying_water' | 'site_clearing';

export interface Campaign {
  id: string;
  title: string;
  facilityName: string;
  description: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  startTime: string;
  endTime: string;
  volunteerQuota: number;
  currentVolunteers: number;
  requiredSkills: string[];
  mealQuota: number;
  mealsClaimed: number;
  sponsorName: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface DualImpactLog {
  id: string;
  userId: string;
  userName: string;
  campaignId: string;
  taskType: TaskType;
  durationMinutes: number;
  metIntensity: number;
  caloriesBurned: number;
  recommendedProteinGrams: number;
  recommendedCarbsGrams: number;
  hydrationMl: number;
  treesPlanted: number;
  lifetimeCo2OffsetKg: number;
  earnedPoints: number;
  timestamp: string;
  isOfflineSynced: boolean;
}

export interface NutritionalVoucher {
  id: string;
  code: string;
  volunteerId: string;
  volunteerName: string;
  campaignTitle: string;
  sponsorName: string;
  mealName: string;
  targetProteinG: number;
  targetCarbsG: number;
  calories: number;
  hydrationMl: number;
  isRedeemed: boolean;
  redeemedAt?: string;
  expiresAt: string;
  generatedAt: string;
}

export interface SpatialVolunteerMatch {
  volunteer: User;
  distanceKm: number;
  skillMatchCount: number;
  matchingSkills: string[];
  isEligible: boolean;
}
