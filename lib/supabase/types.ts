/**
 * Database types placeholder
 *
 * Generate actual types using:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/types.ts
 *
 * Or from local:
 * npx supabase gen types typescript --local > lib/supabase/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// User roles
export type UserRole = "admin" | "owner" | "staff" | "customer";

// Booking statuses
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "no_show"
  | "completed"
  | "expired";

// Tenant statuses
export type TenantStatus = "active" | "suspended" | "trial" | "cancelled";

// Plan tiers
export type PlanTier = "starter" | "pro" | "scale";

// Business verticals
export type VerticalType = "fitness" | "beauty";

// Customer tiers
export type CustomerTier = "new" | "regular" | "vip";

// Day of week
export type DayOfWeek =
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

// Placeholder database types - replace with generated types
export interface Database {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          slug: string;
          name: string;
          email: string;
          phone: string | null;
          vertical: VerticalType;
          status: TenantStatus;
          plan: PlanTier;
          description: string | null;
          address: string | null;
          city: string | null;
          logo_url: string | null;
          cover_image_url: string | null;
          template_id: string | null;
          website_data: Json;
          custom_domain: string | null;
          is_website_published: boolean;
          default_buffer_minutes: number;
          cancellation_window_hours: number;
          late_cancel_penalty_points: number;
          no_show_penalty_points: number;
          reschedule_bonus_points: number;
          booking_points: number;
          attendance_points: number;
          streak_bonus_points: number;
          tier_regular_min_visits: number;
          tier_vip_min_visits: number;
          timezone: string;
          currency: string;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["tenants"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tenants"]["Insert"]>;
      };
      users: {
        Row: {
          id: string;
          auth_id: string | null;
          tenant_id: string | null;
          role: UserRole;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          total_points: number;
          current_tier: CustomerTier;
          current_streak: number;
          last_visit_at: string | null;
          is_at_risk: boolean;
          is_active: boolean;
          specialties: string[] | null;
          is_registered: boolean;
          guest_booking_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["users"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      services: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          // Duration fields - support both naming conventions
          duration_minutes: number;
          duration: number | null;
          buffer_minutes: number;
          buffer_before: number | null;
          buffer_after: number | null;
          price: number | null;
          currency: string;
          max_participants: number;
          color: string | null;
          is_active: boolean;
          sort_order: number;
          upsell_service_id: string | null;
          upsell_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["services"]["Row"],
          "id" | "created_at" | "updated_at" | "duration" | "buffer_before" | "buffer_after"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
      };
      bookings: {
        Row: {
          id: string;
          tenant_id: string;
          service_id: string;
          customer_id: string | null;
          staff_id: string | null;
          status: BookingStatus;
          // Time fields - both formats supported
          start_at: string | null;
          end_at: string | null;
          booking_date: string | null;
          booking_time: string | null;
          end_time: string | null;
          duration_minutes: number | null;
          // Customer/Guest info - both naming conventions supported
          guest_name: string | null;
          guest_email: string | null;
          customer_name: string | null;
          customer_email: string | null;
          customer_phone: string | null;
          // Confirmation/OTP
          otp_code: string | null;
          confirmation_code: string | null;
          otp_expires_at: string | null;
          otp_attempts: number | null;
          recovery_sent: boolean | null;
          verified_at: string | null;
          confirmed_at: string | null;
          confirmed_by: string | null;
          // Pending/Cancellation
          pending_expires_at: string | null;
          cancelled_at: string | null;
          cancel_reason: string | null;
          cancellation_reason: string | null;
          is_late_cancel: boolean | null;
          rescheduled_from_id: string | null;
          // Attendance
          checked_in_at: string | null;
          points_awarded: number | null;
          // Other
          notes: string | null;
          source: string | null;
          ip_address: string | null;
          price: number | null;
          created_at: string;
          updated_at: string;
          // Relations (for joined queries)
          tenants?: { name: string; slug: string } | null;
          services?: { id: string; name: string; duration: number; price: number | null; color: string | null; buffer_before?: number; buffer_after?: number } | null;
          staff?: { id: string; name: string } | null;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          service_id: string;
          customer_id?: string | null;
          staff_id?: string | null;
          status?: BookingStatus;
          start_at?: string | null;
          end_at?: string | null;
          booking_date?: string | null;
          booking_time?: string | null;
          end_time?: string | null;
          duration_minutes?: number | null;
          guest_name?: string | null;
          guest_email?: string | null;
          customer_name?: string | null;
          customer_email?: string | null;
          customer_phone?: string | null;
          otp_code?: string | null;
          confirmation_code?: string | null;
          notes?: string | null;
          price?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: BookingStatus;
          confirmed_at?: string | null;
          confirmed_by?: string | null;
          cancelled_at?: string | null;
          cancel_reason?: string | null;
          cancellation_reason?: string | null;
          updated_at?: string;
          [key: string]: unknown;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      booking_status: BookingStatus;
      tenant_status: TenantStatus;
      plan_tier: PlanTier;
      vertical_type: VerticalType;
      customer_tier: CustomerTier;
      day_of_week: DayOfWeek;
    };
  };
}

// Helper type for tenant row
export type Tenant = Database["public"]["Tables"]["tenants"]["Row"];
export type TenantInsert = Database["public"]["Tables"]["tenants"]["Insert"];
export type TenantUpdate = Database["public"]["Tables"]["tenants"]["Update"];

// Helper type for user row
export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

// Helper type for service row
export type Service = Database["public"]["Tables"]["services"]["Row"];
export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
export type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

// Helper type for booking row
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"];
export type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"];
