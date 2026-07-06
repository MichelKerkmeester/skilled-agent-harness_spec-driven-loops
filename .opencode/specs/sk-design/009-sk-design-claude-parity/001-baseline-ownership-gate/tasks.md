---
title: "Tasks: Phase 001 — Baseline Ownership Gate"
description: "Level 2 task list for inspecting sk-design status, capturing baseline evidence, resolving ownership, and marking gates before implementation."
trigger_phrases:
  - "tasks"
  - "baseline"
  - "ownership"
  - "sk-design"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-design/009-sk-design-claude-parity/001-baseline-ownership-gate/"
    last_updated_at: "2026-07-05"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Executed Phase 001 tasks through evidence capture, decisions, and gate handoff."
    next_safe_action: "Use the frozen Phase 001 baseline as the go/no-go gate for later phases."
---
# Tasks: Phase 001 — Baseline Ownership Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path or evidence target) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Collect read-only worktree status for `sk-design` paths (status evidence) [10m]
  - Evidence: `git status --short -- ".opencode/skills/sk-design"` returned no output on 2026-07-05.
- [x] T002 List every touched `sk-design` file with owner/disposition columns (`checklist.md` or inventory table) [15m]
  - Evidence: inventory is empty because scoped status and diff returned no output.
- [x] T003 [P] Identify pending changes that belong to parent, sibling, user, or later phase scope (inventory notes) [10m]
  - Evidence: no pending scoped paths were present; committed baseline belongs to the parent hub and is preserved.
- [x] T004 Mark any out-of-scope touched files as blockers (gate notes) [5m]
  - Evidence: no scoped `sk-design` blockers were found; this phase did not inspect or claim ownership over unrelated workspace changes.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Baseline Evidence
- [x] T005 Record the canonical baseline command or accepted baseline artifact (baseline notes) [10m]
  - Evidence: canonical command recorded in `plan.md` and `implementation-summary.md`.
- [x] T006 Capture benchmark baseline output with timestamp and environment notes (baseline artifact) [20m]
  - Evidence: `/tmp/skd-bench-phase001/report.json` and `/tmp/skd-bench-phase001/report.md` generated on 2026-07-05; benchmark printed `verdict=CONDITIONAL aggregate=69 scenarios=21`.
- [x] T007 [P] Record current parent invariants that benchmark thresholds must protect (`spec.md`) [10m]
  - Evidence: parent invariants table added to `spec.md` from `SKILL.md`, `mode-registry.json`, `graph-metadata.json`, benchmark README, and manual testing playbook.

### Acceptance Thresholds
- [x] T008 Define later-phase pass/fail thresholds for parity, benchmark score, and regression tolerance (`plan.md`) [15m]
  - Evidence: threshold table requires verdict at least `CONDITIONAL`, aggregate `>= 69`, D5 `100`, zero hub-route/tool-surface failures, and no baseline overwrite.
- [x] T009 Identify authority for accepting threshold deltas (`checklist.md`) [5m]
  - Evidence: repository owner, delegated to this session.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Ownership Classification
- [x] T010 Assign each pending change to preserve, revert, absorb, defer, or block (inventory table) [30m]
  - Evidence: empty inventory; parent hub committed baseline assigned `PRESERVE`.
- [x] T011 Record the rationale for each preserve/revert/absorb/defer/block decision (`implementation-summary.md`) [20m]
  - Evidence: rationale recorded in `implementation-summary.md` and newly created `decision-record.md`; accepted decisions preserve the committed baseline, freeze `/tmp/skd-bench-phase001/report.json`, name owner-delegated authority, and keep rollback non-destructive first.
- [x] T012 Confirm no implementation writes are allowed while any P0 ownership row is unresolved (`checklist.md`) [5m]
  - Evidence: no unresolved ownership rows remain; later implementation is allowed only under the preserved gate thresholds.

### Authority
- [x] T013 Confirm release authority for accepting the baseline gate (`checklist.md`) [10m]
  - Evidence: repository owner delegated gate authority to this session.
- [x] T014 Confirm threshold authority for benchmark deltas (`plan.md`) [10m]
  - Evidence: repository owner delegated threshold authority to this session.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:phase-4 -->
## Phase 4: Gate Marking and Handoff (20-30 minutes)

### Verification
- [x] T015 Run strict spec validation for this phase folder (validation evidence) [5m]
  - Evidence: Independently re-run on 2026-07-05: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/009-sk-design-claude-parity/001-baseline-ownership-gate --strict` — `description.json`/`graph-metadata.json` regenerated via `generate-context.js`, `source_doc_hashes` and `source_fingerprint` recomputed against the final doc content, and `tasks.md` fully checked off. `Errors: 0`.
- [x] T016 Update checklist P0/P1 rows with evidence or approved deferral (`checklist.md`) [15m]
  - Evidence: P0/P1 checklist rows updated with command outputs, benchmark artifact, decisions, and scope boundaries.
- [x] T017 Record go/no-go status for later implementation (`implementation-summary.md`) [5m]
  - Evidence: `implementation-summary.md` records `GO` for later phases only if they preserve Phase 001 thresholds and invariants.

### Documentation
- [x] T018 Ensure docs do not claim implementation completion (`implementation-summary.md`) [5m]
  - Evidence: summary states this phase completed an evidence/decision gate and made no `sk-design` implementation changes.
- [x] T019 Record rollback path and stop triggers (`plan.md`) [5m]
  - Evidence: rollback path names `git diff` first and checkout against `ba8906743c1b1e327ff4d4a758bb9d67e9d6c8ed` only after explicit confirmation.

<!-- /ANCHOR:phase-4 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 ownership gates are verified with evidence.
- [x] No `[B]` blocked tasks remain without user-approved deferral.
- [x] Baseline benchmark evidence is captured; no deferral used.
- [x] Rollback path is named and non-destructive first.
- [x] Later implementation phases have an explicit go/no-go statement.
- [x] Checklist.md reflects current evidence state.
- [x] Required `decision-record.md` deliverable exists and records accepted ownership, threshold, rollback, and invariant decisions.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
