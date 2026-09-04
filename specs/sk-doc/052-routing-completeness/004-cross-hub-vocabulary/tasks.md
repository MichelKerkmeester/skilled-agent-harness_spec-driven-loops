---
title: "Tasks: Phase 4: cross-hub-vocabulary"
description: "The ordered work of the vocabulary phase, each task carrying the commit or the run that closed it."
trigger_phrases:
  - "cross hub vocabulary tasks"
  - "vocabulary phase checklist"
  - "routing edit verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/052-routing-completeness/004-cross-hub-vocabulary"
    last_updated_at: "2026-09-02T18:54:23Z"
    last_updated_by: "claude-code"
    recent_action: "Marked the phase tasks done with evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-02-052-004-cross-hub-vocabulary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: cross-hub-vocabulary

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the durable directive and freeze its three decisions (`goal.md`) - evidence: D1 to D3 carried into `spec.md` section 4
- [x] T002 Confirm the advisor daemon governs and its weights are frozen - evidence: parent packet D1 and D2
- [x] T003 [P] Capture the before numbers for both gates - evidence: Gate A 234 of 444 in `dbc8678c9d`, Gate B 8 of 180 in `4a5de9e52b`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Qualify the three bare single-word tokens to the code sense they meant (`.opencode/skills/sk-code/graph-metadata.json`) - evidence: `f8c2595ce0`
- [x] T005 Give the documentation hub the phrasings people use rather than internal labels (`.opencode/skills/sk-doc/graph-metadata.json`) - evidence: `f8c2595ce0`, 21 lines
- [x] T006 Sweep all 84 declared hub signals for the reach-then-drop shape - evidence: five found, four given a stage-two class in `461ef9261f`
- [x] T007 Change the executor override to lift the hub instead of inserting a routeless rank-one entry (`.../lib/scorer/executor-delegation.ts`) - evidence: `08eb67a0de`
- [x] T008 Rebuild executor routing around the compiled route (`.opencode/skills/cli-external-orchestration/hub-router.json`) - evidence: `08eb67a0de`, 47 lines
- [x] T009 Re-scope the phase after Gate B invalidated its premise (`spec.md`) - evidence: `4a5de9e52b`, 42 lines
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run the three-suite regression control - evidence: 444 declared signals, 180 realistic prompts, 224 out-of-scope controls, recorded in `08eb67a0de`
- [x] T011 Re-capture gold labels and compare accuracy to the committed baseline - evidence: metrics byte-identical, `08eb67a0de`
- [x] T012 Regenerate compiled-route manifests with each routing edit - evidence: freshness reports `fresh` for all five hubs, re-run 2026-09-02
- [x] T013 Re-pin canary digests from the files and confirm a stale digest still fails - evidence: five canaries exit 0, re-run 2026-09-02
- [x] T014 Record what keyword ownership cannot reach - evidence: the 94-row bucket named in `spec.md` section 2 and in `goal.md`
- [x] T015 Re-verify the after state of the bare executor names - evidence: six bare names return `cli-external-orchestration` at rank one with a compiled route, re-run 2026-09-02
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Routing declarations parse and the scorer builds
- [x] CHK-011 [P0] No console errors or warnings from the canary runs
- [x] CHK-012 [P1] The override handles the no-compiled-route case by lifting the hub
- [x] CHK-013 [P1] Changes follow the hub doctrine stated beside the override
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met - re-verified 2026-09-02, see `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested: bare token in its incidental sense, phrase with no stage-two class
- [x] CHK-023 [P1] Error scenarios validated: two mid-flight regressions caught and reverted
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: the bare-token collision is `class-of-bug`, the override is `algorithmic`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed across every hub declaring a bare single-word token
- [x] CHK-FIX-003 [P0] Consumer inventory completed: all 84 declared hub signals checked for a stage-two class
- [x] CHK-FIX-004 [P0] Adversarial cases covered by the canary fixtures, which caught two real regressions
- [x] CHK-FIX-005 [P1] Matrix axes listed: owned prompts, cross-hub collisions, out-of-scope controls
- [x] CHK-FIX-006 [P1] The daemon was queried live rather than through a cached recommendation
- [x] CHK-FIX-007 [P1] Evidence pinned to `f8c2595ce0`, `461ef9261f`, `4a5de9e52b` and `08eb67a0de`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in any routing file
- [x] CHK-031 [P0] Declared vocabulary is data, and the scorer validates its shape
- [x] CHK-032 [P1] No auth surface is touched by this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] The override carries the reasoning for lifting the hub
- [x] CHK-042 [P2] Hub readme surfaces are phase 005 work, not this phase
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] The override decision is recorded as ADR-001 in `plan.md`
- [x] CHK-101 [P1] ADR-001 carries status Accepted
- [x] CHK-102 [P1] Reweighting is documented as the rejected alternative
- [x] CHK-103 [P2] No migration path applies, since the change is behavioral rather than structural
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] No latency target applies, since the change is declarative (NFR-P01)
- [x] CHK-111 [P1] Scorer accuracy metrics byte-identical to the committed baseline
- [x] CHK-112 [P2] Load testing not applicable to a routing declaration
- [x] CHK-113 [P2] Gate A and Gate B numbers recorded before and after
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented and exercised on one reverted attempt
- [x] CHK-121 [P0] No feature flag applies, and routing edits ship with their manifests
- [x] CHK-122 [P1] The five canaries are the monitoring surface
- [x] CHK-123 [P1] The canary comment states the digest re-pin requirement
- [x] CHK-124 [P2] Manifest regeneration reviewed per commit
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No security review trigger in this phase
- [x] CHK-131 [P1] No dependency added
- [x] CHK-132 [P2] OWASP checklist not applicable
- [x] CHK-133 [P2] No user data handled
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] Spec, plan, tasks and acceptance criteria synchronized
- [x] CHK-141 [P1] No public API documentation applies
- [x] CHK-142 [P2] Hub-facing documentation is phase 005 work
- [x] CHK-143 [P2] The limit of keyword ownership is written down for the next reader
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [x] Approved | 2026-09-02 |
| Operator | Product Owner | [x] Approved | 2026-09-02 |
| Operator | QA Lead | [x] Approved | 2026-09-02 |
<!-- /ANCHOR:sign-off -->
