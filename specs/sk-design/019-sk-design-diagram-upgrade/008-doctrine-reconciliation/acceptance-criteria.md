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
| AC-001 | REQ-001 | Given `style-guide.md` names only radar as the series-palette's chart type and four non-chart files already use it, When the section is widened, Then it reads "multi-series charts plus typed-chip vocabularies" and names all six real users | Observed: `style-guide.md:56` reads "Series palette (multi-series charts and typed-chip vocabularies)"; `:58` names `radar`/`line` as chart users and `data-flow`/`process`/`dp-integration`/`it-state` as typed-chip users — all six present, landed in `62d4e1e293` | Met | - |
| AC-002 | REQ-001 | Given `example-dp-integration.html` names two hues `--custom-red`/`--custom-blue` that are actually rust-brown and dusty-blue, When the properties are renamed, Then no hex value changes and the file renders identically | Observed: `grep -c "custom-red\|custom-blue" assets/diagrams/dp-integration.html` reports `4`, not `0` — `--custom-red`/`--custom-red-fill`/`--custom-red-stroke`, `--custom-blue`/`--custom-blue-fill`/`--custom-blue-stroke`, and the `.footer-red*`/`.footer-blue*` classes are all still present verbatim; never renamed | Unmet | - |
| AC-003 | REQ-002 | Given ten files paint `soft` as a `<text>` fill against the recorded departure, When every named instance is repointed, Then each reads `fill="#4f5d75"` (or the equivalent CSS-class value for `example-dp-security-matrix.html`) and no `soft` stroke or tint changed | Observed: `grep -rc '<text[^>]*fill="#7a8399"' assets/diagrams/*.html` reports `0` in every file; `dp-security-matrix.html:20` reads `.value.none-text{fill:#4f5d75}`; `derivation-record.md:109`'s recorded `soft` departure (3.48:1, structural only) unchanged | Met | - |
| AC-004 | REQ-003 | Given `template-full.html`'s two legend dash arrays and `example-high-level.html`'s two markerless legend lines and the three indistinguishable legend fills in two files, When each is corrected, Then every legend swatch matches its keyed element and the node-type-treatment table in `style-guide.md` §4 is untouched | Observed: the dash-array pair is corrected (`starter-full.html:354` = `5,4`, `:360` = `4,4`, matching their real elements — landed via `c1f109bfe4`); but `high-level.html:293,296` still carry no `marker-end`, and `starter-full.html`/`architecture.html`'s legend-swatch fills are still `0.03`/`0.05`/`0.10`, not the required `0.05`/`0.08`/`0.14` — two of three sub-fixes never landed | Unmet | - |
| AC-005 | REQ-004 | Given the corpus is green under the existing ten families, When `legend-fidelity.cjs` is added and registered, Then it asserts every legend swatch's dash array against the file's own drawing elements and the corpus still prints `RESULT: PASSED` | Observed: live `node scripts/check-diagram-corpus.cjs` run — `legend-fidelity: 18 assertion(s), 0 failure(s)`, part of a twelve-family `RESULT: PASSED` | Met | - |
| AC-006 | REQ-005 | Given four files carry UPPERCASE or lowercase mono legend entry text against the majority sentence-case sans form, When each is converged, Then the entry text reads sentence-case Geist sans and the "LEGEND" eyebrow heading stays mono uppercase in every file, including the four just changed | Observed: `import-drawio.html`, `import-mermaid.html` still paint `FOCAL`/`SERVICE`/`STORE`/`CLIENT`/`DECISION`/`INPUT` in uppercase Geist Mono; `org-chart.html` still paints "front door"/"pod / owner" in Geist Mono; `it-state.html:27`'s shared `.legend-label` mono rule was never split — none of the four files were touched | Unmet | - |
| AC-007 | REQ-006 | Given `example-er.html` and `example-high-level.html`'s legend rules stop short of their own drawing's content, When each is corrected to that drawing's bounding box, Then the rule spans at least as wide as the widest content element and the other four audited files are unchanged wherever `40`/`960` already matched | Observed: `er.html:178` and `high-level.html:281` both still read `x2="960"`, the pre-fix value — never corrected | Unmet | - |
| AC-008 | REQ-007 | Given `style-guide.md` states the dot pattern is optional and not default against a corpus that ships it in 26 of 34 files, When the sentence is rewritten, Then it states the pattern is on by default and names all eight opt-out files | Observed: `style-guide.md:158` states "Dot pattern is the default ground" and cites "26 of the 34 shipped forms" / "eight forms do" (drop it) — the default-status half landed, but none of the eight opt-out files is named individually; `grep` for any of the eight filenames against `style-guide.md` returns no hits | Unmet | - |
| AC-009 | REQ-008 | Given `derivation-record.md` and `style-guide.md` both state light `rule-solid` as `#bfc0c0` against the template's actual `rgba(79,93,117,0.25)` and `diagram-palette.json`'s already-correct entry, When both documents are corrected and the `#f7591f` citation is removed, Then all three sources agree | Observed: `derivation-record.md:42` and `style-guide.md:43` both read `rgba(79,93,117,0.25)` / `derived: muted at 0.25`; `grep -c "f7591f" style-guide.md` reports `0` | Met | - |
| AC-010 | REQ-009 | Given 007's F4/F6/F14 close three named instances of a mask erasing a short connector, When `short-connector-labels.cjs` is added and run against the full corpus, Then it reports zero failures, including for any further instance it surfaces beyond the three named ones | Observed: live run — `short-connector-labels: 64 assertion(s), 0 failure(s)`; `f3bf733cf4` fixed a real 52px instance in `dp-integration.html` (the AUTH label's mask removed) beyond F4/F6/F14, per its commit message and the diff | Met | - |
| AC-011 | REQ-010 | Given all four templates declare roles that paint from a literal or have no presence inside the `<svg>` at all, When each template's `<style>` block gains a CSS class per role, Then every declared role except `link` has at least one `var(--color-<role>)` reference between that file's `<svg` and `</svg>` tags | Observed: a scoped `awk '/<svg viewBox/,0'` sweep of `starter-light.html`, `starter-dark.html`, `starter-terminal.html` and `starter-full.html` finds only `var(--color-link)` (`starter-terminal.html` finds none at all) — none of the other declared roles gained an in-svg reference; T012-T014 never executed | Unmet | - |
| AC-012 | REQ-011 | Given `derivation-record.md` §6 pins four template files by sha256, When this phase edits one or more of them, Then the table's hash for each edited file matches the file's current content | Observed, with a documented deviation: `c0f1ad041c` deleted the PINS table entirely rather than recomputing it ("nothing read the pins, all four were stale, and byte-identity already catches what they claimed to"); `derivation-record.md` §6 now explains the applicator's byte-identity check does the pins' job without upkeep — there is no table left that could state a stale hash, so REQ-011's normative purpose holds even though the literal recompute step never ran | Met | - |
| AC-013 | REQ-012 | Given the mutation suite's completeness triple requires a case per registered family, When `legend-fidelity` and `short-connector-labels` are added, Then `mutation-cases.cjs` carries one case for each and the triple reports both covered | Observed: live `node --test scripts/tests/` — `legend-fidelity refuses a legend swatch keying a dash the drawing never paints` and `short-connector-labels refuses a label mask shifted onto a short connector` both pass, plus `every family the checker registers has a case here, or a stated reason it cannot` passes | Met | - |
| AC-014 | REQ-013 | Given every S1-S9 fix and both new families are in place, When the corpus check and the mutation suite run, Then the checker prints `RESULT: PASSED` with twelve families and `node --test` exits `0` | Observed: live run — `check-diagram-corpus.cjs` → `Diagram corpus: 38 files, 12 families` / `Summary: errors: 0` / `RESULT: PASSED`; `node --test scripts/tests/` → `tests 16 pass 16 fail 0` | Met | - |
| AC-015 | REQ-014 | Given every edit in this phase is either a documented sentence or a hex/rgba value already recognized as a role, When the applicator runs in `--default` and `--default --examples` mode, Then its output is byte-for-byte identical to the shipped corpus | Observed, with a path deviation: the current flags are `--default --all --out <tmp>` (`assets/examples/`+`assets/templates/` merged into `assets/diagrams/` after this phase was authored); live `apply-diagram-tokens.cjs --default --all` and `apply-design-md.cjs --default --all`, each `diff -rq`'d against `assets/diagrams/`, reported no differences | Met | - |
| AC-016 | Phase gate | Given S1-S9 are each resolved in one direction, the losing document or files are edited to match, and both new families exist and pass, When 009 begins, Then no document states a value the corpus does not hold, the checker prints `RESULT: PASSED`, the suite is green with its completeness triple, and the applicator's byte-identity property holds — the literal 008 → 009 handoff criterion | Observed: the checker/suite/applicator legs of the gate all hold (AC-005, AC-013, AC-014, AC-015), but the first clause — "S1-S9 are each resolved in one direction, the losing document or files are edited to match" — does not: AC-002, AC-004, AC-006, AC-007, AC-008 and AC-011 are `Unmet`, so 009 would begin against a corpus that does not yet match every doctrine the review resolved | Unmet | - |

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

