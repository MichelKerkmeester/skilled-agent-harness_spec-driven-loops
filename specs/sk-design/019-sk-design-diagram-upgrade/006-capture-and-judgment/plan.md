---
title: "Implementation Plan: Phase 6: capture-and-judgment"
description: "Extend the playbook's persistence contract with a capture-review scenario, define the judged column and the graduation door, and specify the label-mask overflow measurement."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: capture-and-judgment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (the playbook document and its new sections); no new source language introduced |
| **Framework** | None for the document itself; the shared `run-manual-playbook-scenario.cjs` runner (Node.js, CommonJS) for persistence; Playwright (already a documented project dependency per the playbook's own precondition 3) for the one headless-browser measurement |
| **Storage** | Flat files only: one existing Markdown document extended, one new dated directory per release under `benchmark/reports/`, following the existing convention |
| **Testing** | No automated test suite for this phase's own deliverable; verification is a direct read of the extended document, the generated report, and `results.csv`, per the playbook's own review protocol |

### Overview
This phase extends `manual-testing-playbook.md` rather than replacing it, matching the document's
own stated split-document philosophy: a fourth scenario category (`CAPTURE REVIEW`, `CAP-001`)
carrying the judged column's six checkable reads, the skin-pinned third capture and the settled
double-capture convention; an extended persistence-contract scope note naming the new scenario; and
a graduation log section recording the one-way door a judged item takes into the checker. The
font-substitution risk (F3.3) is specified as a headless-browser measurement plan, not run by this
authoring pass.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 005's `check-diagram-corpus.cjs` and its judged-boundary block exist on disk and are read in full
- [ ] 002's `findings-ledger.md` F1.6, F1.10 and F3.3 rows are read and cited
- [ ] `manual-testing-playbook.md`'s existing structure (categories, persistence-contract marker, cross-reference index) and the nine existing dated report directories are read before any addition

### Definition of Done
- [ ] All ten acceptance criteria in `acceptance-criteria.md` are `Met`
- [ ] The `CAPTURE REVIEW` category, the judged column, the graduation log, and the extended persistence-contract scope note all exist inside `manual-testing-playbook.md`
- [ ] The first capture-review scenario has run at least once, producing a dated report with no hand-authored Markdown and no unreasoned skip
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Document extension plus a persisted-run convention — the same pattern the existing `DIA-*`,
`IMP-*`, `CMD-*` categories already use inside `manual-testing-playbook.md`, extended with a fourth
category and a graduation log rather than a new document or a new tool.

### Key Components
- **Judged-column definition**: six checkable yes/no reads (connector overlap, fan, visible gap,
  behind-box, focal balance, type fit), each with the concrete question a reader answers while
  looking at a capture, plus two named non-blocking taste notes (the remove test, taste) explicitly
  outside the six.
- **Graduation-threshold statement**: what a working 2D geometry pass must compute before
  connector overlap or fan may leave the judged column (F1.6 judged half).
- **Label-mask overflow measurement plan**: the headless-browser check that settles F3.3 — what
  loads, which font stack is disabled, what is compared, what counts as a fail — against the 7
  named arrow-label mask rects among `example-high-level.html`'s 36 raw `<rect>` elements.
- **`CAPTURE REVIEW` scenario category (`CAP-001`)**: the skin-pinned third capture's "different
  picture" test and the settled double-capture convention, following the existing per-feature
  scenario-contract shape (`DIA-003`'s shape is the closest precedent: a gate-refusal-style
  human-judged scenario, not a mechanical assertion).
- **Extended persistence-contract scope**: the existing
  `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` marker's surrounding note, widened to name the
  capture-review scenario and the reason-required rule for every `SKIP`.
- **Graduation log**: a new section, a table (Item, Graduated Date, Family, Evidence, Removed
  From), living inside `manual-testing-playbook.md` beside the category it documents.

### Data Flow
A reader opens the corpus's captures (the 39 files under `screenshots/`, following the settled
double-capture convention per file, plus the skin-pinned third capture where applicable), answers
the judged column's six reads against each, and records a `PASS`/`FAIL`/`SKIP` verdict with a
reason where skipped. `run-manual-playbook-scenario.cjs` persists that outcome into a new dated
`benchmark/reports/<dated-run-label>/` directory, generating `results.csv`,
`skill-benchmark-report.json`, `skill-benchmark-report.md`, and the other files the nine existing
directories already carry — none hand-authored. When a judged read becomes computable (a 2D pass
lands, say), the graduation log gains a row and `check-diagram-corpus.cjs`'s judged-boundary block
loses the corresponding line, in the same change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase's `research_intent` is standing-discipline installation, not `fix_bug`. It is filled
here anyway because this node's deliverable becomes the permanent gate every future release is
judged against, and its persistence contract is the surface a future graduation event must edit
atomically across two files.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `manual-testing-playbook.md` (existing, producer + consumer) | Carries three scenario categories (`DIA-*`, `IMP-*`, `CMD-*`), the persistence-contract marker, and the cross-reference index | Modify — add the `CAPTURE REVIEW` category, the judged column, the graduation log, the extended persistence-contract note; renumber trailing sections | `grep -c "CAP-001"`; the marker text unchanged at `grep -n "MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT"` |
| `benchmark/reports/` (existing, 9 dated dirs, consumer) | Nine dated runs from 2026-08-12, one `README.md` index | Modify (future, per release) — a tenth dated directory, generated only through the runner | `ls ... \| grep -c '^2026'` |
| `check-diagram-corpus.cjs`'s judged-boundary block (005's file, read-only until a graduation event) | Registers what stays judged as of 005 | Unchanged this phase; a future graduation event removes one line from it, atomically with a graduation-log row | Direct read; `grep` for the judged-boundary block text |
| `run-manual-playbook-scenario.cjs` (read-only tool, outside `sk-design`) | The shared runner every scenario's outcome persists through | Unchanged — read for its CLI contract | `test -f`; direct read of its usage header |
| `example-high-level.html` (read-only subject) | Carries the 7 named arrow-label mask rects among 36 raw `<rect>` elements | Unchanged — measured, not edited | `grep -c "<rect"` |
| 005's mutation suite and CI workflow (future consumer of a graduation) | Registers ten enforceable families today | Not a consumer this phase — a future graduation event would add an eleventh family and a matching mutation case | N/A this phase |

