---
title: "Tasks: Open Design transport grounding receipt + return reconciliation"
description: "Run queue for phase 010 (terminal) of packet 011 — build offline receipt validators, then paired-mode reconciliation fixtures, then gated live read/run plumbing, and verify no-cache plus multi-turn completion against the live design-mcp-open-design tool surface. Scaffold only; nothing started."
trigger_phrases:
  - "open design transport tasks"
  - "grounding receipt tasks"
  - "transport reconciliation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/010-open-design-transport"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored L2 scaffold for the Open Design transport grounding-receipt phase"
    next_safe_action: "Build offline receipt validators before any live read/run plumbing"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-opendesign-011-010"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Open Design transport grounding receipt + return reconciliation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: T### [P?] Description (file path)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Define the metadata-only receipt schema + provenance fields, reusing the phase 007 shared seam (`design-mcp-open-design/`).
- [x] T002 Implement offline validators asserting the no-cache invariant (no raw corpus/Open-Design payloads) (`design-mcp-open-design/`).
- [x] T003 [P] Add metadata-only positive / no-fit / stale fixtures and prove validators pass with no live daemon (`design-mcp-open-design/`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Build reconciliation fixtures comparing a paired mode's proposal to the transport return, reusing phase 008 pilot patterns (`design-mcp-open-design/`).
- [x] T005 Surface divergence explicitly (blocking vs. advisory delta) and make reconciliation mandatory on every return (`design-mcp-open-design/`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 [B] Wire live read/run plumbing only after Phases 1–2 pass (`design-mcp-open-design/`).
- [x] T007 Verify no-cache behavior on the live tool surface (no raw payloads cached at any turn) (`design-mcp-open-design/`).
- [x] T008 Verify multi-turn completion, incl. turn-1 `awaiting_input` with zero files and mandatory return evidence + reconciliation (`design-mcp-open-design/`).
- [x] T009 Confirm the transport treats a receipt as grounding evidence only — never mutation approval or acceptance (`design-mcp-open-design/`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Offline receipt validators pass on metadata-only fixtures with no live daemon
- [x] Reconciliation fixtures pass; divergence surfaced; reconciliation mandatory on return
- [x] Live plumbing enabled only behind the offline gates; no-cache + multi-turn completion verified
- [x] Receipt never acts as acceptance or mutation approval
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Parent**: ../spec.md
<!-- /ANCHOR:cross-refs -->