This is a closeout pass, not the original authoring: T001-T024 have run (partially), and this
document was re-read against the live corpus. Nine of sixteen criteria are `Met` — the doc corrections
that landed (S1's scope widening, S7, S6's default-status half), both new checker families
(`legend-fidelity`, `short-connector-labels`) with their mutation cases, the twelve-family corpus
check, the mutation suite, and the applicator's byte-identity property all hold, verified live. The
PINS-table requirement (AC-012) is `Met` by a documented deviation: the table was deleted rather than
recomputed, which satisfies its normative purpose without the literal recompute step.

Seven criteria remain `Unmet`, and none is waived — there is no `decision-record.md` in this packet, so
nothing here can be marked `Waived` or `Superseded`:
- **AC-002** — `example-dp-integration.html`'s `--custom-red`/`--custom-blue` properties were never renamed.
- **AC-004** — `example-high-level.html`'s two markerless legend lines and the three legend-fill alphas in `starter-full.html`/`example-architecture.html` were never corrected (only the dash-array half of S3 landed).
- **AC-006** — none of the four S4 files' legend typography was converged.
- **AC-007** — `example-er.html`/`example-high-level.html`'s legend rules were never corrected to their content bounding box.
- **AC-008** — the dot-pattern default is stated, but the eight opt-out files are not named individually.
- **AC-011** — S9's starter-token wiring never landed in any of the four templates; only the pre-existing `link` role (007's F32) has an in-svg reference.

It closes only after these six are each `Met` or carry a `Waived`/`Superseded` row backed by a real
ADR in a `decision-record.md` this packet does not yet have.
<!-- /ANCHOR:closure -->
