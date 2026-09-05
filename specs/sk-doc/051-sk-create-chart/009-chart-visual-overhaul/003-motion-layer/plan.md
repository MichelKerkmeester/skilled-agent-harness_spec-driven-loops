---
title: "Implementation Plan: Add the reveal wipe and the bar growth, both gated and both deterministic"
description: "Author both motions in CSS so the existing motion rule can see them, close the gap where a script-driven animation would bypass that rule, and prove determinism by rendering each animating file twice."
trigger_phrases:
  - "chart motion plan"
  - "reveal wipe plan"
  - "bar growth plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Add the reveal wipe and the bar growth, both gated and both deterministic

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Self-contained HTML5 with inline SVG, animated by CSS keyframes in the file's own style block |
| **Framework** | None by contract. A template depends on nothing at runtime |
| **Storage** | None. Data is a literal array between the `CHART_DATA` sentinels |
| **Testing** | `scripts/check-corpus.cjs`, plus a two-render comparison this phase adds |

### Overview

Both motions are authored as CSS keyframes rather than as script. That choice is not stylistic.
`checkMotion` in `scripts/check-corpus.cjs` reads the stylesheet regions and looks for
`@keyframes`, `animation:` or `transition:`. A motion driven from `requestAnimationFrame` matches
none of those, so it would ship with no reduce-motion fallback and the check would report a pass.
Keeping the motion in CSS keeps the existing gate live from the first file.

The reveal is a mask rectangle that grows from zero width to full width over one second, on the
curve the vendored source names. The bar growth is a per-mark animation over half a second on a
cubic-out curve, with a stagger applied as an animation delay computed from the mark index. An
index is geometry rather than data, so no value in the data block reaches the timing.

The determinism proof is the deliverable that matters most. The existing render path already
opens each file with a three second virtual time budget before dumping the document, which is
three times the longest animation this phase adds. Rendering twice and comparing the two dumps is
therefore a small addition to a path that already exists, and it is what turns contract rule 12
from a stated principle into an observed fact.

The gap in the check is closed in the same phase. Rule 13 gains coverage of script regions, so a
later phase cannot add a script-driven motion and pass by accident.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 002 closed with the corpus check green over twenty-nine files
- [x] Baseline corpus check captured with `--render`
- [x] A settle time is chosen and written into the contract before any file animates

