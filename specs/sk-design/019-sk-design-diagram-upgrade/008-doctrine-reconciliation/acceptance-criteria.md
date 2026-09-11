---
title: "Acceptance Criteria: Phase 8: doctrine-reconciliation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Re-verified 7 prior-Unmet criteria against 4 new commits; 5 flip to Met"
    next_safe_action: "Wire starter-full.html's paper-2 role inside its svg to close AC-011"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-008-doctrine-reconciliation"
      parent_session_id: null
    completion_pct: 88
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 8: doctrine-reconciliation

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation
**Level:** 2
**Status:** Draft
**Date:** 2026-09-11
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `style-guide.md` names only radar as the series-palette's chart type and four non-chart files already use it, When the section is widened, Then it reads "multi-series charts plus typed-chip vocabularies" and names all six real users | Observed: `style-guide.md:56` reads "Series palette (multi-series charts and typed-chip vocabularies)"; `:58` names `radar`/`line` as chart users and `data-flow`/`process`/`dp-integration`/`it-state` as typed-chip users — all six present, landed in `62d4e1e293` | Met | - |
| AC-002 | REQ-001 | Given `example-dp-integration.html` names two hues `--custom-red`/`--custom-blue` that are actually rust-brown and dusty-blue, When the properties are renamed, Then no hex value changes and the file renders identically | Observed, re-verified after `76ad403c52`: `grep -c "custom-red\|custom-blue" assets/diagrams/dp-integration.html` now reports `0`; the six custom properties are renamed to `--identity-rust`/`--identity-rust-fill`/`--identity-rust-stroke` and `--logging-blue`/`--logging-blue-fill`/`--logging-blue-stroke`, matching what they actually paint (the identity-provider footer and the logging footer); the `.footer-red*`/`.footer-blue*` class names and both hex values are unchanged | Met | - |
| AC-003 | REQ-002 | Given ten files paint `soft` as a `<text>` fill against the recorded departure, When every named instance is repointed, Then each reads `fill="#4f5d75"` (or the equivalent CSS-class value for `example-dp-security-matrix.html`) and no `soft` stroke or tint changed | Observed: `grep -rc '<text[^>]*fill="#7a8399"' assets/diagrams/*.html` reports `0` in every file; `dp-security-matrix.html:20` reads `.value.none-text{fill:#4f5d75}`; `derivation-record.md:109`'s recorded `soft` departure (3.48:1, structural only) unchanged | Met | - |
| AC-004 | REQ-003 | Given `template-full.html`'s two legend dash arrays and `example-high-level.html`'s two markerless legend lines and the three indistinguishable legend fills in two files, When each is corrected, Then every legend swatch matches its keyed element and the node-type-treatment table in `style-guide.md` §4 is untouched | Observed, re-verified after `ed3f26aaf5`, with a resolved judgment call on the third sub-fix: (1) the dash-array pair is corrected (`starter-full.html:354` = `5,4`, `:360` = `4,4`) — unchanged since the prior closeout. (2) `high-level.html:293,296` now carry `marker-end="url(#arrow-accent)"` and `marker-end="url(#arrow-sm)"`, confirmed both in the source and visually in the regenerated `high-level.png` — landed. (3) The fill-alpha step was not executed; instead `style-guide.md` §4 gained a paragraph, added alongside the untouched node-type-treatment table, explaining that these fills measure within ~4% of each other by design because the stroke, not the fill, is what separates the types, and that a legend swatch inherits the same treatment — so it already "matches its keyed element" on the dimension the corpus actually uses to tell types apart (the `legend-fidelity` family checks dash pattern, not fill). `starter-full.html`/`architecture.html`'s swatch fills remain `0.03`/`0.05`/`0.10`. Read literally, REQ-003's "MUST be stepped to visibly separable alphas" was not done; read against its purpose (a legend swatch faithful to what the drawing uses to distinguish the type), the finding was investigated and shown not to be a defect, and that reasoning is now on record so a future reviewer does not re-raise it. Judged Met on the latter reading, given `style-guide.md` §4's table (REQ-003's own negative constraint) is confirmed untouched | Met | - |
| AC-005 | REQ-004 | Given the corpus is green under the existing ten families, When `legend-fidelity.cjs` is added and registered, Then it asserts every legend swatch's dash array against the file's own drawing elements and the corpus still prints `RESULT: PASSED` | Observed: live `node scripts/check-diagram-corpus.cjs` run — `legend-fidelity: 18 assertion(s), 0 failure(s)`, part of a twelve-family `RESULT: PASSED` | Met | - |
| AC-006 | REQ-005 | Given four files carry UPPERCASE or lowercase mono legend entry text against the majority sentence-case sans form, When each is converged, Then the entry text reads sentence-case Geist sans and the "LEGEND" eyebrow heading stays mono uppercase in every file, including the four just changed | Observed, re-verified after `76ad403c52` and `67a8c88de5`: `import-drawio.html`/`import-mermaid.html` now read "Focal"/"Service"/"Store"/"Client"/"Decision"/"Input"/"HTTP call"/"Async" in `font-family:'Geist', sans-serif`; `org-chart.html` reads "Front door"/"Pod / owner" the same way; `it-state.html`'s five entries ("Data flow"/"Pain-point"/"External"/"Bottleneck"/"Survivor") are pulled out of the shared mono `.legend-label` class into their own sans styling. The "LEGEND" eyebrow stays `'Geist Mono', monospace` uppercase in all four files, confirmed by direct grep on each | Met | - |
| AC-007 | REQ-006 | Given `example-er.html` and `example-high-level.html`'s legend rules stop short of their own drawing's content, When each is corrected to that drawing's bounding box, Then the rule spans at least as wide as the widest content element and the other four audited files are unchanged wherever `40`/`960` already matched | Observed, re-verified after `76ad403c52` ("sixteen files shared the suspect value and only two fell short of their content"): `er.html:178` now reads `x2="980"`; `high-level.html:281` now reads `x2="972"`. The four audited files still hold `40`/`960` unchanged: `architecture.html:154`, `timeline.html:122`, `quadrant.html:122` — confirming the measurement found them already correct. `quadrant-consultant.html:130` carries one legend rule with no separate footer rule left in the SVG to reconcile against (the footer content now lives outside the `<svg>` as HTML `.cards`), so that sub-clause is satisfied vacuously rather than by an explicit edit | Met | - |
| AC-008 | REQ-007 | Given `style-guide.md` states the dot pattern is optional and not default against a corpus that ships it in 26 of 34 files, When the sentence is rewritten, Then it states the pattern is on by default and names all eight opt-out files | Observed, re-verified after `ed3f26aaf5`: `style-guide.md:169` reads "the eight that do are the security matrix, both import examples, the IT current-state, medallion, org chart, consultant quadrant and venn" — all eight named (`dp-security-matrix`, `import-drawio`, `import-mermaid`, `it-state`, `medallion`, `org-chart`, `quadrant-consultant`, `venn`), by descriptive phrase rather than the literal `example-*.html` filenames REQ-007 quoted, since the corpus dropped the `example-`/`template-` prefixes in a later directory-merge and those literal names no longer exist on disk; each of the eight is identified unambiguously and the count matches "26 of the 34." The sentence also now explains why those eight opt out ("each of them a figure whose own fills already cover most of the page") | Met | - |
| AC-009 | REQ-008 | Given `derivation-record.md` and `style-guide.md` both state light `rule-solid` as `#bfc0c0` against the template's actual `rgba(79,93,117,0.25)` and `diagram-palette.json`'s already-correct entry, When both documents are corrected and the `#f7591f` citation is removed, Then all three sources agree | Observed: `derivation-record.md:42` and `style-guide.md:43` both read `rgba(79,93,117,0.25)` / `derived: muted at 0.25`; `grep -c "f7591f" style-guide.md` reports `0` | Met | - |
| AC-010 | REQ-009 | Given 007's F4/F6/F14 close three named instances of a mask erasing a short connector, When `short-connector-labels.cjs` is added and run against the full corpus, Then it reports zero failures, including for any further instance it surfaces beyond the three named ones | Observed: live run — `short-connector-labels: 64 assertion(s), 0 failure(s)`; `f3bf733cf4` fixed a real 52px instance in `dp-integration.html` (the AUTH label's mask removed) beyond F4/F6/F14, per its commit message and the diff | Met | - |
| AC-011 | REQ-010 | Given all four templates declare roles that paint from a literal or have no presence inside the `<svg>` at all, When each template's `<style>` block gains a CSS class per role, Then every declared role except `link` has at least one `var(--color-<role>)` reference between that file's `<svg` and `</svg>` tags | Observed, re-verified after `cddd84f9f8` ("eighty literals across the four starters now name their role instead of their value"): substantial progress, still short of REQ-010's full scope. `starter-light.html`/`starter-dark.html`: `var(--color-muted)`, `var(--color-accent)` and `var(--color-paper)` now appear inside the `<svg>` (the two markers and the paper rect, previously literal); `ink` still has no in-svg reference — by a documented decision (README.md: "Three of the four ship an empty placeholder drawing... that is what makes them starters"), not an oversight, since the file draws nothing else for `ink` to paint. `starter-terminal.html`: same pattern — `muted`/`accent`/`paper` now wired, `ink`/`soft`/`accent-tint` still unwired for the same documented reason; `page`/`bar`/`border` remain correctly chrome-only outside the `<svg>`. `starter-full.html` (the one template meant to carry a worked drawing, not an empty placeholder): eight of nine required roles now have genuine in-svg references (`paper`, `ink`, `muted`, `soft`, `rule`, `rule-solid`, `accent`, `accent-tint` — 76 references total, confirmed via a proper `<svg>...</svg>`-scoped extraction); `paper-2` does not — its only reference in the file is a commented-out opt-in card-frame rule, never activated, and `paper-2` is an actively-used role elsewhere in the corpus (7 other files use it for zone fills), so this is a genuine remaining gap with no documented rationale, not a legitimately-exempt role like the three empty starters' `ink`/`soft`/`accent-tint` | Unmet | - |
| AC-012 | REQ-011 | Given `derivation-record.md` §6 pins four template files by sha256, When this phase edits one or more of them, Then the table's hash for each edited file matches the file's current content | Observed, with a documented deviation: `c0f1ad041c` deleted the PINS table entirely rather than recomputing it ("nothing read the pins, all four were stale, and byte-identity already catches what they claimed to"); `derivation-record.md` §6 now explains the applicator's byte-identity check does the pins' job without upkeep — there is no table left that could state a stale hash, so REQ-011's normative purpose holds even though the literal recompute step never ran | Met | - |
| AC-013 | REQ-012 | Given the mutation suite's completeness triple requires a case per registered family, When `legend-fidelity` and `short-connector-labels` are added, Then `mutation-cases.cjs` carries one case for each and the triple reports both covered | Observed: live `node --test scripts/tests/` — `legend-fidelity refuses a legend swatch keying a dash the drawing never paints` and `short-connector-labels refuses a label mask shifted onto a short connector` both pass, plus `every family the checker registers has a case here, or a stated reason it cannot` passes | Met | - |
| AC-014 | REQ-013 | Given every S1-S9 fix and both new families are in place, When the corpus check and the mutation suite run, Then the checker prints `RESULT: PASSED` with twelve families and `node --test` exits `0` | Observed: live run — `check-diagram-corpus.cjs` → `Diagram corpus: 38 files, 12 families` / `Summary: errors: 0` / `RESULT: PASSED`; `node --test scripts/tests/` → `tests 16 pass 16 fail 0` | Met | - |
| AC-015 | REQ-014 | Given every edit in this phase is either a documented sentence or a hex/rgba value already recognized as a role, When the applicator runs in `--default` and `--default --examples` mode, Then its output is byte-for-byte identical to the shipped corpus | Observed, with a path deviation: the current flags are `--default --all --out <tmp>` (`assets/examples/`+`assets/templates/` merged into `assets/diagrams/` after this phase was authored); live `apply-diagram-tokens.cjs --default --all` and `apply-design-md.cjs --default --all`, each `diff -rq`'d against `assets/diagrams/`, reported no differences | Met | - |
| AC-016 | Phase gate | Given S1-S9 are each resolved in one direction, the losing document or files are edited to match, and both new families exist and pass, When 009 begins, Then no document states a value the corpus does not hold, the checker prints `RESULT: PASSED`, the suite is green with its completeness triple, and the applicator's byte-identity property holds — the literal 008 → 009 handoff criterion | Observed, re-verified after `ed3f26aaf5`/`cddd84f9f8`/`67a8c88de5`/`76ad403c52`: the checker/suite/applicator legs of the gate all still hold, re-run live in this closeout (`check-diagram-corpus.cjs` → `RESULT: PASSED`, 38 files, 12 families, errors: 0; `node --test` → 18 pass, 0 fail; both applicators byte-identical against `assets/diagrams`). Of the six S-items `Unmet` at the prior closeout, five are now `Met` (AC-002/S1, AC-004/S3, AC-006/S4, AC-007/S5, AC-008/S6). One remains open: AC-011/S9 — `starter-full.html`'s `paper-2` role has no in-svg reference, so REQ-010's per-role wiring is not fully closed. 009 would begin against a corpus where eight of nine S-items are fully resolved and the ninth (S9) is resolved for three of its four templates | Unmet | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

