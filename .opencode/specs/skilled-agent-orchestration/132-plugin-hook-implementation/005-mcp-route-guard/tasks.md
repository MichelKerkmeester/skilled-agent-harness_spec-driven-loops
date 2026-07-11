---
title: "Tasks: External MCP Route Guard"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp route guard tasks"
  - "guard core task breakdown"
  - "code mode adapter tasks"
  - "warn-only plugin tasks"
  - "utcp manifest guard tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/132-plugin-hook-implementation/005-mcp-route-guard"
    last_updated_at: "2026-07-11T09:03:30.904Z"
    last_updated_by: "spec-author"
    recent_action: "Broke the guard build into Setup, Implementation, and Verification T-tasks"
    next_safe_action: "Start T001 after the posture fork is decided; keep every task unchecked until built"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs"
      - ".opencode/plugins/mk-mcp-route-guard.js"
      - ".opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs"
      - ".claude/settings.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-mcp-route-guard"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Is the optional generator wiring (T015) in scope for this phase or deferred?"
    answered_questions: []
---
# Tasks: External MCP Route Guard

<!-- SPECKIT_LEVEL: 3 -->
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

- [ ] T001 Create the `runtime/lib` and `runtime/hooks/claude` subtree (`.opencode/skills/mcp-code-mode/runtime/`)
- [ ] T002 Confirm the bounded-logger pattern to reuse: 256KB + `.1` backup + age-prune (`.opencode/skills/system-deep-loop/runtime/lib/deep-loop/dispatch-guard.cjs`)
- [ ] T003 [P] Resolve the manifest-strict vs broad posture fork before coding the core default (`decision-record.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Implement tool-name parse + server normalization + internal-server exemption (`.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs`)
- [ ] T005 Implement the mtime-cached manifest family-set loader: single `JSON.parse`, read-size cap (`.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs`)
- [ ] T006 Implement `evaluateNativeMcpCall` warn/allow decision and the `{decision,detail,warnings,audits}` return shape, no reject path (`.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.cjs`)
- [ ] T007 Implement the OpenCode adapter: default-export-only, warn-only, log-only, never throws, fails open (`.opencode/plugins/mk-mcp-route-guard.js`)
- [ ] T008 Implement the Claude `PreToolUse` hook: `additionalContext` on warn, silent exit 0 otherwise, fail-open to approve (`.opencode/skills/mcp-code-mode/runtime/hooks/claude/mcp-route-guard.cjs`)
- [ ] T009 Add the third `mcp__claude_ai_.*` matcher block (timeout 5) alongside the existing `Bash` and `Task` blocks (`.claude/settings.json`)
- [ ] T010 [P] Add the `mk-mcp-route-guard.js` entry to the CURRENT ENTRYPOINTS table (`.opencode/plugins/README.md`)
- [ ] T015 [P] Optional/deferred: extend the manifest-reading generators to emit and verify the settings matcher block (`.opencode/skills/mcp-code-mode/scripts/install.sh`, `update.sh`, `doctor.sh`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Write the table-driven unit test for `evaluateNativeMcpCall`: warn (ClickUp), manifest-strict allow (Webflow absent), internal exempt (code_mode, mk_code_index), non-MCP (Bash, Read) (`.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.test.cjs`)
- [ ] T012 Write the Claude-hook integration test: pipe a `PreToolUse` JSON for the ClickUp tool, assert `additionalContext`, exit 0, and no `permissionDecision` (`.opencode/skills/mcp-code-mode/runtime/lib/mcp-route-guard.test.cjs`)
- [ ] T013 Manual check: a native connector call surfaces the advisory and still runs; internal servers and non-MCP tools stay silent
- [ ] T014 Update documentation and synchronize spec/plan/tasks/checklist
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
