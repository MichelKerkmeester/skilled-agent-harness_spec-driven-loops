---
title: "Acceptance Criteria: Fix the debt the memory decommission review loop recorded: freshness fixtures, fan-out stderr capture, review-leaf write path, retired rollback runbook, dead type and stale test name"
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
    packet_pointer: "system-speckit/054-decommission-debt-fixes"
    last_updated_at: "2026-09-05T03:23:43Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Fix the debt the memory decommission review loop recorded: freshness fixtures, fan-out stderr capture, review-leaf write path, retired rollback runbook, dead type and stale test name

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/054-decommission-debt-fixes
**Level:** 2
**Status:** In Progress
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given two trigger-index runs, When `dist-freshness.cjs check-all` runs, Then the scripts package is fresh without a re-stamp | `check-all` output after two generator runs | Unmet | - |
| AC-002 | REQ-001 | Given a lineage child that writes to stderr and exits 1, When the runner returns, Then the stderr text is in the result and in `logs/fanout-lineage.err` | `fanout-lineage-stderr.test.ts` 2 of 2 | Unmet | - |
| AC-003 | REQ-001 | Given the deep-review agent contract, When its write-scope rules are read, Then they say review paths resolve against the dispatched artifact directory and the four mirrors match | `check-agent-mirror-sync.cjs` OK | Unmet | - |
| AC-004 | REQ-001 | Given the tree, When the runbook, the MCP response type and the stale test name are searched, Then none exists outside historical evidence | `git grep` 0 live hits | Unmet | - |
| AC-005 | REQ-002 | Given the skill root, When its folders are listed, Then only `runtime/data/` holds data and every reader resolves the index there | `ls`; lookup exit 0; retrieval suites pass | Unmet | - |
| AC-006 | REQ-003 | Given every code folder in `runtime/` and `scripts/`, When `validate_document.py` runs on its README, Then each reports 0 issues | validator sweep output | Unmet | - |
| AC-007 | REQ-004 | Given the aligned tree, When shared, scripts and runtime typecheck and the touched suites run, Then all exit 0 and the packet gates pass | command outputs | Unmet | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