Required inventories:
- Same-class producers: no other document under `sk-design-diagram/` produces a persisted
  `PASS`/`FAIL`/`SKIP` scenario outcome today besides `manual-testing-playbook.md`'s existing nine
  scenarios; the capture-review scenario is the tenth, following the same producer, not a new one.
- Consumers of changed symbols: `run-manual-playbook-scenario.cjs` is the only consumer of the
  scenario's contract shape; a future graduation event is the only consumer of the graduation log's
  schema.
- Matrix axes: judged read (6) × capture kind (double-capture pair, skin-pinned third) — the six
  reads apply per corpus file where relevant, the third-capture test applies once per file that
  carries a skin pin, not a cross product requiring a combined case table.
- Algorithm invariant: no item may exist in both the judged-boundary block and the graduation log
  at once; a graduation event is the only path that moves an item from one to the other, never the
  reverse.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist

1. Read `005-checker-mutations-and-ci/tasks.md` and, on disk, `check-diagram-corpus.cjs`'s
   judged-boundary block in full — this phase's graduation door has nothing to point at until that
   block's exact wording is read, not assumed from this document's own paraphrase of it.
2. Read `002-skin-contract/findings-ledger.md`'s F1.6, F1.10 and F3.3 rows before writing any
   judged-column read — no read may re-decide a scope 002 or 005 already drew.
3. Read `manual-testing-playbook.md` in full, including its existing `DIA-003` scenario contract
   shape and its nine existing dated report directories under `benchmark/reports/`, before adding a
   tenth category or a tenth directory — the new addition follows the existing shape, it does not
   invent one.
4. Confirm `run-manual-playbook-scenario.cjs`'s real path
   (`.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-manual-playbook-scenario.cjs`)
   and its CLI contract by direct read before authoring the `CAP-001` scenario against it.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Tasks execute in file order T001→T017; no judged-column or capture-convention task (T004-T011) may start before the corpus-state and pattern preconditions (T001-T003) complete; the first scenario execution (T012-T015) may not start before the persistence-contract extension and the category definition (T004-T011) are both written; verification (T016-T017) may not start before a report actually exists |
