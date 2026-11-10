---
title: "Before: regeneration and verification"
description: "The gate set on main right after the prose sweep landed, before this phase's regeneration and fixes."
trigger_phrases:
  - "regeneration and verification before"
importance_tier: "normal"
contextType: "implementation"
---
# Before: regeneration and verification

Recorded on 2026-10-28 from worktree `264-prose-clarity-sweep`, rebased onto main after the prose sweep (`709e428e85`), before the contracts were recompiled. Runner: `../../010-prose-clarity-pass/scratch/gates.sh`, the same 38-gate set phase 010 ran. Raw output: `.scratch-dc90/072-010/gates4-summary.txt`.

## 1. Gates

36 of 38 exit 0. Two fail, and neither comes from the routing program's own files:

| Gate | Exit | Cause |
|------|------|-------|
| `router-tests` | 1 | `declared-surfaces-parity.test.cjs` reads `.skilled/plugins/system-skill-advisor.js`, which the commit that moved the OpenCode plugins into `.opencode/plugins/` removed |
| `contract-drift` | 2 | `STALE_SOURCE_DIGEST` for `deep/research`: `system-spec-kit/references/workflows/auto-mode-contract.md` changed on main after the contracts were last compiled |

Routing accuracy: 155/195, 49/66, 19/24, the phase 002 baseline.

## 2. CI on main

CI on `dd6c3c6538`, the main commit before the sweep landed, failed six jobs. The sweep's push recompiled the contracts and fixed one, Deep-Loop Runtime Tests, and added none. Five stayed red on `0e71a241d5`:

| Job | Cause |
|-----|-------|
| Command Tree Parity | `EXTRA .opencode/commands/assets`: a tracked link to `.skilled/commands/assets`, which holds only private, ignored entries, so a CI checkout has no target |
| Gate Inputs | 12 `filter-twins` failures: `.opencode/plugins/**` path filters have no `.skilled/plugins/**` twin, and that tree no longer exists |
| sk-code Script Tests | `declared-surfaces-parity.test.cjs` reads the removed `.skilled/plugins` path |
| Skill Advisor Stress Tests | `opencode-plugin-bridge-stress.vitest.ts` imports the plugin from the removed path |
| Spec-Kit Check | `claude-code-native-dispatch-docs.vitest.ts` reads the "You ARE Claude Code already" bullet as one line, and the prose sweep had split it |

The first four come from the plugin move. The fifth comes from the prose sweep.
