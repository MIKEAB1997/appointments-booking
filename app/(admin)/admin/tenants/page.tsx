"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Building2,
  DollarSign,
  Calendar,
  MoreVertical,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  Clock,
  Download,
  Plus,
  ExternalLink,
} from "lucide-react";

// Tenant type definitions
interface Tenant {
  id: string;
  name: string;
  slug: string;
  email: string;
  phone: string;
  city: string;
  vertical: "beauty" | "fitness" | "health" | "other";
  plan: "free" | "starter" | "professional" | "enterprise";
  status: "active" | "trial" | "suspended" | "churned";
  createdAt: string;
  trialEndsAt?: string;
  mrr: number;
  totalBookings: number;
  activeClients: number;
  lastActivity: string;
}

// Demo tenants data
const demoTenants: Tenant[] = [
  {
    id: "1",
    name: "Bella Beauty",
    slug: "bella-beauty",
    email: "bella@beauty.co.il",
    phone: "03-1234567",
    city: "תל אביב",
    vertical: "beauty",
    plan: "professional",
    status: "active",
    createdAt: "2024-01-15",
    mrr: 299,
    totalBookings: 1250,
    activeClients: 342,
    lastActivity: "2025-02-06",
  },
  {
    id: "2",
    name: "Studio Fit",
    slug: "studio-fit",
    email: "info@studiofit.co.il",
    phone: "09-8765432",
    city: "הרצליה",
    vertical: "fitness",
    plan: "starter",
    status: "active",
    createdAt: "2024-03-22",
    mrr: 99,
    totalBookings: 567,
    activeClients: 128,
    lastActivity: "2025-02-05",
  },
  {
    id: "3",
    name: "נועה קוסמטיקה",
    slug: "noa-cosmetics",
    email: "noa@cosmetics.co.il",
    phone: "04-5551234",
    city: "חיפה",
    vertical: "beauty",
    plan: "free",
    status: "trial",
    createdAt: "2025-01-28",
    trialEndsAt: "2025-02-28",
    mrr: 0,
    totalBookings: 23,
    activeClients: 15,
    lastActivity: "2025-02-04",
  },
  {
    id: "4",
    name: "FitLife Gym",
    slug: "fitlife-gym",
    email: "contact@fitlife.co.il",
    phone: "08-9998877",
    city: "באר שבע",
    vertical: "fitness",
    plan: "enterprise",
    status: "active",
    createdAt: "2023-11-05",
    mrr: 599,
    totalBookings: 3450,
    activeClients: 856,
    lastActivity: "2025-02-06",
  },
  {
    id: "5",
    name: "ספא השלווה",
    slug: "hashlavah-spa",
    email: "info@hashlavah.co.il",
    phone: "03-7776655",
    city: "רמת גן",
    vertical: "health",
    plan: "professional",
    status: "suspended",
    createdAt: "2024-06-18",
    mrr: 0,
    totalBookings: 890,
    activeClients: 234,
    lastActivity: "2025-01-15",
  },
  {
    id: "6",
    name: "מעצבת הציפורניים",
    slug: "nail-designer",
    email: "nail@designer.co.il",
    phone: "052-1112233",
    city: "פתח תקווה",
    vertical: "beauty",
    plan: "starter",
    status: "churned",
    createdAt: "2024-02-10",
    mrr: 0,
    totalBookings: 456,
    activeClients: 0,
    lastActivity: "2024-12-20",
  },
  {
    id: "7",
    name: "יוגה בכיכר",
    slug: "yoga-square",
    email: "yoga@square.co.il",
    phone: "03-4443322",
    city: "תל אביב",
    vertical: "fitness",
    plan: "professional",
    status: "active",
    createdAt: "2024-04-01",
    mrr: 299,
    totalBookings: 789,
    activeClients: 156,
    lastActivity: "2025-02-06",
  },
  {
    id: "8",
    name: "Hair Masters",
    slug: "hair-masters",
    email: "masters@hair.co.il",
    phone: "09-2223344",
    city: "נתניה",
    vertical: "beauty",
    plan: "starter",
    status: "trial",
    createdAt: "2025-02-01",
    trialEndsAt: "2025-03-01",
    mrr: 0,
    totalBookings: 8,
    activeClients: 6,
    lastActivity: "2025-02-05",
  },
];

// Config
const statusConfig = {
  active: {
    label: "פעיל",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
    icon: CheckCircle,
  },
  trial: {
    label: "ניסיון",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
    icon: Clock,
  },
  suspended: {
    label: "מושהה",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
    icon: AlertTriangle,
  },
  churned: {
    label: "עזב",
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    icon: Ban,
  },
};

const planConfig = {
  free: { label: "חינם", color: "text-gray-600 dark:text-gray-400" },
  starter: { label: "סטרטר", color: "text-blue-600 dark:text-blue-400" },
  professional: { label: "מקצועי", color: "text-violet-600 dark:text-violet-400" },
  enterprise: { label: "ארגוני", color: "text-amber-600 dark:text-amber-400" },
};

const verticalConfig = {
  beauty: { label: "יופי", icon: "💄" },
  fitness: { label: "כושר", icon: "💪" },
  health: { label: "בריאות", icon: "🏥" },
  other: { label: "אחר", icon: "📋" },
};

