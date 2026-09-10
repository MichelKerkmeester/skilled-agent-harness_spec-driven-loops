---
title: "Acceptance Criteria: Phase 5: checker-mutations-and-ci"
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
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci"
    last_updated_at: "2026-09-10T23:15:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for phase 5"
    next_safe_action: "Meet, waive or supersede the open criteria once T001-T024 execute"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-005-checker-mutations-and-ci"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 5: checker-mutations-and-ci

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/019-sk-design-diagram-upgrade/005-checker-mutations-and-ci
**Level:** 3
**Status:** Draft
**Date:** 2026-09-10
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the diagram skill has no checker today, When `check-diagram-corpus.cjs` is built, Then it registers a family for every assertion group and prints a final `RESULT: PASSED`/`RESULT: FAILED` line | `node scripts/check-diagram-corpus.cjs` output, tee'd to a log; `grep -q 'RESULT: PASSED'` on that log | Unmet | - |
| AC-002 | REQ-002 | Given the chart's own family count drifted (documented 42, actual 47), When the diagram checker's family count is read, Then it comes from the registry's own key count, not a hand-written document | `node -e` reading the registry export's key length against the checker's own printed family count | Unmet | - |
| AC-003 | REQ-003 | Given `example-high-level.html`'s 13 `<svg>` elements (1 frame + 12 `aria-hidden` icons), When the `accessible-svg` family runs against the flattened source, Then it scopes title-first to the first `<svg role="img">` and reports the file as passing | `accessible-svg` family output for `example-high-level.html`; a mutation case removing the frame's `<title>` fails the family, a mutation case adding a `<title>` to an icon glyph does not change the result | Unmet | - |
| AC-004 | REQ-004 | Given 002 T003 signed "define only what you draw, per file" and per-file id uniqueness, When the `marker-vocabulary` and `unique-ids` families run against the repainted corpus, Then both report zero violations | `marker-vocabulary` and `unique-ids` family output; `grep -c 'id="dots"'` per-file uniqueness confirmed by the family, not by a fresh grep | Unmet | - |
| AC-005 | REQ-005 | Given `example-high-level.html`'s 36 raw `<rect>` elements versus its tagged node count, When the `node-budget` family runs, Then it reports the `data-diagram-node`-tagged count, not 36 | `node-budget` family output for `example-high-level.html`; a mutation case adding an untagged `<rect>` does not change the reported budget | Unmet | - |
| AC-006 | REQ-006 | Given no font-exception precedent exists in the chart and `assets/icons.html` is a 39th, previously-unscoped file, When the `no-external` family runs, Then it allows exactly `fonts.googleapis.com` and treats `icons.html` as in-corpus for the allowlist per 002 T006 | `no-external` family output; a mutation case adding a second remote host fails the family; `icons.html`'s allowlist pass/fail state matches 002 T006's decision | Unmet | - |
| AC-007 | REQ-007 | Given `DIAGRAM_PALETTE` sentinel blocks across light/dark/terminal grounds, When the `derivation-gates` family re-derives contrast through `channel`/`luminance`/`contrast`/`round2`, Then it never compares the sentinel's stated value against itself, and the accent's 2.863:1 passes as a recorded departure | `derivation-gates` family output; a mutation case changing a paint attribute without updating the sentinel's stated value fails the family; the accent's own check does not fail against AA-4.5 | Unmet | - |
| AC-008 | REQ-008 | Given `references/catalog.md` and `assets/examples/`, When the `catalog-bidirectional` family runs, Then it reports zero dangling rows and zero orphaned files | `catalog-bidirectional` family output; a mutation case renaming a catalog row's file reference fails the family | Unmet | - |
| AC-009 | REQ-009 | Given `example-radar.html`'s by-design diagonal spokes and `example-high-level.html`'s `aria-hidden` icon diagonal, When the `orthogonal-connectors` family runs with its type-aware allowlist, Then both are excluded and a real connector-layer diagonal still fails | `orthogonal-connectors` family output for both named files; a mutation case introducing a diagonal on the connector layer itself fails the family | Unmet | - |
| AC-010 | REQ-010 | Given D5's signed exemption list (font sizes, derived label offsets) and `example-flowchart.html`'s corrected violation set, When the `grid-4px` family runs post-repaint, Then it reports the file clean | `grid-4px` family output for `example-flowchart.html`; a mutation case moving a non-exempt coordinate off-grid fails the family | Unmet | - |
| AC-011 | REQ-011 | Given the checker cannot statically hold pairwise connector geometry, focal balance, type fit, the remove test, or taste, When the judged boundary is registered, Then it is named in plain prose with a one-way graduation rule, and the checker asserts none of the five as a family | Direct read of the judged-boundary block in `check-diagram-corpus.cjs`; the family registry (AC-002) contains no family named for any of the five | Unmet | - |
| AC-012 | REQ-012 | Given 002 T010 already collapsed five version loci to one, When the `metadata` family runs, Then it confirms the collapse is still intact | `metadata` family output; a mutation case reintroducing a second version locus fails the family | Unmet | - |
| AC-013 | REQ-013 | Given every mutation case assumes a green starting point, When `corpus-mutations.test.cjs` runs, Then its first assertion is that the checker prints `RESULT: PASSED` against the unmutated corpus | `node --test scripts/tests/corpus-mutations.test.cjs` output showing the whole-corpus precondition assertion runs and passes before any case | Unmet | - |
| AC-014 | REQ-014 | Given a mutation case with a missing anchor, a no-op change, an already-failing base, or a wrong-family failure, When the four refusal guards run, Then each refuses the case with a distinct, named reason | Four dedicated guard-test cases in `corpus-mutations.test.cjs`, one per refusal, each asserting its own refusal message | Unmet | - |
| AC-015 | REQ-015 | Given ten registered families, When the mutation suite and its completeness triple run, Then every family has a case or a stated reason, nothing names an unregistered family, and no exemption outlives its family | `node --test scripts/tests/` full output; the completeness-triple case's own pass/fail result | Unmet | - |
| AC-016 | REQ-016 | Given `.github/workflows/diagram-corpus.yml` does not exist today, When it is built, Then its corpus-check step greps the literal `RESULT: PASSED` and its second step runs the mutation suite, mirroring `chart-corpus.yml` without touching it | `test -f .github/workflows/diagram-corpus.yml`; `git diff` over `sk-design-chart/` is empty; a CI run on this branch is green | Unmet | - |
| AC-017 | Phase gate | Given the checker, its mutation suite and its CI workflow all exist, When 006 begins, Then every registered family has a case or a reasoned exemption, every mutant fails its named family, and CI is green with no backlog — the literal 005 → 006 handoff criterion | The suite's own completeness tests; the most recent CI run on this branch; `check-diagram-corpus.cjs` printing `RESULT: PASSED` | Unmet | - |

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
observationally `Unmet` by construction. It closes only after 004's repaint is confirmed green on
disk (T001), the ten families are built and proven against the real corpus in one `RESULT: PASSED`
run that doubles as 004's own dress-run gate (T004-T017), the mutation suite's whole-corpus
precondition, four refusals, per-family cases and completeness triple all pass locally (T018-T021,
T023), the CI workflow is built and confirmed green with no backlog (T022, T024), and this document
is re-read with every row moved to `Met`.
<!-- /ANCHOR:closure -->
