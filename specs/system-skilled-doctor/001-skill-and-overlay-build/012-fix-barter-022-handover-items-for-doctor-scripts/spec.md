---
title: "Feature Specification: Phase 12: fix-barter-022-handover-items-for-doctor-scripts"
description: "Three doctor script limits from a vendoring project's first handover are still open: an installed host hook fails the git setup check, apply --adopt refuses a path under repin.exclude, and a file a regenerate step rewrites under an overlay is reported as upstream-moved."
trigger_phrases:
  - "fix barter 022 handover items for doctor scripts"
  - "phase 12 fix barter 022 handover items"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: fix-barter-022-handover-items-for-doctor-scripts

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `worktrees/425-repin-engine-limits-intake` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 12 |
| **Predecessor** | 011-restore-pinned-value-when-json-entry-set-leaves-overlay |
| **Successor** | None |
| **Handoff Criteria** | `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` with the new tests in the count |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the skill and overlay build. It takes the doctor script items still open from the first handover a vendoring project sent, copied byte for byte as `handover-from-barter-022.md` in this folder.

**Scope Boundary**: Items 2, 3 and the second half of item 5 of that handover. Item 1 is fixed at `d0fc9d719b` by the vendoring project's own report. The first half of item 5, a `set` on a missing key, was built in phase 10. Item 4, the captured routing fixtures, is advisor work and sits in `specs/system-skill-advisor/routing-and-scoring/010-baseline-capture-after-graph-scan`.

**Dependencies**:
- Phase 8 added `apply --adopt`.
- Phase 10 made a blocked stage end `RESULT: BLOCKED` and documented a regenerate step's `outputs` list.

**Deliverables**:
- A `skilled.hostHook` form in the git setup check.
- An `apply --adopt` that takes a path under `repin.exclude` when the overlay folder holds a source for it.
- A problem line that names the regenerate step when one rewrites a file an overlay owns.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A project that vendors Skilled met three limits that it still works around by hand.

Its own `pre-commit` hook fails the git setup check. `checkHooks` passes an installed hook only when it is a hook source or hands over to one through a marker line, and `skilled.omitHook` is read only for a hook that is absent. A host hook that replaces a Skilled hook is neither.

`apply --adopt` refuses a path under `repin.exclude` with `is not under a vendored root`, because `isVendoredKey` returns false for an excluded path before anything else is checked. The project writes those manifest entries by hand.

A live re-pin failed where its stage passed. A regenerate step rewrote a file that a `skill-root` overlay owns, and the engine reported that file as `upstream-moved`, which sent the reader to an upstream diff that was empty. A stage cannot catch this, because it drops every regenerate and verify step.

### Purpose
A host hook has an accepted form in the git setup check, `apply --adopt` writes the manifest entry for an excluded path that has an overlay source, and a file a regenerate step rewrote is reported with the step's name.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->

```text
$ rg -n "omitted.has\(name\)|not a hook source" .skilled/commands/doctor/scripts/git-setup-check.cjs
423:      if (omitted.has(name)) {
437:        details.push(`${name}: resolves to ${installedReal}, not a hook source`);

$ rg -n "regenerate: \[\], verifyGenerated|is not under a vendored root" .skilled/commands/doctor/scripts/overlay-engine.cjs
3783:  const manifest = job.isStage ? { ...loaded, regenerate: [], verifyGenerated: [] } : loaded;
4379:    return refuse(`${inputPath} is not under a vendored root (${settings.roots.join(', ')}) and is not a file ` +

$ rg -n "function isVendoredKey" -A 2 .skilled/commands/doctor/scripts/overlay-engine.cjs
4217:function isVendoredKey(key, settings) {
4218-  if (isUnderAny(key, settings.exclude)) return false;
4219-  return settings.rootFiles.includes(key) || settings.roots.some((root) => key.startsWith(root + '/'));
```

