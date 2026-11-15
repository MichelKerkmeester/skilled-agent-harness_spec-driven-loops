#!/usr/bin/env bash
# Runs the council-removal gates and records exit status plus one detail line each.
# usage: gates.sh <worktree> <outdir> <light|heavy|all>
set -uo pipefail
W="$1"; OUT="$2"; GROUP="${3:-all}"
mkdir -p "$OUT"
RES="$OUT/results-$GROUP.tsv"
: > "$RES"
S=.skilled/skills/system-deep-loop
R=$S/runtime
A=.skilled/skills/system-skill-advisor/runtime
K=.skilled/skills/system-spec-kit/runtime/cli
D=.skilled/skills/sk-doc
Q="convene an ai council to compare three migration plans"
QR="run a deep research loop on vector index tuning"
QV="deep review this branch for release readiness"

strip() { sed -E $'s/\x1b\\[[0-9;]*[A-Za-z]//g'; }

# gate <name> <detail-filter> <command...>   (command runs from the worktree root)
gate() {
  local name="$1" filter="$2"; shift 2
  local log="$OUT/$name.log" start end rc detail
  start=$(date +%s)
  ( cd "$W" && bash -c "$*" ) > "$log" 2>&1
  rc=$?
  end=$(date +%s)
  detail=$(strip < "$log" | grep -E "$filter" | tail -n 3 | tr '\n' ' ' | tr '|' '/' | sed -E 's/ +/ /g' | cut -c1-260)
  [ -z "$detail" ] && detail=$(strip < "$log" | grep -v '^[[:space:]]*$' | tail -n 1 | tr '|' '/' | cut -c1-200)
  printf '%s\t%s\t%s\t%ss\n' "$name" "$rc" "$detail" "$((end - start))" >> "$RES"
  echo "[$name] exit=$rc ${detail}"
}

V='Test Files|Tests '

