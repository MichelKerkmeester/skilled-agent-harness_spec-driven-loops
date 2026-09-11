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
    recent_action: "Authored the acceptance criteria for phase 8"
    next_safe_action: "Meet, waive or supersede the open criteria once T001-T024 execute"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/008-doctrine-reconciliation/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-008-doctrine-reconciliation"
      parent_session_id: null
    completion_pct: 0
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
| AC-001 | REQ-001 | Given `style-guide.md` names only radar as the series-palette's chart type and four non-chart files already use it, When the section is widened, Then it reads "multi-series charts plus typed-chip vocabularies" and names all six real users | `grep -n "typed-chip" style-guide.md`; direct read confirming `example-radar.html`, `example-line.html`, `example-data-flow.html`, `example-process.html`, `example-dp-integration.html`, `example-it-state.html` are all named | Unmet | - |
| AC-002 | REQ-001 | Given `example-dp-integration.html` names two hues `--custom-red`/`--custom-blue` that are actually rust-brown and dusty-blue, When the properties are renamed, Then no hex value changes and the file renders identically | `grep -c "custom-red\|custom-blue"` reports `0`; a fresh render of the file is pixel-identical to the pre-edit render | Unmet | - |
| AC-003 | REQ-002 | Given ten files paint `soft` as a `<text>` fill against the recorded departure, When every named instance is repointed, Then each reads `fill="#4f5d75"` (or the equivalent CSS-class value for `example-dp-security-matrix.html`) and no `soft` stroke or tint changed | `grep -c '<text[^>]*fill="#7a8399"'` reports `0` in each of the nine HTML-attribute files; `example-dp-security-matrix.html`'s `.value.none-text` rule reads `fill:#4f5d75` | Unmet | - |
| AC-004 | REQ-003 | Given `template-full.html`'s two legend dash arrays and `example-high-level.html`'s two markerless legend lines and the three indistinguishable legend fills in two files, When each is corrected, Then every legend swatch matches its keyed element and the node-type-treatment table in `style-guide.md` §4 is untouched | Direct read of the four corrected lines in `template-full.html` and `example-high-level.html`; `git diff` shows no edit to `style-guide.md` §4; a fresh render of both files shows the legend now reads clearly | Unmet | - |
| AC-005 | REQ-004 | Given the corpus is green under the existing ten families, When `legend-fidelity.cjs` is added and registered, Then it asserts every legend swatch's dash array against the file's own drawing elements and the corpus still prints `RESULT: PASSED` | `node scripts/check-diagram-corpus.cjs` output showing `legend-fidelity` in the twelve-family list with `0` failures | Unmet | - |
| AC-006 | REQ-005 | Given four files carry UPPERCASE or lowercase mono legend entry text against the majority sentence-case sans form, When each is converged, Then the entry text reads sentence-case Geist sans and the "LEGEND" eyebrow heading stays mono uppercase in every file, including the four just changed | Direct read of the corrected `<text>` elements in all four files; a fresh render of each shows the heading unchanged and the entries in the majority style | Unmet | - |
| AC-007 | REQ-006 | Given `example-er.html` and `example-high-level.html`'s legend rules stop short of their own drawing's content, When each is corrected to that drawing's bounding box, Then the rule spans at least as wide as the widest content element and the other four audited files are unchanged wherever `40`/`960` already matched | Direct read of the corrected `x2` values against each file's widest content `x`/`x+width`; `git diff` confirms `example-architecture.html`, `example-timeline.html`, `example-quadrant.html` carry no edit unless their own audit found a real mismatch | Unmet | - |
| AC-008 | REQ-007 | Given `style-guide.md` states the dot pattern is optional and not default against a corpus that ships it in 26 of 34 files, When the sentence is rewritten, Then it states the pattern is on by default and names all eight opt-out files | `grep -n "on by default" style-guide.md`; the eight named files match exactly `dp-security-matrix`, `import-drawio`, `import-mermaid`, `it-state`, `medallion`, `org-chart`, `quadrant-consultant`, `venn` | Unmet | - |
| AC-009 | REQ-008 | Given `derivation-record.md` and `style-guide.md` both state light `rule-solid` as `#bfc0c0` against the template's actual `rgba(79,93,117,0.25)` and `diagram-palette.json`'s already-correct entry, When both documents are corrected and the `#f7591f` citation is removed, Then all three sources agree | `grep -n "rule-solid"` in both documents shows the corrected row; `grep -c "f7591f" style-guide.md` reports `0` | Unmet | - |
| AC-010 | REQ-009 | Given 007's F4/F6/F14 close three named instances of a mask erasing a short connector, When `short-connector-labels.cjs` is added and run against the full corpus, Then it reports zero failures, including for any further instance it surfaces beyond the three named ones | `node scripts/check-diagram-corpus.cjs` output showing `short-connector-labels` in the twelve-family list with `0` failures; a diff against the three F-numbered files confirms no re-fix collided with 007's own edits | Unmet | - |
| AC-011 | REQ-010 | Given all four templates declare roles that paint from a literal or have no presence inside the `<svg>` at all, When each template's `<style>` block gains a CSS class per role, Then every declared role except `link` has at least one `var(--color-<role>)` reference between that file's `<svg` and `</svg>` tags | A scoped grep (`awk '/<svg viewBox/,0'` piped to `grep -c 'var(--color-<role>)'`) for every declared role in each of the four templates reports `≥1` | Unmet | - |
| AC-012 | REQ-011 | Given `derivation-record.md` §6 pins four template files by sha256, When this phase edits one or more of them, Then the table's hash for each edited file matches the file's current content | `shasum -a 256` on each edited template equals the corresponding row in `derivation-record.md` §6 | Unmet | - |
| AC-013 | REQ-012 | Given the mutation suite's completeness triple requires a case per registered family, When `legend-fidelity` and `short-connector-labels` are added, Then `mutation-cases.cjs` carries one case for each and the triple reports both covered | `node --test scripts/tests/` output showing the completeness-triple test passing with both new families in the covered set | Unmet | - |
| AC-014 | REQ-013 | Given every S1-S9 fix and both new families are in place, When the corpus check and the mutation suite run, Then the checker prints `RESULT: PASSED` with twelve families and `node --test` exits `0` | `node scripts/check-diagram-corpus.cjs` and `node --test scripts/tests/` output, both read directly | Unmet | - |
| AC-015 | REQ-014 | Given every edit in this phase is either a documented sentence or a hex/rgba value already recognized as a role, When the applicator runs in `--default` and `--default --examples` mode, Then its output is byte-for-byte identical to the shipped corpus | `diff -rq` between the applicator's temp output and the shipped `assets/templates/` and `assets/examples/` directories reports no differences | Unmet | - |
| AC-016 | Phase gate | Given S1-S9 are each resolved in one direction, the losing document or files are edited to match, and both new families exist and pass, When 009 begins, Then no document states a value the corpus does not hold, the checker prints `RESULT: PASSED`, the suite is green with its completeness triple, and the applicator's byte-identity property holds — the literal 008 → 009 handoff criterion | A corpus-wide grep for each corrected claim; the most recent local run of the checker, suite and applicator; `validate.sh` `RESULT: PASSED` for this folder | Unmet | - |

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

This packet is authored, not executed: T001-T024 have not run, so every AC row above is
observationally `Unmet` by construction. It closes only after 007's F4/F6/F14/F17/F22/F26/F31/F32
fixes are confirmed present (T002), all nine systemic patterns are resolved in their stated
direction (T004-T015), the two new checker families exist, are registered against an already-green
corpus, and carry a mutation case each (T016-T021), the full corpus check and mutation suite both
pass (T022), the applicator's byte-identity property holds (T023), a corpus-wide grep confirms no
residual wrong claim (T024), and this document is re-read with every row moved to `Met`.
<!-- /ANCHOR:closure -->
