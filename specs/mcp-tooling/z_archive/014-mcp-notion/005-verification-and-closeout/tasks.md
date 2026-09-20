---
title: "Tasks: Phase 005 — mcp-notion verification + closeout"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp-notion verification tasks"
  - "mcp-notion closeout tasks"
  - "notion mode phase 5 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/014-mcp-notion/005-verification-and-closeout"
    last_updated_at: "2026-08-21T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Whole-mode validate 0 issues; doctor.sh green; packet continuity reconciled"
    next_safe_action: "Defer live Notion API round-trip smoke to the operator"
    blockers: []
    key_files: ["../001-deep-research/research/research.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "014-005-verification"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 005 — mcp-notion verification + closeout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm Phases 001–004 complete (package authored + registered + advisor-rebuilt)
- [x] T002 Determine live-smoke availability (no real `notion_NOTION_TOKEN` in-env → operator-deferred)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author `manual-testing-playbook/manual-testing-playbook.md` — 11 read-only / scratch-safe scenarios (6 MCP round-trips, 1 API-gap direct call, 1 backend-selection, 3 auth/failure), reversible archive-to-trash cleanup
- [x] T004 [P] Author read-only `scripts/install.sh` (Node/npx check, prints Code Mode snippet + `notion_NOTION_TOKEN` key, writes no config)
- [x] T005 [P] Author read-only `scripts/doctor.sh` (Node/npx, registered `notion` manual, `notion_NOTION_TOKEN` presence only) + `scripts/README.md`
- [x] T006 [P] Author `changelog/v0.1.0.0.md`
- [x] T007 Run `validate_document.py` across all 14 mode docs (0 issues)
- [x] T008 Run `doctor.sh` (exit 0, read-only): Node v25 / npx, registered manual, token-unset reported correctly
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Sweep cross-doc consistency (24 tools / 6 domains / 22 property types / 3 req/s / API 2025-09-03 + 2026-03-11; no leaked incorrect tool-name forms)
- [x] T010 Reconcile completion metadata across the 014 parent + all five phase-children continuity blocks
- [x] T011 Write `implementation-summary.md` with verification evidence + final state (`005-verification-and-closeout/implementation-summary.md`)
- [ ] T012 [B] Live Notion API round-trip smoke — deferred to the operator (needs a real `notion_NOTION_TOKEN`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All non-blocked tasks marked `[x]`
- [x] `validate_document.py` 0 issues (14 docs); `doctor.sh` green (exit 0, read-only)
- [x] Cross-doc consistency swept; completion metadata reconciled across the packet
- [ ] Live Notion API round-trip smoke passed — operator-deferred (needs a real `notion_NOTION_TOKEN`)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent packet**: `../spec.md` (final phase — no successor)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
