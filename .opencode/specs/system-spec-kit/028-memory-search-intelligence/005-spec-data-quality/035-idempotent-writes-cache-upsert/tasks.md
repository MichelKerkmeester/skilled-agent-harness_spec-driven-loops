---
title: "Tasks: Idempotent Writes and Global-Cache Upsert [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "idempotent description writes"
  - "global cache upsert"
  - "content hash gated description"
  - "ensureDescriptionCache over-reach"
  - "description json no-op skip"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/035-idempotent-writes-cache-upsert"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Listed the build tasks for the fingerprint, skip, gate, upsert, all unchecked"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/tests/folder-discovery-idempotent.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-035-idempotent-writes-cache-upsert"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Idempotent Writes and Global-Cache Upsert

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

- [ ] T001 Confirm the write helpers exist at the cited lines, `buildCanonicalDescriptionFields`, `savePerFolderDescription`, `saveDescriptionCache`, `ensureDescriptionCache`, `generatePerFolderDescription`, `generateFolderDescriptions` (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T002 Decide the canonical fields that enter the fingerprint and confirm `lastUpdated` and `generated` are excluded (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T003 [P] Register the single default-OFF feature flag in the existing feature-flag set and the env reference
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the deterministic content fingerprint over the canonical fields, excluding the volatile stamps (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T005 Add the per-folder no-op skip in `savePerFolderDescription` behind the flag, preserving the prior `lastUpdated` on a fingerprint match (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T006 Add the aggregate-cache content gate in `saveDescriptionCache` behind the flag, preserving `generated` and rows on no semantic delta (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T007 Add `upsertDescriptionCacheEntry` and route the per-folder save path through it, reserving the whole-tree rebuild for structural changes (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T008 Add the grandfather report mode and preserve the canonical-save escape hatch that may still bump `lastUpdated` (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T009 Author the vitest covering the fingerprint, the no-op skip, the real-delta write, the targeted upsert, the structural rebuild, and the flag-OFF grandfather path (`.opencode/skills/system-spec-kit/mcp_server/scripts/tests/folder-discovery-idempotent.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Confirm a no-delta rerun with the flag ON writes nothing and preserves `lastUpdated` and `generated`, and a real change writes exactly once advancing only the changed entry
- [ ] T011 Confirm a per-folder save with the flag ON touches only the target entry and triggers no whole-tree rescan, a structural change still rebuilds, and with the flag OFF the legacy path and the grandfather report mode leave existing files untouched
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
