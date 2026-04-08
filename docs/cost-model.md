# Tloud — AI Cost Model & Unit Economics

> Per-message cost analysis for Thai SME AI chat agent platform
> Exchange rate: 1 USD = 32.6 THB (March 2026)

---

## 1. Message Profile Assumptions

A typical Thai customer service exchange:

| Parameter | Value | Notes |
|-----------|-------|-------|
| Input tokens (customer question) | 80 tokens | "ราคาเท่าไหร่คะ สินค้ารุ่นนี้ยังมีของไหม" |
| System prompt + RAG context | 500 tokens | Product catalog snippet, store rules, conversation history |
| **Total input per request** | **580 tokens** | Customer + system + RAG context |
| Output tokens (AI reply) | 150 tokens | "สินค้ารุ่น X ราคา 1,290 บาทค่ะ ตอนนี้มีของพร้อมส่งเลยนะคะ..." |
| Embedding lookup (query) | 80 tokens | Customer message → vector search |

---

## 2. LLM API Pricing Comparison (March 2026)

### Current API Models

| Model | Input $/1M tok | Output $/1M tok | Cost per Message* | Thai Quality | Latency | Notes |
|-------|---------------|-----------------|-------------------|-------------|---------|-------|
| **GPT-4.1 Nano** | $0.05 | $0.20 | **$0.000059** | Good | Very Fast | Cheapest API option, surprisingly capable |
| **GPT-4o-mini** | $0.15 | $0.60 | **$0.000177** | Good | Fast | Proven reliability |
| **GPT-4.1 Mini** | $0.40 | $1.60 | **$0.000472** | Very Good | Fast | Better reasoning than 4o-mini |
| **Gemini 2.5 Flash** | $0.30 | $2.50 | **$0.000549** | Good | Fast | Best Google option, 2.0 Flash Lite deprecated June 2026 |
| **DeepSeek V3** | $0.28 | $0.42 | **$0.000226** | OK-Good | Fast | Cache hits drop input to $0.028/M (10x cheaper) |
| **Claude Haiku 4.5** | $1.00 | $5.00 | **$0.001330** | Very Good | Fast | Highest quality in class, but expensive |
| **Llama 3.3 70B (Together.ai)** | $0.88 | $0.88 | **$0.000643** | OK | Fast | Open-source via API |
| **Llama 4 Maverick (Together.ai)** | $0.27 | $0.27 | **$0.000197** | Good | Fast | Newer, cheaper alternative |

*\*Cost per message = (580 input tokens x input rate) + (150 output tokens x output rate)*

### Embedding Cost (RAG Lookup)

| Model | $/1M tokens | Cost per Query (80 tok) | Notes |
|-------|-------------|------------------------|-------|
| text-embedding-3-small | $0.02 | $0.0000016 | Negligible cost |
| text-embedding-3-large | $0.13 | $0.0000104 | Higher quality, still negligible |

**Embedding cost is effectively zero** — $0.02/M tokens means $0.002 per 100K queries.

### Vector Database Cost (per query)

| Service | Monthly Cost | Cost per Query (at 500K queries/mo) |
|---------|-------------|-------------------------------------|
| Pinecone Standard (1M vectors) | ~$70/mo | $0.00014 |
| Qdrant Cloud (1M vectors) | ~$45/mo | $0.00009 |
| Self-hosted Qdrant (on app server) | ~$0/mo incremental | ~$0 |

**Recommendation for MVP**: Self-host Qdrant/ChromaDB on the same server. At Tloud's scale, vectors fit in RAM.

---

## 3. Self-Hosting Cost Analysis

### GPU Options & Pricing (On-Demand, March 2026)

