---
title: "Tasks: Pi Subagent Directive Removal"
description: "Completed tasks for removing the pi-subagents dispatch mandate from the Pi hook layer, its tests, and the runtime docs."
trigger_phrases:
  - "pi subagent directive removal tasks"
  - "dispatch mandate removal tasks"
  - "pi-subagents hook cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/011-pi-subagent-directive-removal"
    last_updated_at: "2026-09-08T09:30:00Z"
    last_updated_by: "pi-helper"
    recent_action: "Completed the removal of the dispatch directive and its shadow machinery"
    next_safe_action: "Commit the removal packet"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.ts"
      - ".opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts"
      - ".opencode/skills/system-skill-advisor/mcp-server/tests/hooks/prompt-advisor.vitest.ts"
      - ".opencode/hooks/injection-contract.md"
      - ".pi/PLUGINS.md"
      - ".pi/SYNC.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-08-hook-removal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: Pi Subagent Directive Removal

- [x] T001 Remove the dispatch directive constants, byte counts, prototype flag, shadow receipt interfaces, policy-plan observation, and lifecycle shadow resets from `prompt-advisor.ts`; keep the advisor bridge, raw capture, brief de-dup, and advisor-debug.
- [x] T002 Remove `DIRECTIVE_MARKER` from `dispatch-preflight-lint.ts` transform recognition and injected-content stripping; drop the stale native-subagent-tool clause from the deny reason.
- [x] T003 Rewrite `dispatch-preflight-lint.test.ts` without the compact semantic matrix, the shadow boundary suite, and the directive-content assertions; keep the deny matrix and the registered-boundary authorization tests.
- [x] T004 Replace the directive-append test in `prompt-advisor.vitest.ts` with a no-context no-transform expectation; keep the blank-input and renderer-agnostic tests.
- [x] T005 Update `injection-contract.md`, `.pi/PLUGINS.md`, and `.pi/SYNC.md` to stop asserting the removed package mandate.
- [x] T006 Run all three affected test suites — 32/32, 14/14, 3/3.
- [x] T007 Regenerate the packet graph metadata and update the parent phase map.
