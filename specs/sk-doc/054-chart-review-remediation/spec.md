---
title: "Feature Specification: Chart review remediation"
description: "A fresh review of the chart packet found five rendering defects, two checks that could not fail, four that still cannot, and eight places where the packet's documents disagree with the packet. This closes what is worth closing and records the rest with the mutation that proves it."
trigger_phrases:
  - "chart review remediation"
  - "heat matrix band defect"
  - "chart series capacity"
  - "chart headline audit"
  - "series mapping check"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3 | v2.2 -->
# Feature Specification: Chart review remediation

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

A review of `sk-create-chart` found defects a green corpus check had certified. Two of them invert what a chart says: a matrix cell holding zero painted black, darker than the busiest cell in the grid, and a group past the palette's capacity did the same in five more forms. One headline stated a conclusion its own data contradicts. Two files dragged the page sideways on a phone. Three axis captions overlapped their own tick values.

**Key Decisions**: a value with no magnitude takes an explicit empty swatch rather than the palest step, matching what `calendar-grid` already did. The catalog stops promising a fifth series for `stacked-area` rather than the palette growing a fifth colour. The delivery exemption from the empty-data notice is closed rather than re-worded, because the ground it stated was checked and was false.

**Critical Dependencies**: none. The packet is self-contained and its check is the gate.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-04 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | None |
| **Predecessor** | `053-chart-visual-overhaul` |
| **Successor** | None |
| **Handoff Criteria** | Every defect has a before and after measurement, every new check has been watched failing on a mutated copy, every hole left open has a mutation proving it, and `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The corpus check passed on every one of these.

**A cell with nothing in it painted black.** `heat-matrix` banded a value with `STEPS - Math.min(STEPS - 1, Math.floor((v - 1) * STEPS / peak))`. At `v = 0` that returns 6, at `v = -4` it returns 6 or more, and at `v = 0.4` it returns 6 as well: only the ceiling was clamped and the floor was where the arithmetic left the ladder. The stylesheet defines five steps, so those cells took the SVG default fill, which is pure black. The quietest reading in the grid came out darker than the busiest one, under a legend that said the opposite. `calendar-grid` guarded the zero and nothing else. `calls-by-day-and-hour` carried the identical function, and it is a delivery somebody edits.

**Five forms did the same thing to a group past their palette.** A fifth group in `unit-ring`, a fifth part in `unit-grid`, a fourth segment in `stacked-bars`, a fifth family in `treemap` and a fifth series in `stacked-area` each reached for a class the stylesheet defines no fill for. Two forms already answer an exceeded shape correctly, by growing the frame and printing a notice, and that was the pattern to follow.

**A headline said something its data denies.** `bar-rows` claimed one stage holds a request longer than the three after it combined. Its own block says 18 against 20.

**A table dragged the page sideways.** The figure could pan and the table beside it could not, so on a 500-unit screen the whole card moved: `heat-matrix` by 133 units and `calls-by-day-and-hour` by 71.

**Three axis captions sat on their own tick values.** `parallel-axes` prints a name, a unit and a maximum above each axis. The lift that separates neighbouring names moves the first two and not the third, so on the three unlifted axes the caption and the tick were eleven units apart and their line boxes are thirteen.

**Two checks could not fail, and four still cannot.** Nothing read the mapping from a form's series class to its palette token, so reversing five lines in `heat-matrix` inverts the encoding and the check stays green: the legend reverses with it, so the picture agrees with itself. The type-scale rule read a literal `setAttribute('font-size', …)` and every chart form sets attributes through a shared helper instead, so it covered a route no file takes.

**Eight documents disagreed with the packet.** The contract claimed every rule is enforced when three are enforced in part. The checker exempted the six deliveries from the empty-data notice on the stated ground that each carries the notice of its form, and none did. The colour document called `neutral` a system that encodes nothing in the same row that says lightness ranks its series, and put a signed step among the ordered cases while section 8 calls the two sign-coloured forms categorical. The catalog promised `stacked-area` five series against a system with four. `radar` was refused in one document and routed elsewhere in another. Four counts were stale. One changed document never moved its version.

### Purpose

A reading that the picture supports, on every form and every delivery. A check that fails on the mutation that matters. A written record of what the check still cannot see, with the mutation that proves each one.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The band arithmetic in `heat-matrix`, its delivery and `calendar-grid`, and the decision about where a value with no magnitude belongs.
- A capacity ceiling in the five forms that had none, following the notice pattern the corpus already uses.
- An arithmetic audit of all twenty-seven headlines against their own data blocks, and a rewrite of every one that is false or that flips on a fair re-reading.
- A pan region for the table in every chart form and every delivery.
- The heading stack in `parallel-axes`, measured by bounding box before and after.
- Two new assertions in `scripts/check-corpus.cjs`, each watched failing on a mutated copy before it is trusted.
- The empty-data guard in all six deliveries, and the removal of the exemption that let them ship without one.
- The eight document disagreements, and the version bumps they earn.

### Out of Scope

- Any new chart form. The corpus stays at twenty-one.
- The palette source's values. No colour is added, removed or moved.
- The four checker holes named in section 10, beyond recording each with the mutation that proves it and what a fix would cost. This was the scope at the time and it is left standing as the record of it. A later pass closed all five holes the packet named, and the limitations section of `implementation-summary.md` carries the current state.
- `sk-create-diagram`. The radar disagreement is recorded on this side rather than resolved by moving a file between packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/heat-matrix.html` | Modify | The band guard, the empty swatch and its legend key |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/calendar-grid.html` | Modify | The same domain guard, which caught a zero and nothing else |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/unit-ring.html` | Modify | Capacity ceiling and notice |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/unit-grid.html` | Modify | Capacity ceiling and notice |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-bars.html` | Modify | Capacity ceiling and notice |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/treemap.html` | Modify | Capacity ceiling and notice |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/stacked-area.html` | Modify | Capacity ceiling and notice |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/parallel-axes.html` | Modify | The heading stack, measured |
| `.opencode/skills/sk-doc/sk-create-chart/assets/templates/*.html` | Modify | Headline corrections, and the table pan region in all twenty-one |
| `.opencode/skills/sk-doc/sk-create-chart/assets/examples/*.html` | Modify | The empty-data guard, the table pan region, and two of the six defects |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` | Modify | `series-mapping`, the type-scale helper path, the colour-literal comment and quote handling, and the delivery exemption |
| `.opencode/skills/sk-doc/sk-create-chart/references/catalog.md` | Modify | The `stacked-area` promise, the notice count and the radar row |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Modify | Rule 16, the partial-enforcement statement, rule 14's table half and three stale counts |
| `.opencode/skills/sk-doc/sk-create-chart/references/color-system.md` | Modify | The two vocabularies, the signed-step contradiction and one stale count |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/README.md` | Modify | The new checks, the recipes for them, and a section for what the checks cannot see |
| `.opencode/skills/sk-doc/sk-create-chart/SKILL.md` | Modify | The radar routing disagreement |
| `.opencode/skills/sk-doc/sk-create-chart/manual-testing-playbook/corpus-integrity/colour-comes-from-one-source.md` | Modify | The version that never moved, the reversed-ramp break and the copy-based restores |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No value reaches a series class the stylesheet defines no fill for, in any form or delivery, for any finite input |
| REQ-002 | A zero, a negative and a fraction below one are each proved by a rendered probe to paint a defined fill, with the pre-fix render kept as the control |
| REQ-003 | The five forms with a palette ceiling draw a mark past it in a defined fill and print a notice naming the count and the ceiling |
| REQ-004 | Every one of the twenty-seven headlines is checked arithmetically against its own data block, and every false one is rewritten to something the block supports |
| REQ-005 | `check-corpus.cjs --render` prints `RESULT: PASSED` with zero errors from the final state |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | A check catches an inverted or permuted ramp inside a file, and it is watched failing on that exact mutation with the rule unwired as the control |
| REQ-007 | The type-scale rule covers the helper path every chart form actually uses, watched failing with the new path disabled as the control |
| REQ-008 | The table region pans on a narrow screen, and the two files that overflowed are measured at 500 units before and after |
| REQ-009 | The `parallel-axes` collisions are measured by bounding box, fixed, and re-measured to zero |
| REQ-010 | Every hole left unfixed is recorded with the mutation that proves it and what a fix would cost |
| REQ-011 | Each document disagreement is either corrected or recorded with the reason it stands, and every document changed moves its version |
| REQ-012 | Every document authored here reports zero hard blockers under the human-voice standard |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A rendered probe of `heat-matrix` carrying `0`, `-4` and `0.4` contains no pure-black pixel. **Met.** 5,752 black pixels before, 0 after.
- **SC-002**: A rendered probe of each of the five capacity forms contains no pure-black pixel and carries the notice element. **Met.** 1,348 / 1,728 / 2,989 / 13,110 / 5,133 black pixels before, 0 in every case after.
- **SC-003**: No file overflows the page at a 500-unit viewport. **Met.** Two did, by 133 and 71 units. All twenty-seven now report `overflow=0`.
- **SC-004**: `parallel-axes` reports zero text-box collisions. **Met.** Three before, zero after.
- **SC-005**: `check-corpus.cjs --render` prints `RESULT: PASSED`. **Met.** Twenty-nine named checks, zero errors, exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A new check written to pass rather than to catch | A green run that means less than the one it replaced | Each is watched failing on a mutated copy, and two are re-run with the rule unwired to prove the corpus was green on the mutation before |
| Risk | The empty swatch conflating "no reading" with "a low reading" | The picture answers a question the data did not | The swatch is the rule colour, outside the series ladder, keyed only when a cell takes it, and the ramp's quoted low end is the lowest value the ramp covers |
| Risk | A headline rewritten into vagueness to make it true | A conclusion replaced by a label, which the contract calls the failure the headline rule exists to prevent | Every rewrite is a checkable claim with its arithmetic recorded beside it |
| Risk | The table pan changing twenty-five files that did not need it | Churn, and a phone reader panning a two-column table that fitted | The region declares no floor of its own, so a table that fits still fits, measured before and after on all twenty-seven |
| Risk | Restoring a mutated file with `git checkout --` | The working state discarded rather than the mutation | Every mutation runs on a copy of the whole package in a scratch directory, restored from a kept copy and confirmed by `diff -r` |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Every form stays deterministic. The shipped data renders identically before and after, because each fix changes only a path the shipped data does not take.
- **NFR-R02**: A check nobody has watched fail is not quoted as evidence.

### Accessibility
- **NFR-A01**: The table stays the complete reading. The pan region wraps it and changes nothing about its markup or its semantics, which rules out the `display: block` shortcut that costs a table its role in some browsers.

---

## 8. EDGE CASES

### Data Boundaries
- A grid whose values are all zero or negative: every cell takes the empty swatch, the ramp arithmetic is never reached, and the divide by a zero peak cannot happen.
- A fraction between zero and one: a real positive magnitude, so it takes the palest step rather than the empty swatch.
- A form given more groups than its palette carries: the extras are drawn outside the encoding and the frame grows to say so, rather than the tail being dropped from the picture.

### Authoring Boundaries
- A colour word inside a printed notice still fails `colour-literals`, because the rule cannot tell a sentence from a value and widening it to exempt strings would reopen the assignment route it was just taught to see. A notice names the role instead.

---

## 9. COMPLEXITY ASSESSMENT

Scored with `bash .opencode/skills/system-spec-kit/scripts/spec/recommend-level.sh --loc 1100 --files 34 --api --architectural`, which returned **Level 3 (Full) at 83 of 100**, confidence 94%. The API flag is passed because the check's rule surface gains a name that other documents index. The architectural flag is passed because the table pan region is a markup convention added to every file in the corpus rather than a change inside one.

The same run recommends phasing at 40 of 50. The packet is authored as a standard folder on the operator's Gate 3 answer, which named a single non-phased packet. The score is recorded here rather than silently overridden.

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 34, Systems: 1 |
| Risk | 8/25 | Auth: N, API: rule surface only, Breaking: N |
| Research | 6/20 | The defects arrived measured, and the judgement is where each fix belongs |
| Multi-Agent | 0/15 | No dispatch |
| Coordination | 6/15 | One package, one gate |
| **Total** | **40/100** | **Level 3 by the scorer** |

---

## 10. OPEN QUESTIONS

All answered. Each points at the record carrying the reasoning.

- **Where a value with no magnitude belongs.** **The empty swatch, not the palest step.** A zero on a magnitude ramp is not the quietest reading. It is a cell with no magnitude to place, and `calendar-grid` had already answered it that way. ADR-001.
- **Whether `stacked-area` gains a fifth band or the catalog stops promising one.** **The catalog stops promising.** ADR-002.
- **Whether the delivery exemption is re-worded or closed.** **Closed.** ADR-003.
- **Whether the table pan goes in two files or all twenty-seven.** **All twenty-seven.** ADR-004.
- **Which of the six checker holes to fix.** **Two, both one-liners, and four recorded with their mutations.** ADR-005.
- **What to do about `radar`.** **Recorded on both sides rather than resolved.** ADR-006.

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Decision Record**: See `decision-record.md`
- **Durable Directive**: See `goal.md`
