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
    recent_action: "Every criterion verified from the final state"
    next_safe_action: "None; the packet is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-08-v4-state-inventory"
      parent_session_id: null
    completion_pct: 100
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
| **Status** | Closed |
| **Owner** | this session |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

Each criterion is Met, Waived (by a decision record) or Superseded (by a decision record). Verification cells cite the proof.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given both lanes launched with stop policy max-iterations, When they exit, Then ten iteration files and ten state events exist per lane | `ls research/lineages/*/iterations \| wc -l` = 20; both state ledgers end at maxIterationsReached | Met | - |
| AC-002 | REQ-002 | Given research.md, When a row is read, Then it cites a `path:line` or a command with observed output | research/confirmed-drift.md §1, one command per row | Met | - |
| AC-003 | REQ-003 | Given a drift finding, When it is ranked, Then it has a severity and a one-line correction | research/research.md §2, severity and correction columns | Met | - |
| AC-004 | REQ-004 | Given the iteration files, When their focus lines are listed, Then each of the ten angles appears at least once per lane | iteration headings 1-10 per lane, one angle each | Met | - |
| AC-005 | REQ-005 | Given the two lane outputs, When merged, Then every disagreement between them is a row in the merged table | research/research.md §4, seven disagreements settled | Met | - |
| AC-006 | REQ-006 | Given the confirmed table, When each row is opened, Then the cited draft line and repository line show the drift | research/confirmed-drift.md §1 observed column | Met | - |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

This packet closes when every row above is Met, Waived or Superseded and `validate.sh --strict` passes from the final state.
<!-- /ANCHOR:closure -->
