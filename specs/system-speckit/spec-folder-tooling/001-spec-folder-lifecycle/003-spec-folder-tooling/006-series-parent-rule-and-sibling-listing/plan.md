---
title: "Implementation Plan: Series parent rule, sibling listing and trigger phrases for new packets"
description: "State the series parent rule once in phase-definitions.md and point every restatement at it, then make create.sh list recent packets in the track and seed real trigger phrases, with the judge warning on template defaults."
trigger_phrases:
  - "series parent rule plan"
  - "create.sh sibling listing plan"
  - "seeded trigger phrases plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Series parent rule, sibling listing and trigger phrases for new packets

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown rule docs, Bash (`create.sh`), Node ESM (`phrase-judge.mjs`) |
| **Framework** | system-spec-kit CLI |
| **Storage** | None, reads `description.json` and `graph-metadata.json` |
| **Testing** | Vitest, `--project cli` |

### Overview
The rule change comes first, because the authors of the grouped packets knew their siblings and still had no legal home for related small work. The rule is written once in `phase-definitions.md` §2 and every other doc points at it. The two tooling changes then make the rule easy to follow: `create.sh` shows the recent packets in the track before it allocates a number, and new specs carry trigger phrases that name their topic. Each change is implemented by a DeepSeek V4.1 Flash worker from a literal brief and verified by the orchestrator.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- The review of the findings and the plan is done, and the operator chose the scope: rule change, seeded phrases and the sibling listing.
- A test baseline is recorded: the six affected test files pass, 90 tests.

### Definition of Done
- The six affected test files pass, plus any new test file, with the golden snapshot changed only for the seeded phrases.
- `validate.sh --recursive --strict` passes on `034-spec-folder-tooling`.
- No rule doc still says Option D adds a phase or Option E skips.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One source of truth for the rule, with short pointers elsewhere. Advisory tooling that prints and never blocks.

### Key Components
- `phase-definitions.md` §2: the series parent definition and how to create one.
- `create.sh` `resolve_branch_name`: the point where a top-level packet gets its number, and where the listing runs.
- `create.sh` template copy paths: where a copied `spec.md` gets its seeded phrases.
- `phrase-judge.mjs`: the judge `GREP_CONVENTION` already calls for generic trigger phrases.

### Data Flow
`create.sh` resolves the target root, reads each sibling's `description.json` and `graph-metadata.json`, prints the recent ones to stderr, then allocates the number and copies templates. The copied `spec.md` has its four template phrases replaced with phrases built from the slug and the description.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Phase rule docs | State when a parent may exist | Update | `rg` for the thresholds and the old labels |
| `create.sh` | Allocates numbers and copies templates | Update | create tests and a manual run in a scratch root |
| Scaffold golden snapshot | Pins scaffold output | Update | snapshot diff shows only trigger phrase lines |
| `phrase-judge.mjs` | Judges generic phrases | Update | trigger-index tests |
| Gate 3 runtime hook | Asks the folder question | Unchanged | Its text is compared byte for byte |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Rule docs: the series parent in `phase-definitions.md`, then every restatement and label.
2. Seeded trigger phrases in `create.sh` and the judge's template default class.
3. The sibling listing in `create.sh`.
4. Verification: tests, strict validation, trigger index check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Judge flags the template phrases | Vitest `trigger-index.vitest.ts` |
| Integration | `create.sh` seeds phrases and lists siblings, and stays quiet for phase children | Vitest `create-*.vitest.ts` |
| Manual | One `create.sh` run in a scratch specs root | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `opencode` with the DeepSeek V4.1 Flash model | External | Green | The orchestrator applies the change itself |
| `node` on PATH for the listing | Internal | Green | The listing is skipped |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit. Nothing persists outside the repository.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Rule docs | None | Verify |
| Seeded phrases | None | Verify |
| Sibling listing | Seeded phrases, same file | Verify |
| Verify | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Rule docs | Low | 30 minutes |
| Seeded phrases and judge | Med | 45 minutes |
| Sibling listing | Med | 45 minutes |
| **Total** | | **2 to 3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Test baseline recorded before the first change

### Rollback Procedure
1. `git revert` the phase commit.
2. Rerun the six affected test files.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
