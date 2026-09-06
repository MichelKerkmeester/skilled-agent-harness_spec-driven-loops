---
title: "Implementation Plan: Give every mark a pointer target of at least 24 CSS pixels and enforce it"
description: "Replace per-mark hit testing with a nearest-mark resolver on the nine forms whose marks sit under the pointer floor, then add the corpus rule that keeps it true. Records the measurement trap that made the first baseline wrong and the settled-render claim that did not survive testing."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Give every mark a pointer target of at least 24 CSS pixels and enforce it

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

One mechanism and one rule.

The mechanism replaces `markAt()`'s DOM hit test with a nearest-mark resolver on the nine forms
carrying marks under the floor. Every mark gets the region nearer to it than to any other, which is
larger than an enlarged mark wherever marks are far apart and the largest available where they are
close. Resolution is ordered: direct hit, then the smallest containing box, then nearest centre
within a bounded reach.

The rule is `pointer-reach`. It walks an 11 by 11 grid over each drawing, dispatches a real
pointer at each position, and fails a form that answers nothing across more than a tenth of the
grid or answers with a mark other than the nearest.

Both halves depend on one harness fact: these transforms are compositor-driven, so the paint
settles while `getBoundingClientRect()` still reports the pre-animation box. Anything that reads
geometry must force animations first.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The resolver lives in each file, as everything here does, and is the same excerpt in all nine.
It caches each mark's `getBBox()` once. `getBBox()` reports drawn geometry independent of layout
and of the entry transform, which is what keeps a region stable while a bar grows in; a region
measured from the painted box would move.

Ordering carries the design. A direct DOM hit is exact and cheapest, so it wins. Containment comes
next because nearest-centre alone is wrong for stacked rectangles: on `stacked-bars` a point inside
one segment can sit nearer another segment's centre, and naming that neighbour would attribute a
reading to the wrong series. Nearest centre is the fallback, bounded so that pointing away from the
drawing still means nothing.

`pointer-reach` runs inside the render pass on a temporary instrumented copy, never on a corpus
file. It is the second rule that can only learn anything by opening a card.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| [producer/helper/policy] | [what owns the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |
| [consumer/status/docs/tests] | [how it observes the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The corpus checker is the test suite, so a rule is tested by watching it fail. `pointer-reach` gets
a deliberate mutation that trips exactly its branch, run against a real file in place and restored
from a byte-identical copy.

Correctness of the resolver is proven by probe rather than by reading: a grid walk per form,
comparing the card each position opens against the geometrically nearest mark. That walk found the
one case the design exists for, and it also produced a false alarm on `stacked-bars` where the
oracle, not the resolver, was wrong.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [System/Library] | [Internal/External] | [Green/Yellow/Red] | [Impact] |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: [Conditions requiring rollback]
- **Procedure**: [How to revert changes]
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

| Phase | Complexity | Notes |
|-------|------------|-------|
| Measure the baseline | Medium | The measurement is the delicate part, not the fix |
| The resolver, nine forms | Low | One proven excerpt, transferred mechanically |
| The rule and its proof | Medium | It must be watched failing before it counts |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Every changed file is tracked and uncommitted, so the working tree is the backup
- [x] No flag applies: the resolver is a function body and the rule is one call site
- [x] Nothing is deployed; the gate is run on demand

### Rollback Procedure
1. Restore the original `markAt` in the nine templates and revert the three `markAt(e)` call sites.
2. Remove the `checkPointerReach` call from the render pass.
3. Re-run `node scripts/check-corpus.cjs --render` and confirm `RESULT: PASSED`.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A. No data changes; the rule writes only to a temporary directory.
<!-- /ANCHOR:enhanced-rollback -->

---