| GPU | VRAM | RunPod $/hr | Lambda $/hr | GCP $/hr | Best For |
|-----|------|-------------|-------------|----------|----------|
| **T4** | 16GB | $0.20 | — | $0.35 | 8B models (quantized) |
| **L40S** | 48GB | $0.79 | — | ~$1.50 | 8B models (full), 70B (quantized) |
| **A100 40GB** | 40GB | $1.19 | $1.29 | $3.67 | 8B (high throughput), 70B needs 2+ |
| **A100 80GB** | 80GB | $1.39 | — | ~$4.00 | 70B (quantized, 1 GPU) |
| **H100 SXM** | 80GB | $2.69 | $3.29 | ~$4.50 | 70B (high throughput) |

### Throughput Estimates (vLLM/SGLang, continuous batching)

| Setup | Model | Throughput (tok/s) | Messages/hr* | Concurrent Users |
|-------|-------|-------------------|-------------|-----------------|
| 1x T4 | Typhoon 8B (Q4) | ~400 | ~1,960 | ~30 |
| 1x L40S | Typhoon 8B (FP16) | ~1,800 | ~8,820 | ~130 |
| 1x A100 40GB | Typhoon 8B (FP16) | ~2,500 | ~12,250 | ~180 |
| 2x A100 80GB | Typhoon 70B (FP16) | ~800 | ~3,920 | ~60 |
| 1x H100 | Typhoon 70B (Q8) | ~1,200 | ~5,880 | ~90 |
| 2x H100 | Typhoon 70B (FP16) | ~3,000 | ~14,700 | ~220 |

*\*Messages/hr = throughput(tok/s) x 3600 / (580 input + 150 output tokens per message). Assumes batched inference.*

### Self-Hosted Cost per Message

| Setup | GPU Cost/hr | Messages/hr | **Cost/Message** | Monthly Cost (24/7) |
|-------|-------------|-------------|-----------------|---------------------|
| 1x T4 (RunPod) — 8B | $0.20 | 1,960 | **$0.000102** | $146 |
| 1x L40S (RunPod) — 8B | $0.79 | 8,820 | **$0.000090** | $575 |
| 1x A100 (RunPod) — 8B | $1.19 | 12,250 | **$0.000097** | $868 |
| 2x A100 (RunPod) — 70B | $2.38 | 3,920 | **$0.000607** | $1,736 |
| 1x H100 (RunPod) — 70B Q8 | $2.69 | 5,880 | **$0.000457** | $1,963 |
| 2x H100 (RunPod) — 70B | $5.38 | 14,700 | **$0.000366** | $3,927 |

### Key Insight: Self-Hosted vs API Breakeven

| Model Class | API Cost/msg | Self-Hosted Cost/msg | API Monthly (500K msgs) | Self-Hosted Monthly | Breakeven |
|-------------|-------------|---------------------|------------------------|--------------------|-----------|
| 8B class (vs GPT-4.1 Nano) | $0.000059 | $0.000090 (L40S) | $29.50 | $575 | **API wins until ~10M msgs/mo** |
| 8B class (vs GPT-4o-mini) | $0.000177 | $0.000090 (L40S) | $88.50 | $575 | **~6.5M msgs/mo** |
| 70B class (vs Claude Haiku) | $0.001330 | $0.000366 (2xH100) | $665 | $3,927 | **~3.3M msgs/mo** |

**Verdict**: For Alpha/Beta, API is overwhelmingly cheaper. Self-hosting only makes sense at 5M+ messages/month, OR when Thai quality from Typhoon is a must-have differentiator.

---

## 4. Total Cost per Message (All-In)

Including LLM + embedding + vector DB + infrastructure overhead:

| Component | Cost per Message | % of Total |
|-----------|-----------------|-----------|
| LLM inference (GPT-4.1 Nano) | $0.000059 | 65% |
| Embedding query | $0.000002 | 2% |
| Vector DB query | $0.000005 | 6% |
| Platform infra (server, DB, queue)* | $0.000025 | 27% |
| **Total (cheapest API)** | **$0.000091** | 100% |

| Component | Cost per Message | % of Total |
|-----------|-----------------|-----------|
| LLM inference (GPT-4o-mini) | $0.000177 | 79% |
| Embedding query | $0.000002 | 1% |
| Vector DB query | $0.000005 | 2% |
| Platform infra | $0.000040 | 18% |
| **Total (balanced API)** | **$0.000224** | 100% |

