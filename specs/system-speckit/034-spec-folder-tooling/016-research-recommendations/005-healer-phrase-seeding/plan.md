---
title: "Implementation Plan: Phase 5: healer-phrase-seeding"
description: "Delete TEMPLATE_DEFAULTS, refill empty lists from the slug seeder, fix inferTriggerPhrases and test that the upgrade writes no phrase in a negative judge class."
trigger_phrases:
  - "healer phrase seeding plan"
  - "heal-spec-docs phrase refill policy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: healer-phrase-seeding

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, JavaScript/TypeScript |
| **Framework** | Vitest (test framework), MJS modules |
| **Storage** | File-based, Markdown frontmatter |
| **Testing** | Vitest unit tests, phrase-judge grade checks |

### Overview
Fix the mismatch between the upgrade path's phrase writers and phrase-judge.mjs. Delete TEMPLATE_DEFAULTS from heal-spec-docs.cjs and refill an empty list with the exact output of `seededPhrases` from template-phrase-cleanup.mjs. Make `inferTriggerPhrases` in frontmatter-migration.ts emit only phrases the judge admits. Add an upgrade-legacy test that grades every written phrase against every negative class. The operator decided this approach on 2026-10-08.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Code pathways traced in heal-spec-docs.cjs, phrase-judge.mjs, and upgrade-legacy.mjs
- [ ] Test stubs for the seeder pin and the upgrade-output grade check identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] create-root-numbering.vitest.ts passes with the heal-spec-docs seeder pin
- [ ] upgrade-legacy.vitest.ts passes with a grade check across every negative judge class
- [ ] Code diff shows TEMPLATE_DEFAULTS deleted
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at source: the two upgrade-path phrase writers stop writing values that phrase-judge.mjs rejects.

### Key Components
- **heal-spec-docs.cjs**: TEMPLATE_DEFAULTS is deleted. An empty list is refilled with `seededPhrases(file, kind, description)`, loaded through dynamic `import()` because the healer is CommonJS.
- **template-phrase-cleanup.mjs**: Exports `seededPhrases` unchanged.
- **frontmatter-migration.ts**: `inferTriggerPhrases` filters its candidates through `judgeTriggerPhrase` and drops the `memory`, `indexing`, `context` fallback. When nothing admissible remains, the field stays empty.
- **phrase-judge.mjs**: No change.
- **Tests**: create-root-numbering.vitest.ts pins healer output to the seeder; upgrade-legacy.vitest.ts grades every written phrase.

### Data Flow
1. fill-frontmatter adds a missing trigger_phrases key with admissible phrases only, or leaves it empty
2. heal-spec-docs refills an empty list with the slug seeder output
3. The result is graded by phrase-judge.mjs
4. The test asserts no written phrase falls in any negative class

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `TEMPLATE_DEFAULTS` (heal-spec-docs.cjs:45) | Refill source for empty lists | Delete | grep finds no reference |
| `seededPhrases` (template-phrase-cleanup.mjs:125) | Slug seeder for the cleanup | Export, call from the healer | Pin test compares healer output to it |
| `inferTriggerPhrases` (frontmatter-migration.ts:985) | Phrase source for a missing key | Drop negative-class candidates and the fallback list | Grade check in upgrade-legacy.vitest.ts |
| `phrase-judge.mjs` (line 121) | Judge | No change | Test output against this judge |
| `upgrade-legacy.mjs` (line 394) | Calls heal-spec-docs --apply after fill-frontmatter | No change, output validated | Test result through phrase-judge |
| `create-root-numbering.vitest.ts` (starting at line 224) | Three-way consistency pin | Add a case pinning healer output to the seeder | New test case |
| `upgrade-legacy.vitest.ts` (test suite) | Upgrade workflow validation | Add a grade check over every negative class | New test: grade every written phrase |

Same-class producers: heal-spec-docs.cjs and inferTriggerPhrases, both called by upgrade-legacy. create.sh and the cleanup already seed from the slug.
Consumers of TEMPLATE_DEFAULTS: heal-spec-docs.cjs only.
Test matrix: empty list, missing key, non-empty list, per document class.
Invariant: the upgrade path never writes a phrase that phrase-judge grades in a negative class.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

1. **Setup**: Trace both phrase writers and the seeder
2. **Implementation**: Delete TEMPLATE_DEFAULTS, call the seeder, filter inferTriggerPhrases
3. **Verification**: Add tests, run test suite, validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | TEMPLATE_DEFAULTS deletion | grep for references |
| Integration | Upgrade path output grade check | Vitest: upgrade-legacy.vitest.ts |
| Consistency | Healer output equals seeder output | Vitest: create-root-numbering.vitest.ts |

Key tests:
- `create-root-numbering.vitest.ts`: A case that runs the healer on an empty list and expects exactly `seededPhrases` output
- `upgrade-legacy.vitest.ts`: A fixture with an empty list and a missing key, upgraded with `--apply`, where every written phrase grades `null` from `judgeTriggerPhrase`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| SH-05 must land before SH-08 | Internal, research-ordered | Unblocked | SH-08 depends on both SH-05 and SH-06 |
| Empty-list fallback decision | Operator | Decided 2026-10-08: refill from the slug seeder | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Test failures or broken upgrade path
- **Procedure**: `git revert` the commit, correct the healer or the inference, re-test
- **Data impact**: Code-only change. No corpus written by this phase.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

No internal phases. Single-stage fix: modify code, extend tests, validate.

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 min: trace code paths |
| Core Implementation | Low | 2-3 hours: seeder call, inference filter |
| Verification | Low | 1 hour: extend tests, run suite, validate |
| **Total** | | **3-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Tests pass before commit
- [ ] Code diff reviewed against spec
- [ ] Backward-compatibility checked (no breaking API change)

### Rollback Procedure
1. `git revert` the commit
2. Find which writer produced the bad phrase
3. Fix that writer
4. Retest

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Code-only revert. No corpus affected.
<!-- /ANCHOR:enhanced-rollback -->

---

