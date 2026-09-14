---
title: "Implementation Plan: Phase 1: gate-3-option-merge"
description: "Merge Gate 3 options C and D into one Related option, relabel Skip from E to D, and carry the wording and the letter through every surface that prints, tests, or parses it, in one commit."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: gate-3-option-merge

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, YAML/txt command assets, Node ESM (spec-gate hook and its test) |
| **Framework** | None. The hook is a plain Node module under `.opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/` |
| **Storage** | None |
| **Testing** | `node --test` over `spec-gate-core.test.mjs`, the classifier's own existing test suite for `gate-3-classifier.ts` |

### Overview
Merge Gate 3's C and D options into one C, "Related," and relabel Skip from E to D. Carry the
change through every surface the inventory grep found: the root doc, the hook and its test, nine
command asset files, three compiled deep-loop contracts, two spec-kit reference docs, the README,
and one advisor-parity fixture. The classifier is read-only proof that it needs no edit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] `node --test .opencode/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.test.mjs` passes
- [ ] The classifier's own test suite for `gate-3-classifier.ts` passes unmodified
- [ ] The inventory grep, `rg -ln "Update related|Extend phased packet|E\) Skip"` with the same
      excludes as this packet's spec.md, returns zero files outside spec folders and archives
- [ ] `test -L CLAUDE.md && [ "$(readlink CLAUDE.md)" = "AGENTS.md" ]` still holds
- [ ] `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh <spec-folder> --strict` passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Not applicable in the code-architecture sense. The relevant structure is a contract: the option
letters A through D (E today) are typed back by runtimes, hooks, and humans, so every surface that
prints or parses them must change in the same commit, not on separate schedules.

### Key Components
- **`AGENTS.md`**: The human-readable source of the option text. `CLAUDE.md` is a symlink to it,
  so it needs no separate edit.
- **`spec-gate-core.mjs`**: The machine surface. Holds `GATE_3_QUESTION`, the printed text, and the
  letter-recognition regexes (`STANDALONE_LETTER_E_REGEX`, `ANSWER_LETTER_PREFIX_REGEX`,
  `NATURAL_LEAD_IN_LETTER_REGEX`, `ANSWER_LETTER_ATTEMPT_REGEX`, `ANSWER_LETTER_VOCAB_REGEX`) that
  hardcode E as the skip letter and accept the range a through e.
- **`spec-gate-core.test.mjs`**: Its positive and negative answer corpora assert specific letter
  meanings, for example that "D, no spec folder needed" stays open today because D is a folder
  option, and that a standalone "E" always means skip.
- **`gate-3-classifier.ts`**: Reads `satisfiedBy` (`prebound_spec_folder`, `prior_answer`, or null)
  and never an option letter. Confirmed by grep for `satisfiedBy`, `prior_answer`, and any option
  letter in the file: no match ties classifier behavior to A through E.

### Data Flow
A user or a runtime answers Gate 3 with a letter or a folder path. `spec-gate-core.mjs` parses the
answer text against its regexes to decide skip, binding, or still-open, independent of the
classifier, which separately decides whether Gate 3 is required at all for a given prompt.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `AGENTS.md` | Root option text, five options A-E | Update: C becomes Related, D becomes Skip, drop old D wording | `grep -n "Options (stable labels)" -A6 AGENTS.md` shows four lines |
| `CLAUDE.md` | Symlink to `AGENTS.md` | Unchanged, re-syncs by the symlink | `readlink CLAUDE.md` equals `AGENTS.md` |
| `spec-gate-core.mjs` (`GATE_3_QUESTION`) | Printed question, five options A-E | Update: same four-option text as `AGENTS.md` | `node -e` prints the constant, diff against the doc text |
| `spec-gate-core.mjs` (letter regexes) | E hardcoded as skip letter, a-e accepted | Update: D is the skip letter, keep the accepted range unless the corpus proves narrowing is safe | `grep -n "STANDALONE_LETTER_E_REGEX\|a-eA-E" spec-gate-core.mjs` shows the new letter |
| `spec-gate-core.test.mjs` | Corpora assert old D and E meanings | Update: swap the fixtures that test D-as-folder and E-as-skip to D-as-skip and the new C wording | `node --test spec-gate-core.test.mjs` |
| `gate-3-classifier.ts` | Reads `satisfiedBy`/`prior_answer`, not a letter | Not a consumer of the option letters | `grep -n "satisfiedBy\|prior_answer\|[A-E])" gate-3-classifier.ts` shows no letter dependency |
| Command assets (9 files under `create/assets/`, `deep/assets/`, `speckit/assets/`) | Restate the option list in presentation/YAML text | Update: same four-option wording | Inventory grep returns none of these |
| 3 compiled contracts under `deep/assets/compiled/` | Restate the option list, carry a `GENERATED_COMMAND_CONTRACT_HEADER` marker but no generator script found in this repo | Update by direct edit, confirm during implementation whether a generator exists elsewhere before editing | Inventory grep returns none of these, header marker re-checked |
| `worked-examples.md`, `trigger-config.md` | Already show a short four-option list, inconsistent wording | Update: align wording to the new canonical C and D text | Inventory grep returns neither |
| `README.md` | Gate 3 box in the pipeline diagram | Update: four options, same wording | Inventory grep returns none |
| Advisor-parity fixture (`baseline-contexts.json`) | Embeds the option text as fixture data | Update: same four-option text | Inventory grep returns none |

