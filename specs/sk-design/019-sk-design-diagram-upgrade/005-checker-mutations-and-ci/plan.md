---
title: "Implementation Plan: Phase 5: checker-mutations-and-ci"
description: "Build check-diagram-corpus.cjs's ten families, its mutation suite with the four refusals and completeness triple, and the diagram corpus's first CI gate."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: checker-mutations-and-ci

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS (`.cjs`) — matching the chart's own checker and mutation suite exactly, no ESM introduced |
| **Framework** | None; `node --test`, Node's built-in test runner, the same one the chart's mutation suite already uses |
| **Storage** | Flat files only: one checker script, one mutation-suite script, a `fixtures/` directory of small HTML/SVG snippets, one new GitHub Actions workflow file |
| **Testing** | `node --test scripts/tests/` for the mutation suite itself; `node scripts/check-diagram-corpus.cjs` piped and grepped for `RESULT: PASSED` for the corpus check; GitHub Actions for CI |

### Overview
This phase ports the chart's checker-and-mutation-suite shape into the diagram skill by reading
`check-corpus.cjs`, `corpus-mutations.test.cjs` and `chart-corpus.yml`, never by importing or
editing them (D12). `check-diagram-corpus.cjs` registers ten named families over the corpus 004
repaints and hands over green; `scripts/tests/corpus-mutations.test.cjs` proves each family fails
for its own stated reason through the chart's four refusals and completeness triple; and
`.github/workflows/diagram-corpus.yml` — which does not exist today — blocks on both.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 004's repaint, capture re-shoot and catalog build have landed on disk (census, capture count and sentinel-wrapped catalog all read clean)
- [ ] 002's signed derivation record, marker/id scope, node-tagging convention and font-allowlist decision are all read and cited
- [ ] 003's `color-gates.cjs` exports and `apply-diagram-tokens.cjs`'s `DIAGRAM_PALETTE` sentinel contract are confirmed on disk

### Definition of Done
- [ ] All eleven acceptance criteria in `acceptance-criteria.md` are `Met`
- [ ] `node --test scripts/tests/` passes, including the whole-corpus precondition, the four refusals, one case per family, and the completeness triple
- [ ] `.github/workflows/diagram-corpus.yml` runs green on this branch
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-driven checker plus a parallel mutation harness — the same two-file pattern
`sk-design-chart/scripts/check-corpus.cjs` and `scripts/tests/corpus-mutations.test.cjs` already
use, read as a shape to port rather than a module to import (D12).

### Key Components
- **Family registry**: an object keyed by family name, each value holding a tally counter and an
  assert function; `Object.keys(...).length` is the single source of truth for the family count
  (REQ-002), never a hand-written document.
- **Ten named families**: `metadata`, `accessible-svg`, `no-external`, `grid-4px`,
  `orthogonal-connectors`, `marker-vocabulary`, `unique-ids`, `node-budget`, `derivation-gates`,
  `catalog-bidirectional`.
- **Judged-boundary block**: a plain-English list at the top of the checker naming what it does not
  statically hold, with the one-way graduation rule (REQ-011).
- **Mutation harness**: the whole-corpus precondition, the four refusal guards, one case per
  family, and the completeness triple, in `scripts/tests/corpus-mutations.test.cjs`.
- **CI workflow**: `.github/workflows/diagram-corpus.yml`, a two-step job mirroring
  `chart-corpus.yml`'s corpus-check-then-grep, mutation-suite-then-applicator-tests shape.

### Data Flow
`check-diagram-corpus.cjs` reads the corpus (`assets/examples/*.html`, `assets/templates/*.html`,
`references/catalog.md`) and 003's ported gate module, runs each family's assertions, tallies
pass/fail per family, and prints a final `RESULT: PASSED`/`RESULT: FAILED` line. The mutation suite
imports the checker's exported family functions (or shells out to it, mirroring the chart's own
approach), applies one fixture mutation per case, and asserts the named family — and only that
family — reports the expected failure message. The CI workflow runs the checker first, greps its
log for the literal string, then runs `node --test scripts/tests/` as a second step.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

