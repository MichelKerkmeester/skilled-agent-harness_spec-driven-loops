---
title: "Feature Specification: Phase 10: fix-barter-repin-handover-items-for-overlay-engine"
description: "Barter's re-pin to d0fc9d719b was stopped or failed by four overlay engine limits and worked around by hand. Barter also asked what vocabularyMirrors means for a host and found that no install path builds the history lookup package. This phase records the six items, checks each against Skilled's code and plans the fixes."
trigger_phrases:
  - "fix barter repin handover items for overlay engine"
  - "phase 10 fix barter repin handover items"
  - "repin link replaced by folder"
  - "directory overlay upstream-moved after rebase"
  - "vocabulary mirrors host opt out"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: fix-barter-repin-handover-items-for-overlay-engine

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/425-repin-engine-limits-intake` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-overlay-write-checks-follow-up |
| **Successor** | None |
| **Handoff Criteria** | The five checks in `handover-from-barter.md` section 4 pass in Skilled's own tests, and Barter can re-pin without its two workaround scripts |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the skill and overlay build. It takes in the handover Barter wrote after its re-pin from `edf921316c` to `d0fc9d719b` on 2026-11-16. The handover is copied byte for byte into this folder as `handover-from-barter.md`.

**Scope Boundary**: The overlay engine's re-pin and classification code, the documentation of two settings and the install guide. Barter's tree under `barter/ai-speckit` is read-only for a Skilled session.

**Dependencies**:
- The overlay engine at `.skilled/commands/doctor/scripts/overlay-engine.cjs`. No commit has touched it since the pin Barter reported against, so the handover describes current code.
- Barter's second handover, items 7 to 10, arrived during the build. It is copied as `handover-from-barter-024.md` and is not part of this phase.

**Deliverables**:
- The handover copy, this specification, `plan.md` and `tasks.md`.
- The fixes in `tasks.md`, each with a test that failed first, and `handover-to-barter.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A project that vendors Skilled re-pins to take a new upstream commit. Barter's re-pin to `d0fc9d719b` was refused by its first two stage runs, and its live run copied 3,385 paths, set the pin and then failed before its apply and verify steps ran. Barter finished by hand with two scripts and a temporary `repin.exclude` entry, so the next vendoring project meets the same stops with no documented way through.

### Purpose
A re-pin across the four situations Barter met ends `RESULT: PASSED` without a workaround script, and a host can read what `vocabularyMirrors` means for it and how the history lookup package gets built.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

The command below counts the refusal and blocked lines in the four runs Barter captured. It was run from the primary checkout root on 2026-11-16, where `S` is `barter/ai-speckit/specs/skilled-barter-overlays/002-spec-tracks-restructure/023-repin-d0fc9d719b/scratch`.

```text
$ for f in stage1 stage2 stage3 live; do printf '%s refuse=%s blocked=%s %s\n' $f "$(grep -c '^refuse' $S/$f.log)" "$(grep -c '^blocked' $S/$f.log)" "$(grep '^RESULT' $S/$f.log)"; done
stage1 refuse=19 blocked=0 RESULT: FAILED
stage2 refuse=1 blocked=0 RESULT: FAILED
stage3 refuse=0 blocked=29 RESULT: STAGED
live refuse=0 blocked=29 RESULT: FAILED

$ grep '^blocked' $S/live.log | awk '{print $3}' | sort | uniq -c
  11 live-edited
  18 upstream-moved

$ grep '^blocked' $S/live.log | awk '{print $2}' | sort | uniq -c
  28 repo-frontend:
   1 sk-git-root:
```

These logs are Barter's captures, read here and not rerun. Each item that needed an engine change was reproduced in Skilled's own test fixtures before its fix.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Let a re-pin replace a link with a folder when the old pin holds the link and the new pin holds files below that path (handover item 1).
- Let a `directory` or `skill-root` overlay finish a re-pin when upstream changed or added a file under it, through one `rebasedOnto` value on the entry, and make a stage that is not clean end `RESULT: BLOCKED` (item 2).
- Let a `json-entry` `set` add its key when the document does not hold it yet, so it passes `status` at the old pin (item 3).
- Document that a regenerate step's `outputs` list is what marks a generator-written file. An existing test already proves it, so no engine change (item 4).
- State what `vocabularyMirrors` means for a host, and name the step that builds the history lookup package in the install guide (items 5 and 6).