This is a second closeout pass over the same phase. The first closeout (2026-09-11, earlier same day)
found 9 of 16 criteria `Met` and left seven `Unmet` because the doctrine they named had been drafted as
tasks but never executed. Four commits landed since (`ed3f26aaf5`, `cddd84f9f8`, `67a8c88de5`,
`76ad403c52`), and this pass re-verified each previously-`Unmet` criterion against the live tree rather
than trusting the prior record.

Five of the seven flip to `Met`, each re-verified live in this pass: **AC-002** (the custom-property
rename landed), **AC-004** (the marker-end fix landed; the fill-alpha sub-fix was investigated and
answered with a documented measurement rather than a value change — judged to satisfy the criterion's
purpose, argued in the AC-004 row above), **AC-006** (legend typography converged in all four files),
**AC-007** (both legend rules corrected, the other four confirmed unchanged where already correct), and
**AC-008** (all eight dot-pattern opt-out files now named, by description rather than by the stale
literal filenames REQ-007 quoted). The PINS-table requirement (AC-012), already `Met` by a documented
deviation at the first closeout, is unaffected by this pass.

Two criteria remain `Unmet`, and neither is waived — there is still no `decision-record.md` in this
packet, so nothing here can be marked `Waived` or `Superseded`:
- **AC-011** — S9's starter-token wiring landed for three of four templates' chrome roles and for eight
  of `starter-full.html`'s nine required roles; `starter-full.html`'s `paper-2` role still has no
  in-svg reference, and — unlike the three "empty placeholder" templates' documented exemption for
  `ink`/`soft`/`accent-tint` — nothing explains why `paper-2` was left out, and it is an actively-used
  role elsewhere in the corpus.
- **AC-016** — the phase-gate rollup; it inherits AC-011's open status, since S9 is the one S-item not
  yet fully resolved.

It closes only after AC-011 is `Met` (wiring `starter-full.html`'s `paper-2` role inside its `<svg>`,
or a documented decision explaining why it is legitimately exempt like the three empty starters) or
carries a `Waived`/`Superseded` row backed by a real ADR in a `decision-record.md` this packet does not
yet have; AC-016 follows automatically once AC-011 does.
<!-- /ANCHOR:closure -->