| Component | Cost per Message | % of Total |
|-----------|-----------------|-----------|
| LLM inference (Claude Haiku 4.5) | $0.001330 | 95% |
| Embedding query | $0.000002 | <1% |
| Vector DB query | $0.000005 | <1% |
| Platform infra | $0.000040 | 3% |
| **Total (premium API)** | **$0.001377** | 100% |

*\*Platform infra: $200/mo base (app server, DB, Redis, queue) amortized over estimated monthly messages.*

---

## 5. Unit Economics by Tier

### Scenario A: GPT-4.1 Nano (Cheapest — Recommended for Alpha)

| Tier | Price (THB) | Price (USD) | Messages/mo | AI Cost (USD) | Infra Share | **Gross Margin** |
|------|-------------|-------------|-------------|---------------|------------|-----------------|
| **Free** | 0 | $0 | 500 | $0.05 | $0.50 | **-$0.55 (loss leader)** |
| **Starter** | 499 | $15.31 | 10,000 | $0.91 | $2.00 | **$12.40 (81%)** |
| **Business** | 1,990 | $61.04 | 50,000 | $4.55 | $5.00 | **$51.49 (84%)** |
| **Enterprise** | 4,990 | $153.07 | 200,000 | $18.20 | $10.00 | **$124.87 (82%)** |

### Scenario B: GPT-4o-mini (Balanced — Recommended for Production)

| Tier | Price (THB) | Price (USD) | Messages/mo | AI Cost (USD) | Infra Share | **Gross Margin** |
|------|-------------|-------------|-------------|---------------|------------|-----------------|
| **Free** | 0 | $0 | 500 | $0.11 | $0.50 | **-$0.61 (loss leader)** |
| **Starter** | 499 | $15.31 | 10,000 | $2.24 | $2.00 | **$11.07 (72%)** |
| **Business** | 1,990 | $61.04 | 50,000 | $11.20 | $5.00 | **$44.84 (73%)** |
| **Enterprise** | 4,990 | $153.07 | 200,000 | $44.80 | $10.00 | **$98.27 (64%)** |

### Scenario C: Claude Haiku 4.5 (Premium Quality)

| Tier | Price (THB) | Price (USD) | Messages/mo | AI Cost (USD) | Infra Share | **Gross Margin** |
|------|-------------|-------------|-------------|---------------|------------|-----------------|
| **Free** | 0 | $0 | 500 | $0.69 | $0.50 | **-$1.19 (loss leader)** |
| **Starter** | 499 | $15.31 | 10,000 | $13.77 | $2.00 | **-$0.46 (NEGATIVE)** |
| **Business** | 1,990 | $61.04 | 50,000 | $68.85 | $5.00 | **-$12.81 (NEGATIVE)** |
| **Enterprise** | 4,990 | $153.07 | 200,000 | $275.40 | $10.00 | **-$132.33 (NEGATIVE)** |

> Claude Haiku 4.5 is NOT viable at Thai SME pricing. It would require 3-4x higher prices.

### Scenario D: Self-Hosted Typhoon 8B on L40S (Best Thai Quality/Cost)

| Tier | Price (THB) | Price (USD) | Messages/mo | AI Cost (USD)* | Infra Share | **Gross Margin** |
|------|-------------|-------------|-------------|---------------|------------|-----------------|
| **Free** | 0 | $0 | 500 | $0.05 | $0.50 | **-$0.55** |
| **Starter** | 499 | $15.31 | 10,000 | $0.90 | $2.00 | **$12.41 (81%)** |
| **Business** | 1,990 | $61.04 | 50,000 | $4.50 | $5.00 | **$51.54 (84%)** |
| **Enterprise** | 4,990 | $153.07 | 200,000 | $18.00 | $10.00 | **$125.07 (82%)** |

