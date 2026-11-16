---
title: "Feature Specification: Phase 14: harden-overlay-engine-from-fable-review"
description: "A read-only Fable 5.2 review of the overlay engine named ten harden and UX gaps. The operator chose nine of them in four groups: a pinned-copy cross-check, apply-failure state, status honesty and data safety."
trigger_phrases:
  - "harden overlay engine from fable review"
  - "phase 14 harden overlay engine from fable review"
  - "overlay pinned copy cross check"
  - "overlay apply failure state record"
  - "overlay status honesty no checkout note"
importance_tier: "important"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: harden-overlay-engine-from-fable-review

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/425-repin-engine-limits-intake` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 14 |
| **Predecessor** | 013-fix-review-findings-in-json-entry-set-restore |
| **Successor** | None |
| **Handoff Criteria** | `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` with a new test for each of the nine items in the count |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the skill and overlay build. It hardens the overlay engine after phase 13 shipped at `969335a6380`, from the ten items in `../013-fix-review-findings-in-json-entry-set-restore/scratch/fable-harden-ux-answer.md`.

**Scope Boundary**: the overlay engine's json-entry planning, its apply and state writes, its status report, and the docs and command assets that describe them.

**Dependencies**:
- Phase 13's `sets` and `items` records and its `cannot-apply` state.

**Deliverables**:
- Engine and test changes in the overlay engine, the overlay reference and the doctor overlay command assets.
- A Barter handover for any change a vendoring project sees.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A json-entry overlay is the only scope whose bytes come from the live file rather than from a source, so the restore has to guess what the overlay wrote before. Three fix rounds each patched one more guess. Around it, a failed apply loses item records for good, a rerun does not rerun a failed generator, a status can pass without saying what it could not check, and a torn or rewritten state file makes later drops go silent.

### Purpose
Every json-entry difference the records cannot see is reported, and no failed run, missing checkout, malformed file or interrupted write leaves the engine silent or stuck.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
N/A: nothing is reproduced yet. Fable 5.2 read the code and ran none of it, and
this phase's first tasks write the probes. The anchors below were re-read in
overlay-engine.cjs at 969335a6380:
- applyUnderLock returns EXIT_CONFLICT on a failed regenerate and on an
  unresolved check before writeStateIfChanged runs (items 2 and 3).
- isRegenerated = written > 0 || options.isRegenerateForced === true (item 3).
- staleRootFiles returns [] when pinnedUpstreamBytes is null (item 4).
- pinnedUpstreamBytes tests isDirectory(pin.checkout) as given (item 4).
- planJsonOverlay calls JSON.parse on the entry set before its try (item 5).
- restoreDroppedSets never reads `added`; the wasAdded lookup uses deepEqual,
  not samePath (item 7).
- STATE_SCHEMA_VERSION = 1 with links, items and sets added under it (item 8).
- writeStateIfChanged and the manifest writers call fs.writeFileSync in place
  (item 10).
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Cross-check: when the pinned copy is readable, also apply the entry set to the pinned text and report any difference from the live result as a status line (Fable item 1).
- Apply-failure state: record `files`, `items` and `sets` right after the destination writes, and rerun a failed regenerate step on the next apply (items 2 and 3).
- Status honesty: print a `NOTE` when the upstream checkout cannot be read, resolve `pin.checkout` against the tree root, report a malformed entry set as a problem naming its file, and print a `NOTE` for each operation the engine cannot track (items 4, 5 and 9).
- Data safety: read the `added` flag before deleting a key, check record shapes when the state loads, and write the state and manifest through a temporary file and a rename (items 7, 8 and 10).

### Out of Scope
- Making the pinned-copy result the write path. The operator chose the comparison only; the write path is a later decision.
- Fable item 6, a status line per pending json-entry removal. The operator did not choose it.
- The two items Fable held back: which overlay-folder files to commit, and widening the pre-backup re-pin check beyond json-entry files the copy leaves in place.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | The nine fixes |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modify | Tests for the apply, status and data-safety items |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modify | The cross-check on a re-pin |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | The new `NOTE` lines, the cross-check and the `pin.checkout` resolution |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` and `assets/doctor-overlay-{apply,status}.yaml` | Modify | The rerun advice and the new status lines |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A failed regenerate or unresolved check keeps the records of what the run wrote | A test fails a regenerate step, fixes it, reruns apply and then drops the added item, and the item leaves the file |
| REQ-002 | A rerun of apply after a failed regenerate step reruns that step | The same test sees the step run on the rerun and the verify steps run after it |
| REQ-003 | A dropped key the overlay did not add is refused, not deleted | A test with a hand-added key that a `set` later named refuses the drop and leaves the key |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | When the pinned copy is readable, a json-entry result that differs from the entry set applied to the pinned text is reported | A test with a dropped `setKeyOnItem` prints a cross-check line naming the destination |
| REQ-005 | A status with no readable checkout says what it skipped | A test with no checkout prints one `NOTE` line naming the stale-root check |
| REQ-006 | A relative `pin.checkout` resolves against the tree root | A test runs status from another directory and reads the checkout |
| REQ-007 | A malformed entry set blocks only its own overlay and names its file | A test with broken JSON in one entry set still reports the other overlays and names `entry.source` |
| REQ-008 | An operation the engine cannot track gets a non-failing `NOTE` line | A test with `setKeyOnItem` and an indexed `set` prints a `NOTE` for each and exits 0 |
| REQ-009 | A state record with a bad shape is refused with a fix | A test with a record lacking `path` exits 2 and names the record |
| REQ-010 | The state file and the manifest are written atomically | A test checks that each write goes through a temporary file and a rename |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` with at least ten more tests than the 1220 it printed at `969335a6380`.
- **SC-002**: The probes this phase writes for items 2, 3 and 5 show the problem on `969335a6380` and not on the built engine.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Barter's manifest may give `pin.checkout` as a relative path | Med | The handover names the change, and the re-pin of Barter waits for it |
| Risk | Reading `added` refuses keys an older engine wrote, which carry `added: false` | Med | Decide with the operator before building; the refusal names the fix |
| Risk | The cross-check reports differences the records already handle, as noise | Low | Report only where the two results differ after the restore runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Item 7: should keys an older engine wrote, which carry `added: false`, be refused once, or should the first apply on the new engine mark them?
- Item 8: bump the state `schemaVersion` to 2 with a migration, or keep version 1 and print a note when a manifest holds json-entry sets the state has no key for?
- Item 4: does Barter's manifest give `pin.checkout` as a relative path today?
<!-- /ANCHOR:questions -->

---
