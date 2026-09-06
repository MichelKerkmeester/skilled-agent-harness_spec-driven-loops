---
title: "Implementation Plan: Roll the settled chrome across the whole chart corpus"
description: "Take the chrome proven on two forms to twenty-nine asset files, turn the corner radius into a token ladder with a check behind it, and prove the whole corpus still renders."
trigger_phrases:
  - "chart chrome rollout plan"
  - "chart radius token plan"
  - "corpus wide restyle plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Roll the settled chrome across the whole chart corpus

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Self-contained HTML5 with inline SVG, plus Node CommonJS for the corpus check |
| **Framework** | None by contract. A template depends on nothing at runtime |
| **Storage** | `assets/color/palettes.json` is the only source of shared values |
| **Testing** | `scripts/check-corpus.cjs`, structural by default and browser-backed under `--render` |

### Overview

The chrome half is mechanical and wide. Ten `.grid` declarations go dashed, every `.tick`
declaration drops to muted ink, the body font stack in twenty-nine files gains a system mono
face for numeric text, the line family gains the two-weight dot language, and every area fill
becomes a gradient that dissolves at the baseline. None of it changes what a chart says. All of
it changes how the set reads together.

The radius half is narrower and it carries the real design work. Twenty files each type
`border-radius: 10px`. That value moves into the palette source as a ladder, the twenty
declarations become references, and the corpus check gains an assertion so a twenty-first file
cannot quietly type its own corner. The check is the point. Without it the ladder is a paragraph
in a reference document, which is the state the current uniformity is already in.

Two routes exist for where the tokens live, and the phase picks by testing rather than by
preference. Route A puts them in `palette.chrome`, which `customProperties` already walks, so
every palette block gains them with no checker change. Route B adds a sibling object and teaches
`customProperties` to read it, which keeps `chrome` meaning colour. Route A is cheaper and Route B
is more honest, and the deciding evidence is whether the contrast machinery in
`checkPaletteSource` trips over a length.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 001 closed with a recorded stroke weight and a recorded glow verdict
- [x] Baseline corpus check captured with `--render`
- [x] The before-count of every value this phase replaces is recorded

### Definition of Done
- [x] All acceptance criteria met. 17 Met, 3 Superseded by ADR-006, 0 Unmet
- [x] `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state
- [x] The radius assertion is proven able to fail. Three red runs in `scratch/radius-negative.txt`
- [x] Docs updated (spec/plan/tasks/acceptance-criteria/decision-record/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A flat corpus of self-contained documents with one shared source of values and one script that
asserts every file against it. Nothing is imported at runtime. The palette source is read by the
check rather than by the templates, and the templates carry a generated copy between sentinels
that the check compares in both directions.

### Key Components

- **`assets/color/palettes.json`**: the source of every shared value. Today it holds four chrome colours, three systems and six contrast gates.
- **`scripts/check-corpus.cjs`**: fifteen named checks. `customProperties` at line 100 builds the canonical block, and `canonicalBlock` at line 114 prints the exact text a template has to carry.
- **`assets/color/palette-sheet-neutral.html`**: the skeleton every new form is copied from. A change that misses this file is a change new forms will not inherit.
- **`assets/templates/`**: twenty chart forms. Ten draw a grid, nine draw a path, six draw bars.
- **`assets/examples/`**: six family deliveries. They are deliveries rather than forms, so the catalog check ignores them and the chrome check does not.

### Data Flow

A shared value lives in `palettes.json`, the check renders it into a canonical block, the block is
pasted between the `CHART_PALETTE` sentinels in every file, and every stylesheet rule refers to
the custom property rather than to the value. A drifted block fails with the exact replacement
text printed. That loop is why a corpus-wide restyle is affordable and why it cannot go half
applied.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is a class-of-change rollout across twenty-nine files, so the inventory is what separates a
complete pass from a pass that missed four files nobody looked at.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.grid` declarations | Solid one pixel rule at full rule colour | update | `grep -rn '^\.grid' assets/` before and after, counts must match |
| `.tick` declarations | Muted fill at full strength | update | `grep -rn '^\.tick' assets/` before and after, counts must match |
| The body font stack in every asset file | One sans stack for every character | update | `grep -rln 'font-family' assets/` returns twenty-nine files, and each gains a mono role |
| `fmt` in every asset file | Owns every printed figure | unchanged | `grep -rn 'toLocaleString' assets/` returns nothing before and after |
| `.area` and band fills | Flat `fill-opacity` | update | `grep -rn 'fill-opacity' assets/templates/` before and after |
| `border-radius` declarations | Twenty hand-typed `10px` values | update | `grep -rc 'border-radius' assets/` before and after, and the after-count of literal `10px` is zero |
| Bar rects in the bar family | Square corners, zero `rx` | update | `grep -rn 'rx=' assets/templates/` returns the six bar-family files |
| `customProperties` in the check | Builds the canonical block from `palette.chrome` and the systems | update | The new assertion count appears in the run summary and is nonzero |
| The catalog | Indexes forms by id | unchanged | The `catalog` check resolves in both directions with zero failures |

