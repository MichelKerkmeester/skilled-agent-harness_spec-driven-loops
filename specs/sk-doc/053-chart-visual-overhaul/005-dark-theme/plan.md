---
title: "Implementation Plan: A dark theme for the chart corpus"
description: "How a second palette block reaches twenty-nine files, how the contrast gates learn to run twice, and what the contract has to say before either is allowed."
trigger_phrases:
  - "chart dark theme plan"
  - "dark palette derivation"
  - "palette block amendment"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: A dark theme for the chart corpus

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON palette source, self-contained HTML5 templates, Node CommonJS for the corpus check |
| **Framework** | None by contract. A template depends on nothing at runtime |
| **Storage** | None. Colour lives in one JSON file and is pasted into each template as custom properties |
| **Testing** | `scripts/check-corpus.cjs`, which computes every contrast gate from the palette file on every run |

### Overview

The work runs in four moves. The contract amendment goes to the operator first, drafted as a sentence rather than as an idea. The palette source then gains dark fields, derived under an amended rule that permits a re-hue across themes. The corpus check learns to compute every gate twice and to expect two palette regions per file. Only then do the twenty-nine asset files gain their second block, pasted from the exact text the check prints.

Doing it in that order is the whole plan. Editing twenty-nine files against a check that still expects one block produces twenty-nine failures and no information.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 closed, so the light chrome the dark twin answers is settled
- [ ] The operator has answered the contract amendment in spec section 12
- [ ] Baseline corpus check captured before any edit

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state
- [ ] The dark gate section reports a nonzero assertion count and zero failures
- [ ] The dark section is proved able to fail, then restored
- [ ] Docs updated (spec, plan, tasks, acceptance-criteria, goal)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

One palette source, twenty-nine copies of a projection of it, one script that compares the copies to the source in both directions. The dark theme does not change that shape. It doubles the projection and doubles the comparison.

### Where the dark values come from

The vendored source at `context/evilcharts/src/app/globals.css:102-147` carries a full dark re-derivation, and the pair worth reading is `:75-79` against `:122-126`. The light chart hues run orange, teal, blue, yellow and gold. The dark ones run blue, teal, gold, purple and red. They are not the light values lightened. The hue rotates, because a hue that separates well against paper does not separate well against ink.

Two more values matter. The dark border at `:118-121` is white at 7.5 percent alpha rather than a solid grey, which keeps a card edge visible without drawing a second line over the data. The dark ground itself is near-black rather than a mid grey, which is what gives the alpha border something to sit on.

### The palette source shape

`palettes.json` gains a parallel set of fields rather than a second file. One file stays the single source of truth, and the check keeps comparing against it.

| Addition | Holds |
|----------|-------|
| `chromeDark` | The dark surface, ink, muted and rule values |
| `systems.<id>.seriesDark` | The re-chosen series values for that system on the dark ground |
| `systems.<id>.emphasisDark` | The emphasis value for that system on the dark ground |
| `gates.note` | One sentence stating that every gate is computed per theme against that theme's own surface |

### The template block shape

The dark block sits inside the same style element, immediately after the light one, wrapped in its own sentinel so the check can find it.

```
/* CHART_PALETTE:BEGIN system=<system> */
:root { every role, light values }
/* CHART_PALETTE:END */

/* CHART_PALETTE_DARK:BEGIN system=<system> */
@media (prefers-color-scheme: dark) {
  :root { every role, dark values }
}
/* CHART_PALETTE_DARK:END */
```

A second sentinel pair rather than a second block under the same name, because the existing rule forbids using one sentinel twice in a file, and that rule is worth keeping.

### What the check has to learn

| Check | Today | After |
|-------|-------|-------|
| `palette-block` | Exactly one region, matched to the source in both directions | Exactly two regions, each matched to its own projection in both directions |
| `palette-source` | Gates computed once against `chrome.surface` | Gates computed twice, once per surface, reported as two lines |
| `colour-literals` | Every colour value outside the one region is a failure | Every colour value outside either region is a failure |

