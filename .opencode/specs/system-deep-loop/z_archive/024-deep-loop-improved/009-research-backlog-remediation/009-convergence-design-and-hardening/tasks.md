---
title: "Tasks: Convergence Design and Hardening"
description: "Task list for the sliding-window decision-record and 4 hardening items."
trigger_phrases:
  - "convergence design hardening tasks"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/009-research-backlog-remediation/009-convergence-design-and-hardening"
    last_updated_at: "2026-07-01T08:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Convergence Design and Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read generation-2 research.md (current, not archived) in full — confirmed denominator drag is now "mathematically-proven"/"DEEPENED", cited with real line-number evidence including glm's own iteration-017 and iteration-035 raw files
- [x] T002 Wrote `decision-record.md` with an explicit **defer** recommendation (build in a follow-up phase, not this one) — evidence-cited, spot-checked line-by-line by this orchestrating session against the real source files, all citations accurate
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Implemented `startLineageStallWatchdog()` — a debounced, reschedule-on-activity timer that emits a `stall_detected` event (mapped to `warning` status) when a lineage's event stream goes quiet past `stallWatchdogMs`; test added and independently re-run passing
- [x] T004 Confirmed `enableNearDuplicateDedup` is real, already-tested, and working (existing `fanout-merge.vitest.ts` coverage); explicit decision made and documented: **keep opt-in**, not default-on, since flipping the default would collapse previously-distinct cross-lineage findings without a broader rollout decision
- [x] T005 Implemented `evaluateLineageBudgetCap()` mirroring the `council/cost-guards.cjs` pattern (`continue_allowed`/`stop_reasons`/`upper_bound` shape); enforced in the worker function before spawning a lineage's CLI subprocess, throwing a real failure the pool already handles; supports both cost-unit and token-budget config aliases since no real per-lineage token telemetry exists yet to measure against — test added and independently re-run passing
- [x] T006 Confirmed `lag_ceiling_exceeded`/`lag_ceiling_abort` mapping already existed (shipped incidentally during earlier remediation work, already dispositioned in child 006); added a direct regression test asserting the exact mapping (including the real `abort-requeue` action spelling used by the live event vocabulary, not just the older `abort` spelling) — independently re-run passing
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Ran full `deep-loop-runtime` Vitest suite, independently re-run: 563/565 pass — same 2 pre-existing, unrelated baseline failures confirmed throughout this remediation phase (`dependency-seams.vitest.ts`, `executor-provenance-mismatch.vitest.ts`), no new regressions
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 7 tasks complete; decision-record has an explicit, evidence-cited "defer" recommendation; all 4 hardening items have an explicit disposition (2 newly implemented + tested, 2 already-implemented + newly tested/documented); suite green (2 pre-existing, unrelated failures excluded).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md` · Plan: `./plan.md` · Implementation summary: `./implementation-summary.md`
- Source findings: `../../research/research_archive/20260701T071133Z-gen1/research.md` §4.3 (F-013), §4.3 (F-016)
<!-- /ANCHOR:cross-refs -->
