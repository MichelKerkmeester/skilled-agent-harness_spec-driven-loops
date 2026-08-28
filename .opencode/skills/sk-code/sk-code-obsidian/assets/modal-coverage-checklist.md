---
title: Modal Screenshot-Coverage Checklist
description: Gate a change to src/views/modals/ in the Note Database plugin — all 17 modals are unphotographed today because a non-recursing inventory missed the folder; escalate before shipping one more without a scenario.
trigger_phrases:
  - "modal coverage checklist"
  - "src views modals unphotographed"
  - "add a modal screenshot scenario"
  - "non-recursing ls missed modals"
  - "modal dialog screenshot escalation"
  - "17 modals no scenario"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Modal Screenshot-Coverage Checklist

Use this BEFORE touching any file under `src/views/modals/` in the Note Database plugin. All 17
modals in that folder are unphotographed — no scenario in `tools/screenshots/scenarios/`
references any of them.

---

## 1. OVERVIEW

### Purpose

The screenshot harness's original scenario inventory was built from a non-recursing
`ls src/views/*.ts`, which lists every renderer directly under `src/views/` but never descends into
`src/views/modals/` — so the folder was never seen, not deliberately excluded. That means a change
here carries none of the visual-regression protection the rest of `src/views/` has, and the gap
will not surface on its own; it has to be checked for explicitly.

### Usage

Work through the sections in order — the 17 modals, why the inventory missed them, adding a
scenario, and the escalation rule — before claiming a change to `src/views/modals/` is complete,
then confirm against THE GATE.

---

## 2. THE 17 MODALS (measured baseline)

All under `src/views/modals/`, all unphotographed at this packet's measured commit:

`AddDatabaseFlow.ts` · `AddDatabaseModal.ts` · `BaseImportConfirmModal.ts` ·
`ColumnRenameModal.ts` · `ComputedFrontmatterCleanupModal.ts` · `ConfirmModal.ts` ·
`CreatePropertyModal.ts` · `CreateRecordIconFieldModal.ts` · `CsvMarkdownExportModal.ts` ·
`DeleteDatabaseModal.ts` · `FormulaModal.ts` · `GroupOrderModal.ts` ·
`InvalidTimeEventsModal.ts` · `PropertyTypeConflictModal.ts` · `RelationRollupConfigModal.ts` ·
`StatusOptionsModal.ts` · `StatusPresetManagerModal.ts`

- [ ] Confirmed the folder listing above is still current (`ls src/views/modals/`) before relying
  on it — a new modal added since this checklist was written inherits the same gap and belongs on
  this list

---

## 3. WHY THE NON-RECURSING INVENTORY MISSED THEM

- [ ] Understood the actual cause, not a guessed one: the harness's coverage was seeded from
  `ls src/views/*.ts`, a shallow glob that lists files directly in `src/views/` and does not descend
  into `src/views/modals/` — this is a scoping gap in the original inventory pass, not a decision
  that modals are lower priority or harder to fixture
- [ ] Did not assume any other folder under `src/` shares this gap without checking — `src/data/`
  and the rest of `src/views/` were covered by the same shallow-glob pass but are top-level `.ts`
  files, so they were actually seen; `src/views/modals/`, as the one nested folder under
  `src/views/`, was the specific miss

---

## 4. ADDING A MODAL SCENARIO

- [ ] A scenario for a modal fixtures the dialog's DOM structure as Obsidian's `Modal` class
  renders it — typically a backdrop/overlay wrapper plus the modal's content, not just the inner
  form in isolation, since real layout (padding, max-width, button row alignment) depends on the
  wrapper
- [ ] Multiple interaction states are fixtured where the modal has them — empty/default, filled,
  and validation-error states are common across this family (`FormulaModal`,
  `CreatePropertyModal`, `PropertyTypeConflictModal`) and each is a materially different capture,
  not one scenario with three states glossed as one
- [ ] Placed in the module that matches the modal's role — most modal scenarios belong in
  `tools/screenshots/scenarios/panels.mjs` or `chrome.mjs` alongside other overlay-style surfaces;
  check the existing `group` conventions before creating a new one
- [ ] Followed `assets/fixture-authoring-checklist.md` in full for the new scenario — real classes
  only, the guard test, an accurate `sources` list

---

## 5. THE ESCALATION RULE

Per `SKILL.md` §5, a change that touches `src/views/modals/` with no scenario added to
`tools/screenshots/scenarios.mjs` in the same change is an escalation trigger, not a judgment call.

- [ ] If the change is genuinely too small to warrant a new scenario (e.g. a one-line copy fix with
  no layout or class impact), stated that explicitly rather than silently skipping coverage
- [ ] If the change affects layout, new fields, new states, or new classes in a modal with zero
  existing coverage, did not ship it without at least one scenario — this is the situation the
  escalation rule exists for

---

## 6. VERIFY

- [ ] `npx vitest run` — `ScreenshotFixtures.test.ts` passes for the new scenario's classes
- [ ] `npm run screenshots` regenerates the new modal capture; `npm run screenshots:verify` exits 0
- [ ] Opened the new PNG(s) in both themes — a first capture of a previously-unphotographed surface
  is exactly the case where "it captured something" is least trustworthy as proof it captured the
  right thing

---

## 7. THE GATE

A change to `src/views/modals/` is "done" only when: the current modal list was confirmed against
`ls src/views/modals/`; a layout- or state-affecting change got at least one new scenario in the
same change, or the exemption was stated explicitly; the scenario fixtures the modal's real wrapper
structure and its meaningful interaction states; `ScreenshotFixtures.test.ts` and
`screenshots:verify` both pass; and the new PNGs were opened and visually confirmed in both themes.