light() {
  gate runtime-typecheck 'error TS' "cd $R && npm run typecheck"
  gate contract-drift 'CONTRACT DRIFT' "node $R/scripts/check-contract-drift.cjs"
  gate doc-drift '"errors"|"ok"' "node $R/scripts/check-documentation-drift.cjs"
  gate pivot-tests "$V" "cd $R && node_modules/.bin/vitest run --no-coverage tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts"
  gate convergence-council-probe 'INPUT_VALIDATION|loopType|rror' "node $R/scripts/convergence.cjs --spec-folder specs/system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation --session-id probe --loop-type council"
  gate behavior-bench-test '^# (pass|fail)' "node --test $S/shared/behavior-benchmark/tests/behavior-bench-run.test.cjs"
  gate advisor-typecheck 'error TS' "cd $A && npm run typecheck"
  gate advisor-py-compile 'rror' "python3 -m py_compile $A/scripts/skill_advisor.py"
  gate advisor-drift-and-parity "$V" "cd $A && files='tests/routing-registry-drift-guard.vitest.ts tests/routing-parity-deep-skills.vitest.ts'; [ -f tests/routing-parity-deep-council.vitest.ts ] && files=\"\$files tests/routing-parity-deep-council.vitest.ts\"; npx vitest run \$files"
  gate advisor-golden-prompts "$V" "cd $A && npx vitest run tests/routing-golden-prompts.vitest.ts"
  gate advisor-parity-ratchets "$V" "cd $A && npx vitest run tests/parity/scorer-eval-baseline-ratchet.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts tests/parity/holdout-independent.vitest.ts"
  gate corpus-pin 'corpus|DRIFT' "cd $A && python3 $OUT/../corpus_pin.py"
  gate corpus-score 'accuracy|f1|joint|PASS|FAIL|historical' "cd $A && python3 scripts/routing-accuracy/score-routing-corpus.py --dataset \"\$PWD/scripts/routing-accuracy/labeled-prompts.jsonl\" --min-advisor-accuracy 0.5333 --min-gate3-f1 0.9843 --min-joint-tt 101 --max-joint-ft 3 --max-joint-ff 1 --require-historical-clean"
  gate compiled-route-guard 'OK|FAIL|stale|drift' "node .skilled/bin/compiled-route-guard.cjs"
  gate compiled-route-admission-hub 'admi|PASS|FAIL|ok' "node .skilled/bin/compiled-route-admission.cjs --hub system-deep-loop"
  gate parent-skill-check-deep-loop 'Parent skill:|declares|OK: parent-skill-check|FAIL' "node .skilled/commands/doctor/scripts/parent-skill-check.cjs $S"
  gate parent-skill-check-all-hubs 'OK: parent-skill-check|FAIL' "rc=0; for r in .skilled/skills/*/mode-registry.json; do node .skilled/commands/doctor/scripts/parent-skill-check.cjs \"\$(dirname \"\$r\")\" || rc=1; done; exit \$rc"
  gate routing-shape-ratchet '^# (pass|fail)' "node --test $D/sk-create-skill/scripts/tests/routing-shape-known-debt-ratchet.test.cjs"
  gate skill-root-metadata 'OK|FAIL|rror' "node $D/sk-create-skill/scripts/ci-skill-root-metadata.cjs"
  gate leaf-manifest-freshness 'OK|FAIL|stale|rror' "node $D/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs"
  gate skill-derived-freshness 'OK|FAIL|stale|rror' "node $D/sk-create-skill/scripts/ci-skill-derived-freshness.cjs"
  gate skill-graph-compiler-validate 'valid|rror|FAIL' "python3 $A/scripts/skill_graph_compiler.py --validate-only"
  gate router-intent-signals 'OK|drift|rror' "node $D/sk-create-skill/scripts/generate-router-intent-signals.cjs --check"
  gate hub-vocabulary-source 'OK|FAIL|rror' "node $D/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs"
  gate skill-graph-freshness 'fresh|stale|OK|FAIL' "node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict"
  gate agent-body-parity 'drift|sync|OK|FAIL' "node .skilled/bin/check-agent-mirror-sync.cjs --all"
  gate agent-roster 'drift|sync|OK|FAIL' "node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs"
  gate codex-agents 'drift|sync|OK' "node $K/codex/sync-agents.cjs --check"
  gate pi-agents 'drift|sync|OK' "node $K/pi/sync-agents-pi.cjs --check"
  gate dsh-agents 'drift|sync|OK' "node $K/dsh/sync-agents-dsh.cjs --check"
  gate command-catalog 'drift|sync|OK|FAIL' "node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs"
  gate command-tree-parity 'identical|differ|OK|FAIL' "bash $K/validate-command-tree-parity.sh"
  gate codex-prompts 'drift|sync|OK' "node $K/codex/sync-prompts.cjs --check"
  gate pi-prompts 'drift|sync|OK' "node $K/pi/sync-prompts-pi.cjs --check"
  gate dsh-prompts 'drift|sync|OK' "node $K/dsh/sync-prompts-dsh.cjs --check"
  gate dsh-skills 'drift|sync|OK' "node $K/dsh/sync-skills-dsh.cjs --check"
  gate runtime-mirrors 'drift|sync|OK' "node $K/runtime-mirrors/sync-runtime-mirrors.cjs --check"
  gate plugin-tests '^# (pass|fail)' "node --test '.opencode/plugins/tests/*.test.cjs'"
  gate gate3-menu-parity '^# (pass|fail)' "node --test .skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs"
  gate hook-vitest "$V" ".skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts"
  gate trigger-index-check 'drift|fresh|OK|match' "node $K/retrieval/generate-trigger-index.mjs --check"
  gate prompt-card-sync 'clear|drift|OK|FAIL' "bash $A/scripts/check-prompt-quality-card-sync.sh ."
  gate cite-drift-gate 'drift|OK|clean|FAIL' "node $D/shared/scripts/cite-drift-gate.mjs"
  gate package-skill-strict 'FAILS' "rc=0; for m in .skilled/skills/*/SKILL.md .skilled/skills/*/*/SKILL.md; do [ -f \"\$m\" ] || continue; s=\$(dirname \"\$m\"); python3 $D/sk-create-skill/scripts/package_skill.py \"\$s\" --check --strict >/dev/null 2>&1 || { echo \"FAILS \$s\"; rc=1; }; done; exit \$rc"
  gate broken-tracked-symlinks 'BROKEN' "rc=0; git ls-files -s | awk '\$1==\"120000\"{print \$4}' | while read -r l; do [ -e \"\$l\" ] || echo \"BROKEN \$l\"; done | tee /dev/stderr | grep -q BROKEN && rc=1; exit \$rc"
  gate replay-council-stage1 '"mode"|"skill"' "python3 $A/scripts/skill_advisor.py \"$Q\" --threshold 0.5"
  gate replay-council-stage2 'packetId|mode|null' "node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt \"$Q\""
  gate replay-research-stage1 '"mode"' "python3 $A/scripts/skill_advisor.py \"$QR\" --threshold 0.5"
  gate replay-research-stage2 'packetId' "node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt \"$QR\""
  gate replay-review-stage1 '"mode"' "python3 $A/scripts/skill_advisor.py \"$QV\" --threshold 0.5"
  gate replay-review-stage2 'packetId' "node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt \"$QV\""
  gate advisor-recommend-council '"command"' "node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{\"prompt\":\"$Q\"}' --format json"
}

heavy() {
  gate runtime-vitest "$V" "cd $R && node_modules/.bin/vitest run --no-coverage"
  gate advisor-vitest "$V" "cd $A && npm test"
  gate speckit-cli-vitest "$V" "cd $K && npx vitest run --config ../../vitest.config.ts --project cli"
  gate sk-doc-script-tests '^FAIL|^PASS' "bash $D/scripts/tests/run-script-tests.sh"
}

case "$GROUP" in
  light) light ;;
  heavy) heavy ;;
  all) light; heavy ;;
esac
echo "DONE $GROUP"
