---
title: "Tasks: A9 Read-Time Content-Hash Integrity Verification [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "content hash integrity"
  - "read time hash verify"
  - "storage drift guard"
  - "verify_integrity content hash"
  - "silent corruption detection"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/009-content-hash-integrity"
    last_updated_at: "2026-07-04T17:12:02.624Z"
    last_updated_by: "markdown-agent"
    recent_action: "Added benchmark, test and default-off tasks for the A9 scaffold"
    next_safe_action: "Hold for implementation, no task has started"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: A9 Read-Time Content-Hash Integrity Verification

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

- [ ] T001 Confirm `hashContentBody` is exported and importable into the integrity sweep (`.opencode/skills/system-spec-kit/mcp_server/lib/content-id.ts`)
- [ ] T002 Read the save-side `content_hash` write to pin the exact body form the recompute must hash (`.opencode/skills/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`)
- [ ] T003 [P] Choose the default-off flag name and read site, matching how the sweep already gates optional work (`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the read-time recompute branch to `verify_integrity`, re-hashing each row body via `hashContentBody` and comparing to the stored `content_hash` (`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts`)
- [ ] T005 Skip rows with a null or absent `content_hash` so a pre-migration row is never counted as a mismatch (`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts`)
- [ ] T006 Surface mismatch row ids on a new `contentHashMismatches` field, report-only with no body or hash mutation (`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts`)
- [ ] T007 Gate the whole recompute behind the default-off flag so the flag-off sweep performs no extra row-body read (`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts`)
- [ ] T010 Name the recompute flag `SPECKIT_CONTENT_HASH_INTEGRITY` default-off with an `isContentHashIntegrityEnabled()` checker in the search-flags pattern and register it in the flag-ceiling drift guard (`.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`, `.opencode/skills/system-spec-kit/mcp_server/tests/flag-ceiling.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Confirm a deliberately corrupted scratch row is reported in `contentHashMismatches` with its id while a clean corpus reports zero, and re-read the mismatched row to prove the body and stored hash are untouched
- [ ] T009 Confirm the flag-off integrity summary keeps the current shape and a null-hash pre-migration row stays out of the mismatch count, then run `validate.sh --strict` to exit 0
- [ ] T011 Author the named test with the catch-rate, clean-zero, null-skip, no-mutation and flags-off byte-identical assertions (`.opencode/skills/system-spec-kit/mcp_server/tests/content-hash-integrity.vitest.ts`)
- [ ] T012 Specify the planted-mismatch catch-rate benchmark at 100 percent caught and 0 false positives with the `npx vitest run tests/content-hash-integrity.vitest.ts` reproduce path (`.opencode/skills/system-spec-kit/mcp_server/tests/content-hash-integrity.vitest.ts`)
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
