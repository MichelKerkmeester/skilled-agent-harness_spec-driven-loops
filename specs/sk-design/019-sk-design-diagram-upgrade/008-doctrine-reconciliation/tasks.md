---
title: "Tasks: Phase 8: doctrine-reconciliation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 8: doctrine-reconciliation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the parent goal (D16) and the manual review's S1-S9 section in full; confirm each S-item's stated direction against the live files before any fix task below runs (goal.md) — executor: human review
- [ ] T002 Read 007's F4, F6, F14, F17, F22, F26, F31, F32 fixes on disk and confirm each is present in its shipped form; HALT and report rather than proceeding if any is missing, since S2/S3/S8 below build on these instances already being closed (`example-er.html`, `example-architecture.html`, `example-swimlane.html`, `example-dp-security-matrix.html`, `example-pyramid.html`, `templates/*.html`) — executor: human review
- [ ] T003 Run `node scripts/check-diagram-corpus.cjs` and confirm `RESULT: PASSED` with the existing ten families before any fix task below runs, since the parent brief's ordering rule requires a green corpus before either new family is added (scripts/check-diagram-corpus.cjs) — executor: human review
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 [P] S1: widen `style-guide.md` §1's series-palette sentence to "multi-series charts plus typed-chip vocabularies," listing `example-radar.html`/`example-line.html` as the chart users and `example-data-flow.html`, `example-process.html`, `example-dp-integration.html`, `example-it-state.html` as the typed-chip users (REQ-001) (references/foundations/style-guide.md) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T005 [P] S1: rename `example-dp-integration.html`'s `--custom-red`/`--custom-red-fill`/`--custom-red-stroke` and `--custom-blue`/`--custom-blue-fill`/`--custom-blue-stroke` custom properties (and the `.footer-red*`/`.footer-blue*` classes that consume them) to the colour they actually are, changing no hex value (REQ-001) (assets/examples/example-dp-integration.html) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T006 [P] S2: repoint every `<text fill="#7a8399">` element to `fill="#4f5d75"` in `example-architecture.html` (2 instances), `example-import-drawio.html` (10), `example-import-mermaid.html` (8), `example-pyramid.html` (3), `example-sequence.html` (3), `example-sequence-oauth.html` (1), `example-sequence-oauth-full.html` (1), `example-timeline.html` (1) and `template-full.html` (4); leave every stroke, tint and non-text fill using `soft` unchanged (REQ-002) (assets/examples/example-architecture.html, assets/examples/example-import-drawio.html, assets/examples/example-import-mermaid.html, assets/examples/example-pyramid.html, assets/examples/example-sequence.html, assets/examples/example-sequence-oauth.html, assets/examples/example-sequence-oauth-full.html, assets/examples/example-timeline.html, assets/templates/template-full.html) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T007 [P] S2: repoint `example-dp-security-matrix.html`'s `.value.none-text{fill:#7a8399}` CSS rule to `fill:#4f5d75`, confirming F17's separate cell-fill fix (007) is present first (REQ-002) (assets/examples/example-dp-security-matrix.html) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T008 [P] S4: converge the legend entry text (not the "LEGEND" heading) to sentence-case Geist sans in `example-import-drawio.html` ("FOCAL"/"SERVICE"/"STORE"/"CLIENT"), `example-import-mermaid.html` ("FOCAL"/"DECISION"/"STORE"/"INPUT"/"SERVICE"), `example-it-state.html` ("data flow"/"pain-point"/"external"/"bottleneck", splitting `.legend-label` out of the shared mono rule at `:27` into its own sans rule) and `example-org-chart.html` ("front door"/"pod / owner"/"needs setup / gap") (REQ-005) (assets/examples/example-import-drawio.html, assets/examples/example-import-mermaid.html, assets/examples/example-it-state.html, assets/examples/example-org-chart.html) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T009 [P] S5: correct the legend rule's `x1`/`x2` in `example-er.html:178` (entities run to x=980) and `example-high-level.html:281` (identity bar to x=996, chevron banner full-bleed to x=1000) to that drawing's own content bounding box; audit `example-architecture.html:154`, `example-timeline.html:122`, `example-quadrant.html:122` against their own content extent and leave `40`/`960` in place wherever it already matches; in `example-quadrant-consultant.html:130`, reconcile the legend rule's end against the footer rule below it so both hairlines end at the same point (REQ-006) (assets/examples/example-er.html, assets/examples/example-high-level.html, assets/examples/example-architecture.html, assets/examples/example-timeline.html, assets/examples/example-quadrant.html, assets/examples/example-quadrant-consultant.html) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T010 [P] S6: rewrite `style-guide.md` §5's dot-pattern bullet so the pattern is on by default, naming `example-dp-security-matrix.html`, `example-import-drawio.html`, `example-import-mermaid.html`, `example-it-state.html`, `example-medallion.html`, `example-org-chart.html`, `example-quadrant-consultant.html` and `example-venn.html` as the opt-out (REQ-007) (references/foundations/style-guide.md) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T011 [P] S7: correct `derivation-record.md` §2's light `rule-solid` row to `rgba(79,93,117,0.25)`, kind `derived: muted at 0.25`, matching `diagram-palette.json`'s existing entry; correct `style-guide.md`'s token-table `rule-solid` row the same way; remove the `#f7591f` citation from `style-guide.md` §1's illustrative sentence (REQ-008) (references/foundations/derivation-record.md, references/foundations/style-guide.md) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T012 S9: in `template.html` and `template-dark.html`, add CSS classes (e.g. `.sample-node`, `.sample-node-name`) resolving `paper`/`ink`/`muted`/`accent` through `var(--color-*)`, apply them to the two markers and the paper background rect plus one new placeholder node (bracket-style label, matching the corpus's `[diagram-slug]` convention) that gives `ink` a genuine reference inside the `<svg>`; leave `link` for 007's F32 (REQ-010) (assets/templates/template.html, assets/templates/template-dark.html) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T013 S9: in `template-terminal.html`, convert the muted and accent marker fills to CSS classes and add a placeholder focal-node demonstration (accent-tint fill, accent stroke, ink label, soft sublabel) so `ink`, `soft` and `accent-tint` each gain a genuine reference inside the `<svg>`; leave `page`, `bar` and `border` as chrome-only (already correctly var()'d outside the `<svg>`, and absent from the corpus's own clean `example-loop-terminal.html` reference) (REQ-010) (assets/templates/template-terminal.html) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T014 S9: in `template-full.html`, add a CSS class per remaining role (`paper`, `paper-2`, `ink`, `muted`, `soft`, `rule`, `rule-solid`, `accent`, `accent-tint`) and apply each at least once inside the `<svg>` — repoint elements that already carry the role's literal value (e.g. the `rgba(235,108,54,0.08)` accent-tint fills at `:318`/`:334`) through the new class, and give `rule-solid` a genuine divider use where none exists today; leave `link` for 007's F32 (REQ-010) (assets/templates/template-full.html) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T015 S3 (fix half): correct `template-full.html`'s two legend dash-array mismatches (`:353` Auth-flow swatch `4,3`→`5,4` matching `:230`; `:359` Security-group swatch `3,3`→`4,4` matching `:289`); add `marker-end="url(#arrow-accent)"` and `marker-end="url(#arrow)"` to `example-high-level.html`'s two markerless legend lines (`:293`, `:296`); step the three legend swatch fills in `template-full.html` (`:340`/`:343`/`:346`) and `example-architecture.html` (`:163`/`:166`/`:169`) to `0.05`/`0.08`/`0.14` respectively, touching only the legend swatches, not `style-guide.md` §4's node-type-treatment table (REQ-003) (assets/templates/template-full.html, assets/examples/example-high-level.html, assets/examples/example-architecture.html) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T016 Recompute `shasum -a 256` for every template file edited by T012-T015 and update `derivation-record.md` §6's PINS table to the new hashes, so the table never states a hash the file does not carry (REQ-011) (references/foundations/derivation-record.md) — executor: human review
- [ ] T017 Run `node scripts/check-diagram-corpus.cjs`; confirm `RESULT: PASSED` with the existing ten families before either new family below is added, per the parent brief's standing ordering rule (scripts/check-diagram-corpus.cjs) — executor: human review
- [ ] T018 Build `scripts/families/legend-fidelity.cjs`: for a file with a "LEGEND" text marker and at least one dashed swatch after it, assert every legend-region `stroke-dasharray` value equals some pre-legend drawing element's `stroke-dasharray` value in the same file (REQ-004) (scripts/families/legend-fidelity.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T019 S8: confirm 007's F4 (`example-er.html`), F6 (`example-architecture.html`) and F14 (`example-swimlane.html`) fixes are present on disk (already checked at T002); build `scripts/families/short-connector-labels.cjs` asserting a connector under ~60px carries no `class="label-mask"` (or equivalent paper-fill) rect overlapping its bounding box, reusing `orthogonal-connectors.cjs`'s connector-detection heuristic; run it once against the full corpus and fix any further instance it surfaces beyond F4/F6/F14 before proceeding, so the family ships already green (REQ-009) (scripts/families/short-connector-labels.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T020 Narrow `check-diagram-corpus.cjs`'s judged-boundary header comment: the short-connector mask case graduates out of "the visible label gap" example now that T019's family holds it, per the checker's own one-way graduation rule (scripts/check-diagram-corpus.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
- [ ] T021 Add one mutation case each for `legend-fidelity` and `short-connector-labels` to `scripts/tests/mutation-cases.cjs`'s `FILE_CASES`, each breaking one thing and asserting the named family's message (REQ-012) (scripts/tests/mutation-cases.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T022 Run `node scripts/check-diagram-corpus.cjs`; confirm `RESULT: PASSED` with all twelve families, then run `node --test scripts/tests/` and confirm it exits `0` with the completeness triple reporting both new families covered (REQ-013) (scripts/check-diagram-corpus.cjs, scripts/tests/) — executor: human review
- [ ] T023 Run `node scripts/apply-diagram-tokens.cjs --default --out <tmp>` and `--default --examples --out <tmp>`; diff each output against the shipped corpus and confirm byte-for-byte reproduction (REQ-014) (scripts/apply-diagram-tokens.cjs) — executor: human review
- [ ] T024 Grep `style-guide.md` and `derivation-record.md` for each corrected claim (series-palette scope, dot-pattern default, `rule-solid` value, the `#f7591f` citation) and confirm the corpus-wide sweep finds no remaining document stating a value the corpus does not hold; re-render every file this phase edited and view each result before closing (REQ-015) — executor: human review
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-015 present
- [ ] CHK-002 [P0] Technical approach defined in plan.md — Architecture and Affected Surfaces sections present
- [ ] CHK-003 [P1] Dependencies identified and available — 007's F4/F6/F14/F17/F22/F26/F31/F32, the ten existing checker families, and `diagram-palette.json`'s recorded `rule-solid` entry all read and cited
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks — the two new families follow the existing `scripts/families/*.cjs` CommonJS style; no new lint config introduced
- [ ] CHK-011 [P0] No console errors or warnings — the checker still prints `RESULT: PASSED` or `RESULT: FAILED` with a matching exit code after the two families are added
- [ ] CHK-012 [P1] Error handling implemented — a family whose input file has no legend or no connector asserts zero, not an error (T018, T019)
- [ ] CHK-013 [P1] Code follows project patterns — no comment in `legend-fidelity.cjs`, `short-connector-labels.cjs`, or any edited style/markup file embeds a spec path, finding id, or task id (comment-hygiene hard block)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — AC-001 through AC-016 in acceptance-criteria.md
- [ ] CHK-021 [P0] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass)
- [ ] CHK-022 [P1] Edge cases tested — the shared-file overlap (`template-full.html` in S2/S3/S9), the no-legend/no-dashed-swatch case, and the pre-existing-fix dependency check from spec.md §L2 EDGE CASES each map to a task above
- [ ] CHK-023 [P1] Every systemic pattern this node owns (S1-S9) appears in a task line above; S10 is confirmed out of scope in spec.md's Out of Scope section
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each S-item is classed: S1/S2/S4/S5/S6/S7 are `class-of-bug` (a doc or a corpus-wide pattern, not one instance); S3/S8 are `class-of-bug` plus a new `test-isolation` guard (the checker family); S9 is `cross-consumer` (every template that declares a role is a consumer of the wiring convention).
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for each S-item's file set in spec.md's Files to Change table; no S-item's fix is scoped to fewer files than the manual review named.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed: `style-guide.md`/`derivation-record.md` corrections (S1, S6, S7) are cross-checked against `diagram-palette.json`'s already-correct entries so the two documents converge on the JSON, not on each other.
- [ ] CHK-FIX-004 [P0] Not applicable — no path, parser, redaction, or security surface in this phase.
- [ ] CHK-FIX-005 [P1] Matrix axes: nine systemic patterns × (doc-only / fix-and-check / corpus-wide-wiring) = the three task shapes in Phase 2 (T004-T011 doc/markup fixes, T012-T015 plus T018-T021 fix-and-check pairs, T012-T014 wiring).
- [ ] CHK-FIX-006 [P1] Not applicable — no process-wide or global state read by any script this phase touches.
- [ ] CHK-FIX-007 [P1] Evidence will be pinned to this phase's own commit SHA once T001-T024 execute, not to a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets — no script or document this phase touches reads a credential or an environment variable
- [ ] CHK-031 [P0] Input validation implemented — the two new families fail closed (report an error) rather than silently passing a file with malformed markup, matching the ten existing families' own convention
- [ ] CHK-032 [P1] Auth/authz working correctly — not applicable; local tooling and reference documents only, no network or auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized — REQ ids in spec.md match task citations here and AC rows in acceptance-criteria.md
- [ ] CHK-041 [P1] Code comments adequate — the two new families carry plain-prose comments describing their rule, matching the ten existing families' style; no ephemeral id added anywhere (verified by CHK-013)
- [ ] CHK-042 [P2] README updated (if applicable) — not applicable; this phase corrects existing reference-document prose, it does not add a new README
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only — this authoring pass created no temp files
- [ ] CHK-051 [P1] scratch/ cleaned before completion — not applicable; nothing was added to this packet's scratch/ by this authoring pass
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 0/11 |
| P1 Items | 12 | 0/12 |
| P2 Items | 2 | 0/2 |

**Verification Date**: 2026-09-11
<!-- /ANCHOR:summary -->

---
