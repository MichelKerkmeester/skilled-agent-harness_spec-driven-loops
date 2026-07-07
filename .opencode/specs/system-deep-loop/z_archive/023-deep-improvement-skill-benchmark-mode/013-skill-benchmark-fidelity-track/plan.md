---
title: "Plan: Skill-Benchmark D3/D4 Fidelity Track"
description: "Implementation plan for the 011 round-2 recommendation: D4-R task-outcome instrument + deferred-asset lane + intent-synonym reconciliation, sequenced cheap-and-safe first (synonyms, asset lane) before the paid D4-R live runs, behind the deterministic-suite and drift-guard gates."
trigger_phrases:
  - "skill-benchmark fidelity track plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/023-deep-improvement-skill-benchmark-mode/013-skill-benchmark-fidelity-track"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Drafted the fidelity-track build plan from the 011 round-2 research"
    next_safe_action: "Implement Phase 1 intent-synonym reconciliation (no paid runs)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-benchmark-fidelity-track"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Plan: Skill-Benchmark D3/D4 Fidelity Track

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Implement the 011 round-2 recommendation in fidelity-first order: (1) intent-synonym reconciliation so the router recognizes realistic CS-001/SD-001 wording; (2) a deferred-asset scoring lane so asset deferral stops being an invisible D3 win; (3) a D4-R task-outcome instrument that measures what the model *does* with the slice, reported separately from the existing hallucination delta.

### Technical Context
The work lives almost entirely in `deep-improvement`'s skill-benchmark harness (the scorer, the D4 ablation, the run orchestrator, the report renderer) plus a new grader prompt, with a small `sk-code` router-signal addition. Research is complete (011 round-2, 5 gpt-5.5 iterations). The deterministic suite (251) and the `sk-code-router-sync` drift guard are the standing gates.

### Overview
Make D3 measure stated-reference efficiency cleanly (assets scored on their own lane), make D2 reflect realistic wording (synonyms), and give D4 a real meaning (task-outcome usefulness, separate from hallucination) — additively, without breaking report schema v1.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
The round-2 recommendation is recorded (011 §16), the current scorer/ablation/grader behavior is confirmed by direct read, and the report schema fields are inventoried.

### Definition of Done
A real `D4_task_outcome` exists over ≥5 routine scenarios, distinct from `D4_hallucination`; `assetRecall` is scored and surfaced; the synonym fix holds the round-1 D2 floors; the full vitest suite + drift guard stay green; `skill-benchmark-report.v1` is preserved; every change is labelled fidelity-fix vs real-gain.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive instrument extension: new scoring lanes and a new grader rubric layered onto the existing scorer/report without breaking the v1 schema or the router-mode determinism.

### Key Components
`d4-ablation.cjs` (task-outcome dispatch + grading), a new `system-grader-task-outcome.md` rubric, `score-skill-benchmark.cjs` (`assetRecall` dim + two-number D4 surfacing), `run-skill-benchmark.cjs` (opt-in `--d4`), `build-report.cjs` (render), and `INTENT_SIGNALS` synonyms in `smart_routing.md` + `router-replay.cjs`.

### Data Flow
Router/live scoring is unchanged for D1/D2/D3 except that `expectedAssets` now feeds a separate `assetRecall` instead of being silently dropped. When `--d4` is set, the orchestrator runs `runD4Ablation` per routine scenario in task-outcome mode (patch-plan + verification, not routing JSON), grades on/off with the task-outcome rubric, and emits `D4_task_outcome` next to the existing `D4_hallucination` — never summed.

