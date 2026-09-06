---
title: "Implementation Plan: Close every deferral the packet left: repair the pointer-only readings, enforce the readout rule, and require a contract row per form"
description: "Repair the two forms whose card reveals readings their table never carried, give stacked-area the totals row its card reads out, then turn the property into two corpus rules and watch each one fail before trusting it. Closes the no-script item as a decision rather than future work."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Close every deferral the packet left: repair the pointer-only readings, enforce the readout rule, and require a contract row per form

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Three repairs, two rules, four proofs, in that order. The repairs land first so the rules arrive
on a corpus that already satisfies them, which is the same ordering the register rule used one
phase earlier: a rule that lands on a red corpus cannot be distinguished from a rule that is
itself wrong.

The repair is the same shape in all three files. A card can reveal a reading, so the table gains
that reading. `distribution-strip` and `pick-times-by-depot` gain a column carrying every record
behind the five-number summary rather than replacing it. `stacked-area` gains a table foot with
the whole-period series totals, which is what its card reads out and the one figure its monthly
rows never state.

The rules then make the property enforceable. `card-readout` opens each card under a synthetic
pointer and compares what it shows against the table. `pointer-contract-coverage` requires a row
per form in both directions. Neither is trusted until it has been watched failing.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Command | Pass condition |
|------|---------|----------------|
| Corpus, static | `node scripts/check-corpus.cjs` | literal `RESULT: PASSED` |
| Corpus, rendered | `node scripts/check-corpus.cjs --render` | literal `RESULT: PASSED` |
| Readout sweep | pointer walk over all 27 corpus files | no card value missing from its table |
| Packet | `validate.sh <folder> --strict` | literal `RESULT: PASSED`, first `RESULT:` line |

An exit code is not a gate. A run that prints nothing has failed.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

`card-readout` runs inside the existing render pass, which already opens every file in headless
Chrome three times. A card exists only while a pointer is on a mark, so no static read can see
it: the rule writes an instrumented copy of the file to a temporary directory, appends a driver
that dispatches `pointermove` across a sample of marks and serialises what each card showed into
the document, then opens that copy and reads the result back out of the dumped DOM. The corpus
files themselves are never modified.

The number matcher is the load-bearing detail. A table cell may hold one reading or a list of
them, and a thousands separator is a comma with no space after it while a list separator is a
comma with a space. Splitting on comma-then-space is what separates the two, and getting it
wrong reports a false failure on exactly the files this phase repaired.

`pointer-contract-coverage` is static. It reads the per-form table out of the contract document,
cut at the next heading because the file holds several tables whose first cell is a backticked
name, and compares that set against the directory in both directions.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Axis | Finding |
|------|---------|
| Finding class | `class-of-bug`. The instance is `distribution-strip`; the class is any card that can outrun its table, and `card-readout` is what closes the class. |
| Same-class producers | All 27 corpus files swept. Three carried the defect: `distribution-strip`, its delivery `pick-times-by-depot`, and `stacked-area` in the weaker derived-aggregate form. |
| Consumers | `check-corpus.cjs` is consumed by the corpus gate alone. The contract document is read by authors and now by the checker, which is new. |
| Adversarial cases | List cell against thousands separator; card that never opens; card with no table; contract row without a form; form without a contract row. |
| Evidence pinning | Pinned to the pre-change working tree and the walk output, not to a moving range. |

<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Repair the three tables, then sweep all 27 files and confirm no card outruns its table.
2. Add `pointer-contract-coverage`, confirm green, mutate both directions, restore.
3. Add `card-readout`, confirm green under `--render`, mutate, restore.
4. Document both rules and both recipes; correct the contract's strip row.
5. Close the parent's open items and reconcile its documents.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

There is no unit-test harness in this package; the corpus checker is the test suite, and a rule
is tested by watching it fail. Each new rule gets a deliberate mutation that triggers exactly its
branch, run against the real files in place and restored from a byte-identical copy. A rule that
has only ever passed is not evidence that it works.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node and a headless Chrome already used by the render pass. Nothing new is installed.
- `008-closure-and-proof`, whose measurement found the defect this phase repairs.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Every changed file is tracked and uncommitted, so `git checkout --` on the six paths in the Files
to Change table restores the pre-phase state exactly. The two new rules are additive: removing
their call sites disables them without touching any other check.

<!-- /ANCHOR:rollback -->

---


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
| Repair the three tables | Low | The same edit three times, already measured |
| The two rules | Medium | The readout rule drives a browser, which is where the care goes |
| Mutation proofs | Low | Four mutations, each restored from a byte-identical copy |
| Verification | Medium | The render gate opens every file four times rather than three |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every changed file is tracked and uncommitted, so the working tree is the backup
- [x] No feature flag applies: the rules are additive call sites in one script
- [x] No monitoring applies: the corpus gate is run on demand, not deployed

### Rollback Procedure
1. `git checkout --` the six paths in the Files to Change table.
2. Re-run `node scripts/check-corpus.cjs --render` and confirm `RESULT: PASSED`.
3. Confirm the two new checks no longer appear in the printed tally.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. Nothing outside this package's own files is written, and the readout rule works on temporary copies rather than the corpus files.
<!-- /ANCHOR:enhanced-rollback -->

---

