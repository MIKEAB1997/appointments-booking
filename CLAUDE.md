# NextGen — SaaS לניהול תורים וצמיחה עסקית (כושר + ביוטי)

## Project Overview

NextGen is a multi-tenant SaaS platform for appointment booking and business growth, targeting fitness studios and beauty businesses in Israel. It's not just a calendar — it's an **automated growth engine**: fast digital presence, zero-friction booking, retention gamification, and action-oriented reports.

### Core Differentiators
1. **Digital Presence in 10 Minutes** — Professional landing page + embedded booking
2. **Zero-Friction Booking** — 2 clicks to book, verification at the END (not the beginning)
3. **Retention Engine** — Gamification that rewards attendance and encourages reschedule over cancel
4. **Action-Oriented Reports** — Reports that generate "what to do tomorrow morning"
5. **Capacitor-Ready PWA** — Web-first, wrappable to iOS/Android later

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | **Next.js 14+ (App Router)** | SSR/SSG, API routes, Server Actions, great DX |
| UI | **Tailwind CSS + shadcn/ui** | Fast, accessible, consistent design system |
| Database | **Supabase (PostgreSQL)** | RLS built-in, Auth, Realtime, Edge Functions |
| Auth | **Supabase Auth (Email Magic Link / OTP)** | Zero cost, native RLS integration |
| Hosting | **Vercel** | Edge-optimized, automatic deployments, preview URLs |
| Language | **TypeScript** (strict mode) | Type safety across full stack |
| Mobile (Phase 2) | **Capacitor** | Same codebase → iOS + Android apps |
| Payments (Phase 2-3) | **Tranzilla / PayPlus** | Israeli market, shekel support, local compliance |
| WhatsApp (Phase 3) | **Meta Cloud API** | Official Business API for messages + templates |

---

## Architecture Decisions

### Multi-Tenancy
- **Shared DB + `tenant_id` column on every table + Supabase RLS**
- Tenant resolution: subdomain-based (`{slug}.nextgen.co.il`)
- Middleware extracts slug → injects tenant context → all queries filtered
- **Every API route and server action MUST include tenant context**

### Auth Strategy (Phase 1)
- **Supabase Auth with Email Magic Link / OTP**
- Business owners: email + password signup
- Customers (booking): email magic link (collects email for free comms)
- No WhatsApp/SMS in Phase 1 — saves cost and complexity
- Auth roles: `admin` (platform), `owner`, `staff`, `customer`

### PWA + Capacitor-Ready Design
- PWA manifest + Service Worker for caching static assets
- **No hover-only states** — all interactions via click/tap
- **Touch targets: minimum 44x44px**
- **Safe area padding**: `env(safe-area-inset-top)` etc.
- **Client-side routing only** — no full page reloads
- Phase 2: `npx cap add ios && npx cap add android`

### Accessibility (AA — IS 5568 / WCAG)
- All templates built with: contrast ratios, semantic headings, keyboard focus, alt text, valid forms
- Auto-generated accessibility statement per business site
- axe-core integrated in CI for automated checks

### Internationalization
- **Hebrew (RTL) first** — all UI is RTL by default
- English support later if needed
- Date format: DD/MM/YYYY, currency: ₪ (ILS)

---

## Project Structure

