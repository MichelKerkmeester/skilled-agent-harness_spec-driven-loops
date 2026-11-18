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
| **Status** | Complete |
| **Created** | 2026-11-17 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../003-review-min-iterations-floor/spec.md` |
| **Successor** | `../005-prompt-pack-contract-alignment/spec.md` (numbering order; 005 builds first, see Risks) |
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
The parsed field is written at line 1944 and never read: lines 2757, 2840, 2879 and 3051 are the reducer's own resolved value, not the leaf's. `deriveNextFocusFromContinuity` (`runtime/lib/deep-loop/continuity-thread.cjs:130-164`) returns the latest carried-forward question before any finding or machine question, and it returns the terminal sentinel when no machine question is open, so the hijack needs at least one open machine question.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Filter carried-forward questions in the shared helper `buildCarriedForwardOpenQuestions` (`runtime/lib/deep-loop/continuity-thread.cjs:76-118`), which today carries every list item under `## Questions Remaining` forward with no check that it is a question. Two rules apply there:
  - **Question-shape rule.** An item is carried forward only when it ends in a question mark or its normalized text equals a registry question. A status sentence, the observed D5 instance, is never carried forward.
  - **Answered rule.** An item whose normalized text equals an answered or resolved registry question is dropped.
- Pass the answered and resolved question set into the helper at its one call site, `buildRegistry` (`deep-research/scripts/reduce-state.cjs:2587`), not from `resolveNextFocus`. Every consumer of the persisted list therefore sees the filtered set (see the default-path risk row).
- Give the research leaf's parsed `nextFocus` a reader in the research focus chain, after the pivot focus and the blocked-stop recovery, gated on at least one open machine question, and skip it when its normalized text equals an answered or resolved question.
- Change the review base pick so the first uncovered required dimension outranks a leaf `nextFocus` that names no uncovered dimension, at both places the expression appears: the strategy focus block (`runtime/scripts/reduce-state.cjs:2183-2186`) and its dashboard twin (`:2271-2273`). The claim is narrowed to the strategy and dashboard Next Focus text, which the review agent reads (`.skilled/agents/deep-review.md:161`). The dispatched dimension is not this text: the review workflow sets `{next_dimension}` from the strategy's remaining-dimension queue (`.skilled/commands/deep/assets/deep-review.yaml:904`), which already names the next uncovered dimension and does not change here.
- Add proving cases to the existing research, continuity-thread and review reducer suites.
- Write the manual testing playbook scenarios for this phase's user-visible behavior through `/create:manual-testing-playbook`. Phase `../014-docs-playbooks-alignment/` only verifies and aligns them.

### Out of Scope
- The prompt-pack heading mismatch (D13), which decides whether a pack-compliant narrative produces a `## Recommended Next Focus` section - owned by `../005-prompt-pack-contract-alignment/`.
- The frontier focus branch of the expansive-depth sub-mode - owned by `../010-research-frontier-mode/`, which builds on this phase.
- Semantic (non-literal) question matching - the parent research records resolution as literal string equality (§5 item 6); this phase keeps that rule.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | Modify | `buildRegistry` call at :2587 passes the answered and resolved question set into `buildCarriedForwardOpenQuestions`; `resolveNextFocus` (:2420-2473) and `filterNextFocusInputs` (:897-918) pass the latest leaf `nextFocus` into the continuity call. Consumers of the filtered list, read and not edited: `buildSuppressedNextFocusCandidates` (:2592-2594), the persisted registry field (:2618), the `carriedForwardOpenQuestions` metric (:2644) and strategy section 11A (:2798-2801) |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs` | Modify | `buildCarriedForwardOpenQuestions` (:76-118) applies the question-shape rule and drops answered keys; `deriveNextFocusFromContinuity` (:130-164) gains the leaf-recommendation step ahead of the carried-forward step |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | Modify | Review base pick in the strategy focus block (:2183-2186) and its dashboard twin (:2271-2273): uncovered dimension outranks a leaf `nextFocus` that names none. The pivot override (:2187-2189) and blocked-stop override (:2198-2215) are unchanged |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-reduce-state.vitest.ts` | Modify | Answered-filter, stale-status-sentence and leaf-reader cases |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/continuity-thread.vitest.ts` | Modify | Order, question-shape and answered-filter cases for the two continuity functions |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts` | Modify | Review twin case asserting the strategy and dashboard Next Focus |
| `.skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/`, `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/` | Modify | One scenario per loop, written by `/create:manual-testing-playbook system-deep-loop update --path <playbook dir>`. Both categories already hold a next-focus scenario, which the command may extend instead of adding a file |

