---
title: "Tasks: Skill-Benchmark D3/D4 Fidelity Track"
description: "Task breakdown for the fidelity-track build: intent synonyms, the deferred-asset lane, and the D4-R task-outcome instrument, sequenced cheap-and-safe before the paid D4-R live runs."
trigger_phrases:
  - "skill-benchmark fidelity track tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/013-skill-benchmark-fidelity-track"
    last_updated_at: "2026-06-02T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Complete: Phases 1-3 shipped; D4-R measured 54/100 (n=5); suite 295 green; strict-clean"
    next_safe_action: "Awaiting commit decision; optional follow-on D3 work motivated by the D4-R noise finding"
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
# Tasks: Skill-Benchmark D3/D4 Fidelity Track

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` done. Tasks map to the plan's phases and each names its primary file.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-101 Added distinctive synonyms to `MOTION_DEV` (`in-view`, `motion cdn`) and `IMPLEMENTATION` (`smooth-scroll`, `intersectionobserver`) in `smart_routing.md` §11 INTENT_SIGNALS + the §2 table. Bare `gate`/`gated` rejected (over-match `investigated`/`delegated`).
- [x] T-102 `router-replay.cjs` parses §11 INTENT_SIGNALS directly — no mirror copy to edit; replay sees the synonyms.
- [x] T-103 Router replay: SD-001 D2 0.455→0.636, CS-001 D2 0.200→0.500 (D3 0.286→0.417); zero D2 regressions across 24 scenarios; drift guard 4/4; full suite 251/251.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-201 `expectedAssets` scored as a separate `assetRecall` (live: recall vs observed assets; router: deferred). `live-executor.parseLiveResult` un-merges assets from `observedResources` (the f-i4-05 D3 artifact fix). D2/D3 untouched.
- [x] T-202 `assetRecall` + `D4_task_outcome` surfaced under a new `advisorySignals` block in `build-report.cjs` + the aggregate; `schemaVersion: skill-benchmark-report.v1` preserved (additive only).
- [x] T-203 Created `system-grader-task-outcome.md` (correctness 0.40 / verification-fit 0.25 / focus 0.20 / hallucination-risk 0.15), same JSON contract as the hallucination grader.
- [x] T-204 `d4-ablation.cjs`: added `buildTaskOutcomePrompt`/`gradeTaskOutcome`/`runD4RAblation` (no-write patch-plan + verification; reuses `gradeD4` with `system_prompt_path`); hallucination path intact.
- [x] T-205 `run-skill-benchmark.cjs`: opt-in `--d4` runs `augmentWithD4R` (async, kept out of sync `run()`), emits advisory `D4_task_outcome` separate from `D4` hallucination.
- [x] T-206 Added 5 deterministic tests (mock grader): asset lane (router deferred / live recall), D4-R grade + prompt shape, advisory aggregate. Updated the merge-encoding test to the split.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-301 Full deep-improvement vitest suite green (295/295, 24 files; +5 new) + `sk-code-router-sync.vitest.ts` 4/4. Router benchmark unchanged (agg 46, D2 47, D3 32); advisory signals additive.
- [x] T-302 D4-R live ablation (paid) run on LS-001/002/003/004 + SD-002: `D4_task_outcome` aggregate **54/100** (task-dependent — helps weak-baseline tasks, hurts strong ones). Artifact + README in `sk-code/benchmark/d4r-live/`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Done when the synonyms hold the D2 floors, `assetRecall` is scored and surfaced, a real `D4_task_outcome` exists over ≥5 routine scenarios distinct from `D4_hallucination`, the full suite + drift guard are green, schema v1 is preserved, and every change is labelled fidelity-fix vs real-gain.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` (REQ-001..005). Plan: `plan.md`. Research basis: `../011-sk-code-routing-efficiency-remediation/research/research.md` §12-18.
<!-- /ANCHOR:cross-refs -->
