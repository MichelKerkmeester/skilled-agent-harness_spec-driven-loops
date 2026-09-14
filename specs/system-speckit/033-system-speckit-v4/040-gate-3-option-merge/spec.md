---
title: "Feature Specification: Phase 1: gate-3-option-merge"
description: "Gate 3 offers five options, but C and D say the same thing: use another packet than the current one, differing only in whether that packet is a phase child. The corpus is already inconsistent about how many options exist."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: gate-3-option-merge

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-14 |
| **Branch** | `scaffold/040-gate-3-option-merge` |
| **Parent Spec** | ../spec.md |
| **Phase** | 40 of 40 |
| **Predecessor** | 039-entry-point-symlink-resolution |
| **Successor** | None |
| **Handoff Criteria** | Every surface that prints the option list is inventoried, and the grep in the 040 plan returns only the inventoried files |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 40** of the Merge Gate 3 options C and D into one related-packet option specification.

**Scope Boundary**: Every prose or code surface that prints, tests, or parses the Gate 3 A-E
option list. Excludes spec-folder content and archives, which are historical records of a prior
question shape and are not corrected.

**Dependencies**:
- None. The inventory grep in this packet's plan is the only prerequisite, and it has already run.

**Deliverables**:
- A planning-only packet: this spec, plan, tasks, and acceptance-criteria set the requirements,
  the affected-surface table, and the phase order. No file outside this packet is edited.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Gate 3 offers five options today. C, "Update related," and D, "Extend phased packet," both mean
use another existing packet rather than the current one, and differ only in whether that packet
is a phase child. The letters are stable labels that runtimes, hooks, and humans type back, so the
duplication is not cosmetic: two letters carry one decision. The corpus is already inconsistent
about the count. `worked-examples.md` and `trigger-config.md` show a four-option list (A, B, C,
D-as-Skip) while `AGENTS.md`, the hook, and most other surfaces show five.

### Purpose
One option, "C) Related," replaces C and D. Skip moves from E to D. Every surface that prints,
tests, or parses the option list carries the same four letters and the same wording, in one change.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The root option text in `AGENTS.md`, whose symlinked mirror `CLAUDE.md` carries the edit for free.
- The hook's printed question, its letter-recognition regex, and its test assertions, in
  `spec-gate-core.mjs` and `spec-gate-core.test.mjs`.
- The classifier's own behavior, verified unchanged rather than edited, since it never keys off the
  option letters.
- Command assets: the create, deep, and speckit presentation and YAML files that restate the list.
- The three compiled deep-loop contracts under `.opencode/commands/deep/assets/compiled/`.
- The two spec-kit reference docs that already show a shorter list, and the README diagram.
- The one advisor-parity fixture that embeds the option text.

### Out of Scope
- Any spec folder or archive that quotes the old five-option text as a historical record. Those
  files describe a past turn, not the present contract, and correcting them would misrepresent
  what a prior session actually saw.
- The classifier's binding logic (`gate-3-classifier.ts`), which reads `satisfiedBy` and
  `prior_answer`, never an option letter, so it needs no change. It stays in scope for its test
  suite to be re-run, not for its source to be edited.
- Any runtime mirror that does not currently carry the option text, such as `.codex/AGENTS.md`,
  which has its own content and is not part of this surface.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `AGENTS.md` | Modify | Root option list: C becomes Related, D becomes Skip, old D and E removed |