// Format date helper
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("he-IL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Days until helper
function daysUntil(dateStr: string): number {
  const date = new Date(dateStr);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function TenantsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [verticalFilter, setVerticalFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter tenants
  const filteredTenants = useMemo(() => {
    return demoTenants.filter((tenant) => {
      const matchesSearch =
        tenant.name.includes(searchQuery) ||
        tenant.slug.includes(searchQuery) ||
        tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.city.includes(searchQuery);

      const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
      const matchesPlan = planFilter === "all" || tenant.plan === planFilter;
      const matchesVertical = verticalFilter === "all" || tenant.vertical === verticalFilter;

      return matchesSearch && matchesStatus && matchesPlan && matchesVertical;
    });
  }, [searchQuery, statusFilter, planFilter, verticalFilter]);

  // Stats
  const stats = useMemo(() => {
    const active = demoTenants.filter((t) => t.status === "active");
    const trial = demoTenants.filter((t) => t.status === "trial");
    const mrr = active.reduce((sum, t) => sum + t.mrr, 0);
    const totalBookings = demoTenants.reduce((sum, t) => sum + t.totalBookings, 0);

    return {
      totalTenants: demoTenants.length,
      activeTenants: active.length,
      trialTenants: trial.length,
      mrr,
      totalBookings,
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="px-4 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">ניהול עסקים</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredTenants.length} מתוך {demoTenants.length} עסקים
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <Download className="h-5 w-5" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all">
                <Plus className="h-5 w-5" />
                <span className="hidden sm:inline">עסק חדש</span>
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="חיפוש לפי שם, slug, אימייל או עיר..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                showFilters || statusFilter !== "all" || planFilter !== "all" || verticalFilter !== "all"
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">סינון</span>
            </button>
          </div>

          {/* Filter Dropdowns */}
          {showFilters && (
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="active">פעיל</option>
                <option value="trial">ניסיון</option>
                <option value="suspended">מושהה</option>
                <option value="churned">עזב</option>
              </select>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">כל התוכניות</option>
                <option value="free">חינם</option>
                <option value="starter">סטרטר</option>
                <option value="professional">מקצועי</option>
                <option value="enterprise">ארגוני</option>
              </select>
              <select
                value={verticalFilter}
                onChange={(e) => setVerticalFilter(e.target.value)}
                className="px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">כל התחומים</option>
                <option value="beauty">יופי</option>
                <option value="fitness">כושר</option>
                <option value="health">בריאות</option>
                <option value="other">אחר</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 py-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTenants}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">סה״כ עסקים</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeTenants}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">פעילים</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.trialTenants}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">בניסיון</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₪{stats.mrr.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">MRR</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-rose-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBookings.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">הזמנות</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tenants Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-slate-800/50 text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="col-span-3">עסק</div>
            <div className="col-span-2">סטטוס / תוכנית</div>
            <div className="col-span-2">MRR</div>
            <div className="col-span-2">פעילות</div>
            <div className="col-span-2">הצטרף</div>
            <div className="col-span-1">פעולות</div>
          </div>

          {/* Tenant Rows */}
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {filteredTenants.map((tenant) => {
              const status = statusConfig[tenant.status];
              const plan = planConfig[tenant.plan];
              const vertical = verticalConfig[tenant.vertical];
              const StatusIcon = status.icon;

              return (
                <div
                  key={tenant.id}
                  className="px-4 lg:px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  {/* Mobile Layout */}
                  <div className="lg:hidden space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-xl">
                          {vertical.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{tenant.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{tenant.city}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                        <span className={`text-xs font-medium ${plan.color}`}>{plan.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                        <span>₪{tenant.mrr}/חודש</span>
                        <span>{tenant.totalBookings} הזמנות</span>
                      </div>
                      <Link
                        href={`/admin/tenants/${tenant.id}`}
                        className="text-violet-600 hover:text-violet-700 font-medium"
                      >
                        צפה
                      </Link>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white">
                        {vertical.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">{tenant.name}</p>
                          <Link
                            href={`/${tenant.slug}`}
                            target="_blank"
                            className="text-gray-400 hover:text-violet-600"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{tenant.email}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium w-fit ${status.bg} ${status.text}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </span>
                        <span className={`text-xs font-medium ${plan.color}`}>{plan.label}</span>
                        {tenant.trialEndsAt && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            נגמר בעוד {daysUntil(tenant.trialEndsAt)} ימים
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold text-gray-900 dark:text-white">₪{tenant.mrr.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">לחודש</p>
                    </div>
                    <div className="col-span-2">
                      <div className="space-y-1">
                        <p className="text-gray-900 dark:text-white">{tenant.totalBookings.toLocaleString()} הזמנות</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{tenant.activeClients} לקוחות פעילים</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-900 dark:text-white">{formatDate(tenant.createdAt)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">פעילות: {formatDate(tenant.lastActivity)}</p>
                    </div>
                    <div className="col-span-1 flex items-center gap-1">
                      <Link
                        href={`/admin/tenants/${tenant.id}`}
                        className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredTenants.length === 0 && (
            <div className="py-12 text-center">
              <Building2 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">לא נמצאו עסקים</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                נסה לשנות את הסינון או{" "}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setPlanFilter("all");
                    setVerticalFilter("all");
                  }}
                  className="text-violet-600 hover:text-violet-700"
                >
                  נקה את כל הסינונים
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