### Key Decisions
- **Synonyms, not prompt-doctoring (REQ-003).** The CS-001 per-feature prompt ("Motion CDN", "in-view snippet") is *realistic* user wording; the honest fix is to make `MOTION_DEV` recognize it, not to rewrite the prompt to say "motion.dev". Same for SD-001's "gate/IntersectionObserver/smooth-scroll" → `IMPLEMENTATION`. This is a real recall gain, re-verified against the D2 floors — distinct from the artifact-only lift that prompt-editing would give.
- **Two D4 numbers, never one (REQ-001).** `D4_hallucination` (existing grader) and `D4_task_outcome` (new) measure different things; collapsing them reproduces the current confusion. They ship as separate report fields.
- **Asset lane, not asset-into-D3 (REQ-002).** The router contract intentionally defers `assets/*`; folding them into D3 would punish a deliberate design. Score them as their own `assetRecall`/`assetSupport` signal so the "we stopped counting assets as waste" effect is visible, not hidden inside D3.
- **Scope is the benchmark, not sk-code.** Most changes are measurement-fidelity fixes in `deep-improvement`; only the synonyms touch `sk-code`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- The skill-benchmark harness (OpenCode `.cjs`): `score-skill-benchmark.cjs`, `d4-ablation.cjs`, `run-skill-benchmark.cjs`, `build-report.cjs`.
- The model-benchmark grader (markdown rubric): a new `system-grader-task-outcome.md`.
- sk-code OpenCode surface: `references/smart_routing.md` §11 `INTENT_SIGNALS` + the mirror in `router-replay.cjs`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Intent-synonym reconciliation (REQ-003): add the realistic-wording synonyms to `MOTION_DEV` + `IMPLEMENTATION` in `smart_routing.md` §11 and the `router-replay.cjs` mirror; re-run the router replay; confirm D2 rises with no floor breach and the drift guard stays green. No paid runs.

### Phase 2: Core Implementation
Deferred-asset lane (REQ-002): score `expectedAssets` as a separate `assetRecall` signal in `score-skill-benchmark.cjs`, surface it in `build-report.cjs`, keep D3 as stated-reference efficiency. Then the D4-R instrument (REQ-001): add the task-outcome dispatch prompt + the `system-grader-task-outcome.md` rubric, wire `runD4Ablation` into `run-skill-benchmark.cjs` behind `--d4`, and emit `D4_task_outcome` separately. Deterministic tests use the mock grader.

### Phase 3: Verification
Run the full vitest suite + the drift guard (must stay green); run the router replay to confirm the synonym D2 lift holds the floors; flag the paid cost, then run the D4-R live ablation on LS-001/002/003/004 + SD-002 and record `D4_task_outcome` with per-axis evidence; confirm schema v1 + honest real-vs-artifact labelling.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Deterministic (gate, no network): vitest suite stays green with new unit tests for the `assetRecall` lane, the two-number D4 surfacing, the task-outcome grader in mock mode, and the synonym routing; `sk-code-router-sync.vitest.ts` green. Router replay over the round-1 guard scenarios for the synonym D2 floors. Paid (opt-in, advisory): the D4-R live ablation on the 5 routine scenarios.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The 011 round-2 research recommendation (the design), the existing Lane B grader harness (`gradeD4` + the system-grader prompt) as the template for the new rubric, and the round-1 D2 baseline floors for the synonym regression guard.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each phase is an independent revert: drop the synonym lines (router back to prior recall), revert the `assetRecall` scorer hunk (report back to v1 baseline), or disable the `--d4` wiring (D4 returns to `unscored`). The report schema is additive, so reverting any field leaves consumers intact.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 1 (synonyms) is independent and ships first. Phase 2 (asset lane → D4-R) depends only on the scorer/report being stable. Phase 3 verifies all three and gates the ship; the paid D4-R run is the last step.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Medium: one router-signal addition + one scorer lane + one new grader rubric + one orchestrator wiring + one report render + tests. The paid D4-R run adds wall-clock and API cost but no build complexity. Research already done (011 round-2).
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
Suite + drift guard green pre-change; report schema v1 fields inventoried; round-1 D2 floors snapshotted.

### Rollback Procedure
Per-phase single-hunk revert (synonyms / asset lane / `--d4` wiring); re-run the suite + replay to confirm the baseline is restored.

### Data Reversal
None — all changes are scoring/reporting logic and one router signal; no persisted state or migration.
<!-- /ANCHOR:enhanced-rollback -->