This phase's `research_intent` is enforcement-layer construction, not `fix_bug`. It is filled here
anyway because this checker becomes the gate every future diagram-corpus change is judged against,
and the CI workflow is the corpus's first blocking surface outside the skill tree.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-diagram-corpus.cjs` (new, producer) | Does not exist; the taste gate today is a manual checklist | Create — the corpus's first automated gate | `node check-diagram-corpus.cjs` prints `RESULT: PASSED`/`RESULT: FAILED` |
| `scripts/tests/corpus-mutations.test.cjs` (new, consumer of the checker) | Does not exist | Create — proves each family fires for its stated reason | `node --test scripts/tests/` |
| `.github/workflows/diagram-corpus.yml` (new, consumer of both) | Does not exist; no CI gate has ever existed for this corpus | Create | Workflow run status; `grep -q 'RESULT: PASSED'` in the corpus-check step |
| `assets/examples/*.html`, `assets/templates/*.html` (34+4, read-only input) | 004's repainted corpus, the checker's subject | Unchanged — this phase reads, never repaints | 004's own census grep, read again here as a precondition (T001) |
| `references/catalog.md` (004's deliverable, read-only input) | The bidirectional selection guide 004 builds | Unchanged — this phase asserts it, does not author it | `catalog-bidirectional` family output |
| `scripts/color-gates.cjs`, `scripts/apply-diagram-tokens.cjs` (003's deliverables, read-only input) | The ported four-function contrast module and the applicator | Unchanged — this phase re-derives through them, does not modify them | `derivation-gates` family output |
| `sk-design-chart/scripts/check-corpus.cjs`, `corpus-mutations.test.cjs`, `.github/workflows/chart-corpus.yml` (pattern source) | Read-only porting source | Not a consumer this phase — read for shape only, D12 hard block | `git diff` over `sk-design-chart/` stays empty |
| 006's judged checklist (future consumer) | Does not exist yet | Not a consumer this phase — 005 registers the boundary; 006 builds the process | N/A this phase |

Required inventories:
- Same-class producers: no other script under `assets/` or `scripts/` produces a corpus-wide
  `RESULT:` line today; this checker is the first, so there is no sibling producer to reconcile
  against.
- Consumers of changed symbols: the mutation suite is the only in-repo consumer of the checker's
  exported family functions; the CI workflow is the only consumer of the checker's stdout line and
  the mutation suite's exit code.
- Matrix axes: family (10) × refusal-guard applicability (anchor-present / no-op / base-clean /
  right-family) — the four refusals apply uniformly across all ten families, giving 10 base cases
  plus the shared guard logic, not a 10×4 case matrix.
- Algorithm invariant: no mutation case may run before the checker prints `RESULT: PASSED` against
  an unmutated corpus; the whole-corpus precondition (REQ-013) is the enforced invariant.
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

1. Read `004-corpus-and-catalog/tasks.md` and confirm, by direct grep against the live corpus, that
   its repaint, capture and catalog tasks have actually landed — this phase's families are
   authored against real repainted data, not 004's own checkbox state.
2. Read `002-skin-contract/findings-ledger.md` in full before writing any family whose scope 002
   already signed (marker vocabulary, id uniqueness, node-tagging, font allowlist, 4px exemption
   list, derivation record shape) — no family may re-decide a scope 002 already closed.
3. Read `sk-design-chart/scripts/check-corpus.cjs`'s family-registry and tally-counter shape, and
   `scripts/tests/corpus-mutations.test.cjs`'s four refusals and completeness triple, before
   scaffolding the diagram-side equivalents — port the shape, never the file (D12).
4. Confirm no file under `.opencode/skills/sk-design/sk-design-chart/` or `.github/workflows/chart-corpus.yml` is in this phase's edit set before making any change.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Tasks execute in file order T001→T024; no family may be authored (T006-T016) before the corpus-state precondition (T001) and the pattern-source read (T002-T003) complete; the mutation suite (T018-T021) may not start before the checker prints `RESULT: PASSED` against the real corpus (T017); the CI workflow (T022) may not land before the local `node --test` run (T023) is green |
| TASK-SCOPE | Touch only `scripts/check-diagram-corpus.cjs` (new), `scripts/tests/corpus-mutations.test.cjs` (new), `scripts/tests/fixtures/` (new), and `.github/workflows/diagram-corpus.yml` (new); no `sk-design-chart` file, no `assets/examples/` or `assets/templates/` file, no edit to `references/catalog.md`'s content, no edit to `color-gates.cjs` or `apply-diagram-tokens.cjs` |
| TASK-VERIFY | Each family task names its own check (a grep count, a `node -e` smoke run, or a mutation-case pass) before that task is marked `[x]`; T017's full-corpus run is re-executed after any later family edit |

### Status Reporting Format

`[TASK-ID] [DONE | IN PROGRESS | BLOCKED] — one line of evidence`

### Blocked Task Protocol

1. Mark the task `[B]` in `tasks.md` and stop touching the files it names.
2. State the blocking fact in one sentence: the command run, what it returned, and which
   requirement or decision it contradicts.
3. If the block traces to 004's repaint not actually being complete on disk, or to a 002-signed
   value this phase cannot locate, escalate to the operator rather than guessing a value.
4. Resume only after the block is cleared and the task's own verify check passes.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Family-registry key count, `RESULT:` line presence, judged-boundary block presence | `grep -c`, `node -e` |
| Unit (per-family) | Each of the ten families against a real corpus file and a fixture mutation | `node --test scripts/tests/` |
| Whole-corpus | The checker itself against the full repainted corpus | `node scripts/check-diagram-corpus.cjs` |
| Mutation | The four refusals, one case per family, the completeness triple | `node --test scripts/tests/corpus-mutations.test.cjs` |
| CI | The full two-step gate on a real push | `.github/workflows/diagram-corpus.yml` |
| Manual | The local `node --test` read and the CI run read, checking for a hollow pass rather than trusting a green exit code | Human review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 004's repainted, captured, catalogued corpus | Internal | Yellow — 004 authored, execution pending | Every family would be authored against a corpus that is not actually green; T001 blocks until it is |
| 002's signed derivation record and marker/id/node/font decisions | Internal | Yellow — 002 authored, not yet operator-ratified | Families would have to invent a scope 002 owns signing; T002-T003 block until the ledger is read |
| 003's `color-gates.cjs`, `apply-diagram-tokens.cjs`, `DIAGRAM_PALETTE` sentinel | Internal | Red — do not exist on disk yet (003 authored, not executed) | The `derivation-gates` family has nothing to re-derive through; T002-T003 confirm before T015 begins |
| `sk-design-chart/scripts/check-corpus.cjs`, mutation suite, CI workflow (pattern source, read-only) | Internal | Green — all three exist on disk today, confirmed for this authoring pass | None; already read |
| Node.js runtime, `node --test` | External | Green | None; the same runtime the chart's own suite already requires |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a shipped family is later found to pass for a reason other than its stated one, or
  the CI workflow is found to be green with a real backlog behind it.
- **Procedure**: revert the phase's commits touching `scripts/check-diagram-corpus.cjs`,
  `scripts/tests/corpus-mutations.test.cjs`, `scripts/tests/fixtures/`, and
  `.github/workflows/diagram-corpus.yml`. Nothing is deployed or migrated — a `git revert` of the
  phase's commit range is sufficient; the corpus itself (004's deliverable) is untouched by this
  phase's rollback.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Corpus-state precondition (T001) ──┐
Pattern-source read (T002-T003) ───┼──► Family authoring (T004-T016) ──► Full-corpus run (T017)
                                    │
                                    └──► Mutation harness (T018-T021) ──► CI workflow (T022)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Family authoring |
| Family authoring | Setup | Full-corpus run |
| Mutation harness | Full-corpus run (T017) | CI workflow |
| CI workflow | Local `node --test` green (T023) | 006's own start |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (T001-T003) | Low | 1-2 hours |
| Implementation (T004-T022) | High | 10-16 hours |
| Verification (T023-T024) | Low-Medium | 1-2 hours |
| **Total** | | **12-20 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) — not applicable; every artifact is git-tracked
- [ ] Feature flag configured — not applicable; no runtime feature ships from this phase
- [ ] Monitoring alerts set — not applicable; GitHub Actions' own run history is the monitoring surface

