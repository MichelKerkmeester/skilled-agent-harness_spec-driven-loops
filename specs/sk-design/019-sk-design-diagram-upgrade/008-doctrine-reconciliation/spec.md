---
title: "Feature Specification: Phase 8: doctrine-reconciliation"
description: "The manual review's nine systemic patterns (S1-S9) each get one signed direction, the losing document or files are edited to match, and the two checkable patterns graduate into named corpus-checker families."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8: doctrine-reconciliation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-11 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 11 |
| **Predecessor** | 007-manual-review-remediation |
| **Successor** | 009-one-form-library |
| **Handoff Criteria** | Every one of S1-S9 is resolved in one direction with the losing document or files edited to match; `legend-fidelity` and `short-connector-labels` exist as named checker families with a mutation case each; the checker prints `RESULT: PASSED` with all twelve families; the mutation suite is green with its completeness triple; the applicator's byte-identity property holds; a corpus-wide grep finds no document stating a value the corpus does not hold. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the upgrade sk-design-diagram with the sk-design-chart contract, adapted to diagrams specification — the phase that closes out the manual review's systemic half after 007 closes its per-file half.

**Scope Boundary**: the nine systemic patterns S1-S9 the manual review named, and only those — no path moves (009's job), no repaint pipeline changes (003's job already shipped), no new decision beyond the direction each S-item already states, and no F-numbered per-file finding this phase does not itself cite. S10 (the renderer's fixed-viewport crop) belongs to 011 and is out of scope here by the review's own words.

**Dependencies**:
- 007's per-file fixes for F4, F6, F14 (short connectors erased by a label mask), F17 (the security-matrix colour key), F22 (the pyramid's `soft` cadence figures), F26/F31/F32 (skin and token hygiene) — S2, S3 and S8 below build on those instances already being closed rather than re-fixing them.
- The ten existing checker families under `scripts/families/` and the mutation suite's completeness triple in `scripts/tests/corpus-mutations.test.cjs` — the two new families this phase adds must satisfy the same triple, not a parallel one.
- `diagram-palette.json`'s light `rule-solid` value (`rgba(79,93,117,0.25)`, kind `derived: muted at 0.25`) — already correct; S7 corrects the two documents that disagree with it, not the source.

**Deliverables**:
- Corrected prose in `references/foundations/style-guide.md` and `references/foundations/derivation-record.md` (S1, S6, S7).
- Corrected markup in the nine named example files, the four templates, and `assets/color/diagram-palette.json`'s recorded pins (S1-S5, S9).
- `scripts/families/legend-fidelity.cjs` and `scripts/families/short-connector-labels.cjs`, each with a case in `scripts/tests/mutation-cases.cjs` (S3, S8).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The manual review found nine systemic patterns (S1-S9) where a document and the corpus disagree, or the corpus itself is internally inconsistent, and named a direction for each rather than leaving the contradiction open. Left unresolved, a future author reads `style-guide.md` or `derivation-record.md` and does the wrong thing on purpose, because the wrong thing is what the doc says to do — the exact failure mode D16 exists to close.

### Purpose
Every systemic pattern S1-S9 is resolved in the direction the review already chose, the losing side is edited to match the winning side, and the two patterns narrow enough to hold with a check (S3's dash-array fidelity, S8's short-connector mask rule) graduate from the judged boundary into named, mutation-proven checker families.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- S1 — widen `style-guide.md`'s series-palette scope to "multi-series charts plus typed-chip vocabularies," naming the four non-chart files that legitimately use it, and rename `example-dp-integration.html`'s mislabelled `--custom-red`/`--custom-blue` custom properties to what they are.
- S2 — repoint every `<text>` fill using `soft` (`#7a8399`) to `muted` (`#4f5d75`, 6.11:1) across the ten named files, keeping `soft` structural and its recorded departure text unchanged.
- S3 — fix template-full.html's two legend dash-array mismatches, `example-high-level.html`'s two markerless legend line swatches, and the indistinguishable legend swatch fills in `template-full.html` and `example-architecture.html`; hold the dash-array half with a new `legend-fidelity` checker family.
- S4 — converge the four non-conforming files' legend entry typography on sentence-case Geist sans, leaving the mono uppercase "LEGEND" eyebrow heading untouched everywhere.
- S5 — set each named file's legend rule to that drawing's own content bounding box, correcting the two confirmed mismatches and auditing the rest.
- S6 — rewrite `style-guide.md`'s dot-pattern sentence so the corpus's own 26-of-34 default wins, naming the eight files that opt out.
- S7 — correct `derivation-record.md` §2's light `rule-solid` row and `style-guide.md`'s token-table row to the value the template already carries, and delete the `#f7591f` accent citation that appears nowhere in the corpus.
- S8 — confirm 007's F4/F6/F14 fixes closed every corpus instance of a mask erasing a short connector, fix any further instance the new family surfaces, and hold the rule with a new `short-connector-labels` checker family.
- S9 — wire every declared-but-unreferenced role in all four templates through a CSS class the template owns, applied at least once inside its own `<svg>`, mirroring `example-dp-integration.html`'s convention.
- Recompute the sha256 pins in `derivation-record.md` §6 for every template file this phase edits.
- One mutation case per new family, satisfying the existing completeness triple; a full checker run and `node --test` run confirming all twelve families and their cases hold; an applicator byte-identity check; a corpus-wide grep confirming no reference document states a value the corpus does not hold.

