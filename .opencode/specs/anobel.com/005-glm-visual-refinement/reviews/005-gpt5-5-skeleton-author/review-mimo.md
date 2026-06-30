Now I have sufficient grounding. Let me also check what the existing phase 005 spec says to see if there are gaps between the proposal and the existing work.## Verdict

**AGREE-WITH-CHANGES** — confidence 0.65 — The architecture is sound (skeleton-author separation, cost caps, escalation gating), but the proposal has a critical causal gap, undefined cost math, and an untested premise that makes the +3 go/no-go bar a coin-flip rather than a grounded threshold.

---

## What GPT-5.5 got right

- **Skeleton-not-code separation** is the right abstraction. GPT-5.5 authors coordinates, GLM renders. This avoids the trap of asking a paid model to write final HTML.
- **Escalation-only routing** (never on linear tiles, never on already-SHIP) is correctly scoped. Linear tiles at 86-94 need no help.
- **Cost caps before spend** (`<=1` call, `<=4200` tokens, batch budget on `N_2D`) is the right discipline.
- **+3 go/no-go** with explicit rejection-to-downgrade is honest. The spec doesn't pretend the escalation is guaranteed.

---

## Gaps / risks / errors

### 1. THE CAUSAL GAP (RC-1/RC-2/RC-3 — critical)

The root-cause ledger says RC-1/RC-2/RC-3 are **GLM rendering limitations** — GLM "lays out N rows/nodes at fixed pixel heights with no constraint solver" and "direct numerical coordinate placement with no collision detection." But the proposal's fix is to give GLM a *better skeleton*. If GLM can't follow skeleton constraints (which is why the deterministic skeleton fails in the first place), a GPT-5.5-authored skeleton of the same schema doesn't fix the renderer.

**The untested assumption**: GLM-5.2 will obey a skeleton it's given. Phase 004 hasn't run yet. If GLM ignores the deterministic skeleton, it will also ignore the GPT-5.5 skeleton. The proposal should explicitly gate on "GLM follows skeleton constraints at least 80% of the time" before escalating to a paid author.

**The research itself admits this**: iter-r2-A6.md line 219 — "GLM-5.2 may ignore or rewrite scaffold geometry unless the prompt forbids modifying `data-layout-id`, `top`, `left`, `width`, `height`, and zone styles." But the mitigation is just "carry the render contract" — the same kind of prose instruction that GLM is already ignoring.

### 2. COST-PER-RECOVERY IS UNDEFINED (critical for a "cost-capped" escalation)

The spec says "Exact dollar ceiling is UNKNOWN without live token prices" (plan.md, cost_caps section). For a phase whose entire value proposition is cost-capped escalation, this is a gap. The iter-r4-risk analysis says "GPT-5.5 skeleton on all 2D failures: N_2D × 1-4 paid GPT-5.5 calls" but the spec caps at 1 call. Even at 1 call × 18 tiles × 4.2K tokens = 75.6K tokens, the dollar cost is genuinely unknown. The A/B measurement (REQ-005) needs a denominator.

**Fix**: Before building this phase, run a 3-tile pilot with GPT-5.5 to measure actual input/output tokens and compute $/skeleton. If $/recovered-tile exceeds a defined threshold (e.g., $5/tile), kill the escalation and use downgrade-to-linear instead.

### 3. THE DETERMINISTIC SKELETON IS UNTESTED (premise gap)

Phase 004 is still in planning (`implementation-summary.md`: "Nothing yet. This phase is in planning."). The proposal assumes the deterministic skeleton will fail on the hardest tiles and that GPT-5.5 can succeed where it fails. But we don't know:

- How many tiles the deterministic skeleton actually recovers
- Whether the failures are skeleton-quality failures or renderer-obedience failures
- Whether the +1 to +3 prediction is for GPT-5.5 skeletons or for GPT-5.5 skeletons that GLM actually follows

