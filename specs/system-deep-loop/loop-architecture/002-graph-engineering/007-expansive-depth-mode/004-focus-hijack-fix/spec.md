---
title: "Feature Specification: Stop free text hijacking Next Focus in research and review"
description: "Free text a leaf writes under Questions Remaining becomes the research Next Focus even after the question is answered, and the leaf's own Recommended Next Focus has no reader. The review reducer lets a free leaf nextFocus outrank the first uncovered dimension. This phase filters answered questions and gives the leaf recommendation a defined place in both focus chains."
trigger_phrases:
  - "focus hijack fix"
  - "next focus hijack"
  - "questions remaining next focus"
  - "slice d focus"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Stop free text hijacking Next Focus in research and review

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../003-review-min-iterations-floor/spec.md` |
| **Successor** | `../005-prompt-pack-contract-alignment/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On research runs, a leaf's free text under `## Questions Remaining` becomes a carried-forward question, and `deriveNextFocusFromContinuity` returns the latest one ahead of every machine question, so an iteration's status sentence can become the next focus verbatim (defect D5, parent `research/research.md` §13 and §14). Carried-forward questions are never checked against answered or resolved questions, and the leaf's parsed `nextFocus` (from `## Recommended Next Focus`) has no reader on the research path. The review reducer has the same shape: the latest free leaf `nextFocus` outranks the first uncovered required dimension (parent §18 item 3).

### Purpose
Next Focus on both loops comes from an open, unanswered question or an uncovered dimension, and the leaf's recommendation is read at one stated place in each chain instead of leaking in through free text.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ rg -n "nextFocus" .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs
120:const REJECTED_PATTERN_CANDIDATE_FIELDS = ['text', 'focus', 'nextFocus', 'pattern', 'idea', 'title'];
1930:  const nextFocusSection = extractSection(markdown, 'Recommended Next Focus');
1944:    nextFocus: normalizeText(nextFocusSection),
2757:  const nextFocus = resolveNextFocus(registry, iterationFiles, iterationRecords);
2840:  updated = replaceAnchorSection(updated, 'next-focus', '11. NEXT FOCUS', nextFocus);
2879:  const nextFocus = resolveNextFocus(registry, iterationFiles, iterationRecords);
3051:    nextFocus,
```
The parsed field is written at line 1944 and never read: lines 2757, 2840, 2879 and 3051 are the reducer's own resolved value, not the leaf's. `deriveNextFocusFromContinuity` (`runtime/lib/deep-loop/continuity-thread.cjs:130-163`) returns the latest carried-forward question before any finding or machine question, and it returns the terminal sentinel when no machine question is open, so the hijack needs at least one open machine question.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Filter carried-forward questions whose normalized text equals an answered or resolved registry question, so they never reach Next Focus.
- Give the research leaf's parsed `nextFocus` a reader in the research focus chain, after the pivot focus and the blocked-stop recovery, gated on at least one open machine question, and skip it when its normalized text equals an answered or resolved question.
- Change the review focus chain so the first uncovered required dimension outranks a leaf `nextFocus` that names no uncovered dimension.
- Add proving cases to the existing research, continuity-thread and review reducer suites.

### Out of Scope
- The prompt-pack heading mismatch (D13), which decides whether a pack-compliant narrative produces a `## Recommended Next Focus` section - owned by `../005-prompt-pack-contract-alignment/`.
- The frontier focus branch of the expansive-depth sub-mode - owned by `../010-research-frontier-mode/`, which builds on this phase.
- Semantic (non-literal) question matching - the parent research records resolution as literal string equality (§5 item 6); this phase keeps that rule.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modify | `resolveNextFocus` (about :2420-2475) and `filterNextFocusInputs` (:897-918): pass answered/resolved questions and the latest leaf `nextFocus` into the continuity call |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs` | Modify | `buildCarriedForwardOpenQuestions` (:80-118) drops answered keys; `deriveNextFocusFromContinuity` (:130-163) gains the leaf-recommendation step ahead of the carried-forward step |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | Review focus chain (:2184-2215): uncovered dimension outranks a leaf `nextFocus` that names none |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Modify | Answered-filter and leaf-reader cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/continuity-thread.vitest.ts` | Modify | Order and filter cases for the two continuity functions |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Modify | Review twin case |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A carried-forward question whose normalized text equals an answered or resolved question never becomes research Next Focus | A `deep-research-reduce-state` case with one open machine question, one resolved question, and a later iteration listing the resolved text under `## Questions Remaining` resolves Next Focus to something other than that text |
| REQ-002 | The research leaf's `nextFocus` has a reader, and an answered recommendation is skipped | A `deep-research-reduce-state` case whose latest iteration file has a non-empty `## Recommended Next Focus` and one open machine question returns that recommendation as Next Focus; the same case with the recommendation equal to a resolved question does not; and `rg -n "\.nextFocus" deep-research/scripts/reduce-state.cjs` shows a read outside the parser |
| REQ-003 | Review Next Focus names the first uncovered required dimension when the leaf `nextFocus` names no uncovered dimension | A `deep-review-state-reducer` case with `correctness` uncovered and a leaf `nextFocus` of free text that names no dimension resolves Next Focus to a value naming `correctness` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Pivot focus and blocked-stop recovery keep their precedence on both loops | Existing pivot and blocked-stop cases in `deep-research-reduce-state` and `deep-review-state-reducer` pass unchanged |
| REQ-005 | The terminal sentinel still appears when no machine question is open | A `continuity-thread` case with zero machine questions and a leaf recommendation returns the terminal sentinel |
| REQ-006 | The three suites pass after the change | `npx vitest run deep-research-reduce-state continuity-thread deep-review-state-reducer` from `.skilled/skills/system-deep-loop/runtime` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three P0 cases fail on the current code and pass after the change.
- **SC-002**: `npx vitest run deep-research-reduce-state continuity-thread deep-review-state-reducer` exits 0 with no existing case removed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Default-path behavior changes: Next Focus differs on normal research and review runs, not only under a flag (parent §15, "Slice D deliberately changes default focus") | Medium | Keep pivot and blocked-stop precedence untouched (REQ-004), and state the focus change in the changelog entry for this phase |
| Risk | Until `../005-prompt-pack-contract-alignment/` lands, a narrative that follows the prompt pack writes `## Next Focus`, which the research parser does not read, so the new reader sees nothing on pack-compliant runs | Medium | REQ-002 tests the reader with the `## Recommended Next Focus` heading; the chain falls through to the carried-forward step when the field is empty |
| Dependency | None. This phase has no prerequisite slice (parent §20 order) | None | Not applicable |
| Dependency | This phase is a prerequisite of `../010-research-frontier-mode/` (parent §20, Slice J depends on D) | Frontier focus would inherit the hijack if this phase slips | Land this phase before 010 starts |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where exactly does the leaf recommendation sit relative to a carried-forward question that is still open and unanswered? This spec places it ahead of the carried-forward step; the implementer may move it below that step if a reducer case shows a recommendation steering away from the counted set.
- Should an open machine question also outrank unanswered carried-forward free text? That would close the rest of D5, but `deriveNextFocusFromContinuity` already returns the sentinel when no machine question is open, so the reorder makes the carried-forward and "Follow up on" steps unreachable. It is left out of this phase and needs an operator decision.
- Does a review leaf `nextFocus` that names an uncovered dimension count as "naming" it by exact dimension id only, or also by the dimension's display name? The review reducer accepts three heading spellings (`runtime/scripts/reduce-state.cjs:355`); the matching rule must be stated in the test.
<!-- /ANCHOR:questions -->

---
