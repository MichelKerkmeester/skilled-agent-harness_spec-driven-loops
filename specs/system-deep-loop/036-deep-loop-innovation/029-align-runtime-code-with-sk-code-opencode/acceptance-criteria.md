---
title: "Acceptance Criteria: Phase 29: align system-deep-loop runtime code with sk-code-opencode"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "align runtime code with sk code opencode acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/029-align-runtime-code-with-sk-code-opencode"
    last_updated_at: "2026-09-30T05:44:25Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-029-align-runtime-code-with-sk-code-opencode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Phase 29: align system-deep-loop runtime code with sk-code-opencode

<!-- SPECKIT_LEVEL: 2 -->

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 029-align-runtime-code-with-sk-code-opencode
**Level:** 2
**Status:** Complete
**Date:** 2026-09-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the recorded baseline, When every loop mode and merge has landed, Then the typecheck exits 0 and vitest reports at least 2704 passed and at most 4 failed | T020: final typecheck exit 0; vitest 2704 passed / 4 failed / 8 skipped, failing names identical to the baseline | Met | - |
| AC-002 | REQ-002 | Given a DeepSeek edit, When it changes any code line or adds a tool directive, Then the driver reverts it and logs REVERTED | T010, T011; `comment-only` rejects a string change, an added `@ts-ignore`, an unclosed comment and a changed regex literal, and accepts dividers added around a regex literal containing `'`; three REVERTED lines in the sections log | Met | - |
| AC-003 | REQ-003 | Given the three runtimes, When the checker runs with no new flag, Then its output equals the T003 capture | T021: all three runtimes exit 0, output equal to `scratch/baseline/checker-default-*.txt` apart from the scanned-file count | Met | - |
| AC-004 | REQ-004 | Given the checker suite, When it runs, Then each new flag has a passing and a failing case and the suite passes | T004, T005: `test_verify_alignment_drift.py` 26 passed, including the header-rule-plus-divider regression case | Met | - |
| AC-005 | REQ-005 | Given sk-create-readme, When a skill needs an ARCHITECTURE.md, Then `assets/architecture-template.md` exists and system-deep-loop's ARCHITECTURE.md follows its eight sections | T009, T018: `sk-create-readme/assets/architecture-template.md`; `system-deep-loop/ARCHITECTURE.md` has all eight sections and validates with 0 issues | Met | - |
| AC-006 | REQ-006 | Given the deep-loop runtime, When the checker runs with `--check-exact-headers --check-sections --check-folders`, Then it reports 0 errors | T019: exit 0, Findings 0, Errors 0, Warnings 0 | Met | - |
| AC-007 | REQ-007 | Given the fact-checked merge table, When the build ends, Then every CONFIRMED merge has landed with no importer left on the old path and every REJECTED one is recorded | T015, T016, T017: three CONFIRMED merges landed, `rg` for each old path empty; `deep-research-authority` REJECTED in `scratch/investigation/devin-swe2max-merge-factcheck.md` | Met | - |

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

All seven criteria are Met, and the after-merge steps on main are done: sk-doc serves compiled routing again, the edited docs carry derived versions, and the README baselines and trigger index are rebuilt. The work is merged to main as `46fc86c8e8`.
<!-- /ANCHOR:closure -->
