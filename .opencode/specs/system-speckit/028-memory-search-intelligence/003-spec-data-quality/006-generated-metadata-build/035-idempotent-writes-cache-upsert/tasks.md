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
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/006-generated-metadata-build/035-idempotent-writes-cache-upsert"
    last_updated_at: "2026-07-04T17:11:57.620Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed the fingerprint, skip, gate, upsert tasks, all checked"
    next_safe_action: "Graduation follow-on, route callers through upsert under a scoped migration"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-idempotent.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-035-idempotent-writes-cache-upsert"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Confirm the write helpers exist at the cited lines, `buildCanonicalDescriptionFields`, `savePerFolderDescription`, `saveDescriptionCache`, `ensureDescriptionCache`, `generatePerFolderDescription`, `generateFolderDescriptions` (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [x] T002 Decide the fingerprint input, the full write payload with only the volatile `lastUpdated` stripped, so memory-tracking deltas still write (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [x] T003 [P] Register the single default-OFF `SPECKIT_IDEMPOTENT_DESCRIPTION_WRITES` flag in the existing capability-flag set with inline documentation mirroring its siblings
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add the deterministic content fingerprints over the write payload and the cache rows, excluding the volatile `lastUpdated` and `generated` stamps (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [x] T005 Add the per-folder no-op skip in `savePerFolderDescription` behind the flag, preserving the prior `lastUpdated` on a fingerprint match (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [x] T006 Add the aggregate-cache content gate in `saveDescriptionCache` behind the flag, preserving `generated` and rows on no semantic delta, and route `ensureDescriptionCache` through it (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [x] T007 Add `upsertDescriptionCacheEntry` that replaces only the target row and writes only on a real delta, reserving the whole-tree rebuild for structural changes. Live-caller routing is the graduation follow-on (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [x] T008 Preserve the canonical-save escape hatch through the `canonicalSave` option that may still bump `lastUpdated`. The dedicated grandfather reporter is deferred, the default-OFF flag is the rollout guard (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [x] T009 Author the vitest covering the no-op skip, the real-delta write, the escape hatch, the targeted upsert, the no-op upsert, the insert, the aggregate gate, and the flag-OFF legacy path (`.opencode/skills/system-spec-kit/mcp_server/tests/folder-discovery-idempotent.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Confirmed a no-delta rerun with the flag ON writes nothing and preserves `lastUpdated` and `generated`, and a real change writes exactly once advancing only the changed entry, vitest green
- [x] T011 Confirmed a per-folder upsert touches only the target entry and scans no other base path, the full rebuild stays reserved for structural changes, and with the flag OFF the legacy unconditional write leaves nothing gated, vitest green
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