*\*But requires $575/mo minimum GPU commitment (L40S 24/7). Only profitable with 6M+ messages/mo across all customers combined, or use spot/serverless GPUs.*

---

## 6. Aggregate Economics (Platform-Level)

### Year 1 Projection: 500 customers

| Customer Mix | Count | Messages/mo (total) | Revenue/mo | AI Cost/mo | Gross Profit/mo |
|-------------|-------|--------------------|-----------|-----------| ---------------|
| Free | 300 | 150,000 | $0 | $34 | -$34 |
| Starter | 120 | 1,200,000 | $1,837 | $269 | $1,568 |
| Business | 60 | 3,000,000 | $3,662 | $672 | $2,990 |
| Enterprise | 20 | 4,000,000 | $3,061 | $896 | $2,165 |
| **Total** | **500** | **8,350,000** | **$8,560/mo** | **$1,871/mo** | **$6,689/mo (78%)** |

*Using GPT-4o-mini pricing. Annual: $102K revenue, $22K AI cost, $80K gross profit.*

### Year 1 — Full P&L View

| Line Item | Monthly | Annual |
|-----------|---------|--------|
| Revenue | $8,560 | $102,720 |
| AI/LLM costs | -$1,871 | -$22,452 |
| Platform infra (servers, DB) | -$500 | -$6,000 |
| **Gross Profit** | **$6,189** | **$74,268 (72%)** |
| Team (3 engineers, 1 community) | -$7,000 | -$84,000 |
| Marketing/growth | -$2,000 | -$24,000 |
| **Net** | **-$2,811** | **-$33,732** |

Breakeven at ~800 paying customers (or raise Enterprise to 9,900 THB as in concept doc).

---

## 7. Cost Optimization Strategies

### Strategy 1: Response Caching (30-50% cost reduction)

Thai customer service is highly repetitive. Cache exact and semantic matches:

| Type | Method | Hit Rate (est.) | Cost Savings |
|------|--------|-----------------|-------------|
| Exact match | Hash customer message → cached response | 10-15% | Skip LLM entirely |
| Semantic cache | Embedding similarity > 0.95 → cached response | 20-30% | Skip LLM entirely |
| Template match | FAQ keyword detection → template response | 10-15% | Skip LLM entirely |
| **Combined** | All layers | **40-50%** | **40-50% LLM cost reduction** |

**Implementation**: Redis + embedding index. Cost: ~$0/mo incremental.

**With 40% cache hit rate, effective cost per message drops from $0.000224 to ~$0.000135.**

### Strategy 2: Model Routing (Smart Tier System)

Route messages to the cheapest model that can handle them:

| Message Type | % of Traffic | Route To | Cost/msg |
|-------------|-------------|----------|----------|
| Simple FAQ ("ราคาเท่าไหร่", "เปิดกี่โมง") | 40% | Cache/template (no LLM) | ~$0 |
| Standard inquiry (product details, shipping) | 35% | GPT-4.1 Nano | $0.000059 |
| Complex (complaints, negotiations, multi-turn) | 20% | GPT-4o-mini | $0.000177 |
| Needs native Thai nuance | 5% | Typhoon 8B or GPT-4.1 Mini | $0.000090-$0.000472 |
| **Blended average** | 100% | — | **~$0.000055** |

This brings effective cost to **$0.055 per 1,000 messages** or **$0.55 per 10,000 messages**.

### Strategy 3: Prompt Optimization

| Technique | Savings | How |
|-----------|---------|-----|
| Shorter system prompts | 15-20% input tokens | Compress instructions, use Thai shorthand |
| Structured output (JSON) | 10-15% output tokens | Force concise responses |
| Few-shot → zero-shot | 30-40% input tokens | Use fine-tuned model instead of examples in prompt |
| Context window management | 20-30% input tokens | Only inject relevant RAG chunks, not full catalog |

### Strategy 4: Batch & Off-Peak Processing

