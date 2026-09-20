---
title: "Tasks: Phase 4 — MCP server integration for mcp-obsidian"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "obsidian mcp tasks"
  - "obsidian utcp manual tasks"
  - "mcp-obsidian phase 4 tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/004-mcp-server-integration"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 4 MCP-integration tasks"
    next_safe_action: "Verify the package resolves, then wire the obsidian manual + env keys"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-mcp-server-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: mcp-server-integration

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

- [ ] T001 Confirm the Obsidian MCP package choice from `001-deep-research/research.md`; record the exact npm name + version
- [ ] T002 [P] `npm view <obsidian-mcp-pkg>` — verify the name resolves on the public registry (no 404) before wiring — avoid the `@clickup/mcp-server` trap
- [ ] T003 Create `mcp-servers/obsidian-mcp/{README.md, package.json}` install pointer (placeholder, nothing vendored)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Add the `obsidian` manual to `.utcp_config.json` (`transport: stdio`, `command: npx`, `args: [-y, <pkg>]`, `env` block) — shared runtime
- [ ] T005 Add `obsidian_OBSIDIAN_*` keys to `.env.example` under `# Obsidian`; prefix == manual name — shared runtime — avoid the `clickup_` vs `clickup_official` mismatch
- [ ] T006 Author `references/mcp-tools.md`: tool inventory, auth, `<manual>.<manual>_<tool>` Code Mode invocation pattern, MCP-vs-CLI routing
- [ ] T007 Record the Local REST API plugin + running-Obsidian + token dependency and headless posture (documented-unproven if no vault in-env)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Parse-check `.utcp_config.json` (valid JSON); grep-confirm the prefix equals the manual name across both shared files
- [ ] T009 Reach the manual via `list_tools()`/`call_tool_chain`, or record documented-unproven with the vault/headless reason
- [ ] T010 `validate.sh` this phase; refresh `implementation-summary.md` + continuity; update `../changelog/`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] Chosen npm package resolves (no 404); prefix == manual name across both shared files
- [ ] `call_tool_chain` reaches the `obsidian` manual, or the MCP path is documented-unproven with the reason recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parallel sibling**: `../003-cli-tool-integration/` (CLI half)
- **Next phase**: `../005-skill-authoring/`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
