---
title: "Implementation Plan: Phase 11: template-phrase-census-and-cleanup"
description: "Flag the acceptance criteria template defaults in the phrase judge, seed packet-specific phrases into new acceptance-criteria files, and add a read-only census plus a dry-run-first cleanup whose approved apply replaced the exact template block in 509 files across 375 packets."
trigger_phrases:
  - "template phrase census and cleanup plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: template-phrase-census-and-cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM for the two tools and the judge, Bash for `create.sh`, TypeScript for the vitest suites |
| **Framework** | system-spec-kit runtime CLI, no application framework |
| **Storage** | The `specs/` tree: Markdown frontmatter and the checked-in phrase templates |
| **Testing** | Vitest (`npx vitest run runtime/cli/tests`) |

### Overview

The acceptance criteria template shipped four placeholder trigger phrases into every Level 2 packet, so any prompt naming them matched hundreds of packets. This phase puts the four defaults in the judge's `template-default` class, seeds a packet-specific phrase into new `acceptance-criteria.md` files, and adds two tools: a read-only census and a dry-run-first cleanup. After the operator reviewed the dry run, the approved `--apply` replaced the exact template block in 509 files across 375 packets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented - spec.md sections 2 and 3 fix the scope at the judge class, the seeder, two new tools and the approved cleanup run
- [x] Success criteria measurable - SC-001 names the dry-run output and SC-002 names the existing seeding and judge tests
- [x] Dependencies identified - Phase 8's single phrase source in `create.sh` and `phrase-judge.mjs`, which this phase extends

### Definition of Done
- [x] Acceptance criteria reviewed - five of six Met with evidence in `acceptance-criteria.md`, AC-006 Unmet pending the trigger index rebuild
- [x] Tests passing - the seeding and judge suites grew to 80 tests, and the whole CLI folder passed with 1621 tests and 0 failed
- [x] Docs updated - spec, plan, tasks, acceptance criteria and the implementation summary reconciled at close
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Standalone Node CLI scripts over one shared library module. The census module owns template loading, frontmatter parsing, the tree walk and the exact-block matcher. The cleanup imports those helpers and adds the plan or apply write path. The judge owns the phrase classes.

### Key Components
- `phrase-judge.mjs`: the `template-default` class, extended with `AC_TEMPLATE_DEFAULT_PHRASES`.
- `create.sh`: `replace_template_default_trigger_phrases`, which replaces the exact template block in `spec.md` and now in `acceptance-criteria.md` with slug-seeded phrases.
- `template-phrase-census.mjs`: read-only counts per track, live and archived apart, plus informational counts for the other templates.
- `template-phrase-cleanup.mjs`: the same matcher plus `--apply`, `--include-archive`, before and after sha256 per written file, and exit codes 0, 1 and 2.
- `template-phrase-cleanup.vitest.ts`: the tool tests, with `trigger-index.vitest.ts` and `create-root-numbering.vitest.ts` covering the judge and the seeder.

### Data Flow
The tools read each template's `trigger_phrases` rows, walk the `specs/` tree, parse each frontmatter, and look for the exact template block. The census counts matches per track. The cleanup prints each proposed replacement in a dry run, and under `--apply` writes the seeded replacement rows, hashing the file before and after. No write happens without an exact block match.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `specs/` corpus (`spec.md`, `acceptance-criteria.md`) | Carries the exact template block in frontmatter `trigger_phrases` | Updated by the approved apply | 509 files in 375 packets changed, 0 archived, and a second dry run reported 0 files to change |
| `phrase-judge.mjs` | Warns on template phrases in retrieval and validation | Updated with the acceptance criteria set | `trigger-index.vitest.ts` asserts two of the four phrases judge as `template-default` |
| `create.sh` | Seeds `trigger_phrases` into new packets | Updated to seed `acceptance-criteria.md` too | `create-root-numbering.vitest.ts` asserts no `closure gate` and the seeded slug phrase, and pins the shell list to the template |

