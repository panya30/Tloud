# Tloud — Unit Economics: 499 THB/mo Starter Tier

> Dashboard-ready cost model for Thai AI chat agent platform
> Focus: Typhoon 2.5 MoE self-hosted vs GPT-4o-mini API
> Date: March 2026 | FX: 1 USD = 36.2 THB

---

## HEADLINE METRICS

```
┌─────────────────────────────────────────────────────────────┐
│  499 THB/mo Starter Plan — 10,000 messages/month            │
│                                                             │
│  Revenue per user:        499 THB ($13.78)                  │
│  All-in cost per user:    58–111 THB ($1.60–$3.06)          │
│  Gross profit per user:   388–441 THB ($10.72–$12.18)       │
│  Gross margin:            78–88%                            │
│                                                             │
│  Breakeven:               52–74 paying users                │
│  (covers infra + 1 engineer)                                │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. MESSAGE PROFILE

| Parameter | Value | Notes |
|-----------|-------|-------|
| Customer input | 80 tokens | Thai question: "ราคาเท่าไหร่คะ" |
| System prompt + RAG context | 500 tokens | Store rules, product data, conversation history |
| **Total input** | **580 tokens** | Per request |
| AI reply output | 150 tokens | Thai response with product info |
| Embedding query | 80 tokens | Vector similarity search |
| **Total tokens/message** | **730 consumed** | Input + output |
| Messages per user/month | 10,000 | Starter tier allocation |
| **Total tokens per user/month** | **7.3M tokens** | 10K msgs x 730 tok |

---

## 2. LLM COST: HEAD-TO-HEAD COMPARISON

### Option A: Typhoon 2.5-30B-A3B MoE (Self-Hosted)

```
Architecture:  30B total params, 3B active per token (MoE)
VRAM needed:   ~17 GB (Q4 quantized) / ~60 GB (FP16)
Sweet spot:    Single L40S (48GB) or single H100 (80GB)
Thai quality:  BEST — purpose-built by SCB 10X for Thai
License:       Apache 2.0 (free for commercial use)
```

| Deployment | GPU | $/hr | Throughput | msgs/hr | Cost/msg | Monthly (24/7) |
|-----------|-----|------|-----------|---------|----------|----------------|
| L40S Q4 (RunPod) | 1x L40S 48GB | $0.79 | ~2,500 tok/s | ~12,300 | **$0.0000642** | $577 |
| H100 FP16 (RunPod) | 1x H100 80GB | $2.69 | ~3,000+ tok/s | ~14,800 | **$0.0001818** | $1,964 |
| L40S Q4 (Lambda) | 1x L40S 48GB | ~$0.69 | ~2,500 tok/s | ~12,300 | **$0.0000561** | $504 |
| T4 Q4 (RunPod) | 1x T4 16GB | $0.20 | ~600 tok/s | ~2,960 | **$0.0000676** | $146 |

**Key insight**: Typhoon 2.5 MoE activates only 3B parameters per token. Despite being a "30B" model, it runs like a 3B model in compute cost. A single L40S handles it comfortably with room to spare.

**Winner: 1x L40S on RunPod at $577/mo**
- Handles ~12,300 msgs/hr = ~8.9M msgs/month (at 100% utilization)
- Realistic capacity (60% utilization): **~5.3M msgs/month**
- Cost per message: **$0.0000642** = **0.00233 THB/message**

### Option B: GPT-4o-mini (API)

```
Provider:     OpenAI API
Input:        $0.15 / 1M tokens
Output:       $0.60 / 1M tokens
Thai quality:  Good (not best, but solid)
Latency:      Fast (~500ms)
```

| Component | Tokens | Rate | Cost/msg |
|-----------|--------|------|----------|
| Input (system + user + RAG) | 580 | $0.15/1M | $0.0000870 |
| Output (AI reply) | 150 | $0.60/1M | $0.0000900 |
| **Total LLM** | 730 | — | **$0.0001770** |

**Cost per message: $0.000177 = 0.00641 THB/message**

### Side-by-Side

```
                        Typhoon 2.5 MoE        GPT-4o-mini
                        (L40S self-hosted)     (API)