```
nextgen/
├── CLAUDE.md                    # This file
├── apps/
│   └── web/                     # Next.js app
│       ├── app/
│       │   ├── (public)/        # Public-facing: business sites + booking
│       │   │   ├── [tenant]/    # Dynamic tenant routing
│       │   │   │   ├── page.tsx           # Business landing page
│       │   │   │   ├── book/              # Booking flow
│       │   │   │   │   ├── page.tsx       # Service + time selection
│       │   │   │   │   ├── details/       # Name + email
│       │   │   │   │   ├── verify/        # OTP verification
│       │   │   │   │   └── confirmed/     # Confirmation + soft signup
│       │   │   │   └── profile/           # Customer profile (points, bookings)
│       │   ├── (backoffice)/    # Business owner dashboard
│       │   │   ├── dashboard/   # Today + Action Cards
│       │   │   ├── calendar/    # Day/week view
│       │   │   ├── clients/     # Client list + tiers
│       │   │   ├── services/    # Service management
│       │   │   ├── website/     # Template picker + builder
│       │   │   ├── reports/     # Weekly + monthly (Phase 2)
│       │   │   └── settings/    # Business profile, policies, team
│       │   ├── (admin)/         # Platform admin
│       │   │   ├── tenants/     # Tenant management
│       │   │   ├── billing/     # Plans + invoices
│       │   │   ├── templates/   # Template management
│       │   │   ├── security/    # OTP abuse, rate limits
│       │   │   ├── features/    # Feature flags
│       │   │   └── audit/       # Audit logs
│       │   ├── api/             # API routes
│       │   │   ├── auth/        # Auth callbacks
│       │   │   ├── bookings/    # Booking CRUD
│       │   │   ├── tenants/     # Tenant operations
│       │   │   └── webhooks/    # External service webhooks
│       │   ├── layout.tsx       # Root layout (RTL, fonts, providers)
│       │   └── middleware.ts    # Tenant resolution + auth guard
│       ├── components/
│       │   ├── ui/              # shadcn/ui components
│       │   ├── booking/         # Booking flow components
│       │   ├── calendar/        # Calendar components
│       │   ├── dashboard/       # Dashboard + Action Cards
│       │   └── templates/       # Business site templates
│       ├── lib/
│       │   ├── supabase/
│       │   │   ├── client.ts    # Browser client
│       │   │   ├── server.ts    # Server client (with tenant context)
│       │   │   ├── admin.ts     # Admin client (service role)
│       │   │   └── types.ts     # Generated types from Supabase
│       │   ├── auth/            # Auth helpers
│       │   ├── tenant/          # Tenant resolution logic
│       │   ├── gamification/    # Points + tiers engine
│       │   ├── notifications/   # Email sending (Phase 1)
│       │   └── utils/           # Shared utilities
│       ├── hooks/               # Custom React hooks
│       ├── styles/              # Global styles + Tailwind config
│       └── public/              # Static assets, PWA manifest
├── supabase/
│   ├── migrations/              # SQL migrations
│   ├── seed.sql                 # Dev seed data
│   └── config.toml              # Supabase project config
├── packages/                    # Shared packages (if needed)
├── package.json
├── tsconfig.json
└── next.config.js
```

---

## Screens Inventory

### Customer-Facing (Public) — 7 screens
| # | Screen | Route | Description |
|---|--------|-------|-------------|
| 1 | Business Landing Page | `/{tenant}` | Hero + Services + CTA (from template) |
| 2 | Service + Time Selection | `/{tenant}/book` | Visual service picker + time slots |
| 3 | Details Input | `/{tenant}/book/details` | Name + Email only |
| 4 | OTP Verification | `/{tenant}/book/verify` | Magic link / code + progress bar + gamification |
| 5 | Booking Confirmation | `/{tenant}/book/confirmed` | Summary + Soft Signup modal |
| 6 | Customer Profile | `/{tenant}/profile` | My bookings + points + tier (registered only) |
| 7 | Reschedule / Cancel | `/{tenant}/profile/manage/{id}` | Change or cancel with policy display |

### Business Backoffice — 8 screens
| # | Screen | Route | Description |
|---|--------|-------|-------------|
| 1 | Dashboard (Today) | `/dashboard` | Today's schedule + 3 Action Cards |
| 2 | Calendar | `/calendar` | Day/week view + team/service filters |
| 3 | Clients | `/clients` | List + Tier + At-Risk + history |
| 4 | Services & Schedule | `/services` | CRUD services, durations, buffers |
| 5 | Website Builder | `/website` | Template picker + block editor + preview |
| 6 | Settings | `/settings` | Profile, team, cancellation policy, gamification |
| 7 | Reports | `/reports` | Weekly + monthly (Phase 2) |
| 8 | Payments & Packages | `/payments` | Phase 2-3 |

### Admin Platform — 7 screens
| # | Screen | Route | Description |
|---|--------|-------|-------------|
| 1 | Tenants Overview | `/admin/tenants` | List + status + plans |
| 2 | Tenant Detail | `/admin/tenants/{id}` | Edit + impersonation (with audit) |
| 3 | Billing & Plans | `/admin/billing` | Plans, invoices, failures |
| 4 | Templates | `/admin/templates` | Manage, version, A/B test |
| 5 | Security Center | `/admin/security` | OTP abuse, rate limits, IP flags |
| 6 | Feature Flags | `/admin/features` | Beta/rollout toggles |
| 7 | Audit Logs | `/admin/audit` | All system-wide logged actions |

---

## Booking Flow — Detailed Logic

```
[User lands on business page]
        ↓
[Select Service + Time Slot] ← 2 clicks max
        ↓
[Enter Name + Email]
        ↓
[Click "Book Now"] → Creates PENDING booking (10-min TTL)
        ↓
[OTP Screen — Email Magic Link / Code]
  ├─ OTP valid within 10 min → CONFIRMED + show confirmation
  ├─ 3 min no action → Recovery email with link back to verify
  └─ 10 min expired → EXPIRED (slot released)
        ↓
[Confirmation Screen]
  └─ Soft Signup Modal: "Save progress for points & easy management"
     ├─ "Save" → Create account (already have email)
     └─ "Maybe later" → Guest, but booking is saved
```

