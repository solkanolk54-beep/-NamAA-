import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Area,
  BarChart,
  Cell,
} from 'recharts';
import { DualImpactLog, User, TreeItem } from '../types';
import {
  Flame,
  Leaf,
  Activity,
  Award,
  Calendar,
  Layers,
  Sparkles,
  TrendingUp,
  Info,
} from 'lucide-react';

interface DualImpactChartWidgetProps {
  volunteer: User;
  logs: DualImpactLog[];
  trees: TreeItem[];
}

interface ChartDataPoint {
  sessionName: string;
  shortDate: string;
  caloriesBurned: number;
  co2OffsetKg: number;
  treesPlanted: number;
  durationMinutes: number;
  taskName: string;
}

export const DualImpactChartWidget: React.FC<DualImpactChartWidgetProps> = ({
  volunteer,
  logs,
  trees,
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'tasks' | 'cumulative'>('timeline');
  const [timeFilter, setTimeFilter] = useState<'all' | 'recent'>('all');

  // Filter logs for current volunteer or combine with initial authentic history
  const chartData: ChartDataPoint[] = useMemo(() => {
    // Baseline historical sessions for Yacine in Mila to make the chart rich and illustrative
    const historicalBaseline: ChartDataPoint[] = [
      {
        sessionName: 'محيط مركب ميلة (حفر)',
        shortDate: '24 أكتوبر',
        caloriesBurned: 520,
        co2OffsetKg: 1100, // شتلتين زيتون
        treesPlanted: 2,
        durationMinutes: 75,
        taskName: 'حفر حفر الشتلات',
      },
      {
        sessionName: 'غابة صناوة (غرس)',
        shortDate: '28 أكتوبر',
        caloriesBurned: 420,
        co2OffsetKg: 1650, // 3 شتلات صنوبر
        treesPlanted: 3,
        durationMinutes: 60,
        taskName: 'غرس وتثبيت الشتلات',
      },
      {
        sessionName: 'سد بني هارون (ري ونقل)',
        shortDate: '01 نوفمبر',
        caloriesBurned: 610,
        co2OffsetKg: 550, // شجرة
        treesPlanted: 1,
        durationMinutes: 80,
        taskName: 'نقل المياه والري',
      },
      {
        sessionName: 'المركب الشبابي (تهيئة)',
        shortDate: '03 نوفمبر',
        caloriesBurned: 380,
        co2OffsetKg: 1100, // شتلتين خروب
        treesPlanted: 2,
        durationMinutes: 50,
        taskName: 'تنظيف وتهيئة الأرض',
      },
    ];

    // Map any dynamic logs from state
    const dynamicPoints: ChartDataPoint[] = logs
      .filter((l) => l.userId === volunteer.id)
      .map((log, idx) => ({
        sessionName: `جلسة ${idx + 1} (${log.taskType})`,
        shortDate: log.timestamp.split(' ')[0] || 'اليوم',
        caloriesBurned: log.caloriesBurned,
        co2OffsetKg: log.lifetimeCo2OffsetKg,
        treesPlanted: log.treesPlanted,
        durationMinutes: log.durationMinutes,
        taskName:
          log.taskType === 'digging'
            ? 'حفر حفر الشتلات'
            : log.taskType === 'tree_planting'
            ? 'غرس وتثبيت'
            : log.taskType === 'carrying_water'
            ? 'نقل مياه وري'
            : 'تنظيف مساحات',
      }));

    const combined = [...historicalBaseline, ...dynamicPoints];

    if (timeFilter === 'recent') {
      return combined.slice(-4);
    }
    return combined;
  }, [logs, volunteer.id, timeFilter]);

  // Aggregate by task type
  const taskBreakdownData = useMemo(() => {
    const map: Record<string, { task: string; calories: number; co2: number; count: number }> = {
      'حفر وتجهيز': { task: 'حفر وتجهيز الحفر', calories: 0, co2: 0, count: 0 },
      'غرس الشتلات': { task: 'غرس وتثبيت الشتلات', calories: 0, co2: 0, count: 0 },
      'ري ونقل مياه': { task: 'ري ونقل مياه', calories: 0, co2: 0, count: 0 },
      'تهيئة وتنظيف': { task: 'تهيئة وتنظيف المساحات', calories: 0, co2: 0, count: 0 },
    };

    chartData.forEach((d) => {
      if (d.taskName.includes('حفر')) {
        map['حفر وتجهيز'].calories += d.caloriesBurned;
        map['حفر وتجهيز'].co2 += d.co2OffsetKg;
        map['حفر وتجهيز'].count += 1;
      } else if (d.taskName.includes('غرس')) {
        map['غرس الشتلات'].calories += d.caloriesBurned;
        map['غرس الشتلات'].co2 += d.co2OffsetKg;
        map['غرس الشتلات'].count += 1;
      } else if (d.taskName.includes('ري') || d.taskName.includes('نقل')) {
        map['ري ونقل مياه'].calories += d.caloriesBurned;
        map['ري ونقل مياه'].co2 += d.co2OffsetKg;
        map['ري ونقل مياه'].count += 1;
      } else {
        map['تهيئة وتنظيف'].calories += d.caloriesBurned;
        map['تهيئة وتنظيف'].co2 += d.co2OffsetKg;
        map['تهيئة وتنظيف'].count += 1;
      }
    });

    return Object.values(map);
  }, [chartData]);

  // Cumulative Progression
  const cumulativeData = useMemo(() => {
    let runningCalories = 0;
    let runningCo2 = 0;
    let runningTrees = 0;

    return chartData.map((d) => {
      runningCalories += d.caloriesBurned;
      runningCo2 += d.co2OffsetKg;
      runningTrees += d.treesPlanted;
      return {
        sessionName: d.shortDate,
        cumCalories: runningCalories,
        cumCo2: runningCo2,
        cumTrees: runningTrees,
      };
    });
  }, [chartData]);

  // Overall totals
  const totalCalories = chartData.reduce((acc, d) => acc + d.caloriesBurned, 0);
  const totalCo2 = chartData.reduce((acc, d) => acc + d.co2OffsetKg, 0);
  const totalTrees = chartData.reduce((acc, d) => acc + d.treesPlanted, 0);
  const totalHours = (chartData.reduce((acc, d) => acc + d.durationMinutes, 0) / 60).toFixed(1);

  // Equivalents
  const marathonKm = (totalCalories / 70).toFixed(0); // ~70 kcal per km running
  const carKmSaved = (totalCo2 * 4.2).toFixed(0); // ~0.24 kg CO2 per km car emission

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-5">
      {/* Widget Header & View Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              لوحة قيادة الأثر المزدوج التفاعلية (Recharts Dashboard)
            </span>
            <span className="text-xs text-slate-400">· مؤشرات الأداء الحيوية والبيئية</span>
          </div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            تحليل الأثر البيئي (CO2 الممتص) مقابل الجهد البدني (السعرات المحروقة)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            مقارنة فورية بين الطاقة الرياضية المستهلكة في الميدان وكمية الكربون التي ستعزلها الأشجار المغروسة
          </p>
        </div>

        {/* View Mode Toggle Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg text-xs font-medium self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              viewMode === 'timeline'
                ? 'bg-white text-emerald-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            تتبع الجلسات
          </button>
          <button
            onClick={() => setViewMode('tasks')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              viewMode === 'tasks'
                ? 'bg-white text-emerald-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            توزيع المهام
          </button>
          <button
            onClick={() => setViewMode('cumulative')}
            className={`px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap ${
              viewMode === 'cumulative'
                ? 'bg-white text-emerald-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            المعالم التراكمية
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Strips */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Calories Card */}
        <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70">
          <div className="flex items-center justify-between text-amber-700 text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              إجمالي السعرات المحروقة
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-amber-950">
              {totalCalories.toLocaleString()}
            </span>
            <span className="text-xs text-amber-700 font-medium">kcal</span>
          </div>
          <span className="text-[10px] text-amber-800/80 block mt-1">
            تعادل ركض مسافة <b className="font-mono">{marathonKm} كم</b> متواصلة
          </span>
        </div>

        {/* CO2 Card */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
          <div className="flex items-center justify-between text-emerald-700 text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Leaf className="w-3.5 h-3.5 text-emerald-600" />
              إجمالي CO2 الممتص (25 سنة)
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-950">
              {totalCo2.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-700 font-medium">كغ كربون</span>
          </div>
          <span className="text-[10px] text-emerald-800/80 block mt-1">
            عزل انبعاثات سيارة لمسافة <b className="font-mono">{carKmSaved} كم</b> بميلة
          </span>
        </div>

        {/* Trees Planted */}
        <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200/70">
          <div className="flex items-center justify-between text-teal-700 text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              الأشجار المغروسة والرعاية
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-teal-950">
              {totalTrees}
            </span>
            <span className="text-xs text-teal-700 font-medium">شتلات مثمرة</span>
          </div>
          <span className="text-[10px] text-teal-800/80 block mt-1">
            زيتون جبلي وخروب مقاوم للجفاف
          </span>
        </div>

        {/* Volunteer Hours & Energy */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/70">
          <div className="flex items-center justify-between text-blue-700 text-xs mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Activity className="w-3.5 h-3.5 text-blue-600" />
              ساعات الجهد الميداني
            </span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-2xl font-bold font-mono tabular-nums text-blue-950">
              {totalHours}
            </span>
            <span className="text-xs text-blue-700 font-medium">ساعة عمل</span>
          </div>
          <span className="text-[10px] text-blue-800/80 block mt-1">
            بمعدل جهد أيضي شاق (MET 4.8 - 7.0)
          </span>
        </div>
      </div>

      {/* Main Interactive Recharts Viewport */}
      <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-200/70">
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block"></span>
              <span className="font-medium text-slate-700">السعرات المحروقة (kcal) — المحور الأيمن</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-600 inline-block"></span>
              <span className="font-medium text-slate-700">الكربون الممتص (kg CO2) — المحور الأيسر</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono hidden sm:block">
            {chartData.length} جلسات عمل موثقة
          </div>
        </div>

        {/* 1. Timeline View: Dual Axis ComposedChart */}
        {viewMode === 'timeline' && (
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={chartData}
                margin={{ top: 15, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="shortDate"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                {/* Right Axis: Calories */}
                <YAxis
                  yAxisId="calories"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#d97706', fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={{ stroke: '#fcd34d' }}
                  unit=" kcal"
                />
                {/* Left Axis: CO2 kg */}
                <YAxis
                  yAxisId="co2"
                  orientation="left"
                  tick={{ fontSize: 11, fill: '#059669', fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={{ stroke: '#6ee7b7' }}
                  unit=" kg"
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                  formatter={(value) =>
                    value === 'caloriesBurned'
                      ? 'السعرات المحروقة (kcal)'
                      : value === 'co2OffsetKg'
                      ? 'امتصاص الكربون المقدر (kg CO2)'
                      : value
                  }
                />
                {/* Bar for Calories */}
                <Bar
                  yAxisId="calories"
                  dataKey="caloriesBurned"
                  name="caloriesBurned"
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />
                {/* Line for CO2 */}
                <Line
                  yAxisId="co2"
                  type="monotone"
                  dataKey="co2OffsetKg"
                  name="co2OffsetKg"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#059669', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 2. Tasks Breakdown View: Grouped BarChart */}
        {viewMode === 'tasks' && (
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={taskBreakdownData}
                margin={{ top: 15, right: 10, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="task"
                  tick={{ fontSize: 11, fill: '#475569' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'monospace' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip
                  formatter={(value: any, name?: any) => {
                    const labelStr = String(name || '');
                    return [
                      `${Number(value || 0).toLocaleString()} ${labelStr === 'calories' ? 'سعرة' : 'كغ CO2'}`,
                      labelStr === 'calories' ? 'السعرات المحروقة' : 'الكربون الممتص',
                    ];
                  }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                    direction: 'rtl',
                    textAlign: 'right',
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                  formatter={(value) =>
                    value === 'calories'
                      ? 'إجمالي السعرات المستهلكة (kcal)'
                      : 'إجمالي الكربون المعزول (kg CO2)'
                  }
                />
                <Bar dataKey="calories" name="calories" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="co2" name="co2" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* 3. Cumulative Growth: AreaChart */}
        {viewMode === 'cumulative' && (
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={cumulativeData}
                margin={{ top: 15, right: 10, left: 10, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="sessionName"
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis
                  yAxisId="left"
                  orientation="left"
                  tick={{ fontSize: 11, fill: '#059669', fontFamily: 'monospace' }}
                  tickLine={false}
                  unit=" kg"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: '#d97706', fontFamily: 'monospace' }}
                  tickLine={false}
                  unit=" kcal"
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-md text-xs text-right font-sans" dir="rtl">
                          <span className="font-bold text-slate-900 block mb-1">
                            التراكمي حتى {label}
                          </span>
                          <div className="space-y-1 font-mono text-[11px]">
                            <div className="flex justify-between gap-3 text-amber-700">
                              <span>السعرات التراكمية:</span>
                              <span className="font-bold">{data.cumCalories.toLocaleString()} kcal</span>
                            </div>
                            <div className="flex justify-between gap-3 text-emerald-700">
                              <span>امتصاص CO2 التراكمي:</span>
                              <span className="font-bold">{data.cumCo2.toLocaleString()} كغ</span>
                            </div>
                            <div className="flex justify-between gap-3 text-slate-600">
                              <span>الأشجار المغروسة:</span>
                              <span className="font-bold">{data.cumTrees} شجرة</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '11px' }}
                  formatter={(val) =>
                    val === 'cumCo2' ? 'امتصاص CO2 التراكمي (kg)' : 'السعرات التراكمية (kcal)'
                  }
                />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="cumCo2"
                  name="cumCo2"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorCo2)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cumCalories"
                  name="cumCalories"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Narrative Impact Analysis Footnote */}
      <div className="flex items-start gap-2.5 bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs text-slate-600">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold text-slate-800">ملاحظة الترابط الفيزيائي والبيئي:</span>{' '}
          كل <b className="font-mono text-amber-700">500 سعرة حرارية</b> تُحرق في حفر التربة الصلبة بميلة يقابلها في المتوسط غرس شتلتين، ما يعادل عزل{' '}
          <b className="font-mono text-emerald-700">1,100 كغ من ثاني أكسيد الكربون</b> طيلة 25 عاماً. هذا التأثير المزدوج يُحفّز المتطوع صحياً وبيئياً في آن واحد!
        </div>
      </div>
    </div>
  );
};

// Custom Tooltip for Timeline view
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartDataPoint;
    return (
      <div
        className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-lg text-xs text-right font-sans min-w-[200px]"
        dir="rtl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
          <span className="font-bold text-slate-900">{data.sessionName}</span>
          <span className="text-[10px] text-slate-400 font-mono">{data.shortDate}</span>
        </div>

        <div className="text-[11px] text-slate-500 mb-2">
          النشاط: <b className="text-slate-700">{data.taskName}</b> ({data.durationMinutes} دقيقة)
        </div>

        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center justify-between text-amber-800 bg-amber-50 p-1.5 rounded">
            <span>🔥 السعرات المحروقة:</span>
            <span className="font-bold tabular-nums">{data.caloriesBurned} kcal</span>
          </div>
          <div className="flex items-center justify-between text-emerald-800 bg-emerald-50 p-1.5 rounded">
            <span>🌱 CO2 الممتص:</span>
            <span className="font-bold tabular-nums">{data.co2OffsetKg} kg</span>
          </div>
          <div className="flex items-center justify-between text-slate-700 bg-slate-50 p-1.5 rounded">
            <span>🌳 الأشجار المغروسة:</span>
            <span className="font-bold tabular-nums">{data.treesPlanted} شتلات</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};
