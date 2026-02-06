"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Phone,
  MessageSquare,
  Filter,
  ChevronDown,
  ChevronLeft,
  Calendar,
  Clock,
  DollarSign,
  Star,
  MoreVertical,
  UserPlus,
  Download,
  Tag,
  X,
  Mail,
  MapPin,
  Edit2,
  Trash2,
  Heart,
  AlertTriangle,
  TrendingUp,
  Users,
} from "lucide-react";

// Client type definitions
interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  joinedDate: string;
  lastVisit: string;
  totalVisits: number;
  totalSpent: number;
  avgBookingValue: number;
  favoriteService: string;
  tags: string[];
  status: "active" | "at-risk" | "inactive" | "vip";
  notes?: string;
  upcomingBookings: number;
  birthday?: string;
}

// Demo clients data
const demoClients: Client[] = [
  {
    id: "1",
    name: "שרה כהן",
    phone: "050-1234567",
    email: "sarah@email.com",
    joinedDate: "2024-03-15",
    lastVisit: "2025-02-01",
    totalVisits: 24,
    totalSpent: 4800,
    avgBookingValue: 200,
    favoriteService: "מניקור ג'ל",
    tags: ["VIP", "מועדון"],
    status: "vip",
    upcomingBookings: 1,
    birthday: "1990-05-12",
  },
  {
    id: "2",
    name: "דנה לוי",
    phone: "052-9876543",
    email: "dana@email.com",
    joinedDate: "2024-06-20",
    lastVisit: "2025-01-28",
    totalVisits: 12,
    totalSpent: 1800,
    avgBookingValue: 150,
    favoriteService: "פדיקור ספא",
    tags: ["חדש"],
    status: "active",
    upcomingBookings: 2,
  },
  {
    id: "3",
    name: "מיכל אברהם",
    phone: "054-5551234",
    email: "michal@email.com",
    joinedDate: "2024-01-10",
    lastVisit: "2024-11-15",
    totalVisits: 8,
    totalSpent: 1600,
    avgBookingValue: 200,
    favoriteService: "טיפול פנים",
    tags: [],
    status: "at-risk",
    upcomingBookings: 0,
    notes: "העדיפה טיפולים בבוקר",
  },
  {
    id: "4",
    name: "רונית שמש",
    phone: "050-7778899",
    email: "ronit@email.com",
    joinedDate: "2024-08-05",
    lastVisit: "2025-02-03",
    totalVisits: 6,
    totalSpent: 1500,
    avgBookingValue: 250,
    favoriteService: "איפור ערב",
    tags: ["אירועים"],
    status: "active",
    upcomingBookings: 1,
    birthday: "1988-11-22",
  },
  {
    id: "5",
    name: "יעל דוד",
    phone: "053-1112233",
    email: "yael@email.com",
    joinedDate: "2023-12-01",
    lastVisit: "2024-09-20",
    totalVisits: 15,
    totalSpent: 1200,
    avgBookingValue: 80,
    favoriteService: "עיצוב גבות",
    tags: [],
    status: "inactive",
    upcomingBookings: 0,
  },
  {
    id: "6",
    name: "נועה גולן",
    phone: "050-4445566",
    email: "noa@email.com",
    joinedDate: "2024-09-12",
    lastVisit: "2025-02-04",
    totalVisits: 18,
    totalSpent: 3600,
    avgBookingValue: 200,
    favoriteService: "טיפול פנים מלא",
    tags: ["VIP", "מועדון"],
    status: "vip",
    upcomingBookings: 3,
    birthday: "1995-03-08",
  },
  {
    id: "7",
    name: "תמר ברק",
    phone: "052-7788990",
    email: "tamar@email.com",
    joinedDate: "2024-11-01",
    lastVisit: "2025-01-15",
    totalVisits: 4,
    totalSpent: 480,
    avgBookingValue: 120,
    favoriteService: "מניקור קלאסי",
    tags: ["חדש"],
    status: "active",
    upcomingBookings: 0,
  },
  {
    id: "8",
    name: "אורלי משה",
    phone: "054-3332211",
    email: "orly@email.com",
    joinedDate: "2024-04-18",
    lastVisit: "2024-12-01",
    totalVisits: 10,
    totalSpent: 2000,
    avgBookingValue: 200,
    favoriteService: "פדיקור + מניקור",
    tags: ["מועדון"],
    status: "at-risk",
    upcomingBookings: 0,
    notes: "מבקשת תמיד את רונית",
  },
];

