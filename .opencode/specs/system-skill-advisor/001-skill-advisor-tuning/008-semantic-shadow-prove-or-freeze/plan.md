---
title: "Implementation Plan: Semantic Shadow Prove-or-Freeze"
description: "Technical plan for confirming the FREEZE of the semantic_shadow lane at 0.05: an additive, opt-in seeded 193-row paired ablation under a pinned provider, a fail-on-skip experiment-integrity guard, and a runtime degradation detector. No production scorer file is touched; the freeze is corroborated by the measured ablation plus structural argument."
trigger_phrases:
  - "semantic shadow freeze plan"
  - "semantic ablation harness plan"
  - "fail-on-skip guard architecture"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze"
    last_updated_at: "2026-07-07T09:00:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "Built the ablation harness and confirmed the freeze"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Implementation Plan: Semantic Shadow Prove-or-Freeze

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

All work is additive around a read-only scorer. One new vitest harness seeds the semantic lane in-process (spying `loadSkillEmbeddings` so no live daemon vector DB is opened), pins the embedding provider, and runs a full 193-row paired ablation — full 5-lane vs `disabledLanes:['semantic_shadow']` — with RRF fusion and the exact-semantic rerank both OFF so the two arms differ only in the semantic lane. The harness also carries the fail-on-skip experiment-integrity guard and a runtime degradation detector. The semantic weight, the fusion path, the lane implementation, the ablation engine, and the lane registry are never modified. The freeze is corroborated by the measured ablation (net-negative of one row) plus the structural argument, and the decision is recorded in this spec folder.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- The new harness is green on the flag-off skip path (default) and the flag-on pinned path.
- Under the opt-in flag, the harness hard-fails on provider-absent, pin mismatch, missing embeddings, or all-zero seeded semantic scores.
- `semantic-lane-promotion.vitest.ts` green (`liveLaneCount === 5`, weight 0.05, `liveWeightTotal ≈ 1`).
- `lane-weight-sweep.vitest.ts` green (seeded sweep + non-zero-semantic guardrail).
- `semantic-shadow-cosine.vitest.ts` green ("keeps semantic matches from overturning an explicit top route").
- `python-ts-parity.vitest.ts` holds 105/101/4.
- `validate.sh --strict` on this folder exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The seed path mirrors the existing lane-weight sweep: load the full advisor projection, build a fixture projection of every described skill, seed each skill description through the embedding provider (cache-backed for determinism), and spy `loadSkillEmbeddings` to return the seeded vectors. Scoring against a fixture projection avoids the sqlite embedding-staleness gate and any live daemon DB open. All described skills are seeded (not just the corpus gold set) so the cosine lane can pull toward ANY skill — a wrong flip (an abstain false-fire) is as observable as a right one. The provider is pinned by `providerModelId` and asserted equal; a mismatch is a loud failure under the flag. Each corpus row's query embedding is fetched once and the same embedding is used for both arms, so the only difference between arms is whether the semantic lane contributes. The runtime degradation detector drives the lane's existing stale-projection path and reads `getSemanticShadowRuntimeHealth().disabledReason`, proving a silent degradation is surfaced as telemetry.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- `tests/scorer/semantic-shadow-ablation.vitest.ts` (new; the ablation + guards).
- `.opencode/specs/system-skill-advisor/001-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/**` (this decision record).
- `.opencode/specs/system-skill-advisor/graph-metadata.json` (child registration only).
- Frozen and untouched: `lib/scorer/fusion.ts`, `lib/scorer/lanes/semantic-shadow.ts`, `lib/scorer/ablation.ts`, `lib/scorer/weights-config.ts`, `lib/scorer/lane-registry.ts`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Build the harness
Author the seeded 193-row paired ablation, the non-zero-semantic guardrail, the fail-on-skip gating behind the opt-in flag, and the runtime degradation detector. Comment hygiene: durable WHY only.

### Phase 2: Run and measure
Run flag-off (confirm skip-guard + degradation detector green) and flag-on (produce the paired counts + flip list). Re-run to confirm determinism. Record the exact numbers — never assume delta-0.

### Phase 3: Confirm the freeze and guard the gates
Confirm the five production scorer files are git-clean. Run the four must-stay-green gates. Reconcile the measured net-negative against the freeze verdict (refutes raising; does not clear the bar to drop).

### Phase 4: Record the decision
Author this Level 2 spec folder with the ablation table and rationale; register the child in the parent metadata; run `validate.sh --strict`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- The ablation asserts the freeze band (the net correctness swing stays within a small documented tolerance) and records the exact counts + flip list — it is not asserted to zero, because the real-embedding lane is a marginal net-negative.
- The fail-on-skip guard proves the seeded lane is active (a non-zero semantic probe) and converts a provider fault into a hard error under the flag.
- The degradation detector drives the stale path and asserts the health struct names the reason.
- Corpus-neutrality is proven by the unchanged `python-ts-parity` 105/101/4 and the git-clean scorer files.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `001-scorer-saturation-root-fix` (advisor scorer program umbrella).
- The existing seed harness (`tests/scorer/fixtures/seed-skill-embeddings.ts`) and the 193-row `labeled-prompts.jsonl`.
- A reachable pinned embedding provider for the opt-in confirming run (skip-guarded when absent).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Delete the one new vitest harness and this spec folder, and remove the child entry from the parent `graph-metadata.json`. No production scorer file, database, embedding, or ledger state changed, so rollback is a pure file operation with zero routing impact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 2 depends on Phase 1 (the run needs the harness). Phase 3 depends on Phase 2 (the freeze reconciliation needs the measured numbers). Phase 4 depends on Phase 3 (the decision record quotes the confirmed counts and the git-clean evidence).
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

One additive vitest harness (~300 LOC), one run in two flag modes plus determinism re-runs, four gate re-runs, and this spec folder. Single session.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No database, embedding pointer, weight, or ledger state changes. The embedding cache written during seeding is gitignored and disposable. Rollback restores the prior surface with no migration and no re-approval.
<!-- /ANCHOR:enhanced-rollback -->
