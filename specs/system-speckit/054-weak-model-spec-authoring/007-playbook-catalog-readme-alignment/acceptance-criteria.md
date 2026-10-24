---
title: "Acceptance Criteria: Phase 7: playbook-catalog-readme-alignment"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "playbook catalog readme alignment acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment"
    last_updated_at: "2026-10-23T15:55:00Z"
    last_updated_by: "author"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: playbook-catalog-readme-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment
**Level:** 3
**Status:** Complete
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the eight scenario files, When T004 and T009 have run, Then each file has five sections in order and the package validator reports no violation | `for f in placeholder-token-warning-while-draft placeholder-token-error-after-draft placeholder-gate-legacy-stamp-unchanged example-drift-guard-catches-leak golden-render-all-levels authoring-card-router-intents authoring-card-sync-guard level-1-packet-authored-from-card; do grep -c '^## ' .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/$f.md; done` prints `5` eight times | Met | - |
| AC-002 | REQ-002 | Given the playbook root, When T007 has run, Then each id 476 to 483 appears once in a Section 7 row | `for id in 476 477 478 479 480 481 482 483; do rg -c "^\| $id \|" .skilled/skills/system-spec-kit/manual-testing-playbook/manual-testing-playbook.md; done` prints `1` eight times | Met | - |
| AC-003 | REQ-003 | Given the four leaves and the root catalog, When T005 and T008 have run, Then each root H3 title and description matches its leaf | `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package system-spec-kit` prints the `PACKAGE system-spec-kit: PASS tier=fail violations=0` verdict with exit 0 and the same two baseline `note` entries as the start tree (the `PASS: 0 violations` line cannot print while those notes exist in files this phase does not own) | Met | - |
| AC-004 | REQ-004 | Given the catalog package, When T010 has run, Then the package validator reports no violation | The same command prints the `PACKAGE system-spec-kit: PASS tier=fail violations=0` verdict, exits 0 and adds no note, warn or fail beyond the start tree | Met | - |
| AC-005 | REQ-005 | Given `README.md`, When T006 has run, Then it names the value token, the card and the two guards and holds no `PLACEHOLDER` instruction | `rg -c 'PLACEHOLDER' .skilled/skills/system-spec-kit/README.md` prints nothing, and `rg -c 'YOUR_VALUE_HERE' .skilled/skills/system-spec-kit/README.md` prints at least `1` | Met | - |
| AC-006 | REQ-006 | Given `templates/README.md`, When T006 has run, Then it states the v2.3 token rule and holds the three literal checks | `rg -c 'EXAMPLE_DRIFT_OK' .skilled/skills/system-spec-kit/templates/README.md` prints `1` and `rg -c 'stamped v2.3' .skilled/skills/system-spec-kit/templates/README.md` prints `1` | Met | - |
| AC-007 | REQ-007 | Given the four reference files, When T006 has run, Then each describes the current behavior and `template-guide.md` keeps the phase 3 text | `rg -c 'Lifecycle For Docs Stamped v2.3 Or Later' .skilled/skills/system-spec-kit/references/validation/validation-rules.md` prints `1`, and `rg -c 'PLACEHOLDER\]' .skilled/skills/system-spec-kit/references/templates/template-guide.md` prints nothing | Met | - |
| AC-008 | REQ-008 | Given every edited document and every new catalog leaf, When T011 has run, Then each prints `VALID` | `grep -c 'VALID:' scratch/validation/docs.txt` prints `12`, and `grep -c 'INVALID' scratch/validation/docs.txt` prints `0` | Met | - |
| AC-009 | REQ-009 | Given the suite, When T012 has run, Then the provenance test prints 3 passed and the vocabulary test prints 2 passed | `grep -c 'Tests  3 passed (3)' scratch/validation/provenance.txt` prints `1` and `grep -c 'Tests  2 passed (2)' scratch/validation/vocabulary.txt` prints `1` | Met | - |
| AC-010 | REQ-010 | Given the start and end suite runs, When T014 has run, Then the `Test Files`, `Tests` and `exit=` lines are identical and the exit line matches phase 001 | `diff scratch/baseline/suite-lines-start.txt scratch/baseline/suite-lines-end.txt` prints nothing and `diff scratch/baseline/suite-exit-start.txt scratch/baseline/suite-exit-end.txt` prints nothing and `diff scratch/baseline/suite-exit-phase1.txt scratch/baseline/suite-exit-end.txt` prints nothing | Met | - |
| AC-011 | REQ-011 | Given the phase is closing, When `git status --porcelain` is compared with `status-start.txt`, Then only declared paths differ | T017 status diff | Met | - |
| AC-012 | REQ-012 | Given the diff, When the frontier review in T015 returns, Then each finding is applied or recorded with a reason | `scratch/review/T015.txt` and the T016 count in `goal.md` section 4 | Met | - |

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

**Closeable:** Yes

Every row above is Met. Evidence observed on 2026-10-24:

- AC-001: Observed: the eight-file loop printed `5` for each scenario, and the playbook validator printed `PASS package=system-spec-kit ... scenarios=110 categories=11 operator=96 violations=0 warnings=1` with `exit=0` (`scratch/validation/playbook.txt`).
- AC-002: Observed: the id loop printed `1` for each of 476 to 483 and the hygiene file printed `ids=8`, `category_links=9`.
- AC-003: Observed: the catalog validator printed `PACKAGE system-spec-kit: PASS tier=fail violations=0` and `exit=0`. The four root headings printed `1` each and the four leaf links printed `4`.
- AC-004: Observed: the same verdict line and exit 0, with only the two baseline `ignored_path_absent` notes. `diff` of the start and end outputs printed `CATALOG_NOTES_SAME` (`scratch/baseline/catalog-start.txt`, `scratch/validation/catalog.txt`).
- AC-005: Observed: `rg -c 'PLACEHOLDER' README.md` printed nothing (rg exit 1) and `grep -c 'YOUR_VALUE_HERE'` printed `2`.
- AC-006: Observed: `rg -c 'EXAMPLE_DRIFT_OK'` and `rg -c 'stamped v2.3'` on `templates/README.md` each printed `1`.
- AC-007: Observed: the lifecycle heading count in `validation-rules.md` printed `1` and `PLACEHOLDER\]` in `template-guide.md` printed `0` (rg prints nothing). The 14 edits each matched exactly once (`scratch/frozen/edits-applied.json`).
- AC-008: Observed: `grep -c 'VALID:' scratch/validation/docs.txt` printed `12` and `grep -c INVALID` printed `0`.
- AC-009: Observed: `Tests  3 passed (3)` in `provenance.txt` and `Tests  2 passed (2)` in `vocabulary.txt`.
- AC-010: Observed: `SUITE_SAME` and `PHASE1_EXIT_SAME`. The end suite ended `exit=0` with `Test Files  276 passed | 3 skipped (279)` and `Tests  4162 passed | 21 skipped (4183)`, identical to the start suite (`scratch/baseline/suite-lines-end.txt`).
- AC-011: Observed: `git status --porcelain` at close lists only the 8 modified docs, the 12 new files, the playbook and catalog indexes, the changelog, any mirror the commit hook required, and this phase folder (see `implementation-summary.md`).
- AC-012: Observed: `scratch/review/T015.txt` holds 28 P2 lines and no P0 or P1 line. The `awk` check printed `0` bad lines and `goal.md` section 4 holds 28 `T016-RECORDED` lines.
<!-- /ANCHOR:closure -->
