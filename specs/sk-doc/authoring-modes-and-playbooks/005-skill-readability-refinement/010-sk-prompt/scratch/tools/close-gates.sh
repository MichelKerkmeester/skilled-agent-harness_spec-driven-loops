#!/usr/bin/env bash
# Gates for one skill after all its leaves ran, before the commit. Usage: close-gates.sh <phase-dir> <skill-dir>
# The commit itself stays manual: read the diff first, then changelog, version, Hermes sync, manifests, debt.
T=specs/sk-doc/066-skill-readability-refinement/010-sk-prompt/scratch/tools
P=$1; S=$2; name=$(basename "$S"); rc=0
leaves=$(awk -v p="$P" '$1==p || index($1, p"/")==1 {print $1}' $T/leaves.txt)
for L in $leaves; do
  g=$(python3 -I $T/scope-gate.py "$L/scratch/scope.txt" | tail -1); k=$(python3 -I $T/scope-links.py "$L/scratch/scope.txt" | tail -1)
  last=$(ls "$L"/scratch/review-*.md 2>/dev/null | sort -t- -k2 -n | tail -1); v=$( [ -n "$last" ] && head -1 "$last" || echo 'no review')
  echo "LEAF $L | $g | $k | $v"
  case "$g$k" in *'render_warnings=0 invalid=0'*'broken=0'*) ;; *) rc=1;; esac
  case "$v" in *PASS*) ;; *) grep -q '^- \[P[12]\]' "$L/scratch/findings.md" && rc=1;; esac
done
r=$(python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py "$S" --check --strict 2>&1 | tail -1); echo "PACKAGE $r"; case "$r" in *PASS*) ;; *) rc=1;; esac
for pb in $(find "$S" -maxdepth 3 -type d -name manual-testing-playbook -not -path '*/node_modules/*'); do
  o=$(node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package "$pb" 2>&1); e=$?
  echo "PLAYBOOK $pb exit=$e $(echo "$o" | grep -o 'violations=[0-9]*' | head -1)"; [ $e = 0 ] || rc=1
done
f=$(node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-leaf-manifest-freshness.cjs 2>&1 | tail -1); echo "LEAF-MANIFESTS $f"
t=$(node --test .skilled/bin/tests/compiled-route-*.test.cjs 2>&1 | grep -E '^ℹ fail'); echo "ROUTE-TESTS $t"
[ "$t" = 'ℹ fail 0' ] || echo "  refresh: node .skilled/bin/compiled-route-manifest.cjs refresh --hub <hub> --skill-root .skilled/skills/<hub>, copy to the z_archive activation copy, rerun"
python3 -c "import json,sys;d=json.load(open('.skilled/skills/sk-doc/sk-create-skill/scripts/render-known-debt.json'))['debt'];k=[x for x in d if x=='$name' or x.startswith('$name/')];print('DEBT-ENTRIES', len(k), ' '.join(k))"
git grep -n -E "\.md.{0,60}[Ll]ines? [0-9]+" -- "$S" ':!**/changelog/**' | head -8 | sed 's/^/LINE-CITE /'
fmo=$(python3 -I $T/frontmatter-diff.py "$S"); echo "$fmo" | sed 's/^/  /'; echo "$fmo" | grep -q 'frontmatter_changed=0' || rc=1
cto=$(python3 -I $T/citations.py "$S"); echo "$cto" | tail -5 | sed 's/^/  /'; echo "$cto" | grep -q 'citations_missing=0' || rc=1
for tool in lost-lines intro-diff; do echo "  $tool: $(python3 -I $T/$tool.py "$S" | grep -c -E '^(LOST|==)') to read by hand"; done
echo "GATES rc=$rc"