### Anti-Abuse
- Rate limit: max 5 OTP requests per email per hour
- Rate limit: max 10 booking attempts per IP per hour
- Temporary block after 3 failed OTP attempts (15 min cooldown)
- All attempts logged for security audit

---

## Gamification Engine

### Points System (defaults — business can customize)
| Action | Points |
|--------|--------|
| Book appointment | +5 |
| Show up (attended) | +25 |
| Reschedule (instead of cancel) | +10 |
| Weekly streak (2+ visits/week) | +20 |
| Late cancel | -30 |
| No-show | -30 |

### Tiers (rolling 60-day window)
| Tier | Criteria | Perks |
|------|----------|-------|
| חדש (New) | 0–2 attended | Default experience |
| קבוע (Regular) | 3–7 attended | — |
| VIP | 8+ attended + low no-show | Waitlist priority + flexible cancel window |

### Tier = The Reward
No complex rewards catalog in MVP. The tier itself IS the reward:
- VIP status visible to business owner in calendar
- Waitlist priority (fitness: first to get offered freed slots)
- Flexible cancellation window (e.g., 2h instead of 4h)
- Business can add custom perks per tier in settings

---

## Cancellation Policy (Defaults)
- **Free cancel:** up to 4 hours before appointment
- **Late cancel:** under 4 hours → -30 points
- **No-show:** -30 points
- **Business can customize** the cancellation window in settings
- Reschedule (any time before appointment) → no penalty + bonus points

---

## Action Cards System

### Daily (Dashboard — "Today")
3 cards generated each morning:
1. **Fill Gaps:** "Tuesday 10:00 is empty — send Happy Hour to morning clients?"
2. **Retention:** "3 VIPs haven't booked this month — send 'we miss you'?"
3. **Optimization:** "Treatment X always runs 10 min over — update duration?"

### Weekly Summary (Email + Dashboard)
- Occupancy by day/hour
- Cancellations / No-shows
- New vs returning clients
- 3 action items for next week

### Monthly Growth Report (Phase 2 — Dashboard + PDF)
- Revenue by service/instructor
- Trends vs previous month
- "Money Left on the Table" (gaps + cancellations)
- Pricing/schedule/campaign recommendations

---

## Templates System (Business Sites)

### Phase 1: Template Picker + Form Fill (No AI)
- 6 fitness templates + 6 beauty templates
- Each template = blocks: Hero / Services / Pricing / Gallery / FAQ / Location / CTA
- Business fills a structured form → data populates template
- All templates AA-accessible out of the box

### Phase 2: AI Enhancement
- AI text generation from facts (prevents hallucination)
- Style Quiz (vibe cards) → maps to design tokens
- 3 AI variations → business approves before publish
- Social Proof Sync (Google/Facebook reviews)

---

## Vertical-Specific Features

### Fitness
- **Waitlist Automation (Phase 2):** Freed slot → email to top 5 waitlisted → first to confirm gets it
- **Attendance Tracker:** Instructor sees "At-Risk" chip on clients missing 2+ weeks
- **Class-based booking:** Multiple participants per time slot

### Beauty
- **Smart Buffers:** Default +10 min cleanup between appointments (owner can override with warning)
- **Combined Flow / Upsell (Phase 2):** "Color" booked → suggest "Haircut" if slot available (once per booking, only if available)

---

## Security Requirements

### Multi-Tenant Isolation
- Every table has `tenant_id` column
- Supabase RLS policies enforce tenant isolation on ALL operations
- API middleware validates tenant context before any DB operation
- No cross-tenant data access possible

### Rate Limiting
- OTP: 5 per email per hour
- Booking attempts: 10 per IP per hour
- API: 100 requests per minute per tenant
- Recovery emails: 3 per booking session

### Audit Log
- All price changes, policy changes, template changes, permission changes
- Impersonation events (admin entering as business)
- Stored immutably with timestamp + actor + action + before/after

### Secrets Management
- All API keys in environment variables (Vercel env)
- No secrets in code or DB
- Supabase service role key only on server-side

---

## Development Phases & Sprint Plan

### Pre-Work (Day 1)
- [ ] Init Next.js 14 project + Tailwind + shadcn/ui
- [ ] Supabase project setup + connect
- [ ] Environment variables (.env.local)
- [ ] Project structure scaffolding
- [ ] RTL layout + Hebrew fonts setup

