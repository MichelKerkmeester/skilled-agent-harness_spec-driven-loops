---
title: "Implementation Plan: The composed form and the packet closeout"
description: "How one new form reaches the catalog through the documented workflow, how every invariant the overhaul introduced gains a check that was watched failing, and what the closeout owes."
trigger_phrases:
  - "composed form plan"
  - "chart checker extension plan"
  - "chart packet closeout plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
# Implementation Plan: The composed form and the packet closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Self-contained HTML5 templates with inline SVG, Node CommonJS for the corpus check |
| **Framework** | None by contract. A template depends on nothing at runtime |
| **Storage** | None. Data is a literal array between the data sentinels |
| **Testing** | `scripts/check-corpus.cjs`, extended here, structural by default and browser-backed under `--render` |

### Overview

Three tracks that share a closing gate. The composed form is authored through the workflow the catalog and the contract already document, which means it starts as a copy of the skeleton rather than as new code. The checker extension asserts every invariant phases 004 through 006 introduced, one at a time, each proved on a mutated fixture before it is trusted. The closeout is the version bump, the changelog and a recorded disposition on the one row the adjudication left until last.

The order matters in one place only. The checker extension runs before the new form is claimed, so the new form is the first thing the extended check sees rather than the last.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 004, 005 and 006 closed
- [x] The operator answered yes on 2026-09-03
- [x] Baseline captured before any edit at 20 checks, 29 files, 20 forms, 0 errors

### Definition of Done
- [x] Twelve acceptance rows `Met` and one `Superseded` by ADR-005, none `Unmet`
- [x] `RESULT: PASSED` from the final state over twenty-one forms, exit 0
- [x] Fourteen mutations watched failing, every one reverted and verified against the kept copy
- [x] Superseded. The packet keeps per-document versions, so eight documents moved by one step and eleven correctly did not. ADR-005
- [x] Docs updated, plus a decision record and an implementation summary
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A flat corpus of self-contained documents, checked by one script, indexed by one catalog. The composed form adds one document and one row. The checker extension adds assertions to the script that already exists.

### The composed form

The vendored source treats a composed chart as a first-class type in both of its engines, at `context/evilcharts/src/registry/registry-chart.ts:220-239` and `:69-87`. That is the evidence that the gap is real rather than a corpus preference. Nothing is copied: the form is drawn by hand, like every other form here.

| Property | Decision |
|----------|----------|
| `id` | `bar-line-composed`, matching the filename stem and the catalog row |
| Question | Did the rate move with the count over the same periods |
| Data shape | One count and one rate per period, six to twelve periods |
| Marks | A bar per period for the count, a polyline with dots for the rate |
| Second scale | On the right, and only when the two magnitudes differ by an order |
| System | `categorical`, since the two series are unordered members rather than ranked ones |
| Family | `relationship` by default, with `time` as the recorded alternative |

The authoring route is the one the packet already documents: copy `assets/color/palette-sheet-neutral.html`, set the identity tag and the title, paste the palette block the check prints, replace the data block, write the drawing code, write the headline as a conclusion, add the catalog row, run the check.

### The second-scale rule

A dual axis is the easiest way to lie with a chart. Two scales can be placed so the lines cross wherever the author wants, and a reader reads a relationship the data does not carry. The rule that keeps it honest is a condition rather than a preference.

The file computes the ratio of the two series maxima. When the larger exceeds the smaller by an order of magnitude, the rate gets its own axis on the right, because at that spread a shared axis flattens one series into the baseline. Below that spread, both series share one axis and the file draws one scale. The condition sits in the drawing code where an editor will meet it, with the arithmetic written beside it.

### The checker extension

One assertion per invariant, and the list comes from the three preceding phases rather than from imagination.

| Invariant | Introduced by | What the assertion proves |
|-----------|---------------|---------------------------|
| A form that gains a pointer carries the hygiene pair | 004 | Every file carrying an interaction marker also carries both hygiene rules |
| A tooltip value is formatted by the file's own formatter | 004 | No file calls a locale-dependent formatter, and every tooltip value path reaches `fmt` |
| An interactive file paints identically without pointer input | 004 | The rendered figure region is stable across two loads of the same file |
| A file carries one palette block per theme, at most two | 005 | Exactly the expected number of palette regions, each matched to its own projection |
| Every gate is computed per theme | 005 | The dark gate line exists and reports a nonzero assertion count |
| Every catalog row's system matches the colour document | 006 | The row's system and the file's declaration agree, and the system exists |
| Every form prints a notice when the data holds nothing readable | 006 | Every form carries the guard, in the region above its drawing code |
| A gradient stroke appears only on an ordered-system form | 006 | No `neutral` or `categorical` file carries a stroke gradient, if the operator allowed the clause |

Each one is added, then broken deliberately on a copy, then watched failing, then the copy is discarded. An assertion nobody has seen fail is a line of code with a comforting name.

### The scenario-naming audit

The recommendation asks that each family delivery be named after a real scenario so the headline-as-argument rule is demonstrated rather than asserted, with the vendored scenario blocks at `context/evilcharts/registry.json:3606`, `:3720` and `:3815` as the reference.

Reading the six deliveries first is what this phase owes. All six already carry scenario filenames, and all six headlines already state a conclusion rather than a label. If the audit confirms that, the recommendation is already satisfied and the phase says so, with the six headlines quoted in the record. A rewrite in search of work is the failure mode here.

### The range window

The adjudication allows a draggable range window last and only where a form is genuinely dense, at more than thirty points, opening at the full range so first paint is identical every time. The vendored implementation is at `context/evilcharts/src/registry/ui/recharts-brush.tsx:194` and `:385-392`.