### Out of Scope
- Changing anything under `barter/ai-speckit` - Barter's tree is read-only here. What Barter does after the fixes ship is written to a handover in this packet.
- The three items still open from Barter's earlier handover (a host's own `pre-commit` in `git-setup-check.cjs`, captured fixtures that differ in a host, `apply --adopt` under `repin.exclude`) - they are named in `handover-from-barter.md` section 2 and belong to their own packet.
- Barter's choice to keep its own frontend packet - the handover marks it as not Skilled's.
- A folder the new pin replaces with a link, the reverse of item 1 - no project has met it, and it would roughly double the change. The handover proposed it. It stays refused as before.
- A hash per file on a folder overlay, the form the handover proposed for item 2 - one value per entry does the job with one edit per re-pin instead of one per changed file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | `unownedDrift` for the link replaced by a folder, `planDirectoryOverlay` and `classifyDestination` for folder overlays, the stage result word, and `set` in `planOperation` |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modify | One failing-first test per re-pin item |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-sync.test.cjs` | Modify | The failing-first test for `set` |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | The link and folder swap, the folder overlay rebase record, the stage result and the regenerate `outputs` list |
| `.skilled/skills/sk-code/README.md` | Modify | What `vocabularyMirrors` means for a host hub |
| `INSTALL-SKILLED.md` | Modify | The history lookup package's build step |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A re-pin replaces a link with a folder when the old pin holds a link at a path and the new pin holds files below it. | In a fixture where the old pin has a link and the new pin has a folder of files at the same path, the live run ends `RESULT: PASSED` with no `repin.exclude` entry. A new upstream file that a project's own link already reaches still refuses. |
| REQ-002 | A live re-pin applies a `directory` or `skill-root` overlay whose owner has rebased it, when upstream changed a file under it. A file upstream added under a `directory` overlay that the overlay's copy lacks is the overlay's to delete. | In a fixture where upstream changes one file and adds one file under a `directory` overlay, and the entry's `rebasedOnto` names the new pin, the live run prints no `blocked` line and ends `RESULT: PASSED`. Without that value, or with another commit in it, the changed file still reads `upstream-moved`. A file a person added by hand still reads `live-edited`. |
| REQ-003 | A stage and the live run agree. A stage that prints a `blocked` line does not end `RESULT: STAGED`. | A stage that is not clean ends `RESULT: BLOCKED`. It already exited 1 before this change, so only the word moves. A clean stage still ends `RESULT: STAGED` and exits 0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | A `json-entry` `set` on a key the new pin adds does not block the re-pin at the old pin. | A `set` on a key the document lacks adds the key after the object's last member and `apply` exits 0. A `set` whose path runs through an object that is not there still prints `missing key`. |
| REQ-005 | A file a regenerate step writes is not refused as an unowned edit when the step lists it under `outputs`. | The existing test `an unowned file edited in place refuses the repin, names the path and writes nothing` asserts no `unowned` line for the listed output `.codex/hooks.json`. `overlays.md` says the `outputs` list is how a step declares what it writes. |
| REQ-006 | `vocabularyMirrors` is documented for a host. | `.skilled/skills/sk-code/README.md` says that a host hub keeping its own packet for a surface removes that surface from the list. |
| REQ-007 | The install guide names the history lookup package's build. | `rg -n 'session-handover/history' INSTALL-SKILLED.md` prints at least one line, and following the guide leaves `.skilled/hooks/session-handover/history/dist/cli.js` in place. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests/` passes with the new tests, and each new test failed before its fix.
- **SC-002**: The five checks in `handover-from-barter.md` section 4 each map to a passing test or a documented step.
- **SC-003**: A handover to Barter in this packet names which workaround Barter drops after each fix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Barter's manifest | Items 2 and 4 take effect only once Barter sets `rebasedOnto` and lists its generator's `outputs` | Both steps are written to `handover-to-barter.md` in this folder. |
| Risk | Loosening `unownedDrift` or `classifyDestination` lets a re-pin overwrite a person's edit | High. The refusals exist to stop exactly that. | Each change is narrowed to the measured case and paired with a test that the nearest person-edit case still refuses. |
| Risk | The rebase record for a folder overlay is a new manifest field, `rebasedOnto` | Medium. Every field is a row in the docs and an axis in the tests. An owner can also set it without reading every changed file. | One value per entry, valid for one commit only, so the next re-pin asks again. Without it `repo-frontend`'s 18 paths have no way to pass. |
| Risk | `set` now adds a missing last key, so a mistyped key creates a new key instead of failing | Low. The path up to the last key must still exist. | The test asserts a missing parent still prints `missing key`. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is removing a surface from `vocabularyMirrors` the supported way for a host to keep its own keyword set, or should the router-sync check get another form? Decision: yes, removal is the supported form. The orchestrating session recommended it, the operator said to implement without changing it, and Barter's check 2 passes with the value overlaid to `["sk-code-ci"]`.
<!-- /ANCHOR:questions -->

---
