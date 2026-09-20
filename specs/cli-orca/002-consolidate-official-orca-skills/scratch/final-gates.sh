#!/bin/bash
# Final gate suite for the cli-orca extraction. Every gate prints a labelled block
# with its own output and exit status so the result can be read, not assumed.
# GATE_OUT selects the report file, so a baseline capture and a post-remediation
# capture can both be kept instead of one overwriting the other.
set -u
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public || exit 9
OUT="${GATE_OUT:-specs/cli-orca/002-consolidate-official-orca-skills/scratch/gate-results.md}"
: > "$OUT"
run() {
  local label="$1"; shift
  echo "" | tee -a "$OUT"
  echo "### $label" | tee -a "$OUT"
  echo '```text' | tee -a "$OUT"
  "$@" >> "$OUT" 2>&1
  local ec=$?
  echo '```' | tee -a "$OUT"
  echo "exit=$ec  cmd=$*" | tee -a "$OUT"
  return $ec
}

doc_sweep() {
  local bad=0 total=0
  while IFS= read -r f; do
    total=$((total+1))
    if ! python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py "$f" --blocking-only >/tmp/doc-sweep-one.txt 2>&1; then
      bad=$((bad+1))
      echo "BLOCKING: $f"
      tail -3 /tmp/doc-sweep-one.txt
    fi
  done < <(find .skilled/skills/cli-orca -name '*.md' | sort)
  echo "cli-orca docs checked=$total blocking=$bad"
  [ "$bad" -eq 0 ]
}

stale_sweep() {
  local hits
  hits=$(rg -n "mcp-tooling/mcp-orca-cli" .skilled/skills --glob '!**/changelog/**' --glob '!**/benchmark/**' 2>/dev/null | wc -l | tr -d ' ')
  echo "live retired-leaf references outside changelog history and benchmark evidence: $hits"
  rg -n "mcp-tooling/mcp-orca-cli" .skilled/skills --glob '!**/changelog/**' --glob '!**/benchmark/**' 2>/dev/null | head -20
  [ "$hits" -eq 0 ]
}

router_probes() {
  # The routing contract is machine-shaped in exactly one fenced block, so probe that block
  # itself rather than the prose that restates it; a green document check proves nothing here.
  python3 - <<'PROBE_EOF'
import pathlib, sys
p = pathlib.Path('.skilled/skills/cli-orca/SKILL.md'); src = p.read_text().splitlines()
s = next(i for i,l in enumerate(src) if l.strip()=='```python')
e = next(i for i in range(s+1,len(src)) if src[i].strip()=='```')
ns = {'__file__': str(p.resolve())}
exec(compile('\n'.join(src[s+1:e]),'SKILL.md','exec'), ns); r = ns['route']
bad = []
if r("please read the terminal and share skills")["action"]=="load": bad.append("generic terminal routed")
if r("embedded browser snapshot")["action"]=="load": bad.append("generic browser routed")
if r("help me with computer-use")["action"]=="load": bad.append("unplaced official name routed")
if r("Show the OpenOrca model label for the current request.")["action"]!="defer": bad.append("holdout routed")
if r("orca terminal read --json")["load_level"]!="TERMINAL": bad.append("orca terminal lane lost")
if r("managed worktree listing")["load_level"]!="WORKTREE": bad.append("sanctioned compound lost")
for q in ["use the orca cli","orca handoff to another agent",
          "help me with the linear-tickets skill in Orca","the orca-emulator-android skill in Orca"]:
    if r(q)["action"]!="load": bad.append("listed trigger does not route: "+q)
print("router probes:", "PASS" if not bad else "FAIL: "+"; ".join(bad)); sys.exit(1 if bad else 0)
PROBE_EOF
}

{
  echo "# Gate results: cli-orca extraction"
  echo ""
  echo "Captured $(date -u +%Y-%m-%dT%H:%M:%SZ) on branch $(git rev-parse --abbrev-ref HEAD)."
} >> "$OUT"

FAILS=0
run "1. Fleet root metadata (class H/S conformance, regenerates derivable files)" \
  node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix || FAILS=$((FAILS+1))
run "2. cli-orca package validation" \
  python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .skilled/skills/cli-orca --strict || FAILS=$((FAILS+1))
run "3. cli-orca package check" \
  python3 .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py .skilled/skills/cli-orca --check --strict || FAILS=$((FAILS+1))
run "4. cli-orca feature catalog package" \
  python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package cli-orca || FAILS=$((FAILS+1))
run "5. cli-orca manual testing playbook package" \
  node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package cli-orca || FAILS=$((FAILS+1))
run "6. Hub parent check (nine modes)" \
  node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-tooling || FAILS=$((FAILS+1))
run "7. Packet 001 strict validation" \
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-orca/001-mcp-orca-cli --strict || FAILS=$((FAILS+1))
run "8. Packet 002 strict validation" \
  bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-orca/002-consolidate-official-orca-skills --strict || FAILS=$((FAILS+1))
run "9. cli-orca document corpus sweep (blocking issues)" \
  doc_sweep || FAILS=$((FAILS+1))
run "10. Stale reference sweep (live retired-leaf references)" \
  stale_sweep || FAILS=$((FAILS+1))
run "11. Frontmatter version gate (fleet)" \
  bash .skilled/skills/sk-doc/shared/scripts/check-frontmatter-versions.sh || FAILS=$((FAILS+1))
run "12. Advisor positive replay (Orca phrase)" \
  node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "orca worktree handoff to another agent through the Orca CLI" --format json || FAILS=$((FAILS+1))
run "13. Advisor holdout replay (OpenOrca)" \
  node .skilled/bin/skill-advisor.cjs advisor_recommend --prompt "Show the OpenOrca model label for the current request." --format json || FAILS=$((FAILS+1))
run "14. Skill derived metadata freshness (fleet)" \
  node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-derived-freshness.cjs || FAILS=$((FAILS+1))
run "15. sk-doc frozen directory manifest reproduction" \
  python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py || FAILS=$((FAILS+1))
run "16. Compiled route replay against the hub for the former Orca prompt" \
  node .skilled/bin/compiled-route.cjs --hub mcp-tooling --prompt "Use the Orca CLI to inspect the current worktree and terminal" || FAILS=$((FAILS+1))
run "17. cli-orca router probes (routing contract behaviour)" \
  router_probes || FAILS=$((FAILS+1))

echo "" | tee -a "$OUT"
echo "FAILING GATES: $FAILS" | tee -a "$OUT"
exit $FAILS
