---
title: "Tasks: Codex policy guardedTools — activate the Open Design PreToolUse branch"
description: "Ordered tasks to populate .codex/policy.json openDesignPreconditions.guardedTools and verify activation, deny-case, no-block-transport, and 11/11 no-regression."
trigger_phrases:
  - "codex policy guardedtools tasks"
  - "activate open design pretooluse branch"
  - "guarded tools policy design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/004-codex-policy-schema"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all populate and verification tasks complete with evidence"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".codex/policy.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Codex policy guardedTools — activate the Open Design PreToolUse branch

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

_Confirm no schema gap (10 minutes)._


- [x] T001 Confirm `OpenDesignPreconditions.guardedTools`, `CodexPolicyFile.openDesignPreconditions`, and `CodexPolicyFile.toolPreconditions.openDesignPreconditions` already exist (`.opencode/skills/system-spec-kit/mcp_server/hooks/codex/pre-tool-use.ts`) [5m] — types confirmed at `pre-tool-use.ts:44`/`:48`
- [x] T002 Confirm `resolveGuardedOpenDesignTools` reads both policy locations and `evaluateOpenDesignPrecondition` runs before the Bash return (`pre-tool-use.ts`) [3m] — both present; deny reason emitted at `pre-tool-use.ts:352`
- [x] T003 Record conclusion: no hook edit required; scope is `.codex/policy.json` only. (Only if a real schema gap is found, scope expands to `pre-tool-use.ts` — not expected.) [2m] — no schema gap; no source edited

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_Populate the policy (15 minutes)._


- [x] T004 Add `openDesignPreconditions.guardedTools` as a sibling key of `bashDenylist` (`.codex/policy.json`) [8m] — 21-entry block present at `policy.json:44`
  - 7 base write tools: `create_artifact`, `write_file`, `create_project`, `start_run`, `cancel_run`, `delete_file`, `delete_project` — all present
  - 7 native-MCP variants: `mcp__open-design__<tool>` — all present
  - 7 Code Mode variants: `open_design.open_design_<tool>` — all present
  - Populate the top-level `openDesignPreconditions` only (avoid duplicating into `toolPreconditions`) — top-level only, no nested duplicate
- [x] T005 Verify NO read-only / transport tool name was added (`get_run`, `list_projects`, `get_active_context`, `get_artifact`, `get_project`, `get_file`, `search_files`, `list_files`, `list_skills`, `list_plugins`, `list_agents`) (`.codex/policy.json`) [3m] — all 11 absent from `guardedTools`
- [x] T006 Verify no spec/packet/phase IDs or spec paths were added; any prose is evergreen; existing `bashDenylist` / `bash_denylist` untouched (`.codex/policy.json`) [4m] — durable `description` only; both denylists intact

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

_End-to-end verification: JSON validity, deny-case, no-block-transport, and 11/11 no-regression (30 minutes)._


### JSON validity
- [x] T007 Parse the policy file (`node -e "JSON.parse(require('fs').readFileSync('.codex/policy.json','utf8'))"` or `python3 -m json.tool .codex/policy.json`) — expect exit 0 [3m] — exit 0, `JSON_VALID`

### Deny-case (activation proof)
- [x] T008 Runtime harness: `handleCodexPreToolUse({ tool: 'start_run', tool_input: {} }, { policyPath: '<repo>/.codex/policy.json' })` → expect `{ decision: 'deny', reason: 'Guarded Open Design call denied: missing or invalid design proof token' }` [8m] — deny confirmed; harness ran via node type-stripping against the real policy file (`tsx` unavailable, dist stale)
- [x] T009 Namespace-variant deny: same harness with `tool: 'mcp__open-design__start_run'` and `tool: 'open_design.open_design_delete_project'` → expect deny for both [4m] — both deny; `create_artifact` (bare) also confirmed deny

### No-block-transport (the critical guard)
- [x] T010 Read/transport unaffected: `handleCodexPreToolUse({ tool: 'get_run', tool_input: {} }, { policyPath })` → expect `{}` (not in `guardedTools`) [3m] — `get_run` and `list_projects` both empty-allow
- [x] T011 Non-guarded + ordinary Bash unaffected: `{ tool: 'Read', ... }` → `{}`; `{ tool: 'Bash', tool_input: { command: 'git status --short' } }` → `{}` [3m] — both empty-allow
- [x] T012 Bash deny lane intact: `{ tool: 'Bash', tool_input: { command: 'rm -rf /' } }` → still deny (no regression to the existing denylist behavior) [2m] — denied with the existing Bash denylist reason

### No-regression suite
- [x] T013 Run the existing Codex hook vitest suite (`vitest run codex-pre-tool-use` from `.opencode/skills/system-spec-kit/mcp_server/`) → expect 11/11 pass; the test file is NOT modified [5m] — 11/11 passed, test file unmodified

### Documentation
- [x] T014 Mark all checklist.md items with evidence (`checklist.md`) [2m] — all P0/P1 items verified with evidence

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `.codex/policy.json` is valid JSON with the 21-entry `guardedTools` list
- [x] Deny-case (bare + namespace variants) confirmed via the real policy file
- [x] No-block-transport confirmed (read tool, non-guarded tool, ordinary Bash all `{}`)
- [x] Existing vitest suite passes 11/11
- [x] checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Ordered: confirm schema -> populate -> verify (JSON + deny-case + no-block-transport + 11/11)
- Effort estimates per task; explicit verification tasks
-->
