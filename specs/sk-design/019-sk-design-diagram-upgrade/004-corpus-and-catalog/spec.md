---
title: "Feature Specification: Phase 4: corpus-and-catalog"
description: "The derivation-driven repaint of every example, fresh captures, and a question-keyed catalog read in both directions."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 4: corpus-and-catalog

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

Phase 4 repaints the 34 examples and four templates through 003's applicator, re-shoots the 39
captures the repaint invalidates, and moves the question-keyed selection guide out of `SKILL.md`
into a sentinel-wrapped `references/catalog.md` verified in both directions. It also relocates
`SKILL.md`'s 12.6%-of-file router pseudocode block and settles whether `feature-catalog/` and
`manual-testing-playbook/` are an extraction target or their own reconciliation job. The phase's own
gate is a dress run of 005's not-yet-built checker against the repainted corpus, so 005 inherits a
corpus that already passes rather than a red one to debug.

**Key Decisions**: the repaint runs through copies only, promoted after a diff is read, never
edited in place (D3); sketchy stays unproven and is descoped with a stated reason instead of a
manufactured proof file (D9).

**Critical Dependencies**: 003's `apply-diagram-tokens.cjs` and its token source must exist and
pass its own `--default` byte-diff gate before this phase can repaint anything; 003's own
Known Limitation #1 records that the script covers only the four templates today; this phase's
first task extends it to the 34 examples before the repaint runs.

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
| **Phase** | 4 of 6 |
| **Predecessor** | 003-applicator-and-sentinels |
| **Successor** | 005-checker-mutations-and-ci |
| **Handoff Criteria** | The repainted corpus passes every family to come. Verified by: a dress run of the phase-5 checker. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the upgrade sk-design-diagram with the sk-design-chart contract, adapted to diagrams specification.

**Scope Boundary**: the repaint of the 34 examples and four templates, the 39-capture re-shoot, the
catalog move, the router-pseudocode relocation, and the feature-catalog/manual-testing-playbook
reconciliation decision — nothing that writes a new checker or CI workflow (005), nothing that
designs the permanent capture-review discipline (006), and no new contract decision (002 signs
those; this phase consumes them).

**Dependencies**:
- 003's `apply-diagram-tokens.cjs`, its token source, and its `DIAGRAM_PALETTE` sentinel contract — must pass 003's own byte-diff gate first.
- 002's signed derivation record (three lists, four kinds, gate table) — the values the applicator paints with.
- `.opencode/skills/sk-design/shared/scripts/render-screenshots.cjs` — the existing shared capture tool this phase re-runs, not rebuilds.
- `sk-design-chart/references/catalog.md` and its `check-corpus.cjs` sentinel-parsing logic — read-only pattern source for the diagram's own catalog.

**Deliverables**:
- The 34 examples and four templates repainted to the signed skin, `example-sequence-oauth-dark.html` left untokenized by name.
- 39 re-shot captures under `screenshots/`.
- `references/catalog.md`, sentinel-wrapped, replacing `SKILL.md`'s "Use Cases — selection guide" table.
- `references/foundations/router-pseudocode.md`, holding the relocated Smart Router Pseudocode block.
- A recorded decision on `feature-catalog/` and `manual-testing-playbook/`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Repaint 1,577 literals and four template roots through the applicator's copies, promoted after
diff verification — the style guide's deferred "v5.1" note discharged. 39 fresh captures. The
sketchy proof or its descope. The selection guide moves from `SKILL.md` to `references/catalog.md`
with machine columns (canonical example, variant lattice, ceilings, imports, skin), hand-verified
in both directions. The one-locus pass takes `SKILL.md` toward the chart's shape.

### Purpose
**Gate this phase ends on:** examples − references = ∅ and stays ∅; 39 PNGs re-captured; the
shipped corpus passes every family to come, proven by a dress run of the phase-5 checker.

Named by phase 1's synthesis (`../001-upgrade-research/research/research.md`); the order is forced by the standard's own doctrines and is not a preference.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extending 003's `apply-diagram-tokens.cjs` with an examples selector (its own Known
  Limitation #1), so the applicator that today covers only the four templates also covers the 34
  examples.
- Running that extended applicator over the 34 examples at each file's implied ground (light for
  the 32 cool-rgba files, terminal for `example-loop-terminal.html`), writing to a scratch copy,
  and promoting into `assets/examples/` only after the diff is read.
- Leaving `example-sequence-oauth-dark.html` untouched by name — its untokenized fixed skin is a
  signed exception, not an oversight.
- Discharging `style-guide.md:52`'s deferred "v5.1" regeneration note once the repaint lands.
- Re-shooting all 39 captures (`node ../shared/scripts/render-screenshots.cjs ./assets
  ./screenshots` plus `--check`) once the repaint changes the pixels.
