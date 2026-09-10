---
title: "Implementation Plan: Phase 3: applicator-and-sentinels"
description: "A sentinel palette block per file plus a ported gate module and a third hand-run applicator that themes the diagram corpus from its own token source."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: applicator-and-sentinels

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS (`.cjs`) — matches `sk-design-chart`'s own applicator |
| **Framework** | None; a hand-run CLI script, no build step, no package dependency beyond `fs`/`path`/`crypto` |
| **Storage** | Flat files only: one JSON token source, two `.cjs` scripts, four `.html` templates |
| **Testing** | Byte diff (T007) plus `validate.sh --strict`; the unit-test suite for the ported functions is 005's `node --test` family, not built here |

### Overview
This phase ports the chart's four-function contrast module into the diagram skill as its own file,
defines a one-block-per-file sentinel contract for the four templates, and builds
`apply-diagram-tokens.cjs`: a third hand-run script that reads the diagram's own token source,
computes contrast gates against whichever ground a file's `skin=` names, and writes copies to
`--out`. The phase closes when `--default` reproduces the four templates' stock bytes exactly.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md §2, §3)
- [ ] 002's derivation record shape specified (three lists, four kinds, gate table) even if not yet operator-ratified
- [ ] `sk-design-chart/scripts/apply-design-md.cjs` and `color-gates.cjs` read in full — the porting source, not summarized

### Definition of Done
- [ ] All acceptance criteria met (AC-001 through AC-008)
- [ ] `--default --out <dir>` diffed against `assets/templates/` is empty (T007) — the phase's own handoff gate
- [ ] Every template carries exactly one `DIAGRAM_PALETTE:BEGIN` block and zero `DIAGRAM_PALETTE_DARK` markers (T008, T009)
- [ ] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
CLI generator script — the same pattern `sk-design-chart`'s `apply-design-md.cjs` already uses:
read a declared source, derive per-ground values, gate them, render, write copies.

### Key Components
- **Token source** (`assets/color/diagram-palette.json`): the 25-value census across three grounds
  (light, dark, terminal) and four kinds (primary, derived, fixed, untokenized), consumed from
  002's signed derivation record.
- **Ported gate module** (`scripts/color-gates.cjs`): `channel`, `luminance`, `contrast`, `round2`
  — copied verbatim from the chart's module, diagram-owned, no runtime cross-skill import (D12).
- **Sentinel contract**: `DIAGRAM_PALETTE:BEGIN skin=light|dark|terminal … :END`, one block per
  file, wrapping only that file's `--color-*` declarations inside its existing `:root` rule.
- **Applicator** (`scripts/apply-diagram-tokens.cjs`): the CLI surface, the derive/gate/render
  pipeline, and the copy-out write model.