### Out of Scope
- Any F-numbered per-file finding not cited above — 007's job; this phase does not re-open or re-fix an instance 007 already closed.
- Path moves for `assets/examples/` or `assets/templates/` — 009's job; this phase edits files in place at their current paths.
- S10 (the renderer's fixed-viewport crop) — 011's job by the review's own scoping sentence.
- Any change to `sk-design-chart` — D12 is a hard block; nothing here reads from or writes to that skill.
- Signing a new decision beyond the direction each S-item already states — the parent goal's D16 already committed each pattern to one direction; this phase executes it, it does not re-litigate it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md` | Modify | S1 series-palette scope, S6 dot-pattern default, S7 token-table row and accent citation |
| `.opencode/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md` | Modify | S7 rule-solid row correction, S9 pin recompute for edited templates |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-dp-integration.html` | Modify | S1 custom-property rename |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-architecture.html` | Modify | S2 text-fill repoint, S3 legend fill separation |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-import-drawio.html` | Modify | S2 text-fill repoint, S4 legend typography |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-import-mermaid.html` | Modify | S2 text-fill repoint, S4 legend typography |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-pyramid.html` | Modify | S2 text-fill repoint |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-sequence.html` | Modify | S2 text-fill repoint |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-sequence-oauth.html` | Modify | S2 text-fill repoint |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-sequence-oauth-full.html` | Modify | S2 text-fill repoint |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-timeline.html` | Modify | S2 text-fill repoint |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-dp-security-matrix.html` | Modify | S2 text-fill repoint (`.value.none-text` class) |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-it-state.html` | Modify | S4 legend typography |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-org-chart.html` | Modify | S4 legend typography |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-er.html` | Modify | S5 legend rule bounding box |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-high-level.html` | Modify | S3 markerless legend lines, S5 legend rule bounding box |
| `.opencode/skills/sk-design/sk-design-diagram/assets/examples/example-quadrant-consultant.html` | Modify | S5 legend/footer rule reconciliation |
| `.opencode/skills/sk-design/sk-design-diagram/assets/templates/template-full.html` | Modify | S3 dash-array fix and legend fill separation, S9 starter token wiring |
| `.opencode/skills/sk-design/sk-design-diagram/assets/templates/template.html` | Modify | S9 starter token wiring |
| `.opencode/skills/sk-design/sk-design-diagram/assets/templates/template-dark.html` | Modify | S9 starter token wiring |
| `.opencode/skills/sk-design/sk-design-diagram/assets/templates/template-terminal.html` | Modify | S9 starter token wiring |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/families/legend-fidelity.cjs` | Create | S3's checkable half: a legend swatch's dash array must equal some element's dash array in the same file |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/families/short-connector-labels.cjs` | Create | S8's checkable half: a connector under ~60px carries its label beside it, never masked over it |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/tests/mutation-cases.cjs` | Modify | One case each for the two new families |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` | Modify | Narrow the judged-boundary comment's "visible label gap" example now that the short-connector case graduates |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `style-guide.md`'s series-palette section MUST read "multi-series charts plus typed-chip vocabularies" rather than "currently: radar," naming `example-data-flow.html`, `example-process.html`, `example-dp-integration.html` and `example-it-state.html` as the typed-chip users and `example-radar.html`/`example-line.html` as the chart users; `example-dp-integration.html`'s `--custom-red`/`--custom-blue` custom properties MUST be renamed to what they are (rust-brown, dusty-blue) everywhere they appear (S1). |
| REQ-002 | Every `<text>` element painting `soft` (`#7a8399`) as its `fill` across `example-architecture.html`, `example-import-drawio.html`, `example-import-mermaid.html`, `example-pyramid.html`, `example-sequence.html`, `example-sequence-oauth.html`, `example-sequence-oauth-full.html`, `example-timeline.html`, `template-full.html` and `example-dp-security-matrix.html`'s `.value.none-text` class MUST repoint to `muted` (`#4f5d75`); `soft`'s structural uses (strokes, tints) and the recorded departure text in `diagram-palette.json` and `derivation-record.md` MUST NOT change (S2). |
| REQ-003 | `template-full.html`'s two legend dash-array mismatches (the Auth-flow swatch at `4,3` against the real connector's `5,4`; the Security-group swatch at `3,3` against the real boundary's `4,4`) MUST be corrected to match; `example-high-level.html`'s two legend line swatches (Primary data path, Orchestration trigger) MUST gain the `marker-end` their real counterparts carry; the three indistinguishable legend swatch fills in `template-full.html` and `example-architecture.html` MUST be stepped to visibly separable alphas without changing the corpus-wide node-type-treatment values those alphas otherwise represent (S3, fix half). |
| REQ-004 | `scripts/families/legend-fidelity.cjs` MUST assert that every legend swatch's `stroke-dasharray` value equals some non-legend element's `stroke-dasharray` value in the same file, added only after REQ-003 lands so the corpus is green before the family is registered (S3, check half). |
| REQ-005 | The legend entry text (not the "LEGEND" eyebrow heading) in `example-import-drawio.html`, `example-import-mermaid.html`, `example-it-state.html` and `example-org-chart.html` MUST converge on sentence-case Geist sans, matching the majority form (S4). |
| REQ-006 | The legend rule's `x1`/`x2` in `example-er.html` and `example-high-level.html` MUST be corrected to that drawing's own content bounding box; `example-architecture.html`, `example-timeline.html`, `example-quadrant.html` and `example-quadrant-consultant.html` MUST be audited against their own content extent and left unchanged wherever the existing `40`/`960` pair already matches; `example-quadrant-consultant.html`'s legend rule and its footer rule below it MUST end at the same point (S5). |
| REQ-007 | `style-guide.md`'s dot-pattern sentence MUST state that the pattern is on by default, naming `example-dp-security-matrix.html`, `example-import-drawio.html`, `example-import-mermaid.html`, `example-it-state.html`, `example-medallion.html`, `example-org-chart.html`, `example-quadrant-consultant.html` and `example-venn.html` as the named opt-out (S6). |
| REQ-008 | `derivation-record.md` §2's light `rule-solid` row MUST read `rgba(79,93,117,0.25)`, kind `derived: muted at 0.25`, matching `diagram-palette.json`'s already-correct entry and the value `template-full.html` carries; `style-guide.md`'s token table MUST carry the same corrected row; `style-guide.md` §1's `#f7591f` accent citation MUST be removed (S7). |
| REQ-009 | `scripts/families/short-connector-labels.cjs` MUST assert that a connector under approximately 60px carries no `label-mask`-class (or equivalent paper-fill) rect overlapping its bounding region; before this family is registered, 007's F4/F6/F14 fixes MUST be confirmed present on disk and any further corpus instance the family surfaces MUST be fixed so the corpus is green when the family ships (S8). |
| REQ-010 | Every role declared inside each of the four templates' `DIAGRAM_PALETTE` sentinel blocks — excluding `link`, which 007's F32 already wires — MUST gain at least one `var(--color-<role>)` reference inside that file's own `<svg>...</svg>` region, expressed through a CSS class the template's `<style>` block owns, never through a literal presentation-attribute value (S9). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-011 | `derivation-record.md` §6's PINS table MUST be recomputed (`shasum -a 256`) for every template file this phase edits, so the table never states a hash the file does not carry. |
| REQ-012 | `scripts/tests/mutation-cases.cjs` MUST carry one case each for `legend-fidelity` and `short-connector-labels`, each breaking one thing and asserting the named family's message; the suite's completeness triple MUST report both families covered. |
| REQ-013 | `node scripts/check-diagram-corpus.cjs` MUST print `RESULT: PASSED` with all twelve families registered, and `node --test scripts/tests/` MUST exit `0`. |
| REQ-014 | `node scripts/apply-diagram-tokens.cjs --default --out <tmp>` and `--default --examples --out <tmp>` MUST still reproduce every file byte for byte after every edit in this phase. |
| REQ-015 | A corpus-wide grep for the corrected values (series-palette scope, `soft`-as-text, dash-array pairs, dot-pattern default, `rule-solid`, the `#f7591f` citation) MUST find no remaining reference document stating the value this phase corrected. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` prints `RESULT: PASSED` with twelve families registered (the ten from 005 plus `legend-fidelity` and `short-connector-labels`).
- **SC-002**: `node --test .opencode/skills/sk-design/sk-design-diagram/scripts/tests/` exits `0`, and the completeness-triple case reports no family without a case.
- **SC-003**: `node .opencode/skills/sk-design/sk-design-diagram/scripts/apply-diagram-tokens.cjs --default --out <tmp>` and `--default --examples --out <tmp>` reproduce the corpus byte for byte.
- **SC-004**: A grep sweep over `style-guide.md` and `derivation-record.md` for the nine corrected claims (series-palette scope, dot-pattern default, `rule-solid` value, the `#f7591f` citation) finds each one stated the way the corpus now holds it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 007's F4, F6, F14, F17, F22, F26, F31, F32 fixes | S2, S3 and S8 assume these instances are already closed; re-fixing them here would collide with 007's own tasks | Phase 1's setup task reads each file on disk and confirms the fix is present before the corresponding S-item task runs |
| Dependency | `diagram-palette.json`'s already-correct `rule-solid` entry | If the JSON were wrong too, S7 would need a fourth correction target it does not currently have | Read directly at authoring time; confirmed correct, so S7 corrects exactly two documents, not three |
| Risk | The two new checker families are registered before the corpus is clean, so they ship already red | Undermines the ordering rule the parent brief states as a standing rule, not a preference | REQ-004 and REQ-009 both sequence the family after its fix half in `tasks.md`, and the suite's own base-clean refusal (already proven in 005) fails a case built on a red base |
| Risk | S9's per-role wiring in `template-full.html` (nine roles, ten times the surface of the three bare-skeleton templates) misses a role or drifts the recorded sha256 pin silently | A stale pin is exactly the "document states a value the corpus does not hold" failure S9 exists to close | REQ-011 recomputes every touched template's pin explicitly as its own task, checked by SC-004's grep sweep |
| Risk | S3's legend-fill separation touches values that also appear in the style guide's node-type-treatment table, tempting a wider repaint than the legend swatches themselves | Would expand blast radius into every node using those treatments across the corpus, well past what the review scoped | The fix is stated as legend-swatch-only; the node-type-treatment table in `style-guide.md` §4 is not touched by this phase |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target applies. The checker, applicator and mutation suite run locally against a corpus of 38 files; no new timing budget is introduced by two additional families.

### Security
- **NFR-S01**: No auth surface. Every edit is a local file change; no new remote host, script, or credential is introduced anywhere in this phase's scope.

### Reliability
- **NFR-R01**: Determinism target: given the same corrected corpus, two runs of `check-diagram-corpus.cjs` produce byte-identical output, and two runs of the applicator's `--default` mode produce byte-identical output.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A file named in more than one S-item (`template-full.html` appears in S2, S3 and S9; `example-architecture.html` appears in S2 and S3) — each task names its own lines so two tasks touching the same file do not collide, and the file's sha256 pin is recomputed once, after all of that file's edits land, not once per S-item.
- A legend swatch whose dash array legitimately has no matching element in the file because the file draws no dashed connector at all — `legend-fidelity` only asserts the rule for a file that has both a legend and at least one dashed swatch; a file with neither carries zero assertions for this family, which is not a violation.

### Error Scenarios
- 007's F4/F6/F14 fixes are not yet present on disk when this phase's S8 task runs — Phase 1's dependency check halts before REQ-009's family is registered, per the parent brief's `HALT` discipline, rather than building a family against files not yet in their fixed state.
- A style-guide.md correction (S1, S6, S7) is applied but a stale sentence survives elsewhere in the same document describing the old value — REQ-015's corpus-wide grep is the standing check against exactly this residue.

### State Transitions
- The corpus must be green under the existing ten families before either new family is added, and green under all twelve before this phase closes — `tasks.md` sequences every S3/S8 fix task strictly before its corresponding family task, and the final full-checker-run task strictly after both families are registered.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Nine systemic patterns across roughly twenty files plus two reference documents; two new checker files and one mutation-suite edit — comparable file count to 007, narrower per-file surface (whole-corpus rules, not one-off geometry fixes) |
| Risk | 14/25 | No auth, no API, no production data; the real risk is doctrine drift — shipping a family or a doc correction that is itself wrong would re-create the exact contradiction this phase exists to close |
| Research | 10/20 | The manual review already names the direction for all nine patterns; this phase verifies each claim against the live files rather than re-deciding anything |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Every S1-S9 pattern in the manual review already states its resolved direction; this phase executes each one rather than adjudicating a still-open choice.
<!-- /ANCHOR:questions -->

---
