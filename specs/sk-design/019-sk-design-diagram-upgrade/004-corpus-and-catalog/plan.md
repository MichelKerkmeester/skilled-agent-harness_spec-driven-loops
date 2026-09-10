---
title: "Implementation Plan: Phase 4: corpus-and-catalog"
description: "Repaint the 34 examples and four templates through the extended applicator, re-shoot 39 captures, and move the selection guide into a bidirectionally-verified catalog."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: corpus-and-catalog

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, HTML/SVG assets, Node.js CLI tooling (the applicator and the shared capture script) — no new source language introduced this phase |
| **Framework** | None; this phase extends and runs existing hand-run scripts, it does not add a build step |
| **Storage** | Flat files only: 34 example HTML files, 4 template HTML files, 39 PNG captures, two new markdown reference files, one modified `SKILL.md` |
| **Testing** | `grep -c` census and structural checks, a byte-diff re-verification of 003's gate, `render-screenshots.cjs --check`, and a dress run of 005's checker — the unit-test suite for the checker itself is 005's, not built here |

### Overview
This phase extends 003's `apply-diagram-tokens.cjs` to cover the 34 examples (its own recorded
Known Limitation), runs it to repaint every example at its implied ground while leaving
`example-sequence-oauth-dark.html` untokenized by name, re-shoots the 39 invalidated captures, and
replaces `SKILL.md`'s prose selection guide and router pseudocode block with two sentinel- and
pointer-backed reference files. The phase closes when a dress run of 005's not-yet-built checker
passes against the repainted corpus — the literal gate the parent spec's Phase Handoff table names
for 004 → 005.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md §2, §3)
- [ ] 003's `apply-diagram-tokens.cjs` exists and its own `--default` byte-diff gate passed (verified by T001 before T002 begins)
- [ ] 002's signed derivation record (gate table, three-list/four-kind shape) is available to read, even if not yet operator-ratified in full
- [ ] `sk-design-chart/references/catalog.md` and its `check-corpus.cjs` sentinel-parsing logic read in full — the pattern source, not summarized

### Definition of Done
- [ ] All acceptance criteria met (AC-001 through AC-008)
- [ ] `grep -ohE "#[0-9a-fA-F]{6}" assets/examples/*.html | wc -l` reports `1577` (T007) — the census reproduced
- [ ] `references/catalog.md` exists, sentinel-wrapped, with 27 rows verified bidirectionally against `references/types/*.md` and `assets/examples/*.html` (T012-T014)
- [ ] A dress run of `check-diagram-corpus.cjs` reports `RESULT: PASSED` against the repainted corpus (T019) — the phase's own handoff gate to 005
- [ ] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Batch transform-and-verify: extend an existing generator script, run it over a fixed corpus,
diff-verify each output before promotion, then rebuild two documentation surfaces (a catalog and a
relocated reference) from the corpus's own final state.

### Key Components
- **Applicator extension**: `apply-diagram-tokens.cjs` gains an examples selector so its existing
  `--default`/`--out` machinery, ported gate module, and sentinel-write model also reach the 34
  examples, not only the four templates.
