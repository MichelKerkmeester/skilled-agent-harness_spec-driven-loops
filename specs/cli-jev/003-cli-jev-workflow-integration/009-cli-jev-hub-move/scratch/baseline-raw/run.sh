#!/bin/zsh
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
B=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/13974574-59f7-48b5-b4cd-aa93ca9ca737/scratchpad/w3/009/base
run() { n=$1; shift; "$@" > $B/$n.out 2>&1; echo $? > $B/$n.exit; }
run guard node .skilled/bin/compiled-route-guard.cjs
run sync-check node .skilled/bin/compiled-route-sync.cjs --check
run status node .skilled/bin/compiled-route-status.cjs --all
run admission node .skilled/bin/compiled-route-admission.cjs --all
run psc-classifier node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-classifier
run psc-jev node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-jev
run psc-ceo node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/cli-external-orchestration
run manifest-test node --test .skilled/bin/tests/compiled-route-manifest.test.cjs
(cd .skilled && run foundation npx vitest run --config vitest.config.bin.ts bin/compiled-routing-foundation.vitest.ts)
(cd .skilled && run dispatch-audit npx vitest run hooks/dispatch/lib/dispatch-audit.test.mjs hooks/dispatch/lib/dispatch-rule-checks.test.mjs)
echo done > $B/DONE
