---
title: "Tasks: Drift Gate and Shared Synopsis Extractor [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "generated metadata drift gate"
  - "shared synopsis extractor"
  - "derive packet synopsis"
  - "check generated metadata drift"
  - "source doc hashes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/037-drift-gate-synopsis-extractor"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded build tasks for drift gate and shared extractor"
    next_safe_action: "Hold for implementation, no task has started yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/scripts/spec/validate.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Drift Gate and Shared Synopsis Extractor

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

- [ ] T001 Capture the current precedence and length limits of the two divergent extractors (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T002 Capture the `causal_summary` extractor precedence and confirm the divergence from the description path (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T003 [P] Define the default-OFF flag name and the grandfather report mode contract, and enumerate the volatile timestamp fields the drift compare must ignore
- [ ] T004 [P] Decide where `source_doc_hashes` persists and which source docs feed the synopsis derivation (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Author the shared `derivePacketSynopsis(specFolder, options)` helper with explicit precedence and field-specific length limits (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T006 Route the `description` field through the shared helper behind the flag (`.opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts`)
- [ ] T007 Route the `causal_summary` field through the shared helper with the longer length limit (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T008 Add `checkGeneratedMetadataDrift(specFolder)` that re-derives, compares ignoring volatile timestamps, and returns a report without writing (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`)
- [ ] T009 Add the `source_doc_hashes` field to the schema and persist it on generation (`.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`)
- [ ] T010 Wire the drift gate as a report-only read into strict validation, default-OFF with a grandfather report mode (`.opencode/skills/system-spec-kit/scripts/spec/validate.sh`)
- [ ] T011 Surface the drift report in dry-run backfill without mutating the folder (`.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Add the vitest covering drift detection, no-drift, shared-extractor precedence, the no-write assertion, and the grandfather report mode (`.opencode/skills/system-spec-kit/scripts/tests/generated-metadata-drift.vitest.ts`)
- [ ] T013 Confirm with the flag OFF a strict run on a drifted folder emits a grandfather report and leaves the verdict unchanged, and with the flag ON the gate changes the verdict, both fields share one extractor, and a doc edit changes `source_doc_hashes`
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
