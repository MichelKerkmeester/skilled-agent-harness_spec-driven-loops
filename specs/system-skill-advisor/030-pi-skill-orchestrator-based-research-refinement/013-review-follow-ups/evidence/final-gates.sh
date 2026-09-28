#!/usr/bin/env bash
# Reruns the checks recorded in baselines.txt from the final state, so each result can be read against its baseline.
# Run from the repository root. Prints to stdout.
set -u

echo "# final gates, $(date -u +%Y-%m-%dT%H:%M:%SZ), HEAD $(git rev-parse --short=10 HEAD)"

for f in \
  .skilled/skills/system-spec-kit/manual-testing-playbook/ux-hooks/cli-hook-transport-down-fail-open.md \
  .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md \
  .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/daemon-absent-fallback.md; do
  echo "## validate_document.py $f"
  python3 .skilled/skills/sk-doc/scripts/validate_document.py "$f" 2>&1 | tail -3
  echo "exit=${PIPESTATUS[0]}"
done

echo "## route guard"
node .skilled/bin/compiled-route-guard.cjs 2>&1 | tail -1
echo "exit=${PIPESTATUS[0]}"

echo "## hermes"
node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check 2>&1 | tail -1
echo "exit=${PIPESTATUS[0]}"

echo "## frozen README manifest"
python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py 2>&1 | grep -E '^(MANIFEST|SUMMARY)'
echo "exit=${PIPESTATUS[0]}"

echo "## parent graph status"
grep -m1 '"status"' specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/graph-metadata.json

echo "## sandbox folders in /tmp"
find /tmp/ -maxdepth 1 \( -name 'cli-playbook.*' -o -name 'cp003.*' -o -name 'cp004.*' \) | wc -l | tr -d ' '
