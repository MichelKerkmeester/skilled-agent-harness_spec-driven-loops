---
title: "Tasks: Phase 5: metadata-status-derivation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "metadata status derivation tasks"
  - "table status fallback tasks"
  - "026 027 metadata tasks"
  - "deriveStatus tasks"
  - "graph metadata parser tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/013-comprehensive-audit-remediation/005-metadata-status-derivation"
    last_updated_at: "2026-06-04T20:45:44Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed E1-E9 tasks except deferred backfill regen"
    next_safe_action: "Defer dist rebuild and backfill regen to central"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-metadata-status-derivation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: metadata-status-derivation

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

- [x] T001 Read parser deriveStatus, normalizeDerivedStatus, collectPacketDocs
- [x] T002 Confirm 027 003/006 specs carry table-only Draft status
- [x] T003 [P] Capture git diff state of every cited 026/027 data file
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 E7: add extractMetadataTableStatus helper (graph-metadata-parser.ts) [REQ-001]
- [x] T005 E7: wire spec.md table-status fallback into collectPacketDocs (graph-metadata-parser.ts) [REQ-001]
- [x] T006 E1: fix 026 last-active pointer + prose (026 graph-metadata.json + spec.md) [REQ-002]
- [x] T007 E2: reconcile 026 track-000 leaf counts (changelog root + README.md) [REQ-003]
- [x] T008 E3: reconcile 026 packets 009 + 016 to one truth (spec/graph/checklist/impl-summary) [REQ-004]
- [x] T009 E4: de-list 027 placeholder child (027 description.json + graph-metadata.json) [REQ-005]
- [x] T010 E5: renumber 027 child title + triggers (002/007/008 description.json) [REQ-006]
- [x] T011 E6: set 027 003/006 derived.status to draft (graph-metadata.json) [REQ-007]
- [x] T012 E8 + E9: resource-map honesty + lean-parent note + 026-surface pin (resource-map.md + spec.md) [REQ-008]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Typecheck parser via project tsconfig (no errors in edited file)
- [x] T014 Author Draft + Placeholder fixture tests (graph-metadata-schema.vitest.ts); vitest run deferred to central
- [x] T015 validate.sh --strict on every edited 026/027 packet (Errors 0)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
