"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Clock,
  DollarSign,
  Edit2,
  Trash2,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Tag,
  X,
  Sparkles,
  Scissors,
  Dumbbell,
  Heart,
  Palette,
  Eye,
  EyeOff,
  Copy,
  Users,
  Timer,
} from "lucide-react";

// Service type definitions
interface Service {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  duration: number; // in minutes
  price: number;
  bufferBefore: number; // minutes before
  bufferAfter: number; // minutes after
  color: string;
  isActive: boolean;
  staffIds: string[];
  bookingsCount: number;
}

interface Category {
  id: string;
  name: string;
  icon: keyof typeof categoryIcons;
  color: string;
  order: number;
}

// Category icons mapping
const categoryIcons = {
  sparkles: Sparkles,
  scissors: Scissors,
  dumbbell: Dumbbell,
  heart: Heart,
  palette: Palette,
};

// Demo categories
const demoCategories: Category[] = [
  { id: "1", name: "ציפורניים", icon: "sparkles", color: "violet", order: 1 },
  { id: "2", name: "שיער", icon: "scissors", color: "rose", order: 2 },
  { id: "3", name: "טיפוח פנים", icon: "heart", color: "amber", order: 3 },
  { id: "4", name: "איפור", icon: "palette", color: "blue", order: 4 },
];

// Demo services
const demoServices: Service[] = [
  {
    id: "1",
    name: "מניקור ג'ל",
    description: "מניקור מקצועי עם לק ג'ל איכותי",
    categoryId: "1",
    duration: 60,
    price: 120,
    bufferBefore: 0,
    bufferAfter: 5,
    color: "#8B5CF6",
    isActive: true,
    staffIds: ["1", "2"],
    bookingsCount: 156,
  },
  {
    id: "2",
    name: "מניקור קלאסי",
    description: "מניקור עם לק רגיל",
    categoryId: "1",
    duration: 45,
    price: 80,
    bufferBefore: 0,
    bufferAfter: 5,
    color: "#8B5CF6",
    isActive: true,
    staffIds: ["1", "2"],
    bookingsCount: 89,
  },
  {
    id: "3",
    name: "פדיקור ספא",
    description: "פדיקור מפנק כולל עיסוי רגליים",
    categoryId: "1",
    duration: 75,
    price: 150,
    bufferBefore: 0,
    bufferAfter: 10,
    color: "#8B5CF6",
    isActive: true,
    staffIds: ["1"],
    bookingsCount: 72,
  },
  {
    id: "4",
    name: "מניקור + פדיקור",
    description: "חבילה משתלמת לטיפול מלא",
    categoryId: "1",
    duration: 120,
    price: 200,
    bufferBefore: 0,
    bufferAfter: 10,
    color: "#8B5CF6",
    isActive: true,
    staffIds: ["1", "2"],
    bookingsCount: 45,
  },
  {
    id: "5",
    name: "תספורת נשים",
    description: "תספורת מקצועית + סירוק",
    categoryId: "2",
    duration: 45,
    price: 150,
    bufferBefore: 0,
    bufferAfter: 5,
    color: "#F43F5E",
    isActive: true,
    staffIds: ["3"],
    bookingsCount: 234,
  },
  {
    id: "6",
    name: "צבע שיער",
    description: "צביעת שיער מקצועית",
    categoryId: "2",
    duration: 120,
    price: 350,
    bufferBefore: 0,
    bufferAfter: 15,
    color: "#F43F5E",
    isActive: true,
    staffIds: ["3"],
    bookingsCount: 98,
  },
  {
    id: "7",
    name: "טיפול פנים בסיסי",
    description: "ניקוי עמוק והזנה לעור",
    categoryId: "3",
    duration: 60,
    price: 200,
    bufferBefore: 5,
    bufferAfter: 5,
    color: "#F59E0B",
    isActive: true,
    staffIds: ["1"],
    bookingsCount: 67,
  },
  {
    id: "8",
    name: "טיפול פנים מלא",
    description: "טיפול פנים מקיף כולל מסכה ועיסוי",
    categoryId: "3",
    duration: 90,
    price: 350,
    bufferBefore: 5,
    bufferAfter: 10,
    color: "#F59E0B",
    isActive: true,
    staffIds: ["1"],
    bookingsCount: 43,
  },
  {
    id: "9",
    name: "איפור יום",
    description: "איפור טבעי ליום יום",
    categoryId: "4",
    duration: 45,
    price: 180,
    bufferBefore: 0,
    bufferAfter: 5,
    color: "#3B82F6",
    isActive: true,
    staffIds: ["2"],
    bookingsCount: 54,
  },
  {
    id: "10",
    name: "איפור ערב",
    description: "איפור מרהיב לאירועים",
    categoryId: "4",
    duration: 60,
    price: 250,
    bufferBefore: 0,
    bufferAfter: 5,
    color: "#3B82F6",
    isActive: true,
    staffIds: ["2"],
    bookingsCount: 78,
  },
  {
    id: "11",
    name: "עיצוב גבות",
    description: "עיצוב גבות מקצועי",
    categoryId: "3",
    duration: 30,
    price: 80,
    bufferBefore: 0,
    bufferAfter: 5,
    color: "#F59E0B",
    isActive: false,
    staffIds: ["1", "2"],
    bookingsCount: 112,
  },
];

