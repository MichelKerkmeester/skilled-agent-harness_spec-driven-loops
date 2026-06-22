---
title: "Tasks: Generator Hardening [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "graph metadata source fingerprint"
  - "phase child contract unify"
  - "access telemetry split"
  - "freshness telemetry split"
  - "generator hardening"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/038-generator-hardening"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Tasked the fingerprint, child contract, and telemetry split build"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Generator Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [ ] T001 Confirm the 031 P0 identity resolver and merge-path lineage guard already shipped, since this phase assumes them as dependencies (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T002 Confirm the DB or index layer exposes an access and freshness write path the telemetry split can route to (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T003 Define the volatile-ignoring projection the `source_fingerprint` derives over, matching the projection the idempotency compare already uses (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T004 [P] Define the default-off flag name and the grandfather report mode the strict read honors
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Add the `source_fingerprint` write over the volatile-ignoring projection, behind the default-off flag (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T006 Add the optional `source_fingerprint` field to the schema, tolerant of absence under the grandfather mode (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`)
- [ ] T007 Replace the two child-detection paths with one shared `listPhaseChildren` helper consumed by both `isPhaseParent` and `resolveChildrenIds` (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T008 Stop writing `last_accessed_at`, `last_active_child_id`, and `last_active_at` into the generated JSON, route them to the DB or index layer behind the flag (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T009 Add the strict-mode read that re-derives and compares the `source_fingerprint`, registered with a grandfather report mode (`.opencode/skills/system-spec-kit/scripts/rules/`)
- [ ] T010 Author the vitest proving the fingerprint, the unified child contract, the telemetry split, the flag, and the grandfather mode (`.opencode/skills/system-spec-kit/mcp_server/scripts/tests/generator-hardening.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Confirm a re-derive on unchanged docs yields an identical fingerprint and does not dirty the file, a source-doc change yields a different one, and both child helpers resolve through `listPhaseChildren` and agree on a fixture tree
- [ ] T012 Confirm a read and a resume leave the generated JSON byte-identical while the access record updates in the DB or index layer, and a strict run over an un-migrated file reports under the grandfather mode rather than exiting non-zero
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