The arithmetic that decides it: the catalog gives `daily-line` a documented shape of thirty readings or fewer, and `stacked-area` two to five series over a continuous axis. No shipped form is dense past thirty points, so the window has no consumer unless a documented shape is raised first. The disposition is recorded either way, because a silent skip is not a close.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The version bump is the surface most likely to ship half done, so it carries its own inventory.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `SKILL.md` frontmatter | Carries the packet version | update | `grep -rn '^version:' SKILL.md references/*.md scripts/README.md README.md` returns one string, everywhere |
| `README.md` frontmatter | Same | update | Same grep |
| `references/catalog.md`, `color-system.md`, `template-contract.md` | Same | update | Same grep |
| `references/README.md` | Carries an older version already | update | Same grep, which is how the drift becomes visible |
| `scripts/README.md` | Same, plus the check descriptions | update | Same grep, plus the new checks described in the body |
| `changelog/` | One file per release | create | `changelog/v1.2.0.0.md` exists and describes all seven phases |
| `references/catalog.md` gap prose | Carries the composed entry phase 006 wrote | delete that entry | `grep -c 'composed'` outside the sentinels drops, and the row inside them appears |

Required inventories:
- Producers of the version: `grep -rn '^version:' .` over the packet, before and after.
- Consumers of the catalog: the corpus check's `catalog` assertion count, which rises by the new row in both directions.
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
| Structural | Twenty-one forms and the rest of the assets against every contract rule | `node scripts/check-corpus.cjs` |
| Negative control | One mutated fixture per new assertion, each watched failing then discarded | The check, read directly rather than through a pipe |
| Rendered | Every file opened headless, figure region asserted non-empty | `node scripts/check-corpus.cjs --render` |
| Data-shape | The composed form at both sides of the order-of-magnitude condition, and at a zero period | Two fixtures, read by eye |
| Editorial | The six family deliveries read against the headline-as-argument rule | A written verdict per delivery |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 004, 005 and 006 | Internal | Yellow | The assertions have nothing to assert, and the phase reduces to a version bump |
| The operator's answer on the catalog decision | External | Yellow | The composed form is not built. The checker extension and the closeout still run |
| Headless Chrome for `--render` | External | Green | The new form cannot be proven to draw, so it cannot be claimed |
| `check-corpus.cjs` | Internal | Green | Both the gate and the thing being extended |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a new assertion fails on a file this phase did not touch, which means the assertion is wrong rather than the corpus.
- **Procedure**: revert the assertion rather than the corpus. A validator edited to accept a file it was right to reject is worth less than no validator, and the inverse holds too: an assertion that fails a correct file is removed and rewritten rather than worked around. For a template failure, `git checkout -- <file>`. Every change here is a working-tree edit on tracked files apart from two created files, which are deleted rather than reverted.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Checker extension ──► Composed form ──► Closeout ──► Verify
             │                                        ▲
             └──► Scenario audit ─────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 004 to 006 | Everything |
| Checker extension | Setup | Composed form |
| Composed form | Checker extension, and the operator's answer | Closeout |
| Scenario audit | Setup | Closeout |
| Closeout | Composed form, Scenario audit | Verify |
| Verify | Closeout | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and the invariant inventory | Low | 40 minutes |
| The checker extension, with a failure proof per assertion | High | 3 hours |
| The composed form | High | 2 hours 30 minutes |
| The scenario audit | Low | 40 minutes |
| The range window disposition | Low | 20 minutes |
| Version bump and changelog | Low | 40 minutes |
| Verification | Medium | 45 minutes |
| **Total** | | **about 8 hours 30 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured and its `RESULT:` line read
- [x] Inventory written down first, and it changed two of the eight rows
- [x] Nothing committed

### Rollback Procedure
1. Read the failing check name and the file it names from the `RESULT:` block.
2. Decide which is wrong, the assertion or the file, and say which before changing either.
3. `git checkout -- <file>` for a template, or revert the assertion for a bad check. Delete the two created files rather than reverting them.
4. Re-run `node scripts/check-corpus.cjs --render` and read the `RESULT:` line.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [x] Inventory written before any assertion was coded. ADR-003
- [x] Answered yes on 2026-09-03, before the row was written.
- [x] Captured before any edit and read from a file.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | The checker extension lands before the composed form is claimed, so the new form is the first file the extended check sees. |
| TASK-PROOF | No assertion is trusted until it has been watched failing on a mutated fixture, and every mutation is reverted before the phase closes. |
| TASK-SCOPE | Edits stay inside `.opencode/skills/sk-doc/sk-create-chart/` and this phase folder. |
| TASK-GATE | Nothing is claimed until `node scripts/check-corpus.cjs --render` prints `RESULT: PASSED` over twenty-one forms. |
| TASK-HONEST | The scenario audit reports what it finds. If the six deliveries already satisfy the rule, that is the finding, and no rewrite is invented to fill the task. |

### Status Reporting Format

Report phase status as: `Phase 007 status <Planned|Applying|Complete>, assertions N/8 proved, composed form <pending|built|refused>, version <1.1.0.0|1.2.0.0>, gate <PASSED|FAILED>`.

### Blocked Task Protocol

A new assertion that fails a file this phase did not touch is a wrong assertion until proven otherwise, and it is rewritten rather than worked around by editing the corpus. An unanswered catalog decision blocks only the composed form, so the checker extension and the closeout proceed and the phase closes with that one item recorded. A version string that differs between two files blocks the close, because a reader trusts the first one they find.
