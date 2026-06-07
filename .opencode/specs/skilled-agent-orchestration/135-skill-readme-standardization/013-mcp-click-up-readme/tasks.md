---
title: "Tasks: mcp-click-up README"
description: "Task list for the mcp-click-up README rewrite via deep-context and dual-draft."
trigger_phrases:
  - "mcp-click-up readme tasks"
importance_tier: "normal"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-skill-readme-standardization/013-mcp-click-up-readme"
    last_updated_at: "2026-06-07T12:50:50Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "All phase-013 tasks complete"
    next_safe_action: "Begin phase 014 (mcp-code-mode README)"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-click-up/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-std-135-013"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: mcp-click-up README

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

- [x] T001 Seed the deep-context packet and seat prompts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Iteration 1 seats: DeepSeek + MiMo gather purpose, the two paths, invocation
- [x] T003 [P] Iteration 2 seats: verify the command surface, routing, safety invariants and the MCP-fact drift
- [x] T004 Synthesize context-report.md (host corrected the broken MCP facts to authoritative values)
- [x] T005 [P] Dual-draft: DeepSeek + MiMo author the README under anti-drift constraints
- [x] T006 Scan the draft for wrong-form MCP leaks, verify the 7 paths, write `mcp-click-up/README.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 `validate_document.py --type readme` passes (0 issues)
- [x] T008 HVR prose scan clean and anti-drift scan clean (no clickup_official, no .utcp_config, no { code } call)
- [x] T009 `validate.sh --strict` on the phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] README validated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
