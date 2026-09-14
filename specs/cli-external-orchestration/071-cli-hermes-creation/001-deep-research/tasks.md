---
title: "Tasks: Hermes runtime deep research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Hermes runtime deep research

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

- [x] T001 Survey the six runtime packets, the hub registries, the dotfolders and the runtime enumeration points (resource-map.md)
- [x] T002 Inspect the local Hermes install: version, help surfaces, loaders for AGENTS.md and project skills (resource-map.md)
- [x] T003 Author the ten research angles and rules of engagement (research-angles.md)
- [x] T004 Resolve model ids on the cli-devin route: `deepseek-v4-flash-max`, `swe-2-max` (plan.md ADR-001)
- [x] T005 Persist the run config with two lineages and `stop_policy: max-iterations` (research/deep-research-config.json)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Launch `fanout-run.cjs` with `--loop-type research`, `--stop-policy max-iterations`, concurrency 2 (research/orchestration-status.log)
- [x] T007 Monitor the status ledger for lineage start, retry and completion events (research/orchestration-status.log)
- [x] T008 Run `fanout-merge.cjs` and emit the fan-out resource map (research/findings-registry.json, research/fanout-attribution.md, research/resource-map.md)
- [x] T009 Write the consolidated synthesis from both lineage syntheses: ranked findings, comparison table, recommended plan, disagreements, open questions (research/research.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Count iteration files per lineage and confirm each terminal synthesis records `maxIterationsReached` (research/lineages/*/deep-research-state.jsonl)
- [x] T011 Resolve a sample of citations from each lineage against the installed Hermes source and the repo (research/lineages/*/research.md)
- [x] T012 Confirm nothing outside `research/` changed (`git status --short`)
- [x] T013 Present findings and recommendations in chat; record the operator's confirmation in the parent goal log (../goal.md)
- [x] T014 Fill the implementation summary, acceptance criteria and goal log; run `validate.sh --strict` (implementation-summary.md, acceptance-criteria.md, goal.md)
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

- [x] CHK-010 [P0] Research artifacts pass the runner's artifact checks (orchestration-summary.json: succeeded 2 of 2, salvage_miss 0)
- [x] CHK-011 [P0] Runner exit and status ledger read, not only the exit code
- [x] CHK-012 [P1] Failed lineages re-dispatched or recorded as findings (none failed)
- [x] CHK-013 [P1] Synthesis follows the 045 research.md shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Iteration caps verified on disk
- [x] CHK-022 [P1] Citation sample resolves
- [x] CHK-023 [P1] Lineage disagreements named in the synthesis
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Not applicable: research phase, no fix
- [ ] CHK-FIX-002 [P0] Not applicable
- [ ] CHK-FIX-003 [P0] Not applicable
- [ ] CHK-FIX-004 [P0] Not applicable
- [ ] CHK-FIX-005 [P1] Not applicable
- [ ] CHK-FIX-006 [P1] Not applicable
- [ ] CHK-FIX-007 [P1] Not applicable
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential value from `~/.hermes/.env` in any artifact (both lineages enumerated key names only; the file holds no provider keys)
- [x] CHK-031 [P0] No mutating `hermes` command run by a lineage (both scope records list read-only commands only; `~/.hermes/config.yaml` unchanged)
- [x] CHK-032 [P1] Smoke dispatches capped at two per lineage (zero ran: no provider configured)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Goal log updated
- [ ] CHK-042 [P2] Parent phase map status updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 12 | 8/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-09-14
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decision documented (plan.md ADR-001)
- [x] CHK-101 [P1] ADR has status
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Migration path documented (not applicable)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Iterations within the 900-second timeout (NFR-P01)
- [ ] CHK-111 [P1] Lineages within the 4-hour ceiling
- [ ] CHK-112 [P2] Not applicable
- [ ] CHK-113 [P2] Not applicable
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented (plan.md)
- [x] CHK-121 [P0] Feature flag not applicable
- [ ] CHK-122 [P1] Status ledger monitored
- [ ] CHK-123 [P1] Not applicable
- [ ] CHK-124 [P2] Not applicable
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] Read-only access to the operator's Hermes config confirmed after the run
- [ ] CHK-131 [P1] Not applicable
- [ ] CHK-132 [P2] Not applicable
- [ ] CHK-133 [P2] Not applicable
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized
- [ ] CHK-141 [P1] Not applicable
- [ ] CHK-142 [P2] Not applicable
- [ ] CHK-143 [P2] Findings presented in chat
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
