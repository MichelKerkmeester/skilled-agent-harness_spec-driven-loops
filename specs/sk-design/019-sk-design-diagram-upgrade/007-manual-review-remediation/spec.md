---
title: "Feature Specification: Phase 7: manual-review-remediation"
description: "Every one of the 34 per-file findings the manual review raised (F1-F34) is fixed in its shipped file with evidence, or recorded with a reason a reader can check."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: manual-review-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 11 |
| **Predecessor** | 006-capture-and-judgment |
| **Successor** | 008-doctrine-reconciliation |
| **Handoff Criteria** | Every one of F1-F34 is fixed with evidence or recorded with a reason a reader can check; `check-diagram-corpus.cjs` prints `RESULT: PASSED`; `apply-diagram-tokens.cjs --default` and `--default --examples` reproduce every file byte for byte; `node --test scripts/tests/` stays green with `grid-baseline.json` counts never rising; every changed file is re-rendered and viewed. Verified by: `acceptance-criteria.md`'s 37 rows all `Met`, `Waived` or `Superseded`, and `check-diagram-corpus.cjs` printing `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the upgrade sk-design-diagram with the sk-design-chart contract, adapted to diagrams specification.

**Scope Boundary**: F1 through F34 in the manual review, against the files as they stand today at
`.opencode/skills/sk-design/sk-design-diagram/assets/examples/` and `assets/templates/`. No path
moves — 009 merges them later. No systemic-pattern work — the ten patterns S1-S10 belong to 008
and are not planned here. No new checker family — 005 already shipped all ten.

**Dependencies**:
- 006's `manual-review-opus.md` — the 38-file review, its 34 numbered findings and their stated
  fixes are the fact base every task in this phase cites by finding number.
- 005's `check-diagram-corpus.cjs` and its mutation suite (shipped) — the gate every fix must keep
  green; a fix that regresses a family is a fix that failed.
- 002's derivation record and 003's `color-gates.cjs`/`apply-diagram-tokens.cjs` (shipped) — every
  colour a fix touches must resolve to a role those files already declare, never a new hex.

**Deliverables**:
- 31 corpus files (27 examples, 4 templates) with their numbered defect fixed in place.
- `assets/color/diagram-palette.json` and `references/foundations/derivation-record.md` corrected
  for F26, the one finding whose fault sits in a document rather than a drawing.
- `acceptance-criteria.md`'s 37 rows, each `Met`, `Waived` or `Superseded` with cited evidence.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The manual review read all 38 corpus files and rendered each fresh, finding 34 numbered defects
across 31 of them: two P1s that misstate a physical fact a reader trusts on sight (a legend row
invisible outside its own frame; a caption claiming proportional spacing that runs 52-70 px/month
with one month plotted twice), 28 P2s that erase connectors, mismatch legends, fail a recorded
contrast gate, or leave a catalog claim undrawn, and 4 further P3-numbered findings covering stale
comments, dead sentinel tokens, a misdirected leader and an unlabelled axis. None of it is fixed
today; every one of the 34 still reproduces exactly as the review describes it.

### Purpose
Every F1-F34 finding is fixed in its shipped file with evidence a reader can check, or recorded
with a reason, at today's paths, without touching a systemic pattern or moving a file.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fixing all 34 numbered findings (F1-F34) at their cited file and line, using the review's own
  stated fix as the starting point and re-measuring where the review flags that its own candidate
  values do not clear a gate (F23).
- Correcting `assets/color/diagram-palette.json`'s `untokenized` exemption and the sentence in
  `references/foundations/derivation-record.md` §1 that names it (F26).
- Re-rendering and viewing every file this phase edits before its task is marked complete.
- Re-running `check-diagram-corpus.cjs`, `color-gates.cjs`, `apply-diagram-tokens.cjs --default`
  (both flag combinations) and `node --test scripts/tests/` after every lane, so no fix regresses a
  gate this packet already shipped.

### Out of Scope
- The ten systemic patterns S1-S10 - 008's job; a fix here that happens to touch the same file as
  a systemic pattern does not resolve the pattern itself.
- Moving `assets/examples/` or `assets/templates/` into one form-library path - 009's job; every
  fix in this phase lands at the file's current location.
