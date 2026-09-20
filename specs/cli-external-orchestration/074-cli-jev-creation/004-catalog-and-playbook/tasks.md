---
title: "Tasks: Phase 4: catalog-and-playbook"
description: "Task ledger for the feature catalog and the manual testing playbook: four category files with implementation anchors, twenty-two scenarios as one file per scenario, and a run report that records its own skips."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/074-cli-jev-creation/004-catalog-and-playbook"
    last_updated_at: "2026-09-20T10:30:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Catalog and playbook authored; run report records 20 pass and 2 skips"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-004-catalog-and-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: catalog-and-playbook

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
## Phase 1: Setup

- [x] T001 Inventory the live surface: mode folder, rules, references, tests and campaign material
- [x] T002 Read a completed sibling mode's catalog and playbook for their shape rather than inventing one
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author the catalog root with a category table and the deliberate-absence list (`feature-catalog/feature-catalog.md`)
- [x] T004 Author the transport classification category (`feature-catalog/transport-classification/`)
- [x] T005 Author the judgment primitives category with the per-surface cardinality table (`feature-catalog/judgment-primitives/`)
- [x] T006 Author the dispatch guards category (`feature-catalog/dispatch-guards/`)
- [x] T007 Author the surfaces category (`feature-catalog/surfaces/`)
- [x] T008 Author the playbook root with the scenario index and execution rules (`manual-testing-playbook/manual-testing-playbook.md`)
- [x] T009 Author the invocation scenarios (`manual-testing-playbook/cli-invocation/`, four files)
- [x] T010 Author the exit-code scenarios, reusing the phase 001 matrix as their evidence (`manual-testing-playbook/exit-codes/`, eleven files)
- [x] T011 Author the guard scenarios, naming the suite test that proves each (`manual-testing-playbook/dispatch-guards/`, three files)
- [x] T012 Author the provider scenarios (`manual-testing-playbook/providers/`, three files)
- [x] T013 Author the MCP scenario (`manual-testing-playbook/mcp-server/`, one file)
- [x] T019 Restructure the playbook to the per-scenario contract and clear the package validator (`node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package cli-external-orchestration/cli-jev` → PASS, 0 violations)
- [x] T014 Record the run: verdicts, evidence paths and the delta statement (`benchmark/reports/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Count the scenarios and confirm every one carries an observable and a verdict
- [x] T020 Confirm the catalog and playbook package validators both pass for this packet
- [x] T016 Confirm the two dispatch suites that back the guard scenarios pass
- [x] T017 Confirm every catalog anchor resolves to a file that exists
- [x] T018 Reconcile the run report's tally against the scenario files after a counting slip was found in it
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — see the Verification Checklist below
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Consumes: `../001-jev-contract-research-and-pin/scratch/` and `../003-hub-mode-registration/` (the guards the scenarios exercise)
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

### Pre-Task Checklist

- Name the observable before writing the scenario, and drop the scenario if there is none
- Prefer an evidence path that already exists over a fresh run that produces the same output

### Task Execution Rules

| ID | Rule |
|----|------|
| TASK-SEQ | Catalog anchors are written after the files exist, so no anchor points at an intended path |
| TASK-EVIDENCE | A verdict is one of PASS, FAIL or SKIP with a stated blocker; there is no fourth category |
| TASK-SCOPE | Scenario files record what was observed; they are not a second implementation of the guards |

### Status Reporting Format

Status Reporting is one line per scenario: id, verdict, and the observable behind it.

### Blocked Task Protocol

No task was blocked. Two scenarios are recorded as SKIP because their observable needs a provider credential; that is a coverage limit on the run, not a blocked task in the ledger.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] [P0] The surface to be catalogued landed and passed its gates first
- [x] [P1] The sibling mode's catalog shape read before authoring, so the trees match
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] [P1] Every scenario carries a command and an expected observable
- [x] [P1] Catalog entries name the file that implements the feature
- [x] [P2] Documentation frontmatter carries the four-part version where the gate requires it
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] [P0] The scenarios backed by suites were re-run after the last source edit
- [x] [P1] The run report's tally was reconciled against the scenario files, and the first count was wrong
- [x] [P1] The skipped scenarios are marked SKIP rather than quietly dropped
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] [P0] The tally slip was fixed in the report rather than left for a reader to discover
- [x] [P1] No scenario was weakened to turn a skip into a pass
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] [P0] No scenario instructs a reader to place a real credential on a command line
- [x] [P1] The sentinel-key scenario states that its value is a dummy
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] [P0] The catalog lists what is not here, so an absence is not mistaken for an oversight
- [x] [P1] The playbook states the three permitted verdicts and the skip rule before the scenarios
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] [P1] The category and scenario folders match the sibling mode's layout
- [x] [P1] The run report lives under the benchmark tree, where the mode's other reports live
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Eighteen tasks and fifteen checklist rows closed. Twenty-two scenarios, twenty of them executed with an observable and two skipped with a stated blocker.
<!-- /ANCHOR:summary -->
