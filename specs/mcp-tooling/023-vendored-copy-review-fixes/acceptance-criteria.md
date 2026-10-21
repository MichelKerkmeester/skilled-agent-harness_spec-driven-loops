---
title: "Acceptance Criteria: Vendored copy review fixes for mcp-click-up and mcp-figma"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "vendored copy review fixes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/023-vendored-copy-review-fixes"
    last_updated_at: "2026-10-21T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Opened the fix phase"
    next_safe_action: "Apply the fixes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "1004bf13-7863-4447-a63e-6ad2f5fcfd86"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Vendored copy review fixes for mcp-click-up and mcp-figma

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** mcp-tooling/023-vendored-copy-review-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-10-21
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the P1 findings, When the fixes land, Then each defect is gone at its site | implementation-summary.md:53 and implementation-summary.md:66, all 8 P1 fixed at their sites | Met | - |
| AC-002 | REQ-002 | Given the P2 findings, When the fixes land, Then each is fixed or recorded as not holding | implementation-summary.md:53 and implementation-summary.md:66, 14 fixed, 1 partly and 1 recorded with its reason | Met | - |
| AC-003 | REQ-003 | Given a changed script, When it runs, Then it behaves as the fixed finding states | implementation-summary.md:128, connect-safe.sh exits 2 with no TTY, doctor.sh finds the config, bash -n passes on all five | Met | - |
| AC-004 | REQ-004 | Given the final tree, When the validators run, Then both packets pass | implementation-summary.md:124, validate_skill_package --strict PASS for both, parent-skill-check OK with 0 warnings | Met | - |

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

Every criterion is Met. The commit waits for the operator's go-ahead.
<!-- /ANCHOR:closure -->
