#!/usr/bin/env bash
cd "/Users/michelkerkmeester/worktrees/public/315-frontend-reference-restructure"
S=specs/sk-code/018-frontend-upstream-proposals/010-reference-readability-research/scratch; K=.skilled/skills/sk-code; D=.skilled/skills/sk-doc; C=.skilled/skills/sk-doc/sk-create-skill
echo "## run-script-tests"; bash $D/scripts/tests/run-script-tests.sh 2>&1 | grep -E '^(PASS|FAIL)' ; echo "exit=${PIPESTATUS[0]}"
echo "## markdown links"; node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs 2>&1 | tail -2
echo "## package strict"; for d in $K $K/sk-code-ci $K/sk-code-frontend $K/sk-code-quality $K/sk-code-review $K/sk-code-skilled $C .skilled/skills/mcp-code-mode; do echo "$d: $(python3 $D/scripts/package_skill.py $d --check --strict 2>&1 | tail -1)"; done
echo "## drift guards"; bash $K/sk-code-skilled/scripts/run-all-drift-guards.sh >/dev/null 2>&1; echo "exit=$?"
echo "## compiled-route"; node --test .skilled/bin/tests/compiled-route-*.test.cjs 2>&1 | grep -E '^ℹ (tests|pass|fail)'
echo "## checklist map"; node --test $K/sk-code-skilled/scripts/tests/quality-checklist-map.test.cjs 2>&1 | grep -E '^ℹ (pass|fail)'
echo "## playbooks"; for p in $K/manual-testing-playbook $K/sk-code-review/manual-testing-playbook $K/sk-code-quality/manual-testing-playbook $K/sk-code-frontend/manual-testing-playbook; do node $D/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package $p --repo-root . 2>&1 | grep -E '^(PASS|FAIL)'; done
echo "## frontend rule ids"; rg -o --no-filename '^### [A-Z]{1,4}[0-9]+\.' $K/sk-code-frontend/references | wc -l | tr -d ' '
echo "## fleet render"; python3 -I $S/render-gate.py --fleet | tail -2
echo "## anchors"; python3 -I $S/check-anchors.py . | tail -1
