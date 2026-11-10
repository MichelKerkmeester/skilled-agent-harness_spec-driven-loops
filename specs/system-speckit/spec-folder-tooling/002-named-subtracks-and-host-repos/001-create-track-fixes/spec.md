---
title: "Feature Specification: Phase 1: create-track-fixes"
description: "create.sh --track accepts three sub-track values that no reader can reach: one with a trailing slash, one that is a symlink, and one with three segments. Each leaves a packet that no children_ids list names. This phase plans the failing-first fixes."
trigger_phrases:
  - "create track fixes"
  - "phase 1 create track fixes"
  - "create.sh trailing slash track"
  - "create.sh symlinked sub-track"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: create-track-fixes

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-07 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-subtrack-predicate |
| **Handoff Criteria** | The T004-T012 behavior and verification tasks pass, the baseline is recorded, D-001 is answered, and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the 044 remediation. The parent, `specs/system-speckit/spec-folder-tooling/002-named-subtracks-and-host-repos`, is the finished sub-track build. Its deep review (`../review/review-report.md`) found two P1 defects and one P2 defect in `create.sh --track`, and `../review/p2-verification.md` confirmed them.

**Scope Boundary**: Only how `create.sh` reads and checks the `--track` value before it writes a packet. The readers, refresh, validation and the doctor engine stay as 044 left them.

**Dependencies**:
- The sub-track fixture builder `runtime/cli/tests/fixtures/subtrack-tree.mjs` from the 044 build.
- Nothing from phases 002 to 005. Phase 002 later aligns `create.sh`'s own declared-sub-track check with the other copies.

**Deliverables**:
- A normalized `--track` value, and a refusal for a symlinked, three-segment or (per D-001) undeclared sub-track, each with a failing-first test.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`create.sh --track <track>/<sub-track>/` with a trailing slash writes the packet and skips both track-root refreshes, so the sub-track and its track drift with no warning (F-P1-1, `review-report.md` section 3). A symlinked sub-track is written through into its target outside `specs/`, where no reader ever lists the packet (F-P1-2). A three-segment value such as `a/b/c` creates a packet that the sweep never reaches (P2-5, `p2-verification.md` row P2-5).

### Purpose
Every `--track` value that `create.sh` accepts produces a packet that its track or sub-track lists, or `create.sh` refuses it before any folder exists.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
# Observed 2026-11-07 in a scratch workspace: the 044 fixture tree (`buildSubtrackTree`) plus a copy of create.sh and its libraries.
$ bash create.sh --json --skip-branch --track demo/sub/ --short-name probe-a "Probe A"      # exit=0
$ ls specs/demo/sub
001-nested-probe  002-probe-a  description.json  graph-metadata.json  z_archive
demo/sub children_ids -> [ 'demo/sub/001-nested-probe' ]            # 002-probe-a is not listed
$ bash create.sh --json --skip-branch --track demo/sub --short-name probe-b "Probe B"       # exit=0, control without the slash
demo/sub: add 002-probe-b (written)
demo: up to date
$ bash create.sh --json --skip-branch --track demo/linked --short-name probe-c "Probe C"    # exit=0, demo/linked -> ../../linked-target
$ ls linked-target
001-outside-probe  002-probe-c  description.json  graph-metadata.json
$ bash create.sh --json --skip-branch --track a/b/c --short-name probe-d "Probe D"          # exit=0
$ ls specs/a/b/c
001-probe-d
demo children_ids -> [ 'demo/001-flat-probe', 'demo/sub' ]          # a/b/c is listed nowhere
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Normalize the `--track` value once, before `SPECS_DIR` is built, so a trailing slash behaves like none (F-P1-1).
- Refuse a two-segment `--track` whose sub-track is a symlink, before any folder is made, and name the reader's diagnostic (F-P1-2).
- Refuse a three-or-more-segment `--track` before any folder is made (P2-5).
- Apply the operator's answer to D-001 for an undeclared two-segment value, and rewrite the one test that asserts the old behavior.

