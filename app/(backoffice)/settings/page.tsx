"use client";

import { useState } from "react";
import {
  Settings,
  Building2,
  Clock,
  Users,
  Bell,
  Shield,
  CreditCard,
  Globe,
  ChevronLeft,
  Save,
  Camera,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  Palette,
  Link as LinkIcon,
} from "lucide-react";

// Types
interface BusinessProfile {
  name: string;
  slug: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  logo?: string;
  coverImage?: string;
  primaryColor: string;
}

interface WorkingHour {
  day: number;
  dayName: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  breakStart?: string;
  breakEnd?: string;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "owner" | "admin" | "staff";
  avatar?: string;
  isActive: boolean;
}

interface BookingSettings {
  advanceBookingDays: number;
  minAdvanceHours: number;
  cancellationHours: number;
  requireConfirmation: boolean;
  allowReschedule: boolean;
  autoReminders: boolean;
  reminderHours: number;
}

// Demo data
const demoProfile: BusinessProfile = {
  name: "Bella Beauty",
  slug: "bella-beauty",
  description: "סטודיו ביוטי מקצועי לטיפולי פנים, ציפורניים ואיפור",
  email: "bella@beauty.co.il",
  phone: "03-1234567",
  address: "רחוב דיזנגוף 100",
  city: "תל אביב",
  primaryColor: "#8B5CF6",
};

const demoWorkingHours: WorkingHour[] = [
  { day: 0, dayName: "ראשון", isOpen: true, openTime: "09:00", closeTime: "19:00" },
  { day: 1, dayName: "שני", isOpen: true, openTime: "09:00", closeTime: "19:00" },
  { day: 2, dayName: "שלישי", isOpen: true, openTime: "09:00", closeTime: "19:00" },
  { day: 3, dayName: "רביעי", isOpen: true, openTime: "09:00", closeTime: "19:00" },
  { day: 4, dayName: "חמישי", isOpen: true, openTime: "09:00", closeTime: "19:00" },
  { day: 5, dayName: "שישי", isOpen: true, openTime: "09:00", closeTime: "14:00" },
  { day: 6, dayName: "שבת", isOpen: false, openTime: "00:00", closeTime: "00:00" },
];

const demoStaff: StaffMember[] = [
  { id: "1", name: "בלה כהן", email: "bella@beauty.co.il", phone: "050-1234567", role: "owner", isActive: true },
  { id: "2", name: "רונית לוי", email: "ronit@beauty.co.il", phone: "052-9876543", role: "admin", isActive: true },
  { id: "3", name: "דנה משה", email: "dana@beauty.co.il", phone: "054-5551234", role: "staff", isActive: true },
];

const demoBookingSettings: BookingSettings = {
  advanceBookingDays: 30,
  minAdvanceHours: 2,
  cancellationHours: 24,
  requireConfirmation: true,
  allowReschedule: true,
  autoReminders: true,
  reminderHours: 24,
};

// Color options
const colorOptions = [
  { value: "#8B5CF6", name: "סגול" },
  { value: "#F43F5E", name: "ורוד" },
  { value: "#3B82F6", name: "כחול" },
  { value: "#10B981", name: "ירוק" },
  { value: "#F59E0B", name: "כתום" },
  { value: "#EC4899", name: "פוקסיה" },
];

// Settings sections
type SettingsSection = "profile" | "hours" | "staff" | "booking" | "notifications";