| `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` | Modify | `GATE_3_QUESTION` text and the standalone-letter and vocabulary regexes that hardcode E as the skip letter and accept a through e |
| `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` | Modify | Positive and negative answer corpora that assert on the old D and E meanings |
| Command assets under `.opencode/commands/create/assets/`, `.opencode/commands/deep/assets/`, `.opencode/commands/speckit/assets/` | Modify | Restated option lists in presentation and YAML files |
| `.opencode/commands/deep/assets/compiled/deep-research.contract.md`, `deep-review.contract.md`, `deep-ai-council.contract.md` | Modify | Same list, edited directly since no generator script for these was found in this repository |
| `.opencode/skills/system-spec-kit/references/workflows/worked-examples.md` | Modify | Short-form list line 60 |
| `.opencode/skills/system-spec-kit/references/memory/trigger-config.md` | Modify | Short-form list line 134 |
| `README.md` | Modify | Gate 3 box in the pipeline diagram |
| `.opencode/skills/system-skill-advisor/runtime/tests/parity/fixtures/policy-plan/baseline-contexts.json` | Modify | Embedded option text in a fixture |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `AGENTS.md` carries four options: A Existing, B New, C Related (merging the old C and D wording), D Skip. Its symlinked mirror `CLAUDE.md` re-syncs by the symlink alone. |
| REQ-002 | The hook prints the same four options, its letter-recognition regexes treat D as the skip letter and reject the old E form, and its test asserts the new corpus. |
| REQ-003 | Every inventoried surface carries the same four letters and the same wording as `AGENTS.md`, with no surface showing a fifth option or a different C or D wording. |
| REQ-005 | The classifier's binding behavior is unchanged, since it never reads an option letter, and its existing test suite passes without modification. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | No surface outside a spec folder or archive still prints "E) Skip" or names "Extend phased packet" after the change. |
| REQ-006 | Runtime mirrors of the root doc re-sync clean: `CLAUDE.md` stays a symlink resolving to `AGENTS.md`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The inventory grep, `rg -ln "Update related|Extend phased packet|E\) Skip"` with the
  same excludes, returns zero files outside spec folders and archives.
- **SC-002**: `spec-gate-core.test.mjs` and the classifier's test suite both pass, and a session
  that types "D" is recognized as a skip answer rather than a folder-path answer.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A runtime or cached prompt still types "E" for skip after the change | The gate reads a stray E as a folder-path attempt, not a skip, and stalls open | Ship the hook and the doc text in one commit, and keep the old standalone-E pattern recognized as skip for one release as a compatibility read, documented as a deliberate exception |
| Risk | A compiled deep-loop contract carries a `GENERATED_COMMAND_CONTRACT_HEADER` marker but no generator script was found in this repository | A hand edit could later be silently overwritten if a generator does exist outside the searched paths | Confirm during implementation whether a generator exists before editing, and note the finding in the affected-surfaces table either way |
| Risk | The letter-recognition regex change narrows accepted letters from a-e to a-d | A prompt that answers with a bare "E" for an unrelated reason now falls through the answer-attempt check | Keep the regex change to swapping which letter means skip, not narrowing the character class, unless the corpus proves the fifth letter is otherwise never legitimate |
| Dependency | None | This packet plans only, no implementation dependency blocks planning | N/A |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No measurable change. The edit is text and one regex swap, evaluated once per gate check, not on a hot path.

### Security
- **NFR-S01**: Not applicable. No auth or data-protection surface is touched.

### Reliability
- **NFR-R01**: The hook must not raise on a malformed answer after the letter change. The
  fall-through path stays "leave the gate open," the same conservative default as today.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: unchanged behavior, the gate stays open.
- Maximum length: not applicable, the option text is fixed and short.
- Invalid format: a reply that names neither a letter nor a folder path stays unresolved, unchanged.

### Error Scenarios
- External service failure: not applicable, no external call is involved.
- Network timeout: not applicable.
- Concurrent access: not applicable, the option text is static per process.

### State Transitions
- Partial completion: a session that answered Gate 3 with "D" before this change, meaning Extend
  phased packet, and continues working after the change, where "D" now means Skip. Its bound spec
  folder was already written to `prior_answer` state before the change, so the session keeps its
  original binding and is not reinterpreted. Only a fresh answer after the change reads under the
  new meaning.
- Session expiry: unchanged, governed by the existing retention constants in `spec-gate-core.mjs`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 31 inventoried files across docs, one hook module, one test file, and asset text, no runtime schema change |
| Risk | 14/25 | The letter-recognition regex is load-bearing parsing logic, not pure prose, so a mis-edit changes gate behavior |
| Research | 5/20 | The inventory grep and the regex read are already done, no open unknowns remain |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

<!-- /ANCHOR:questions -->

---