| TASK-SCOPE | Touch only `manual-testing-playbook.md` (modify) and, per release, a new dated directory under `benchmark/reports/` (created only by the runner, never by hand); no edit to `check-diagram-corpus.cjs` outside a real future graduation event, no edit to any `assets/` or `screenshots/` file, no `sk-design-chart` file |
| TASK-VERIFY | Each definitional task (T004-T011) names its own check (a grep for the new section heading, a direct read confirming the marker text is unchanged) before being marked `[x]`; the first scenario execution (T012-T015) is verified by reading the generated `results.csv` and confirming no unreasoned skip |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] — one line of evidence`

### Blocked Task Protocol

1. Mark the task `[B]` in `tasks.md` and stop touching the files it names.
2. State the blocking fact in one sentence: the command run, what it returned, and which
   requirement or decision it contradicts.
3. If the block traces to 005's judged-boundary block not actually existing on disk, or to a
   002-signed value this phase cannot locate, escalate to the operator rather than guessing a
   value.
4. Resume only after the block is cleared and the task's own verify check passes.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | The `CAPTURE REVIEW` heading, `CAP-001` entry, graduation-log section, and unchanged persistence-contract marker all present in `manual-testing-playbook.md` | `grep -c`, `grep -n` |
| Manual (judged reads) | The six-read judged column applied against the corpus's captures | Human review, following the double-capture and third-capture conventions this phase defines |
| Manual (measurement plan) | The label-mask overflow measurement plan, once run | Playwright, headless, against `example-high-level.html`'s 7 named mask rects |
| Persisted-run | The first capture-review scenario execution | `run-manual-playbook-scenario.cjs`, read by eye afterward for a hollow-pass check |
| Reconciliation | The judged-boundary block and the graduation log never agree on the same item | Direct read of both files, side by side |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 005's `check-diagram-corpus.cjs` and judged-boundary block | Internal | Yellow — 005 authored, execution pending | The graduation door has nothing on the checker side to point at; T001 blocks until the block is read on disk |
| 002's `findings-ledger.md` | Internal | Green — exists on disk, read for this authoring pass | None; already read |
| `manual-testing-playbook.md` and its nine existing dated reports | Internal | Green — confirmed on disk today | None; the extension follows an existing, working convention |
| `run-manual-playbook-scenario.cjs` (read-only tool, outside `sk-design`) | Internal | Green — confirmed on disk at its real path | None; already read for this authoring pass |
| Playwright (headless-browser measurement) | External | Green — already a documented project dependency per the playbook's own precondition 3 | If missing locally, the label-mask measurement (T012) is a documented `SKIP` with a named blocker, mirroring the playbook's own existing IMP-003 PNG-export precedent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the capture-review discipline proves unworkable in practice — reports never persist
  correctly, or the judged column's reads produce irreconcilable disagreement between reviewers
  release over release.
- **Procedure**: this is a standing process, not a deployment, so there is nothing to redeploy. The
  procedure is to stop dispatching new capture-review runs, record the discontinuation as a dated
  note inside `manual-testing-playbook.md`'s `CAPTURE REVIEW` section rather than deleting it, and
  leave every already-persisted dated report under `benchmark/reports/` untouched — the evidence
  trail of what was reviewed and when stays intact even if the discipline itself is later revised
  or replaced.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Corpus-state + pattern precondition (T001-T003) ──┐
                                                    ├──► Judged-column + convention authoring (T004-T011) ──► First scenario execution (T012-T015)
                                                    │
                                                    └──► (blocks nothing else; this is the packet's last phase)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Judged-column authoring |
| Judged-column authoring | Setup | First scenario execution |
| First scenario execution | Judged-column authoring | Verification |
| Verification | First scenario execution | None — this phase's own permanent standing, not a successor phase |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (T001-T003) | Low | 1-2 hours |
| Implementation (T004-T011) | Medium | 4-6 hours |
| First execution + verification (T012-T017) | High (human-review-heavy) | 6-10 hours |
| **Total** | | **11-18 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — not applicable; every artifact is git-tracked
- [ ] Feature flag configured — not applicable; no runtime feature ships from this phase
- [ ] Monitoring alerts set — not applicable; the dated `benchmark/reports/` history is the monitoring surface for this standing process

### Rollback Procedure
1. Stop dispatching new capture-review scenario runs.
2. Record the discontinuation as a dated note inside `manual-testing-playbook.md`'s `CAPTURE
   REVIEW` section rather than deleting the section.
3. Confirm every already-persisted dated report under `benchmark/reports/` is untouched.
4. Notify the operator, since the parent `goal.md`'s own completion criteria name this phase's
   dated report as evidence the standard was reached.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — no database, no persisted state beyond the git-tracked Markdown
  and the dated report directories themselves.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────────────────────┐     ┌──────────────────────────┐     ┌────────────────────────┐
│ Corpus + pattern           │────►│  Judged-column + capture  │────►│  First scenario        │
│ precondition (T001-T003)   │     │  convention (T004-T011)   │     │  execution (T012-T015) │
└───────────────────────────┘     └────────────┬───────────────┘     └───────────┬─────────────┘
                                                │                                  │
                                                ▼                                  ▼
                                   ┌────────────────────────┐         ┌──────────────────────────┐
                                   │  Graduation log +       │         │  Verification (T016-T017)│
                                   │  extended contract       │         │  — the phase gate         │
                                   └────────────────────────┘         └──────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Corpus + pattern precondition | 005's judged-boundary block read, 002's ledger read | Confirmed judged-boundary text, cited findings | Judged-column authoring |
| Judged-column + capture convention | Precondition | The six-read column, third-capture and double-capture conventions, extended contract, graduation log | First scenario execution |
| First scenario execution | Judged-column authoring | The first dated `benchmark/reports/` directory, a `results.csv` with reasoned skips | Verification |
| Verification | First scenario execution | The phase gate: a proven-clean report, judged-boundary/graduation-log reconciliation | Nothing downstream — this is the packet's last phase |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Corpus + pattern precondition (T001-T003)** - 1-2 hours - CRITICAL
2. **Judged-column + capture convention authoring (T004-T011)** - 4-6 hours - CRITICAL
3. **First scenario execution (T012-T015)** - 4-8 hours - CRITICAL
4. **Verification (T016-T017)** - 2-3 hours - CRITICAL

**Total Critical Path**: ~11-19 hours

**Parallel Opportunities**:
- The double-capture convention (T008) can be authored alongside the judged-column definition
  (T004), since both read the corpus independently.
- The graduation log's schema (T011) can be authored alongside the extended persistence-contract
  note (T009), since neither depends on the other's exact wording.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Preconditions confirmed | 005's judged-boundary block read; 002's ledger read; playbook and existing reports read | After T003 |
| M2 | Judged column and capture conventions authored | The six-read column, graduation threshold, measurement plan, third-capture and double-capture conventions, extended contract, and graduation log all exist inside `manual-testing-playbook.md` | After T011 |
| M3 | First scenario proves the discipline against real data | A dated report exists, generated only through the runner, with a clean `results.csv` | After T015 |
| M4 | Gate met | The phase gate: a dated report per release, no hand-authored Markdown, every skip reasoned, judged-boundary/graduation-log reconciled | After T017 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: "Different picture" is a reader comparison, not a computed diff

**Status**: Accepted

**Context**: The skin-pinned third capture exists to prove the one-skin-per-file contract (D1)
still holds by eye. No image-diff or perceptual-hash tool exists anywhere in this skill or its
shared scripts today, and building one would be new infrastructure this phase's own scope does not
require — the whole point of this permanent phase is that some things are read by an eye, not
computed.

**Decision**: A reader opens the skin-pinned third capture and the unpinned capture of the same
source side by side and confirms, by eye, that the paper (background) and ink (primary text/stroke)
swatches visibly differ between the two. This is recorded as a yes/no read inside the same judged
column this phase already formalizes, not as a new automated check.

**Consequences**:
- The test is immediately usable with zero new tooling, consistent with this phase's own
  discipline that what no check can see gets an eye rather than a workaround script.
- A borderline case (a subtle skin whose paper and ink differ only slightly) relies on reviewer
  judgment, the same way the other five judged reads already do; this is treated as a feature of
  the discipline, not a gap to close with a numeric threshold.
- If a future phase adds a perceptual-diff tool for an unrelated reason, this test could adopt it
  as a corroborating check, but this ADR does not require or anticipate building one now.

**Alternatives Rejected**:
- Build a pixel-hash or perceptual-diff script as part of this phase — rejected; it is new
  infrastructure disproportionate to a single yes/no read, and no image-diff precedent exists
  anywhere in `sk-design` to port from, unlike the checker/mutation-suite shape 005 ported from the
  chart skill.
- Require byte-identical file-hash difference only — rejected; two capture runs of an unrelated
  file can differ in PNG encoding metadata without the picture itself changing, so a byte-hash
  compare would produce false passes and false fails unrelated to the actual skin.

---

### ADR-002: Graduation is a one-way, two-file atomic edit

**Status**: Accepted

**Context**: 005's `check-diagram-corpus.cjs` registers a plain-English judged-boundary block
naming what it does not statically hold. This phase's own judged column names the same items in
more operational detail. Without a stated rule, a future graduation event could update one file and
forget the other, leaving an item listed as both judged (here) and enforced (there) — or neither.

**Decision**: A graduation event is defined as a single atomic change touching exactly two files:
005's judged-boundary block loses the line naming the item, and this phase's graduation log gains a
row (item, date, family, evidence) in the same change. The direction is one-way: an item that
graduates never returns to the judged column, even if the family that enforces it is later found to
have a gap — a gap in an enforced family is a bug in that family, not evidence the item should
un-graduate.

**Consequences**:
- SC-005's reconciliation check (the two files never list the same item) becomes a meaningful,
  checkable invariant rather than an aspiration.
- A future contributor reading either file alone gets a complete, non-contradictory picture of
  what is judged versus enforced at that moment.
- The one-way rule means a family found to have a real gap after graduation is fixed as a family
  bug (through 005's own mutation-suite discipline), not worked around by reintroducing manual
  review — keeping the two disciplines from blurring back together.

**Alternatives Rejected**:
- Let the judged-boundary block and the graduation log update independently, on their own
  schedules — rejected; this is exactly the drift SC-005 exists to catch, and independent updates
  make that drift likely rather than exceptional.
- Allow a two-way door (a graduated item can return to judged status if the family is later
  deprecated) — rejected; D4 frames the eye as the permanent complement to the code, not a fallback
  for a family that turns out to be wrong — a wrong family gets fixed, not un-automated.

---

### ADR-003: The font-substitution risk is measured by a headless browser, not reasoned about statically

**Status**: Accepted

**Context**: F3.3's risk (fixed-width label-mask overflow under font substitution) is, per the
reconciled fact base, named but not measured — no browser tool was available to either research
lineage. A static check cannot settle this: whether a substituted font's rendered glyph metrics
overflow a fixed-width mask rect depends on the browser's actual font-fallback and layout behavior,
which no grep or coordinate check can reproduce.

**Decision**: The measurement plan this phase specifies (for a future execution task to run) loads
`example-high-level.html` in a headless browser, once with its authored font stack intact and once
with the primary web font disabled (forcing the documented fallback chain, per D2), and compares the
rendered bounding box of each of the 7 named arrow-label mask text runs against its authored mask
`<rect>` dimensions. A fail is any text run whose rendered width exceeds its mask rect's width.
Playwright is the tool, since it is already a documented project dependency (the playbook's own
precondition 3) rather than new infrastructure this phase would otherwise have to introduce.

**Consequences**:
- The risk moves from "named" to "measured" without inventing a new tool dependency.
- A missing local Playwright install is a documented `SKIP` with a named blocker, mirroring the
  playbook's own existing `IMP-003` PNG-export precedent, rather than a silent gap.
- The measurement is scoped to the one file and 7 rects the fact base names as the concrete
  instance; it does not attempt to re-measure every label across all 39 captures in this pass.

**Alternatives Rejected**:
- Reason about font-metric overflow statically, from font-family declarations and character counts
  alone — rejected; this is exactly the "named, not measured" gap the reconciled fact base already
  flags, and a static estimate cannot account for real browser font-fallback rendering.
- Defer the measurement to a future phase — rejected; F3.3 is explicitly assigned to this node in
  `findings-ledger.md`'s node-distribution table, and D4's forced order places the eye last, not the
  measurement plan itself; the plan belongs here even though its execution is a future task.
