#!/bin/bash
# Runs the suites the remediation touches and prints one count line per suite.
W=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/143-opencode-dual-compat-build
export PATH=/Users/michelkerkmeester/.nvm/versions/node/v26.8.2/bin:$PATH
OUT=$1; mkdir -p "$OUT"; cd "$W" || exit 9
run() { name=$1; shift; "$@" > "$OUT/$name.txt" 2>&1; echo "$name exit=$? $(grep -E '^ℹ (pass|fail) |Tests +[0-9]' "$OUT/$name.txt" | tr '\n' ' ')"; }
run plugins node --test .opencode/plugins/tests/
run guard-node node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs .opencode/plugins/tests/mcp-route-guard.test.cjs
run guard-vitest sh -c 'cd .skilled && npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs'
run hook-flags node --test .skilled/hooks/shared/hook-flags.test.cjs
run config-shape node --test .skilled/bin/tests/opencode-config-shape.test.cjs
run doctor-battery node --test .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs
run deep-loop-dual sh -c 'cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/opencode-dual-dispatch.vitest.ts'
run pi-preflight sh -c 'cd .skilled && npx vitest run hooks/dispatch/pi/dispatch-preflight-lint.test.ts'
run codex-shell node --test .skilled/hooks/dispatch/codex/codex-shell-tool.test.mjs
