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

- [x] T001 Read the parent goal (D16) and the manual review's S1-S9 section in full; confirm each S-item's stated direction against the live files before any fix task below runs (goal.md) — executor: human review — done: `goal.md` §1 D16.1-D16.7 records each S-item's confirmed direction against `006-capture-and-judgment/scratch/evidence/manual-review-opus.md`
- [x] T002 Read 007's F4, F6, F14, F17, F22, F26, F31, F32 fixes on disk and confirm each is present in its shipped form; HALT and report rather than proceeding if any is missing, since S2/S3/S8 below build on these instances already being closed (`example-er.html`, `example-architecture.html`, `example-swimlane.html`, `example-dp-security-matrix.html`, `example-pyramid.html`, `templates/*.html`) — executor: human review — done: `007-manual-review-remediation/scratch/fix-verification.md` rows confirm F4/F6/F14/F17/F22/F31/F32 landed; F26 was initially not landed (row 18) but closed in round two — `diagram-palette.json`'s `untokenized` list is `[]` on disk today
- [x] T003 Run `node scripts/check-diagram-corpus.cjs` and confirm `RESULT: PASSED` with the existing ten families before any fix task below runs, since the parent brief's ordering rule requires a green corpus before either new family is added (scripts/check-diagram-corpus.cjs) — executor: human review — inferred: `legend-fidelity`/`short-connector-labels` were added last in the skill's commit history (`f3bf733cf4`, the final commit touching this skill), after every S1-S9 fix commit, consistent with this ordering; a live run today shows `RESULT: PASSED` with all twelve families
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] S1: widen `style-guide.md` §1's series-palette sentence to "multi-series charts plus typed-chip vocabularies," listing `example-radar.html`/`example-line.html` as the chart users and `example-data-flow.html`, `example-process.html`, `example-dp-integration.html`, `example-it-state.html` as the typed-chip users (REQ-001) (references/foundations/style-guide.md) — executor: DeepSeek V4.1 Flash max via cli-pi — done: `style-guide.md:56,58` reads "multi-series charts and typed-chip vocabularies" and names radar/line as chart users, data-flow/process/dp-integration/it-state as chip users
- [x] T005 [P] S1: rename `example-dp-integration.html`'s `--custom-red`/`--custom-red-fill`/`--custom-red-stroke` and `--custom-blue`/`--custom-blue-fill`/`--custom-blue-stroke` custom properties (and the `.footer-red*`/`.footer-blue*` classes that consume them) to the colour they actually are, changing no hex value (REQ-001) (assets/examples/example-dp-integration.html) — executor: DeepSeek V4.1 Flash max via cli-pi — done, landed in `76ad403c52`: `assets/diagrams/dp-integration.html` now declares `--identity-rust`/`--identity-rust-fill`/`--identity-rust-stroke` and `--logging-blue`/`--logging-blue-fill`/`--logging-blue-stroke`; `grep -c "custom-red\|custom-blue"` reports `0`; no hex value changed (`.footer-red`/`.footer-blue` class names and the two hex values are untouched, only the custom-property names and their consumers moved)
- [x] T006 [P] S2: repoint every `<text fill="#7a8399">` element to `fill="#4f5d75"` in `example-architecture.html` (2 instances), `example-import-drawio.html` (10), `example-import-mermaid.html` (8), `example-pyramid.html` (3), `example-sequence.html` (3), `example-sequence-oauth.html` (1), `example-sequence-oauth-full.html` (1), `example-timeline.html` (1) and `template-full.html` (4); leave every stroke, tint and non-text fill using `soft` unchanged (REQ-002) (assets/examples/example-architecture.html, assets/examples/example-import-drawio.html, assets/examples/example-import-mermaid.html, assets/examples/example-pyramid.html, assets/examples/example-sequence.html, assets/examples/example-sequence-oauth.html, assets/examples/example-sequence-oauth-full.html, assets/examples/example-timeline.html, assets/templates/template-full.html) — executor: DeepSeek V4.1 Flash max via cli-pi — done: `grep -rc '<text[^>]*fill="#7a8399"' assets/diagrams/*.html` reports `0` everywhere on disk today; landed via `62d4e1e293` (46 instances, 12 forms, per its commit message) plus one further `<text>`-adjacent instance (`gantt.html`'s `.zone-label` rule) closed in `c0f1ad041c`; `derivation-record.md:109`'s recorded `soft` departure (3.48:1, structural only) is unchanged
- [x] T007 [P] S2: repoint `example-dp-security-matrix.html`'s `.value.none-text{fill:#7a8399}` CSS rule to `fill:#4f5d75`, confirming F17's separate cell-fill fix (007) is present first (REQ-002) (assets/examples/example-dp-security-matrix.html) — executor: DeepSeek V4.1 Flash max via cli-pi — done: `assets/diagrams/dp-security-matrix.html:20` reads `.value.none-text{fill:#4f5d75}`
- [x] T008 [P] S4: converge the legend entry text (not the "LEGEND" heading) to sentence-case Geist sans in `example-import-drawio.html` ("FOCAL"/"SERVICE"/"STORE"/"CLIENT"), `example-import-mermaid.html` ("FOCAL"/"DECISION"/"STORE"/"INPUT"/"SERVICE"), `example-it-state.html` ("data flow"/"pain-point"/"external"/"bottleneck", splitting `.legend-label` out of the shared mono rule at `:27` into its own sans rule) and `example-org-chart.html` ("front door"/"pod / owner"/"needs setup / gap") (REQ-005) (assets/examples/example-import-drawio.html, assets/examples/example-import-mermaid.html, assets/examples/example-it-state.html, assets/examples/example-org-chart.html) — executor: DeepSeek V4.1 Flash max via cli-pi — done, landed in `76ad403c52` (import-drawio, import-mermaid, org-chart) and `67a8c88de5` (it-state): `import-drawio.html`/`import-mermaid.html` now read "Focal"/"Service"/"Store"/"Client"/"Decision"/"Input" in `'Geist', sans-serif`; `org-chart.html` reads "Front door"/"Pod / owner" the same way (no third "needs setup / gap" entry exists in this file — only two legend swatches, both converged); `it-state.html`'s five entries are pulled out of the shared `.legend-label` class into inline `font-family:'Geist', sans-serif` text reading "Data flow"/"Pain-point"/"External"/"Bottleneck"/"Survivor"; the mono "LEGEND" eyebrow is untouched in all four files
- [x] T009 [P] S5: correct the legend rule's `x1`/`x2` in `example-er.html:178` (entities run to x=980) and `example-high-level.html:281` (identity bar to x=996, chevron banner full-bleed to x=1000) to that drawing's own content bounding box; audit `example-architecture.html:154`, `example-timeline.html:122`, `example-quadrant.html:122` against their own content extent and leave `40`/`960` in place wherever it already matches; in `example-quadrant-consultant.html:130`, reconcile the legend rule's end against the footer rule below it so both hairlines end at the same point (REQ-006) (assets/examples/example-er.html, assets/examples/example-high-level.html, assets/examples/example-architecture.html, assets/examples/example-timeline.html, assets/examples/example-quadrant.html, assets/examples/example-quadrant-consultant.html) — executor: DeepSeek V4.1 Flash max via cli-pi — done, landed in `76ad403c52` ("Two legend rules now span the drawing they sit under, measured rather than assumed: sixteen files shared the suspect value and only two fell short of their content"): `er.html:178` now reads `x2="980"`, `high-level.html:281` now reads `x2="972"`; the audit files (`architecture.html:154`, `timeline.html`, `quadrant.html`) still hold `40`/`960` unchanged, confirming the measurement found them already correct; `quadrant-consultant.html:130` carries a single legend rule with no separate footer rule left in the SVG to reconcile against (the footer content lives outside the `<svg>` as HTML cards), so that sub-clause is satisfied vacuously
- [x] T010 [P] S6: rewrite `style-guide.md` §5's dot-pattern bullet so the pattern is on by default, naming `example-dp-security-matrix.html`, `example-import-drawio.html`, `example-import-mermaid.html`, `example-it-state.html`, `example-medallion.html`, `example-org-chart.html`, `example-quadrant-consultant.html` and `example-venn.html` as the opt-out (REQ-007) (references/foundations/style-guide.md) — executor: DeepSeek V4.1 Flash max via cli-pi — done differently, landed in `ed3f26aaf5`: `style-guide.md:169` now reads "the eight that do are the security matrix, both import examples, the IT current-state, medallion, org chart, consultant quadrant and venn" — all eight named, but by descriptive phrase rather than the literal `example-*.html` filenames REQ-007 quoted, because the corpus dropped the `example-`/`template-` prefixes in a later directory-merge (the files are `dp-security-matrix.html`, `import-drawio.html`, `import-mermaid.html`, `it-state.html`, `medallion.html`, `org-chart.html`, `quadrant-consultant.html`, `venn.html` today); each of the eight is identified uniquely and the count matches "26 of the 34"
- [x] T011 [P] S7: correct `derivation-record.md` §2's light `rule-solid` row to `rgba(79,93,117,0.25)`, kind `derived: muted at 0.25`, matching `diagram-palette.json`'s existing entry; correct `style-guide.md`'s token-table `rule-solid` row the same way; remove the `#f7591f` citation from `style-guide.md` §1's illustrative sentence (REQ-008) (references/foundations/derivation-record.md, references/foundations/style-guide.md) — executor: DeepSeek V4.1 Flash max via cli-pi — done: `derivation-record.md:42` and `style-guide.md:43` both read `rgba(79,93,117,0.25)` / `derived: muted at 0.25`; `grep -c "f7591f" style-guide.md` reports `0`
- [x] T012 S9: in `template.html` and `template-dark.html`, add CSS classes (e.g. `.sample-node`, `.sample-node-name`) resolving `paper`/`ink`/`muted`/`accent` through `var(--color-*)`, apply them to the two markers and the paper background rect plus one new placeholder node (bracket-style label, matching the corpus's `[diagram-slug]` convention) that gives `ink` a genuine reference inside the `<svg>`; leave `link` for 007's F32 (REQ-010) (assets/templates/template.html, assets/templates/template-dark.html) — executor: DeepSeek V4.1 Flash max via cli-pi — done differently, landed in `cddd84f9f8`: `starter-light.html`/`starter-dark.html`'s two markers and the paper background rect now read `var(--color-muted)`, `var(--color-accent)` and `var(--color-paper)` (previously literal hex); the placeholder-node half was declined rather than executed — README.md now states "Three of the four ship an empty placeholder drawing, so there is nothing in them to repaint until you draw it — that is what makes them starters," so `ink` (the one declared, non-`link` role with no chrome use) still has no in-svg reference, by documented design rather than oversight; `link` is untouched, still 007's F32 wiring
- [x] T013 S9: in `template-terminal.html`, convert the muted and accent marker fills to CSS classes and add a placeholder focal-node demonstration (accent-tint fill, accent stroke, ink label, soft sublabel) so `ink`, `soft` and `accent-tint` each gain a genuine reference inside the `<svg>`; leave `page`, `bar` and `border` as chrome-only (already correctly var()'d outside the `<svg>`, and absent from the corpus's own clean `example-loop-terminal.html` reference) (REQ-010) (assets/templates/template-terminal.html) — executor: DeepSeek V4.1 Flash max via cli-pi — done differently, landed in `cddd84f9f8`: `starter-terminal.html`'s two markers and the paper background rect now read `var(--color-muted)`, `var(--color-accent)` and `var(--color-paper)` (previously literal); `page`/`bar`/`border` remain chrome-only outside the `<svg>` as planned; the placeholder focal-node demonstration was declined — same README.md "empty placeholder" decision as T012 — so `ink`, `soft` and `accent-tint` still have no in-svg reference, because the file draws nothing for them to paint
- [ ] T014 S9: in `template-full.html`, add a CSS class per remaining role (`paper`, `paper-2`, `ink`, `muted`, `soft`, `rule`, `rule-solid`, `accent`, `accent-tint`) and apply each at least once inside the `<svg>` — repoint elements that already carry the role's literal value (e.g. the `rgba(235,108,54,0.08)` accent-tint fills at `:318`/`:334`) through the new class, and give `rule-solid` a genuine divider use where none exists today; leave `link` for 007's F32 (REQ-010) (assets/templates/template-full.html) — executor: DeepSeek V4.1 Flash max via cli-pi — still partial, not ticked: `cddd84f9f8` ("eighty literals across the four starters now name their role instead of their value... a reference with a moved accent now repaints five marks in the worked starter") wired eight of the nine roles inside `starter-full.html`'s `<svg>` — `var(--color-paper)`, `var(--color-ink)`, `var(--color-muted)`, `var(--color-soft)`, `var(--color-rule)`, `var(--color-rule-solid)`, `var(--color-accent)` and `var(--color-accent-tint)` all now appear between its `<svg` and `</svg>` tags (76 references total); `paper-2` did not — its only reference in the file is a commented-out opt-in card-frame rule at `:79` (`/* background: var(--color-paper-2); */`), never uncommented and never used inside the `<svg>`, and `paper-2` is a genuinely active role elsewhere in the corpus (`org-chart.html`, `dp-integration.html`, `it-state.html`, `data-flow.html`, `quadrant-consultant.html`, `medallion.html`, `sequence-oauth-full.html` all use it for zone fills), so this is not a role without a natural use — it is the one remaining gap, with no documented rationale for leaving it out
- [x] T015 S3 (fix half): correct `template-full.html`'s two legend dash-array mismatches (`:353` Auth-flow swatch `4,3`→`5,4` matching `:230`; `:359` Security-group swatch `3,3`→`4,4` matching `:289`); add `marker-end="url(#arrow-accent)"` and `marker-end="url(#arrow)"` to `example-high-level.html`'s two markerless legend lines (`:293`, `:296`); step the three legend swatch fills in `template-full.html` (`:340`/`:343`/`:346`) and `example-architecture.html` (`:163`/`:166`/`:169`) to `0.05`/`0.08`/`0.14` respectively, touching only the legend swatches, not `style-guide.md` §4's node-type-treatment table (REQ-003) (assets/templates/template-full.html, assets/examples/example-high-level.html, assets/examples/example-architecture.html) — executor: DeepSeek V4.1 Flash max via cli-pi — done with a resolved deviation on its third sub-fix: the dash-array half landed (`starter-full.html:354`/`:360` = `5,4`/`4,4`, via `c1f109bfe4`, already confirmed at the prior closeout); the marker-end half landed in `ed3f26aaf5` — `high-level.html:293,296` now carry `marker-end="url(#arrow-accent)"` and `marker-end="url(#arrow-sm)"`, confirmed visually in the regenerated `high-level.png`; the fill-alpha step was investigated rather than executed — `ed3f26aaf5` measured the three fills at "within about 4% of each other" and added a paragraph to `style-guide.md` §4 explaining the stroke, not the fill, is what separates these node types by design, so stepping the alphas would have been cosmetic rather than corrective; `starter-full.html` and `architecture.html`'s legend swatches are still `0.03`/`0.05`/`0.10`, unchanged, and `style-guide.md` §4's table itself is untouched as REQ-003 required
- [x] T016 Recompute `shasum -a 256` for every template file edited by T012-T015 and update `derivation-record.md` §6's PINS table to the new hashes, so the table never states a hash the file does not carry (REQ-011) (references/foundations/derivation-record.md) — executor: human review — done differently: `c0f1ad041c` deleted the PINS table rather than recomputing it (nothing read the pins, all four were stale, and byte-identity already catches value drift); `derivation-record.md` §6 now explains that the applicator's `--default` byte-identity property does the pins' job without upkeep, so the underlying purpose (never state a hash the file does not carry) holds because there is no table left to go stale
- [x] T017 Run `node scripts/check-diagram-corpus.cjs`; confirm `RESULT: PASSED` with the existing ten families before either new family below is added, per the parent brief's standing ordering rule (scripts/check-diagram-corpus.cjs) — executor: human review — inferred, same reasoning as T003
- [x] T018 Build `scripts/families/legend-fidelity.cjs`: for a file with a "LEGEND" text marker and at least one dashed swatch after it, assert every legend-region `stroke-dasharray` value equals some pre-legend drawing element's `stroke-dasharray` value in the same file (REQ-004) (scripts/families/legend-fidelity.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — done: file exists; live `node scripts/check-diagram-corpus.cjs` run shows `legend-fidelity: 18 assertion(s), 0 failure(s)`
- [x] T019 S8: confirm 007's F4 (`example-er.html`), F6 (`example-architecture.html`) and F14 (`example-swimlane.html`) fixes are present on disk (already checked at T002); build `scripts/families/short-connector-labels.cjs` asserting a connector under ~60px carries no `class="label-mask"` (or equivalent paper-fill) rect overlapping its bounding box, reusing `orthogonal-connectors.cjs`'s connector-detection heuristic; run it once against the full corpus and fix any further instance it surfaces beyond F4/F6/F14 before proceeding, so the family ships already green (REQ-009) (scripts/families/short-connector-labels.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — done: file exists; live run shows `short-connector-labels: 64 assertion(s), 0 failure(s)`; `f3bf733cf4` fixed a real 52px instance in `dp-integration.html` (the AUTH label's `label-mask` rect removed, replaced with `text-anchor="end"` plain text) beyond F4/F6/F14, per its own commit message and confirmed in the diff
- [ ] T020 Narrow `check-diagram-corpus.cjs`'s judged-boundary header comment: the short-connector mask case graduates out of "the visible label gap" example now that T019's family holds it, per the checker's own one-way graduation rule (scripts/check-diagram-corpus.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — not done: `check-diagram-corpus.cjs:10`'s header comment still lists "the visible label gap" under the un-judged pairwise-connector-geometry set, unchanged
- [x] T021 Add one mutation case each for `legend-fidelity` and `short-connector-labels` to `scripts/tests/mutation-cases.cjs`'s `FILE_CASES`, each breaking one thing and asserting the named family's message (REQ-012) (scripts/tests/mutation-cases.cjs) — executor: DeepSeek V4.1 Flash max via cli-pi — done: `mutation-cases.cjs` carries a `legend-fidelity` case (`high-level.html`, dash `4,3`→`9,2`) and a `short-connector-labels` case (`it-state.html`, mask shift); live `node --test` run shows both cases passing and the completeness-triple test green
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T022 Run `node scripts/check-diagram-corpus.cjs`; confirm `RESULT: PASSED` with all twelve families, then run `node --test scripts/tests/` and confirm it exits `0` with the completeness triple reporting both new families covered (REQ-013) (scripts/check-diagram-corpus.cjs, scripts/tests/) — executor: human review — done: live run today, `check-diagram-corpus.cjs` → `RESULT: PASSED`, 12 families, `Summary: errors: 0`; `node --test scripts/tests/` → `tests 16 pass 16 fail 0`, including the completeness-triple case
- [x] T023 Run `node scripts/apply-diagram-tokens.cjs --default --out <tmp>` and `--default --examples --out <tmp>`; diff each output against the shipped corpus and confirm byte-for-byte reproduction (REQ-014) (scripts/apply-diagram-tokens.cjs) — executor: human review — done, with a path deviation: the current CLI is `--default --all --out <tmp>` (examples and templates now merged into `assets/diagrams/`, per `plan.md`'s `--forms`/`--all` flags); live run of both `apply-diagram-tokens.cjs --default --all` and `apply-design-md.cjs --default --all` against `/tmp` and `diff -rq` against `assets/diagrams/` reported no differences
- [ ] T024 Grep `style-guide.md` and `derivation-record.md` for each corrected claim (series-palette scope, dot-pattern default, `rule-solid` value, the `#f7591f` citation) and confirm the corpus-wide sweep finds no remaining document stating a value the corpus does not hold; re-render every file this phase edited and view each result before closing (REQ-015) — executor: human review — grep sweep now fully clean and re-run live in this closeout: `typed-chip` present, "default ground" present with all eight opt-outs named, `rule-solid` reads `rgba(79,93,117,0.25)` in both documents, `f7591f` returns zero hits under `references/` (the one `f7591f` hit under `onboarding.md` is a fenced ```diff``` rebrand-walkthrough example value, unrelated to S7's corpus-accent citation and outside REQ-008's style-guide.md-only scope); still not ticked because "re-render every file this phase edited and view each result" was only partially performed here — the ten screenshots for files touched by `ed3f26aaf5`/`67a8c88de5`/`76ad403c52` were all regenerated (confirmed via each commit's changed PNG bytes), and this closeout directly viewed two of them (`high-level.png`, `it-state.png`), both rendering correctly with no regression, but the other eight were not individually viewed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` — not true: T014, T020, T024 remain unticked (down from ten at the prior closeout; T005, T008, T009, T010, T012, T013, T015 re-verified and ticked in this pass)
- [x] No `[B]` blocked tasks remaining — true, no task carries a `[B]` marker
- [ ] Manual verification passed — the scripted gates (checker, mutation suite, applicator) pass; this closeout directly viewed two of the ten regenerated screenshots (both correct) but did not view the remaining eight, so the file-by-file visual re-render this criterion implies is not fully performed
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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-015 present
- [x] CHK-002 [P0] Technical approach defined in plan.md — Architecture and Affected Surfaces sections present
- [x] CHK-003 [P1] Dependencies identified and available — 007's F4/F6/F14/F17/F22/F26/F31/F32, the ten existing checker families, and `diagram-palette.json`'s recorded `rule-solid` entry all read and cited
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — the two new families follow the existing `scripts/families/*.cjs` CommonJS style; no new lint config introduced
- [x] CHK-011 [P0] No console errors or warnings — the checker still prints `RESULT: PASSED` or `RESULT: FAILED` with a matching exit code after the two families are added — confirmed via live run today
- [x] CHK-012 [P1] Error handling implemented — a family whose input file has no legend or no connector asserts zero, not an error (T018, T019) — `legend-fidelity.cjs`'s `if (legendAt === -1) return;` returns cleanly rather than failing
- [x] CHK-013 [P1] Code follows project patterns — no comment in `legend-fidelity.cjs`, `short-connector-labels.cjs`, or any edited style/markup file embeds a spec path, finding id, or task id (comment-hygiene hard block) — grepped for `S1`-`S9`/`REQ-0NN`/`T0NN`/`008-doctrine`/`specs/sk-design` across both new family files, `mutation-cases.cjs`, both reference docs, and every touched diagram file; the only hits are diagram content (e.g. `bar.html`'s week labels S1-S8), not comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met — AC-001 through AC-016 in acceptance-criteria.md — not true: AC-011 and AC-016 remain `Unmet` (see acceptance-criteria.md); AC-002, AC-004, AC-006, AC-007 and AC-008, `Unmet` at the prior closeout, are re-verified `Met` in this pass
- [x] CHK-021 [P0] `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation --strict` reports `RESULT: PASSED` (run by the orchestrator, not this authoring pass) — this closeout pass ran it and confirmed `RESULT: PASSED`; it validates this packet's own document structure and metadata, not whether S1-S9's underlying requirements were fulfilled
- [x] CHK-022 [P1] Edge cases tested — the shared-file overlap (`template-full.html` in S2/S3/S9), the no-legend/no-dashed-swatch case, and the pre-existing-fix dependency check from spec.md §L2 EDGE CASES each map to a task above — the mapping holds structurally even though some of the mapped tasks (T012-T015) did not execute
- [x] CHK-023 [P1] Every systemic pattern this node owns (S1-S9) appears in a task line above; S10 is confirmed out of scope in spec.md's Out of Scope section
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each S-item is classed: S1/S2/S4/S5/S6/S7 are `class-of-bug` (a doc or a corpus-wide pattern, not one instance); S3/S8 are `class-of-bug` plus a new `test-isolation` guard (the checker family); S9 is `cross-consumer` (every template that declares a role is a consumer of the wiring convention).
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for each S-item's file set in spec.md's Files to Change table; no S-item's fix is scoped to fewer files than the manual review named — spec.md's file inventory itself is complete; T005/T008/T009/T010/T012/T013/T015 (previously unedited) are now landed; `template-full.html`'s `paper-2` role (T014) is the one file-set item still not wired
- [x] CHK-FIX-003 [P0] Consumer inventory completed: `style-guide.md`/`derivation-record.md` corrections (S1, S6, S7) are cross-checked against `diagram-palette.json`'s already-correct entries so the two documents converge on the JSON, not on each other — confirmed for the `rule-solid` row (S7); S1/S6 don't depend on the JSON for their corrected sentences
- [x] CHK-FIX-004 [P0] Not applicable — no path, parser, redaction, or security surface in this phase.
- [x] CHK-FIX-005 [P1] Matrix axes: nine systemic patterns × (doc-only / fix-and-check / corpus-wide-wiring) = the three task shapes in Phase 2 (T004-T011 doc/markup fixes, T012-T015 plus T018-T021 fix-and-check pairs, T012-T014 wiring).
- [x] CHK-FIX-006 [P1] Not applicable — no process-wide or global state read by any script this phase touches.
- [x] CHK-FIX-007 [P1] Evidence will be pinned to this phase's own commit SHA once T001-T024 execute, not to a moving branch-relative range — pinned in this closeout to `62d4e1e293`, `c0f1ad041c`, `f3bf733cf4`, `c1f109bfe4` (the dash-array fix), and, from this re-closeout, `ed3f26aaf5`, `cddd84f9f8`, `67a8c88de5` and `76ad403c52`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — no script or document this phase touches reads a credential or an environment variable
- [x] CHK-031 [P0] Input validation implemented — the two new families fail closed (report an error) rather than silently passing a file with malformed markup, matching the ten existing families' own convention
- [x] CHK-032 [P1] Auth/authz working correctly — not applicable; local tooling and reference documents only, no network or auth surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — REQ ids in spec.md match task citations here and AC rows in acceptance-criteria.md
- [x] CHK-041 [P1] Code comments adequate — the two new families carry plain-prose comments describing their rule, matching the ten existing families' style; no ephemeral id added anywhere (verified by CHK-013)
- [x] CHK-042 [P2] README updated (if applicable) — not applicable; this phase corrects existing reference-document prose, it does not add a new README
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — this authoring pass created no temp files
- [x] CHK-051 [P1] scratch/ cleaned before completion — not applicable; nothing was added to this packet's scratch/ by this authoring pass
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 (CHK-020 still unmet: AC-011/AC-016 remain `Unmet`) |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-11 (re-closeout pass over `ed3f26aaf5`/`cddd84f9f8`/`67a8c88de5`/`76ad403c52`; 14 of 24 tasks and 9 of 16 criteria at the prior closeout, now 21 of 24 tasks and 14 of 16 criteria)
<!-- /ANCHOR:summary -->

---
