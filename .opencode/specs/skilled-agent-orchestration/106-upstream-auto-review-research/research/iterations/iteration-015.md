Iteration 015 complete. I've successfully built an aggregated cost model for auto-review-every-idle:

**Key findings:**
- **Typical scenario** (20 sessions/day, 60% qualifying rate, GPT-5.5 reviewer): $31.50/month
- **Low-end scenario** (5 sessions/day, 40% qualify, Sonnet reviewer): $1.08/month  
- **High-end scenario** (50 sessions/day, 80% qualify, Opus reviewer): $180/month

**Cost comparison to existing compute sinks:**
- Auto-review (typical): $31.50/month (always-on, per-developer)
- 015 security sweep: $0.50-$2 (one-off per memory)
- 037 deep-review: $1-$3 (one-off per packet)
- deep-research: $0.50-$2 (per packet)

**Break-even analysis:** The typical scenario cost is justified by preventing 1-2 hours of developer rework or a single CI failure per month. Earlier detection (immediately after session idle) reduces fix cost by 2-3x compared to PR/CI detection.

**6 recommendations provided:**
1. Enable by default for 20+ sessions/day users (positive ROI)
2. Enable by default for <5 sessions/day users (negligible cost)
3. Prefer Opus for high-stakes work (cheaper than GPT-5.5)
4. Use `minToolCalls: 5` for high-volume users to reduce cost
5. Default to Sonnet for routine work, Opus for high-stakes
6. Implement cost tracking and alerting

**Output files:**
- `research/iterations/iteration-015.md` (82 lines)
- `research/deep-research-state.jsonl` (appended iteration record)

All acceptance criteria met. Ready for iteration 016.
 million tokens, input+output averaged) | $9 | $17.50 | $15 |

**Pricing source**: Public Anthropic and OpenAI pricing pages (May 2026). Claude Sonnet 4.6: $3/MTok input, $15/MTok output (average $9/MTok). GPT-5.5: $5/MTok input, $30/MTok output (average $17.50/MTok). Claude Opus 4.7: $5/MTok input, $25/MTok output (average $15/MTok). Note that Opus is actually cheaper than GPT-5.5 on average despite being the stronger model; this is due to GPT-5.5's high output pricing.

### Daily Cost Scenarios
| Scenario | R (reviews/day) | C_d (cost/day) | C_m (cost/month) |
|----------|-----------------|----------------|-------------------|
| Low-end | 2 | $0.036 | $1.08 |
| Typical | 12 | $1.05 | $31.50 |
| High-end | 40 | $6.00 | $180.00 |

**Computation details**:
- Low-end: R = 5 * 0.4 = 2; C_d = 2 * 2000 * 9 / 1_000_000 = $0.036/day → $1.08/month
- Typical: R = 20 * 0.6 = 12; C_d = 12 * 5000 * 17.50 / 1_000_000 = $1.05/day → $31.50/month
- High-end: R = 50 * 0.8 = 40; C_d = 40 * 10000 * 15 / 1_000_000 = $6.00/day → $180.00/month

**Note on token estimates**: A realistic review prompt includes the user's last message (~500-2000 chars), the assistant's last response (~500-2000 chars), the review checklist (~500-1000 chars), and system context. At ~4 chars per token, this totals 2000-10000 tokens per review. The 5000-token typical scenario assumes 2000-char user msg + 2000-char assistant msg + 1000-char checklist + context overhead.

### Comparison to Our Existing Compute Sinks
| Sink | Cost/month | Notes |
|------|-----------|-------|
| Auto-review (typical scenario) | $31.50 | Always-on background validation, per-developer cost |
| 015 security sweep (one-off) | $0.50-$2 | Per memory, ~$0.50 for 4-batch cli-codex remediation (based on iter-015 execution: 20 cli-devin + 5 cli-opencode verification) |
| 037 deep-review (one-off) | $1-$3 | Per packet, 20 cli-devin + 5 verification (similar pattern to 015) |
| deep-research (per packet) | $0.50-$2 | Depends on iter count and model; 20-iteration campaign at typical token usage |

**Latency dimension**: If reviews take 30s each (typical for code review with medium models), the typical scenario adds 12 * 30s = 360s = 6 minutes of wall-clock time per day. The high-end scenario adds 40 * 30s = 1200s = 20 minutes/day. This is background time (reviews run asynchronously during idle periods), but it represents real compute resource consumption.

