import { TaskType } from '../types';

export const MET_TABLE: Record<TaskType, { nameAr: string; met: number; icon: string; description: string }> = {
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
  caloriesBurned: number;
  proteinGrams: number;
  carbsGrams: number;
  hydrationMl: number;
  lifetimeCo2OffsetKg: number;
  earnedPoints: number;
}

/**
 * حساب الجهد البدني والاحتياج الغذائي والأثر البيئي
 * وفق معادلة الكلية الأمريكية للطب الرياضي (ACSM)
 */
export function calculateImpact(
  taskType: TaskType,
  durationMinutes: number,
  weightKg: number,
  treesPlanted: number
): DualImpactCalculation {
  const metMeta = MET_TABLE[taskType] || { met: 5.0 };
  const metValue = metMeta.met;

  // معادلة حرق السعرات الحرارية: Calories = (MET * 3.5 * weightKg / 200) * durationMinutes
  const rawCalories = (metValue * 3.5 * weightKg * durationMinutes) / 200;
  const caloriesBurned = Math.round(rawCalories);

  // احتساب متطلبات الاستشفاء العضلي (المغذيات الكبرى)
  // البروتين الموصى به لإعادة بناء الألياف بعد الجهد الشاق (15 إلى 38 غرام)
  const proteinGrams = Math.min(38, Math.max(16, Math.round(caloriesBurned / 22)));
  // الكربوهيدرات لإعادة ملء مخازن الجليكوجين العضلي
  const carbsGrams = Math.min(85, Math.max(30, Math.round(proteinGrams * 2.2)));
  // معدل السوائل المطلوبة لتعويض التعرق (تقريباً 12.5 مل لكل دقيقة جهد في الطقس المعتدل)
  const hydrationMl = Math.max(500, Math.round(durationMinutes * 12.5));

  // امتصاص الكربون التقديري: 22 كغ سنوياً في المتوسط للشجرة على مدى 25 عاماً
  const lifetimeCo2OffsetKg = treesPlanted * 22 * 25;

  // نقاط الأثر التراكمية: نقطة لكل 10 سعرات محروقة + 50 نقطة لكل شجرة مغروسة
  const earnedPoints = Math.round(caloriesBurned / 10 + treesPlanted * 50);

  return {
    taskType,
    durationMinutes,
    weightKg,
    treesPlanted,
    metValue,
    caloriesBurned,
    proteinGrams,
    carbsGrams,
    hydrationMl,
    lifetimeCo2OffsetKg,
    earnedPoints,
  };
}
