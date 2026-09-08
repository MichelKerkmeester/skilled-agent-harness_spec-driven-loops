---
title: "Acceptance Criteria: v4 state inventory research"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "v4 state inventory research"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/034-v4-state-inventory-research"
    last_updated_at: "2026-09-08T18:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Authored the criteria before launch"
    next_safe_action: "Meet the open criteria as the lanes run"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-08-v4-state-inventory"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: v4 state inventory research

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-speckit/033-system-speckit-v4/034-v4-state-inventory-research |
| **Status** | Open |
| **Owner** | this session |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

Each criterion is Met, Waived (by a decision record) or Superseded (by a decision record). Verification cells cite the proof.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given both lanes launched with stop policy max-iterations, When they exit, Then ten iteration files and ten state events exist per lane | count of files under `research/lineages/*/iterations` and of iteration events in each JSONL ledger | Open | - |
| AC-002 | REQ-002 | Given research.md, When a row is read, Then it cites a `path:line` or a command with observed output | Reproduction pass notes in research/confirmed-drift.md | Open | - |
| AC-003 | REQ-003 | Given a drift finding, When it is ranked, Then it has a severity and a one-line correction | research.md drift table | Open | - |
| AC-004 | REQ-004 | Given the iteration files, When their focus lines are listed, Then each of the ten angles appears at least once per lane | `rg -n '^focus' research/lineages/*/iterations` | Open | - |
| AC-005 | REQ-005 | Given the two lane outputs, When merged, Then every disagreement between them is a row in the merged table | research.md disagreements section | Open | - |
| AC-006 | REQ-006 | Given the confirmed table, When each row is opened, Then the cited draft line and repository line show the drift | Session log in implementation-summary.md | Open | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

This packet closes when every row above is Met, Waived or Superseded and `validate.sh --strict` passes from the final state.
<!-- /ANCHOR:closure -->