- **Repaint runner**: invokes the extended applicator once per example (or in one batch, depending
  on the selector's shape decided in T002), writing to a scratch directory, never to
  `assets/examples/` directly.
- **Capture pipeline**: `../shared/scripts/render-screenshots.cjs`, unmodified, re-run over the
  repainted `assets/` root and verified with `--check`.
- **Catalog**: `references/catalog.md`, a `DIAGRAM_CATALOG:BEGIN … :END` sentinel pair around a
  table with canonical example, variant lattice, ceiling, imports, and skin columns — structurally
  modeled on `sk-design-chart/references/catalog.md`'s own header-name-matched, bidirectionally
  parsed table, without importing any chart-skill file.
- **Relocated router reference**: `references/foundations/router-pseudocode.md`, holding
  `SKILL.md`'s ~4.6KB/12.6% Smart Router Pseudocode block verbatim, with a one-line pointer left in
  `SKILL.md` where the block used to sit.

### Data Flow
The applicator extension reads the same token source and ported gate module 003 already built; it
adds a second input path (the 34 examples) beside the existing four templates. Each example is
painted at the ground its own pre-repaint ink treatment implies, written to a scratch copy, diffed
by hand against its pre-repaint version, and only then copied into `assets/examples/`. Once every
promotion lands, the capture pipeline reads the final `assets/` tree and writes 39 PNGs under
`screenshots/`. Independently, the catalog-build step reads `references/types/*.md` (27 files) and
`assets/examples/*.html` (34 files) to populate its table, and the router-pseudocode step reads
`SKILL.md`'s existing block once to move it verbatim. None of these three passes (repaint, capture,
documentation) share a runtime dependency on each other's output beyond ordering.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase's `research_intent` is corpus migration, not `fix_bug`. It is filled here anyway because
the repaint touches the shipped exemplar corpus every future diagram request copies from, and the
catalog replaces a table `SKILL.md`'s own router reads at request time.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assets/examples/*.html` (34 files, producer) | The shipped exemplar set every generate/import/export request is judged against | Modify — repainted to the signed skin | `grep -ohE "#[0-9a-fA-F]{6}"` count and `git diff` read by hand per file before promotion |
| `SKILL.md`'s "Use Cases — selection guide" table (consumer of type vocabulary) | Answers "which type for this question" inline | Modify — replaced by a pointer to `references/catalog.md` | `grep -c "Use Cases"` / catalog row count (T015) |
| `SKILL.md`'s Smart Router Pseudocode block (self-contained) | Documents the router's resolution order | Modify — relocated to `references/foundations/router-pseudocode.md` | `grep -c "Smart Router Pseudocode" SKILL.md` reports `0`; `test -f` on the new file (T016) |
| 002's accessibility-contract collapse (`SKILL.md:378, :406`) | Already collapsed to one canonical section plus two cross-references | Unchanged — this phase's SKILL.md edits touch only the selection-guide and pseudocode sections | `grep -c -i "accessib" SKILL.md` unchanged from the pre-phase baseline (T016) |
| `screenshots/**/*.png` (39 files, consumer of `assets/`) | Read by a human reviewing a type without opening a browser | Modify — re-shot against the repainted sources | `render-screenshots.cjs --check` reports every source covered (T009-T010) |
| `feature-catalog/feature-catalog.md`, `manual-testing-playbook/manual-testing-playbook.md` (independent doc families) | Mirror the chart skill's own doc structure; never diffed against `SKILL.md` before | Read, conditionally modify | T018's diff output; edited only if drift is found |
| `sk-design-chart/references/catalog.md` (pattern source) | Read-only reference for the catalog's shape | Unchanged — D12 hard block | `git diff` over `sk-design-chart/` is empty for this phase |
| 005's `check-diagram-corpus.cjs` (consumer, not yet built) | Will check this corpus once it exists | Not a consumer this phase — 004 hands 005 a corpus, it does not read from 005 | N/A this phase |

Required inventories:
- Same-class producers: the four templates are the only other producer of `--color-*` declarations under `assets/`; T001 and T003 re-confirm their byte-diff gate is unaffected by the applicator extension.
- Consumers of changed symbols: `SKILL.md`'s own router pseudocode (relocated, not renamed) and its selection-guide table are the only two in-repo readers of the moved content; no script parses either section programmatically today (confirmed by `grep -rl "Use Cases — selection guide\|Smart Router Pseudocode" .opencode --include=*.cjs --include=*.js` returning nothing beyond the shared capture tool's own docstring reference, which does not parse either section).
- Matrix axes: ground (`light`/`terminal`/`untokenized-skip`) × file class (`canonical`/`variant`/`import`) — 3 × 3 rows, though `untokenized-skip` only ever applies to one file by name, not a class.
- Algorithm invariant: a file is promoted into `assets/examples/` only after its diff is read; no code path promotes without that read, mirroring REQ-003's hard requirement.
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

1. Read `003-applicator-and-sentinels/plan.md` and its `implementation-summary.md` Known
   Limitations in full before touching `apply-diagram-tokens.cjs` — the extension must match the
   existing script's write model (copy-then-diff-then-promote), not introduce a second pattern.
2. Read `002-skin-contract/findings-ledger.md`'s signed derivation-record shape before repainting
   any file — a wrong ground value propagates into all 34 examples.
3. Record the current byte content and hex-literal census of the corpus (`wc -l`, `grep -ohE
   "#[0-9a-fA-F]{6}" assets/examples/*.html | wc -l`) before any edit, so the pre-repaint baseline
   is on record for later diffs to compare against.
