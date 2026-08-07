# Fix Report — Pre-existing Ghost Paths

## Edits

1. **DELETE** — `feature-catalog/tooling-and-scripts/cli-runtime-warm-only-fallbacks.md`
   Removed row: `| mcp-server/hooks/opencode/session-start.ts | Hook adapter | OpenCode session-start with CLI warm path |`

2. **REPLACE** — `feature-catalog/context-preservation/session-start-priming.md` (line 23)
   Before: "The same payload shape is transported by `hooks/copilot/session-prime.ts` and `hooks/opencode/session-start.ts`."
   After: "The same payload shape is transported by the `session-start.ts` adapters under `hooks/codex/`, `hooks/cursor/`, and `hooks/devin/`."

## Verification

1. `test -f .opencode/skills/system-spec-kit/mcp-server/hooks/opencode/session-start.ts`
   Output: `FILE NOT FOUND` (expected)

2. `grep -rn "hooks/opencode/session-start" .opencode/skills/system-spec-kit/feature-catalog`
   Output: no matches, exit 1 (expected zero hits)

3. `git diff --stat -- .opencode/skills/system-spec-kit/feature-catalog`
   ```
   context-preservation/session-start-priming.md      |  2 +-
   tooling-and-scripts/cli-runtime-warm-only-fallbacks.md |  3 +--
   feature-catalog.md                                  | 10 +++++-----
   ux-hooks/goal-opencode-plugin.md                    |  6 +++---
   ```
   Note: `session-start-priming.md` and `cli-runtime-warm-only-fallbacks.md` are my edits (1 deletion each). `feature-catalog.md` and `goal-opencode-plugin.md` carry pre-existing unrelated working-tree changes (path relocations to `.opencode/hooks/goal/`), untouched by this task.

## Summary

Removed the ghost `hooks/opencode/session-start.ts` references; only the intended two files were edited.
