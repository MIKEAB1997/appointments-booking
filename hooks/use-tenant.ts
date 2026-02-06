"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Tenant } from "@/lib/supabase/types";

/**
 * Client-side tenant context
 */
export interface ClientTenantContext {
  id: string;
  slug: string;
  name: string;
  vertical: Tenant["vertical"];
  logoUrl: string | null;
  coverImageUrl: string | null;
}

/**
 * Tenant hook return type
 */
export interface UseTenantReturn {
  tenant: ClientTenantContext | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Client-side hook to get tenant context from URL params
 * Use this in Client Components that need tenant information
 */
export function useTenant(): UseTenantReturn {
  const params = useParams();
  const [tenant, setTenant] = useState<ClientTenantContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tenantSlug = params.tenant as string | undefined;

  useEffect(() => {
    if (!tenantSlug) {
      setIsLoading(false);
      return;
    }

    const fetchTenant = async () => {
      try {
        const supabase = createClient();

        const { data: rawData, error: fetchError } = await supabase
          .from("tenants")
          .select("id, slug, name, vertical, logo_url, cover_image_url")
          .eq("slug", tenantSlug)
          .eq("status", "active")
          .single();

        // Type assertion for the response
        const data = rawData as {
          id: string;
          slug: string;
          name: string;
          vertical: Tenant["vertical"];
          logo_url: string | null;
          cover_image_url: string | null;
        } | null;

        if (fetchError) {
          setError("העסק לא נמצא");
          setTenant(null);
        } else if (data) {
          setTenant({
            id: data.id,
            slug: data.slug,
            name: data.name,
            vertical: data.vertical,
            logoUrl: data.logo_url,
            coverImageUrl: data.cover_image_url,
          });
          setError(null);
        }
      } catch {
        setError("שגיאה בטעינת העסק");
        setTenant(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTenant();
  }, [tenantSlug]);

  return { tenant, isLoading, error };
}