### Sprint 1 — Foundation (Days 2–5)
- [ ] DB Schema: all tables + RLS policies (see db-schema.sql)
- [ ] Supabase Auth setup (Email Magic Link)
- [ ] Tenant middleware (slug extraction → context)
- [ ] Auth roles: admin, owner, staff, customer
- [ ] Base layout components (RTL, navigation)

### Sprint 2 — Business Website (Days 6–9)
- [ ] Template system: 3 fitness + 3 beauty (start with 6, expand to 12)
- [ ] Dynamic routing: `[tenant]/page.tsx`
- [ ] Block components: Hero, Services, Pricing, Gallery, CTA
- [ ] Template picker in backoffice
- [ ] Form fill: business enters data → populates template
- [ ] Mobile-first responsive + PWA manifest
- [ ] Accessibility AA baseline

### Sprint 3 — Booking Flow (Days 10–14)
- [ ] Service selection UI (visual cards)
- [ ] Time slot picker (available slots from DB)
- [ ] Details form (name + email)
- [ ] PENDING booking creation (10-min TTL)
- [ ] Email OTP / Magic Link verification
- [ ] Recovery email (3-min trigger)
- [ ] CONFIRMED / EXPIRED state management
- [ ] Confirmation screen + Soft Signup modal
- [ ] Rate limiting (email + IP)
- [ ] Anti-abuse logging

### Sprint 4 — Backoffice Core (Days 15–19)
- [ ] Dashboard: Today view + basic Action Cards
- [ ] Calendar: day/week view with filters (team/service)
- [ ] Client list: search + tier display + booking history
- [ ] Service management: CRUD + durations + buffers
- [ ] Staff management (basic)
- [ ] Settings: business profile, cancellation policy

### Sprint 5 — Gamification v1 (Days 20–22)
- [ ] Points engine: earn/lose on booking events
- [ ] Tier calculation (60-day rolling window)
- [ ] Visual: tier badge + points in customer profile
- [ ] Visual: tier chip next to client name in backoffice calendar
- [ ] "At-Risk" detection (no visit in 14 days)

### Sprint 6 — Notifications + Reports (Days 23–26)
- [ ] Email: booking confirmation
- [ ] Email: 24h + 2h reminders (cron/edge function)
- [ ] Email: weekly summary to business owner
- [ ] "At-Risk" notification in dashboard
- [ ] Weekly report: occupancy, cancellations, new/returning

### Sprint 7 — Admin Panel (Days 27–29)
- [ ] Tenants CRUD + status
- [ ] Impersonation with audit log
- [ ] Feature flags (basic)
- [ ] Security dashboard (OTP abuse metrics)

### Sprint 8 — Polish + Launch Prep (Days 30–33)
- [ ] E2E testing (Playwright)
- [ ] Lighthouse audit (target 90+)
- [ ] Accessibility audit (axe-core)
- [ ] PWA install flow
- [ ] Error handling + edge cases
- [ ] Seed data for demo
- [ ] Documentation

---

## Coding Standards

### TypeScript
- Strict mode always
- No `any` — use proper types
- Supabase types auto-generated from DB schema

### Components
- Functional components only
- Server Components by default, Client Components only when needed
- shadcn/ui as base, customize with Tailwind

### Naming
- Files: kebab-case (`booking-flow.tsx`)
- Components: PascalCase (`BookingFlow`)
- Functions/variables: camelCase
- DB columns: snake_case
- Constants: UPPER_SNAKE_CASE

### Git
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Branch per sprint: `sprint-1/foundation`, etc.

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# App
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_APP_DOMAIN=nextgen.co.il

# Email (Phase 1 — Supabase handles it)
# No additional config needed

# Payments (Phase 2-3)
# TRANZILLA_TERMINAL=
# TRANZILLA_API_KEY=

# WhatsApp (Phase 3)
# WHATSAPP_BUSINESS_ID=
# WHATSAPP_API_TOKEN=
```

---

## Key Reminders for Claude Code

1. **Always enforce tenant_id** — every query, every mutation, every RLS policy
2. **RTL first** — all layouts, all text, all date formats
3. **Mobile-first** — design for 375px width first, scale up
4. **AA Accessibility** — semantic HTML, ARIA labels, keyboard nav, contrast
5. **No hover-only interactions** — everything must work on touch
6. **Touch targets 44x44px minimum**
7. **Safe area padding** — for future Capacitor wrapping
8. **Email for all comms in Phase 1** — no SMS, no WhatsApp
9. **Server Components by default** — Client Components only for interactivity
10. **Type everything** — no `any`, no untyped responses
