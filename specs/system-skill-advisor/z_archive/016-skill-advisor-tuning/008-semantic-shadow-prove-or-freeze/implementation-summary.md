---
title: "Implementation Summary: Semantic Shadow Prove-or-Freeze"
description: "Shipped: the FREEZE of the semantic_shadow lane at weight 0.05 is confirmed and locked. A full 193-row paired ablation under a pinned real provider (ollama__nomic-embed-text-v1.5__768, RRF off, rerank off) measured full 149/193 vs semantic-disabled 150/193 — a marginal net-negative of one row. An additive opt-in harness carries the ablation, a fail-on-skip experiment-integrity guard, and a runtime degradation detector. No production scorer code or weight changed; the five scorer files stay git-clean; parity 105/101/4 unchanged."
trigger_phrases:
  - "semantic shadow freeze summary"
  - "semantic ablation implementation summary"
  - "fail-on-skip guard shipped"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze"
    last_updated_at: "2026-07-07T09:00:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Confirmed the freeze and shipped the additive guards"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch (no commit/push done here)"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/scorer/semantic-shadow-ablation.vitest.ts"
    completion_pct: 100
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2 | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-semantic-shadow-prove-or-freeze |
| **Completed** | 2026-07-07 |
| **Level** | 2 |
| **Verdict** | FREEZE (weight 0.05 unchanged) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

The `semantic_shadow` lane stays at weight **0.05** with no production scorer change. The mandate — PROVE-or-FREEZE that weight on the full corpus — is answered FREEZE, confirmed by a full 193-row paired ablation under a pinned real provider. The two arms (full 5-lane vs `disabledLanes:['semantic_shadow']`) differ only in the semantic lane, with RRF fusion and the exact-semantic rerank both OFF. Measured, deterministic: full **149/193** top-1 correct, semantic-disabled **150/193**, delta **+1** for the disabled arm, **6** top-1 flips. The lane is a marginal net-negative of one row (0.5% of the corpus). Everything shipped is additive: one vitest harness carrying the ablation, a fail-on-skip guard, and a runtime degradation detector, plus this decision record.
<!-- /ANCHOR:exec-summary -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### The gap
The weight had never been confirmed on the full 193-row corpus with real embeddings. Prior evidence (a 46-prompt sweep, a V0/V1 weight-ablation) showed zero routing change, but every existing scorer gate runs the lane under deterministic FIXTURE vectors, never the daemon's real embedding path — so the live behavior was unmeasured. And when the provider is unavailable the lane silently no-ops, which is indistinguishable from "semantic is irrelevant."

### What was added
- **Seeded 193-row paired ablation** (opt-in): loads the full projection, builds a fixture projection of every described skill, seeds each description through the pinned provider (cache-backed), spies `loadSkillEmbeddings`, then scores every corpus row with and without the semantic lane. All described skills are seeded so the cosine lane can pull toward ANY skill — a wrong flip is as observable as a right one.
- **Fail-on-skip experiment integrity**: under the opt-in flag the harness hard-fails on provider-absent, pinned-model mismatch, missing prompt/skill embeddings, or all-zero seeded semantic scores; absent the flag it skip-guards so default CI never needs a provider. A non-zero-semantic probe proves the seeded lane is genuinely active.
- **Runtime degradation detector**: drives the lane's stale-projection path and asserts `getSemanticShadowRuntimeHealth().disabledReason` surfaces the degradation instead of swallowing it into a `console.warn`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `tests/scorer/semantic-shadow-ablation.vitest.ts` | Created | Opt-in 193-row paired ablation + non-zero-semantic guardrail + fail-on-skip + runtime degradation detector |
| `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/**` | Created | This Level 2 decision record + metadata |
| `.opencode/specs/system-skill-advisor/graph-metadata.json` | Modified | Registered the 008 child; repointed `last_active_child_id` |

### Files deliberately NOT changed (frozen)
`lib/scorer/fusion.ts`, `lib/scorer/lanes/semantic-shadow.ts`, `lib/scorer/ablation.ts`, `lib/scorer/weights-config.ts`, `lib/scorer/lane-registry.ts` — all git-clean.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Numbers were measured, not assumed. The plan predicted delta-0 / zero flips from the 46-prompt evidence. The full-corpus run with real nomic embeddings instead produced a deterministic **net-negative of one row**: full 149/193, disabled 150/193, 6 flips. The flips break down as 2 helps (`memory:save` correct only with the lane), 3 hurts (gold `none` abstains that the lane false-fires to `mcp-chrome-devtools`), and 1 neutral-wrong. Two flag-on re-runs reproduced the counts and the flip ids exactly.

