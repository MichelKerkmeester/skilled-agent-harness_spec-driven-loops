---
title: "Tasks: Phase 6: lifecycle-command-asset-merge"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "lifecycle command merge tasks"
  - "execution mode branch task"
  - "save context tail task"
  - "command tree parity verification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 6: lifecycle-command-asset-merge

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

- [x] T001 Diff each auto/confirm pair to confirm the only divergence is the checkpoint line and the completion-rule wording (.opencode/commands/speckit/assets/speckit-{plan,implement,complete}-{auto,confirm}.yaml)
- [x] T002 [P] Grep every reference to the six asset file names across commands, CI and the runtime-mirror script (.opencode/commands, .claude/commands, .github/workflows, .opencode/skills/system-spec-kit/runtime/cli/runtime-mirrors)
- [x] T003 [P] Grep every `save_context` and `validate.sh [SPEC_FOLDER] --strict` call site across the six assets to build the extraction and comment list (.opencode/commands/speckit/assets/)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Merge `speckit-plan-auto.yaml` and `speckit-plan-confirm.yaml` into `speckit-plan.yaml` with an `execution_mode` field and a per-step `checkpoint` flag (.opencode/commands/speckit/assets/speckit-plan.yaml)
- [x] T005 Merge `speckit-implement-auto.yaml` and `speckit-implement-confirm.yaml` into `speckit-implement.yaml` (.opencode/commands/speckit/assets/speckit-implement.yaml)
- [x] T006 Merge `speckit-complete-auto.yaml` and `speckit-complete-confirm.yaml` into `speckit-complete.yaml` (.opencode/commands/speckit/assets/speckit-complete.yaml)
- [x] T007 Extract the shared `save_context` tail into one asset under one placeholder convention, referenced by all three merged assets (.opencode/commands/speckit/assets/)
- [x] T008 Add a one-line cadence comment to every `validate.sh [SPEC_FOLDER] --strict` call site in the three merged assets (.opencode/commands/speckit/assets/speckit-{plan,implement,complete}.yaml)
- [x] T009 Update `plan.md`, `implement.md` and `complete.md`'s asset-path tables from two files per command to one (.opencode/commands/speckit/plan.md, implement.md, complete.md)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Parse each merged asset and the shared tail with PyYAML (.opencode/commands/speckit/assets/)
- [x] T011 Run `validate-command-tree-parity.sh` and `sync-runtime-mirrors.cjs --check` against the merged tree (.opencode/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh, .../runtime-mirrors/sync-runtime-mirrors.cjs)
- [x] T012 Extract step names from the three merged assets and confirm no verbatim-duplicate sequence beyond `complete`'s documented reuse (.opencode/commands/speckit/assets/)
- [x] T013 Run strict validation on this child and regenerate its metadata (../spec.md)
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: REQ-001 through REQ-005 present in spec.md §4]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md §3 names the execution_mode branch and the shared tail asset]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: 011-command-surface-contract-realignment and 020-.../implementation-summary.md confirmed shipped]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: PyYAML parse of the three merged assets and the shared tail exits 0]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: `command-tree-parity` checker run output shows zero diff lines]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: a step whose checkpoint flag is missing defaults to no pause rather than crashing the agent's read of the asset]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: the merge follows the literal-replacement discipline 011-command-surface-contract-realignment used on the same six files]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md every row Met]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: `speckit-plan.yaml` read as both modes: auto skips the seven `applies_to: confirm` blocks, confirm runs them in step order with the `mode_overrides.confirm` wording; the workflow test asserts every checkpoint step carries such a block]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: `:autopilot`/`:unattended` mode, which currently maps to the auto asset with extra task metadata, still resolves correctly against the merged file]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: a merged asset that fails YAML parse is confirmed to block the merge commit rather than ship broken]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: cross-consumer, since the merge changes files consumed by two runtimes' command trees and a CI parity check]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: T001's diff of all three auto/confirm pairs]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: T002's grep of every reference to the six file names across commands, CI and the mirror script]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not applicable. No path, parser or redaction boundary in this merge]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: plan.md's Affected Surfaces matrix axes row: command by execution mode]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: not applicable. The assets carry no process-wide state, only a per-invocation execution_mode]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: the private-index commit that lands this child; its SHA is recorded in the parent goal log]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: diff review of the three merged assets and the shared tail contains no credential-shaped string]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: `execution_mode` is validated against the known set (auto, confirm, autopilot) before a step's checkpoint flag is read]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable. No auth surface touched]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: requirement IDs in spec.md match the AC-ID to REQ-ID mapping in acceptance-criteria.md]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: every validate.sh call site's new cadence comment read for clarity]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: .opencode/commands/speckit/README.txt checked for a workflow-count or asset-list reference that would need updating]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: diff and grep working files written under this packet's scratch/, not the repo root]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `git status` on this packet's scratch/ shows only the pre-existing brief; no task file was written there]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
