---
title: "Acceptance Criteria: Phase 4: corpus-and-catalog"
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
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog"
    last_updated_at: "2026-09-10T23:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the acceptance criteria for phase 4"
    next_safe_action: "Meet, waive or supersede the open criteria once T001-T019 execute"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-004-corpus-and-catalog"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: corpus-and-catalog

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-design/019-sk-design-diagram-upgrade/004-corpus-and-catalog
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
| AC-001 | REQ-001, REQ-002 | Given 003's applicator covers only the four templates, When it is extended with an examples selector and run over the 34 examples at each file's implied ground, Then `example-sequence-oauth-dark.html` alone is excluded by name | `grep -c "example-sequence-oauth-dark" <script's exclusion list or applicator invocation log>`; 33 of 34 examples show a post-run diff, one shows none | Unmet | - |
| AC-002 | REQ-003 | Given a repainted example sitting in the applicator's scratch output, When it is promoted into `assets/examples/`, Then a human-read diff of that promotion exists in the task's own evidence trail | T006's per-file diff-read log, one entry per promoted file | Unmet | - |
| AC-003 | REQ-004 | Given the repaint has run over all 34 examples, When the corpus is grepped for typed hex literals, Then the count is `1577` over `25` distinct values, matching the pre-repaint baseline | `grep -ohE "#[0-9a-fA-F]{6}" .opencode/skills/sk-design/sk-design-diagram/assets/examples/*.html \| wc -l` reports `1577` | Unmet | - |
| AC-004 | REQ-005 | Given the repaint has run, When `#ffffff` and `#3d4460` are grepped across the corpus, Then their occurrence counts (40/13 files and 1 file respectively) are unchanged from the pre-repaint baseline | `grep -oh "#ffffff" assets/examples/*.html \| wc -l` reports `40`; `grep -rl "3d4460" assets/examples/*.html` reports exactly `example-high-level.html` | Unmet | - |
| AC-005 | REQ-006, REQ-007 | Given the 34 examples and 27 type references, When the catalog's bidirectional check runs, Then every canonical example resolves to exactly one type row, and sketchy carries a stated descope reason rather than a manufactured proof file | `references/catalog.md`'s row-to-file and file-to-row check (T014); `grep -i "sketchy" references/catalog.md` shows a descope note, not a file reference | Unmet | - |
| AC-006 | REQ-008 | Given the repaint has landed, When the capture pipeline is re-run, Then 39 PNGs exist and `--check` reports every source covered | `ls screenshots/examples/*.png screenshots/templates/*.png screenshots/icons.png \| wc -l` reports `39`; `render-screenshots.cjs ./assets ./screenshots --check` exits `0` | Unmet | - |
| AC-007 | REQ-009 | Given `SKILL.md`'s "Use Cases — selection guide" table, When it is replaced by a pointer to `references/catalog.md`, Then the catalog carries a `DIAGRAM_CATALOG:BEGIN … :END` sentinel pair with canonical example, variant lattice, ceiling, imports, and skin columns | `grep -c "DIAGRAM_CATALOG:BEGIN" references/catalog.md` reports `1`; `grep -c "Use Cases — selection guide" SKILL.md` reports `0` | Unmet | - |
| AC-008 | REQ-010 | Given the 7 of 27 type files with a stated ceiling in different words, When the catalog's ceiling column is built, Then each of the 7 rows carries its own number and qualifier, and the other 20 rows read "No stated ceiling" | Manual read of `references/catalog.md`'s ceiling column against the 7 named type files and the 20 remaining rows | Unmet | - |
| AC-009 | REQ-011 | Given `SKILL.md`'s Smart Router Pseudocode block (12.6% of the file), When it is relocated, Then `SKILL.md` carries a pointer instead and `references/foundations/router-pseudocode.md` holds the block verbatim | `grep -c "Smart Router Pseudocode" SKILL.md` reports `0`; `test -f references/foundations/router-pseudocode.md` passes; `grep -c -i "accessib" SKILL.md` unchanged from the pre-phase baseline of `3` | Unmet | - |
| AC-010 | REQ-012 | Given `feature-catalog/` and `manual-testing-playbook/` were never diffed against `SKILL.md`, When this phase's diff task runs, Then the decision (extraction target vs. independent family) is recorded, with any found drift fixed in the same pass | `plan.md` ADR-003 records the decision; `git diff` over the two directories shows either no change or a documented drift fix | Unmet | - |
| AC-011 | Phase gate | Given the repainted corpus, the rebuilt catalog, and the re-shot captures, When a dress run of 005's checker executes, Then it prints `RESULT: PASSED` — the literal 004 → 005 handoff criterion | `node .opencode/skills/sk-design/sk-design-diagram/scripts/check-diagram-corpus.cjs` output, once 005 ships the script | Unmet | - |

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

This packet is authored, not executed: T001-T019 have not run, so every AC row above is
observationally `Unmet` by construction. It closes only after the applicator is extended and its
own gate re-confirmed (T001-T003), the corpus is repainted and its census reproduced (T004-T008),
the captures are re-shot and read (T009-T010), the sketchy descope is signed (T011), the catalog is
built and bidirectionally verified (T012-T014), `SKILL.md` is rebuilt in two places (T015-T016),
`style-guide.md`'s deferred note is discharged (T017), the feature-catalog/manual-testing-playbook
question is settled (T018), and a dress run of 005's checker passes (T019).
<!-- /ANCHOR:closure -->