─────────────────────── ────────────────────── ──────────────
Cost per message        $0.0000642             $0.000177
Cost per 10K msgs       $0.642                 $1.77
Cost per 100K msgs      $6.42                  $17.70
Monthly fixed cost      $577 (GPU 24/7)        $0
Thai quality            ★★★★★ Best             ★★★☆☆ Good
Latency                 ~300ms (local)         ~500ms (API)
Data sovereignty        Full control           Data leaves TH
Scaling                 Add GPUs               Auto-scales
Min viable volume       ~5.3M msgs/mo          1 message
```

**Crossover point**: Typhoon self-hosted beats GPT-4o-mini API at **~3.3M messages/month** ($577 fixed / ($0.000177 - $0.0000642) difference per msg).

---

## 3. LINE OA API COSTS

### Critical Finding: Reply Messages Are FREE

```
┌─────────────────────────────────────────────────────────────┐
│  LINE Messaging API — Reply messages are NOT counted         │
│  toward the monthly message quota.                           │
│                                                             │
│  Tloud's use case = customer sends message → AI replies     │
│  This is a REPLY, not a push/broadcast.                     │
│                                                             │
│  LINE OA cost for Tloud auto-reply: $0.00 per message       │
└─────────────────────────────────────────────────────────────┘
```

| LINE Message Type | Counted? | Tloud Use Case | Cost |
|------------------|----------|---------------|------|
| **Reply message** (webhook → response) | **NO** | AI auto-reply to customer | **FREE** |
| Push message | YES | Proactive outreach (future feature) | Counted |
| Broadcast message | YES | Marketing blasts (future feature) | Counted |
| Multicast message | YES | Segment targeting (future) | Counted |

**LINE OA Plans (Thailand)**:

| Plan | Monthly Fee | Free Messages* | Extra Message Cost |
|------|-------------|---------------|-------------------|
| Free | 0 THB | 200/mo | N/A (hard limit) |
| Basic | 489 THB/mo | 5,000/mo | N/A (hard limit) |
| Pro | 1,500 THB/mo | 35,000/mo | 0.04 THB/msg extra |

*\*"Messages" = push/broadcast only. Replies are unlimited and free on ALL plans.*

**For Tloud's core use case (auto-reply), the customer's own LINE OA Free plan is sufficient. LINE API cost to Tloud: $0.**

If Tloud later adds proactive messaging (abandoned cart reminders, follow-ups), those would count as push messages and require the customer to have a paid LINE OA plan. This is the customer's cost, not Tloud's.

---

## 4. INFRASTRUCTURE COSTS (AWS ap-southeast-7 Thailand)

### Platform Stack

| Service | Instance/Config | Monthly Cost | Notes |
|---------|----------------|-------------|-------|
| **App Server** (Next.js + API) | EC2 t3.medium (2 vCPU, 4GB) | $34/mo | ~$0.047/hr on-demand; RI = ~$22/mo |
| **Database** | RDS db.t4g.small PostgreSQL | $30/mo | ~$0.042/hr; RI = ~$19/mo |
| **Redis** (cache + queue) | ElastiCache t4g.small | $25/mo | Session, semantic cache, job queue |
| **Vector DB** | Self-hosted Qdrant on app server | $0 | Fits in RAM at SME scale (<100K vectors) |
| **S3** (knowledge base files) | 10 GB storage + requests | $3/mo | Customer product catalogs, PDFs |
| **ALB** (load balancer) | Application Load Balancer | $22/mo | $0.0252/hr + LCU charges |
| **CloudWatch** (monitoring) | Basic metrics + logs | $10/mo | Log retention, alarms |
| **Secrets Manager** | API keys storage | $2/mo | LINE tokens, OpenAI keys |
| **Data Transfer** | ~50 GB/mo outbound | $5/mo | API responses, webhook traffic |
| **Domain + SSL** | Route 53 + ACM | $1/mo | *.tloud.ai |
| **Total Platform** | — | **$132/mo** | With RI: ~$97/mo |

### AWS Thailand Region Notes
- ap-southeast-7 launched January 2025
- Pricing ~5-10% lower than ap-southeast-1 (Singapore) for most services
- Data stays in Thailand (PDPA compliance advantage)
- Not all services available yet; some fall back to Singapore

### Scaling Milestones

| Users | Infra Change | Additional Cost |
|-------|-------------|----------------|
| 0-100 | Base stack above | $132/mo |
| 100-500 | Upgrade to t3.large, add read replica | +$60/mo = $192/mo |
| 500-1,000 | m6i.large, Multi-AZ RDS, 2 app servers | +$120/mo = $312/mo |
| 1,000-5,000 | ECS Fargate cluster, Aurora Serverless | +$300/mo = $612/mo |
| 5,000+ | EKS, dedicated GPU instance, CDN | ~$1,500+/mo |

---

## 5. SUPPORT & OPERATIONS COSTS

| Cost Category | Monthly | Per-User (at 200 users) | Notes |
|--------------|---------|------------------------|-------|
| **Customer support** (1 Thai CS rep) | $460 (15K THB) | $2.30 | LINE/Facebook support, onboarding |
| **Monitoring & on-call** (part of eng) | $0 incremental | — | Engineer rotation |
| **Payment processing** (PromptPay) | 1.65% of revenue | $0.23/user | Via Stripe Thailand |
| **Payment processing** (Credit card) | 3.65% of revenue | $0.50/user | Stripe CC rate |
| **LINE Developer account** | Free | $0 | Messaging API is free tier |
| **OpenAI API account** | Pay-as-you-go | — | Included in LLM costs above |
| **Domain & email** | $15/mo | — | Google Workspace 1 user |
| **Total ops overhead** | ~$490/mo | ~$2.45/user | At 200 paying users |

---

## 6. FULL UNIT ECONOMICS: 499 THB STARTER

### Scenario A: GPT-4o-mini API (Recommended for Alpha/Beta)

```
Revenue & Costs per User per Month (at 200 paying users)
═══════════════════════════════════════════════════════════

