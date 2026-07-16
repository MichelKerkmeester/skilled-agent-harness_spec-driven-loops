---
title: "Tasks: Novel Embedding-Drift Monitoring plus Alerting [template:level_2/tasks.md]"
description: "Task breakdown for the per-chunk regime fingerprint, the per-regime census and the report-only drift detector that guards the re-index path."
trigger_phrases:
  - "embedding drift monitor tasks"
  - "mixed vector guard tasks"
  - "embedding regime fingerprint tasks"
  - "embedding context version tasks"
  - "embedding drift detector tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-spec-data-quality/004-novel-research/020-novel-embedding-drift-monitor"
    last_updated_at: "2026-07-04T17:12:06.926Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored PLANNED task breakdown for the regime fingerprint census"
    next_safe_action: "Build the regime fingerprint field on the vector record"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-028-005-020-tasks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The detector emits findings and alerts only and never re-embeds or mutates a vector"
---
# Tasks: Novel Embedding-Drift Monitoring plus Alerting

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

- [ ] T001 Confirm the vector record PK seam near `embedding-cache.ts:157` and the field shape for the new fingerprint columns (`.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts`)
- [ ] T002 Confirm the embed seam and the LRU key at `embeddings.ts:309-311` so the stamp matches the cache identity (`.opencode/skills/system-spec-kit/shared/embeddings.ts`)
- [ ] T003 [P] Confirm the standing drift-guard registration contract so the new channel slots next to the coverage and storage guards
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the `embedding_context_version` plus model id plus normalizer fingerprint fields to the vector record, default-off (`.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts`)
- [ ] T005 Compute and write the fingerprint at the embed seam so two same-regime chunks stamp identically (`.opencode/skills/system-spec-kit/shared/embeddings.ts`)
- [ ] T006 Build the coverage readout that counts chunks per live regime and classifies single-regime or mixed-regime
- [ ] T007 Build the report-only detector and register it as a standing drift guard (`.opencode/skills/system-spec-kit/mcp_server/scripts/sweep/detect-embedding-drift.ts`)
- [ ] T008 Build the dry-run-then-apply backfill over the additive write path (`.opencode/skills/system-spec-kit/mcp_server/scripts/sweep/backfill-embedding-regime.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Same-regime byte-identity test proves two chunks of one regime fingerprint identically
- [ ] T010 Seeded two-regime scratch corpus fires a mixed-regime alert and a single-regime corpus does not
- [ ] T011 Backfill dry-run reports the would-stamp count and an apply makes the census read a real per-regime number
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
