---
title: "Tasks: Synthesis Integrity and Orchestrator Watchdog"
description: "Task list for the synthesis-completion invariant, post-exit watchdog, and reconstructResearchRegistryFromState."
trigger_phrases:
  - "synthesis integrity orchestrator watchdog tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-agent-loops-improved/009-research-backlog-remediation/011-synthesis-integrity-and-orchestrator-watchdog"
    last_updated_at: "2026-07-01T11:20:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks"
    next_safe_action: "Dispatch implementation"
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
# Tasks: Synthesis Integrity and Orchestrator Watchdog

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

- [ ] T001 Read `reconstructReviewRegistryFromState` (fanout-merge.cjs) in full as the reference pattern
- [ ] T002 Read the current `lagCeilingMs`/pool-settle logic in `fanout-run.cjs` and the `synthesis_complete` logging point in both `deep_research_auto.yaml` and `deep_review_auto.yaml`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Implement the synthesis-completion invariant (gate `synthesis_complete` behind artifact-existence + finding-count check; log `synthesis_incomplete` on failure)
- [ ] T004 Implement the post-exit watchdog (non-zero `lagCeilingMs` default or documented opt-out; bounded grace-period force-fail for a dead-subprocess/no-ledger-event worker)
- [ ] T005 Implement `reconstructResearchRegistryFromState`, wired into `mergeResearchRegistries`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Write and pass the synthesis-invariant tests (both the failure case and the legitimate-zero-findings case)
- [ ] T007 Write and pass the watchdog tests (force-fail case and the must-not-false-positive case)
- [ ] T008 Write and pass the `reconstructResearchRegistryFromState` test (mirroring the review-side test)
- [ ] T009 Run the full `deep-loop-runtime` Vitest suite; confirm no regressions
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 9 tasks complete; all 3 new fixes tested; full suite green with no regressions to normal-completion paths.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md` · Plan: `./plan.md` · Implementation summary: `./implementation-summary.md`
- Source: `research/research.md` (generation 2) §3.1 (NEW-1, NEW-2), §6.1-6.2, §6.3
<!-- /ANCHOR:cross-refs -->