| Feature | Savings | When |
|---------|---------|------|
| OpenAI Batch API | 50% discount | Non-real-time tasks (reports, summaries) |
| DeepSeek cache hits | 90% input discount | Repeated system prompts |
| Anthropic prompt caching | Up to 90% | Repeated long contexts |
| Off-peak GPU pricing (RunPod spot) | 30-60% | Background fine-tuning, batch embeddings |

---

## 8. Optimized Unit Economics (With All Strategies Applied)

Assuming: 40% cache hits + model routing + prompt optimization = **~$0.000050 effective cost/message**

| Tier | Price (THB) | Price (USD) | Messages/mo | Effective AI Cost | **Gross Margin** |
|------|-------------|-------------|-------------|-------------------|-----------------|
| **Free** | 0 | $0 | 500 | $0.03 | **-$0.53** |
| **Starter** | 499 | $15.31 | 10,000 | $0.50 | **$12.81 (84%)** |
| **Business** | 1,990 | $61.04 | 50,000 | $2.50 | **$53.54 (88%)** |
| **Enterprise** | 4,990 | $153.07 | 200,000 | $10.00 | **$133.07 (87%)** |

> With optimization, AI cost becomes nearly negligible. The margins approach traditional SaaS levels (80-90%).

---

## 9. Recommendations

### Alpha Launch (Months 1-3)

| Decision | Recommendation | Rationale |
|----------|---------------|-----------|
| **Primary LLM** | GPT-4.1 Nano | $0.000059/msg, good Thai quality, fastest iteration |
| **Fallback LLM** | GPT-4o-mini | Proven reliability, slightly better quality |
| **Embedding** | text-embedding-3-small | $0.02/M tokens, negligible cost |
| **Vector DB** | Self-hosted ChromaDB/Qdrant | Free, sufficient for <1M vectors |
| **Hosting** | No GPU needed | All API-based, zero GPU commitment |
| **Monthly AI budget** | ~$50-100 (at 500K msgs) | Extremely low risk |

### Growth Phase (Months 4-12)

| Decision | Recommendation | Rationale |
|----------|---------------|-----------|
| **Add caching layer** | Redis + semantic cache | 40% cost reduction, pays for itself immediately |
| **Add model routing** | Simple → Nano, Complex → 4o-mini | Another 30% cost reduction |
| **Evaluate Typhoon 2.5 API** | SCB 10X launching on AWS Q1 2026 | Best Thai quality, may be price-competitive |
| **Monitor DeepSeek V3** | $0.28/M input with auto-caching | Could be cheapest option for Thai with good quality |

### Scale Phase (Year 2+, 5M+ messages/month)

| Decision | Recommendation | Rationale |
|----------|---------------|-----------|
| **Self-host Typhoon 8B** | 1x L40S on RunPod ($575/mo) | $0.000090/msg, best Thai quality, full control |
| **Keep API fallback** | GPT-4.1 Nano for overflow | Handle traffic spikes without GPU scaling |
| **Fine-tune Typhoon 8B** | On Thai CS conversations | Reduce output tokens, improve quality, lower cost further |
| **Consider H100** | For 70B if quality demands it | Only if 8B quality is insufficient |

### When to Switch from API to Self-Hosted

```
Monthly messages    Best option
──────────────────  ──────────────────────────────
< 3M messages/mo    API (GPT-4.1 Nano / 4o-mini)
3M - 10M msgs/mo    Evaluate self-hosting Typhoon 8B
> 10M msgs/mo       Self-host Typhoon 8B (clear cost win)
> 30M msgs/mo       Self-host Typhoon 70B on multi-GPU
```

### Target Gross Margins

| Phase | Target Margin | How |
|-------|--------------|-----|
| Alpha (no optimization) | 70-75% | API-only, GPT-4.1 Nano |
| Production (with caching) | 80-85% | Cache + routing + prompt optimization |
| Scale (self-hosted) | 85-90% | Self-hosted Typhoon + cache + routing |

---

## 10. Model Decision Matrix