No file this phase changes is digested by the compiled command contracts under `.skilled/commands/deep/assets/compiled/` (they digest the command docs, workflow YAMLs, configs, strategy assets, prompt-pack templates, agent definitions and reference docs), so this phase has no contract regeneration task. No agent definition changes, so no runtime mirror sync is needed.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A carried-forward item that equals an answered or resolved question, or that is not question-shaped, never becomes research Next Focus and never reaches the persisted carried-forward list | Two `deep-research-reduce-state` cases, each with one open machine question: (a) a resolved question whose text a later iteration lists under `## Questions Remaining`; (b) a later iteration that lists a status sentence with no question mark, such as `Iteration 1 mapped the reducer chain.`, under `## Questions Remaining`. In both, Next Focus resolves to something other than that text, and the registry `carriedForwardOpenQuestions` list, its metric and strategy section 11A omit it |
| REQ-002 | The research leaf's `nextFocus` has a reader, and an answered recommendation is skipped | A `deep-research-reduce-state` case whose latest iteration file has a non-empty `## Recommended Next Focus` and one open machine question returns that recommendation as Next Focus; the same case with the recommendation equal to a resolved question does not; and `rg -n "\.nextFocus" .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` shows a read outside the parser |
| REQ-003 | Review strategy and dashboard Next Focus name the first uncovered required dimension when the leaf `nextFocus` names no uncovered dimension | A `deep-review-state-reducer` case with `correctness` uncovered and a free-text leaf `nextFocus` that names no dimension asserts both outputs: the strategy `11. NEXT FOCUS` section and the dashboard Next Focus name `correctness`. A leaf `nextFocus` names a dimension when its normalized (lowercased, trimmed) text contains a `REQUIRED_DIMENSIONS` id |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Pivot focus and blocked-stop recovery keep their precedence on both loops | Existing pivot and blocked-stop cases in `deep-research-reduce-state` and `deep-review-state-reducer` pass unchanged |
| REQ-005 | The terminal sentinel still appears when no machine question is open | A `continuity-thread` case with zero machine questions and a leaf recommendation returns the terminal sentinel |
| REQ-006 | The three suites pass after the change | `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-research-reduce-state.vitest.ts tests/unit/continuity-thread.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts` exits 0 |
| REQ-007 | The user-visible focus change has playbook scenarios | `/create:manual-testing-playbook system-deep-loop update --path <playbook dir>` has written or extended one scenario per loop: the research one covers a stale status sentence under `## Questions Remaining`, the review one covers the first uncovered dimension outranking free leaf text. `rg -il "status sentence" .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook` and `rg -il "first uncovered" .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook` each list the new scenario; both print nothing before this phase |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three P0 cases fail on the current code and pass after the change.
- **SC-002**: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/deep-research-reduce-state.vitest.ts tests/unit/continuity-thread.vitest.ts tests/unit/deep-review-state-reducer.vitest.ts` exits 0 with no existing case removed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Default-path behavior changes: Next Focus differs on normal research and review runs, not only under a flag (parent §15, "Slice D deliberately changes default focus") | Medium | Keep pivot and blocked-stop precedence untouched (REQ-004), and state the focus change in the changelog entry for this phase |
| Risk | The filter runs in the shared helper, so the persisted list changes on every default research run, not only Next Focus. Its consumers: the registry field `carriedForwardOpenQuestions` (`deep-research/scripts/reduce-state.cjs:2618`), the metric of the same name (:2644), strategy section 11A (:2798-2801), the suppressed-candidates builder (:2592-2594), and through the strategy section the `{carried_forward_open_questions}` render variable (`.skilled/commands/deep/assets/deep-research.yaml:851`) that every leaf sees in its prompt pack (`deep-research/assets/prompt-pack-iteration.md.tmpl:17`) | Medium | REQ-001 asserts the registry field, the metric and section 11A; the changelog entry names the list change alongside the focus change |
| Risk | The question-shape rule also drops a legitimate imperative item that ends without a question mark, such as `Investigate the review twin` | Low-Medium | Such an item still reaches Next Focus as the leaf's `## Recommended Next Focus` (REQ-002) and stays in the narrative; a `continuity-thread` case pins the rule so a later change is deliberate |
| Dependency | `../005-prompt-pack-contract-alignment/` lands first. Until it does, a narrative that follows the prompt pack writes `## Next Focus`, which the research parser does not read, so the REQ-002 reader is inert on pack-compliant runs | Medium | Build after 005. REQ-002 tests the reader with the `## Recommended Next Focus` heading; the chain falls through to the carried-forward step when the field is empty |
| Dependency | This phase is a prerequisite of `../010-research-frontier-mode/` (parent §20, Slice J depends on D) | Frontier focus would inherit the hijack if this phase slips | Land this phase before 010 starts |
| Dependency | `../008-review-dimension-coverage/` and `../011-review-frontier-mode/` change the same review focus block and its dashboard twin | Merge conflicts in `runtime/scripts/reduce-state.cjs` | Land this phase before 008 and 011 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None open. Three questions were settled in planning on 2026-11-17, from the code and the D5 evidence; changing one is an amendment to this spec and its goal:

- **Leaf recommendation against an open carried-forward question.** The recommendation sits ahead of the carried-forward step, gated on an open machine question and skipped when answered (REQ-002).
- **Should an open machine question outrank carried-forward free text?** No reorder. The observed D5 instance was a status sentence, which the question-shape rule now drops before it is carried forward (REQ-001 case b), so the rest of D5 closes without making the carried-forward and "Follow up on" steps unreachable.
- **How a review leaf `nextFocus` names a dimension.** By `REQUIRED_DIMENSIONS` id, matched on normalized (lowercased, trimmed) text containing the id. The three heading spellings at `runtime/scripts/reduce-state.cjs:355` govern which narrative heading is parsed, not dimension naming. The REQ-003 case states the rule.
<!-- /ANCHOR:questions -->

---
