# Tloud — Feature Matrix & Phased Roadmap

> From chatbot to AI operations platform for Thai SMEs

---

## Platform Vision

```
┌─────────────────────────────────────────────────────────┐
│                    TLOUD PLATFORM                        │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ แชทขาย   │  │ แอดมินตอบ │  │ จองคิว    │  │ Custom │ │
│  │ Chat     │  │ Admin    │  │ Booking  │  │ Agent  │ │
│  │ Seller   │  │ Reply    │  │ Agent    │  │ Builder│ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘ │
│       │              │              │             │      │
│  ┌────┴──────────────┴──────────────┴─────────────┴────┐│
│  │              AI AGENT ENGINE                         ││
│  │  Typhoon LLM · GPT-4o · Claude · Knowledge Base    ││
│  │  Thai NLU · Confidence Scoring · Handoff Logic      ││
│  └──────────────────────┬──────────────────────────────┘│
│                         │                               │
│  ┌──────────────────────┴──────────────────────────────┐│
│  │              INTEGRATION LAYER                       ││
│  │  LINE OA · Facebook · Shopee · Lazada · IG · TikTok ││
│  │  PromptPay · Stripe · Google Calendar · Webhook     ││
│  └─────────────────────────────────────────────────────┘│
│                                                         │
│  ┌─────────────────────────────────────────────────────┐│
│  │              THAI CLOUD                              ││
│  │  AWS Thailand · PDPA · Thai data residency          ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

---

## Feature Matrix

### F1 — AI Receptionist (ต้อนรับ)

> "ตอบแชทแทนเจ้าของ 24 ชม."

| ID | Feature | Description | Demand | Phase |
|----|---------|-------------|--------|-------|
| F1.1 | **FAQ Auto-Reply** | AI answers from uploaded knowledge base (price, hours, menu, schedule, shipping) | 84% | Alpha |
| F1.2 | **Knowledge Base Upload** | Photo + text catalog upload from mobile. AI learns products/services/pricing | 84% | Alpha |
| F1.3 | **Human Handoff** | When AI is unsure → instant LINE notification to owner with context. <5 sec | 64% | Alpha |
| F1.4 | **Thai Tone Customization** | 3 presets: สุภาพ (formal), เป็นกันเอง (friendly), น่ารัก (cute). Custom option later | 52% | Alpha |
| F1.5 | **After-Hours Mode** | Different behavior outside business hours (auto-greet, collect info, promise callback) | 62% | Alpha |
| F1.6 | **Quick Update** | Owner sends LINE msg "หมดแล้ว" → AI instantly reflects. No dashboard needed | 48% | Alpha |
| F1.7 | **Compliance Mode** | Forbidden-phrase list, response templates for regulated products (supplements, health) | 23% | Beta |
| F1.8 | **Multilingual** | Thai + English auto-detect. Chinese/Japanese later | 35% | Beta |
| F1.9 | **AI Personality Clone** | Train AI to match owner's actual communication style from chat history | 28% | V2 |

### F2 — AI Booking (จองคิว)

> "ลูกค้าจองผ่าน LINE อัตโนมัติ"

| ID | Feature | Description | Demand | Phase |
|----|---------|-------------|--------|-------|
| F2.1 | **Appointment Booking** | Customer says "จองคิว" → AI shows slots → confirms. Per-staff scheduling | 49% | Beta |
| F2.2 | **Reminders** | 24hr + 2hr before appointment via LINE. Customizable timing | 55% | Beta |
| F2.3 | **No-Show Reduction** | Confirmation required 24hr before. Auto-cancel + waitlist backfill | 35% | Beta |
| F2.4 | **Deposit Collection** | PromptPay QR for deposit at booking time. Reduces no-shows 50%+ | 30% | Beta |
| F2.5 | **Rescheduling Flow** | Customer requests change → AI offers alternative slots → confirms | 42% | Beta |
| F2.6 | **Staff Calendar Sync** | Google Calendar two-way sync per staff member | 38% | V1 |
| F2.7 | **Table Reservation** | Restaurant-specific: party size, time, special requests, seating preference | 34% | V1 |
| F2.8 | **Class Enrollment** | Tutor-specific: course selection, capacity limits, waitlist, semester tracking | 38% | V1 |
| F2.9 | **Queue Management** | Walk-in businesses: real-time queue status, estimated wait time via LINE | 15% | V2 |

### F3 — AI Payments (เก็บเงิน)

> "เตือนเก็บเงิน ไม่ต้องตามเอง"

| ID | Feature | Description | Demand | Phase |
|----|---------|-------------|--------|-------|
| F3.1 | **PromptPay QR Generation** | Auto-generate payment QR per transaction. One-tap from mobile | 78% | Beta |
| F3.2 | **Payment Reminders** | Auto-send "ถึงกำหนดจ่ายค่าเรียนแล้วค่ะ" with QR. 3-day, 1-day, overdue | 78% | Beta |
| F3.3 | **Payment Tracking** | Dashboard: who paid, who hasn't, overdue list. Manual cash logging | 60% | Beta |
| F3.4 | **Stripe Integration** | Credit/debit card for higher-value transactions | 20% | V1 |
| F3.5 | **Subscription Billing** | Recurring monthly charges for memberships, courses, meal plans | 15% | V1 |
| F3.6 | **Invoice Generation** | Auto-invoice with VAT calculation, downloadable PDF | 18% | V2 |

### F4 — AI Orders (รับออเดอร์)

> "รับออเดอร์ผ่าน LINE ไม่ต้องผ่าน Grab"

| ID | Feature | Description | Demand | Phase |
|----|---------|-------------|--------|-------|
| F4.1 | **Menu/Catalog Builder** | Visual menu with photos, prices, options (size, toppings, customization) | 52% | V1 |
| F4.2 | **Order Taking via Chat** | Customer orders through LINE conversation → structured order created | 31% | V1 |
| F4.3 | **Order Confirmation** | Summary → payment QR → confirmation. All in LINE chat flow | 31% | V1 |
| F4.4 | **Inventory Sync** | Real-time stock. "หมดแล้ว" reflected instantly across all channels | 48% | V1 |
| F4.5 | **Pre-Order** | Accept orders for future date/time. Bakery cakes, catering, meal prep | 28% | V1 |
| F4.6 | **Delivery Coordination** | Lalamove/own-rider integration for last-mile | 15% | V2 |
| F4.7 | **Multi-Platform Sync** | Sync orders across LINE, Shopee, Lazada, Facebook in one dashboard | 43% | V2 |
| F4.8 | **Commission Arbitrage** | Move GrabFood customers to LINE direct. Save 25-30% commission | 38% | V2 |

### F5 — AI Growth (โตไว)

> "เปลี่ยนคนทักเป็นลูกค้า"

| ID | Feature | Description | Demand | Phase |
|----|---------|-------------|--------|-------|
| F5.1 | **Messages Handled Dashboard** | "AI ตอบ 147 ข้อความวันนี้ ประหยัด 4 ชม." — drives free→paid conversion | 60% | Alpha |
| F5.2 | **Inquiry Analytics** | What customers ask most, peak times, response rate, satisfaction | 35% | Beta |
| F5.3 | **Lead Capture** | New inquiry → collect name, need, budget → CRM | 28% | V1 |
| F5.4 | **Follow-Up Sequences** | Auto follow-up: Day 1 → Day 3 → Day 7 for unconverted leads | 22% | V1 |
| F5.5 | **Customer Memory** | Remember preferences, past orders, allergies, sizing per customer | 38% | V1 |
| F5.6 | **Broadcast Messaging** | Promotions, menu updates, class schedules to segmented customer lists | 48% | V1 |
| F5.7 | **Conversion Tracking** | Inquiry → booking/purchase funnel with drop-off analysis | 18% | V2 |
| F5.8 | **Review/Reputation** | Post-service feedback collection, Google review nudge | 12% | V2 |

### F6 — Platform (แพลตฟอร์ม)

> "ใช้ง่าย ไม่ต้อง code"

| ID | Feature | Description | Demand | Phase |
|----|---------|-------------|--------|-------|
| F6.1 | **LINE OA Integration** | 3-click connect. Include LINE OA creation wizard for those without one | 81% | Alpha |
| F6.2 | **100% Thai UI** | Every screen, button, error message in Thai. Zero English required | 84% | Alpha |
| F6.3 | **Mobile-First** | Full setup and management from phone. No computer needed | 67% | Alpha |
| F6.4 | **PromptPay Billing** | No credit card required. Monthly. Cancel anytime | 41% | Alpha |
| F6.5 | **Facebook Messenger** | Second channel integration. Critical for restaurants (41% asked) | 38% | Beta |
| F6.6 | **Instagram DM** | Third channel. Important for salons and young sellers | 20% | V1 |
| F6.7 | **Shopee Chat** | E-commerce channel. Shopee response-time scoring = urgent need | 43% | V1 |
| F6.8 | **Multi-Location** | Franchise/chain dashboard. Centralized brand control + per-location data | 24% | V1 |
| F6.9 | **Agent Templates** | Pre-built agents: แชทขาย, แอดมินตอบ, จองคิว, รับออเดอร์, เก็บเงิน | 40% | V1 |
| F6.10 | **Custom Agent Builder** | Drag-and-drop visual builder for custom logic and workflows | 15% | V2 |
| F6.11 | **API & Webhooks** | For power users and integrators. REST API + webhook events | 7% | V2 |
| F6.12 | **PDPA Compliance** | Consent management, data residency, audit logs, data export/deletion | 32% | V1 |
| F6.13 | **Template Marketplace** | Community-built agent templates. Revenue share model | 10% | V2 |

---

## Phased Roadmap

### Phase: Alpha (Month 1-2) — "AI ตอบแชทแทน"

**Goal:** Prove that Thai AI auto-reply works and people will pay 499/mo for it.

**Ship:**
- F1.1 FAQ Auto-Reply
- F1.2 Knowledge Base Upload
- F1.3 Human Handoff
- F1.4 Thai Tone (3 presets)
- F1.5 After-Hours Mode
- F1.6 Quick Update
- F5.1 Messages Handled Dashboard
- F6.1 LINE OA Integration
- F6.2 Thai UI
- F6.3 Mobile-First
- F6.4 PromptPay Billing

**Target:** 50 beta users (online sellers + salons)
**Success metric:** 70%+ weekly retention, 30%+ free→paid conversion within 30 days
**Pricing:** Free (500 msgs) + 499 THB/mo (10K msgs)

```
Alpha = 11 features
Cost: ~$0.002/msg (Typhoon self-hosted) to ~$0.01/msg (GPT-4o-mini)
At 499 THB (~$14) for 10K msgs: gross margin 50-85%
```

---

### Phase: Beta (Month 3-4) — "จอง + จ่าย"

**Goal:** Add booking and payments. Unlock salon and tutor segments fully.

**Ship:**
- F2.1-F2.5 Booking system (appointment, reminders, no-show, deposit, reschedule)
- F3.1-F3.3 Payment system (QR, reminders, tracking)
- F5.2 Inquiry Analytics
- F6.5 Facebook Messenger
- F1.7 Compliance Mode
- F1.8 Multilingual (Thai + English)

**Target:** 200 paying users across 4 segments
**Success metric:** MRR 100K+ THB, NPS 40+
**Pricing:** Add 1,990 THB/mo tier (50K msgs + booking + payments)

```
Beta = +11 features (22 total)
Unlocks: salon booking (49% demand), tutor payments (78% demand), restaurant FB (38%)
Revenue unlock: 1,990 tier captures 27% of market
```

---

### Phase: V1 (Month 5-8) — "รับออเดอร์ + โต"

**Goal:** Order taking, growth tools, multi-channel. Platform play.

**Ship:**
- F4.1-F4.5 Order system (catalog, ordering, confirmation, inventory, pre-order)
- F5.3-F5.6 Growth tools (lead capture, follow-up, memory, broadcast)
- F6.6-F6.9 Channels + multi-location + templates
- F2.6-F2.8 Advanced booking (calendar sync, tables, enrollment)
- F3.4-F3.5 Advanced payments (Stripe, subscriptions)
- F6.12 PDPA Compliance

**Target:** 1,000 paying users, 5M+ THB ARR
**Pricing:** Add Enterprise tier 4,990 THB/mo

```
V1 = +20 features (42 total)
Key unlock: Order taking saves restaurants 25-30% GrabFood commission
This is where revenue model shifts from "save time" to "save money"
```

---

### Phase: V2 (Month 9-12) — "แพลตฟอร์ม"

**Goal:** Full platform. Agent builder, marketplace, ASEAN prep.

**Ship:**
- F6.10-F6.11 Custom builder + API
- F6.13 Template Marketplace
- F4.6-F4.8 Delivery, multi-platform sync, commission arbitrage
- F5.7-F5.8 Conversion tracking, reputation
- F2.9 Queue management
- F3.6 Invoicing
- F1.9 AI Personality Clone

**Target:** 3,000 paying users, Thai market leader
**Pricing:** Franchise/Enterprise custom tier 9,900+ THB/mo

```
V2 = +11 features (53 total)
Platform moat: marketplace + community + network effects
ASEAN expansion prep: Vietnam, Indonesia, Philippines
```

---

## Revenue Model by Phase

| Phase | Users | ARPU | MRR | ARR |
|-------|-------|------|-----|-----|
| Alpha (M1-2) | 50 | 400 THB | 20K | 240K |
| Beta (M3-4) | 200 | 700 THB | 140K | 1.7M |
| V1 (M5-8) | 1,000 | 900 THB | 900K | 10.8M |
| V2 (M9-12) | 3,000 | 1,100 THB | 3.3M | 39.6M |

**Year 1 target: 3,000 paying users, ~40M THB ARR (~$1.1M)**

---

## Pricing Tiers (Final)

| Tier | Price | Messages | Features |
|------|-------|----------|----------|
| **Free** | 0 | 500/mo | FAQ auto-reply, 1 channel, basic dashboard |
| **Starter** | 499 THB/mo | 10K/mo | + tone customization, human handoff, quick update |
| **Business** | 1,990 THB/mo | 50K/mo | + booking, payments, analytics, 2 channels, broadcast |
| **Enterprise** | 4,990 THB/mo | 200K/mo | + ordering, multi-location, all channels, PDPA, priority support |
| **Franchise** | Custom | Unlimited | + white-label, franchise dashboard, API, dedicated support |

---

## Industry Templates (V1)

| Template | Thai Name | Primary Persona | Key Agents |
|----------|-----------|-----------------|------------|
| **Chat Seller** | แชทขาย | Online Seller | FAQ + Inventory + Order |
| **Admin Reply** | แอดมินตอบ | All | FAQ + Handoff + After-Hours |
| **Booking Agent** | จองคิว | Salon / Restaurant | Booking + Reminders + No-Show |
| **Order Agent** | รับออเดอร์ | Restaurant / Seller | Menu + Order + Payment |
| **Tutor Admin** | ผู้ช่วยครู | Tutor | Schedule + Payment + Enrollment |
| **Content Agent** | โพสต์คอนเทนต์ | All | Social posts + Product descriptions |

---

## Tech Stack (Proposed)

| Layer | Technology | Why |
|-------|-----------|-----|
| **LLM (Default)** | Typhoon 2 (70B) | Best Thai, open-source, Apache 2.0, self-hostable |
| **LLM (Premium)** | GPT-4o-mini / Claude Haiku | Fallback for complex reasoning, multilingual |
| **Framework** | Next.js + TypeScript | Full-stack, SSR, Thai SEO |
| **Mobile** | PWA (Progressive Web App) | No app store needed, instant access |
| **Database** | PostgreSQL + Prisma | Structured data, scalable |
| **Queue** | BullMQ + Redis | Message processing, rate limiting |
| **Storage** | S3 (AWS Thailand) | Thai data residency, low latency |
| **Channels** | LINE Messaging API, FB Graph API | Official APIs |
| **Payments** | Stripe Thailand (PromptPay) | 1.65% per transaction |
| **Hosting** | AWS Thailand (ap-southeast-7) | Launched Jan 2025, PDPA compliant |
| **Monitoring** | Sentry + Grafana | Error tracking, uptime |

---

*Last updated: March 2026*
*Status: Pre-PRD → Ready for technical spike*