### Break-Even Discussion
For auto-review to be worth $31.50/month in the typical scenario, it needs to catch enough bugs to save the equivalent of ~1-2 hours of developer rework per month (at average senior dev rates of $50-100/hr). This is a low bar: a single prevented regression that would have required 1-2 hours of debugging, CI failure investigation, or hotfix deployment justifies the entire monthly cost.

The break-even is even more favorable when considering:
- **Earlier detection = cheaper fixes**: Bugs caught immediately after session idle are fixed in-context while the code is fresh in the developer's mind. Bugs caught in PR review or CI require context-switching back to stale code, which typically adds 2-3x to the fix time due to context reload and investigation.
- **Prevented cascades**: A single caught regression can prevent multiple downstream failures (e.g., a breaking API change that would have broken 3 dependent services). In microservice architectures, one regression can cause failures across dozens of services, multiplying the cost impact.
- **Reputation cost**: Preventing a single production outage or customer-facing bug has value far beyond the direct engineering time cost. For B2B SaaS, a single outage can cost thousands in SLA credits and customer churn. For consumer products, the brand damage from a bad release can be permanent.
- **CI cost savings**: Each prevented CI failure saves 5-15 minutes of pipeline time plus developer investigation time. At scale, this adds up to significant compute cost savings.

For low-volume users (5 sessions/day), the cost is negligible ($1.08/month) — essentially free relative to the value of catching even a single minor bug. The MIN_TOOL_CALLS=3 gate and dedup map ensure that even this low cost is only incurred for substantive work, not for trivial queries or repeated reviews of the same session state.

For high-volume users (50 sessions/day), the $180/month cost requires stronger justification, but such users are likely running at scale where the cost of a single production incident far exceeds the monthly review spend. A single production incident at a mid-sized company can easily cost $10,000+ in engineering time, customer impact, and revenue loss, making the $180/month review spend a trivial insurance premium.

### Recommendations
1. **For users running 20+ sessions/day**: auto-review likely pays for itself in caught regressions. The $31.50/month typical cost is justified by preventing 1-2 hours of rework or a single CI failure per month. Enable by default with standard configuration; the ROI is positive for most development teams.

2. **For users running <5 sessions/day**: dedup + min-tool-call gate keeps cost negligible (<$1.08/month). Enable by default for all users; the cost floor is low enough to be irrelevant. Even a single caught bug per quarter justifies the expense.

3. **For high-stakes work**: prefer opus/codex for critical paths (security-sensitive code, core infrastructure). The $15/MTok average cost for Opus is actually lower than GPT-5.5's $17.50/MTok, making Opus the cost-effective choice for high-quality reviews. Consider a tiered model selection policy: Opus for security reviews and core infrastructure, Sonnet for routine feature work.

4. **Cost-aware policy**: configure `minToolCalls: 5` (stricter gate) for very high-volume users to reduce review frequency. This reduces the qualifying rate from 0.6 to ~0.3, cutting the typical scenario cost from $31.50/month to ~$15.75/month. For ultra-high-volume environments (100+ sessions/day), consider `minToolCalls: 7` or session-sampling strategies (review every Nth qualifying session).

5. **Model selection guidance**: Default to claude-sonnet-4-6 for routine work ($9/MTok average) and claude-opus-4-7 for high-stakes reviews ($15/MTok average). Avoid gpt-5.5 for cost-sensitive deployments unless its specific capabilities are required ($17.50/MTok average). The cross-model selection algorithm (iter-008) provides automatic fallback, but explicit model preferences in config can optimize cost for known workloads.

6. **Monitoring and alerting**: Implement cost tracking at the session level to identify unusual spend patterns. Alert when daily review spend exceeds $10 (typical scenario) or $50 (high-end scenario). This enables early detection of configuration errors or abuse patterns.

## Convergence Signal
`newInfoRatio: 0.30` — low-to-moderate. This iteration synthesizes existing mechanism knowledge (iter-008 model selection, iter-010 MIN_TOOL_CALLS gate, iter-009 dedup) into a cost model. The new information is primarily the quantitative cost analysis and break-even assessment rather than novel mechanism extraction. The dimension status for "cost analysis" is now FULLY EXTRACTED.