Revenue                                    499 THB  ($13.78)
─────────────────────────────────────────────────────────────
COGS:
  LLM cost (10K msgs x $0.000177)         -64 THB  (-$1.77)
  Embedding cost (10K queries)              -1 THB  (-$0.02)
  LINE API cost                              0 THB  ($0.00) ← FREE replies
  Infra share ($132 ÷ 200 users)           -24 THB  (-$0.66)
  Payment processing (PromptPay 1.65%)      -8 THB  (-$0.23)
─────────────────────────────────────────────────────────────
Total COGS                                 -97 THB  (-$2.68)
═══════════════════════════════════════════════════════════════
GROSS PROFIT                               402 THB  ($11.10)
GROSS MARGIN                               80.6%
═══════════════════════════════════════════════════════════════

Below-the-line (amortized):
  Support share ($460 ÷ 200)               -83 THB  (-$2.30)
  Ops overhead share                       -27 THB  (-$0.75)
─────────────────────────────────────────────────────────────
CONTRIBUTION MARGIN                        292 THB  ($8.05)
CONTRIBUTION MARGIN %                      58.5%
```

### Scenario B: Typhoon 2.5 MoE Self-Hosted (When Volume Justifies)

```
Revenue & Costs per User per Month (at 200 paying users, 2M msgs total)
═══════════════════════════════════════════════════════════════

Revenue                                    499 THB  ($13.78)
─────────────────────────────────────────────────────────────
COGS:
  LLM cost (10K msgs x $0.0000642)        -23 THB  (-$0.64)
  GPU fixed cost share ($577 ÷ 200)       -104 THB  (-$2.89)*
  Embedding cost                            -1 THB  (-$0.02)
  LINE API cost                              0 THB  ($0.00)
  Infra share ($132 ÷ 200)                -24 THB  (-$0.66)
  Payment processing (1.65%)                -8 THB  (-$0.23)
─────────────────────────────────────────────────────────────
Total COGS                                -160 THB  (-$4.44)
═══════════════════════════════════════════════════════════════
GROSS PROFIT                               339 THB  ($9.34)
GROSS MARGIN                               67.9%
═══════════════════════════════════════════════════════════════

