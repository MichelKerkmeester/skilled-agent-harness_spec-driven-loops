---
title: "Verification Checklist: sk-code--opencode refinement"
description: "Verification checklist with P0/P1/P2 gates and evidence slots for implementation and closure."
SPECKIT_TEMPLATE_SOURCE: "checklist + level2-verify + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "verification"
  - "checklist"
  - "p0"
  - "global quality sweep"
importance_tier: "critical"
contextType: "verification"
---
# Verification Checklist: sk-code--opencode refinement

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + all addendums | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot claim completion until all are checked with evidence |
| **P1** | Required | Must complete or be explicitly user-approved for deferral |
| **P2** | Optional | May defer with rationale and follow-up owner |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:p0 -->
## P0 - Hard Blockers

- [ ] CHK-001 Scope and requirements are frozen to `spec.md` section 3.
  - **Evidence Slot**: Scoped file table in `spec.md` plus this checklist scope lock.
- [ ] CHK-002 Planning docs exist and are implementation-ready (`plan.md`, `tasks.md`, `decision-record.md`, `global-quality-sweep.md`).
  - **Evidence Slot**: File creation completed in this spec folder.
- [ ] CHK-003 Tasks include mandatory global quality sweep phase covering all changed files.
  - **Evidence Slot**: `tasks.md` Phase 5 includes T050-T055.
- [ ] CHK-004 Reduced inline-comment policy and AI semantics are implemented in all required `sk-code--opencode` files.
  - **Evidence Slot**: `rg -n "Maximum 3 comments per 10 lines|WHY|GUARD|INVARIANT|REQ-|BUG-|SEC-|RISK|PERF"` over scoped policy files.
- [ ] CHK-005 Numbered ALL-CAPS section header convention is preserved in shared and language guides.
  - **Evidence Slot**: `rg -n "^## [0-9]+\\. [A-Z0-9 ()/:-]+$"` over shared/language style guides.
- [ ] CHK-006 KISS/DRY plus SOLID checks are present at required depth in scoped checklists.
  - **Evidence Slot**: `rg -n "KISS|DRY|SRP|OCP|LSP|ISP|DIP"` over universal and language checklists.
- [ ] CHK-007 Mandatory global quality sweep has completed all required steps.
  - **Evidence Slot**: `global-quality-sweep.md` EVT-001 through EVT-004 set to Closed.
- [ ] CHK-008 Closure defect threshold met: unresolved `P0=0` and `P1=0`.
  - **Evidence Slot**: Closure gate row and defect log summary in `global-quality-sweep.md`.
- [ ] CHK-009 Spec validation script passes for this folder.
  - **Evidence Slot**: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/002-commands-and-skills/043-sk-code-opencode-refinement` exit code 0.
<!-- /ANCHOR:p0 -->

---

<!-- ANCHOR:p1 -->
## P1 - Required (or Approved Deferral)

- [ ] CHK-020 Optional `sk-code--review` alignment decision is explicitly documented.
  - **Evidence Slot**: ADR-005 plus EVT-004 outcome (Applied or N/A with rationale).
- [ ] CHK-021 Optional review edits, when triggered, remain minimal and preserve findings-first baseline behavior.
  - **Evidence Slot**: Scoped diff review + `rg` checks in review files.
- [ ] CHK-022 All five spec docs are synchronized with final execution state.
  - **Evidence Slot**: Final consistency pass across `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`.
- [ ] CHK-023 Verification command outputs are logged in sweep evidence table.
  - **Evidence Slot**: EVT table command and artifact fields completed.
- [ ] CHK-024 Rollback procedure is documented and usable if any gate fails.
  - **Evidence Slot**: `plan.md` sections 7 and L2 enhanced rollback.
<!-- /ANCHOR:p1 -->

---

<!-- ANCHOR:p2 -->
## P2 - Optional Improvements

- [ ] CHK-030 Add automation wrapper script for recurring policy assertion commands.
  - **Evidence Slot**: Script path and successful dry run output.
- [ ] CHK-031 Add condensed verification runbook for contributors.
  - **Evidence Slot**: Documentation link with command sequence and troubleshooting notes.
- [ ] CHK-032 Add follow-up issue for extended config parity if not completed in-scope.
  - **Evidence Slot**: Issue reference and owner.
<!-- /ANCHOR:p2 -->

---

<!-- ANCHOR:global-sweep -->
## Mandatory Global Quality Sweep Gate

- [ ] GQS-001 Global Testing Round completed for all changed files.
  - **Evidence Slot**: EVT-001 status and artifact link.
- [ ] GQS-002 Global Bug Detection Sweep completed.
  - **Evidence Slot**: EVT-002 status and unresolved defect counts.
- [ ] GQS-003 `sk-code--opencode` compliance audit completed.
  - **Evidence Slot**: EVT-003 status and command logs.
- [ ] GQS-004 Conditional standards update pathway decision completed.
  - **Evidence Slot**: EVT-004 status with rationale.
- [ ] GQS-005 Closure gate marked SATISFIED.
  - **Evidence Slot**: Closure decision text in `global-quality-sweep.md`.
<!-- /ANCHOR:global-sweep -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 |
| P1 Items | 5 | 0/5 |
| P2 Items | 3 | 0/3 |
| Global Sweep Items | 5 | 0/5 |

**Verification Date**: 2026-02-22
**Current Status**: Documentation setup complete; implementation and sweep execution pending.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF TRACKING

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Spec owner | Technical Lead | Pending | 2026-02-22 |
| Standards maintainer | Product Owner | Pending | 2026-02-22 |
| Quality owner | QA Lead | Pending | 2026-02-22 |
<!-- /ANCHOR:sign-off -->