Required inventories:
- Producers of the chrome: `grep -rn '^\.grid\|^\.tick\|^\.area\|border-radius' assets/`.
- Consumers of the palette source: every file carrying a `CHART_PALETTE:BEGIN` sentinel, which is `grep -rln 'CHART_PALETTE:BEGIN' assets/`.
- Rung inventory: every distinct corner value the corpus draws today, so a rung is added for a real consumer rather than for symmetry.
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
| Structural | Twenty-nine asset files against the fourteen contract rules plus the new radius rule | `node scripts/check-corpus.cjs` |
| Rendered | Every asset file opened headless, figure region asserted non-empty | `node scripts/check-corpus.cjs --render` |
| Negative | A mutated copy of one template, to prove the radius assertion can go red | `sed` the value, run the check, restore with `git checkout --` |
| Manual | Axis labels at delivery width, after the mono face changes advances | Browser |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 fork answers | Internal | Red until answered | The `.line` weight cannot be finalised in nine files |
| Headless Chrome for `--render` | External | Green | Twenty-nine edits are unprovable, so none may be applied |
| `scripts/check-corpus.cjs` | Internal | Green | No gate, so no edit is claimable |
| `assets/color/palettes.json` | Internal | Green | The ladder has nowhere to live |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the corpus check fails on a file this phase touched, and the failure repeats on the same file across runs.
- **Procedure**: `git checkout -- <file>` for the affected file. A palette source failure reverts `palettes.json` first, because a drifted source fails every file at once and the per-file failures are downstream of it.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (baseline, inventories) ──► Chrome rollout ───┐
                                                    ├──► Verify
                              Radius tokens ────────┘
                              + check + negative test
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 answers | Chrome, Radius |
| Chrome | Setup | Verify |
| Radius | Setup | Verify |
| Verify | Chrome, Radius | Phase 003 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and inventories | Low | 40 minutes |
| Chrome across twenty-nine files | High | 3 hours |
| Radius tokens, check and negative test | Medium | 2 hours |
| Reference document updates | Low | 40 minutes |
| Verification and reconciliation | Medium | 1 hour |
| **Total** | | **about 7 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline corpus check captured with `--render` and its `RESULT:` line read
- [ ] Every before-count recorded, so a partial rollout is visible rather than inferred
- [ ] Nothing committed, so the working tree is the only state to revert

