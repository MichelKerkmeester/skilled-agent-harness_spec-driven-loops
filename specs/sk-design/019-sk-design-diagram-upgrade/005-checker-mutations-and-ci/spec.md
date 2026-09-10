---
title: "Feature Specification: Phase 5: checker-mutations-and-ci"
description: "The diagram corpus checker, its mutation suite with the four refusals and the completeness triple, and a blocking CI gate."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 5: checker-mutations-and-ci

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 5 gives the diagram skill its first automated corpus gate: `check-diagram-corpus.cjs`
registers ten named assertion families over the corpus 004 repaints and hands over green, a
`scripts/tests/corpus-mutations.test.cjs` proves each family fails for its own stated reason
through the chart's four refusals and completeness triple, and `.github/workflows/diagram-corpus.yml`
blocks on both — a workflow that does not exist today, built from nothing rather than copied from
the chart's own `chart-corpus.yml`. The checker replaces a manual taste checklist that is the only
gate this corpus has ever had.

**Key Decisions**: the checker ships only after 004's repaint lands, and the first `RESULT: PASSED`
run against that repainted corpus counts as both 004's own dress-run gate and this phase's
precondition that every family holds (D4); every family, refusal and CI step is ported by reading
the chart's shape, never by importing or editing a chart-skill file (D12).

**Critical Dependencies**: 004's repainted, captured and catalogued corpus must exist and pass its
own census/capture/catalog checks before any family here can be authored against real data; 002's
signed derivation record and marker/node/font decisions are what several families assert rather
than decide; 003's `apply-diagram-tokens.cjs` and ported `color-gates.cjs` are what the
derivation-gates family re-derives through.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-10 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 6 |
| **Predecessor** | 004-corpus-and-catalog |
| **Successor** | 006-capture-and-judgment |
| **Handoff Criteria** | Every registered family has a case or a reasoned exemption; every mutant fails its named family; CI green with no backlog. Verified by: the suite's own completeness tests; the workflow run; `check-diagram-corpus` printing `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the upgrade sk-design-diagram with the sk-design-chart contract, adapted to diagrams specification.

