---
title: "Implementation Plan: Prove the chrome on two forms and settle the weight and glow forks"
description: "Apply five agreed chrome rows to one line form and one bar form, generate two comparison sheets from the same data, and stop for the operator's answer before anything rolls out."
trigger_phrases:
  - "chart chrome proof plan"
  - "stroke weight comparison"
  - "glow layer comparison"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Prove the chrome on two forms and settle the weight and glow forks

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Self-contained HTML5 with inline SVG, drawn by the file's own script |
| **Framework** | None by contract. A template depends on nothing at runtime |
| **Storage** | None. Data is a literal array between the `CHART_DATA` sentinels |
| **Testing** | `scripts/check-corpus.cjs`, structural by default and browser-backed under `--render` |

### Overview

Five chrome rows land on `daily-line.html` and `bar-columns.html`. The grid goes dashed at `3 3`
in a weakened rule colour, the tick ink drops to muted, every printed number moves to a system
mono stack with tabular figures, the line form gains the two-weight dot language, and its area
fill fades toward the baseline instead of sitting flat. Each change is one or two CSS
declarations against custom properties that already exist, which is what keeps a corpus-wide
restyle affordable later.

Then the weight fork. The stroke weight sheet draws the same twenty-eight readings three times at
2px, 1px and 0.8px. It lives in `scratch/` because a sheet carrying three copies of one series is
a workbench rather than a delivery.

The glow fork never reached a sheet. The operator cut it on 2026-09-03, before the comparison was
built, on the ground that a delivered chart is often printed and a blur reads as a smudge. ADR-002
carries the decision and both lineage arguments.

The phase then stops. It does not pick a default, and it does not roll anything to the other
eighteen templates.
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
- [ ] `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state
- [ ] Docs updated (spec/plan/tasks/acceptance-criteria/decision-record)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A flat corpus of self-contained documents, checked by one script. There is no runtime, no build
and no shared library, which is the property the packet sells and the constraint every row below
has to route through.

### Key Components

- **`assets/templates/daily-line.html`**: the line form. It carries four of the five chrome rows and both forks.
- **`assets/templates/bar-columns.html`**: the bar form. It carries the grid, the tick ink and the mono face, and neither fork touches it.
- **`assets/color/palettes.json`**: the source of every colour value. The weakened rule colour is derived from the existing `rule` role rather than added as a new value.
- **`scripts/check-corpus.cjs`**: the gate. Rules 4, 5, 6, 12 and 14 are the ones these edits can break.

### Data Flow

A chrome row is a CSS declaration referring to a custom property. The property is defined once in
the palette block, the block is asserted against `palettes.json` in both directions, and the check
fails any colour value that appears outside it. That path is why a restyle is cheap and why it
cannot drift.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The chrome rows change shared CSS classes, so the inventory below is what decides whether the
proof is honest rather than lucky.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.grid` in the two templates | Solid one pixel rule at full rule colour | update | `grep -n '^\.grid' assets/templates/daily-line.html assets/templates/bar-columns.html` before and after |
| `.tick` in the two templates | Muted fill already, at full strength | update | `grep -n '^\.tick' assets/templates/*.html` across the corpus, so the eighteen untouched files are proven untouched |
| The body font stack | One sans stack for every character in the file | update | `grep -n 'font-family' assets/templates/daily-line.html assets/templates/bar-columns.html` |
| `.area` and `.mark` in the line form | Flat fill opacity and a single mark weight | update | `grep -n '^\.area\|^\.mark' assets/templates/daily-line.html` |
| The other eighteen templates | Carry the same class names and the same values | unchanged | `git diff --name-only` lists exactly two template files |
| `assets/color/palettes.json` | Owns every colour value | unchanged | No new role is added in this phase. The weakened rule is an alpha on the existing role |

Required inventories:
- Producers of the classes: `grep -rn '^\.grid\|^\.tick\|^\.area\|^\.mark' assets/`.
- Consumers of the formatter: `grep -n 'fmt(' assets/templates/daily-line.html assets/templates/bar-columns.html`, so the mono change does not silently bypass it.
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
| Structural | Both touched templates against the fourteen contract rules | `node scripts/check-corpus.cjs` |
| Rendered | Every asset file opened headless, figure region asserted non-empty | `node scripts/check-corpus.cjs --render` |
| Manual | Reading each comparison sheet at delivery size and at print size | Browser |
| Regression | The eighteen untouched templates still pass unchanged | The same corpus check, which scans the whole corpus on every run |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Headless Chrome for `--render` | External | Green | No template edit is provable, so none may be applied |
| `scripts/check-corpus.cjs` | Internal | Green | No gate, so no edit is claimable |
| The operator's fork answer | External | Red until answered | Phase 002 cannot start, which is the intended block |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the corpus check fails on one of the two touched templates, and the failure repeats on the same file across runs.
- **Procedure**: `git checkout -- <file>` for that template. Every change here is a working-tree edit on tracked files, so reverting is a checkout with no history rewrite and no remote step.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline capture) ──► Chrome on two forms ──┐
                                                   ├──► Verify ──► Stop for the operator
                             Fork sheets ──────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Chrome, Forks |
| Chrome | Setup | Forks, Verify |
| Forks | Chrome | Verify |
| Verify | Chrome, Forks | Decision |
| Decision | Verify | Phase 002 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and baseline | Low | 20 minutes |
| Chrome on two forms | Medium | 1 hour |
| Fork comparison sheets | Medium | 1 hour |
| Verification and write-up | Low | 40 minutes |
| **Total** | | **about 3 hours, plus the wait for an answer** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline corpus check captured before any edit, with its `RESULT:` line read
- [ ] Both templates copied into `scratch/` as before-images so the comparison has a control
- [ ] Nothing committed, so the working tree is the only state to revert

### Rollback Procedure
1. Identify the failing file from the `FAIL` block of the corpus check.
2. `git checkout -- <file>` to restore it from the index or `HEAD`.
3. Re-run `node scripts/check-corpus.cjs --render` and read the `RESULT:` line.
4. Record the reverted change in `acceptance-criteria.md` as unmet, with the reason.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---
