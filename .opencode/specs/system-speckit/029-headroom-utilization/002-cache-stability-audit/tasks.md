---
title: "Tasks: Cache-Stability Audit of Prompt Prefixes"
description: "Audit our hook/prompt-prefix injection for volatile tokens (UUIDs, ISO-8601 timestamps, JWTs, hex hashes, session IDs) that bust the provider prompt cache, and relocate them after the stable cached prefix. Applies CacheAligner principle with zero Headroom dependency."
trigger_phrases:
  - "cache stability audit"
  - "prompt cache busting"
  - "volatile token audit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-headroom-utilization/002-cache-stability-audit"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the cache-stability-audit phase"
    next_safe_action: "Identify the hook sites that contribute to the cached prefix"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-002-cache-stability-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cache-Stability Audit of Prompt Prefixes

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

- [ ] T001 Enumerate hook/startup/advisor injection sites that contribute to the prompt prefix
- [ ] T002 Build the volatile-token matchers (UUID / ISO-8601 / JWT / hex-hash / session-id)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Grep the sites; record each volatile-token occurrence with file:line into the audit report
- [ ] T004 Classify each as in-cached-prefix vs after-prefix; mark the cache-busters
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Recommend a move-after-prefix (or justified-keep) for each cache-buster
- [ ] T006 Apply the low-risk reorders; re-run the audit; STOP for review
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Report artifact written and `validate.sh` green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
