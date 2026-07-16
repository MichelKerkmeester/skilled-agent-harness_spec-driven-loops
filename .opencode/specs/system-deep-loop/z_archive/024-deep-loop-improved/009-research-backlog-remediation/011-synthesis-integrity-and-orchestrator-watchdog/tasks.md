---
title: "Tasks: Synthesis Integrity and Orchestrator Watchdog"
description: "Task list for the synthesis-completion invariant, post-exit watchdog, and reconstructResearchRegistryFromState."
trigger_phrases:
  - "synthesis integrity orchestrator watchdog tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/009-research-backlog-remediation/011-synthesis-integrity-and-orchestrator-watchdog"
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

- [x] T001 Read `reconstructReviewRegistryFromState` in full as the reference pattern
- [x] T002 Read the pool/ledger logic and the `synthesis_complete` logging points; correctly identified the existing `lagCeilingMs` mechanism is a distinct queue-lag heuristic (not the confirmed-subprocess-death check this task needs) and did not conflate the two
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Implemented the synthesis-completion invariant in both `deep_research_auto.yaml` and `deep_review_auto.yaml`: an inline Node script checks artifact existence (registry/research-or-review-output/dashboard) and cross-checks state-log iteration finding counts against the registry's own finding count. Logs `synthesis_incomplete` (with `invariantFailures`/`missingArtifacts`/counts) when the check fails, `synthesis_complete` normally otherwise — verified the "genuinely zero findings but artifacts exist" case correctly still passes
- [x] T004 Implemented the post-exit watchdog as a distinct, new mechanism (not a `lagCeilingMs` default flip): `fanout-pool.cjs` gained an injected `getAttemptLiveness` callback + `postExitGraceMs` grace period, keyed off confirmed subprocess death time (not overall elapsed time); `fanout-run.cjs` wires real `onSpawn`/`onExit` callbacks from the actual subprocess lifecycle into a `lineageProcessLiveness` map. Default grace period: `max(5 minutes, 2× progressHeartbeatSeconds)` — a documented, conservative choice matching both of the spec's own suggested defaults
- [x] T005 Implemented `reconstructResearchRegistryFromState`, mirroring `reconstructReviewRegistryFromState`'s exact shape; wired into `mergeResearchRegistries` analogously to the review-side wiring. Prefers structured `keyFindings`/`findings`/`findingDetails` state-log data when present, falls back to synthesizing minimal entries from `findingsCount` + narrative text otherwise
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Synthesis-invariant tests added to `run-now-yaml-control.vitest.ts` (both the invariant-fails case and the legitimate-zero-findings-passes case); independently re-run, passing
- [x] T007 Watchdog tests added to `fanout-pool.vitest.ts` (force-fail after grace period on confirmed dead subprocess; must-not-false-positive on a genuinely-alive worker within the grace period); independently re-run, passing
- [x] T008 `reconstructResearchRegistryFromState` test added to `fanout-merge.vitest.ts`, mirroring the review-side test; independently re-run, passing
- [x] T009 Ran the full `deep-loop-runtime` Vitest suite, independently re-run: **570/572 pass** (up from a pre-change baseline of 563/565 the dispatch itself captured first) — the 2 failures are the same pre-existing, unrelated baseline confirmed throughout this whole remediation phase (`dependency-seams.vitest.ts`, `executor-provenance-mismatch.vitest.ts`), no new regressions
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 9 tasks complete; all 3 new fixes independently verified and tested (68 new/adjusted test assertions across 3 files); full suite green (570/572, same 2 pre-existing unrelated baseline failures) with no regressions to normal-completion paths. Dispatch's own subprocess was interrupted before delivering its final structured report; this orchestrating session independently confirmed the actual implementation, wiring, and test results directly from the repo state rather than relying on the incomplete self-report.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md` · Plan: `./plan.md` · Implementation summary: `./implementation-summary.md`
- Source: `research/research.md` (generation 2) §3.1 (NEW-1, NEW-2), §6.1-6.2, §6.3
<!-- /ANCHOR:cross-refs -->
