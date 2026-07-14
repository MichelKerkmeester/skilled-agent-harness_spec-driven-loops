# Deep Research Iteration 015 of 20 — Aggregated cost model (how expensive is auto-review-every-idle?)

## SITUATION

You are running as **cli-devin SWE-1.6** in non-interactive print mode, dispatched as iteration 15 of a 20-iteration deep-research campaign on the upstream `dzianisv/opencode-plugins` `auto-review` package.

**Prior context (REQUIRED)**:
- Iter 008 documented the cross-model selection algorithm and rank-preferring opus/codex/sonnet/pro
- Iter 010 documented the MIN_TOOL_CALLS=3 gate
- Iter 009 documented the dedup map (per-message signature)

**Why this iter exists**: auto-review-every-idle has hidden cost. Each qualifying session spawns ONE extra model call (preferring stronger models). Across many sessions per day this adds up. Quantifying the cost vs benefit informs whether to recommend adoption of this pattern.

## TASK

### Step 1 — Define cost variables

| Variable | Symbol | Definition |
|----------|--------|-----------|
| Sessions per day | S | Number of completed OpenCode sessions a developer dispatches |
| Qualifying session rate | q | Fraction of sessions that pass MIN_TOOL_CALLS=3 gate AND don't hit dedup |
| Tokens per review | T_r | Average tokens consumed by a single review (prompt + response) |
| Token price per model | p_m | Per-token cost of the chosen reviewer model |
| Reviews per day | R | `S * q` |
| Daily cost | C_d | `R * T_r * p_m` |

### Step 2 — Estimate realistic ranges

For a typical developer using OpenCode heavily:

| Variable | Low | Typical | High |
|----------|-----|---------|------|
| S (sessions/day) | 5 | 20 | 50 |
| q (qualifying rate) | 0.4 | 0.6 | 0.8 |
| T_r (tokens/review) | 2000 | 5000 | 10000 |
| Reviewer model | claude-sonnet-4-6 | gpt-5.5 | claude-opus-4-7 |
| Reviewer model price (per million tokens, input+output averaged) | $3 | $5 | $20 |

### Step 3 — Compute daily cost ranges

**Low-end scenario** (5 sessions, 40% qualify, 2k tokens, $3/M):
- R = 5 * 0.4 = 2 reviews/day
- C_d = 2 * 2000 * 3 / 1_000_000 = $0.012/day → $0.36/month

**Typical scenario** (20 sessions, 60% qualify, 5k tokens, $5/M):
- R = 20 * 0.6 = 12 reviews/day
- C_d = 12 * 5000 * 5 / 1_000_000 = $0.30/day → $9/month

**High-end scenario** (50 sessions, 80% qualify, 10k tokens, $20/M with opus):
- R = 50 * 0.8 = 40 reviews/day
- C_d = 40 * 10000 * 20 / 1_000_000 = $8/day → $240/month

### Step 4 — Compare to our existing compute sinks

| Sink | Approximate cost/month | Notes |
|------|------------------------|-------|
| Auto-review (typical scenario) | $9 | Always-on background validation |
| 015 security sweep (one-off) | $0.50-$2 per run | per memory, ~$0.50 for 4-batch cli-codex remediation |
| 037 deep-review (one-off) | $1-$3 per run | 20 cli-devin + 5 verification |
| deep-research (per packet) | $0.50-$2 per run | depends on iter count and model |

### Step 5 — Cost-vs-benefit assessment

For auto-review to be worth $9/month, it needs to catch enough bugs to save the equivalent of:
- ~1 hour of developer rework per month (at average dev rate)
- OR ~1 prevented CI failure per month
- OR ~1 prevented merge of a regression per month

Discuss whether this break-even is plausible. Note that bugs caught earlier (immediately after session idle) are cheaper to fix than bugs caught in PR review or CI.

### Step 6 — Recommendations