* GPU cost amortized across 200 users = $2.89/user
  At 500 users: $577/500 = $1.15/user → margin rises to 77%
  At 1,000 users: $577/1000 = $0.58/user → margin rises to 82%
```

### Scenario Comparison Matrix

```
                            GPT-4o-mini    Typhoon 2.5 MoE   Typhoon 2.5 MoE
                            (API)          (200 users)        (1,000 users)
────────────────────────── ────────────── ───────────────── ─────────────────
LLM cost / 10K msgs        $1.77          $0.64              $0.64
Fixed GPU cost / user       $0.00          $2.89              $0.58
Total AI cost / user        $1.77          $3.53              $1.22
Gross margin                80.6%          67.9%              82.3%
Thai quality                ★★★☆☆          ★★★★★              ★★★★★
Data sovereignty            No             Yes                Yes
Scales with 0 users?        Yes            No (fixed cost)    No
```

**Verdict**: Start with GPT-4o-mini API. Switch to Typhoon 2.5 MoE when you reach ~500+ paying users (where self-hosted margin matches or exceeds API margin AND you get superior Thai quality + data sovereignty).

---

## 7. BREAKEVEN ANALYSIS

### Fixed Monthly Costs (Pre-Revenue)

| Category | Cost | Notes |
|----------|------|-------|
| AWS Infrastructure | $132/mo (4,779 THB) | Base platform stack |
| 1 Full-stack Engineer | $1,840/mo (60,000 THB) | Bangkok market rate |
| Support (part-time) | $230/mo (7,500 THB) | Half of 1 CS rep |
| Marketing/Growth | $300/mo (10,000 THB) | Facebook ads, content |
| Tools & SaaS | $50/mo (1,800 THB) | GitHub, monitoring, etc. |
| **Total Fixed** | **$2,552/mo (84,079 THB)** | Lean startup mode |

### Breakeven Calculations

```
Using GPT-4o-mini (API):
  Contribution per paying user = 292 THB/mo ($8.05)
  Fixed costs = 84,079 THB/mo

  Breakeven = 84,079 ÷ 292 = 288 paying users
                                ≈ 52 paying users (if 1 eng only, no mkt)
                                ≈ 74 paying users (lean: 1 eng + minimal ops)

With Free tier drag (assume 60% free, 40% paying):
  Need 288 paying users = 720 total users (288 paying + 432 free)
  Free tier cost: 432 users x 500 msgs x $0.000177 = $38/mo (negligible)

Full team breakeven (3 eng + 1 CS + marketing):
  Fixed costs = ~$7,500/mo (245,000 THB)
  Breakeven = 245,000 ÷ 292 = 839 paying users
  Total with free: ~2,100 users (839 paying + 1,261 free)
