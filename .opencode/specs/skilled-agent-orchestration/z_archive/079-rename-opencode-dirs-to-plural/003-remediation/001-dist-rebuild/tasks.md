---
title: "Tasks: Phase 001 - dist rebuild"
description: "Rebuild stale system-spec-kit MCP dist output after the 096 plural-directory rename and document generated-output drift evidence."
trigger_phrases:
  - "dist rebuild"
  - "098 phase 001"
  - "097 remediation"
  - "infrastructure quality"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/001-dist-rebuild"
    last_updated_at: "2026-05-07T18:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored child phase documentation"
    next_safe_action: "Execute or verify phase work according to tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/tests/hooks/settings-driven-invocation-parity.vitest.ts:185"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:13"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:16"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/code_graph/lib/index-scope-policy.js:19"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 001 - dist rebuild

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

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read affected surfaces and capture current drift [done]
- [x] T002 Confirm phase allowlist and out-of-scope boundaries [done]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Apply targeted remediation edits [done]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T004 Run phase-specific verification commands [done]
- [x] T005 Update checklist with evidence [done]
- [x] T006 Update implementation summary and metadata [done]
- [x] T007 Run parent `validate.sh --strict` [done]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Phase-specific verification passed
- [x] Checklist evidence complete

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: `../spec.md`

<!-- /ANCHOR:cross-refs -->