- Recording the corpus taxonomy (27 canonical + 5 variant + 2 import + 0 decoration = 34) as a
  checkable lattice, and descoping sketchy with a stated reason in the catalog rather than
  fabricating a proof example.
- Building `references/catalog.md`: a `DIAGRAM_CATALOG:BEGIN … :END` sentinel pair around a table
  with canonical example, variant lattice, ceiling, imports, and skin columns, replacing
  `SKILL.md`'s "Use Cases — selection guide" table (`SKILL.md:32-59`) and verified in both
  directions (no row without a file, no file without a row).
- Normalizing the catalog's ceiling column across the 7 of 27 type files that state a ceiling in
  different words (`Above N`, `Cap`, `Budget (hard)`, bare `Max N`), and stating the catalog's
  policy for the other 20 files, which carry no ceiling phrasing at all.
- Relocating `SKILL.md`'s Smart Router Pseudocode block (lines ~181-291, 12.6% of the file's
  37,116 bytes) to `references/foundations/router-pseudocode.md`, leaving a pointer in place.
- Diffing `feature-catalog/feature-catalog.md` and `manual-testing-playbook/manual-testing-playbook.md`
  against the post-repaint skill state and recording whether they are an `SKILL.md`-extraction
  target or an independent document family needing their own reconciliation.

### Out of Scope
- Building `apply-diagram-tokens.cjs` itself or its token source — that is 003's job; this phase
  extends its file coverage, it does not rebuild its gate logic.
- Signing any new contract decision (skin values, gate thresholds, marker vocabulary) — 002's job;
  this phase consumes what 002 signed.
- Writing `check-diagram-corpus.cjs`, its mutation suite, or the CI workflow — 005's job; this
  phase only runs a dress-run invocation of that checker once it exists, as the phase gate.
- Designing the permanent capture-review discipline or the judged checklist — 006's job; this
  phase re-shoots the captures once, it does not build the review process.
- Collapsing the five disagreeing version loci — already `002-skin-contract/tasks.md` T010's job;
  listed in Files to Change below for traceability only.
- Editing any `references/types/*.md` file's own ceiling prose — the catalog normalizes its own
  column presentation, it does not rewrite the 7 files' source wording.
