#!/bin/zsh
# Final-state gates. Each run writes <name>.out and <name>.exit under logs/final/.
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
ROOT=$PWD
P=specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/scratch/w3-build
F=$ROOT/$P/logs/final
mkdir -p $F
TO() { perl -e 'alarm shift; exec @ARGV' "$@"; }
run() { n=$1; shift; TO 900 "$@" > $F/$n.out 2>&1; echo $? > $F/$n.exit; echo "$n exit $(cat $F/$n.exit)"; }

run status node .skilled/bin/compiled-route-status.cjs --all
run guard node .skilled/bin/compiled-route-guard.cjs
run admission-hub node .skilled/bin/compiled-route-admission.cjs --hub cli-classifier
run admission-all node .skilled/bin/compiled-route-admission.cjs --all
run sync-check node .skilled/bin/compiled-route-sync.cjs --check
run sync-verify node .skilled/bin/compiled-route-sync.cjs --verify
shasum -a 256 .skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-classifier/manifest.json > $F/refresh-sha-before.txt
run refresh node .skilled/bin/compiled-route-manifest.cjs refresh --hub cli-classifier --skill-root .skilled/skills/cli-classifier
shasum -a 256 .skilled/bin/lib/compiled-routing/013-live-activation/activation/cli-classifier/manifest.json > $F/refresh-sha-after.txt
run freshness node .skilled/bin/compiled-route-manifest.cjs freshness --hub cli-classifier --skill-root .skilled/skills/cli-classifier
run manifest-test node --test .skilled/bin/tests/compiled-route-manifest.test.cjs
run rule-checks node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs
(cd .skilled && run foundation npx vitest run --config vitest.config.bin.ts bin/compiled-routing-foundation.vitest.ts)
(cd .skilled && run dispatch-audit npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs)
(cd .skilled/skills/system-deep-loop/runtime && run fanout-merge npx vitest run --no-coverage tests/unit/fanout-merge.vitest.ts)
(cd .skilled/skills/system-skill-advisor/runtime && run advisor-suite npx vitest run)
run psc-classifier node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier
run psc-ceo node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-external-orchestration
run advisor-jev python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "ask jev for a probability that this plan ships on time" --threshold 0.5
run advisor-deem python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "ask deem for a probability that this incident is urgent" --threshold 0.5
run req008 git grep -l '\.skilled/skills/cli-jev/' -- . ':!specs' ':!**/changelog/**' ':!**/benchmark/reports/**'
run ls-files git ls-files .skilled/skills/cli-jev
run find find .skilled/skills/cli-jev
run leaf-check node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/cli-classifier
run graph-validate python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only
run mirrors-check node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
run codex-check node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check
run hermes-check node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check
run readme-manifest python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py
run readme-verdicts python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py
run replay zsh /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/13974574-59f7-48b5-b4cd-aa93ca9ca737/scratchpad/w3/009/replay.sh cli-classifier $ROOT/$P/route-after.txt
run replay-compare python3 $P/runs/compare-replay.py specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move/scratch/route-baseline.txt $P/route-after.txt
run validate-phase bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move --strict
git diff HEAD -M --name-status > $F/diff-name-status.txt
git status --porcelain > $F/git-status.txt
echo FINAL-DONE
