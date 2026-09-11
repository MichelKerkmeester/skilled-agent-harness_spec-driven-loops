---
title: "Tasks: Phase 1: plugin-doc-removal"
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
# Tasks: Phase 1: plugin-doc-removal

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

- [x] T001 Record the pre-state: `ls references/plugins/` (expect 14 directories plus 2 files)
- [x] T002 Record the pre-state file count under the mode root
- [x] T003 Confirm `git status --porcelain` is clean for the mode before deleting anything
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->

## Phase 2: Implementation

- [x] T004 Delete the 12 reference doc sets (`references/plugins/{advanced-canvas,charts,claudian,dataview,git,make-md,meta-bind,notion-bases,obsidian-local-rest-api,obsidian-tables,obsidian42-brat,outliner}/`)
- [x] T005 Delete the 5 asset directories (`assets/plugins/{charts,dataview,git,obsidian-tables,outliner}/`)
- [x] T006 Delete `assets/brat-data-entry.example.json`
- [x] T007 Delete the 11 feature-catalog entries under `feature-catalog/plugins/`
- [x] T008 Delete the 11 playbook tie-ins under `manual-testing-playbook/plugin-tie-ins/`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->

## Phase 3: Verification

- [x] T009 Assert `ls references/plugins/` prints exactly `health-md`, `iconic`, `installed-plugins.md`, `plugin-operation-logic.md`
- [x] T010 Assert `assets/plugins/` holds only `health-md` and `iconic`
- [x] T011 Assert `feature-catalog/plugins/` holds only `health-md.md`, `iconic.md`, `theme-system.md`
- [x] T012 Assert `manual-testing-playbook/plugin-tie-ins/` holds only `health-md-data.md`, `iconic-rules.md`, `theme-activation.md`
- [x] T013 Assert `git status --porcelain` for the mode shows 79 deletions and zero modifications
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->

## Completion Criteria

- All thirteen tasks are checked with observed evidence, not with an expectation.
- The four assertions in Phase 3 were run from the final state and their output read.
- `acceptance-criteria.md` has every row at `Met`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->

## Cross-References

- Frozen deletion inventory: `spec.md` §3 Files to Change
- Method and rollback: `plan.md` §4 and §7
- Closure gate: `acceptance-criteria.md`
- Parent: `../spec.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->

## Verification Protocol

Run every check from the final state, read its output, and record the output rather than the
intent. A deletion phase has one characteristic failure: the command ran, printed nothing, and
removed nothing, which looks exactly like success. Counting the survivors is what separates them.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->

## Pre-Implementation

- [x] The frozen list in `spec.md` §3 was read, and no path was re-derived from a glob
- [x] The working tree is clean for the mode, so the deletions are the only change in the diff
- [x] The pre-state listing is captured, so the post-state assertion has something to compare to
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->

## Code Quality

Not applicable in the usual sense: this phase deletes markdown and JSON examples and writes no
code. The equivalent discipline is that every path deleted appears literally in `spec.md` §3, and
nothing else is touched.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->

## Testing Checklist

- [ ] Pre-state recorded: 14 plugin directories present before deletion
- [ ] Post-state recorded: 2 plugin directories present after deletion
- [ ] Retained doc sets still hold 4 files each
- [x] The git diff contains deletions only
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->

## Fix Completeness

Every removed plugin must be gone from all four surfaces, not just the reference tree. The
surface most often missed is the playbook, because its files are named per scenario rather than
per plugin, and Notion Bases owns two of them.

- [ ] Reference doc sets: 12 of 12 removed
- [ ] Asset directories: 5 of 5 removed, plus the BRAT root asset
- [ ] Feature-catalog entries: 11 of 11 removed
- [ ] Playbook tie-ins: 11 of 11 removed
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->

## Security

- [ ] No credential, API key or vault path was read, written or logged
- [ ] No file outside the mode directory was touched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->

## Documentation

This phase creates dangling references on purpose and does not fix them. Phase 2 owns every
document that describes the deleted files. Nothing in this phase updates prose.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->

## File Organization

- [ ] Deletions are confined to `references/plugins/`, `assets/`, `feature-catalog/plugins/` and `manual-testing-playbook/plugin-tie-ins/`
- [ ] No empty directory is left behind by a partial delete
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->

## Verification Summary

| Check | Command | Result |
|-------|---------|--------|
| Retained reference sets | `ls references/plugins/` | done |
| Retained assets | `ls assets/plugins/` | done |
| Retained catalog entries | `ls feature-catalog/plugins/` | done |
| Retained playbook tie-ins | `ls manual-testing-playbook/plugin-tie-ins/` | done |
| Diff shape | `git status --porcelain -- <mode>` | done |

Fill the Result column with what the command printed, not with the word "pass".
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->

## L3+: Architecture Verification

- [x] The four-surface model in `plan.md` §3 matched what was actually on disk, and any mismatch was reported rather than absorbed
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->

## L3+: Performance Verification

Not applicable. Removing reference files changes how much a reader loads, which is the intent of
the packet and is not measured as a runtime property.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->

## L3+: Deployment Readiness

- [x] The change is uncommitted or committed on `skilled/v4.0.0.0`, and the state is stated plainly at handoff
- [ ] No push to a remote branch happened as part of this phase
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->

## L3+: Compliance Verification

- [x] The deletion stayed inside the frozen scope, with no adjacent cleanup folded in
- [ ] Anything noticed but out of scope was recorded rather than fixed
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->

## L3+: Documentation Verification

- [x] The handoff states which references are knowingly left dangling for phase 2
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->

## L3+: Sign-Off

| Role | Confirms | Status |
|------|----------|--------|
| Implementer | All 79 deletions applied from the frozen list | done |
| Verifier | Retained sets intact and the diff holds deletions only | done |
<!-- /ANCHOR:sign-off -->


