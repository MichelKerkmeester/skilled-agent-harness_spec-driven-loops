---
title: "Implementation Summary: Pi Subagent Directive Removal"
description: "Command-backed record of removing the pi-subagents dispatch mandate: prompt-advisor.ts no longer injects the directive, the compact shadow machinery is gone, the enforcement hook marker is dead-code-free, and the docs no longer assert the removed package."
status: complete
completion_pct: 100
trigger_phrases:
  - "pi subagent directive removal summary"
  - "dispatch mandate removal evidence"
  - "pi-subagents hook cleanup status"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/011-pi-subagent-directive-removal"
    last_updated_at: "2026-09-08T09:30:00Z"
    last_updated_by: "pi-helper"
    recent_action: "Recorded the evidence ledger for the dispatch mandate removal"
    next_safe_action: "Confirm commit of the removal packet"
    blockers:
      - "The removal files remain uncommitted in the working tree at authoring time"
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

# Implementation Summary: Pi Subagent Directive Removal

## 1. WHAT CHANGED

| Surface | Change |
|---|---|
| `prompt-advisor.ts` | The 554-byte per-turn dispatch directive is gone; the compact-prototype flag, delivery receipts, policy-plan observation, and lifecycle shadow resets are gone. The advisor bridge, raw-user capture, advisor-brief de-dup, and advisor-debug stay. |
| `dispatch-preflight-lint.ts` | `DIRECTIVE_MARKER` removed from transform recognition and injected-content stripping; deny reason no longer advertises the native subagent tool. |
| `dispatch-preflight-lint.test.ts` | Compact semantic matrix and shadow boundary suites removed; directive-content assertions removed; deny matrix and raw-authorization boundary tests retained and re-targeted. |
| `prompt-advisor.vitest.ts` | Directive-append test replaced by no-context no-transform. |
| `injection-contract.md` | Pi-only directive ownership bullet replaced by the forwarder-only statement. |
| `.pi/PLUGINS.md` | `pi-subagents (v0.50.0)` plugin entry removed. |
| `.pi/SYNC.md` | Package-discovery sentence now records that the package is no longer installed. |

## 2. EVIDENCE

```text
$ npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts
  Test Files  1 passed (1)
      Tests  32 passed (32)

$ npx vitest run .opencode/hooks/dispatch/pi/directive-dedup.test.ts
  Test Files  1 passed (1)
      Tests  14 passed (14)

$ npx vitest run .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/prompt-advisor.vitest.ts
  Test Files  1 passed (1)
      Tests  3 passed (3)
```

## 3. RESIDUAL

- The dispatch enforcement hook itself still denies unsatisfied cli-* dispatch at the tool-call boundary (raw-user authorization), which is intentional and unchanged.
- The cli-pi skill packet and manual-testing-playbook PI-009 still document the community package as third-party reference material.
- Historical specs (002-injection-bloat-reduction, 031-cli-pi-creation, 007 phase 003/004) retain their archival references.
