---
title: "Implementation Plan: Trigger phrase quality enforcement"
description: "Re-measure every round-two count in the main checkout, extract the judge into a dependency-free module and add the two classes, count them in the generator, point the doctor at the count, and correct the documents; prove it with the retrieval suites and two identical regenerations."
trigger_phrases:
  - "phrase quality plan"
  - "judge extraction plan"
  - "diagnostics bucket plan"
  - "doctor pollution signal"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Trigger phrase quality enforcement

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | ESM `.mjs` retrieval scripts, vitest, a doctor YAML asset, Markdown |
| **Framework** | None |
| **Testing** | vitest suites for the judge, the generator, coverage parity, recipes and the retrofit pipeline; two consecutive regenerations |

### Overview
The counts were re-measured first with a Python census of the committed index, which matched the lane. The judge was then moved into its own module so the generator could import it without pulling in the retrofit machinery and its shared-package dependency; two classes were added behind the existing ones; the generator gained the bucket; the doctor asset, the presentation asset and the two documents followed. One existing test admitted bare symbols, which the convention itself disallows, and was corrected with a comment saying why.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One judge, three readers: the retrofit pipeline and the validator report, the generator counts.

### Key Components
- **`lib/phrase-judge.mjs`**: word lists and the judge; imports only the normalizer
- **`generate-trigger-index.mjs`**: judges every unique key and writes `phraseQuality`
- **`doctor-speckit-retrieval.yaml`**: reads the bucket as the pollution signal

### Data Flow
Frontmatter → normalized key → judge → class → diagnostics bucket → doctor report. The lookup never reads any of it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `judgeTriggerPhrase` and its word lists | Phrase admission | move and extend | grep-convention suite, including the corrected allowlist case |
| Generator diagnostics | Committed artifact | extend | trigger-index suite; two identical regenerations; the committed bucket matches the hand census |
| Doctor asset | Pollution and pair signals | update | YAML parse; the activity names the committed artifact |
| Presentation asset §3 | Agent-facing contract | update | the five labels and four fields match `normalize.mjs` and `rg-lane.mjs` |
| README and conventions | Prose | update | sk-doc validator; the parity suite still agrees with §9 |

Required inventories:
- Same-class producers: `grep` for `containment`, `token-coverage`, `six scripts`, `three documented`, `retrofit-convention.mjs` across the retrieval tree and the command assets.
- Consumers of changed symbols: `grep-convention.mjs` re-exports every moved symbol; `check-grep-convention-helper.mjs` and `ops/retrofit-convention.mjs` import from it unchanged.
- Matrix axes: phrase shape (single token, numbers only, generic, fallback, stop-word only, prose, two-token concept) by consumer (retrofit, validator, generator).
- Algorithm invariant: a phrase's class is decided once, by the judge, from its normalized form.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Judge classes and order; generator bucket | vitest |
| Integration | Coverage parity, recipe and retrofit suites; two regenerations compared by hash | vitest, node, shasum |
| Manual | Python census of the committed index; sk-doc validator on the two documents | python |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Lane 001's round-two census | Internal | Green | Nothing to fix without it |
| Child 006's committed pair | Internal | Green | The regeneration must start from a matched pair |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a consumer of the judge rejects phrases it must admit, or regeneration stops being deterministic
- **Procedure**: `git revert` the single commit and regenerate the index
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 40 minutes of census |
| Core Implementation | Med | 1 hour |
| Verification | Low | 20 minutes |
| **Total** | | **About 2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed; the artifacts regenerate from the corpus
- [x] Feature flag configured - none; the classes warn
- [x] Monitoring alerts set - the generator prints the bucket on every run

### Rollback Procedure
1. `git revert` the commit
2. Regenerate the index
3. No stakeholders to notify

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