- Any change to `sk-design-chart`'s own files — D12 is a hard block; the catalog pattern is read,
  not imported or edited.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/*.html` (34 files) | Modify | Repainted through the extended applicator's copies, promoted after diff; `example-sequence-oauth-dark.html` excluded by name |
| `.opencode/skills/sk-design/sk-design-diagram/assets/templates/*.html` (4 files) | Modify (confirming re-run) | `--default` re-run to confirm no drift since 003's T007 gate; no expected byte change |
| `.opencode/skills/sk-design/sk-design-diagram/screenshots/examples/*.png` (34 files) | Modify | Re-shot against the repainted sources |
| `.opencode/skills/sk-design/sk-design-diagram/screenshots/templates/*.png` (4 files) | Modify | Re-shot against the confirmed templates |
| `.opencode/skills/sk-design/sk-design-diagram/screenshots/icons.png` | Modify | Re-shot for completeness (`render-screenshots.cjs` walks `assets/icons.html` too) |
| `.opencode/skills/sk-design/sk-design-diagram/references/catalog.md` | Create | Sentinel-wrapped, question-keyed selection guide with machine columns |
| `.opencode/skills/sk-design/sk-design-diagram/references/foundations/router-pseudocode.md` | Create | The relocated Smart Router Pseudocode block |
| `.opencode/skills/sk-design/sk-design-diagram/SKILL.md` | Modify | "Use Cases — selection guide" table replaced by a pointer to `references/catalog.md`; the pseudocode block replaced by a pointer to `router-pseudocode.md` |
| `.opencode/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md` | Modify | `:52`'s deferred "v5.1" note discharged; version field frontmatter untouched |
| `.opencode/skills/sk-design/sk-design-diagram/feature-catalog/feature-catalog.md`, `manual-testing-playbook/manual-testing-playbook.md` | Read (diffed) | Checked for drift against the post-repaint state; edited only if the diff finds stale content |
| Five version loci (`SKILL.md:5`, `style-guide.md:14`, `manual-testing-playbook.md:4`, `README.md:7`, `feature-catalog.md:11`) | Not a consumer this phase | `002-skin-contract/tasks.md` T010 owns the collapse; listed for traceability only |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The applicator MUST be extended to cover the 34 examples (003's own Known Limitation #1) before any example is repainted (F2.6; D3). |
| REQ-002 | Each example MUST be repainted at the ground its own ink treatment already implies — light for the 32 cool-rgba files, terminal for `example-loop-terminal.html` — and `example-sequence-oauth-dark.html` MUST be excluded by name (F2.6; D1). |
| REQ-003 | A repainted file MUST be promoted into `assets/examples/` only after its diff against the pre-repaint version is read; no file is edited in place (F2.6; D3). |
| REQ-004 | The repaint MUST reproduce the census — 1,577 typed hex literals over 25 distinct values across the 34 examples — and MUST discharge `style-guide.md:52`'s deferred "v5.1" note (F2.1, F2.6). |
| REQ-005 | `#ffffff`'s 40-occurrence, 13-file backend/API/step role and `#3d4460`'s single-type role MUST survive the repaint as distinct, named roles, never folded into a chrome or paper substitute (F2.1; D9). |
| REQ-006 | The corpus taxonomy MUST be recorded as a checkable lattice — 27 canonical + 5 variant proofs + 2 import proofs + 0 decoration = 34 — with no reference lacking an example and no example lacking a reference (F4.1). |
| REQ-007 | Sketchy MUST be descoped in the catalog with a stated reason; no example may be manufactured to prove it (F4.1; D9). |
| REQ-008 | All 39 captures (34 examples + 4 templates + `icons.png`) MUST be re-shot against their current sources, since the repaint changes the pixels (F4.2; D4). |
| REQ-009 | `references/catalog.md` MUST replace `SKILL.md`'s "Use Cases — selection guide" table, wrapped in a `DIAGRAM_CATALOG:BEGIN … :END` sentinel pair, with canonical example, variant lattice, ceiling, imports, and skin columns, verified in both directions (F4.4; D12). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | The catalog's ceiling column MUST normalize the 7 of 27 type files with a stated ceiling (in genuinely different words) into one consistent column shape without rewriting the source files, and MUST state its policy for the 20 files with no ceiling phrasing (F4.4). |
| REQ-011 | `SKILL.md`'s Smart Router Pseudocode block MUST move to `references/foundations/router-pseudocode.md`, leaving a pointer, without touching 002's already-collapsed three-statement accessibility contract (F4.5; D12). |
| REQ-012 | The `feature-catalog/` and `manual-testing-playbook/` question MUST be settled: diffed against the post-repaint skill state and recorded as either an `SKILL.md`-extraction target or an independent document family needing its own reconciliation (D12). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -ohE "#[0-9a-fA-F]{6}" assets/examples/*.html | wc -l` reports `1577` after the repaint.
- **SC-002**: `grep -c "DIAGRAM_CATALOG:BEGIN" references/catalog.md` reports `1`, and its row count matches the 27 canonical types with every example accounted for by a row.
- **SC-003**: `ls screenshots/examples/*.png screenshots/templates/*.png screenshots/icons.png | wc -l` reports `39`.
- **SC-004**: `grep -c "Smart Router Pseudocode" SKILL.md` reports `0`; `test -f references/foundations/router-pseudocode.md` passes.
- **SC-005**: A dress run of `check-diagram-corpus.cjs` against the repainted corpus prints `RESULT: PASSED` once 005 ships the script.
- **SC-006**: `git diff` over `sk-design-chart/` is empty for this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 003's `apply-diagram-tokens.cjs` and its byte-diff gate | Without it, there is no working applicator to extend or run | T001 confirms 003's gate passed before this phase's T002 begins |
| Dependency | 002's signed derivation record | Without it, the repaint has no gate table or ground values to paint with | Inherited unchanged; a mid-phase amendment would force a re-run |
| Dependency | `render-screenshots.cjs` (shared, read-only) | A change to the shared capture tool mid-phase could shift capture dimensions | The tool is read-only for this phase; any needed change is out of scope and escalated |
| Risk | The applicator extension (REQ-001) silently changes template output too | Would break 003's already-passed byte-diff gate | Re-run 003's `--default` diff after the extension lands, before repainting any example |
| Risk | A repainted example is promoted without its diff being read | Silently bakes an unintended value into the shipped corpus | REQ-003 makes the diff-read step a hard requirement, not a convenience |
| Risk | The catalog's ceiling normalization erases a genuine per-type difference | Misleads a reader picking a type by budget | REQ-010 requires the column to hold each row's own value, not a forced common phrase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target applies. The repaint and capture pipeline runs locally against 38 static HTML files; the only timing concern is `render-screenshots.cjs`'s own 2500ms settle window and 60000ms per-file timeout, both already tuned by that shared script.

### Security
- **NFR-S01**: No auth surface. The applicator and capture tool both read only local paths; the repaint never fetches a remote resource beyond the already-allowlisted Google Fonts link each file already carries.

### Reliability
- **NFR-R01**: No uptime target applies. Determinism target: given the same token source, the same applicator version, and the same source file, the repaint's diff against a second run is empty — no non-deterministic ordering inside a repainted `:root` block.

---

## 8. EDGE CASES

### Data Boundaries
- `example-sequence-oauth-dark.html`'s untokenized fixed skin: the repaint must skip it by name, not by pattern-matching its current colors, since a future file could coincidentally share its ink values.
- A literal inside a `<title>` element or an HTML comment rather than a paint attribute: the census grep counts it, but the applicator must not attempt to repaint prose or markup text, only `--color-*` custom-property declarations and the paint attributes that consume them.
- An `rgba()` spelling of a value that also appears as hex (for example `template-full.html`'s `--color-rule`/`--color-rule-solid`): both spellings must move together under the repaint, or the census count drifts even though the visual result is correct.
- A type file with no ceiling phrasing at all (20 of 27): the catalog's ceiling column must say something honest for these rows rather than leaving the cell blank with no explanation.

### Error Scenarios
- A catalog row whose example was renamed: the bidirectional check must fail closed (a dangling row, or an example with no row) rather than silently dropping the mismatch.
- A capture whose source changed but whose PNG did not: `render-screenshots.cjs --check` is the safety net; a stale capture caught here blocks the phase gate rather than shipping quietly.
- The extended applicator (REQ-001) encounters an example with two candidate grounds (for example, a file mixing cool and warm ink by accident): the run must fail closed and name the file, not guess a ground.

### State Transitions
- Partial repaint (some examples done, some not) at the point this authoring pass hands off to execution: `tasks.md`'s ordering keeps the applicator extension and its own re-verification ahead of any example promotion, so a partial state never contains a repainted example next to an unverified applicator.
- The phase gate (dress run of 005's checker) cannot run until 005 exists: `tasks.md` sequences that task last and marks it blocked-on-dependency rather than pretending it can run today.

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Files: 34 examples + 4 templates + 39 captures + 2 new reference files + `SKILL.md` + `style-guide.md` + 2 diffed docs; LOC: mostly data (hex swaps), plus one new markdown catalog and one relocated reference |
| Risk | 12/25 | No auth, no API, no breaking runtime change — but the corpus is the shipped exemplar set every future diagram copies from, and a bad promotion ships silently unless the diff is actually read |
| Research | 8/20 | Reads 003's plan and Known Limitations, 002's findings ledger, the chart's `catalog.md` pattern, and re-verifies every fact-base number against the live corpus before authoring |
| Multi-Agent | 6/15 | Two executor roles: GLM (mechanical repaint, captures, catalog build) and human review (the sketchy descope reason, the diff reads before promotion) |
| Coordination | 10/15 | Blocks 005's checker entirely (D4's forced order); depends on 003's applicator and 002's derivation record both landing first |
| **Total** | **54/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The applicator extension (REQ-001) is built against the wrong Known-Limitation shape and silently repaints templates too | H | L | Re-run 003's own `--default` diff immediately after the extension, before touching any example |
| R-002 | A repainted example is promoted without a human reading its diff | H | M | REQ-003 is a hard requirement, checked by CHK items in `tasks.md`, not left to discipline alone |
| R-003 | The catalog's bidirectional check is built loosely enough to pass with a dangling row or an orphaned example | M | M | REQ-006/REQ-009 require the same header-name-matching contract the chart's own checker already enforces |
| R-004 | The captures are re-shot before the repaint actually lands, producing stale PNGs that look fresh | M | L | `tasks.md` orders the capture task strictly after the repaint's promotion tasks |

---

## 11. USER STORIES

### US-001: The checker inherits a corpus that already passes (Priority: P0)

**As** 005's not-yet-built checker, **I want** the corpus repainted, the captures fresh, and the
catalog bidirectionally clean before I ship, **so that** my first real run is a pass, not a debug
session against a red corpus I did not create.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001 through AC-006).

---

### US-002: A future reader picks the right diagram type without hunting through SKILL.md (Priority: P1)

**As** a future contributor choosing a diagram type, **I want** one catalog with canonical
example, variant, ceiling, imports, and skin columns, **so that** I don't have to cross-reference a
27-row prose table against 27 separate type files by hand.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-007, AC-008).

---

## 12. OPEN QUESTIONS

- Whether the extended applicator's examples selector should be a `--forms`/`--all` flag (mirroring
  the chart's own applicator) or a per-file `--skin` argument list — left to whichever task
  actually extends `apply-diagram-tokens.cjs`, since either shape satisfies REQ-001's requirement
  that the four templates and the 34 examples both stay reachable from one script.
- Whether the catalog's "Imports" column should name the two import-proof files directly or state a
  boolean per type — left to the catalog-authoring task, since neither shape changes what the
  bidirectional check verifies.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `plan.md`'s `L3: ARCHITECTURE DECISION RECORD` section — this packet carries no separate `decision-record.md` file

---
