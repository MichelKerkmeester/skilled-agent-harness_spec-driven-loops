---
title: "Acceptance Criteria: Phase 9: one-form-library"
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
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/009-one-form-library"
    last_updated_at: "2026-09-11T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for phase 9"
    next_safe_action: "Meet AC-001 through AC-014 during execution"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/009-one-form-library/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-009-one-form-library"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 9: one-form-library

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 009-one-form-library
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
| AC-001 | REQ-001 | Given the pre-move corpus, When the four starters and 34 forms are `git mv`-ed and renamed, Then `assets/diagrams/` holds exactly 38 `.html` files and neither `assets/templates/` nor `assets/examples/` exists | `find assets/diagrams -name "*.html" \| wc -l` = 38; `test -d assets/templates` and `test -d assets/examples` both fail | Unmet | - |
| AC-002 | REQ-001 | Given a moved file, When its history is queried, Then `git log --follow` reaches the pre-move commit | `git log --follow -- assets/diagrams/<file>` on a sampled starter and form | Unmet | - |
| AC-003 | REQ-002 | Given the rewritten applicator, When run with `--default --all --out <tmp>`, Then it reproduces every file under `assets/diagrams/` byte for byte except the recorded untokenized exception | `diff -rq --exclude=sequence-oauth-dark.html <tmp> assets/diagrams` is empty | Unmet | - |
| AC-004 | REQ-002 | Given the rewritten applicator, When `--forms` and `--all` are both supplied, Then it fails closed with the same guard `apply-design-md.cjs` uses | `node scripts/apply-diagram-tokens.cjs --default --forms x --all --out <tmp>` exits non-zero with an error naming the conflict | Unmet | - |
| AC-005 | REQ-003 | Given a starter file and a form file both under `assets/diagrams/`, When the applicator paints each, Then the starter is painted by sentinel-block substitution and the form by literal-hex remapping, chosen by basename, not by source directory | `node scripts/apply-diagram-tokens.cjs --default --forms starter-light,architecture --out <tmp>` succeeds and both outputs are correct for their kind | Unmet | - |
| AC-006 | REQ-004 | Given the rewritten checker, When run against a starter and a form, Then each carries the `kind` its basename implies, matching the pre-move `kind` each file carried by directory | `node scripts/check-diagram-corpus.cjs` reports the same `accessible-svg`, `derivation-gates`, and `marker-vocabulary` finding counts as the pre-move baseline | Unmet | - |
| AC-007 | REQ-005 | Given the merged directory, When `catalog-bidirectional` runs its reverse-direction loop, Then none of the four starters is flagged for having no catalog row | `check-diagram-corpus.cjs`'s `catalog-bidirectional` family reports zero findings against the four starter filenames | Unmet | - |
| AC-008 | REQ-006 | Given `references/catalog.md`'s sentinel table, When every cell is repointed, Then the table's row count, header shape, and bidirectional resolution are unchanged | `catalog-bidirectional` family reports zero dangling rows and zero orphaned files | Unmet | - |
| AC-009 | REQ-007 | Given the two source READMEs, When they are merged, Then `assets/diagrams/README.md` exists, both old READMEs do not, and every relative link in the merged file resolves | `test -f assets/diagrams/README.md`; `test -f assets/templates/README.md` and `test -f assets/examples/README.md` both fail; every markdown link target exists | Unmet | - |
| AC-010 | REQ-008 | Given `diagram-palette.json`, When its `pins`, `examples.skinByFile`, and `examples.untokenized` values are repointed, Then no other key is renamed or restructured | `git diff` over the file touches only the path/filename string values, not the JSON's key structure | Unmet | - |
| AC-011 | REQ-009 | Given `grid-baseline.json`, When its 24 path keys are repointed, Then every recorded violation count and pixel value is byte-identical to before the move | `git diff` shows only key renames, no value changes | Unmet | - |
| AC-012 | REQ-010 | Given `mutation-cases.cjs`, When its 8 file references are repointed, Then `node --test scripts/tests/` still passes, including the whole-corpus precondition and the completeness triple | `node --test scripts/tests/` exits 0 | Unmet | - |
| AC-013 | REQ-011 | Given the CI workflow, When its two applicator steps collapse into one, Then a push to this branch runs green: corpus check, the single applicator step, and the mutation suite | A CI run on this branch shows all three steps green | Unmet | - |
| AC-014 | REQ-012, REQ-013, REQ-014 | Given the full skill tree and `.github/workflows`, When every prose reference, the screenshot directories, and the two checker-family rewordings are done, Then no file outside a changelog entry still names the old paths | `rg -n "assets/(examples\|templates)" .opencode/skills/sk-design/sk-design-diagram .github/workflows` returns nothing outside a changelog entry | Unmet | - |

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

All fourteen criteria are `Unmet` pending execution. This document was authored against the phase's
requirements and the on-disk inventory in `plan.md`; none of the moves, rewrites, or repoints have
run yet. Write the closing paragraph here once execution completes and every row above reads `Met`.
<!-- /ANCHOR:closure -->