1. **For users running 20+ sessions/day**: auto-review likely pays for itself in caught regressions.
2. **For users running <5 sessions/day**: dedup + min-tool-call gate keeps cost negligible (<$1/month).
3. **For high-stakes work**: prefer opus/codex; for routine work, sonnet/pro is sufficient.
4. **Cost-aware policy**: configure `minToolCalls: 5` (stricter gate) for very high-volume users to reduce review frequency.

## SCOPE

- Iter outputs 008, 009, 010
- Cost data: derive from public model pricing (cite source if you have one)
- Local references: 015 packet implementation-summary.md (cost estimates)
- **No writes outside `research/iterations/iteration-015.md` and `research/deep-research-state.jsonl`**

## VERIFICATION COMMANDS

```bash
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-008.md
sed -n '1,200p' .opencode/specs/skilled-agent-orchestration/z_archive/086-opencode-auto-review-teachings-research/research/iterations/iteration-010.md

# Reference local cost data
rg -nC2 'cost|price|tokens|wall.clock|elapsed' \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/015-tanstack-security-audit/implementation-summary.md 2>&1 | head -20
```

## CONSTRAINTS

- READ-ONLY.
- Use realistic token estimates (don't invent numbers).
- Cite pricing source if available; otherwise mark "approximate from public Anthropic/OpenAI pricing pages."
- The cost model is illustrative, not authoritative — note this caveat.

## COMMON FAILURE MODES

1. **Token estimates too low**: a real review prompt with 5000-char user msg + 5000-char assistant msg + checklist is ~5k tokens, not 1k. Be realistic.
2. **Confusing per-million vs per-thousand pricing**: most Anthropic/OpenAI prices are quoted per-million tokens. Don't mis-compute.
3. **Ignoring inference latency**: cost has a time dimension too; if reviews take 30s each, 40/day = 20 min/day of wall-clock blocked on review completion. Note this.

## OUTPUT FORMAT

Write to `research/iterations/iteration-015.md`:

```markdown
<!-- PINNED_UPSTREAM_SHA: <sha> -->

# Iteration 015 — Aggregated cost model

## Summary
<2-4 sentence verdict on cost-vs-benefit>

## Findings

### Cost Variables
| Variable | Symbol | Definition |
|----------|--------|-----------|
| <6 rows> | | |

### Realistic Ranges Table
| Variable | Low | Typical | High |
|----------|-----|---------|------|
| <5 rows> | | | |

### Daily Cost Scenarios
| Scenario | R (reviews/day) | C_d (cost/day) | C_m (cost/month) |
|----------|-----------------|----------------|-------------------|
| Low-end | 2 | $0.012 | $0.36 |
| Typical | 12 | $0.30 | $9 |
| High-end | 40 | $8 | $240 |

### Comparison to Our Existing Compute Sinks
| Sink | Cost/month | Notes |
|------|-----------|-------|
| Auto-review (typical) | $9 | Always-on |
| <other rows> | | |

### Break-Even Discussion
<1-2 paragraphs: what does auto-review need to catch to be worth $9/month in the typical scenario?>

### Recommendations
1. <Recommendation 1>
2. <Recommendation 2>
3. <Recommendation 3>
4. <Recommendation 4>

## Convergence Signal
`newInfoRatio: <0.0-1.0>` — moderate (mostly synthesis).
```

Then append to `research/deep-research-state.jsonl`:

```jsonl
{"type":"iteration","run":15,"focus":"cost model","mechanismsExtracted":0,"gapsIdentified":0,"newInfoRatio":<0.0-1.0>,"executor":"cli-devin","model":"swe-1.6","pinnedSha":"<sha>","durationSec":<N>,"timestamp":"<ISO8601>"}
```

## ACCEPTANCE CRITERIA FOR THIS ITER

- [ ] Cost variables table with 6 rows
- [ ] Realistic ranges table with Low/Typical/High columns
- [ ] 3 cost scenarios computed (low/typical/high) with numerical answers
- [ ] Comparison to ≥ 3 existing compute sinks
- [ ] Break-even discussion paragraph
- [ ] ≥ 4 recommendations
- [ ] Output file ≥ 80 lines

Begin.
