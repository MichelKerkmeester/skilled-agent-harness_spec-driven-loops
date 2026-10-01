---
title: "Acceptance Criteria: Align runtime code with sk-code-opencode: section comments, folder depth, code READMEs, ARCHITECTURE.md (system-skill-advisor)"
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
    packet_pointer: "scaffold/031-align-runtime-code-with-sk-code-opencode"
    last_updated_at: "2026-09-30T05:43:45Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-031-align-runtime-code-with-sk-code-opencode"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Align runtime code with sk-code-opencode: section comments, folder depth, code READMEs, ARCHITECTURE.md (system-skill-advisor)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 031-align-runtime-code-with-sk-code-opencode
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
| AC-001 | REQ-001 | Given the recorded baseline, When every loop mode and merge has landed, Then the typecheck exits 0 and vitest reports at least 963 passed and at most 8 failed, plus the moved cosine test's own cases passing | T016: typecheck 0; vitest 975 passed / 0 failed, including the 4 moved cosine cases | Met | - |
| AC-002 | REQ-002 | Given a DeepSeek edit, When it changes a code line or adds a tool directive, Then the driver restores the pre-dispatch snapshot and logs REVERTED | T004, T005: 2 REVERTED lines in the loop logs (one false provider match, retried and kept; one edit the checker still flagged, finished by hand); `comment-only` exit 0 on the hand edit | Met | - |
| AC-003 | REQ-003 | Given the advisor runtime, When the checker runs with `--check-exact-headers --check-sections --check-folders`, Then it reports 0 errors | T015: exit 0, Findings 0, Errors 0, Warnings 0 | Met | - |
| AC-004 | REQ-004 | Given the advisor runtime, When `--check-folders` runs, Then no code folder lacks a README and no folder name uses double underscores | T006, T013, T015: 2 READMEs written by the loop; the 3 double-underscore folders removed; `--check-folders` reports nothing | Met | - |
| AC-005 | REQ-005 | Given the fact-checked merge table, When the build ends, Then every CONFIRMED merge has landed with `rg` finding no importer on the old path, and the REJECTED `types` and `auth` merges are recorded with their reasons | T007-T013: context, corpus, routing, tests/utils, cosine move, search-quality deletion and fixture renames landed with `rg` empty for each old path; `types` and `auth` recorded as REJECTED in the fact-check | Met | - |

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

All five criteria are Met. The work is merged to main as `46fc86c8e8`, and the advisor suite reports 1079 passed and 0 failed on the merged tree.
<!-- /ANCHOR:closure -->