Required inventories:
- Same-class producers: the shell list in `create.sh` and `AC_TEMPLATE_DEFAULT_PHRASES` in `phrase-judge.mjs` are the two sources, and the pin test ties the acceptance criteria list to `templates/addons/acceptance-criteria.md.tmpl`.
- Consumers of the changed surfaces: `create-root-numbering.vitest.ts` for the seeder, `trigger-index.vitest.ts` for the judge, and `template-phrase-cleanup.vitest.ts` for both tools.
- Matrix axes: document kind (spec, acceptance criteria) by run mode (dry run, apply, second apply) by skipped location (scratch, containment).
- Algorithm invariant: the cleanup writes only when an exact template block is present, never on a partial match, and the tests cover malformed frontmatter, non-sequence `trigger_phrases`, skipped folders, no-op runs and duplicate suppression.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Judge and seeder: the acceptance criteria set in `phrase-judge.mjs` and the seed path in `create.sh`, with pin tests.
2. Tools: the read-only census and the dry-run-first cleanup, with their test file.
3. Corpus: the operator-reviewed dry run, then the approved `--apply`, then metadata re-derivation and strict validation.
4. Verification: the affected suites, the census on the real tree and the final CLI folder regression.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Judge classes, cleanup plan and apply, census counters | Vitest (`template-phrase-cleanup.vitest.ts`, `trigger-index.vitest.ts`) |
| Integration | Scaffolded packet carries seeded phrases, shell list pinned to the template | Vitest (`create-root-numbering.vitest.ts`, `create-track-refresh.vitest.ts`) |
| Manual | Operator review of the dry run, then the approved apply over `specs/` | The two tools' own output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 8's single phrase source in `create.sh` and `phrase-judge.mjs` | Internal | Green | The judge and seeder changes would conflict with the source they extend |
| `js-yaml` and the existing CLI test harness | Internal | Green | The tools could not parse frontmatter and the suites could not run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The apply is found to have replaced an authored phrase, or a touched packet fails strict validation for a reason other than the pending index rebuild.
- **Procedure**: `git revert` the phase commit. One revert restores the 509 corpus files and the tool changes together. While the phase commit does not yet exist, the changes sit uncommitted and can be restored from `HEAD`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Judge class and seeder (phrase-judge.mjs, create.sh)
          |
          +--> Census and cleanup tools (template-phrase-census.mjs, template-phrase-cleanup.mjs)
                        |
                        +--> Dry run and approved apply over specs/
                                      |
                                      +--> Metadata re-derivation and strict validation
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Judge class and seeder | Phase 8's phrase source | Census and cleanup tools |
| Census and cleanup tools | Judge class and seeder | The approved apply |
| Approved apply | Operator review of the dry run | Metadata re-derivation and validation |
| Metadata re-derivation and validation | Approved apply | Packet closure (trigger index rebuild) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Judge class and seeder | Low | One set, one seed block and their tests |
| Census and cleanup tools | Med | Two new tools sharing one matcher |
| Approved apply and validation | Med | 375 packets re-derived and validated after the apply |
| **Total** | | **One change set delivered on 2026-10-07, no separate estimate recorded** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Dry run reviewed before the apply - the operator approved `--apply` after seeing the file list
- [x] Write scope bounded - the tools write only frontmatter `trigger_phrases` lines under `specs/`, and skip `scratch/` and `containment/`
- [x] Per-file evidence - every written file reports a before and after sha256
- Feature flag and monitoring alerts are not applicable to a local CLI data edit

### Rollback Procedure
1. Stop further apply runs.
2. `git revert` the phase commit, or restore the corpus and tool files from `HEAD` while the change is uncommitted.
3. Rerun the cleanup dry run to confirm it lists the restored blocks, and rerun the CLI test suites.
4. No user-facing surface needs an announcement, the phrases are index input only.

### Data Reversal
- **Has data migrations?** Yes, a frontmatter phrase edit across the corpus.
- **Reversal procedure**: `git revert` of the phase commit restores every changed `trigger_phrases` line. No other stored data changed.
<!-- /ANCHOR:enhanced-rollback -->

---