### Out of Scope
- Aligning `create.sh`'s declared-sub-track check with the validator, archive, parser and repair copies - phase 002 owns that.
- Refusing a flat `--track` that names a symlinked track - `create-track-containment.vitest.ts:132` requires it to stay allowed.
- Any change to `refresh-track-roots.mjs` or the readers - phase 003 owns refresh.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Normalize `TRACK`, add the sub-track guard before `mkdir -p "$SPECS_DIR"`, update the refusal message that names `demo/sub` |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-track-refresh.vitest.ts` | Modify | Red cases for trailing slashes, symlink, three segments, and undeclared sub-tracks; rewrite the old undeclared case and add the flat trailing-slash case |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/create-track-containment.vitest.ts` | Modify | Declare the sub-track in the nested-path case so it checks the allowed declared path; keep the flat symlink case unchanged |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F-P1-1: `create.sh` strips one trailing slash from `--track` once, before `SPECS_DIR` is built (`create.sh:1050`, cause `create.sh:1175`) | `--track demo/sub/` lists the new packet in `demo/sub`'s `children_ids` and lists `demo/sub` once in `demo`'s, as `--track demo/sub` does, and stderr has no `was not refreshed` |
| REQ-002 | F-P1-2: `create.sh` refuses a two-segment `--track` whose sub-track is a symlink, before `mkdir` (`create.sh:1340-1344`), and names the reader's `symlinked folder skipped, not followed` diagnostic | `--track demo/linked` exits non-zero and `linked-target/` gains no folder |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | P2-5: `create.sh` refuses a `--track` of three or more segments, which `refresh_track_root` skips (`create.sh:1056-1058`) and the sweep never lists | `--track a/b/c` exits non-zero and `specs/a` does not exist afterwards |
| REQ-004 | D-001: refuse an undeclared or non-real-directory two-segment `--track` before writing anything, naming the reader's `undeclared folder ignored` diagnostic and how to declare the sub-track | `--track demo/loose` exits non-zero and `demo/loose/` gains no folder; the case at `create-track-refresh.vitest.ts:184` asserts that |
| REQ-005 | Flat tracks and declared sub-tracks behave as before, except that a flat `--track demo/` now refreshes `demo` | Every existing case in `create-track-refresh.vitest.ts`, `create-track-containment.vitest.ts` and `create-root-numbering.vitest.ts` passes; the `demo/` case is new |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The four commands in Measured Behavior, rerun after the fix, give: `demo/sub/` lists `002-*` in both metadata files, and `demo/linked`, `a/b/c` and (per D-001) `demo/loose` exit non-zero with no folder created.
- **SC-002**: The three `create-*.vitest.ts` files pass with zero failures, against the baseline taken before the first change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The 044 fixture builder and the compiled `runtime/dist` | Med: the tests cannot run without a build | Run `npm run build` in `runtime/` before the test command |
| Risk | Refusing an undeclared slash value breaks a host that creates the first packet of a new sub-track before declaring it | Med: a host script fails where it passed | T002 searches this repository for slash `--track` callers and found none outside tests and packet docs when this plan was written; a host such as Barter is UNKNOWN, so the operator answers D-001 first |
| Risk | Normalizing the slash makes a flat `--track demo/` refresh `demo`, where it was skipped silently before | Low: the refresh is the documented behavior | A new case pins it, and the change is named in REQ-005 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **D-001 (operator decision).** Before this phase, `create-track-refresh.vitest.ts` asserted that an undeclared slash value such as `demo/loose` was "left alone": exit 0, the packet was written, and nothing was refreshed. T007 replaces that behavior with refusal.
  - Option A, refuse (recommended): exit non-zero before any folder exists, naming the reader's `undeclared folder ignored` diagnostic. It closes the same orphan-packet defect as F-P1-2 and P2-5, and the review's own fix text asks for it (`review-report.md` F-P1-2 Fix, section 5 Spec Seed). The cost is one rewritten test and a host that bootstraps a sub-track by creating its first packet before declaring it.
  - Option B, warn and proceed: keep exit 0 and the write, and print one warning that the packet is listed nowhere until the folder declares `level: "sub-track"`. It keeps the old contract, and the orphan packet stays possible.
  - Status: answered. Decided 2026-11-07 by operator: Option A, refuse an undeclared two-segment value before writing anything and name the reader's `undeclared folder ignored` diagnostic with declaration guidance.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Evidence**: `../review/review-report.md`, `../review/p2-verification.md`