const settingsSections = [
  { id: "profile" as const, label: "פרופיל העסק", icon: Building2 },
  { id: "hours" as const, label: "שעות פעילות", icon: Clock },
  { id: "staff" as const, label: "ניהול צוות", icon: Users },
  { id: "booking" as const, label: "הגדרות הזמנות", icon: Calendar },
  { id: "notifications" as const, label: "התראות", icon: Bell },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [profile, setProfile] = useState(demoProfile);
  const [workingHours, setWorkingHours] = useState(demoWorkingHours);
  const [staff, setStaff] = useState(demoStaff);
  const [bookingSettings, setBookingSettings] = useState(demoBookingSettings);

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setHasChanges(false);
  };

  const markChanged = () => setHasChanges(true);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <div className="px-4 py-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">הגדרות</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">ניהול פרופיל העסק והגדרות</p>
            </div>
            {hasChanges && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {saving ? "שומר..." : "שמור שינויים"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-2 space-y-1 lg:sticky lg:top-24">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-colors ${
                      isActive
                        ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Profile Section */}
            {activeSection === "profile" && (
              <ProfileSection
                profile={profile}
                setProfile={(p) => {
                  setProfile(p);
                  markChanged();
                }}
              />
            )}

            {/* Working Hours Section */}
            {activeSection === "hours" && (
              <WorkingHoursSection
                workingHours={workingHours}
                setWorkingHours={(h) => {
                  setWorkingHours(h);
                  markChanged();
                }}
              />
            )}

            {/* Staff Section */}
            {activeSection === "staff" && (
              <StaffSection
                staff={staff}
                setStaff={(s) => {
                  setStaff(s);
                  markChanged();
                }}
              />
            )}

            {/* Booking Settings Section */}
            {activeSection === "booking" && (
              <BookingSettingsSection
                settings={bookingSettings}
                setSettings={(s) => {
                  setBookingSettings(s);
                  markChanged();
                }}
              />
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && <NotificationsSection />}
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Section Component
function ProfileSection({
  profile,
  setProfile,
}: {
  profile: BusinessProfile;
  setProfile: (p: BusinessProfile) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="font-bold text-gray-900 dark:text-white">פרטי העסק</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Logo Upload */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                {profile.name[0]}
              </div>
              <button className="absolute -bottom-2 -left-2 w-8 h-8 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg hover:bg-violet-700 transition-colors">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">לוגו העסק</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                PNG או JPG, מקסימום 2MB
              </p>
              <button className="text-sm text-violet-600 hover:text-violet-700 font-medium">
                העלה תמונה
              </button>
            </div>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              שם העסק
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              כתובת העסק
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-gray-400">nextgen.co.il/</span>
              <input
                type="text"
                value={profile.slug}
                onChange={(e) => setProfile({ ...profile, slug: e.target.value })}
                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                dir="ltr"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              תיאור העסק
            </label>
            <textarea
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              צבע ראשי
            </label>
            <div className="flex flex-wrap gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setProfile({ ...profile, primaryColor: color.value })}
                  className={`w-10 h-10 rounded-xl transition-transform ${
                    profile.primaryColor === color.value
                      ? "ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-110"
                      : ""
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="font-bold text-gray-900 dark:text-white">פרטי התקשרות</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                אימייל
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  dir="ltr"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                טלפון
              </label>
              <div className="relative">
                <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full pr-10 pl-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              כתובת
            </label>
            <div className="relative">
              <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full pr-10 pl-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              עיר
            </label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Working Hours Section Component
function WorkingHoursSection({
  workingHours,
  setWorkingHours,
}: {
  workingHours: WorkingHour[];
  setWorkingHours: (h: WorkingHour[]) => void;
}) {
  const updateHour = (day: number, field: keyof WorkingHour, value: string | boolean) => {
    setWorkingHours(
      workingHours.map((h) => (h.day === day ? { ...h, [field]: value } : h))
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 dark:border-slate-800">
        <h2 className="font-bold text-gray-900 dark:text-white">שעות פעילות</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">הגדר את שעות הפעילות של העסק</p>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-slate-800">
        {workingHours.map((day) => (
          <div key={day.day} className="p-4 flex items-center gap-4">
            {/* Day Toggle */}
            <button
              onClick={() => updateHour(day.day, "isOpen", !day.isOpen)}
              className={`w-12 h-7 rounded-full transition-colors ${
                day.isOpen ? "bg-violet-500" : "bg-gray-300 dark:bg-slate-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  day.isOpen ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>

            {/* Day Name */}
            <span
              className={`w-16 font-medium ${
                day.isOpen
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              {day.dayName}
            </span>

            {/* Time Inputs */}
            {day.isOpen ? (
              <div className="flex-1 flex items-center gap-3">
                <input
                  type="time"
                  value={day.openTime}
                  onChange={(e) => updateHour(day.day, "openTime", e.target.value)}
                  className="px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <span className="text-gray-500">עד</span>
                <input
                  type="time"
                  value={day.closeTime}
                  onChange={(e) => updateHour(day.day, "closeTime", e.target.value)}
                  className="px-3 py-2 bg-gray-100 dark:bg-slate-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            ) : (
              <span className="flex-1 text-gray-400 dark:text-gray-500">סגור</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Staff Section Component
function StaffSection({
  staff,
  setStaff,
}: {
  staff: StaffMember[];
  setStaff: (s: StaffMember[]) => void;
}) {
  const [showAddModal, setShowAddModal] = useState(false);

  const roleLabels = {
    owner: "בעלים",
    admin: "מנהל",
    staff: "עובד",
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white">ניהול צוות</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{staff.length} אנשי צוות</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 rounded-xl font-medium hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors"
          >
            <Plus className="h-5 w-5" />
            הוסף עובד
          </button>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-slate-800">
          {staff.map((member) => (
            <div key={member.id} className="p-4 flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center text-white font-bold">
                {member.name[0]}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 dark:text-white">{member.name}</p>
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                      member.role === "owner"
                        ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                        : member.role === "admin"
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {roleLabels[member.role]}
                  </span>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
              </div>

              {/* Actions */}
              {member.role !== "owner" && (
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/30 rounded-lg transition-colors">
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Booking Settings Section Component
function BookingSettingsSection({
  settings,
  setSettings,
}: {
  settings: BookingSettings;
  setSettings: (s: BookingSettings) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="font-bold text-gray-900 dark:text-white">הגדרות הזמנות</h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Advance Booking */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              הזמנה מראש (ימים)
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              כמה ימים מראש לקוחות יכולים להזמין
            </p>
            <input
              type="number"
              min={1}
              max={365}
              value={settings.advanceBookingDays}
              onChange={(e) =>
                setSettings({ ...settings, advanceBookingDays: parseInt(e.target.value) || 30 })
              }
              className="w-32 px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Minimum Advance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              מינימום שעות מראש
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              כמה שעות מראש לפחות נדרש להזמנה
            </p>
            <input
              type="number"
              min={0}
              max={72}
              value={settings.minAdvanceHours}
              onChange={(e) =>
                setSettings({ ...settings, minAdvanceHours: parseInt(e.target.value) || 0 })
              }
              className="w-32 px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Cancellation Policy */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              מדיניות ביטול (שעות)
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              כמה שעות לפני התור ניתן לבטל
            </p>
            <input
              type="number"
              min={0}
              max={168}
              value={settings.cancellationHours}
              onChange={(e) =>
                setSettings({ ...settings, cancellationHours: parseInt(e.target.value) || 24 })
              }
              className="w-32 px-4 py-3 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Toggles */}
          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-slate-800">
            {/* Require Confirmation */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">דרוש אישור הזמנה</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  לקוחות צריכים לאשר את ההזמנה
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({ ...settings, requireConfirmation: !settings.requireConfirmation })
                }
                className={`w-12 h-7 rounded-full transition-colors ${
                  settings.requireConfirmation ? "bg-violet-500" : "bg-gray-300 dark:bg-slate-600"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.requireConfirmation ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Allow Reschedule */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">אפשר שינוי תור</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  לקוחות יכולים לשנות את מועד התור
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({ ...settings, allowReschedule: !settings.allowReschedule })
                }
                className={`w-12 h-7 rounded-full transition-colors ${
                  settings.allowReschedule ? "bg-violet-500" : "bg-gray-300 dark:bg-slate-600"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.allowReschedule ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Auto Reminders */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">תזכורות אוטומטיות</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  שלח תזכורת ללקוחות לפני התור
                </p>
              </div>
              <button
                onClick={() =>
                  setSettings({ ...settings, autoReminders: !settings.autoReminders })
                }
                className={`w-12 h-7 rounded-full transition-colors ${
                  settings.autoReminders ? "bg-violet-500" : "bg-gray-300 dark:bg-slate-600"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    settings.autoReminders ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {settings.autoReminders && (
              <div className="mr-4 pt-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  שעות לפני התור
                </label>
                <input
                  type="number"
                  min={1}
                  max={72}
                  value={settings.reminderHours}
                  onChange={(e) =>
                    setSettings({ ...settings, reminderHours: parseInt(e.target.value) || 24 })
                  }
                  className="w-24 px-4 py-2 bg-gray-100 dark:bg-slate-800 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Notifications Section Component
function NotificationsSection() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const notificationTypes = [
    { id: "new_booking", label: "הזמנה חדשה", enabled: true },
    { id: "booking_cancelled", label: "ביטול הזמנה", enabled: true },
    { id: "booking_changed", label: "שינוי הזמנה", enabled: true },
    { id: "reminder", label: "תזכורות", enabled: true },
    { id: "review", label: "ביקורת חדשה", enabled: false },
  ];

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="font-bold text-gray-900 dark:text-white">ערוצי התראות</h2>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">אימייל</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">קבל התראות לאימייל</p>
              </div>
            </div>
            <button
              onClick={() => setEmailNotifications(!emailNotifications)}
              className={`w-12 h-7 rounded-full transition-colors ${
                emailNotifications ? "bg-violet-500" : "bg-gray-300 dark:bg-slate-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  emailNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Phone className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">SMS</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">קבל הודעות טקסט</p>
              </div>
            </div>
            <button
              onClick={() => setSmsNotifications(!smsNotifications)}
              className={`w-12 h-7 rounded-full transition-colors ${
                smsNotifications ? "bg-violet-500" : "bg-gray-300 dark:bg-slate-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  smsNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <Bell className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">התראות דחיפה</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">התראות בזמן אמת</p>
              </div>
            </div>
            <button
              onClick={() => setPushNotifications(!pushNotifications)}
              className={`w-12 h-7 rounded-full transition-colors ${
                pushNotifications ? "bg-violet-500" : "bg-gray-300 dark:bg-slate-600"
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  pushNotifications ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Notification Types */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
          <h2 className="font-bold text-gray-900 dark:text-white">סוגי התראות</h2>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-slate-800">
          {notificationTypes.map((type) => (
            <div key={type.id} className="p-4 flex items-center justify-between">
              <span className="text-gray-900 dark:text-white">{type.label}</span>
              <button
                className={`w-12 h-7 rounded-full transition-colors ${
                  type.enabled ? "bg-violet-500" : "bg-gray-300 dark:bg-slate-600"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    type.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