### Definition of Done
- [x] All acceptance criteria met
- [x] `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state
- [x] Each animating file renders twice to the same settled document, and to the same settled picture
- [x] Docs updated (spec/plan/tasks/acceptance-criteria)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Motion lives entirely in the stylesheet, wrapped by a media query that removes it under the
reduce-motion preference. Nothing about the picture depends on when the render was taken, because
every keyframe sequence runs once and ends at the state the file would have painted without any
animation at all.

### Key Components

- **The mask rectangle**: one `<rect>` inside the file's own `<defs>`, referenced by a mask on the plot group. Its width animates. Nothing else moves.
- **The mark animation**: a transform or a mask per bar, delayed by the mark index so consecutive marks arrive slightly apart.
- **`checkMotion` in the corpus check**: reads stylesheet regions today, and gains the script regions so the rule cannot be sidestepped.
- **The two-render comparison**: a second `--dump-dom` pass over each animating file, compared against the first.

### Data Flow

A value in the data block becomes a geometry, the geometry becomes a mark, and the animation moves
the mark from a start state to that geometry. The end state is computed the same way it is
computed today, so removing every animation from the corpus would leave the same picture. That is
the property the reduce-motion fallback relies on and it is also what makes the determinism proof
meaningful rather than circular.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The phase adds a class of behaviour the corpus has never carried, so the inventory below is about
what the existing checks do and do not observe.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `checkMotion` in the corpus check | Reads stylesheet regions for `@keyframes`, `animation:` and `transition:` | update | Add a script-driven animation with no fallback to a scratch copy and confirm the check goes red |
| `checkDeterminism` in the corpus check | Bans `Math.random`, `Date.now` and `new Date` in script regions | unchanged | The motion is CSS, so no new clock reaches script |
| `checkRenders` in the corpus check | Opens each file with a three second virtual time budget and dumps the document | update | The second dump exists and is compared, and the comparison is reported per file |
| The nine animating templates | Paint instantly and stay still | update | `grep -rlc 'prefers-reduced-motion' assets/templates/` lists exactly nine files |
| The eleven templates that do not animate | Paint instantly and stay still | unchanged | The same grep lists none of them, so the fallback is not scattered where nothing moves |
| Contract rule 13 | Requires a fallback when a file animates | update | The rule text names a settle time, which is what rule 12 needs to be checkable |

Required inventories:
- Producers of motion: `grep -rn '@keyframes\|animation:\|transition:' assets/`, which returns nothing today and returns nine files afterwards.
- Consumers of the render path: every asset file, because the two-render comparison runs over the same set the existing render check walks.
- Adversarial cases for the extended rule 13: a script animation with no CSS, a CSS animation with a fallback that shortens rather than removes, and an animation that repeats.
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
| Structural | Nine animating files against rules 12 and 13 | `node scripts/check-corpus.cjs` |
| Rendered | Every asset file opened headless, figure region asserted non-empty | `node scripts/check-corpus.cjs --render` |
| Determinism | Each animating file rendered twice and the two documents compared | The two-render comparison this phase adds |
| Negative | A fallback removed, a script animation added, an animation set to repeat | Scratch copies, each restored after the red run is read |
| Manual | Each motion watched once at delivery size, with the operating system preference on and off | Browser |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 closed | Internal | Red until closed | Motion and chrome edit the same stylesheets, so an unfinished rollout conflicts |
| Headless Chrome | External | Green | The determinism proof is the deliverable and it cannot run |
| `scripts/check-corpus.cjs` | Internal | Green | No gate, so no motion is claimable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: two renders of one file disagree, or the corpus check fails on an animating file across repeated runs.
- **Procedure**: restore the affected template from a kept copy. Motion is additive, so reverting a file returns it to a state that paints instantly and passes every rule it passed before. Do not reach for `git checkout -- <file>` while the phase is uncommitted: it reverts to the last commit rather than to the working state, and it takes the phase's own edits with it.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (settle time, baseline) ──► Reveal on three forms ───┐
                                                           ├──► Determinism proof ──► Verify
                              ──► Growth on six forms ─────┘
                              ──► Check extension ─────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 002 | Reveal, Growth, Check extension |
| Reveal | Setup | Determinism proof |
| Growth | Setup | Determinism proof |
| Check extension | Setup | Verify |
| Determinism proof | Reveal, Growth | Verify |
| Verify | Determinism proof, Check extension | Phase 004 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup, settle time and baseline | Low | 30 minutes |
| Reveal on three time-series forms | Medium | 1 hour |
| Growth on six bar forms | High | 2 hours |
| Check extension and the two-render comparison | Medium | 1 hour 30 minutes |
| Negative tests and verification | Medium | 1 hour |
| **Total** | | **about 6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline corpus check captured with `--render` and its `RESULT:` line read
- [x] A settled-state dump captured for each of the nine files before any animation is added, so the after-dump has something to be compared against
- [x] Nothing committed, so the working tree is the only state to revert

### Rollback Procedure
1. Identify the failing file from the `FAIL` block, or from the two-render comparison.
2. Restore it from a kept copy, never with `git checkout --` while the phase is uncommitted.
3. Re-run `node scripts/check-corpus.cjs --render` and read the `RESULT:` line.
4. Compare the restored file's dump against the pre-motion dump captured in setup, which is the proof that reverting really did return it to the earlier picture.
5. Record the reverted change in `acceptance-criteria.md` as unmet, with the reason.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---
