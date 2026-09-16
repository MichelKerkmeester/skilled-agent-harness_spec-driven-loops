# Edits for unit t015

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
if [[ "${#STAGED_AGENTS[@]}" -gt 0 ]]; then
  if ! command -v node >/dev/null 2>&1 || [[ ! -f "$MIRROR_CHECKER" ]]; then
~~~~

NEW:

~~~~text
if [[ "${#STAGED_AGENTS[@]}" -gt 0 ]]; then
  if [[ ! -f "$MIRROR_CHECKER" ]] && _in_toolchain_repo; then
    echo "BLOCKED [gate:agent-mirror-sync]: checker is missing: $MIRROR_CHECKER" >&2
    exit 1
  elif ! command -v node >/dev/null 2>&1 || [[ ! -f "$MIRROR_CHECKER" ]]; then
~~~~

## Edit 2

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
    # The hook is installed globally; a checkout without the toolchain has nothing to check.
    [[ -f "$MIRROR_SCRIPT" ]] || continue
~~~~

NEW:

~~~~text
    # The hook is installed globally; a checkout without the toolchain has nothing to check.
    # Inside one that ships it, a missing script is a broken install, never a pass.
    if [[ ! -f "$MIRROR_SCRIPT" ]]; then
      _in_toolchain_repo || continue
      echo "" >&2
      echo "BLOCKED [gate:mirror-parity]: script is missing: $MIRROR_SCRIPT" >&2
      MIRROR_FAIL=1
      continue
    fi
~~~~

## Edit 3

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
    echo "Fix: regenerate the mirror the message names, git add its output, and re-commit." >&2
    exit 1
~~~~

NEW:

~~~~text
    echo "Fix: regenerate the mirror the message names, git add its output, and re-commit." >&2
    echo "Bypass: SPECKIT_SKIP_MIRROR_PARITY=1 git commit ..." >&2
    exit 1
~~~~

## Edit 4

File: `.opencode/scripts/git-hooks/tests/pre-commit.test.sh`

OLD:

~~~~text
echo ""
echo "pre-commit gates: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
~~~~

NEW:

~~~~text
# ── 25. a missing agent mirror checker blocks where the toolchain ships ──
setup_gate_fixture toolchain
stage_new ".opencode/agents/probe.md" "agent"
run_hook; RC=$?
check "a missing agent mirror checker blocks" 1 "$RC" "agent-mirror-sync]: checker is missing"

# ── 26. a missing mirror parity script blocks where the toolchain ships ──
setup_gate_fixture toolchain
stage_new "notes.md" "note"
SPECKIT_SKIP_MIRROR_PARITY=0 run_hook; RC=$?
check "a missing mirror parity script blocks" 1 "$RC" "mirror-parity]: script is missing"

echo ""
echo "pre-commit gates: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
~~~~