Required inventories:
- Surface inventory: `rg -ln "Update related|Extend phased packet|E\) Skip" --glob '!specs/**' --glob '!node_modules/**' --glob '!.worktrees/**' --glob '!**/dist/**' --glob '!**/z_archive/**' .` returned 31 files, listed above by group.
- Letter-recognition consumers: `grep -n "'E'\|STANDALONE_LETTER_E\|a-eA-E" spec-gate-core.mjs` locates every regex that must move from E to D.
- Classifier dependency check: `grep -n "satisfiedBy\|prior_answer\|option.*letter" gate-3-classifier.ts` confirms no dependency, already run, zero matches on option letters.
- Matrix axis: one axis, "which surface," with 31 rows (the inventory) plus the hook's regex logic as a second, non-prose row.
- Algorithm invariant: the letter-recognition regex must accept exactly the same input shapes it does today (standalone letter, natural lead-in, vocabulary-prefixed) with only the skip letter's identity moved from E to D, a prompt bearing the old standalone "E" pattern is treated as an out-of-band compatibility read for one release, not silently dropped.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

**Phase 1: Root doc and hook.** `AGENTS.md`, `spec-gate-core.mjs` (question text and regexes), and
`spec-gate-core.test.mjs`. This is the contract itself, every other phase restates it.

**Phase 2: Command assets and compiled contracts.** The nine create/deep/speckit asset files and
the three compiled deep-loop contracts, confirming first whether a generator exists for the
contracts.

**Phase 3: References, README, fixture, and the sweep.** `worked-examples.md`, `trigger-config.md`,
`README.md`, the advisor-parity fixture, then the final inventory grep to confirm zero remaining
hits outside spec folders and archives.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `spec-gate-core.mjs` letter-recognition and question text | `node --test spec-gate-core.test.mjs` |
| Unit | `gate-3-classifier.ts` unchanged behavior | The classifier's own existing test suite, re-run without modification |
| Integration | Whole-corpus consistency | The inventory grep, expecting zero hits outside spec folders and archives |
| Manual | A live session typing "D" after the change | Confirm it registers as skip, not as a folder-path attempt |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Whether a generator produces the compiled deep-loop contracts | Internal | Unresolved, no generator script found in the searched paths | If one exists elsewhere, a hand edit could be overwritten on the next regeneration, confirm before Phase 2 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The hook test or the classifier's test suite fails after the change, or the sweep
  grep still returns hits outside spec folders and archives.
- **Procedure**: One revert. The change lands as a single commit across all inventoried surfaces,
  so `git revert` on that commit restores the prior five-option contract everywhere at once.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Root doc + hook) ──► Phase 2 (Command assets + compiled contracts) ──► Phase 3 (References, README, fixture, sweep)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Root doc + hook | None | Command assets, References |
| Command assets + compiled contracts | Root doc + hook | References, sweep |
| References, README, fixture, sweep | Command assets + compiled contracts | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Root doc + hook | Med | 1-2 hours, mostly the regex read and test rewrite |
| Command assets + compiled contracts | Low | 1 hour, mechanical text swaps across 12 files |
| References, README, fixture, sweep | Low | 30-45 minutes |
| **Total** | | **3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Inventory grep re-run immediately before implementation starts, to catch drift since planning
- [ ] Hook test file read in full, so the fixture rewrite is not a guess
- [ ] Generator-existence question for the compiled contracts resolved

### Rollback Procedure
1. Stop before committing if the hook test or the classifier suite fails.
2. If already committed, `git revert` the single commit.
3. Re-run the hook test and the inventory grep to confirm the revert restored the prior state.
4. No stakeholder notification needed, this is an internal contract, not a user-facing surface.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. A mid-flight session bound under the old "D" meaning keeps its
  `prior_answer` state as written, the revert does not need to touch any stored gate state.
<!-- /ANCHOR:enhanced-rollback -->

---