Line 423 sits inside the branch for a hook that is not installed, so `skilled.omitHook` never covers an installed hook. These are readings of the code at `b3c140536fb`. None of the three limits has been run in this repository yet. The vendoring project's own output for each is in `handover-from-barter-022.md`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Accept an installed hook that the local git config lists under `skilled.hostHook`, and name it in the passing row's notes as `skilled.omitHook` is named.
- Let `apply --adopt` take a path under `repin.exclude` when a source file for it exists in the overlay folder.
- Name the regenerate step in the problem line when a step rewrites a file an overlay owns, in place of `upstream-moved`.
- Describe all three in the reference that covers each.

### Out of Scope
- Running the regenerate steps on a staged copy - the handover's first proposal for item 2. The engine's own comment at line 3781 says a stage has no project install behind it, so the steps cannot run there. Open question 1 asks the operator to confirm.
- Item 1 of the handover - fixed at `d0fc9d719b`.
- A `set` on a missing key - built in phase 10.
- The captured routing fixtures of item 4 - advisor work, in the advisor packet named under Phase Context.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/git-setup-check.cjs` | Modify | Read `skilled.hostHook` and pass an installed hook it lists |
| `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` | Modify | Tests for a listed host hook and for an unlisted one that still fails |
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | The adopt condition and the regenerate step's name in the problem line |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs` | Modify | Tests for an adopt under `repin.exclude`, with and without an overlay source |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` | Modify | A test where a regenerate step rewrites an overlay-owned file |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | The adopt rule and the new problem line |
| UNKNOWN | Modify | The reference that describes `skilled.omitHook`. `rg -l omitHook .skilled -g '*.md'` finds only a changelog entry, so T002 finds or names the place |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | An installed hook listed under `skilled.hostHook` passes the hooks row, with a note that names it | A test installs a host script as `pre-commit`, sets the config value and reads a passing row whose notes hold `pre-commit: host hook by skilled.hostHook` |
| REQ-002 | An installed hook that is neither a source, a hand-over nor listed still fails | A test without the config value reads `not a hook source` |
| REQ-003 | `apply --adopt` on a path under `repin.exclude` writes the manifest entry when the overlay folder holds a source for it | A test adopts such a path and finds the entry in the manifest and exit 0 |
| REQ-004 | `apply --adopt` on an excluded path with no overlay source still refuses | A test reads a `refuse:` line and exit 2 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | A file an overlay owns that a regenerate step rewrote is reported with the step, not as `upstream-moved` | A test runs a live re-pin whose regenerate step rewrites an owned file and reads the step's name in the problem line |
| REQ-006 | Only local git config counts for `skilled.hostHook` | A test sets the value in global scope and reads a failing row |
| REQ-007 | The references describe the three changes | `rg -n 'hostHook'` and `rg -n 'repin.exclude' .skilled/skills/system-skilled-doctor/references/overlays.md` each print a line |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` and a pass count above the 1175 the suite printed after phase 10.
- **SC-002**: The lines of the handover's validation checklist that cover items 2, 3 and 5 hold, or the one for a stage that runs regenerate steps is marked declined with the reason.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Whether a regenerate step's `outputs` list, documented in phase 10, already changes how an overlay-owned file is classified | UNKNOWN. If it does, REQ-005 may need only a document line | T003 writes the failing test first and reads what the engine prints today |
| Risk | `skilled.hostHook` lets any installed script pass the hooks row | Medium. The row would say PASS for a hook that runs none of the Skilled gates | The passing row names every host hook in its notes, only local config counts, and the reference says a host hook must run the gates itself |
| Risk | An adopt under `repin.exclude` writes an entry for a path a re-pin never copies | Low. The entry is what the host writes by hand today | Require the overlay source to exist, and keep the refusal for every other excluded path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Should a stage run the regenerate steps on the staged copy, as the handover first proposes? Decided by the operator on 2026-11-16: no. The engine skips them on purpose because a stage has no project install, and the problem line of REQ-005 plus phase 10's `RESULT: BLOCKED` cover what the handover wanted from it.
- Is `skilled.hostHook` the right name and shape, one local config value per hook? The handover proposes it and it mirrors `skilled.omitHook`. Decided by the operator on 2026-11-16: yes.
<!-- /ANCHOR:questions -->

---