// Demo staff
const demoStaff = [
  { id: "1", name: "רונית" },
  { id: "2", name: "דנה" },
  { id: "3", name: "שירה" },
];

// Color options for services
const colorOptions = [
  { value: "#8B5CF6", name: "סגול" },
  { value: "#F43F5E", name: "ורוד" },
  { value: "#F59E0B", name: "כתום" },
  { value: "#3B82F6", name: "כחול" },
  { value: "#10B981", name: "ירוק" },
  { value: "#6366F1", name: "אינדיגו" },
  { value: "#EC4899", name: "פוקסיה" },
  { value: "#14B8A6", name: "טורקיז" },
];

// Format duration helper
function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} דק׳`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} שעה ${mins} דק׳` : `${hours} שעה`;
}

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(demoCategories.map((c) => c.id))
  );
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInactive, setShowInactive] = useState(false);

  // Filter services
  const filteredServices = useMemo(() => {
    return demoServices.filter((service) => {
      const matchesSearch =
        service.name.includes(searchQuery) ||
        service.description.includes(searchQuery);

      const matchesActive = showInactive || service.isActive;

      return matchesSearch && matchesActive;
    });
  }, [searchQuery, showInactive]);

  // Group services by category
  const servicesByCategory = useMemo(() => {
    const grouped = new Map<string, Service[]>();
    demoCategories.forEach((cat) => {
      grouped.set(
        cat.id,
        filteredServices.filter((s) => s.categoryId === cat.id)
      );
    });
    return grouped;
  }, [filteredServices]);

  // Stats
  const stats = useMemo(() => {
    const active = demoServices.filter((s) => s.isActive);
    const totalBookings = demoServices.reduce((sum, s) => sum + s.bookingsCount, 0);
    const avgPrice = active.length > 0
      ? Math.round(active.reduce((sum, s) => sum + s.price, 0) / active.length)
      : 0;
    return {
      total: demoServices.length,
      active: active.length,
      totalBookings,
      avgPrice,
    };
  }, []);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="px-4 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">שירותים</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {stats.active} שירותים פעילים
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <Plus className="h-5 w-5" />
              <span className="hidden sm:inline">שירות חדש</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="חיפוש שירות..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <button
              onClick={() => setShowInactive(!showInactive)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                showInactive
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              {showInactive ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
              <span className="hidden sm:inline">{showInactive ? "הצג הכל" : "מוסתרים"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 py-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <Tag className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">סה״כ שירותים</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Eye className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">שירותים פעילים</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₪{stats.avgPrice}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">מחיר ממוצע</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">הזמנות סה״כ</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services by Category */}
        <div className="space-y-4">
          {demoCategories.map((category) => {
            const services = servicesByCategory.get(category.id) ?? [];
            const isExpanded = expandedCategories.has(category.id);
            const IconComponent = categoryIcons[category.icon];

            if (services.length === 0 && !showInactive) return null;

            return (
              <div
                key={category.id}
                className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden"
              >
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${category.color}-100 dark:bg-${category.color}-900/30`}
                      style={{
                        backgroundColor: `color-mix(in srgb, ${
                          colorOptions.find((c) => c.name === category.color)?.value ?? "#8B5CF6"
                        } 20%, transparent)`,
                      }}
                    >
                      <IconComponent
                        className="h-5 w-5"
                        style={{
                          color: colorOptions.find((c) => c.name === category.color)?.value ?? "#8B5CF6",
                        }}
                      />
                    </div>
                    <div className="text-right">
                      <h3 className="font-bold text-gray-900 dark:text-white">{category.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {services.length} שירותים
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>

                {/* Services List */}
                {isExpanded && services.length > 0 && (
                  <div className="border-t border-gray-100 dark:border-slate-800">
                    {services.map((service, index) => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className={`px-4 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${
                          index !== services.length - 1 ? "border-b border-gray-100 dark:border-slate-800" : ""
                        } ${!service.isActive ? "opacity-50" : ""}`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Color Indicator */}
                          <div
                            className="w-1 h-12 rounded-full flex-shrink-0"
                            style={{ backgroundColor: service.color }}
                          />

                          {/* Service Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                {service.name}
                              </h4>
                              {!service.isActive && (
                                <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded text-xs">
                                  מוסתר
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-2">
                              {service.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <Clock className="h-4 w-4" />
                                {formatDuration(service.duration)}
                              </span>
                              <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                <Users className="h-4 w-4" />
                                {service.staffIds.length} עובדים
                              </span>
                            </div>
                          </div>

                          {/* Price & Actions */}
                          <div className="text-left flex-shrink-0">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              ₪{service.price}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {service.bookingsCount} הזמנות
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State for Category */}
                {isExpanded && services.length === 0 && (
                  <div className="p-8 text-center border-t border-gray-100 dark:border-slate-800">
                    <p className="text-gray-500 dark:text-gray-400 mb-2">אין שירותים בקטגוריה זו</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="text-violet-600 hover:text-violet-700 font-medium"
                    >
                      הוסף שירות חדש
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Category Button */}
        <button className="w-full mt-4 py-4 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl text-gray-500 dark:text-gray-400 hover:border-violet-300 hover:text-violet-600 dark:hover:border-violet-700 dark:hover:text-violet-400 transition-colors font-medium">
          + הוסף קטגוריה חדשה
        </button>
      </div>

      {/* Service Detail Slide-over */}
      {selectedService && (
        <ServiceDetailPanel
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}

      {/* Add Service Modal */}
      {showAddModal && (
        <AddServiceModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

// Service Detail Panel Component
function ServiceDetailPanel({
  service,
  onClose,
}: {
  service: Service;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 lg:flex lg:justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute bottom-0 left-0 right-0 lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:w-[480px] max-h-[90vh] lg:max-h-full lg:h-full bg-white dark:bg-slate-900 rounded-t-3xl lg:rounded-none overflow-y-auto">
        {/* Handle for mobile */}
        <div className="lg:hidden flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">פרטי שירות</h2>
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Service Header */}
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold"
              style={{ backgroundColor: service.color }}
            >
              {service.name[0]}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{service.name}</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">{service.description}</p>
              {!service.isActive && (
                <span className="inline-block mt-2 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded text-xs">
                  שירות מוסתר
                </span>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-5 w-5 text-violet-600" />
                <span className="text-sm text-violet-600 dark:text-violet-400">מחיר</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">₪{service.price}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-600 dark:text-blue-400">משך</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatDuration(service.duration)}
              </p>
            </div>
          </div>

          {/* Buffer Times */}
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">זמני הפסקה</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Timer className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">לפני</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {service.bufferBefore} דקות
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Timer className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">אחרי</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {service.bufferAfter} דקות
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Staff */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">אנשי צוות</h4>
            <div className="flex flex-wrap gap-2">
              {service.staffIds.map((staffId) => {
                const staff = demoStaff.find((s) => s.id === staffId);
                return staff ? (
                  <span
                    key={staffId}
                    className="px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                  >
                    {staff.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">הזמנות</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {service.bookingsCount}
                </p>
              </div>
              <div className="text-left">
                <p className="text-sm text-emerald-600 dark:text-emerald-400">הכנסות משוערות</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ₪{(service.bookingsCount * service.price).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
              <Copy className="h-5 w-5" />
              שכפל שירות
            </button>
            {service.isActive ? (
              <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl font-medium hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
                <EyeOff className="h-5 w-5" />
                הסתר שירות
              </button>
            ) : (
              <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                <Eye className="h-5 w-5" />
                הפעל שירות
              </button>
            )}
          </div>

          {/* Danger Zone */}
          <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
            <button className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium">
              <Trash2 className="h-4 w-4" />
              מחק שירות
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add Service Modal Component
function AddServiceModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "1",
    duration: 60,
    price: 0,
    bufferBefore: 0,
    bufferAfter: 5,
    color: "#8B5CF6",
    staffIds: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would save to Supabase
    console.log("Adding service:", formData);
    onClose();
  };

  const toggleStaff = (staffId: string) => {
    setFormData((prev) => ({
      ...prev,
      staffIds: prev.staffIds.includes(staffId)
        ? prev.staffIds.filter((id) => id !== staffId)
        : [...prev.staffIds, staffId],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">שירות חדש</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              שם השירות *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="למשל: מניקור ג'ל"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              תיאור
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="תיאור קצר של השירות..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              קטגוריה *
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {demoCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Duration & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                משך (דקות) *
              </label>
              <input
                type="number"
                required
                min={15}
                step={5}
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                מחיר (₪) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Buffer Times */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                הפסקה לפני (דקות)
              </label>
              <input
                type="number"
                min={0}
                step={5}
                value={formData.bufferBefore}
                onChange={(e) => setFormData({ ...formData, bufferBefore: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                הפסקה אחרי (דקות)
              </label>
              <input
                type="number"
                min={0}
                step={5}
                value={formData.bufferAfter}
                onChange={(e) => setFormData({ ...formData, bufferAfter: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              צבע
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: color.value })}
                  className={`w-8 h-8 rounded-lg transition-transform ${
                    formData.color === color.value ? "ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-110" : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Staff */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              אנשי צוות
            </label>
            <div className="flex flex-wrap gap-2">
              {demoStaff.map((staff) => (
                <button
                  key={staff.id}
                  type="button"
                  onClick={() => toggleStaff(staff.id)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    formData.staffIds.includes(staff.id)
                      ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {staff.name}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              הוסף שירות
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