4. Confirm no file under `.opencode/skills/sk-design/sk-design-chart/` is in this phase's edit set
   — D12 is a hard block, not a preference.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Tasks execute in file order T001→T019; no example may be promoted (T005-T006) before the applicator extension (T002) is re-verified against 003's own byte-diff gate (T003); the capture re-shoot (T009-T010) may not start before every promotion in its batch lands; the catalog build (T012-T014) may not start before the repaint's promotions are complete, since it reads the final corpus state |
| TASK-SCOPE | Touch only the 34 files under `assets/examples/`, the 4 files under `assets/templates/` (confirming re-run only), `screenshots/**`, `references/catalog.md` (new), `references/foundations/router-pseudocode.md` (new), `SKILL.md`, `references/foundations/style-guide.md`, and conditionally `feature-catalog/feature-catalog.md` / `manual-testing-playbook/manual-testing-playbook.md`; no `sk-design-chart` file, no `references/types/*.md` file, no edit to `apply-diagram-tokens.cjs`'s gate arithmetic itself (extension only, per REQ-001) |
| TASK-VERIFY | Each implementation task's own line names its check (grep count, byte diff, or file existence); run that check before marking the task `[x]`, and re-run T007's census grep after any later edit to `assets/examples/` |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] — one line of evidence`

### Blocked Task Protocol

1. Mark the task `[B]` in `tasks.md` and stop touching the files it names.
2. State the blocking fact in one sentence: the command run, what it returned, and which
   requirement or ADR it contradicts.
3. If the block traces to a value 002's derivation record has not yet ratified, or to 005's
   checker not existing yet (T019), escalate to the operator rather than guessing.
4. Resume only after the block is cleared and the task's own verify check passes.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Census count, catalog row count, sentinel presence | `grep -c`, `grep -ohE` |
| Byte-identity | Templates confirmed unchanged since 003's T007 gate | `diff -rq` |
| Coverage | Every capture source has a PNG and vice versa | `render-screenshots.cjs --check` |
| Bidirectional | Catalog row ↔ file mapping, both directions | Manual read, mirroring `check-corpus.cjs`'s header-name matching |
| Dress run (deferred) | The full corpus against 005's checker | `check-diagram-corpus.cjs`, once 005 ships it — the phase gate |
| Manual | The diff read before each promotion; the fresh-capture read; the sketchy descope reason; the feature-catalog/manual-testing-playbook drift call | Human review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003's `apply-diagram-tokens.cjs`, byte-diff gate passed | Internal | Yellow — 003 authored, execution pending | No working applicator to extend; T002 onward blocks |
| 002's signed derivation record | Internal | Yellow — 002 authored, not yet operator-ratified | No real ground values to paint with; T005 blocks |
| `../shared/scripts/render-screenshots.cjs` (read-only) | Internal | Green — exists on disk today | None; already confirmed against `README.md`'s own usage snippet |
| `sk-design-chart/references/catalog.md`, `check-corpus.cjs` (pattern source, read-only) | Internal | Green — both exist on disk today | None; already read for this authoring pass |
| 005's `check-diagram-corpus.cjs` (dress-run target) | Internal | Red — does not exist yet | The phase gate (T019) cannot run until 005 ships; sequenced last and marked blocked-on-dependency |
| Node.js runtime, Chrome (for capture) | External | Green | None; same runtime the shared capture tool already requires |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a promoted example's diff turns out to have been misread (an unintended value shipped), or the applicator extension is later found to have silently altered a template.
- **Procedure**: revert the phase's commits touching `assets/examples/`, `assets/templates/`, `screenshots/`, `references/catalog.md`, `references/foundations/router-pseudocode.md`, `SKILL.md`, and `style-guide.md`. Nothing is deployed or migrated — a `git revert` of the phase's commit range is sufficient; re-run 003's `--default` byte-diff to confirm the templates are back to their 003-gated state.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Applicator extension (T002) ──► Repaint + promote (T005-T006) ──► Census re-verify (T007) ──┐
                                                                                              ├──► Capture re-shoot + read (T009-T010)
Templates re-confirm (T001, T003) ─────────────────────────────────────────────────────────────┘
Catalog build (T012-T014) ──► SKILL.md pointer swap (T015) ──► Router relocation (T016) ──► Doc drift check (T018) ──► Dress run (T019)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Applicator extension | 003's gate | Repaint, promotion |
| Repaint + promote | Applicator extension, census baseline | Census re-verify, capture re-shoot |
| Catalog build | Repaint complete (reads final corpus) | SKILL.md pointer swap |
| Dress run | Catalog build, capture re-shoot, 005 shipped | 005's own first real run |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (T001-T003) | Low | 1-2 hours |
| Implementation (T004-T017) | Medium-High | 6-10 hours |
| Verification (T018-T019) | Low-Medium | 2-3 hours |
| **Total** | | **9-15 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — not applicable; every artifact is git-tracked
- [ ] Feature flag configured — not applicable; no runtime feature ships from this phase
- [ ] Monitoring alerts set — not applicable

### Rollback Procedure
1. Stop touching `assets/examples/`, `assets/templates/`, `screenshots/`, `references/catalog.md`, `references/foundations/router-pseudocode.md`, `SKILL.md`, and `style-guide.md`.
2. `git revert` the phase's commit range over those paths.
3. Re-run 003's `--default` byte-diff over the four templates to confirm they are unaffected.
4. Notify the operator and the 005 phase owner, since 005 depends on this phase's corpus being green.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — no database, no persisted state beyond the git-tracked files themselves.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐     ┌───────────────────────┐     ┌────────────────────┐
│ Applicator extension  │────►│  Repaint + promote     │────►│  Census re-verify  │
│ (T001-T003)           │     │  (T005-T006)           │     │  (T007-T008)       │
└──────────────────────┘     └───────────┬────────────┘     └─────────┬──────────┘
                                          │                            │
                                          ▼                            ▼
                              ┌────────────────────┐       ┌───────────────────────┐
                              │  Catalog + router   │       │  Capture re-shoot     │
                              │  relocation (T012-  │       │  + read (T009-T010)   │
                              │  T017)              │       └───────────┬───────────┘
                              └──────────┬──────────┘                   │
                                         │                              │
                                         ▼                              ▼
                              ┌────────────────────────────────────────────┐
                              │  Doc drift check + dress run (T018-T019)    │
                              └──────────────────────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Applicator extension | 003's gate passed | Examples-covering applicator | Repaint, promotion |
| Repaint + promote | Applicator extension | 34 repainted examples | Census re-verify, capture re-shoot |
| Catalog build | Repaint complete | `references/catalog.md` | SKILL.md pointer swap |
| Capture re-shoot | Repaint complete | 39 PNGs | Dress run |
| Dress run | Catalog, captures, 005 shipped | `RESULT: PASSED` evidence | 005's own first run |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Applicator extension (T001-T003)** - 2-3 hours - CRITICAL
2. **Repaint + promote (T004-T008)** - 3-5 hours - CRITICAL
3. **Capture re-shoot + read (T009-T010)** - 1-2 hours - CRITICAL
4. **Catalog build (T011-T014)** - 2-3 hours - CRITICAL
5. **Dress run (T019)** - <1 hour once 005 exists - CRITICAL

**Total Critical Path**: ~9-14 hours (excluding the wait on 005's own build time)

**Parallel Opportunities**:
- The templates' confirming re-run (T003) runs alongside the applicator extension's verification
- The router-pseudocode relocation (T016) runs alongside the catalog build (T012-T014)
- The feature-catalog/manual-testing-playbook drift check (T018) runs alongside the dress-run wait
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Applicator covers the corpus | Extension re-verified against 003's own byte-diff gate | After T003 |
| M2 | Corpus repainted | Census reproduces 1,577/25; every promotion diff-read | After T008 |
| M3 | Documentation rebuilt | Catalog and router reference both live; `SKILL.md` pointers in place | After T017 |
| M4 | Gate met | Dress run passes; successor gate satisfied | After T019 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Normalize the catalog's ceiling column rather than extract a common phrase

**Status**: Accepted

**Context**: 7 of 27 type files state a ceiling, each in different words (`Above N`, a `Cap`, a
`Budget (hard)`, a bare `Max N`); the other 20 state no ceiling at all. A catalog column that
extracts one shared phrase across the 7 would erase a real difference between, say, a hard cap and
a soft budget, and a column that copies each file's full sentence verbatim would break the
table's own scannability.

**Decision**: The ceiling column holds each row's own numeric threshold in one consistent tabular
shape (a number plus the row's own qualifier word, e.g. "12 (hard)" vs. "20 (cap)"), sourced from
that file's own prose, never rewritten into a shared template sentence. Rows for the 20 files with
no ceiling phrasing carry an explicit "No stated ceiling" value, not a blank cell.

**Consequences**:
- A reader scanning the column sees a real number for every type that has one, and an honest
  absence for the rest — no fabricated ceiling and no silently blank cell.
- The 7 type files' own prose stays untouched; the catalog is a view over them, not a rewrite.
- A future ceiling added to one of the 20 files requires a catalog row update, tracked the same way
  any other row-file drift is tracked by the bidirectional check.

**Alternatives Rejected**:
- Force all 7 into one shared phrase ("Ceiling: N") — rejected; the fact base explicitly warns
  against extracting a common phrasing where the underlying concepts differ (a hard cap is not a
  soft budget).
- Leave the ceiling column blank for the 20 files without a stated ceiling — rejected; a blank cell
  reads as an oversight, not a decision, in a table meant to be trusted at a glance.

---

### ADR-002: Descope sketchy rather than manufacture a proof example

**Status**: Accepted

**Context**: The corpus has 34 examples and none exercises the sketchy primitive
(`references/primitives/primitive-sketchy.md`). Parent D9 already calls for descoping sketchy "with
a stated reason" rather than re-deriving or proving it. Building a 35th example only to demonstrate
one primitive would also grow the corpus past the taxonomy this phase is trying to close
(27 + 5 + 2 + 0 = 34), turning "0 decoration" into a false count.

**Decision**: The catalog records sketchy as descoped, with the stated reason ("unproven — no
example exercises it; descoped rather than proven for this packet") rather than adding a decoration
example whose only job would be to exercise one primitive.

**Consequences**:
- The taxonomy stays exactly 27 + 5 + 2 + 0 = 34, matching the fact base's verified count.
- `primitive-sketchy.md` remains a real, documented primitive — it is descoped from proof in the
  corpus, not deleted from the skill.
- A future phase that wants sketchy proven has a clean, stated starting point rather than a silent
  gap to rediscover.

**Alternatives Rejected**:
- Add a 35th "decoration" example whose only purpose is demonstrating sketchy — rejected; it would
  falsify the "0 decoration" count this phase is verifying and adds an example with no type-selection
  purpose.
- Retrofit sketchy into an existing example (e.g. one connector drawn sketchy) — rejected; the
  applicator's repaint pass is scoped to color tokens, not to primitive usage, and mixing the two
  changes inside one promotion makes the diff harder to read honestly (REQ-003).

---

### ADR-003: Treat feature-catalog/ and manual-testing-playbook/ as independent documents, not an extraction target

**Status**: Accepted

**Context**: `feature-catalog/feature-catalog.md` and `manual-testing-playbook/manual-testing-playbook.md`
were never diffed against `SKILL.md` before this packet. Both are standard `sk-doc` artifact
types (`/create:feature-catalog`, `/create:manual-testing-playbook`) with their own template
contracts, not a generated mirror of `SKILL.md`'s own content — unlike, say, a build output. Neither
F4.4 (the selection-guide move) nor F4.5 (the pseudocode move) names either directory as a
destination.

**Decision**: `feature-catalog/` and `manual-testing-playbook/` are independent document families
that this phase diffs against the post-repaint skill state for drift (T018), not an extraction
target for either `SKILL.md` section this phase relocates.

**Consequences**:
- The catalog move (F4.4) and the pseudocode relocation (F4.5) both stay scoped to `references/`,
  with no dependency on either directory's own structure.
- T018's diff is the first time either directory is checked against the current skill state; any
  drift it finds (stale screenshot counts, an outdated catalog reference) is fixed in the same
  task rather than left for a later phase to rediscover.
- Their version-field entries (two of the five loci) remain untouched by this decision — that
  collapse is still `002-skin-contract/tasks.md` T010's job.

**Alternatives Rejected**:
- Fold `SKILL.md`'s selection-guide table into `feature-catalog.md` instead of a new
  `references/catalog.md` — rejected; the catalog needs machine columns and a bidirectional sentinel
  check the `feature-catalog` template contract does not define, and D12's chart-pattern mirror
  points at `references/catalog.md`, not a feature-catalog file.
- Leave the question open for 005 or 006 to answer — rejected; the phase brief requires this phase
  to settle it, since the two directories' version fields are two of the five loci this phase's
  spec must name for traceability.

---