### Rollback Procedure
1. Stop touching `scripts/check-diagram-corpus.cjs`, `scripts/tests/corpus-mutations.test.cjs`, `scripts/tests/fixtures/`, and `.github/workflows/diagram-corpus.yml`.
2. `git revert` the phase's commit range over those paths.
3. Confirm the corpus itself (004's deliverable) is unaffected — this phase's rollback touches no `assets/` or `references/` file.
4. Notify the operator and the 006 phase owner, since 006's judged boundary depends on this phase's registration.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — no database, no persisted state beyond the git-tracked files themselves.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────────┐     ┌──────────────────────┐     ┌────────────────────┐
│ Corpus-state + pattern  │────►│  Family authoring     │────►│  Full-corpus run   │
│ precondition (T001-T003)│     │  (T004-T016)          │     │  (T017)            │
└────────────────────────┘     └───────────┬───────────┘     └─────────┬──────────┘
                                            │                            │
                                            ▼                            ▼
                                ┌────────────────────┐       ┌───────────────────────┐
                                │  Judged boundary    │       │  Mutation harness     │
                                │  (T008)             │       │  (T018-T021)          │
                                └──────────┬──────────┘       └───────────┬───────────┘
                                           │                              │
                                           ▼                              ▼
                                ┌────────────────────────────────────────────┐
                                │  Local verify (T023) + CI workflow (T022,T024)│
                                └────────────────────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Corpus-state + pattern precondition | 004's repaint landed, chart harness read | Confirmed green corpus, ported shape | Family authoring |
| Family authoring | Precondition | Ten named families in `check-diagram-corpus.cjs` | Full-corpus run |
| Full-corpus run | All families authored | First `RESULT: PASSED`, satisfying both 004's dress-run gate and this phase's own precondition | Mutation harness |
| Mutation harness | Full-corpus run green | Four refusals, per-family cases, completeness triple | CI workflow |
| CI workflow | Mutation harness green locally | `.github/workflows/diagram-corpus.yml` | 006's own start |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Corpus-state + pattern-source precondition (T001-T003)** - 1-2 hours - CRITICAL
2. **Family authoring (T004-T016)** - 8-12 hours - CRITICAL
3. **Full-corpus run (T017)** - <1 hour - CRITICAL
4. **Mutation harness (T018-T021)** - 3-5 hours - CRITICAL
5. **CI workflow + verification (T022-T024)** - 1-2 hours - CRITICAL

**Total Critical Path**: ~13-20 hours

**Parallel Opportunities**:
- The pattern-source read (T002) and the 002-ledger read (T003) run alongside each other
- The `unique-ids` family (T010) runs alongside the `marker-vocabulary` family (T009), since both
  read the same repainted corpus independently
- The judged-boundary registration (T008) runs alongside any of the family-authoring tasks, since
  it is documentation, not an assertion
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Preconditions confirmed | 004's corpus reads green on disk; chart harness read; 002 ledger read | After T003 |
| M2 | All ten families built | Checker compiles and runs without a crash against the real corpus | After T016 |
| M3 | Checker proves itself against real data | First `RESULT: PASSED` run — both 004's dress-run gate and this phase's own precondition | After T017 |
| M4 | Mutation suite proves each family honest | Four refusals, ten per-family cases, completeness triple all pass | After T021 |
| M5 | Gate met | CI green with no backlog; successor gate satisfied | After T024 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Flatten the source before asserting accessibility

**Status**: Accepted

**Context**: The accessible-SVG contract genuinely holds 34/34 across the corpus, but a naive
line-oriented grep false-negatives `example-loop-terminal.html`, whose `<svg>` open tag spans lines
172-177 with its `<title>` element landing at line 178 — still the first child element, but not on
the same line a per-line regex would check. A checker built against raw lines would report a false
failure on a file that actually passes.

**Decision**: The `accessible-svg` family reads each corpus file's markup with inter-tag whitespace
and newlines collapsed before running its title-presence and ordering assertions — a flattened
view of the tag structure, not a per-line scan.

**Consequences**:
- The family's result matches the fact base's independently-verified 34/34, not a false 33/34.
- A future multi-line `<svg>` open tag anywhere else in the corpus is handled the same way, rather
  than requiring a per-file carve-out.
- The flattening step must not alter attribute values themselves (only whitespace between tags),
  or a later family reading raw attribute text (for example `no-external`'s href matching) could
  be given the wrong string.

**Alternatives Rejected**:
- Per-line regex with a documented exception for `example-loop-terminal.html` — rejected; this is
  exactly the shape of the original brief's own mistake (naming it as an exception rather than
  fixing the read), and it would not generalize to a future multi-line tag in a different file.
- A full HTML parser (e.g., a DOM library) — rejected as disproportionate; a flattened-text
  transform is enough to fix the one failure mode identified, and adding a parser dependency is
  new infrastructure this phase's scope does not require.

---

### ADR-002: Scope title-first to the first `<svg role="img">`, not the first `<svg>`

**Status**: Accepted

**Context**: `example-high-level.html` carries 13 `<svg>` elements: one accessible frame plus 12
`aria-hidden` nested icon glyphs, and none of the 12 icon glyphs carries its own `<title>`. A
checker that asserts "the first `<svg>` element has a `<title>` child" would pass on files with one
`<svg>` and fail this one file, since its very first `<svg>` in document order could easily be an
icon glyph rather than the accessible frame, depending on markup order.

**Decision**: The `accessible-svg` family scopes its title-presence check to the first
`<svg role="img">` element in the flattened source (ADR-001), not the first `<svg>` element of any
kind. `aria-hidden` icon glyphs are excluded from the title-presence assertion entirely, since
`aria-hidden="true"` already tells assistive technology to skip them.

**Consequences**:
- `example-high-level.html` passes correctly: its accessible frame (carrying `role="img"`) is
  found and checked; its 12 icon glyphs are correctly excluded rather than misfiring the family.
- Every other corpus file, which carries exactly one `<svg>`, is unaffected — `role="img"` is
  already how the corpus marks its one accessible frame per file (F1.3's confirmed 34/34 contract).
- A future file that adds a second `role="img"` `<svg>` without an `aria-hidden` sibling would need
  its own decision — out of scope for this phase, since no such file exists in the corpus today.

**Alternatives Rejected**:
- Assert against every `<svg>` element regardless of `aria-hidden` — rejected; would force every
  icon glyph across the corpus to carry a redundant `<title>`, contradicting the already-passing
  34/34 accessible-SVG contract this phase is meant to guard, not re-litigate.
- Hard-code `example-high-level.html` as a named exception — rejected; the point of scoping by
  `role="img"` is that it generalizes to any future multi-svg file without a per-file carve-out.

---

### ADR-003: Re-derive the derivation record rather than compare it against itself

**Status**: Accepted

**Context**: One of the chart's own confessed twenty-one hollow assertions was a family comparing a
record against itself — an assertion that can never fail, because both sides of the comparison read
the same source. The `derivation-gates` family's job is confirming each ground's contrast values in
the `DIAGRAM_PALETTE` sentinel block are correct, not merely present.

**Decision**: The `derivation-gates` family re-derives each ground's contrast independently — from
the sentinel block's own paint-attribute pairs, through 003's ported `channel`/`luminance`/
`contrast`/`round2` functions — and compares that freshly-computed value against the sentinel's
stated value. It never reads the sentinel's stated value on both sides of a comparison. The
accent's 2.863:1 is treated as a named departure (D8): the family checks that the sentinel's stated
value for the accent matches the recorded 2.863:1 constant, not that the re-derived value clears
AA-4.5, since it is documented not to.

**Consequences**:
- A future edit that silently changes a sentinel's stated contrast value without updating the
  underlying paint attributes (or vice versa) is caught, because the two are computed from
  independent inputs and then compared.
- The accent departure does not turn into a false failure, because the family checks it against
  its recorded constant rather than against the AA-4.5 threshold every other value is held to.
- The family's own test fixture must mutate a paint attribute without updating the sentinel's
  stated value, proving the re-derivation — not a self-comparison — is what actually runs.

**Alternatives Rejected**:
- Trust the sentinel's own stated values without re-deriving — rejected; this is the literal
  self-comparison failure mode the chart's own review already found once.
- Re-derive the accent to AA-4.5 and fail it — rejected; D8 explicitly freezes the accent's
  2.863:1 as a recorded departure, not a value to re-derive into a failure.

---

### ADR-004: Port the harness by reading it, never by importing or editing it

**Status**: Accepted

**Context**: D12 freezes the chart skill as a hard block: nothing changes inside
`sk-design-chart/`, and the diagram skill may not import a chart-skill module at runtime, since
that would create a live coupling between two skills the parent goal explicitly forbids.

**Decision**: `check-diagram-corpus.cjs` and `scripts/tests/corpus-mutations.test.cjs` are written
by reading `check-corpus.cjs`, `corpus-mutations.test.cjs`, `apply-design-md.test.cjs`, and
`chart-corpus.yml` for their shape — the family-registry pattern, the tally-counter convention, the
four refusals, the completeness triple, the two-step CI job — and reproducing that shape with
diagram-specific families and fixtures. No `require()` or `import` statement in any diagram-skill
file points at a `sk-design-chart` path, and no chart-skill file is edited.

**Consequences**:
- `git diff` over `sk-design-chart/` stays empty for the entire phase, satisfying D12 and SC-006.
- The two skills can diverge in family count and detail without either one breaking the other —
  the diagram's ten families do not need to match the chart's forty-seven, and a future chart
  change does not risk a runtime break in the diagram's checker.
- The porting work is genuinely duplicated logic (the four-refusal guards, the tally-counter
  shape) rather than shared, which is the accepted cost of the hard isolation D12 requires.

**Alternatives Rejected**:
- Extract the chart's mutation-harness guards into a shared module both skills import — rejected;
  D12 is a hard block on any chart-skill change, and creating a new shared module would still touch
  `sk-design-chart/` to wire the export, or require moving logic out of it, either of which violates
  the freeze.
- Require the chart's `check-corpus.cjs` directly from the diagram's own script at runtime —
  rejected; a live cross-skill dependency contradicts D12's isolation intent even without editing a
  single chart-skill byte.

---
