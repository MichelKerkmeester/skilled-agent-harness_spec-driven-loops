---
title: "Acceptance Criteria: README audit and changelog validator accuracy fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "audit and validator accuracy acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/070-repo-doc-debt/006-audit-and-validator-accuracy"
    last_updated_at: "2026-10-27T10:30:00Z"
    last_updated_by: "lane-z2-conductor"
    recent_action: "Recorded evidence for every criterion"
    next_safe_action: "None; criteria are met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "lane-z2-repo-doc-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: README audit and changelog validator accuracy fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/070-repo-doc-debt/006-audit-and-validator-accuracy
**Level:** 2
**Status:** Complete
**Date:** 2026-10-27
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the HEAD scripts, When the new tests run, Then each change's test fails; on the new scripts all pass | 8 failed before; 22 passed after in the two test files | Met | - |
| AC-002 | REQ-001 | Given the final tree, When `run-script-tests.sh` runs, Then every test passes | `all sk-doc script tests passed`, exit 0 | Met | - |
| AC-003 | REQ-002 | Given the final tree, When the audit runs, Then template_invalid falls by 2, missing_key_artifacts by 1, broken_references by 38 gitignored plus 10 package-relative | 237 / 98 / 14 to 235 / 50 / 13 | Met | - |
| AC-004 | REQ-003 | Given every changelog under `.skilled/skills`, When the check runs, Then no SHA-256 warning remains and ADR, REQ, CR and T ids still warn | SHA-256 files 4 to 0; two older entries now warn on real task ids | Met | - |

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

Every criterion is met. The two system-spec-kit entries that the task-id pattern now flags are real debt outside this packet's files.
<!-- /ANCHOR:closure -->
