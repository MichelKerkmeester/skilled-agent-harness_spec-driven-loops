#!/usr/bin/env bash
# Rerun the phase's gates from the final tree and print one labelled result line per gate.
set -u
cd "$(dirname "$0")/../../../../.."
S=.skilled/skills/sk-doc/sk-create-skill/scripts
V=.skilled/skills/sk-doc/shared/scripts/validate_document.py

echo "== compiled-route-guard"; G=$(node .skilled/bin/compiled-route-guard.cjs); echo "exit=$? $(printf "%s" "$G" | tail -1)"
echo "== generate-router-intent-signals --check"; node $S/generate-router-intent-signals.cjs --check | tail -2 | tr '\n' ' '; echo
echo "== ci-hub-vocabulary-source"; node $S/ci-hub-vocabulary-source.cjs | grep -E "^OK +system-deep-loop|checked=|RESULT" | tr '\n' ' '; echo
echo "== ci-router-vocabulary-reach"; node $S/ci-router-vocabulary-reach.cjs | grep -E "checked=|RESULT" | tr '\n' ' '; echo
echo "== sync-skills-hermes --check"; node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check | tail -1
echo "== skill-graph-freshness"; node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs | grep -E "STALE COMPILED|SIGNAL DRIFT"
for s in mcp-tooling sk-design sk-design/sk-design-diagram system-deep-loop sk-prompt cli-orca sk-git system-skill-advisor system-spec-kit; do
  echo "== package_skill --check --strict $s: $(/opt/homebrew/bin/python3 $S/package_skill.py .skilled/skills/$s --check --strict 2>&1 | grep 'Result:' | tail -1)"
done
for h in mcp-tooling sk-design system-deep-loop; do
  echo "== parent-skill-check $h: $(node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/$h 2>&1 | grep -E '^(OK|FAIL)' | tail -1)"
done
for h in mcp-tooling sk-design system-deep-loop; do
  echo "== compiled-route-admission $h: $(node .skilled/bin/compiled-route-admission.cjs --hub $h --json | /opt/homebrew/bin/python3 -c 'import json,sys;d=json.load(sys.stdin);h=d["hubs"][0];print(d["ok"],h["verdict"],h["counts"],"uncovered",h["coverage"]["uncovered"])')"
done
for f in mcp-tooling/changelog/v1.9.3.0.md sk-design/changelog/v2.0.10.0.md sk-design/sk-design-diagram/changelog/v1.2.9.0.md system-deep-loop/changelog/v1.6.20.0.md sk-prompt/changelog/v3.0.11.0.md cli-orca/changelog/v0.1.7.0.md sk-git/changelog/v1.11.6.0.md system-skill-advisor/changelog/v0.17.25.0.md system-spec-kit/changelog/v2.12.25.0.md; do
  echo "== validate_document $f: $(/opt/homebrew/bin/python3 $V .skilled/skills/$f 2>&1 | grep 'Total issues')"
done
