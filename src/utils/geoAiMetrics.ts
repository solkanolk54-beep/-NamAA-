import { GeoAiPlotMetrics } from '../types';

/**
 * محرك التحليل الجغرافي بالذكاء الاصطناعي (Geo-AI Remote Sensing & Carbon Engine)
 * لحساب مؤشرات الغطاء النباتي (NDVI/SAVI)، والكتلة الحيوية (Biomass)، ومعدلات امتصاص الكربون
 */

/**
 * حساب مؤشر الغطاء النباتي الطبيعي (NDVI)
 * NDVI = (NIR - RED) / (NIR + RED)
 */
export function calculateNDVI(nirBand: number, redBand: number): number {
  if (nirBand + redBand === 0) return 0;
  const ndvi = (nirBand - redBand) / (nirBand + redBand);
  return Math.round(ndvi * 1000) / 1000;
}

/**
 * حساب مؤشر الغطاء النباتي المعدل للتربة (SAVI)
 * ملائم للتربة شبه الجافة بميلة لتقليل تشويش التربة العارية (L = 0.5)
 * SAVI = ((NIR - RED) / (NIR + RED + L)) * (1 + L)
 */
export function calculateSAVI(nirBand: number, redBand: number, L: number = 0.5): number {
  const denominator = nirBand + redBand + L;
  if (denominator === 0) return 0;
  const savi = ((nirBand - redBand) / denominator) * (1 + L);
  return Math.round(savi * 1000) / 1000;
}

/**
 * معادلات قياس الكتلة الحيوية الشجرية (Allometric Biomass Equations)
 * مبنية على دراسات حوض البحر الأبيض المتوسط للأشجار المعتمدة في ميلة
 *
 * 1. شجرة الزيتون (Olea europaea):
 *    AGB (Above-ground Biomass) = 0.0509 * (D^2 * H)^0.919
 * 2. شجرة الخروب (Ceratonia siliqua):
 *    AGB = 0.082 * (D)^2.34
 * 3. الصنوبر الحلبي (Pinus halepensis):
 *    AGB = 0.041 * (D)^2.41
 *
 * معامل تحويل الكتلة الحيوية إلى كربون نقي = 0.47 (47% كربون)
 * معامل تحويل الكربون إلى CO2 = 44/12 = 3.667
 */
export function estimateTreeBiomassAndAnnualCo2(
  species: 'olive' | 'carob' | 'pine',
  diameterCm: number,
  heightMeters: number
): {
  aboveGroundBiomassKg: number;
  totalBiomassWithRootsKg: number;
  carbonStoredKg: number;
  annualCo2RateKg: number;
} {
  let agbKg = 0;

  if (species === 'olive') {
    agbKg = 0.0509 * Math.pow(Math.pow(diameterCm, 2) * heightMeters, 0.919);
  } else if (species === 'carob') {
    agbKg = 0.082 * Math.pow(diameterCm, 2.34);
  } else {
    agbKg = 0.041 * Math.pow(diameterCm, 2.41);
  }

  // إضافة الكتلة الجذرية التحت-أرضية (Root-to-shoot ratio R = 0.28)
  const totalBiomassWithRootsKg = Math.round(agbKg * 1.28 * 10) / 10;
  // محتوى الكربون النقي (47%)
  const carbonStoredKg = Math.round(totalBiomassWithRootsKg * 0.47 * 10) / 10;
  // امتصاص CO2 المكافئ التراكمي
  const totalCo2Equivalent = Math.round(carbonStoredKg * 3.667 * 10) / 10;
  // المعدل السنوي التقديري (بافتراض نمو منتظم على مدى 20 عاماً)
  const annualCo2RateKg = Math.round((totalCo2Equivalent / 20) * 10) / 10;

  return {
    aboveGroundBiomassKg: Math.round(agbKg * 10) / 10,
    totalBiomassWithRootsKg,
    carbonStoredKg,
    annualCo2RateKg: Math.max(15, annualCo2RateKg),
  };
}

/**
 * بيانات استشعار عن بعد ونماذج Geo-AI المعتمدة لقطاعات ولاية ميلة
 */
export const MILA_GEO_AI_PLOTS: GeoAiPlotMetrics[] = [
  {
    plotId: 'plot-mla-youth-center',
    plotName: 'الحزام الأخضر لمحيط المركب الشبابي بميلة',
    centerCoords: [36.4503, 6.2649],
    areaHectares: 4.8,
    ndviCurrent: 0.58, // تحسن ملحوظ بعد حملات الغرس
    ndviBaseline: 0.24, // قبل المبادرة (تربة متدهورة)
    saviIndex: 0.46,
    canopyCoveragePercent: 42.5,
    treeDensityPerHectare: 310,
    speciesDistribution: {
      'زيتون جبلي': 60,
      'خروب': 25,
      'سدر بري': 15,
    },
    totalBiomassTons: 68.4,
    annualCo2AbsorptionTons: 18.2,
    historicalYears: [2022, 2023, 2024, 2025, 2026],
    ndviTrend: [0.24, 0.31, 0.40, 0.49, 0.58],
    canopyTrendPercent: [12.0, 18.5, 26.0, 34.0, 42.5],
  },
  {
    plotId: 'plot-senawa-forest',
    plotName: 'المنحدر الشرقي لمحميّة غابة صناوة',
    centerCoords: [36.441, 6.252],
    areaHectares: 12.5,
    ndviCurrent: 0.64,
    ndviBaseline: 0.38,
    saviIndex: 0.52,
    canopyCoveragePercent: 58.0,
    treeDensityPerHectare: 420,
    speciesDistribution: {
      'صنوبر حلبي': 50,
      'خروب': 30,
      'زيتون': 20,
    },
    totalBiomassTons: 245.0,
    annualCo2AbsorptionTons: 64.5,
    historicalYears: [2022, 2023, 2024, 2025, 2026],
    ndviTrend: [0.38, 0.44, 0.51, 0.58, 0.64],
    canopyTrendPercent: [31.0, 38.0, 44.5, 51.0, 58.0],
  },
  {
    plotId: 'plot-beni-haroun-buffer',
    plotName: 'الحزام الواقي لحوض سد بني هارون',
    centerCoords: [36.5562, 6.2731],
    areaHectares: 28.0,
    ndviCurrent: 0.49,
    ndviBaseline: 0.19,
    saviIndex: 0.39,
    canopyCoveragePercent: 36.2,
    treeDensityPerHectare: 260,
    speciesDistribution: {
      'صنوبر حلبي': 45,
      'زيتون': 35,
      'سدر بري': 20,
    },
    totalBiomassTons: 410.0,
    annualCo2AbsorptionTons: 112.0,
    historicalYears: [2022, 2023, 2024, 2025, 2026],
    ndviTrend: [0.19, 0.25, 0.32, 0.41, 0.49],
    canopyTrendPercent: [8.5, 14.0, 21.0, 28.5, 36.2],
  },
];