| Priority | Best Choice | Why |
|----------|------------|-----|
| Cheapest possible | GPT-4.1 Nano ($0.05/$0.20) | 3x cheaper than next option |
| Best Thai quality (API) | GPT-4.1 Mini ($0.40/$1.60) | Strong multilingual, good reasoning |
| Best Thai quality (self-hosted) | Typhoon 2.5 8B | Purpose-built for Thai, Apache 2.0 |
| Best cost/quality balance | GPT-4o-mini ($0.15/$0.60) | Proven, reliable, good Thai |
| Ultra-cheap with caching | DeepSeek V3 ($0.028 cache/$0.28) | 90% discount on repeated prompts |
| Absolute best quality | Claude Haiku 4.5 ($1/$5) | Best nuance, but 7-20x more expensive |
| **Alpha recommendation** | **GPT-4.1 Nano + GPT-4o-mini fallback** | **< $100/mo for 500K messages** |

---

## Appendix: Key Assumptions

- Token counts based on Thai language (Thai uses ~1.5-2x more tokens than English per semantic unit in most tokenizers, but modern models handle Thai efficiently)
- Throughput estimates assume continuous batching with vLLM/SGLang, not single-request inference
- GPU prices are on-demand; reserved instances or spot pricing can reduce by 30-60%
- Platform infrastructure assumes modest scale: single app server, managed PostgreSQL, Redis
- Cache hit rates are conservative; real Thai CS conversations could hit 50-60% cache rates
- All costs exclude payment processing fees (Stripe: 3.65%, PromptPay: 1.65%)

---

*Last updated: March 2026*
*Status: Cost model v1.0*

### Sources

- [LLM API Pricing March 2026 — TLDL](https://www.tldl.io/resources/llm-api-pricing-2026)
- [OpenAI API Pricing](https://developers.openai.com/api/docs/pricing)
- [Claude API Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [Gemini API Pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini 2.5 Flash Pricing](https://pricepertoken.com/pricing-page/model/google-gemini-2.5-flash)
- [GPT-4.1 Nano Pricing](https://pricepertoken.com/pricing-page/model/openai-gpt-4.1-nano)
- [DeepSeek API Pricing](https://api-docs.deepseek.com/quick_start/pricing)
- [Together.ai Pricing](https://www.together.ai/pricing)
- [Typhoon 2 API Pro Announcement](https://opentyphoon.ai/blog/en/introducing-typhoon-2-api-pro-accessible-production-grade-thai-llms-3e139c077aab)
- [Typhoon 2.5 Release](https://opentyphoon.ai/blog/en/typhoon2-5-release)
- [RunPod GPU Pricing](https://www.runpod.io/pricing)
- [Lambda GPU Pricing](https://lambda.ai/pricing)
- [GPU Cloud Pricing Comparison 2026](https://www.spheron.network/blog/gpu-cloud-pricing-comparison-2026/)
- [Cloud GPU Pricing Comparison](https://gpuvec.com/)
- [vLLM v0.6.0 Performance](https://blog.vllm.ai/2024/09/05/perf-update.html)
- [Llama 3.1 8B vLLM Benchmarks on H100/A100](https://www.ori.co/blog/benchmarking-llama-3.1-8b-instruct-on-nvidia-h100-and-a100-chips-with-the-vllm-inferencing-engine)
- [A100 80GB vLLM Benchmark](https://www.databasemart.com/blog/vllm-gpu-benchmark-a100-80gb)
- [NVIDIA H100 Inference Performance](https://developer.nvidia.com/blog/achieving-top-inference-performance-with-the-nvidia-h100-tensor-core-gpu-and-nvidia-tensorrt-llm/)
- [OpenAI Embedding Pricing](https://www.helicone.ai/llm-cost/provider/openai/model/text-embedding-3-small)
- [Vector DB Cost Comparison](https://rahulkolekar.com/vector-db-pricing-comparison-pinecone-weaviate-2026/)
- [Pinecone Pricing](https://www.pinecone.io/pricing/estimate/)
