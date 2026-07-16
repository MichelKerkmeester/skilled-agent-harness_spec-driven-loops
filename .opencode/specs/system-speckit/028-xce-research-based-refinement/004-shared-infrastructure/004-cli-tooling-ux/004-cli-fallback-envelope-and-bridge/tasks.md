---
title: "Tasks: CLI Fallback Envelope and Bridge Allowlist"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "004-cli-fallback-envelope-and-bridge tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/004-cli-fallback-envelope-and-bridge"
    last_updated_at: "2026-06-11T03:34:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed implementation and verification tasks"
    next_safe_action: "No implementation action pending"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/warm-cli-fallback-envelope.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/warm-cli-fallback-envelope.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/spec-memory-bridge-allowlist.vitest.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-004-cli-fallback-envelope-and-bridge"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: CLI Fallback Envelope and Bridge Allowlist

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

- [x] T001 Compare current envelope shapes across `spec-memory-cli-fallback.ts:148-220`, `code-index-cli-fallback.ts:151-220`, `skill-advisor-cli-fallback.ts:158-187`; identify the field superset.
- [x] T002 Capture the code-index denylist posture (`mk-code-graph-bridge.mjs:18-25`, `:272-282`) as the allowlist pattern.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Define the normalized warm-fallback envelope + reason codes (`skipped`, `fail_open`, `exitCode`, retryability).
- [x] T004 [P] Wire the three hook helpers to emit the normalized envelope additively (keep existing fields).
- [x] T005 Add the prompt-time allowlist to `mk-spec-memory-bridge.mjs:206-230`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Verify the envelope contract test asserts one shape across all three helpers.
- [x] T007 Verify existing consumer fields remain present (additive-only).
- [x] T008 Verify the spec-memory bridge rejects any out-of-allowlist toolName.
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