### Rollback Procedure
1. Read the `FAIL` block of the corpus check and separate palette-source failures from per-file failures.
2. Revert `palettes.json` first when the source is implicated, because every block is downstream of it.
3. `git checkout -- <file>` for each remaining file.
4. Re-run `node scripts/check-corpus.cjs --render` and read the `RESULT:` line.
5. Record every reverted change in `acceptance-criteria.md` as unmet, with the reason.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Phase 001   │────►│    Setup     │────►│    Verify    │
│  fork answer │     │  + baseline  │     │  + negative  │
└──────────────┘     └──────┬───────┘     └──────────────┘
                            │                     ▲
                ┌───────────┴───────────┐         │
                ▼                       ▼         │
        ┌───────────────┐       ┌───────────────┐ │
        │ Chrome rows   │       │ Radius ladder │─┘
        │ 29 files      │       │ + check       │
        └───────────────┘       └───────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | Phase 001 answers | Baseline run, before-counts, rung inventory | Chrome, Radius |
| Chrome rows | Setup | Twenty-nine restyled files | Verify |
| Radius ladder | Setup | Token source, twenty-nine referring files, one new assertion | Verify |
| Verify | Chrome, Radius | Green corpus check, proven-red negative test | Phase 003 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup, baseline and inventories** - 40 minutes - CRITICAL
2. **Radius ladder, tokens and the new assertion** - 2 hours - CRITICAL
3. **Chrome across twenty-nine files** - 3 hours - CRITICAL
4. **Verification including the negative test** - 1 hour - CRITICAL

**Total Critical Path**: about 7 hours

**Parallel Opportunities**:
- The chrome rows and the radius ladder touch different declarations in the same files, so they can be authored in either order. They cannot be edited concurrently by two workers, because both rewrite the same stylesheets.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Inventories captured | Every before-count recorded, including twenty `border-radius: 10px` | Early |
| M2 | Ladder enforced | The radius assertion reports a nonzero count and fails on a mutated copy | Middle |
| M3 | Corpus restyled | `check-corpus.cjs --render` prints `RESULT: PASSED` over twenty-nine files | End |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Decision records for this phase live in `decision-record.md`. This section names the one decision
that shaped the plan itself.

### ADR-000: The check ships in the same phase as the convention

**Status**: Accepted

**Context**: the corner radius is already uniform across all twenty forms and nothing enforces it.
One lineage measured that uniformity and proposed writing it down. Writing it down is what the
corpus already effectively did, and it did not hold anything.

**Decision**: the radius ladder and the assertion that enforces it ship together. A convention
without a check is described rather than enforced, and the packet's own scripts document says a
rule the tooling does not check is a wish.

**Consequences**:
- The phase costs a checker change it could otherwise have deferred.
- A twenty-first form cannot type its own corner, which is the failure the current state is one
  file away from.

**Alternatives Rejected**:
- Ship the ladder and add the check later: the later phase inherits twenty-nine files that may
  already have drifted, and it has no baseline to compare against.

---

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm phase 001 closed and its decision record carries a disposition for both forks.
- [ ] Confirm the baseline corpus check ran with `--render` and its `RESULT:` line was read.
- [ ] Confirm every before-count is recorded, so a file missed by the rollout is visible.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | The radius ladder and its assertion land in one pass. A ladder shipped without its check is the state this phase exists to leave. |
| TASK-SCOPE | Edits stay inside `.opencode/skills/sk-doc/sk-create-chart/` and this phase folder. The catalog is phase 006 and is not touched. |
| TASK-GATE | No claim is made until `node scripts/check-corpus.cjs --render` prints `RESULT: PASSED` from the state that includes every edit. |
| TASK-PROOF | The new assertion is shown failing on a mutated copy before it is trusted, then the copy is restored. |

### Status Reporting Format

Report phase status as: `Phase 002 — <Draft|Applying|Complete> — N/29 files restyled — radius: <tokens|literals> — gate: <PASSED|FAILED>`.

### Blocked Task Protocol

A render failure on the same file across repeated runs is a chart drawing nothing, and it blocks
the claim until the file is fixed or reverted. A different file each run is the headless browser
and it is retried. If the radius tokens cannot live inside the palette sentinels, take Route B
from the summary rather than dropping the check, and record the route in the decision record.
<!-- /ANCHOR:ai-execution-protocol -->
