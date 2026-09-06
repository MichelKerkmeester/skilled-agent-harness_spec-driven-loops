---
title: "Tasks: reinstate the sk-design parent hub"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: reinstate the sk-design parent hub

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T###` is a stable task id. `[P]` marks a task that may run in parallel with its neighbours; tasks
without it are ordered. A task is `[x]` only when its stated evidence was observed, never because it
looked done.

All tasks below are complete. Evidence is named per task rather than summarised at the end.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Capture the sixteen-phrase routing baseline before touching anything (`scratch/routing-baseline.txt`)
- [x] **T002** Read the class contract and write down which files are required and which forbidden on a hub
- [x] **T003** Record the dirty set with `git status --porcelain`; other sessions write to this branch
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T004** Move the root content into `sk-design-fundamentals/` as 28 renames
- [x] **T005** Reduce the root `SKILL.md` from 501 lines to routing only
- [x] **T006** [P] Author `ROUTER.md` with `router_state`, `version`, `skill_pointer`, `## OVERVIEW`, `## INTENT MODEL`, and `INTENT_SIGNALS` / `RESOURCE_MAP` as dictionaries
- [x] **T007** [P] Author `description.json`, `mode-registry.json` and `hub-router.json`
- [x] **T008** Delete `leaf-manifest.config.json` and `leaf-aliases.json`; regenerate `leaf-manifest.json`
- [x] **T009** Stage everything and confirm `git diff --cached --name-status -M` shows 28 `R100` entries
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T010** Run the fleet metadata audit; require class H for `sk-design` with no forbidden file
- [x] **T011** Rebuild the advisor daemon and observe its generation move
- [x] **T012** Replay the sixteen phrases and diff against the baseline
- [x] **T013** Name the one regression and record it as an acceptance criterion of phase 003
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Fleet gate class H, no forbidden file
- [x] Two design phrases at or above baseline
- [x] `sk-design-fundamentals` resolves with a non-empty leaf set
- [x] One commit, `112d5471f4`
- [x] 28 renames, verified before committing
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`: the frozen scope and the REQ ids these tasks satisfy
- `plan.md`: the architecture, the rollback, and the decision records
- `acceptance-criteria.md`: the rows that decide whether this packet may close
- `implementation-summary.md`: what actually shipped, with the commit
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

A command counts as evidence only after its output and exit status were read. A green run lies in
several ways: a stale build, a wrong path, a silent no-op and an assertion-free check all exit 0.
Every gate below was required to print its own result line, and the routing replay was taken only after an explicit daemon rebuild.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] `spec.md` scope frozen before any file moved
- [x] Baseline captured first, because it cannot be recaptured once the tree moves
- [x] Required and forbidden file sets written down before any file was created or deleted
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] No task id, requirement id, phase number or spec path in any code comment
- [x] The root `SKILL.md` carries routing only; the work moved down rather than being rewritten
- [x] Existing patterns reused rather than replaced; no adjacent code tidied
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] Fleet metadata audit: class H, PASS
- [x] Sixteen-phrase replay: 15 unchanged, 1 regression named
- [x] `what padding should this have` at or above 0.82
- [x] `contrast ratio failure on this button` at or above 0.95
- [x] Rename detection: 28 `R100`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] Every hub-required file created, not just some
- [x] Every standalone-only file deleted, not just the obvious one
- [x] The leaf manifest regenerated rather than hand-edited
- [x] The one phrase that regressed is named, not hidden: `validate this design.md`, deliberately
      carried to phase 003 rather than tuned here
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] No credential, token or key added, moved or logged
- [x] No new network call, and no dependency installed
- [x] File moves stay inside the repository; nothing is written outside it
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] `spec.md` records the reversal of `016` and what stays retired
- [x] `implementation-summary.md` records what shipped, with the commit hash
- [x] `acceptance-criteria.md` rows carry observed evidence, not intentions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] Former root content lives under `sk-design-fundamentals/` with history intact
- [x] Nothing left at the old path that a live reference still needs
- [x] No task-created temporary file in the scoped diff
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Result |
|------|--------|
| Fleet metadata audit, class H | PASS |
| Sixteen-phrase replay | 15 of 16 unchanged |
| Stage-two leaf resolution | Non-empty |
| Rename detection | 28 of 28 `R100` |
| `validate.sh --strict` | `RESULT: PASSED` |

One phrase regressed by design of the sequencing and is carried to phase 003.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] Two-stage routing holds: the advisor scores the hub, the hub resolves the mode
- [x] The class contract holds: every required file present, every forbidden file absent
- [x] Router paths resolve to leaves that exist on disk
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

Not applicable in the runtime sense: this phase moves files and metadata and adds no code path on a
hot loop. The one measured quantity is advisor score, recorded per phrase in
`acceptance-criteria.md` rather than as a performance number.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] One commit, so the shared branch has no broken intermediate state
- [x] Advisor daemon rebuilt and its generation observed, not assumed
- [x] Rollback named in `plan.md` and reachable by a single revert
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] Moves recorded as renames, so authorship and history survive
- [x] Historical records left as written; only live references rewritten
- [x] No document claims a result that was not observed
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder, taking the first `RESULT:` line
- [x] Generated metadata regenerated after the last document edit
- [x] No spec document still carries template prose
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | [x] Approved | 2026-09-06 |
| Claude Code | Implementer | [x] Approved | 2026-09-06 |
| `validate.sh --strict` | Automated gate | [x] Approved | 2026-09-06 |
<!-- /ANCHOR:sign-off -->