```

### Revenue Trajectory

| Milestone | Paying Users | MRR (THB) | MRR (USD) | Status |
|-----------|-------------|-----------|-----------|--------|
| Launch | 0 | 0 | 0 | Investing |
| Month 3 | 50 | 24,950 | $689 | Covering infra |
| Month 6 | 150 | 74,850 | $2,068 | Covering infra + 1 eng |
| Month 9 | 300 | 149,700 | $4,135 | **Lean breakeven** |
| Month 12 | 500 | 249,500 | $6,892 | Profitable, hire #2 eng |
| Month 18 | 1,000 | 499,000 | $13,785 | **Full team breakeven** |
| Month 24 | 2,500 | 1,247,500 | $34,461 | Scale mode |

---

## 8. SENSITIVITY ANALYSIS

### What If Users Send More Messages?

| Actual msgs/user | LLM Cost (4o-mini) | Gross Margin | Risk |
|-----------------|-------------------|-------------|------|
| 5,000 (under) | $0.89 | 85% | Low usage = happy margins |
| 10,000 (plan) | $1.77 | 81% | Baseline |
| 15,000 (over) | $2.66 | 77% | Acceptable |
| 20,000 (2x) | $3.54 | 72% | Still profitable |
| 50,000 (5x) | $8.85 | 50% | Need overage charges or upgrade |

**Recommendation**: Soft limit at 10K, allow burst to 15K, nudge upgrade at 12K+.

### What If LLM Prices Change?

| Scenario | Impact on 499 THB tier |
|----------|----------------------|
| GPT-4o-mini drops 50% (to $0.075/$0.30) | Margin improves to 85% |
| GPT-4o-mini doubles (unlikely) | Margin drops to 72% (still viable) |
| Typhoon 2.5 API launches at $0.10/1M | Cost/10K msgs = $0.73 → 86% margin |
| GPU prices drop 30% (trend) | Self-hosted breakeven drops to ~350 users |

### What If Thai Tokenization Is Worse?

Thai can use 1.5-2x more tokens than English in some tokenizers.

| Token multiplier | Tokens/msg | LLM cost/10K msgs | Margin |
|-----------------|-----------|-------------------|--------|
| 1.0x (baseline) | 730 | $1.77 | 81% |
| 1.3x (moderate) | 949 | $2.30 | 78% |
| 1.5x (worst case) | 1,095 | $2.66 | 76% |
| 2.0x (extreme) | 1,460 | $3.54 | 72% |

Even at 2x tokenization overhead, the 499 THB plan remains profitable at 72% gross margin.

---

## 9. DASHBOARD DATA (JSON)

```json
{
  "plan": {
    "name": "Starter",
    "price_thb": 499,
    "price_usd": 13.78,
    "messages_included": 10000,
    "fx_rate": 36.2
  },
  "cost_per_message": {
    "gpt4o_mini_api": {
      "input_cost": 0.0000870,
      "output_cost": 0.0000900,
      "total_llm": 0.0001770,
      "embedding": 0.0000016,
      "line_api": 0.0000000,
      "total": 0.0001786,
      "currency": "USD"
    },
    "typhoon_25_moe_selfhosted": {
      "marginal_cost": 0.0000642,
      "embedding": 0.0000016,
      "line_api": 0.0000000,
      "total_marginal": 0.0000658,
      "fixed_gpu_monthly": 577,
      "currency": "USD"
    }
  },
  "unit_economics_per_user": {
    "gpt4o_mini": {
      "revenue_usd": 13.78,
      "llm_cost": 1.77,
      "embedding_cost": 0.02,
      "line_cost": 0.00,
      "infra_share_200u": 0.66,
      "payment_processing": 0.23,
      "total_cogs": 2.68,
      "gross_profit": 11.10,
      "gross_margin_pct": 80.6
    },
    "typhoon_moe_200_users": {
      "revenue_usd": 13.78,
      "llm_cost": 0.64,
      "gpu_share": 2.89,
      "embedding_cost": 0.02,
      "line_cost": 0.00,
      "infra_share": 0.66,
      "payment_processing": 0.23,
      "total_cogs": 4.44,
      "gross_profit": 9.34,
      "gross_margin_pct": 67.9
    },
    "typhoon_moe_1000_users": {
      "revenue_usd": 13.78,
      "llm_cost": 0.64,
      "gpu_share": 0.58,
      "embedding_cost": 0.02,
      "line_cost": 0.00,
      "infra_share": 0.13,
      "payment_processing": 0.23,
      "total_cogs": 1.60,
      "gross_profit": 12.18,
      "gross_margin_pct": 88.4
    }
  },
  "breakeven": {
    "lean_1_engineer": {
      "fixed_monthly_thb": 84079,
      "contribution_per_user_thb": 292,
      "paying_users_needed": 288,
      "total_users_with_free": 720
    },
    "full_team": {
      "fixed_monthly_thb": 245000,
      "contribution_per_user_thb": 292,
      "paying_users_needed": 839,
      "total_users_with_free": 2100
    }
  },
  "infrastructure": {
    "aws_region": "ap-southeast-7",
    "monthly_base": 132,
    "components": {
      "ec2_app": 34,
      "rds_postgres": 30,
      "elasticache_redis": 25,
      "alb": 22,
      "cloudwatch": 10,
      "s3": 3,
      "secrets_manager": 2,
      "data_transfer": 5,
      "route53": 1
    },
    "currency": "USD"
  },
  "line_oa": {
    "reply_messages_cost": 0,
    "reply_messages_note": "Reply messages via webhook are FREE and unlimited on all LINE OA plans",
    "push_message_cost_thb": 0.04,
    "push_message_note": "Only applies to proactive outreach (future feature)"
  },
  "model_comparison": {
    "recommended_alpha": "gpt4o_mini",
    "recommended_scale": "typhoon_25_moe",
    "crossover_monthly_messages": 3300000,
    "crossover_paying_users": 330
  },
  "optimization_potential": {
    "cache_hit_rate": 0.40,
    "optimized_cost_per_msg": 0.0000500,
    "optimized_margin_pct": 88
  }
}
```

---

## 10. KEY TAKEAWAYS

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. LINE REPLY MESSAGES ARE FREE                            │
│     → Tloud's core auto-reply use case costs $0 on LINE    │
│     → Massive advantage vs platforms needing push messages  │
│                                                             │
│  2. 499 THB IS VERY VIABLE                                  │
│     → 80.6% gross margin with GPT-4o-mini                  │
│     → Even at 2x token inflation: still 72% margin         │
│     → Thai SME saves 90% vs hiring admin (15K THB/mo)      │
│                                                             │
│  3. TYPHOON 2.5 MoE IS THE LONG GAME                       │
│     → 30B model that runs like 3B (MoE magic)              │
│     → Best Thai quality + data sovereignty                  │
│     → Wins at 500+ paying users ($577/mo fixed GPU)        │
│     → At 1,000 users: 88% margin (beats API)               │
│                                                             │
│  4. START API, SWITCH TO SELF-HOSTED                        │
│     → Alpha: GPT-4o-mini ($0 fixed, scale from 1 user)     │
│     → 500 users: Add Typhoon self-hosted                    │
│     → 1,000+ users: Typhoon primary, API fallback          │
│                                                             │
│  5. BREAKEVEN IS ACHIEVABLE                                 │
│     → 74 paying users (lean mode, 1 engineer)              │
│     → 839 paying users (full team of 5)                    │
│     → Thai SME market: 3.26M businesses to target          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Sources

- [Typhoon 2.5 Release — MoE Architecture & Performance](https://opentyphoon.ai/blog/en/typhoon2-5-release)
- [Typhoon 2 API Pro — Pricing & Access](https://opentyphoon.ai/blog/en/introducing-typhoon-2-api-pro-accessible-production-grade-thai-llms-3e139c077aab)
- [GPT-4o-mini Pricing March 2026](https://pricepertoken.com/pricing-page/model/openai-gpt-4o-mini)
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)
- [LINE Messaging API Pricing — Reply Messages Free](https://developers.line.biz/en/docs/messaging-api/pricing/)
- [LINE OA Thailand Pricing Plans](https://blog.cresclab.com/th/line-oa-price)
- [LINE OA Thailand Features & Costs](https://www.tumwebsme.com/en/customer/blog/line-official-account-pricing-costs-sme)
- [AWS Thailand Region (ap-southeast-7)](https://iconext.co.th/2025/04/08/aws-thailand-region/)
- [EC2 On-Demand Pricing](https://aws.amazon.com/ec2/pricing/on-demand/)
- [RDS PostgreSQL Pricing](https://aws.amazon.com/rds/postgresql/pricing/)
- [RunPod GPU Pricing](https://www.runpod.io/pricing)
- [Lambda GPU Pricing](https://lambda.ai/pricing)
- [GPU Cloud Pricing Comparison 2026](https://www.spheron.network/blog/gpu-cloud-pricing-comparison-2026/)
- [vLLM v0.6.0 Performance Benchmarks](https://blog.vllm.ai/2024/09/05/perf-update.html)
- [Qwen3-30B-A3B MoE GPU Requirements](https://apxml.com/models/qwen3-30b-a3b) (comparable MoE architecture reference)
- [Stripe Thailand — PromptPay Fees](https://stripe.com/th/pricing)
