#!/bin/bash
# Runs the full phase gate set from the worktree root; prints one line per gate: name|exit|last line
cd /Users/michelkerkmeester/worktrees/public/257-single-vocabulary-source || exit 2
OUT=${1:-/Users/michelkerkmeester/worktrees/public/.scratch-dc90/072-007/after}
mkdir -p "$OUT"
g() { local name="$1"; shift; "$@" >"$OUT/$name.log" 2>&1; local rc=$?; printf '%s|%s|%s\n' "$name" "$rc" "$(grep -v '^\s*$' "$OUT/$name.log" | tail -1 | cut -c1-220)"; }
for h in cli-classifier cli-external-orchestration mcp-tooling sk-code sk-design sk-doc system-deep-loop; do
  g "psc-$h" node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/$h
done
g route-guard node .skilled/bin/compiled-route-guard.cjs --json
g route-sync-check node .skilled/bin/compiled-route-sync.cjs --check
g verify-router-sync node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs
for r in .skilled/skills/*/; do r=$(basename $r)
  g "pkg-$r" /usr/bin/python3 .skilled/skills/sk-doc/scripts/package_skill.py .skilled/skills/$r --check --strict
done
g rule-copies node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js
g router-reach node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs
g hermes node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
g sk-code-setup node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs
g root-metadata node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs
g leaf-manifest node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs
g router-tests node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync-git-timeout.test.cjs .skilled/skills/sk-code/sk-code-skilled/scripts/tests/router-stage-two-quality.test.cjs .skilled/skills/sk-code/sk-code-skilled/scripts/tests/declared-surfaces-parity.test.cjs .skilled/skills/sk-doc/sk-create-skill/scripts/tests/leaf-route-replay.test.cjs .skilled/skills/sk-doc/sk-create-skill/scripts/tests/root-router-contract.test.cjs .skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-leaf-manifest-freshness.test.cjs .skilled/skills/sk-doc/sk-create-skill/scripts/tests/ci-router-vocabulary-reach.test.cjs
g accuracy node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs
g validate bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/072-skill-routing-and-clarity --recursive --strict
g contract-drift node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs
g advisor-routing-suites bash -c 'cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/doctor-routing-slice.vitest.ts tests/parity/local-native-divergence-ratchet.vitest.ts tests/parent-skill-check-fixtures.vitest.ts'
g catalog-packages /usr/bin/python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py
g sk-doc-script-tests bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh
g cite-drift-gate node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-gate.mjs
g skill-graph-freshness node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict
