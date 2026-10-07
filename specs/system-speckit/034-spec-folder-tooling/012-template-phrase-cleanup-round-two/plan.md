---
title: "Implementation Plan: Phase 12: template-phrase-cleanup-round-two"
description: "Add the plan, tasks and implementation summary default phrase sets to the phrase judge, seed those documents in new packets, trim trailing stop words from description phrases, teach the cleanup partial blocks and the three new kinds, and apply the approved cleanup to 1,319 live files across 541 folders."
trigger_phrases:
  - "template phrase cleanup round two plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: template-phrase-cleanup-round-two

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM for the judge, the census and the cleanup, Bash for `create.sh`, TypeScript for the vitest suites |
| **Framework** | system-spec-kit runtime CLI, no application framework |
| **Storage** | The `specs/` tree: Markdown frontmatter and the checked-in phrase templates |
| **Testing** | Vitest (`npx vitest run runtime/cli/tests`) |

### Overview

Every template shipped default trigger phrases into the documents it scaffolded, so a prompt about the templates themselves matched the packets that carried those rows. This phase puts the plan, tasks and implementation summary defaults into the judge's `template-default` class, seeds those three documents in new packets, trims trailing stop words from the description-derived phrase, and teaches the cleanup to handle partial blocks and the three new kinds. The operator approved the apply, which changed 1,319 files across 541 folders, and strict validation passes for 520 of them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented - spec.md sections 2 and 3 fix the scope at the judge sets, the seeder, the trim, the cleanup rules and the approved apply
- [x] Success criteria measurable - SC-001 names the census carrier count and SC-002 names the CLI test failures
- [x] Dependencies identified - the phase 11 tools and phrase lists carried over and are the only dependency

### Definition of Done
- [x] Acceptance criteria reviewed - seven of seven Met with evidence
- [x] Tests passing - the CLI suite grew from the 1625-pass baseline to 1636 passed, 19 skipped and 0 failed
- [x] Docs updated - spec, plan, tasks, acceptance criteria and the implementation summary reconciled at close
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standalone Node CLI scripts over shared library modules, plus the shell scaffolder. The judge owns the five frozen phrase sets and their match rule. `create.sh` owns the seeding and the shell stop-word list. The cleanup owns the partial-block and trim rules and imports the census helpers for the tree walk and frontmatter parsing.

### Key Components
- `phrase-judge.mjs`: the `template-default` class, extended with `PLAN_TEMPLATE_DEFAULT_PHRASES`, `TASKS_TEMPLATE_DEFAULT_PHRASES` and `IMPLEMENTATION_SUMMARY_TEMPLATE_DEFAULT_PHRASES`.
- `create.sh`: `replace_template_default_trigger_phrases` now seeds the three additional documents and trims the description with a 48-word shell list.
- `template-phrase-cleanup.mjs`: the new kinds, the partial-block rules, the exported `DESCRIPTION_STOP_WORDS` list and the `spec.md` reseed.
- `template-phrase-census.mjs`: counts the three new kinds and the partial carriers per kind.
- Test files: `template-phrase-cleanup.vitest.ts`, `create-root-numbering.vitest.ts` and `trigger-index.vitest.ts`.

### Data Flow
The judge normalizes a phrase and checks it against the five frozen sets. `create.sh` reads the packet slug, builds the phrase, trims trailing stop words from the description and writes the rows into a new packet's documents. The cleanup reads each template's rows, walks the `specs/` tree, parses frontmatter and decides per list: an exact block is replaced, a partial block loses only its default rows, a defaults-only list is reseeded, and an eight-word `spec.md` phrase ending on a stop word is trimmed. Nothing is written without `--apply`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `specs/` corpus, five document kinds | Carries template defaults and partial carriers in frontmatter `trigger_phrases` | Updated by the approved apply | 1,319 files changed across 541 folders, a second run reports 0 changes, and the census reports 0 live carriers |
| `phrase-judge.mjs` | Decides `template-default` warnings in retrieval and validation | Updated with the three sets | `trigger-index.vitest.ts` rejects a phrase from each of the five templates |
| `create.sh` | Seeds trigger phrases into new packets | Updated to seed three more documents and trim stop words | `create-root-numbering.vitest.ts` asserts the seeds, the trim and the template pins |
| `template-phrase-cleanup.mjs` | Plans and applies phrase edits under `specs/` | Updated with the new kinds and the partial and trim rules | `template-phrase-cleanup.vitest.ts` covers each rule and the clean second run |
| `template-phrase-census.mjs` | Reports carriers per track, live and archived apart | Updated to count the new kinds and the partial carriers | `template-phrase-cleanup.vitest.ts` covers the counts |

Required inventories:
- Same-class producers: the five judge sets, the five shell lists in `create.sh` and the cleanup's own matcher are the phrase sources, and the pin tests tie each to its template.
- Consumers of changed surfaces: `create-root-numbering.vitest.ts` imports the three new judge sets, and `template-phrase-cleanup.vitest.ts` drives the cleanup and the census.
- Matrix axes: document kind (five) by list shape (exact block, partial, defaults-only, author-only) by run mode (dry run, apply, second apply).
- Algorithm invariant: only a row that exactly matches a frozen default can be removed, and a phrase outside the sets is never touched. The adversarial cases are a file with no frontmatter delimiter, a defaults-only list, a duplicate phrase and a run that changes nothing.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Judge sets and seeder: the three frozen sets, the three document seeds and the stop-word trim, with the pin tests.
2. Cleanup rules: the new kinds, partial blocks and the `spec.md` reseed, with their tests.
3. Census and corpus: the carrier counts, the dry run and the operator-approved apply, then metadata re-derivation and strict validation.
4. Verification: the final CLI folder regression and the trigger index check that the orchestrator runs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Judge sets, the stop-word trim, the partial rules and the census counters | Vitest (`template-phrase-cleanup.vitest.ts`, `trigger-index.vitest.ts`) |
| Integration | A scaffolded packet carries the three seeds and no defaults, and the shell lists are pinned to the templates | Vitest (`create-root-numbering.vitest.ts`) |
| Manual | Operator review of the dry run, then the approved apply over `specs/` | The cleanup tool's own output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 11's judge, seeder and cleanup tools | Internal | Green | The new sets and rules extend them |
| The checked-in phrase templates | Internal | Green | Without them the judge and the pin tests have nothing to bind to |
| `js-yaml` and the existing CLI test harness | Internal | Green | The cleanup could not parse frontmatter and the suites could not run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An applied change is found to have removed an author phrase, or a touched packet fails strict validation for a reason this phase introduced.
- **Procedure**: `git revert b36842de3c1` first, which undoes the fixes to the 21 pre-existing failures, then `git revert 7fe1cbeda87`, which restores every changed phrase row, then `git revert 5e4164bfac9`, which restores the tool changes. Each revert undoes one layer.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Judge sets and seeder (phrase-judge.mjs, create.sh)
          |
          +--> Cleanup and census rules (template-phrase-cleanup.mjs, template-phrase-census.mjs)
                        |
                        +--> Dry run and approved apply over specs/
                                      |
                                      +--> Metadata re-derivation and strict validation
                                      |
                                      +--> Trigger index rebuild (orchestrator)
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Judge sets and seeder | Phase 11's phrase tools | Cleanup and census rules |
| Cleanup and census rules | Judge sets and seeder | The approved apply |
| Approved apply | Operator review of the dry run | Metadata re-derivation and validation |
| Metadata re-derivation and validation | Approved apply | Trigger index rebuild |
| Trigger index rebuild | Validation over the touched folders | Packet closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Judge sets and seeder | Low | Three sets, three seeds and their tests |
| Cleanup and census rules | Med | Partial blocks, the trim and the new kinds across two tools |
| Approved apply and validation | High | 1,319 files re-derived and validated after the apply |
| **Total** | | **One change set across three lanes on 2026-10-07, no separate estimate recorded** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Dry run reviewed before the apply - the operator approved the apply as its own commit after the 10-sample review
- [x] Write scope bounded - the tools write only frontmatter `trigger_phrases` lines under `specs/`, and skip `scratch/` and `containment/`
- [x] Per-file evidence - the dry run lists each proposed change and the apply reports the changed paths
- Feature flags and monitoring alerts do not apply to a local CLI data edit

### Rollback Procedure
1. Stop further apply runs.
2. `git revert 7fe1cbeda87` to restore the corpus phrase rows.
3. `git revert 5e4164bfac9` to restore the tool changes.
4. Rerun the cleanup dry run to confirm it lists the restored defaults, and rerun the CLI suites.
5. No user-facing announcement is needed, the phrases are index input only.

### Data Reversal
- **Has data migrations?** Yes, a frontmatter phrase edit across the corpus.
- **Reversal procedure**: The two reverts restore every changed `trigger_phrases` line and the tool changes. No other stored data changed.
<!-- /ANCHOR:enhanced-rollback -->

---
