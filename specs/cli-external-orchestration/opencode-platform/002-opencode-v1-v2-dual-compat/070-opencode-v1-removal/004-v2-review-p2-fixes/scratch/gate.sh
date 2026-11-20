#!/usr/bin/env bash
# usage: gate.sh <label>
set -u
W=/Users/michelkerkmeester/worktrees/public/482-opencode-v2-p2-fixes
OUT=${GATE_OUT:-/tmp}/gate-$1
mkdir -p "$OUT"; cd "$W"
CLI=.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests
NODE_FILES=( .opencode/plugins/tests/*.test.cjs
  .skilled/bin/tests/opencode-config-shape.test.cjs
  .skilled/bin/tests/opencode-compat-layout.test.cjs
  .skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs
  $CLI/default-model-id.test.cjs $CLI/opencode-models-form.test.cjs $CLI/opencode-setup-classify.test.cjs
  .skilled/hooks/session-handover/tests/skilled-loop-wrapper-model-effort.test.cjs
  .skilled/hooks/shared/tests/session-readers/opencode.test.mjs
  .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs )
echo "node files: ${#NODE_FILES[@]}" > "$OUT/summary.txt"
node --test "${NODE_FILES[@]}" > "$OUT/node.txt" 2>&1; echo "node exit $?" >> "$OUT/summary.txt"
grep -E '^ℹ (tests|pass|fail|skipped|cancelled)|^✖' "$OUT/node.txt" >> "$OUT/summary.txt"
.skilled/node_modules/.bin/vitest run .skilled/hooks/cli-dispatch/lib/dispatch-audit.test.mjs > "$OUT/dispatch-audit.txt" 2>&1; echo "dispatch-audit exit $?" >> "$OUT/summary.txt"
grep -E 'Test Files|Tests ' "$OUT/dispatch-audit.txt" >> "$OUT/summary.txt"
( cd .skilled/skills/system-deep-loop/runtime && npx vitest run --no-coverage tests/unit/opencode-dual-dispatch.vitest.ts tests/unit/fanout-run.vitest.ts tests/unit/executor-branch-contract.vitest.ts tests/executor-audit-cli-branch-receipts.test.ts tests/stress/cli-adapter/cli-opencode.vitest.ts tests/unit/cli-matrix.vitest.ts tests/unit/executor-config.vitest.ts tests/unit/runtime-capabilities.vitest.ts tests/unit/runtime-capabilities-matrix-conformance.vitest.ts tests/unit/fanout-effect-dispatch.vitest.ts tests/unit/dispatch-iteration.vitest.ts tests/unit/check-contract-drift.vitest.ts tests/unit/compile-command-contracts.vitest.ts ) > "$OUT/deeploop.txt" 2>&1; echo "deeploop-subset exit $?" >> "$OUT/summary.txt"
grep -E 'Test Files|Tests ' "$OUT/deeploop.txt" >> "$OUT/summary.txt"
node --test .vibe/plugins/repo-guards/tests/*.test.mjs > "$OUT/vibe.txt" 2>&1; echo "vibe exit $?" >> "$OUT/summary.txt"
grep -E '^ℹ (tests|pass|fail|skipped)' "$OUT/vibe.txt" >> "$OUT/summary.txt"
cat "$OUT/summary.txt"
