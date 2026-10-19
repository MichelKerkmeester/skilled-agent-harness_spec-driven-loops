#!/bin/bash
# Runs the dispatch adapter, guard and shared hook suites under their owning runners and prints one count line per suite.
W=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/147-dispatch-adapter-test-repair
export PATH=/Users/michelkerkmeester/.nvm/versions/node/v26.8.2/bin:$PATH
OUT=$1; mkdir -p "$OUT"; cd "$W" || exit 9
run() { name=$1; shift; "$@" > "$OUT/$name.txt" 2>&1; echo "$name exit=$? $(grep -E '^ℹ (pass|fail) |Tests +[0-9]|Test Files +[0-9]' "$OUT/$name.txt" | tr '\n' ' ')"; }
run pi-preflight .skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts
run codex-shell .skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/dispatch/codex/codex-shell-tool.test.mjs
run pi-dedup .skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/dispatch/pi/directive-dedup.test.ts
run hooks-vitest-tree .skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts
run guard-vitest .skilled/node_modules/.bin/vitest run --root .skilled/hooks/dispatch/lib dispatch-audit.test.mjs
run guard-node node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs
run shared-node node --test .skilled/hooks/shared/hook-flags.test.cjs .skilled/hooks/shared/hook-adapter-shared.test.cjs .skilled/hooks/shared/hook-stdin-deadline.test.mjs
run wrong-runner-codex node --test .skilled/hooks/dispatch/codex/codex-shell-tool.test.mjs
run wrong-runner-pi sh -c 'cd .skilled && npx vitest run hooks/dispatch/pi/dispatch-preflight-lint.test.ts'