The ramp gates need one extra thought. On a light ground the lightest step is the one closest to the surface, and the 1.15 to 1 floor keeps a low cell distinguishable from an empty one. On a dark ground the step closest to the surface is the darkest. The check has to test the end that sits nearest that theme's surface rather than the end that happens to be first in the array.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The palette source has consumers in two directions, which is why the inventory decides whether this shipped correctly.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assets/color/palettes.json` | The single source of every colour value | update | `node -e` read of the file, confirming dark fields on chrome and on all three systems |
| `assets/templates/*.html` | Twenty projections of the source | update | `grep -c 'CHART_PALETTE_DARK:BEGIN'` returns 20 under that directory |
| `assets/examples/*.html` | Six deliveries, which is where a reader meets a chart | update | The same grep returns 6 |
| `assets/color/palette-sheet-*.html` | Three proof sheets, one of which is the skeleton authors copy | update | The same grep returns 3 |
| `scripts/check-corpus.cjs` | The only thing that proves a projection matches | update | The check prints a dark gate line and a two-region `palette-block` line |
| `references/template-contract.md` rule 4 | States the one-block ceiling | update | `grep -c 'exactly one palette block'` returns 0 |
| `references/color-system.md` derivation rule | Says derive light and dark, never introduce a hue | update | The section now states when a re-hue across themes is honest |

Required inventories:
- Producers of colour: `grep -rn '#[0-9A-Fa-f]\{6\}' assets/ references/`, run before and after, so a literal that escaped a palette block is visible.
- Consumers of the gate table: `grep -rn 'markOnSurface\|textOnSurface\|rampStepSeparation' .`, so nothing restates a threshold the source owns.
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
| Structural | Every asset file against the contract rules, now including two palette regions | `node scripts/check-corpus.cjs` |
| Gate computation | Every threshold in the colour system, computed twice from the palette source | The `palette-source` and `palette-source-dark` lines of the same run |
| Negative control | A mutated copy of one template with a drifted dark block, and a mutated palette with a failing dark value | The check, which must fail on each and pass again once restored |
| Rendered | Every file opened headless under both colour schemes | `node scripts/check-corpus.cjs --render`, plus a manual pass with the operating system preference flipped |
| Manual | Reading one delivery on a dark system, and printing it | Browser, per the manual testing playbook |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The operator's answer on the contract amendment | External | Red | Nothing in this phase may be applied. The phase closes with the amendment recorded and no edit made |
| Phase 002, the chrome rollout | Internal | Yellow | The dark twin answers a light palette that is still moving |
| Headless Chrome for `--render` | External | Green | Palette edits cannot be proven, so none may be applied |
| `check-corpus.cjs` | Internal | Green | No gate, so no palette edit is claimable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the corpus check fails a gate on the dark ground that cannot be satisfied by re-deriving the value, or the operator declines the amendment after work has started.
- **Procedure**: `git checkout -- <file>` across the touched asset files and the palette source. Every change here is a working-tree edit on tracked files, so reverting is a checkout with no history rewrite and no remote step. The amendment text stays in the phase record either way, so a later revisit starts from the drafted sentence rather than from the idea.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Amendment (operator) ──► Palette source ──► Checker ──► 29 files ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Amendment | Phase 002 | Palette source |
| Palette source | Amendment | Checker |
| Checker | Palette source | The twenty-nine files |
| The twenty-nine files | Checker | Verify |
| Verify | The twenty-nine files | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Drafting the amendment and putting it to the operator | Low | 30 minutes |
| Deriving the dark values and clearing every gate | High | 2 hours |
| Extending the checker, with a proof that it can fail | Medium | 1 hour 30 minutes |
| Pasting the block into twenty-nine files | Medium | 1 hour |
| Verification across both themes | Medium | 1 hour |
| **Total** | | **about 6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline corpus check captured before any edit, with its `RESULT:` line read
- [ ] The operator's answer on the amendment recorded in the phase log
- [ ] Nothing committed, so the working tree is the only state to revert

### Rollback Procedure
1. Identify the failing file or gate from the `RESULT:` block of the corpus check.
2. `git checkout -- <file>` to restore it from the index or `HEAD`.
3. Re-run `node scripts/check-corpus.cjs --render` and read the `RESULT:` line.
4. Record the reverted change in the implementation summary as not applied, with the reason.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐    ┌───────────────┐    ┌───────────┐    ┌──────────────┐
│  Amendment   │───►│ palettes.json │───►│  checker  │───►│  29 files    │
│  (operator)  │    │  dark fields  │    │ dark gates│    │ second block │
└──────────────┘    └───────────────┘    └─────┬─────┘    └──────┬───────┘
                                               │                 │
                                               ▼                 ▼
                                         ┌───────────────────────────┐
                                         │  Verify both themes green │
                                         └───────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Amendment | Phase 002 | A yes or a no, recorded | Everything |
