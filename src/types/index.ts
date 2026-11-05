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
  heightCm?: number;
  canopyDiameterCm?: number;
  growthStage?: 'sapling' | 'young' | 'maturing' | 'mature';
  soilMoistureLevel?: 'dry' | 'moderate' | 'optimal';
  totalWateringCount?: number;
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

// 1. Dynamic MET & Advanced Nutrition Types
export type TerrainSlope = 'flat' | 'moderate_slope' | 'steep_mountain';
export type AmbientTemp = 'cool' | 'moderate' | 'hot_summer';

export interface DynamicMETOptions {
  terrainSlope?: TerrainSlope;
  ambientTemp?: AmbientTemp;
  cardiacDriftMultiplier?: number;
}

export interface AdvancedRecoveryNutrients {
  targetProteinGrams: number;
  leucineGrams: number;
  targetCarbsGrams: number;
  glycogenWindowMinutes: number;
  hydrationMl: number;
  sodiumMg: number;
  potassiumMg: number;
  magnesiumMg: number;
  recommendedRecipe: string;
}

// 2. Smart Tree Tracking & QR Schema
export interface TreeQRPayload {
  v: number; // schema version (1)
  tid: string; // tag code (e.g. MLA-OLV-001)
  treeId: string;
  speciesCode: 'OLV' | 'CRB' | 'PIN' | 'SDR';
  plantedTimestamp: number;
  coords: [number, number]; // [lat, lng]
  cryptoSignature: string; // HMAC-SHA256 signature
}

export interface OfflineWateringEvent {
  id: string; // UUID v4 / v5
  idempotencyKey: string;
  treeTagCode: string;
  volunteerId: string;
  volunteerName: string;
  waterVolumeLiters: number;
  soilMoistureLevel: 'dry' | 'moderate' | 'optimal';
  recordedAtTimestamp: number;
  vectorClock: number;
  syncStatus: 'queued' | 'reconciled' | 'conflict_resolved';
}

export interface TreeGrowthMilestone {
  id: string;
  treeTagCode: string;
  recordedDate: string;
  heightCm: number;
  canopyDiameterCm: number;
  stemDiameterMm: number;
  calculatedBiomassKg: number;
  healthIndex: number; // 0 - 100
}

// 3. Geo-AI Vegetation & Carbon Metrics
export interface GeoAiPlotMetrics {
  plotId: string;
  plotName: string;
  centerCoords: [number, number];
  areaHectares: number;
  ndviCurrent: number; // Normalized Difference Vegetation Index (-1 to +1)
  ndviBaseline: number;
  saviIndex: number; // Soil Adjusted Vegetation Index
  canopyCoveragePercent: number; // e.g. 34.5%
  treeDensityPerHectare: number;
  speciesDistribution: Record<string, number>;
  totalBiomassTons: number;
  annualCo2AbsorptionTons: number;
  historicalYears: number[];
  ndviTrend: number[];
  canopyTrendPercent: number[];
}

// 4. Emergency Dispatch Module
export type CrisisType = 'wildfire' | 'flash_flood' | 'severe_drought' | 'soil_erosion_collapse';
export type CrisisSeverity = 'level_1_advisory' | 'level_2_urgent' | 'level_3_critical' | 'level_4_emergency';

export interface CrisisEvent {
  id: string;
  title: string;
  crisisType: CrisisType;
  severity: CrisisSeverity;
  affectedZoneName: string;
  epicenter: [number, number];
  evacuationRadiusMeters: number;
  bufferPolygonCoords: [number, number][];
  requiredVolunteerRoles: string[];
  minimumVolunteersNeeded: number;
  confirmedDispatchedCount: number;
  safeAssemblyPoint: {
    name: string;
    coords: [number, number];
  };
  reportedAt: string;
  status: 'active' | 'contained' | 'resolved';
}

export interface EmergencyDispatchRoute {
  crisisId: string;
  volunteerId: string;
  originCoords: [number, number];
  destinationCoords: [number, number];
  safeWaypoints: [number, number][];
  hazardBufferMeters: number;
  estimatedTransitMinutes: number;
  distanceKm: number;
  routeSafetyScore: number; // 0 - 100
  offlineCompressedSmsPacket: string; // 160-char SMS fallback string
}