const statusConfig = {
  active: {
    label: "פעיל",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-400",
    icon: Heart,
  },
  "at-risk": {
    label: "בסיכון",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    text: "text-amber-700 dark:text-amber-400",
    icon: AlertTriangle,
  },
  inactive: {
    label: "לא פעיל",
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-600 dark:text-gray-400",
    icon: Clock,
  },
  vip: {
    label: "VIP",
    bg: "bg-violet-100 dark:bg-violet-900/30",
    text: "text-violet-700 dark:text-violet-400",
    icon: Star,
  },
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

// Days since helper
function daysSince(dateStr: string): number {
  const date = new Date(dateStr);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Generate initials
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
}

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Get unique tags from all clients
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    demoClients.forEach((client) => {
      client.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  // Filter clients
  const filteredClients = useMemo(() => {
    return demoClients.filter((client) => {
      const matchesSearch =
        client.name.includes(searchQuery) ||
        client.phone.includes(searchQuery) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || client.status === statusFilter;

      const matchesTag =
        tagFilter === "all" || client.tags.includes(tagFilter);

      return matchesSearch && matchesStatus && matchesTag;
    });
  }, [searchQuery, statusFilter, tagFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: demoClients.length,
      active: demoClients.filter((c) => c.status === "active" || c.status === "vip").length,
      atRisk: demoClients.filter((c) => c.status === "at-risk").length,
      vip: demoClients.filter((c) => c.status === "vip").length,
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="px-4 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">לקוחות</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredClients.length} מתוך {demoClients.length} לקוחות
              </p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <UserPlus className="h-5 w-5" />
                <span className="hidden sm:inline">לקוח חדש</span>
              </button>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="חיפוש לפי שם, טלפון או מייל..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10 pl-4 py-2.5 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                showFilters || statusFilter !== "all" || tagFilter !== "all"
                  ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                  : "bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <Filter className="h-5 w-5" />
              <span className="hidden sm:inline">סינון</span>
              {(statusFilter !== "all" || tagFilter !== "all") && (
                <span className="w-2 h-2 rounded-full bg-violet-500" />
              )}
            </button>
          </div>

          {/* Filter Dropdowns */}
          {showFilters && (
            <div className="flex gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-slate-800">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">כל הסטטוסים</option>
                <option value="vip">VIP</option>
                <option value="active">פעיל</option>
                <option value="at-risk">בסיכון</option>
                <option value="inactive">לא פעיל</option>
              </select>
              <select
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="all">כל התגיות</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
              {(statusFilter !== "all" || tagFilter !== "all") && (
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setTagFilter("all");
                  }}
                  className="px-3 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  נקה
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 py-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">סה״כ לקוחות</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Heart className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">לקוחות פעילים</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.atRisk}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">בסיכון נטישה</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.vip}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">לקוחות VIP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Clients List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
          {/* Desktop Table Header */}
          <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 dark:bg-slate-800/50 text-sm font-medium text-gray-500 dark:text-gray-400">
            <div className="col-span-3">לקוח</div>
            <div className="col-span-2">סטטוס</div>
            <div className="col-span-2">ביקור אחרון</div>
            <div className="col-span-2">סה״כ הוצאות</div>
            <div className="col-span-2">תורים קרובים</div>
            <div className="col-span-1">פעולות</div>
          </div>

          {/* Client Rows */}
          <div className="divide-y divide-gray-100 dark:divide-slate-800">
            {filteredClients.map((client) => {
              const status = statusConfig[client.status];
              const StatusIcon = status.icon;
              const daysAgo = daysSince(client.lastVisit);

              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className="px-4 lg:px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  {/* Mobile Layout */}
                  <div className="lg:hidden">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold">
                          {getInitials(client.name)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{client.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{client.phone}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
                        <span>{client.totalVisits} ביקורים</span>
                        <span>₪{client.totalSpent.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors">
                          <Phone className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors">
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {getInitials(client.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">{client.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{client.phone}</p>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.text}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {status.label}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-900 dark:text-white">{formatDate(client.lastVisit)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">לפני {daysAgo} ימים</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-semibold text-gray-900 dark:text-white">₪{client.totalSpent.toLocaleString()}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{client.totalVisits} ביקורים</p>
                    </div>
                    <div className="col-span-2">
                      {client.upcomingBookings > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium">
                          <Calendar className="h-3.5 w-3.5" />
                          {client.upcomingBookings} תורים
                        </span>
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">אין תורים</span>
                      )}
                    </div>
                    <div className="col-span-1 flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `tel:${client.phone}`;
                        }}
                        className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredClients.length === 0 && (
            <div className="py-12 text-center">
              <Users className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-2">לא נמצאו לקוחות</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                נסה לחפש משהו אחר או{" "}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setTagFilter("all");
                  }}
                  className="text-violet-600 hover:text-violet-700"
                >
                  נקה את הסינונים
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Client Detail Slide-over */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 lg:flex lg:justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedClient(null)}
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
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">פרטי לקוח</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedClient(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {getInitials(selectedClient.name)}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedClient.name}</h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  {(() => {
                    const status = statusConfig[selectedClient.status];
                    const StatusIcon = status.icon;
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                        <StatusIcon className="h-4 w-4" />
                        {status.label}
                      </span>
                    );
                  })()}
                </div>

                {/* Tags */}
                {selectedClient.tags.length > 0 && (
                  <div className="flex items-center justify-center gap-2 mt-3">
                    {selectedClient.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-3 gap-3">
                <button className="flex flex-col items-center gap-2 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                  <Phone className="h-6 w-6 text-emerald-600" />
                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">התקשר</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">הודעה</span>
                </button>
                <button className="flex flex-col items-center gap-2 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl hover:bg-violet-100 dark:hover:bg-violet-900/30 transition-colors">
                  <Calendar className="h-6 w-6 text-violet-600" />
                  <span className="text-sm font-medium text-violet-700 dark:text-violet-400">קבע תור</span>
                </button>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">פרטי התקשרות</h4>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{selectedClient.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">{selectedClient.email}</span>
                </div>
                {selectedClient.birthday && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700 dark:text-gray-300">יום הולדת: {formatDate(selectedClient.birthday)}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="h-5 w-5 text-violet-600" />
                    <span className="text-sm text-violet-600 dark:text-violet-400">סה״כ הוצאות</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₪{selectedClient.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm text-emerald-600 dark:text-emerald-400">ביקורים</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedClient.totalVisits}
                  </p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span className="text-sm text-blue-600 dark:text-blue-400">ממוצע לביקור</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₪{selectedClient.avgBookingValue}
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-5 w-5 text-amber-600" />
                    <span className="text-sm text-amber-600 dark:text-amber-400">שירות מועדף</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {selectedClient.favoriteService}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {selectedClient.notes && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-2">הערות</h4>
                  <p className="text-yellow-700 dark:text-yellow-400 text-sm">{selectedClient.notes}</p>
                </div>
              )}

              {/* Activity */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">פעילות אחרונה</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedClient.favoriteService}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(selectedClient.lastVisit)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                <button className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium">
                  <Trash2 className="h-4 w-4" />
                  מחק לקוח
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <AddClientModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

// Add Client Modal Component
function AddClientModal({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would save to Supabase
    console.log("Adding client:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">לקוח חדש</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              שם מלא *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="שם הלקוח"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              טלפון *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="050-0000000"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              אימייל
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="email@example.com"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              הערות
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
              placeholder="הערות נוספות..."
            />
          </div>

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
              הוסף לקוח
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