This surprise was reported exactly rather than forced to delta-0 — fabricating a null result would defeat the entire experiment-integrity purpose of the packet. It does not change the verdict: a net-negative is direct evidence AGAINST raising the weight (raising it amplifies the abstain false-fires, not the two gains), and a 0.5% swing measured under a seeded fixture-projection harness does not justify dropping the lane (dropping breaks `liveLaneCount === 5` and the weight-sum normalization and forces a full re-baseline of the 105/101/4 parity contract). The harness therefore asserts a small documented freeze band and records the exact counts, rather than asserting zero. No commit or push was performed; the changes are left in the working tree for the orchestrator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep the weight at 0.05 (retain the lane, do not drop to 0) | A 0.5% seeded-harness net-negative does not justify breaking the live-lane-count / weight-sum invariants or forcing a full 105/101/4 re-baseline; the low-weight hedge is the smaller, reversible choice |
| Report the measured +1, not the plan's predicted delta-0 | Fabricating a null result would defeat the fail-on-skip experiment-integrity purpose; honesty is the deliverable |
| Gate the heavy ablation behind an opt-in flag | The real-embedding run must never make default CI depend on a local provider; absent the flag the suite skip-guards |
| Seed ALL described skills, not just the corpus gold set | So the cosine lane can pull toward any skill and a wrong flip (abstain false-fire) is as observable as a right one |
| Score against a fixture projection | Avoids the sqlite embedding-staleness gate and any live daemon vector DB open (native-ABI / SIGBUS fragility) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `semantic-shadow-ablation.vitest.ts` — flag OFF | PASS (2 passed / 2 skipped; degradation detector green, ablation skip-guarded) |
| `semantic-shadow-ablation.vitest.ts` — flag ON | PASS (4/4; pinned provider present) |
| `semantic-lane-promotion.vitest.ts` | PASS (6/6; `liveLaneCount === 5`, weight 0.05, `liveWeightTotal ≈ 1`) |
| `lane-weight-sweep.vitest.ts` | PASS (3/3; seeded sweep + non-zero-semantic guardrail) |
| `semantic-shadow-cosine.vitest.ts` | PASS (4/4 via an include override; the file is outside the default `tests/**` include glob — a pre-existing config condition) |
| `python-ts-parity.vitest.ts` | PASS (2/2; hard-asserts pythonCorrect=105, tsAlsoCorrect=101, regressions=4) |
| Five production scorer files git-clean | PASS (`git status --porcelain` empty) |
| `validate.sh --strict` on this folder | Exit 0 |

**Ablation (pinned real provider, filesystem fixture projection)**: providerModelId `ollama__nomic-embed-text-v1.5__768`; RRF off, exact-semantic rerank off; full 149/193 = 0.7720; semantic-disabled 150/193 = 0.7772; delta +1; 6 flips (2 help `memory:save`, 3 hurt via `mcp-chrome-devtools` abstain false-fire, 1 neutral-wrong); deterministic across re-runs.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:deviations -->
## Deviations From Plan

1. **The ablation is a marginal net-negative, not delta-0.** The plan predicted zero flips from the 46-prompt evidence; the full-corpus real-embedding run measured full 149 vs disabled 150 (delta +1, 6 flips). Reported exactly. It strengthens the freeze-vs-raise decision and does not clear the bar to drop the lane. The plan's "harmless hedge" framing is refined to "marginal net-negative hedge retained for structural stability."
2. **The harness asserts a freeze band, not delta-0.** Because the real-embedding lane is a net-negative, a hard `flips === 0` assertion would be a false expectation; the harness asserts the net correctness swing stays within a small documented tolerance and records the exact counts + flip list.
3. **No `decision-record.md`.** Level 2 is the target; the decision + evidence live in spec.md §5 and here. The confirming ablation did not surprise us into a PROVE branch (it went net-negative, not net-positive), so no Level 3 escalation was warranted.
<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The ablation measures a seeded fixture-projection harness, not the daemon's live runtime.** This is the standard reproducible-test trade-off; the pinned provider + spied `loadSkillEmbeddings` keep it deterministic and off the fragile daemon vector DB.
2. **The heavy ablation is opt-in.** It runs only under `SPECKIT_ADVISOR_SEMANTIC_ABLATION=1`; default CI runs the always-on degradation detector and skip-guards the rest.
3. **The `semantic-shadow-cosine` test is outside the default `tests/**` include glob.** It is confirmed green via an include override; wiring it into the default suite is a pre-existing config matter, out of this packet's scope, and cannot regress from a freeze that touches no production code.
4. **No commit or push was performed.** The orchestrator owns the push to the shared branch; the changes are in the working tree.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:follow-up -->
## Follow-Up

- If the daemon or skill metadata legitimately changes, re-run the opt-in ablation under the pinned provider to re-confirm the freeze band.
- If a future run ever shows a net-POSITIVE correctness gain from the lane clearing the evidence bar, escalate to a PROVE branch (weight change + full 105/101/4 re-baseline, coordinated against the pushed fusion lane) — not expected on current evidence.
- Optional, out of packet: wire `lib/**/__tests__/**/*.vitest.ts` into the default vitest include so the cosine gate runs in the standard suite.
<!-- /ANCHOR:follow-up -->
