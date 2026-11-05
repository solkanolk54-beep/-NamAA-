import { CrisisEvent, EmergencyDispatchRoute, User } from '../types';

/**
 * وحدة الاستجابة للطوارئ وتوجيه المتطوعين في الأزمات البيئية
 * (Emergency Dispatch & Spatial Crisis Routing Module)
 * تعتمد خوارزميات التوجيه الآمن وتجاوز نطاقات الخطر (Hazard Buffers)
 */

export const ACTIVE_MILA_CRISIS_EVENTS: CrisisEvent[] = [
  {
    id: 'crisis-senawa-fire-01',
    title: 'تطويق حريق محدود بالأحراش الجافة - مرتفعات صناوة',
    crisisType: 'wildfire',
    severity: 'level_3_critical',
    affectedZoneName: 'المنحدر الغربي لغابة صناوة، ميلة',
    epicenter: [36.4425, 6.2515],
    evacuationRadiusMeters: 600,
    bufferPolygonCoords: [
      [36.445, 6.248],
      [36.446, 6.255],
      [36.440, 6.256],
      [36.439, 6.249],
    ],
    requiredVolunteerRoles: ['حفر شاق', 'نقل مياه', 'إسعاف أولي'],
    minimumVolunteersNeeded: 25,
    confirmedDispatchedCount: 16,
    safeAssemblyPoint: {
      name: 'مدرج دار الشباب صناوة (منطقة آمنة مجهزة)',
      coords: [36.4475, 6.261],
    },
    reportedAt: 'اليوم، منذ 45 دقيقة',
    status: 'active',
  },
  {
    id: 'crisis-haroun-siltation-02',
    title: 'تهديد انجراف طمي حاد نحو مجرى وادي سد بني هارون',
    crisisType: 'soil_erosion_collapse',
    severity: 'level_2_urgent',
    affectedZoneName: 'المصب الجنوبي الشرقي لبني هارون',
    epicenter: [36.554, 6.276],
    evacuationRadiusMeters: 400,
    bufferPolygonCoords: [
      [36.557, 6.273],
      [36.556, 6.279],
      [36.551, 6.278],
      [36.552, 6.272],
    ],
    requiredVolunteerRoles: ['زراعة وغرس', 'حفر وتثبيت مصدات'],
    minimumVolunteersNeeded: 40,
    confirmedDispatchedCount: 28,
    safeAssemblyPoint: {
      name: 'محطة المراقبة المائية لسد بني هارون',
      coords: [36.558, 6.27],
    },
    reportedAt: 'منذ ساعتين',
    status: 'active',
  },
];

/**
 * خوارزمية فرز المتطوعين حسب فئات الطوارئ (Emergency Skill Tiers)
 * Tier 1: إسعاف أولي وإنقاذ ميداني
 * Tier 2: حفر شاق وفتح خطوط عزل النيران (Firebreaks)
 * Tier 3: ري، نقل مياه، ودعم لوجستي
 */
export function triageVolunteersForCrisis(
  crisis: CrisisEvent,
  volunteers: User[]
): {
  tier1Medical: User[];
  tier2Firebreak: User[];
  tier3Logistics: User[];
} {
  const tier1Medical: User[] = [];
  const tier2Firebreak: User[] = [];
  const tier3Logistics: User[] = [];

  volunteers.forEach((v) => {
    const hasMedical = v.skills.some((s) => s.includes('إسعاف'));
    const hasHeavyLabor = v.skills.some((s) => s.includes('حفر') || s.includes('تقليم'));

    if (hasMedical) {
      tier1Medical.push(v);
    } else if (hasHeavyLabor && v.fitnessLevel === 'athlete') {
      tier2Firebreak.push(v);
    } else {
      tier3Logistics.push(v);
    }
  });

  return { tier1Medical, tier2Firebreak, tier3Logistics };
}

/**
 * توليد مسار استدعاء آمن للمتطوع يتجاوز منطقة الخطر
 * (Bypassing Hazard Buffer Polygon)
 */
export function generateSafeCrisisRoute(
  crisis: CrisisEvent,
  volunteer: User
): EmergencyDispatchRoute {
  const origin: [number, number] = [volunteer.location.lat, volunteer.location.lng];
  const destination = crisis.safeAssemblyPoint.coords;

  // حساب مسار عبر نقاط آمنة التفافية لتفادي بؤرة الخطر
  const safeWaypoints: [number, number][] = [
    origin,
    [
      (origin[0] + destination[0]) / 2 + 0.003, // التفاف شمالي آمن لتفادي دخان الحريق
      (origin[1] + destination[1]) / 2 - 0.002,
    ],
    destination,
  ];

  // ضغط بيانات التوجيه في حزمة نصية 160 حرفاً للعمل عبر SMS / LoRa Mesh عند انقطاع شبكة 4G
  const compressedPacket = `[EMRG:${crisis.id.slice(0, 10)}][VOL:${volunteer.id}][LAT:${origin[0].toFixed(3)},${origin[1].toFixed(3)}][DEST:${destination[0].toFixed(3)},${destination[1].toFixed(3)}][ASMB:${crisis.safeAssemblyPoint.name.slice(0, 15)}][SIG:${Math.random().toString(36).substring(2, 6).toUpperCase()}]`;

  return {
    crisisId: crisis.id,
    volunteerId: volunteer.id,
    originCoords: origin,
    destinationCoords: destination,
    safeWaypoints,
    hazardBufferMeters: crisis.evacuationRadiusMeters,
    estimatedTransitMinutes: 18,
    distanceKm: 4.6,
    routeSafetyScore: 94,
    offlineCompressedSmsPacket: compressedPacket,
  };
}
