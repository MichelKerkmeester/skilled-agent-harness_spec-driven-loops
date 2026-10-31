---
title: "Tasks: Phase 8: router-reach"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "router reach tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: router-reach

<!-- SPECKIT_LEVEL: 2 -->

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
## Phase 1: Audit

- [x] T001 Inventory every path, script, command, flag and variable the route and workflow name, each with the command that showed it (scratch/reality-check.md)
- [x] T002 Run the router-reach workflow once, read-only, and keep the full output (scratch/doctor-run.log)
- [x] T003 [P] Probe the advisor response envelope the script consumes, read-only (scratch/doctor-run.log)
<!-- /ANCHOR:phase-1 -->

---
<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Record the verdict `fix` with the evidence behind it (scratch/proposal.md)
- [x] T005 Make the probe fail closed when the advisor response is degraded, not live, or lacks an integer generation (.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs)
- [x] T006 Wire `--concurrency` through the route setup variables and the workflow flag mapping (.skilled/commands/doctor/_routes.yaml, .skilled/commands/doctor/assets/doctor-router-reach.yaml)
- [x] T007 Show router reach in the visible startup menu and the help block (.skilled/commands/doctor/assets/doctor-speckit-presentation.txt)
- [x] T008 Read the visible startup menu in the presentation parity check (.skilled/commands/doctor/scripts/route-validate.py)
<!-- /ANCHOR:phase-2 -->

---
<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run the probe live on one hub and confirm a passing result (live advisor; `--hub sk-doc --limit 5`)
- [x] T010 Run route validation, the YAML parse, the mirror check and the MCP mutation-class guard (.skilled/commands/doctor/scripts/route-validate.sh)
- [x] T011 Re-scan the edited doctor files for retired identifiers (`system_skill_advisor.`, `deep_loop_graph_status|query|convergence(`, `doctor_*`)
- [x] T012 Close the phase documentation and validate the packet (specs/system-speckit/048-doctor-command-audit/008-router-reach)
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

- [x] CHK-010 [P0] Edited assets parse and pass the route checks (`route-validate.sh`, `python3 yaml.safe_load`)
- [x] CHK-011 [P0] No new console errors or warnings: the probe prints clean rows; `route-validate.sh` prints its two known informational H1 warnings
- [x] CHK-012 [P1] Error handling implemented: a degraded, not-live or generation-less advisor response is rejected before scoring
- [x] CHK-013 [P1] Code follows project patterns: existing flag parsing and report format kept; only the response gate was added
<!-- /ANCHOR:code-quality -->

---
<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete: live probe run on `sk-doc` ends `RESULT: PASSED` with advisor generation 3
- [x] CHK-022 [P1] Edge cases: the response gate covers degraded, not-live and missing-generation envelopes; the live run exercised the live path
- [x] CHK-023 [P1] Error scenarios: a failed probe row exits 1 and reports `RESULT: FAILED`; the recorded full-fleet run shows that path
<!-- /ANCHOR:testing -->

---
<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each applied edit traces to the recorded verdict and the acceptance table
- [x] CHK-FIX-002 [P0] Same-class producer sweep: `rg` over the probe returns one response parser; no second consumer of the advisor envelope
- [x] CHK-FIX-003 [P0] Consumer sweep: the route row, workflow asset, presentation text and route validator are the four consumers of the target's flags and displays; each was read and updated where the audit found a gap
- [x] CHK-FIX-004 [P0] Adversarial response cases (degraded, absent trust state, non-integer generation) all reject before scoring; the change touches no path, redaction, parser or security boundary
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: response state × supplied flags; the live row was executed
- [x] CHK-FIX-006 [P1] Hostile env variant: `CI` set refuses a sampled `--limit` run with exit 2; `CI` was unset for the live run
- [x] CHK-FIX-007 [P1] Evidence is pinned to the worktree files after the applied edits and to the recorded outputs, not a moving branch
<!-- /ANCHOR:fix-completeness -->

---
<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets: the probe prints counts and phrases only; the response gate logs no credentials
- [x] CHK-031 [P0] Input validation implemented: `--concurrency` must be a positive integer or unset, and each flag and value is passed as separate argv
- [x] CHK-032 [P1] Auth/authz: not applicable to a read-only local diagnostic with no auth surface
<!-- /ANCHOR:security -->

---
<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate: the script usage header now lists `--concurrency`; the durable WHY comments are unchanged
- [x] CHK-042 [P2] Operator-facing text updated in the presentation asset; the batch also refreshed the doctor README surfaces
<!-- /ANCHOR:docs -->

---
<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] Scratch keeps the audit evidence (`reality-check.md`, `doctor-run.log`, `proposal.md`) as this phase's record
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-02
<!-- /ANCHOR:summary -->

---

