import {
  TaskType,
  DynamicMETOptions,
  TerrainSlope,
  AmbientTemp,
  AdvancedRecoveryNutrients,
} from '../types';

export const MET_TABLE: Record<
  TaskType,
  { nameAr: string; met: number; icon: string; description: string }
> = {
  digging: {
    nameAr: 'حفر وتجهيز حُفر الشتلات',
    met: 7.0,
    icon: 'Hammer',
    description: 'تفتيت التربة الصلبة وحفر عمق 40-50 سم للشتلات',
  },
  tree_planting: {
    nameAr: 'غرس وتثبيت الشتلات وتدعيمها',
    met: 5.5,
    icon: 'Sprout',
    description: 'وضع الشتلة وإعادة طمر التربة الغنية وتثبيت الدعامة',
  },
  carrying_water: {
    nameAr: 'نقل أوعية المياه والري الميداني',
    met: 6.5,
    icon: 'Droplets',
    description: 'حمل دلاء أو خراطيم الري وسقاية الأشجار حديثة الغرس',
  },
  site_clearing: {
    nameAr: 'تنظيف المساحة وإزالة الأعشاب الضارة',
    met: 4.8,
    icon: 'Trash2',
    description: 'تهيئة الحزام البيئي وإزالة الحجارة والمخلفات الجافة',
  },
};

export interface DualImpactCalculation {
  taskType: TaskType;
  durationMinutes: number;
  weightKg: number;
  treesPlanted: number;
  metValue: number;
  adjustedMetValue: number;
  caloriesBurned: number;
  proteinGrams: number;
  carbsGrams: number;
  hydrationMl: number;
  lifetimeCo2OffsetKg: number;
  earnedPoints: number;
  environmentalMultiplier: number;
  advancedRecovery: AdvancedRecoveryNutrients;
}

/**
 * حساب الجهد البدني والاحتياج الغذائي والأثر البيئي
 * وفق معادلة الكلية الأمريكية للطب الرياضي (ACSM) مع معاملات الانحدار الجبلي والحرارة
 */
export function calculateImpact(
  taskType: TaskType,
  durationMinutes: number,
  weightKg: number,
  treesPlanted: number,
  options?: DynamicMETOptions
): DualImpactCalculation {
  const metMeta = MET_TABLE[taskType] || { met: 5.0 };
  const baseMet = metMeta.met;

  // 1. معامل الانحدار التضاريسي (Terrain Slope Multiplier)
  // المناطق الجبلية كمرتفعات ميلة تزيد الجهد بنسبة تصل إلى 25%
  let slopeMultiplier = 1.0;
  if (options?.terrainSlope === 'moderate_slope') {
    slopeMultiplier = 1.12; // انحدار 5-15 درجة
  } else if (options?.terrainSlope === 'steep_mountain') {
    slopeMultiplier = 1.25; // انحدار جبلي >15 درجة
  }

  // 2. معامل الإجهاد الحراري والتعرق (Ambient Temp Multiplier)
  let tempMultiplier = 1.0;
  if (options?.ambientTemp === 'hot_summer') {
    tempMultiplier = 1.1; // حرارة >30 درجة مئوية (زيادة النبض والتبريد)
  } else if (options?.ambientTemp === 'cool') {
    tempMultiplier = 0.98;
  }

  // المعامل البيئي الإجمالي
  const environmentalMultiplier = Math.round(slopeMultiplier * tempMultiplier * 100) / 100;
  const adjustedMetValue = Math.round(baseMet * environmentalMultiplier * 10) / 10;

  // معادلة حرق السعرات الحرارية: Calories = (Adjusted MET * 3.5 * weightKg / 200) * durationMinutes
  const rawCalories = (adjustedMetValue * 3.5 * weightKg * durationMinutes) / 200;
  const caloriesBurned = Math.round(rawCalories);

  // 3. حسابات الاستشفاء الغذائي المتقدمة (Advanced Recovery Nutrition Logic)
  // البروتين الموصى به: 0.35 إلى 0.45غ لكل كغ مع حد أدنى 18غ وأقصى 40غ
  const proteinGrams = Math.min(42, Math.max(18, Math.round(caloriesBurned / 22)));
  // حمض الليوسين الأميني المحفز لمسار بناء البروتين العضلي (mTOR Target: 2.5 - 3.2g)
  const leucineGrams = Math.round((proteinGrams * 0.09) * 10) / 10;

  // الكربوهيدرات لتعويض مخازن الجليكوجين العضلي (1.0 إلى 1.2غ/كغ في نافذة الـ 45 دقيقة)
  const carbsGrams = Math.min(95, Math.max(35, Math.round(proteinGrams * 2.2)));

  // تعويض السوائل والأملاح المعدنية (الشوارد: الصوديوم، البوتاسيوم، المغنيسيوم)
  const baseSweatRateMlPerMin = options?.ambientTemp === 'hot_summer' ? 16.5 : 12.5;
  const hydrationMl = Math.max(500, Math.round(durationMinutes * baseSweatRateMlPerMin));

  // فقدان الصوديوم التقديري: 500-900 ملغ/لتر عرق
  const sodiumMg = Math.round((hydrationMl / 1000) * 650);
  // البوتاسيوم لتقليل التشنجات: 200-300 ملغ
  const potassiumMg = Math.round((hydrationMl / 1000) * 220);
  // المغنيسيوم لاسترخاء العضلات
  const magnesiumMg = Math.round(proteinGrams * 2.5);

  // امتصاص الكربون التقديري: 22 كغ سنوياً في المتوسط للشجرة على مدى 25 عاماً
  const lifetimeCo2OffsetKg = treesPlanted * 22 * 25;

  // نقاط الأثر التراكمية: نقطة لكل 10 سعرات محروقة + 50 نقطة لكل شجرة مغروسة
  const earnedPoints = Math.round(caloriesBurned / 10 + treesPlanted * 50);

  // وصفة التعافي الموصى بها من Healthy Brunchy
  let recommendedRecipe = 'صندوق الدجاج المشوي والأرز الأسمر مع تمر دقلة نور وعصير ليمون بالنعناع';
  if (proteinGrams >= 30) {
    recommendedRecipe = 'صندوق القوة البنائية: صدر ديك رومي مشوي متبل بأعشاب ميلة + كينوا غنية + مكسرات اللوز + ماء كهرلي معزز';
  } else if (taskType === 'carrying_water') {
    recommendedRecipe = 'صندوق الترطيب وإعادة التمعدن: أومليت بيض بلدي + بطاطا حلوة مشوية + تمر معجون مع سمسم ومشروب شوارد';
  }

  const advancedRecovery: AdvancedRecoveryNutrients = {
    targetProteinGrams: proteinGrams,
    leucineGrams,
    targetCarbsGrams: carbsGrams,
    glycogenWindowMinutes: 45,
    hydrationMl,
    sodiumMg,
    potassiumMg,
    magnesiumMg,
    recommendedRecipe,
  };

  return {
    taskType,
    durationMinutes,
    weightKg,
    treesPlanted,
    metValue: baseMet,
    adjustedMetValue,
    caloriesBurned,
    proteinGrams,
    carbsGrams,
    hydrationMl,
    lifetimeCo2OffsetKg,
    earnedPoints,
    environmentalMultiplier,
    advancedRecovery,
  };
}
