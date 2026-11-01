---
title: "Feature Specification: Phase 4: symlink-relink-after-unlink"
description: "The symlink engine names every run folder after the first 16 hex characters of the plan digest and refuses to write into one that exists. Unlink keeps that folder as the undo record, and an unlinked tree plans the same digest again, so no project can be relinked after an unlink. This phase gives each apply a run folder no earlier run owns."
trigger_phrases:
  - "symlink relink after unlink"
  - "phase 4 symlink relink after unlink"
  - "doctor symlink run record eexist"
  - "symlink run folder collision"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: symlink-relink-after-unlink

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-01 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 4 |
| **Predecessor** | 003-nested-skilled-root |
| **Successor** | None |
| **Handoff Criteria** | Link, unlink and relink of one plan succeeds in the engine suite, the earlier run record stays byte-identical, `run-all.sh` ends `0 failed`, and `validate.sh --strict` passes on this folder and the parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of *Doctor command audit and the fixes it recorded*: letting `/doctor:symlink` link a project again after it was unlinked.

**Scope Boundary**: `createRunRecord()` and the run-folder check in `runUnlink()` inside `.skilled/commands/doctor/scripts/symlink-engine.cjs`, the engine's test file, and the three doc lines that state the run-folder name. The record's shape, the digest and every other engine behavior stay as they are.

**Dependencies**:
- Node's `fs.mkdirSync` without `recursive`, which fails with `EEXIST` when the folder is already there and so claims a folder atomically.
- The existing engine suite `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` and its fixture helpers.

**Deliverables**:
- A `createRunRecord()` that claims `<prefix>`, then `<prefix>-2`, `<prefix>-3` and on, and never reuses, overwrites or removes an existing folder.
- A `runUnlink()` check that accepts those names for the recorded digest and still refuses any other folder.
- Two engine tests: link, unlink and relink of one plan, and a refused misnamed run folder.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`createRunRecord()` in `symlink-engine.cjs` named the run folder `path.join(RUNS_PATH, digest.slice(0, 16))` and wrote `manifest.json` there with the `wx` flag. Unlink keeps that folder as the undo record, and the unlinked tree plans the same digest again, so the next `apply --plan-digest` stops with `EEXIST` and writes nothing. No project could be relinked after an unlink with the same plan, and any apply whose digest repeats hit the same wall.

### Purpose
Every apply gets a run folder no earlier run owns, the earlier records stay untouched, and the first run of a digest keeps the plain `<prefix>` name existing tooling reads.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The new regression test against the unmodified engine (full output in `scratch/red-before-change.md`):
```text
$ node --test --test-name-pattern "relinking the same plan" .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs
✖ relinking the same plan after unlink succeeds and keeps the earlier run record intact (718.535208ms)
  AssertionError [ERR_ASSERTION]: relinking the same plan should succeed
  ERROR: cannot create run record at .../symlink-engine-source-SbePB6/.skilled/output/doctor-symlink/5a04d2913a6c3745/manifest.json: EEXIST: file already exists, open '.../doctor-symlink/5a04d2913a6c3745/manifest.json'
  2 !== 0
ℹ tests 1
ℹ pass 0
ℹ fail 1
exit=1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Claim a fresh run folder per apply with an exclusive `mkdir`, trying `<prefix>`, then `<prefix>-2` and up.
- Accept the numbered names in `runUnlink()` for the recorded digest, and keep refusing every other folder.
- Add the relink regression test and the misnamed-folder edge test to the engine suite.
- Update the three doc lines that state the run-folder name.

### Out of Scope
- Pruning old run folders - unlink keeps them by design as the undo history, and nothing in this packet deletes one.
- Changing the manifest shape or the plan digest - the record format and the digest feed other checks that this bug does not touch.
- The manual testing playbook scenario - it runs a fresh scratch repository whose first apply still gets the plain `<prefix>` name it states.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/symlink-engine.cjs` | Modify | `createRunRecord()` claims a free folder; `runUnlink()` accepts the numbered names |
| `.skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` | Modify | Relink regression test and misnamed-folder edge test |
| `.skilled/commands/doctor/symlink.md` | Modify | Step 7 names the numbered folder |
| `.skilled/commands/doctor/assets/doctor-symlink-link.yaml` | Modify | The allowed run-record target names the numbered folder |
| `.skilled/commands/doctor/_routes.yaml` | Modify | The link route's `gate3_location` names the real folder name |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | After `apply`, `unlink --yes` and a new `plan` of the same tree, `apply --plan-digest <same digest>` exits 0 and prints a run directory different from the first |
| REQ-002 | The first run's `manifest.json` is byte-identical before and after the relink, and no apply removes or overwrites an existing run folder |
| REQ-003 | The new run folder name starts with the first 16 hex characters of the digest, and the first run of a digest keeps the plain `<prefix>` name |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `unlink --run` on a numbered run folder removes that run's links, and `unlink --run` on a folder named `<prefix>-x`, `<prefix>-0` or any other name exits 2 with `does not match the recorded source and digest` |
| REQ-005 | `bash .skilled/commands/doctor/scripts/tests/run-all.sh` exits 0 and prints `0 failed` |
| REQ-006 | Every doc line that states the run-folder name states the numbered fallback |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs` moves from `fail 1` before the change to `fail 0` after it.
- **SC-002**: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` prints `7 suite(s) passed, 0 failed` after the change, as it did before.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `fs.mkdirSync` failing with `EEXIST` on an existing folder | Without it two applies could share a folder | The parent folders are made first through real directory components, and only the last segment is claimed with a plain `mkdir` |
| Risk | Loosening the unlink folder check lets a copied folder act as a record | Med | The check still requires the run folder's parent to be the runs root and its name to match `^<prefix>(-[1-9][0-9]*)?$` for the recorded digest; the edge test proves three misnamed copies are refused |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A normal apply makes one `mkdir` call for its run folder; a repeated digest adds one failed call per earlier run, capped at 1000.

### Security
- **NFR-S01**: No apply writes into, overwrites or deletes an existing run folder; the manifest is still created with the `wx` flag inside the folder the apply just made.

### Reliability
- **NFR-R01**: The 1001st apply of one digest stops with exit 2 and a message naming the runs folder, before any action, instead of looping.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no run folder exists yet, so the first apply claims the plain `<prefix>` folder as before.
- Maximum input: 1000 runs of one digest already exist, so the next apply exits 2 with `no free run directory for digest <prefix> after 1000 runs` and writes nothing in the target.
- Failure path: an empty `<prefix>` folder left by a crash is skipped rather than reused, and the apply takes `<prefix>-2`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One engine file, one test file, three doc lines |
| Risk | 8/25 | Touches the undo record and the unlink folder check |
| Research | 4/20 | Consumer inventory of run-folder names only |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