- Building a new checker family, refusal, or CI step - 005's job, already shipped.
- Any DESIGN.md or Style Reference work - 010's job.
- `sk-design-chart` - D12 is a hard block; nothing in this phase touches it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `assets/templates/template-full.html` | Modify | F1: raise the legend/viewBox so the last row renders; F3: the same edit lands the legend outside the boundary its comment already claims; F32: wire the already-declared `--color-link` into the marker and six hard-coded elements |
| `assets/templates/template-dark.html` | Modify | F31: correct two stale "warm" palette comments; F32: declare `--color-link` in the sentinel block and reference it from the arrow-link marker |
| `assets/templates/template-terminal.html` | Modify | F30: move the `h1::before` glyph off `--color-soft` onto `--color-muted` |
| `assets/templates/template.html` | Modify | F32: declare `--color-link` in the sentinel block and reference it from the arrow-link marker |
| `assets/examples/example-timeline.html` | Modify | F2: rescale the five event `cx` values to one px/month figure; align the year tick to the JAN 2026 event |
| `assets/examples/example-er.html` | Modify | F4: lengthen the Tag→ArticleTag line and move its cardinality masks clear of the shaft |
| `assets/examples/example-architecture.html` | Modify | F5: move two overdrawn arrow labels clear of the Astro node; F6: raise the `RESP` mask off its own line |
| `assets/examples/example-gantt.html` | Modify | F7: extend zone 2 to clear the focal bar; F8: add a week-number row under the month headers |
| `assets/examples/example-layers.html` | Modify | F9: add a hairline to all four bands and step the two merged fills apart |
| `assets/examples/example-tree.html` | Modify | F10: restore the 20 px sibling gap between `polish` and `critique` |
| `assets/examples/example-venn.html` | Modify | F11: pull both sublabels clear of their circles' arcs |
| `assets/examples/example-import-mermaid.html` | Modify | F13: move the Postgres node fully inside the CORE SERVICES zone |
| `assets/examples/example-high-level.html` | Modify | F18: move the four source connectors off the container's own border; F19: match the write-back arrowhead's tone to its shaft |
| `assets/examples/example-scatter.html` | Modify | F12: move the x-axis title out of the legend row |
| `assets/examples/example-swimlane.html` | Modify | F14: lengthen the revision connector and match its legend swatch's dash pattern |
| `assets/examples/example-org-chart.html` | Modify | F15: key a real node to the "needs setup" legend entry, or drop the entry and its claim |
| `assets/examples/example-dp-security-matrix.html` | Modify | F17: step the four cell fills apart and lift `.none-text` off `soft` |
| `assets/examples/example-pyramid.html` | Modify | F22: lift the three cadence figures off `soft` |
| `assets/examples/example-data-flow.html` | Modify | F23: fix white-on-mustard/sage chip-text contrast |
| `assets/examples/example-process.html` | Modify | F23: fix white-on-mustard/sage chip-text contrast |
| `assets/examples/example-it-state.html` | Modify | F24: key the unlabelled green survivor node; F25: trim two overlong zone-label masks |
| `assets/examples/example-dp-integration.html` | Modify | F16: relabel the logging connector `AUDIT` and draw its line above the identity bar |
| `assets/examples/example-medallion.html` | Modify | F28: add the missing access-policy field to each tier card, or narrow the catalog row |
| `assets/examples/example-state.html` | Modify | F29: add a guard condition to each transition, or narrow the catalog row |
| `assets/examples/example-sequence-oauth-dark.html` | Modify | F26: no edit to the file itself; its task confirms it now gates as a plain dark-skin example |
| `assets/color/diagram-palette.json` | Modify | F26: delete the `untokenized` entry naming a file that carries no exempt skin |
| `references/foundations/derivation-record.md` | Modify | F26: delete the sentence naming the exemption |
| `assets/examples/example-sequence-oauth-full.html` | Modify | F27: drop one container frame and darken the ALT fragment fill |
| `assets/examples/example-radar.html` | Modify | F20: drop non-focal fills, raise ring opacity, draw rings after fills |
| `assets/examples/example-quadrant-consultant.html` | Modify | F21: resize the focal tint to match the quadrant exactly |
| `assets/examples/example-nested.html` | Modify | F25: trim five overlong zone-label masks; F33: move the annotation leader into its box |
| `assets/examples/example-line.html` | Modify | F34: add a `0` baseline tick; trim gridlines to the last data point |
| `assets/examples/example-bar.html` | Modify | F34: add a `0` baseline tick |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `templates/template-full.html`'s last legend row MUST render fully inside its `viewBox`, and the legend block MUST start where the file's own comment already states (`y="682"`) — the review's own fix resolves F1 and F3 in the same edit (F1; F3). |
| REQ-002 | `examples/example-timeline.html`'s five event markers MUST sit on one uniform px-per-month scale, matching its own "proportional to real elapsed time" caption, and the JAN '26 year tick MUST land at the same x as the JAN 2026 event (F2). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The geometry-and-overdraw lane (F4, F5, F6, F7, F9, F10, F11, F13, F18) MUST render each cited connector visible, each cited label unclipped, each cited band distinguishable from its neighbor, and each cited node fully inside or fully outside the zone it claims. |
| REQ-004 | The legend-fidelity lane (F3, F12, F14, F15) MUST leave every legend row outside the boundary it claims to sit outside of, MUST NOT let an axis title double as a legend entry, MUST match every legend swatch's dash pattern to the element it keys, and MUST key at least one real element per legend entry. |
| REQ-005 | The colour-and-contrast lane (F17, F19, F22, F23, F24, F30) MUST bring every cited text fill to 4.5:1 or better against its background, measured through `scripts/color-gates.cjs` using only a role already declared in that file's skin — no new hex — and MUST make F17's four cell fills visually separable, not merely numerically distinct. |
| REQ-006 | The meaning-versus-catalog lane (F8, F16, F28, F29) MUST make each diagram answer the exact clause its catalog row promises, or MUST narrow the catalog row to what the diagram actually draws. |
| REQ-007 | The skin-and-token-hygiene lane (F26, F31, F32) MUST remove the `untokenized` exemption naming a file that carries no exempt skin, MUST correct stale palette-description comments to match the palette they describe, and MUST declare every template's `link` role inside its sentinel block, referenced by its own markers rather than hard-coded. |
| REQ-008 | The polish lane (F20, F21, F25, F27, F33, F34) MUST correct each cited readability defect — a buried grid, a mismatched tint, an overlong mask, a fragment with no figure/ground, a misdirected leader, an unlabelled baseline — in the file it names. |
| REQ-009 | Every literal a fix under REQ-001 through REQ-008 introduces or changes MUST already be a role value of that file's skin, so `apply-diagram-tokens.cjs --default --out <tmp>` and `--default --examples --out <tmp>` continue to reproduce every corpus file byte for byte after every fix lands. |
| REQ-010 | `check-diagram-corpus.cjs` MUST print `RESULT: PASSED` after all 34 findings are addressed, `node --test scripts/tests/` MUST stay green, and `grid-baseline.json`'s per-file counts MUST fall or hold, never rise. |
| REQ-011 | Every file a task in this phase touches MUST be re-rendered and looked at before that task is marked `[x]` — a fix nobody viewed is a claim, not evidence. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` prints `RESULT: PASSED` against the fully remediated corpus.
- **SC-002**: `node scripts/apply-diagram-tokens.cjs --default --out <tmp>` and `--default --examples --out <tmp>` reproduce every file byte for byte (`diff -rq` empty).
- **SC-003**: `node --test scripts/tests/` exits `0`, and every file's count in `grid-baseline.json` is at or below its pre-remediation snapshot.
- **SC-004**: All 37 rows in `acceptance-criteria.md` (one per finding plus three corpus invariants) read `Met`, `Waived` or `Superseded`.
- **SC-005**: Every one of the 31 touched files has a fresh render that was viewed and cited as evidence before its task closed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 005's checker and mutation suite (shipped) | Without a green post-fix run, no fix here is provably safe against a regression | REQ-010 and SC-001 re-run the whole gate after every lane, not only at the end |
| Dependency | 002's derivation record and 003's `color-gates.cjs`/`apply-diagram-tokens.cjs` (shipped) | Without them, a colour fix has nowhere to resolve to but a guessed hex | REQ-009 and SC-002 make the byte-identical guarantee the enforced regression check |
| Risk | A colour fix clears the cited contrast gate but introduces a hex no skin declares (the corpus's own stated failure mode) | Breaks `apply-diagram-tokens.cjs --default`'s byte-for-byte reproduction, undoing 003's contract | REQ-005 requires the fix resolve to an already-declared role; REQ-009's post-lane diff catches a slip |
| Risk | F1's fix and F3's fix land as two separate edits to the same lines, one undoing the other | Wastes a dispatch and risks a merge conflict inside one file | REQ-001 states the single combined edit explicitly; `tasks.md` sequences F3's task after F1's as a verification, not a second edit |
| Risk | A fix is applied but never re-rendered, so a claimed pass is not actually observed | Ships a "fixed" finding that still reproduces the defect | REQ-011 blocks any task from closing without a fresh, viewed render |
| Risk | DeepSeek V4.1 Flash executes a lane brief against a stale line number, since the corpus has not moved since the review but a prior lane's own edit shifts line numbers within the same file | A later finding in the same file is patched at the wrong line | Same-file findings are sequenced within one lane dispatch and re-confirmed on disk immediately before each edit (D15's "verification is the conductor's, never the executor's") |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target applies. Every fix is a static SVG/CSS attribute
  change; the only timing concern is the shared renderer's own headless-Chrome capture time, which
  this phase does not tune.

### Security
- **NFR-S01**: No auth or API surface. Every file this phase touches is local static markup; the
  `no-external` family (005) already guards the corpus's one allowlisted remote host and is
  unchanged by this phase.

### Reliability
- **NFR-R01**: No uptime target applies. Determinism target: given the same fixed file, two runs of
  `check-diagram-corpus.cjs` and two renders of the shared renderer produce the same result — no
  fix in this phase may depend on wall-clock time or filesystem read order.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A finding whose fix is already satisfied by another finding's fix in the same file (F3 by F1) —
  its task becomes a verification-only check against the already-landed state, not a second edit.
- A colour fix where no existing role clears the text gate on the cited background (F23) — the
  executor darkens an existing role's own value for that use, or steps the background itself,
  rather than inventing a hex; `color-gates.cjs` decides which role clears the gate, not a guess.
- A finding whose fault sits in a supporting document rather than the drawing (F26) — the file
  itself needs no byte changed; the task's check is the checker's post-fix family output, not a
  diff of the HTML.

### Error Scenarios
- A fix that clears its own cited defect but changes a value `derivation-gates` re-derives from the
  sentinel block — REQ-010's post-fix `RESULT: PASSED` run is the catch, re-run after every lane.
- A fix that is applied to the file but never re-rendered — REQ-011 blocks the task from closing on
  that state regardless of how the diff reads.
- A "narrow the catalog row" alternative (F28, F29) chosen instead of drawing the missing field —
  the task's check then includes reading `references/catalog.md`'s row to confirm it no longer
  claims what the diagram does not show.

### State Transitions
- Two findings sharing one file and one line region (F1/F3 in `template-full.html`; F5/F6 in
  `example-architecture.html`; F24/F25 in `example-it-state.html`; F31/F32 in `template-dark.html`)
  — each pair is sequenced within the same lane dispatch so the second edit never overwrites the
  first.
- A fix that would extend past its own finding's stated scope (F32's body text also flags two dead
  tokens in `template-full.html` — `--color-rule-solid`, `--color-accent-tint` — that its own
  "Fix:" line does not name) — left unactioned and logged in `goal.md`, since acting on it would be
  inventing a finding this review did not number.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 31 files touched across 34 findings, but every edit is a small, localized attribute or text change against an already-fully-specified fix; no new file, no architecture change |
| Risk | 12/25 | No auth, no API, no production data — but a careless colour or line edit can silently break the byte-for-byte applicator guarantee 003 already shipped |
| Research | 10/20 | The fact base (006's review) already re-verified every line number and measured every contrast figure; this phase re-confirms them on disk before each edit rather than re-discovering them |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Whether F26 belongs here or to 008's systemic-pattern work, since its underlying shape (a
  document stating a value the corpus does not hold) is exactly what 008's mandate covers —
  resolved: F26 is one of the review's 34 numbered findings, and this phase owns every numbered
  finding; 008 owns the nine *systemic* patterns S1-S10, which are unnumbered by file. No operator
  input needed.
- Whether `template-full.html`'s two other dead sentinel tokens surfaced inside F32's own body text
  (`--color-rule-solid`, `--color-accent-tint`) should be wired this phase — resolved as out of
  scope, since F32's stated "Fix:" line names only `--color-link`; logged in `goal.md` rather than
  actioned, so a later phase can pick it up as a fresh observation rather than inheriting an
  invented finding number.
<!-- /ANCHOR:questions -->

---