### Data Flow
The token source (JSON) is read once. The applicator selects the ground the target file's `skin=`
names, computes that ground's chrome and accent contrast ratios through the ported module, and
refuses any ratio under its signed gate unless the derivation record marks that row as a `departs`
exception. A passing derivation is rendered into the sentinel block shape and written to `--out` —
never to `assets/templates/` itself. In `--default` mode the token source's own default values are
used, and because T004 bakes those same default values into the templates' sentinel blocks when
they are first inserted, the `--out` copy and the committed template become byte-identical; that
identity is what T007's diff proves.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase's `research_intent` is new-capability build, not `fix_bug`. It is filled here anyway
because the sentinel contract touches a shared asset (the four templates every future diagram
copies from).

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assets/templates/*.html` (producer) | Ships the stock `:root` custom properties every new diagram copies from | Modify — gains one sentinel block per file | `grep -c "DIAGRAM_PALETTE:BEGIN"` reports `1` per file (T008) |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/` (producer) | Holds only the two format extractors and the ASCII validator today — no HTML/SVG script | Create — two new files (`color-gates.cjs`, `apply-diagram-tokens.cjs`) | `test -f` on both paths |
| 004's repaint, 005's checker (consumer) | Not built yet | Not a consumer this phase — 003 builds what they will read; it does not read from them | N/A this phase |
| `sk-design-chart/scripts/color-gates.cjs` (porting source) | Read-only reference for T003's port | Unchanged — D12 hard block | `git diff` over `sk-design-chart/` is empty for this phase |

Required inventories:
- Same-class producers: not applicable — no existing diagram script family to compare against; this phase creates the first one.
- Consumers of changed symbols: none yet exist; 004 and 005 are the first consumers and are out of this phase's scope.
- Matrix axes: skin (`light`/`dark`/`terminal`) × kind (`primary`/`derived`/`fixed`/`untokenized`) — 3 × 4 = 12 rows the token source's shape must account for, though not every cell is populated (an `untokenized` row has no ground-specific variant by definition).
- Algorithm invariant: a computed ratio below its signed gate always refuses the run, except a row the derivation record names as `departs` — no third code path exists.
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

1. Read `002-skin-contract/findings-ledger.md` and its signed derivation-record shape (three lists,
   four kinds, gate table) before touching the token source — a wrong shape propagates into every
   later task.
2. Read `.opencode/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs` and
   `color-gates.cjs` in full before porting; the port must match the four exported function bodies
   exactly, not a rewrite or a simplification.
3. Record the current byte content of all four templates (`wc -l`, `grep -c "DIAGRAM_PALETTE"`)
   before any edit, so the pre-sentinel baseline is on record for T007's diff to compare against.
4. Confirm no file under `.opencode/skills/sk-design/sk-design-chart/` is in this phase's edit set
   — D12 is a hard block, not a preference.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Tasks execute in file order T001→T010; T004 (sentinel insertion) may not start before T002 (token source) exists, and T007 (the phase gate diff) may not run before T004 and T006 are both done |
| TASK-SCOPE | Touch only `assets/color/diagram-palette.json` (new), `scripts/color-gates.cjs` (new), `scripts/apply-diagram-tokens.cjs` (new), and the four files under `assets/templates/`; no `sk-design-chart` file, no `references/` file, no file under `assets/examples/` |
| TASK-VERIFY | Each implementation task's own line names its check (grep count, byte diff, or file existence); run that check before marking the task `[x]`, and rerun T007's diff after any later edit to the four templates |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] — one line of evidence`

### Blocked Task Protocol

1. Mark the task `[B]` in `tasks.md` and stop touching the files it names.
2. State the blocking fact in one sentence: the command run, what it returned, and which
   requirement or ADR it contradicts.
3. If the block traces to a 002 decision that has not landed yet (the derivation record's gate
   table), escalate to the operator rather than guessing a gate value.
4. Resume only after the block is cleared and the task's own verify check passes.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Sentinel-block count and shape per template | `grep -c`, manual read |
| Byte-identity | `--default` output vs. `assets/templates/` — the phase gate | `diff -rq` |
| Unit (deferred) | Per-function gate arithmetic (`channel`, `luminance`, `contrast`, `round2`) | 005's `node --test` suite adds diagram cases; this phase ports the functions, it does not write their test file |
| Manual | Font-fallback declarations untouched outside the sentinel | Human review (T010) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 002's signed derivation record (gate table, three-list/four-kind shape) | Internal | Yellow — 002 authored, not yet operator-ratified | Applicator cannot compute a real gate value; T002, T005, T006 block |
| `sk-design-chart/scripts/color-gates.cjs`, `apply-design-md.cjs` (porting/pattern source, read-only) | Internal | Green — both exist on disk today | None; already read in full for this authoring pass |
| Node.js runtime (`fs`, `path`, `crypto` only) | External | Green | None; the same runtime the chart applicator already uses |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `--default` fails to reproduce the stock bytes, or a later 002 amendment changes a signed gate value after T004-T006 already assumed the old one.
- **Procedure**: revert the phase's commits touching `assets/color/diagram-palette.json`, `scripts/color-gates.cjs`, `scripts/apply-diagram-tokens.cjs`, and the four templates. Nothing is deployed or migrated — a `git revert` of the phase's commit range is sufficient; no data reversal, no running service to restart.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Token source (T002) ───────┐
                            ├──► Sentinel insertion (T004) ──► Applicator build (T005-T006) ──► Phase gate diff (T007)
Gate module port (T003) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Token source (T002) | Operator ratification (T001) | Sentinel insertion, applicator build |
| Gate module port (T003) | Operator ratification (T001) | Applicator build |
| Sentinel insertion (T004) | Token source | Applicator build, phase gate diff |
| Applicator build (T005-T006) | Token source, gate module, sentinel insertion | Phase gate diff |
| Phase gate diff (T007) | Applicator build, sentinel insertion | 004's repaint |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (T001-T003) | Low | 1-2 hours |
| Implementation (T004-T006) | Medium | 3-5 hours |
| Verification (T007-T010) | Low | 1 hour |
| **Total** | | **5-8 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — not applicable; every artifact is git-tracked
- [ ] Feature flag configured — not applicable; no runtime feature ships from this phase
- [ ] Monitoring alerts set — not applicable

### Rollback Procedure
1. Stop touching `assets/templates/`, `scripts/color-gates.cjs`, `scripts/apply-diagram-tokens.cjs`, and `assets/color/diagram-palette.json`.
2. `git revert` the phase's commit range over those paths.
3. Rerun T008/T009's grep checks to confirm the templates are back to zero sentinel blocks.
4. Notify the operator and the 004 phase owner, since 004 depends on this phase's applicator existing.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — no database, no persisted state beyond the git-tracked files themselves.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────┐     ┌──────────────────────┐     ┌────────────────────────┐
│  Token source   │────►│  Sentinel insertion  │────►│  apply-diagram-tokens  │
│  (T002)         │     │  (T004)              │     │  .cjs (T005-T006)      │
└────────────────┘     └──────────────────────┘     └───────────┬────────────┘
                                                                  │
                                                            ┌─────▼──────┐
                                                            │ Phase gate │
                                                            │ diff (T007)│
                                                            └────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Token source | T001 ratification | `diagram-palette.json` | Sentinel insertion, applicator |
| Gate module port | T001 ratification | `color-gates.cjs` | Applicator |
| Sentinel insertion | Token source | Four annotated templates | Applicator, phase gate |
| Applicator | Token source, gate module, sentinel insertion | `apply-diagram-tokens.cjs` | Phase gate |
| Phase gate diff | Applicator, sentinel insertion | Empty diff (evidence) | 004 |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Token source (T002)** - 1 hour - CRITICAL
2. **Sentinel insertion (T004)** - 1-2 hours - CRITICAL
3. **Applicator build (T005-T006)** - 2-3 hours - CRITICAL
4. **Phase gate diff (T007)** - <1 hour - CRITICAL

**Total Critical Path**: ~5-7 hours

**Parallel Opportunities**:
- Gate module port (T003) runs alongside the token source (T002)
- The human-review task (T010) runs alongside the grep checks (T008-T009)
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Setup complete | Token source and ported gate module both exist | After T003 |
| M2 | Contract live | All four templates carry exactly one sentinel block | After T004 |
| M3 | Gate met | `--default` reproduces stock bytes; successor gate satisfied | After T007 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Port `color-gates.cjs` rather than import it across skills

**Status**: Accepted

**Context**: D12 freezes the chart skill — nothing in it changes for this packet. A runtime
cross-skill import (`require('../../sk-design-chart/scripts/color-gates.cjs')`) would make the
diagram applicator's correctness depend on a file outside its own boundary, and any future change
inside the chart skill's own freedom to change could silently break diagram builds with no
declared coupling anywhere in either skill's manifest.

**Decision**: Copy the four pure functions (`channel`, `luminance`, `contrast`, `round2`) verbatim
into a new file at `.opencode/skills/sk-design/sk-design-diagram/scripts/color-gates.cjs`, owned
by the diagram skill.

**Consequences**:
- No runtime cross-skill dependency; the diagram skill is self-contained.
- D12 stays literal, not just spiritual — the chart skill genuinely never changes for this work.
- The two modules can drift if the shared arithmetic model ever needs a fix, since a fix must then
  land in both files by hand. That drift risk is accepted rather than solved with an import, per D12.

**Alternatives Rejected**:
- A shared local package extracted from both skills — rejected; this phase's scope is the sentinel
  contract and the applicator, not a repo-wide module extraction, and D12 already forbids touching
  the chart skill's own files, which a shared-package refactor would require.

---

### ADR-002: One sentinel block per file, not the chart's begin/end pair

**Status**: Accepted

**Context**: Chart forms carry two markers — `CHART_PALETTE` (light) and `CHART_PALETTE_DARK`
(dark, wrapped in `@media (prefers-color-scheme: dark)` plus a `[data-scheme="dark"]` override) —
because one chart form serves both grounds live in the browser. Parent D1 forbids
`prefers-color-scheme` blocks for the diagram, and 0/38 diagram files use that pattern today; a
diagram is exported once, at one ground.

**Decision**: `DIAGRAM_PALETTE:BEGIN skin=light|dark|terminal … :END` — exactly one block per file,
no paired dark marker.

**Consequences**:
- A diagram file states its ground once, matching how it is actually exported and viewed.
- No runtime scheme-switching code is needed.
- A project that wants both a light and a dark copy of the same diagram keeps two files — already
  true today (`template.html` vs. `template-dark.html`), so this is not a new cost.

**Alternatives Rejected**:
- The chart's two-block model ported as-is — rejected; 27×2 blocks across the corpus would serve
  no reader and directly contradicts parent D1.

---

### ADR-003: The sentinel wraps color custom properties only, inside the existing `:root`

**Status**: Accepted

**Context**: Chart forms have a dedicated stock `:root {}` used only for `--chart-*` tokens, so
wrapping the whole rule in its palette markers costs nothing else in that file. The diagram's
`:root` already mixes `--color-*` and `--font-*` custom properties in one rule (for example
`template.html`'s four `--color-*` lines sit directly above its three `--font-*` lines), and D2
already ships the font fallback chains with nothing left to port.

**Decision**: The sentinel begin/end comment pair wraps only the `--color-*` declarations inside
the existing `:root` rule; `--font-*` declarations stay outside the sentinel and untouched by the
applicator.

**Consequences**:
- Font fallback chains already shipped (D2) are never rewritten by a color-only tool.
- One `:root` rule stays per file, avoiding a second generated rule a reader has to reconcile
  against the first.
- The applicator's replace-region logic targets a sub-range inside `:root` rather than a whole
  top-level rule — a slightly finer replace than the chart's own region match.

**Alternatives Rejected**:
- Wrap the entire `:root` rule, including font vars (the chart's exact pattern) — rejected; it
  would put declarations outside this phase's scope under sentinel control and risk the applicator
  silently rewriting a fallback chain D2 already settled.

---
