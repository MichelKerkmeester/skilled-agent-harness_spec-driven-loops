---
title: "Implementation Plan: Phase 5: DeepSeek V4.1 Flash on Devin"
description: "Two ids into two mirrored lists, a fixture that binds itself to the source, and one guidance paragraph that names a silent failure."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: DeepSeek V4.1 Flash on Devin

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Two ids into two lists that must stay byte-identical, and a fixture that walks them. The risk here
is not the edit. It is that the two lists are kept in step by hand, so the only thing standing
between them and drift is a test that has to be told about every new id.

That is the part worth changing. The fixture now derives its expectation from the source array
instead of restating it, so the next id that lands without a passing dispatch shape fails in the
suite rather than at run time.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 5. QUALITY GATES

- `npx vitest run tests/unit/executor-config.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/combo-matrix.vitest.ts`
- `validate.sh <folder> --strict` reports `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 2. APPROACH

1. **Add both tiers to the source array**, sorted, with a comment that says which was dispatch-tested and which was list-verified only.
2. **Mirror the same additions** into the fan-out Set, which is a hand-duplicated copy the suite cross-checks.
3. **Bind the fixture to the source.** The fan-out test listed the roster by hand. It now asserts its own list equals the source array, so the two cannot drift apart silently.
4. **Name what `auto` refuses** in the skill's permission-mode note, with the observed failure rather than a general caution.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 3. WORK BREAKDOWN

| Step | What | Where |
|------|------|-------|
| 1 | Both tiers, sorted, with honest verification comments | `executor-config.ts` |
| 2 | The mirrored Set | `fanout-run.cjs` |
| 3 | The fixture and its parity assertion | `fanout-run.vitest.ts` |
| 4 | The permission-mode note | `cli-devin/SKILL.md` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. PROOF PLAN

| Claim | Check |
|-------|-------|
| The lists agree | A parser reads both arrays and compares them element by element |
| Neither list holds a duplicate or is out of order | The same parser checks uniqueness and sort order |
| Every listed id builds a command | The fan-out fixture walks the whole roster |
| Nothing else regressed | The three guard suites run together, not one at a time |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 2 for the DeepSeek V4 Flash precedent this follows.
- The live `devin models list` output, which is the only source for what the service serves.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK

Remove both ids from the two lists and the fixture, then rerun the three suites. The allowlist is
fail-closed, so removing an id restores the prior refusal rather than leaving a gap.
<!-- /ANCHOR:rollback -->

---