**Fix**: Implement and measure phase 004 first. If the deterministic skeleton recovers 12+ of the 18 baseline failures, the GPT-5.5 escalation may be unnecessary. The spec's open question ("Does the deterministic skeleton recover enough 2D tiles that the 005 GPT-5.5 escalation is optional?") should be answered before building 005.

### 4. THE +3 GO/NO-GO IS A COIN-FLIP AT CONF 0.78

Research predicts +1 to +3 at confidence 0.78. At the lower bound (+1), the phase is rejected. At the upper bound (+3), it barely passes. The confidence interval includes the rejection threshold. This means the go/no-go decision is essentially random — you need more data (the phase-004 holdout results) before you can make a meaningful decision.

**Fix**: Don't set the go/no-go bar until you have the phase-004 deterministic baseline. If deterministic recovers X tiles and GPT-5.5 recovers X+Y tiles, the bar should be Y ≥ 3, not absolute recovery ≥ 3.

### 5. NO FALLBACK FOR GPT-5.5 ITSELF FAILING (operational gap)

The proposal covers: GPT-5.5 skeleton → gate pass → ship, and GPT-5.5 skeleton → gate fail → downgrade. But it doesn't cover:

- GPT-5.5 API timeout or 500 error
- GPT-5.5 returns prose/HTML instead of JSON
- GPT-5.5 returns JSON that doesn't match the schema
- cli-opencode dispatch failure (auth, slug not found)

The `gen-tile.mjs` code has retry logic for GLM (5 retries with backoff). The GPT-5.5 escalation path needs equivalent error handling, or it will crash the batch on a transient API error.

### 6. SCHEMA COMPATIBILITY IS UNVERIFIED

The A6 proposal defines a schema with `nodes[]`, `rows[]`, `edges[]`, `overflowPlan`, `textRules`, `validation`. Phase 004's spec defines a different schema with `layout_mode`, `canvas`, `regions`, `constraints`, `nodes`, `connectors`, `glm_rules`. These are not the same schema. The proposal says "reuse phase-004 schema" but the actual schemas diverge.

**Fix**: Lock a single canonical skeleton schema and use it for both deterministic and GPT-5.5 skeletons. The proposal should not define its own schema — it should consume phase 004's.

### 7. LATENCY BUDGET IS UNADDRESSED

The iter-r4-risk analysis says GPT-5.5 escalation adds "likely 4-12 min serial" per tile. With 18 potential tiles, that's 72-216 minutes of serial latency on top of the existing 2-5 min per tile for deterministic skeleton + GLM render. The batch could take 3-5 hours. The spec doesn't address batching, parallelism, or a timeout policy for the escalation path.

---

## Strongest improvement or alternative

**Kill this phase and invest the engineering effort in phase 004's deterministic skeleton quality instead.**

The proposal's own research (iter-r4-risk.md) says: "Skeleton-first moves the hard problem upstream. If skeleton scoring is weak, GLM will faithfully render bad geometry." The deterministic skeleton is untested. If it works for 12+ of 18 failures, the GPT-5.5 escalation is unnecessary. If it doesn't work, the problem is GLM obedience, not skeleton quality — and GPT-5.5 won't fix that.

The cheaper, higher-ROI path:
1. Build and measure phase 004 first (deterministic skeleton + best-of-3 + downgrade)
2. If residual failures remain, run a 3-tile GPT-5.5 pilot to test whether GLM actually follows a better skeleton
3. Only build the full escalation if the pilot shows GLM obedience is the bottleneck, not skeleton quality

This avoids building a cost-cap accountant, escalation classifier, A/B harness, and prompt asset for an escalation that may never fire.

---

## One thing to test or verify before building this phase

**Run 3 tiles through the full pipeline manually**: deterministic skeleton fails → GPT-5.5 authors a skeleton → compile to scaffold → GLM renders → gate checks. If GLM still ignores the GPT-5.5 skeleton (same RC-1/RC-2/RC-3 defects), the escalation is dead on arrival. This is a 30-minute experiment that saves weeks of engineering.