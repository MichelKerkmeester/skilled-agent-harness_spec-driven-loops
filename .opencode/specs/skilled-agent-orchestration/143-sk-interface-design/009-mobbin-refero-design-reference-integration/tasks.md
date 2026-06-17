---
title: "Tasks: Mobbin and Refero design-reference integration"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mobbin refero integration tasks"
  - "design references mcp tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-interface-design/009-mobbin-refero-design-reference-integration"
    last_updated_at: "2026-06-15T11:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Wiring and integration complete; live verify pending"
    next_safe_action: "User OAuth plus Code Mode reload, then verify the tools resolve"
    blockers: []
    key_files:
      - ".utcp_config.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-009-mobbin-refero-design-reference-integration"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Mobbin and Refero design-reference integration

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

- [x] T001 Confirm the Mobbin/Refero MCP endpoints, auth model, and the mcp-remote bridge
- [x] T002 Back up `.utcp_config.json`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `mobbin` mcp-remote manual to `.utcp_config.json`
- [x] T004 Add `refero` mcp-remote manual to `.utcp_config.json`
- [x] T005 Author `references/design_references_mcp.md` (critique-against use plus hard rules)
- [x] T006 Integrate into SKILL.md (ON_DEMAND row, references entry, Related Skills bullet, loading note) and add the `design_inventory.md` cross-pointer
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 JSON parse plus endpoint liveness probe (both endpoints return an auth challenge)
- [x] T008 `package_skill --check` PASS, em-dash sweep clean, SKILL.md under the word cap
- [x] T009 Live tool resolution + invocation (`mobbin.*` / `refero.*`) confirmed: `mobbin_search_screens` returns real screen data on Node 24
- [x] T010 `validate.sh --strict` on this phase, scoped commit
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Static verification passed (JSON, package_skill, endpoint probe); live invocation confirmed on Node 24
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
