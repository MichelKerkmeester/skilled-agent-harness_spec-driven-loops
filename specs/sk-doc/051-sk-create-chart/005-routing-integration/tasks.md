---
title: "Tasks: Phase 5: routing-integration [template:level-3/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: routing-integration

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

- [x] T001 Capture a stage-one and stage-two baseline for six chart phrasings, twelve neighbour phrasings and three out-of-domain phrasings, before any edit
- [x] T002 Read the hub gate, the hub freshness verdict and the five hub canaries, and record which failures are pre-existing
- [x] T003 [P] Design the vocabulary and run every candidate in both directions against all 324 existing keywords in `hub-router.json`, `mode-registry.json` and `ROUTER.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Register the mode in `.opencode/skills/sk-doc/mode-registry.json` with `packetKind: workflow`, `command: null`, `routingClass: metadata` and 33 aliases
- [x] T005 Wire stage one in `.opencode/skills/sk-doc/hub-router.json`: a `create-chart-aliases` class, a `routerSignals` entry at weight 3 placed after the neighbour, and a `routerPolicy.tieBreak` slot
- [x] T006 Wire stage two in `.opencode/skills/sk-doc/ROUTER.md`: an intent-model bullet, a `CHART` entry in `INTENT_SIGNALS`, a `CHART` entry in `RESOURCE_MAP` naming three leaves, and the mode's reference leaves in `FULL_INVENTORY`
- [x] T007 Add the advisor vocabulary to `.opencode/skills/sk-doc/graph-metadata.json` and `.opencode/skills/sk-doc/description.json`, which is the only path a metadata-class mode has to stage one
- [x] T008 Add the mode-table row to the hub `SKILL.md` and correct every packet count it carries
- [x] T009 Regenerate `.opencode/skills/sk-doc/leaf-manifest.json`, and drop the three `.gitkeep` placeholders that would otherwise be indexed as routable leaves
- [x] T010 Correct the mode's `SKILL.md`, `README.md` and `references/README.md`, which described a report mode and gallery pages that do not exist
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Replay stage two on all 33 keywords and on the full prompt matrix, and confirm every neighbour resolves exactly as it did at baseline
- [x] T012 Replay stage one through the live advisor on the same matrix, and close every phrasing where the two stages disagreed
- [x] T013 Add the `single-create-chart` canary case, re-pin the drifted digests and refresh the live-topology counts
- [x] T014 Withdraw the registration, re-pin so the digest tripwire cannot mask the result, and confirm the canary fails on the route case
- [x] T015 Restore byte-exact, rebuild and confirm the canary returns to green with the same policy hash
- [x] T016 Refresh the compiled manifest in the authored tree, sync, verify and finalize, then confirm all five hubs report `compiled-serving`
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
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [x] CHK-010 [P0] `parent-skill-check.cjs` on the hub exits 0 with zero warnings
- [x] CHK-011 [P0] No console errors from the canary, the corpus check or the sync gates
- [x] CHK-012 [P1] The withdrawn-registration control produces a named assertion failure rather than a crash
- [x] CHK-013 [P1] Every new surface follows the shape the neighbouring modes already use
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete across both stages
- [x] CHK-022 [P1] Edge cases tested: bare keyword fragments, out-of-domain phrasings and the tie behaviour against the nearest neighbour
- [x] CHK-023 [P1] Error scenarios validated: withdrawn registration, stale digests and a stale compiled manifest
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: the unreachable mode was `cross-consumer`, since every routing surface had to carry it, and the stale hub documents were `instance-only`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed: the effective vocabulary is the union of registry aliases and router class keywords, and both were edited
- [x] CHK-FIX-003 [P0] Consumer inventory completed across all eleven surfaces in the nested-packet reference, with rows 10 and 11 not applicable to a metadata-class mode with no command
- [x] CHK-FIX-004 [P0] Adversarial cases run: bare fragments, out-of-domain phrasings and every neighbour prompt
- [x] CHK-FIX-005 [P1] Matrix axes listed: 33 keywords by two stages, plus 21 prompts by two stages
- [x] CHK-FIX-006 [P1] Hostile-state variant executed: the withdrawn-registration control ran with every digest refreshed so nothing could mask the result
- [x] CHK-FIX-007 [P1] Evidence pinned to the effective policy hash `89c1ece2471ee901f8b68509dcfdd99a4877f5391145f8b1af112f62be41d4eb` rather than to a moving range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Input validation unchanged: routing files are policy inputs and carry no credential surface
- [x] CHK-032 [P1] Auth/authz not applicable to this surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate, with the re-pin comments explaining why each digest moved
- [x] CHK-042 [P2] The mode's README corrected alongside its `SKILL.md`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in the session scratchpad only
- [x] CHK-051 [P1] No task-created residue in the scoped diff
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `plan.md`, which carries both ADRs for this phase
- [x] CHK-101 [P1] Both ADRs carry an Accepted status
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] Migration path documented in the rollback section
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] NFR-P01 met: every neighbour prompt resolves identically before and after
- [x] CHK-111 [P1] Throughput targets not applicable to a routing policy change
- [x] CHK-112 [P2] Load testing not applicable
- [x] CHK-113 [P2] The keyword sweep stands in for a benchmark, at 33 keywords by two stages
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented, and the sync tool retained its rollback until the gates passed
- [x] CHK-121 [P0] Feature flag not applicable
- [x] CHK-122 [P1] Monitoring covered by the canary and the per-hub gate
- [x] CHK-123 [P1] Runbook captured in the plan rollback section
- [x] CHK-124 [P2] Publication followed the documented refresh sequence
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Security review not applicable to a routing policy change
- [x] CHK-131 [P1] No dependency added
- [x] CHK-132 [P2] OWASP not applicable
- [x] CHK-133 [P2] No data handling in scope
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] API documentation not applicable
- [x] CHK-142 [P2] The mode's user-facing documents corrected
- [x] CHK-143 [P2] Knowledge transfer captured in `implementation-summary.md`
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | |
| Operator | Product Owner | [ ] Approved | |
| Operator | QA Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
