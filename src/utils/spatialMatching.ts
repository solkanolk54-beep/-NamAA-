import { User, SpatialVolunteerMatch } from '../types';

/**
 * حساب المسافة بالكيلومتر بين نقطتين جغرافيتين (Haversine Formula)
 * لمحاكاة دالة PostGIS ST_Distance(geography, geography)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * خوارزمية المطابقة المكانية وتطابق المهارات
 * تحاكي استعلام PostGIS ST_DWithin مع ترتيب تطابق المهارات
 */
export function matchVolunteersSpatially(
  campaignLat: number,
  campaignLng: number,
  radiusKm: number,
  requiredSkills: string[],
  volunteers: User[]
): SpatialVolunteerMatch[] {
  return volunteers
    .map((volunteer) => {
      const distance = calculateDistanceKm(
        campaignLat,
        campaignLng,
        volunteer.location.lat,
        volunteer.location.lng
      );

      const matchingSkills = volunteer.skills.filter((skill) =>
        requiredSkills.includes(skill)
      );

      const isEligible = distance <= radiusKm;

      return {
        volunteer,
        distanceKm: distance,
        skillMatchCount: matchingSkills.length,
        matchingSkills,
        isEligible,
      };
    })
    .filter((match) => match.isEligible)
    .sort((a, b) => {
      // الترتيب أولاً بالأعلى توافقاً في المهارات، ثم بالأقرب مسافة
      if (b.skillMatchCount !== a.skillMatchCount) {
        return b.skillMatchCount - a.skillMatchCount;
      }
      return a.distanceKm - b.distanceKm;
    });
}