**Scope Boundary**: the checker itself and its ten named families, the family-registry
discoverability mechanism, the judged-boundary registration, the mutation suite with the four
refusals and the completeness triple, and the CI workflow — nothing that repaints a pixel or
builds the catalog's content (004's job), nothing that signs a new contract decision (002's job),
and nothing that designs the permanent capture-review discipline or judges what this checker
cannot hold (006's job).

**Dependencies**:
- 004's repainted, re-captured, catalogued corpus — the census, capture count and sentinel-wrapped
  `references/catalog.md` must exist and read clean before a family here can be authored against
  real data, not a stand-in.
- 002's `findings-ledger.md` — the signed derivation record, marker/id scope, node-tagging
  convention, and font-allowlist decision every corresponding family asserts rather than decides.
- 003's `apply-diagram-tokens.cjs` and ported `color-gates.cjs` (`channel`, `luminance`,
  `contrast`, `round2`) — the module the derivation-gates family re-derives through.
- `sk-design-chart/scripts/check-corpus.cjs`, `scripts/tests/corpus-mutations.test.cjs`,
  `scripts/tests/apply-design-md.test.cjs`, and `.github/workflows/chart-corpus.yml` — read-only
  pattern source for the checker's shape, the mutation harness's four refusals and completeness
  triple, and the CI job's two-step structure.

**Deliverables**:
- `.opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs`, the diagram
  skill's first HTML/SVG checker.
- `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/corpus-mutations.test.cjs` plus a
  `fixtures/` directory, mirroring the chart's mutation harness shape.
- `.github/workflows/diagram-corpus.yml`, the diagram corpus's first CI gate.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`check-diagram-corpus.cjs` with the families phase 002 contracted: accessibility and metadata, no-external with a one-entry allowlist as net-new work (no documented exception precedent exists to port), the 4px grid per the signed exemption list, orthogonal connectors with the type allowlist, marker trio and unique ids at the decided scope, gates against sentinel blocks across three grounds, the derivation re-derivation, the catalog in both directions. The mutation suite: anchor, base-clean and named-family refusals; the completeness triple with reasoned exemptions and the reason-rot test. `.github/workflows/diagram-corpus.yml` grepping the literal `RESULT: PASSED`.

### Purpose
**Gate this phase ends on:** Every registered family has a case or a reasoned exemption; every mutant fails its named family with its expected message; CI green with no backlog.

Named by phase 1's synthesis (`../001-upgrade-research/research/research.md`); the order is forced by the standard's own doctrines and is not a preference.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `check-diagram-corpus.cjs`'s skeleton: a family registry, per-family tally counters, and a
  final `RESULT: PASSED`/`RESULT: FAILED` line the CI greps (F1.1).
- A registry-driven family-count mechanism, so the diagram's own family count is read from the
  registry's key count rather than hand-documented — the drift the chart's 42-vs-47 count already
  shows (F1.2).
- Ten named assertion families: `metadata`, `accessible-svg`, `no-external`, `grid-4px`,
  `orthogonal-connectors`, `marker-vocabulary`, `unique-ids`, `node-budget`, `derivation-gates`,
  `catalog-bidirectional`.
- The judged-boundary registration: a plain-English list, at the top of the checker, of what it
  does not statically hold, plus the one-way graduation rule (F1.10).
- `scripts/tests/corpus-mutations.test.cjs` and its `fixtures/`: the whole-corpus precondition, the
  four refusals, one case per registered family, and the completeness triple.
- `.github/workflows/diagram-corpus.yml`, built from nothing, with a corpus-check step that greps
  the literal `RESULT: PASSED` and a mutation-and-tests step, mirroring `chart-corpus.yml`'s
  two-step shape without touching it.

### Out of Scope
- Building `apply-diagram-tokens.cjs`, `color-gates.cjs`, or the `DIAGRAM_PALETTE` sentinel
  contract — 003's job; this phase reads and re-derives through them, it does not build them.
- Repainting a pixel, re-shooting a capture, or authoring `references/catalog.md`'s content — 004's
  job; this phase asserts the corpus 004 hands over, it does not produce it.
- Signing any new contract decision (skin values, gate thresholds, marker vocabulary, font
  allowlist, node-tagging convention) — 002's job; every family here asserts a decision 002 already
  signed.
- Designing the permanent capture-review discipline or building the judged checklist itself — 006's
  job; this phase only registers the boundary and the one-way graduation door.
- Any change to `sk-design-chart`'s own files — D12 is a hard block; the harness pattern is read,
  not imported or edited.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` | Create | The corpus checker: ten families, the registry, the judged-boundary block, the `RESULT:` line |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/corpus-mutations.test.cjs` | Create | The mutation suite: whole-corpus precondition, four refusals, one case per family, completeness triple |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/fixtures/` | Create | Per-family mutation fixtures, mirroring the chart's `fixtures/` directory |
| `.github/workflows/diagram-corpus.yml` | Create | The corpus's first CI gate; sits outside the skill tree, mirroring `chart-corpus.yml`'s two-step shape |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `check-diagram-corpus.cjs` MUST register a named family for every assertion group, tally each family's pass/fail count, and print a final `RESULT: PASSED` or `RESULT: FAILED` line the CI greps literally (F1.1; D4). |
| REQ-002 | The family count MUST be read from the registry's own key count, never hand-documented, so the diagram's family count cannot drift the way the chart's documented-42-vs-actual-47 count already has (F1.2). |
| REQ-003 | The `accessible-svg` family MUST assert against a flattened source view — inter-tag whitespace and newlines stripped before matching — and MUST scope title-first to the first `<svg role="img">` element, not the first `<svg>` element, so `example-high-level.html`'s 13 `<svg>` elements (1 accessible frame plus 12 `aria-hidden` icon glyphs) do not misfire the family (F1.3; S1.1). |
| REQ-004 | The `marker-vocabulary` family MUST assert D6's "define only what you draw, per file" scope over the repainted corpus, and the `unique-ids` family MUST assert D6's per-file id-uniqueness scope, closing the `dots` id collision (F1.7; D6). |
| REQ-005 | The `node-budget` family MUST count `data-diagram-node`-tagged elements, never raw `<rect>` elements, removing the ambiguity D7 exists to resolve (F1.8; D7). |
| REQ-006 | The `no-external` family MUST assert a one-entry `fonts.googleapis.com` allowlist as net-new work — `check-corpus.cjs:934-938` is a comment-stripping rationale, not an exception precedent to port — and MUST encode 002 T006's `assets/icons.html` scope (in-corpus for the allowlist, outside the counted 34-example/4-template sets) rather than re-deciding it (F1.4, F3.1; D2). |
| REQ-007 | The `derivation-gates` family MUST re-derive each ground's contrast from the `DIAGRAM_PALETTE` sentinel through 003's ported `channel`/`luminance`/`contrast`/`round2` module, never compare the record against itself, and MUST treat the accent's 2.863:1 as a recorded departure that does not fail the family (D8, D9). |
| REQ-008 | The `catalog-bidirectional` family MUST assert `references/catalog.md` carries no row without a matching `assets/examples/` file and no file without a row, header-name matched the same way `check-corpus.cjs` already verifies (F4.1, F4.4; D12). |
| REQ-009 | The `orthogonal-connectors` family MUST assert with a type-aware allowlist that excludes a radar's by-design diagonal spokes and an `aria-hidden` nested icon's diagonal stroke from the connector-layer check (F1.6). |
| REQ-010 | The `grid-4px` family MUST assert against D5's signed exemption list (font sizes, derived label offsets), confirming the corrected violation set at `example-flowchart.html:90-112` is clean post-repaint (F1.5; D5). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-011 | The checker MUST register the judged boundary — pairwise connector geometry until a 2D pass exists, focal balance, type fit, the remove test, taste — in plain prose it does not assert as a family, with a one-way graduation rule: a judged item that becomes computable moves into a named family and leaves the list, never the reverse (F1.10). |
| REQ-012 | The `metadata` family MUST guard, as a regression check, that the five version loci 002 T010 already collapsed stay collapsed to `SKILL.md`'s single surviving field (F4.3 regression). |
| REQ-013 | `scripts/tests/corpus-mutations.test.cjs` MUST assert the whole-corpus precondition — the checker prints `RESULT: PASSED` before any mutation case runs — since every case assumes a green starting point. |
| REQ-014 | The mutation suite MUST implement the four refusals as reusable guards: the mutation's anchor is not present in the original; the mutation changed nothing; the base already fails the named family; the failure came from a family other than the one named. |
| REQ-015 | The mutation suite MUST carry one case per registered family, each breaking one thing and asserting exactly one named family fires with its expected message, and MUST implement the completeness triple: every registered family has a case or a stated reason it cannot; nothing here names a family the checker does not register; no exemption outlives the family it excuses. |
| REQ-016 | `.github/workflows/diagram-corpus.yml` MUST be built from nothing — it does not exist today — with a corpus-check step piping to a log and grepping the literal `RESULT: PASSED`, and a second step running the mutation suite, mirroring `chart-corpus.yml`'s two-step shape without touching a single chart-skill file (D4, D12). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` prints `RESULT: PASSED` against the repainted corpus.
- **SC-002**: `node --test .opencode/skills/sk-design/sk-design-diagram/scripts/tests/` exits `0`, and its completeness-triple case reports no family without a case.
- **SC-003**: The `accessible-svg` family's own output confirms `example-high-level.html` and its 13 `<svg>` elements pass without a false negative.
- **SC-004**: `grep -c "DIAGRAM_CATALOG:BEGIN" references/catalog.md` reports `1`, and the `catalog-bidirectional` family's own output reports zero dangling rows and zero orphaned files.
- **SC-005**: A CI run of `.github/workflows/diagram-corpus.yml` on this branch is green, with both its corpus-check and mutation-suite steps passing.
- **SC-006**: `git diff` over `sk-design-chart/` is empty for this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 004's repainted, captured, catalogued corpus | Without it, every family is authored against a moving or red target and proves nothing (D4) | T001 reads the corpus state directly on disk before any family is written |
| Dependency | 002's signed derivation record and marker/node/font decisions | Without them, a family would have to invent a scope 002 owns signing | Every family cites the exact 002 task that signed its scope; none re-opens it |
| Dependency | 003's `color-gates.cjs` and `apply-diagram-tokens.cjs` | Without them, the derivation-gates family has no ground truth to re-derive against | T002-T003 confirm both exist and read their exports before the family is built |
| Risk | A family is built loosely enough to pass for a reason other than its stated one — the chart's own confessed failure mode (21 hollow assertions found by two reviews) | Undermines the entire point of the checker | The mutation suite's one-case-per-family requirement (REQ-015) is the direct countermeasure |
| Risk | The CI workflow lands before the corpus or the mutation suite is actually green | Ships a red gate with a backlog nobody triages | REQ-016 sequences the workflow last in `tasks.md`, after both are confirmed green |
| Risk | The `accessible-svg` family is built against line-oriented text instead of a flattened view | False-negatives `example-loop-terminal.html` exactly as the un-corrected brief did | REQ-003 makes the flattened-source requirement explicit, not an implementation detail left to chance |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target applies. The checker and mutation suite run locally
  against 34 example files, 4 templates, and one catalog file; the only timing concern is
  `node --test`'s own default runner behavior, which this phase does not tune further.

### Security
- **NFR-S01**: No auth surface. The checker and mutation suite read only local paths; the
  `no-external` family's own job is confirming nothing else fetches a remote resource beyond the
  already-allowlisted Google Fonts link.

### Reliability
- **NFR-R01**: No uptime target applies. Determinism target: given the same repainted corpus, two
  runs of `check-diagram-corpus.cjs` produce byte-identical output — no family may depend on
  filesystem read order or wall-clock time.

---

## 8. EDGE CASES

### Data Boundaries
- A family whose regex is satisfied by its own definition string rather than the corpus content it
  is meant to check — one of the chart's own twenty-one hollow assertions; the mutation suite's
  one-case-per-family requirement is the guard against authoring a repeat here.
- A family that reads a comment as code — the same failure class the chart's mutation suite already
  caught four times; each family's fixture must break real markup, not a comment describing it.
- A record compared against itself instead of re-derived from source — REQ-007 names this
  explicitly for the derivation-gates family, since it is the exact failure the chart's own review
  found once already.
- A mutation whose base corpus was already failing before the mutation was applied — the third
  refusal (REQ-014) exists specifically to catch this; a case built against a red base proves
  nothing about the mutation.
- A file scoped in by one family and out by another — `assets/icons.html` is the live example: the
  `no-external` family scopes it in for the allowlist check, while the corpus-count families (the
  34-example/4-template sets) scope it out; REQ-006 states both directions explicitly rather than
  leaving one implicit.

### Error Scenarios
- An exemption that outlives the family it excused — the completeness triple's third leg (REQ-015)
  fails the suite closed if a browser or type exemption survives after its owning family is
  removed or renamed, rather than silently going stale.
- The radar's by-design diagonal spokes (`example-radar.html:81-85`) or the `aria-hidden` nested
  icon's diagonal stroke (`example-high-level.html:264-265`) misfiring the `orthogonal-connectors`
  family — REQ-009's type-aware allowlist is the direct guard; a case in the mutation suite proves
  a real connector-layer diagonal still fails while these two do not.
- The anchor a mutation patch targets is not present in the original file — the first refusal
  (REQ-014) fails the case closed rather than silently no-opping.

### State Transitions
- The 004-dress-run circularity: 004's own closing task needs this checker to exist before it can
  run; this checker needs 004's corpus to be green before its families can be authored honestly.
  `tasks.md` resolves the ordering explicitly (T001, T017) rather than leaving it implicit.
- A family added after the CI workflow already ships: the completeness triple (REQ-015) is the
  standing guard that catches a family with no case, so this state never ships silently.

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | One checker file with ten named families, one mutation suite plus a fixtures directory, one new CI workflow outside the skill tree — fewer files than 004's repaint, but each family is its own logic surface |
| Risk | 16/25 | No auth, no API, no production data — but this is the enforcement layer every future diagram request and every future PR touching the corpus will be judged against; a hollow family ships a gate that lies |
| Research | 14/20 | Reads the chart's 3,508-line checker, 561-line mutation suite, and its CI workflow as the read-only pattern source; re-verifies every fact-base number against the live diagram skill and the chart harness before authoring |
| Multi-Agent | 8/15 | Predominantly one executor role (GLM mechanical build); human review is reserved for the local test run and the CI read, not for any contract decision, since 002 already signed those |
| Coordination | 12/15 | Blocks 006 entirely (the judged boundary this phase registers is what 006 inherits); depends on 004's repaint landing first and on 002/003's signed decisions and shipped modules |
| **Total** | **70/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A family is authored against a corpus 004 has not actually finished repainting | H | M | T001 reads the corpus state directly on disk (census, catalog sentinel, capture count) before any family is written |
| R-002 | A family passes for a reason other than the one its message gives — the chart's own confessed twenty-one-instance failure mode | H | M | REQ-015's one-case-per-family requirement is the direct countermeasure; the mutation suite is the phase's real proof surface |
| R-003 | The CI workflow ships before the corpus or the suite is green, creating an untriaged backlog | M | L | REQ-016 sequences the workflow last, after both are confirmed green locally |
| R-004 | The `accessible-svg` or `orthogonal-connectors` family misfires on the corpus's two named edge files (`example-high-level.html`'s 13 `<svg>`s, `example-radar.html`'s diagonal spokes) | M | M | REQ-003 and REQ-009 name both files explicitly; each has a dedicated mutation case |

---

## 11. USER STORIES

### US-001: 006 inherits an enforcement layer, not a manual checklist (Priority: P0)

**As** 006's permanent capture-review discipline, **I want** every statically-holdable rule already
enforced by a named family before I start, **so that** my own judged checklist only carries what
genuinely cannot be checked by a script — pairwise geometry, focal balance, type fit, the remove
test, taste — rather than re-litigating what this phase already automated.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001 through AC-010).

---

### US-002: A future contributor's bad diagram fails loud, in CI, before merge (Priority: P0)

**As** a future contributor editing the diagram corpus, **I want** a red PR check the moment my
change breaks a named family, **so that** I find out before a reviewer has to notice it by eye.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-014 through AC-017).

---

## 12. OPEN QUESTIONS

- Whether the ten named families should ship as ten separate functions or fewer functions each
  covering multiple related tallies (mirroring the chart's own uneven family-to-function ratio,
  75 tally sites over 47 names) — left to whichever task scaffolds the registry, since either
  shape satisfies REQ-001/REQ-002's discoverability requirement.
- Whether the judged-boundary registration (REQ-011) should also carry a machine-readable list for
  006 to parse, or stay prose-only until 006 defines its own checklist format — left to 006 to
  decide against its own actual needs, since this phase's own gate only requires the boundary to be
  named, not machine-consumed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md`'s `L3: ARCHITECTURE DECISION RECORD` section — this packet carries no separate `decision-record.md` file

---