| Palette source | Amendment | Dark chrome and dark values per system | Checker |
| Checker | Palette source | Two gate lines and a two-region block check | The twenty-nine files |
| The twenty-nine files | Checker | A second palette block per file | Verify |
| Verify | All of the above | A green run under both themes | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **The operator's answer** at whatever pace the operator sets, CRITICAL
2. **Deriving dark values that clear every gate** about 2 hours, CRITICAL
3. **Checker extension with a failure proof** about 1 hour 30 minutes, CRITICAL
4. **Twenty-nine blocks and verification** about 2 hours, CRITICAL

**Total Critical Path**: about 5 hours 30 minutes after the answer arrives.

**Parallel Opportunities**:
- The contract text and the colour-system text can be drafted while the values are derived, because neither depends on the final hex values.
- Nothing else. Pasting blocks before the checker knows about them produces failures that carry no information.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | The amendment answered | The operator's yes or no is recorded in the phase log with the drafted sentence beside it | First |
| M2 | Dark values gated | The check prints a dark gate line with zero failures | Middle |
| M3 | Every file themed | `grep -c 'CHART_PALETTE_DARK:BEGIN'` returns 29 across `assets/`, and the render pass is green | End |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

This phase carries one decision that is not the operator's, and it names the operator's decision rather than making it.

### ADR-001: Re-hue across themes rather than lighten

**Status**: Proposed

**Context**: the colour system says a lighter value comes from mixing the chosen colour toward `surface` and a darker one from mixing it toward `ink`, and that borrowing a value from another system breaks the encoding. That rule was written for one ground. Applied across two, it produces washed dark values that fail the mark gate, because mixing toward a near-black surface is what makes a mark disappear on it.

**Decision**: a system's dark values are re-chosen for the dark ground, under the same gates and the same capacity, rather than derived from the light ones. The existing derivation rule keeps governing light and dark steps within one theme, and the colour document gains a sentence saying that a theme change is the one boundary a hue may cross.

**Consequences**:
- Every dark value has to clear every gate on its own, computed rather than assumed.
- Two sets of values now exist per system, so a colour edit has two places to reach. The check catches a half-edit in both directions.
- The rule stops being stated as an absolute, which is a real cost. The mitigation is that the exception is named and bounded to a theme boundary.

**Alternatives Rejected**:
- Lightening the light values. Cheap, and it fails the mark gate on the ordered system's dark end.
- One neutral palette that works on both grounds. It exists, it is grey, and it throws away the categorical system entirely.

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm the operator has answered the contract amendment. No file changes before that answer.
- [ ] Confirm the baseline corpus check was captured before any edit, and its `RESULT:` line read.
- [ ] Confirm phase 002 is closed, so the light values being answered are final.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Amendment, then palette source, then checker, then the twenty-nine files. Pasting a block the check does not yet understand produces failures that teach nothing. |
| TASK-SCOPE | Edits stay inside `.opencode/skills/sk-doc/sk-create-chart/` and this phase folder. |
| TASK-GATE | No palette edit is claimed until `node scripts/check-corpus.cjs --render` prints `RESULT: PASSED` from the state that includes it, with both gate lines at zero failures. |
| TASK-PROOF | The dark section is shown to fail on a mutated palette and on a drifted block before it is trusted, then restored. |

### Status Reporting Format

Report phase status as: `Phase 005 status <Planned|Blocked|Applying|Complete>, amendment <pending|yes|no>, themed files N/29, gates <light PASS|FAIL> <dark PASS|FAIL>`.

### Blocked Task Protocol

An unanswered amendment blocks every implementation task and is not worked around. A gate failure on a dark value is fixed by re-deriving the value, never by lowering the threshold, because a threshold edited to admit a value it was right to reject is worth less than no threshold. A render failure on a different file each run is the headless browser and is retried.
<!-- /ANCHOR:ai-execution-protocol -->
