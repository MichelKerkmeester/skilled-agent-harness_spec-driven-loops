---
title: "Implementation Plan: Phase 9: gate-3-menu-series-parent"
description: "Put the series parent rule into the runtime Gate 3 menu and the mutation notice from one source of truth in spec-gate-core.mjs, update every runtime copy to the short form, and pin the text in the affected suites."
trigger_phrases:
  - "gate 3 menu series parent plan"
  - "gate 3 option labels plan"
  - "menu wording plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 9: gate-3-menu-series-parent

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`spec-gate-core.mjs`), TypeScript (the Pi extension), plain text and Markdown assets |
| **Framework** | system-spec-kit runtime hooks and the command asset trees |
| **Storage** | None |
| **Testing** | `node --test` for the hook suite, Vitest for the parity and Pi extension suites, `tsc --noEmit` for the Pi extension |

### Overview
This phase puts the series parent rule where the operator answers it. One source of truth in `spec-gate-core.mjs` carries the new option B and option C text, the Pi dialog reads its labels from that module, and every other runtime copy is updated to the same short form. The copies are pinned by tests so a later drift fails a suite instead of shipping.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- The Phase 7 research and its second-opinion review name the copies to change.
- The baseline is recorded: hook suite 169 pass, 3 skipped, 0 fail.
- The scope boundary is fixed: the runtime menu text and its tests, with `AGENTS.md` untouched.

### Definition of Done
- Option B says new or unrelated work and option C names the series parent, in the menu and in the notice.
- The Pi dialog reads its labels from `spec-gate-core.mjs`.
- The hook suite, the Pi extension suite and the skill-advisor parity suite pass.
- A repository search outside `specs/` finds no copy of the old option C string.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One source of truth with pinned projections. `spec-gate-core.mjs` owns the menu text and the option labels. Every other surface either reads that module or mirrors its text in a copy that a test pins.

### Key Components
- `spec-gate-core.mjs`: `GATE_3_QUESTION`, `GATE_3_MUTATION_NOTICE` and the exported option labels.
- `spec-gate-enforce.ts`: the Pi dialog, which now builds its options from the exported labels.
- `spec-gate-core.test.mjs`: byte pins for the question, the notice, the labels and the hash.
- The parity fixture and the command presentations: the copies the suites compare and the operators read.
- The teaching copies in the README, the worked examples and the trigger config: the same menu, quoted for readers.

### Data Flow
The core module exports the menu text and the label list. The Pi dialog reads the labels and renders its options without a local literal. The command presentations carry the short form, the compiled contracts are regenerated from them, and the pinned tests fail when any copy drifts from the core.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec-gate-core.mjs` | Owns the menu text, the notice and the choice labels | Update | Byte pins in `spec-gate-core.test.mjs`, hook suite 169 pass, 3 skipped, 0 fail |
| `spec-gate-enforce.ts` | The Pi dialog that asks the question | Update | `spec-gate-pi-extension.vitest.ts` 9/9, `tsc --noEmit` exit 0 |
| `baseline-contexts.json` | Skill-advisor parity fixture that mirrors the menu text | Update | `policy-plan-serializer-parity.vitest.ts` 32/32 |
| Command presentations and compiled contracts | Operator-facing copies in the speckit, deep and create command trees | Update | 11 deep test files, 326 tests pass, contracts regenerated |
| Teaching copies (`README.md`, `worked-examples.md`, `trigger-config.md`) | Docs that quote the menu | Update | Repository search outside `specs/` for the old option C strings returned nothing |

Required inventories:
- Same-class producers: the repository search for `including a phase child` and `related folder or phase child` outside `specs/` returned nothing after the change.
- Consumers of the exported labels: the Pi dialog reads them, and the byte pins in `spec-gate-core.test.mjs` guard their text and order.
- Matrix axes: not applicable, this phase has no matrix.
- Algorithm invariant: not applicable, no path, redaction, parser, resolver or security change.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Core menu: option B and option C in `GATE_3_QUESTION` and `GATE_3_MUTATION_NOTICE`, with the choice labels exported.
2. Pins: regenerate the byte pins and the skill-advisor parity fixture.
3. Copies: the Pi dialog, the speckit, deep and create presentations, the compiled contracts and the teaching copies.
4. Verification: the repository sweep and the affected suites from the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Byte pins for the question, the notice, the labels and the hash | `node --test`, hook suite |
| Integration | The Pi dialog reads the exported labels, the parity fixture matches, the deep contracts match their sources | Vitest, `tsc --noEmit` |
| Manual | Repository sweep for the old option C strings outside `specs/` | ripgrep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 7 research and its second-opinion review | Internal | Green | The copy list would come from the search alone and might miss a surface |
| The exported label list in `spec-gate-core.mjs` | Internal | Green | The Pi dialog would keep its own literal |
| `node` and the Pi extension toolchain | Internal | Green | The hook suite and the typecheck could not run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A suite goes red after the change, or a runtime copy drifts from the source again.
- **Procedure**: `git revert` the phase commit and rerun the hook suite, the Pi extension suite, the parity suite and the typecheck. While the phase commit does not yet exist, the change sits uncommitted, so restore the edited files from `HEAD` instead.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Core menu and label exports (spec-gate-core.mjs)
          |
          +--> Pi dialog reads the labels (spec-gate-enforce.ts)
          +--> Byte pins and parity fixture regenerated
          +--> Copy sweep (speckit, deep, create, teaching copies)
                        |
                        +--> Verification sweep and suites
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Core menu and labels | None | Pins, Pi dialog, copies |
| Pins and parity fixture | Core menu and labels | Verification |
| Pi dialog | Core menu and labels | Verification |
| Copy sweep | Core menu and labels | Verification |
| Verification | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Core menu and label exports | Low | Two strings and one export list |
| Pins and parity fixture | Low | Regenerate against the new text |
| Copy sweep | Low | Small edits across the presentation and doc copies |
| Verification | Med | Several suites and a repository sweep |
| **Total** | | **One change set, no separate estimate recorded** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - N/A, no data changes
- [x] Feature flag configured - N/A, the change is text in runtime assets
- [x] Monitoring alerts set - N/A, the affected suites are the check

### Rollback Procedure
1. `git revert` the phase commit, or restore the edited files from `HEAD` while the change is uncommitted.
2. Rerun the hook suite, the Pi extension suite and the parity suite to confirm the previous menu text is back.
3. No operator announcement is needed, the reverted text returns the previous menu.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
