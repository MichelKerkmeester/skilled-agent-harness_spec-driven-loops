---
title: "Tasks: Compression Exclusion Guard Utility"
description: "Build a reusable, dependency-free guard (DENY_PATH + DENY_KEYS + citation-survival + raw-hash) that any future compression path must pass through, so control-plane data (generated JSON, metadata, MCP envelopes, state files, diffs, citations) can never reach a compressor."
trigger_phrases:
  - "compression exclusion guard"
  - "deny path deny keys"
  - "compression safety guard"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-headroom-utilization/003-compression-exclusion-guard"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the compression-exclusion-guard phase"
    next_safe_action: "Decide the guard module location and language"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-003-compression-exclusion-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Compression Exclusion Guard Utility

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

- [ ] T001 Port DENY_PATH / DENY_KEYS from the research into a typed module
- [ ] T002 Add the allowlisted copied-bundle artifact kind
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Implement guard(): canonicalize → deny-path → recursive deny-key → hash → citation extract
- [ ] T004 Wire raw-on-any-exception fail-safe
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Author positive + negative fixtures; assert 100% rejection of excluded classes
- [ ] T006 Run the test suite green; STOP for review
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
