---
title: "Tasks: 002 — Semantic Matcher"
description: "T### task list for the semantic matcher sub-phase: pure cosine matcher, cosine precedent reuse, in-memory cache, unit tests."
trigger_phrases:
  - "027 phase 004 semantic matcher tasks"
importance_tier: "normal"
contextType: "task"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/002-semantic-matcher"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Extracted Sub-Phase 2 tasks from 007 leaf tasks"
    next_safe_action: "Claim T001 (matcher module)"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-007-phase-split"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: 002 — Semantic Matcher

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

**Task Format**: `T### [P?] Description (file path)` • `REQ-NNN` = parent spec requirement
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm cosine + BLOB-to-Float32 precedent (REQ-002b) (`mcp_server/lib/search/memory-summaries.ts`)
- [ ] T002 [P] Define `SemanticMatch` shape and gate parameters (`mcp_server/lib/triggers/semantic-trigger-matcher.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Implement `matchSemanticTriggers` pure function with threshold/margin/max gates + deterministic ordering (REQ-002a) (`mcp_server/lib/triggers/semantic-trigger-matcher.ts`)
- [ ] T004 Implement in-memory trigger-embedding cache (load-on-first-call, TTL / `--force` invalidation, concurrent-safe) (REQ-002c) (`mcp_server/lib/triggers/semantic-trigger-matcher.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Cosine math unit tests against known vectors (REQ-002b) (`mcp_server/__tests__/triggers/semantic-matcher.vitest.ts`)
- [ ] T006 Gate + determinism unit tests (REQ-002a) (`mcp_server/__tests__/triggers/semantic-matcher.vitest.ts`)
- [ ] T007 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-semantic-trigger-fallback/002-semantic-matcher --strict`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Cosine + gate + determinism tests green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md` (semantic trigger fallback phase parent)
<!-- /ANCHOR:cross-refs -->
