---
title: "Tasks: sk-code Router Benchmarkability"
description: "Task breakdown for teaching the Lane C harness to follow sk-code's referenced router doc and projecting a machine-readable router into smart_routing.md."
trigger_phrases:
  - "sk-code router benchmarkability tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/008-deep-improvement-skill-benchmark-mode/009-sk-code-router-benchmarkability"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "All tasks executed and verified"
    next_safe_action: "validate.sh --strict"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-router-benchmarkability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: sk-code Router Benchmarkability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` open · `[~]` in progress
- Each task lists its evidence (file, test, or report) inline.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-01 Capture baseline benchmark on sk-code as-is — `sk-code/benchmark/baseline/` → BLOCKED-BY-STRUCTURE, D5=0, 95 findings (1 P0 + 94 P2).
- [x] T-02 Add machine-readable router block to `smart_routing.md` §11 — all 94 content files mapped; direct D5=91, 0 dead paths, 3 orphans.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-03 `parseRouter` reference-following + `skillRoot` threading — `router-replay.cjs`, `d5-connectivity.cjs`, `contamination-lint.cjs`.
- [x] T-04 Author 2 lint-clean fixture pairs (empty gold) — `sk-code/benchmark/fixtures/sk-code/`; both pass `lintFixture`.
- [x] T-05 Reference-following regression tests — +4 tests in `skill-benchmark.vitest.ts`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-06 Re-benchmark + record before/after — `sk-code/benchmark/after/` (4-dim) → CONDITIONAL 69; `sk-code/benchmark/full/` (5-dim, advisor on) → CONDITIONAL 55, D5 91, 2 scenarios.
- [x] T-07 Spec docs + metadata + validate + reconcile — this packet.
- [x] T-08 Drift guard for the §11 machine block — `sk-code-router-sync.vitest.ts` (no dead paths, full coverage, prose explicit paths present); suite 218 passing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Full `deep-improvement` vitest suite green (214 tests).
- [x] sk-code verdict no longer `BLOCKED-BY-STRUCTURE`; ≥1 scored scenario.
- [x] No dead resource paths introduced; inline-router skills unchanged.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` · Plan: `plan.md` · Checklist: `checklist.md`
- Decisions: `decision-record.md` (ADR-001 reference-following, ADR-002 empty-gold fixtures)
- Evidence: `.opencode/skills/sk-code/benchmark/{baseline,after,full}/` (+ `benchmark/README.md`)
<!-- /ANCHOR:cross-refs -->
