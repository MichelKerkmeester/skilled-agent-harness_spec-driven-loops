---
title: "Acceptance Criteria: Align runtime code with sk-code-opencode: section comments, folder depth, code READMEs, ARCHITECTURE.md (system-spec-kit)"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "align runtime code with sk code opencode acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/046-align-runtime-code-with-sk-code-opencode"
    last_updated_at: "2026-09-30T05:43:46Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-046-align-runtime-code-with-sk-code-opencode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Align runtime code with sk-code-opencode: section comments, folder depth, code READMEs, ARCHITECTURE.md (system-spec-kit)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 046-align-runtime-code-with-sk-code-opencode
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
| AC-001 | REQ-001 | Given the scoped baseline from T002, When every loop mode and merge has landed, Then the typecheck exits 0 and the `root` and `cli` vitest projects match or beat their baseline counts | T014: typecheck exit 0; `root` + `cli` 2847 passed / 0 failed after every loop mode and merge (baseline 2847/0), 2985/0 after merging main; GATE-PASS lines in the spec-kit loop logs | Met | - |
| AC-002 | REQ-002 | Given a DeepSeek edit, When it changes a code line or adds a tool directive, Then the driver restores the pre-dispatch snapshot and logs REVERTED | T004, T005: `system-spec-kit-header.log` holds 1 REVERTED line (an outside-edit fingerprint change on `continue-session.vitest.ts`), retried and kept; every KEPT line passed `comment-only` first | Met | - |
| AC-003 | REQ-003 | Given the spec-kit runtime, When the checker runs with `--check-exact-headers --check-sections --check-folders`, Then it reports 0 errors | T013: Findings 0, Errors 0 from the skill root, `shared/` included, before and after merging main | Met | - |
| AC-004 | REQ-004 | Given the spec-kit runtime, When `--check-folders` runs, Then no code folder lacks a README and no folder name uses double underscores | T006, T007, T010, T015, T016: 10 READMEs written by the loop (6, then `tests/hooks`, then 3 for folders main added); `__helpers__`, `__fixtures__` and `__snapshots__` renamed; `--check-folders` reports nothing | Met | - |
| AC-005 | REQ-005 | Given the fact-checked merge table, When the build ends, Then every CONFIRMED merge has landed with `rg` finding no importer on the old path, and the golden snapshot test is shown to compare against the moved file | T007-T011: every CONFIRMED merge landed with `rg` empty on each old path; one broken snapshot line gave `Snapshots 1 failed` and the restored file 12/12 | Met | - |

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

All five criteria are Met. The work is merged to main as `46fc86c8e8`; the checker reports 0 findings from the skill root and the scoped suite 2985 passed and 0 failed on the merged tree.
<!-- /ANCHOR:closure -->
