#!/usr/bin/env bash
# Baseline or final gate run. usage: run-baseline.sh <outdir>
set -u
ROOT=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
cd "$ROOT" || exit 90
O="$1"; mkdir -p "$O"
run() { local name="$1"; shift; perl -e 'alarm shift; exec @ARGV' 900 "$@" > "$O/$name.txt" 2>&1; echo "$name rc=$?" | tee -a "$O/rc.txt"; }
: > "$O/rc.txt"
H=.skilled/skills/sk-communication/benchmark/reply-harness
run node-test-harness node --test $H/
run node-check-harness bash -c "for f in $H/*.mjs; do node --check \$f || exit 1; done"
run catalog-package python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package sk-communication
run playbook-package node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package sk-communication
run skill-package python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/sk-communication --strict
run root-metadata node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
run leaf-manifest-freshness node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs
run hermes-check node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
run trigger-index-check node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check
run readme-manifest python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py
run readme-verdict-parity python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py
run skill-graph-validate python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only
run drift-guards bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh
