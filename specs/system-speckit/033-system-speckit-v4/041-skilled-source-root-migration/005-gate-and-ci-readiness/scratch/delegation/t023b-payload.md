# Edits for unit t023b

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/tests/pre-commit.test.sh`

OLD:

~~~~text
echo ""
echo "pre-commit gates: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
~~~~

NEW:

~~~~text
# ══ legacy hygiene helper ═══════════════════════════════════════════════════
# The compatibility helper applies the same rules to its two gates. It has no bypass
# flags, so a case that exercises its agent gate plants a comment checker that passes.
LEGACY="$REPO_ROOT/.opencode/hooks/git/pre-commit"
run_legacy() { ( cd "$TMP" && bash "$LEGACY" >"$TMP/out.log" 2>&1 ); }
plant_comment_checker() {
  mkdir -p "$TMP/.opencode/skills/sk-code/sk-code-quality/scripts"
  printf '#!/usr/bin/env bash\nexit 0\n' > "$TMP/.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh"
  chmod +x "$TMP/.opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh"
}

# ── 36. a staged .skilled agent reaches the helper's mirror checker ──
setup_gate_fixture
plant_comment_checker
mkdir -p "$TMP/.opencode/skills/system-deep-loop/deep-improvement/scripts"
cat > "$TMP/.opencode/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs" <<'CHECKER'
require('fs').appendFileSync('checker-calls.log', process.argv.slice(2).join('\n') + '\n');
CHECKER
stage_new ".skilled/agents/probe.md" "agent"
run_legacy; RC=$?
check "the helper passes a .skilled agent" 0 "$RC"
if grep -qxF '.skilled/agents/probe.md' "$TMP/checker-calls.log" 2>/dev/null; then
  echo "PASS  the helper handed the .skilled agent to its checker"; PASS=$((PASS + 1))
else
  echo "FAIL  the helper's checker never saw .skilled/agents/probe.md"; FAIL=$((FAIL + 1))
fi

# ── 37. the helper blocks on a missing comment checker where the toolchain ships ──
setup_gate_fixture toolchain
stage_new "notes.md" "note"
run_legacy; RC=$?
check "the helper blocks on a missing comment checker" 1 "$RC" "comment hygiene checker is missing"

# ── 38. the helper blocks on a missing agent checker where the toolchain ships ──
setup_gate_fixture toolchain
plant_comment_checker
stage_new ".opencode/agents/probe.md" "agent"
run_legacy; RC=$?
check "the helper blocks on a missing agent checker" 1 "$RC" "agent mirror-sync checker is missing"

# ── 39. the helper never blocks a repository that does not ship the toolchain ──
setup_gate_fixture
stage_new ".opencode/agents/probe.md" "agent"
run_legacy; RC=$?
check "the helper leaves a repository without the toolchain committable" 0 "$RC"

echo ""
echo "pre-commit gates: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
~~~~
