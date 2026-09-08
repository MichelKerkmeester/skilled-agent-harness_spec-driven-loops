---
title: "Implementation Plan: Pi Subagent Directive Removal"
description: "Remove the per-turn pi-subagents dispatch mandate and its shadow machinery from the Pi hook layer, then update the enforcement-hook markers, the two test suites, and the runtime docs."
trigger_phrases:
  - "pi subagent directive removal plan"
  - "remove dispatch directive plan"
  - "pi-subagents mandate removal plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/011-pi-subagent-directive-removal"
    last_updated_at: "2026-09-08T09:30:00Z"
    last_updated_by: "pi-helper"
    recent_action: "Authored the removal plan for the per-turn dispatch mandate"
    next_safe_action: "Verify test suites and commit"
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

# Implementation Plan: Pi Subagent Directive Removal

## 1. OVERVIEW

The pi-subagents package is gone from the runtime config, so every artifact that mandates it must go with it. The visible prompt contribution, the shadow observational machinery, the transform-recognition marker in the enforcement hook, and the docs that assert the mandate are all dead weight.

## 2. TECHNICAL CONTEXT

- `prompt-advisor.ts` is loaded by Pi through `.pi/extensions/prompt-advisor.ts`, a symlink into `.opencode/skills/system-skill-advisor/hooks/pi/`. The canonical source is the realpath file — edit that.
- The compact-prototype machinery (`SPECKIT_PI_COMPACT_DIRECTIVE_PROTOTYPE`, receipts, policy-plan observation) exists solely to measure the never-emitted compact replacement of the dispatch directive — it has no other consumer.
- The advisor-brief de-dup (`SPECKIT_PI_DIRECTIVE_DEDUP`) dedups the shared advisor brief's directive block only, not the removed directive — keep it, but re-scope the store to the dedup map alone.
- The enforcement hook's `DIRECTIVE_MARKER` exists only to recognize/strip the injected directive from captured user text; once nothing injects it, the marker is dead. `CAPSULE_MARKER` and `SPEC_GATE_MARKER` remain.
- The deny reason "…or use the native subagent tool" advertises a tool that no longer exists in this runtime config.

## 3. PATTERN

Follow the same shape as 010: surgical removal with test evidence, no behavior change to the remaining hook surfaces.

## 4. KEY COMPONENTS

| Component | Change |
|---|---|
| `prompt-advisor.ts` | Rewrite around the advisor bridge; remove dispatch directive constants, byte counts, prototype flag, shadow receipt interfaces/machinery, policy-plan loading/observation, lifecycle shadow resets; keep raw capture, dedup, advisor-debug |
| `dispatch-preflight-lint.ts` | Remove `DIRECTIVE_MARKER` constant and its two uses; drop the stale reason clause |
| Test suites | Delete the semantic-matrix/shadow-boundary suites; retarget the injector-related assertions to no-directive expectations |

## 5. VERIFICATION

1. `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` → 32/32
2. `npx vitest run .opencode/hooks/dispatch/pi/directive-dedup.test.ts` → 14/14
3. `npx vitest run .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/prompt-advisor.vitest.ts` → 3/3
4. `grep -rn "Pi subagent dispatch"` over the runtime surfaces → only historical specs/artifacts remain
