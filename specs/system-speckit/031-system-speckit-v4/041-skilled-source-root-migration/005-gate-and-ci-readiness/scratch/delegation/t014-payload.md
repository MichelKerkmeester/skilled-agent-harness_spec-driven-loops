# Edits for unit t014

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"

# shared hook kill-switch
~~~~

NEW:

~~~~text
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"

# The hook is installed globally, so a gate script can be missing for two reasons: this
# repository does not ship the toolchain, which leaves the gate nothing to check, or it
# does and the install is broken. The spec-kit sentinel tells the two apart, under
# either source root.
_in_toolchain_repo() {
  [[ -n "$REPO_ROOT" ]] || return 1
  [[ -f "$REPO_ROOT/.opencode/skills/system-spec-kit/SKILL.md" \
     || -f "$REPO_ROOT/.skilled/skills/system-spec-kit/SKILL.md" ]]
}

# shared hook kill-switch
~~~~

## Edit 2

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
    hook_enabled git-commit-hooks || exit 0
  fi
fi
~~~~

NEW:

~~~~text
    hook_enabled git-commit-hooks || exit 0
  fi
elif _in_toolchain_repo; then
  echo "WARNING [gate:hook-flags]: $REPO_ROOT/.opencode/hooks/shared/hook-flags.sh is missing or unreadable; commit gates remain enabled." >&2
fi
~~~~

## Edit 3

File: `.opencode/scripts/git-hooks/pre-commit`

OLD:

~~~~text
# nothing to check. A missing checker is out of scope there; inside a checkout that DOES
# ship the skill it still means a broken install and still blocks.
if [[ ! -x "$COMMENT_CHECKER" && -d "${REPO_ROOT}/.opencode/skills/sk-code" ]]; then
  echo "BLOCKED [gate:comment-hygiene]: checker is missing or not executable." >&2
  exit 1
fi
~~~~

NEW:

~~~~text
# nothing to check. A missing checker is out of scope there; inside a checkout that
# ships the toolchain it still means a broken install and still blocks, unless the gate
# is bypassed, because a bypassed gate has nothing left to run.
if [[ "${SPECKIT_SKIP_COMMENT_HYGIENE:-0}" != "1" && ! -x "$COMMENT_CHECKER" ]] && _in_toolchain_repo; then
  echo "BLOCKED [gate:comment-hygiene]: checker is missing or not executable: $COMMENT_CHECKER" >&2
  echo "Bypass: SPECKIT_SKIP_COMMENT_HYGIENE=1 git commit ..." >&2
  exit 1
fi
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
# ── 23. a missing kill switch warns where the toolchain ships, and gates stay on ──
setup_gate_fixture toolchain
stage_new "notes.md" "note"
run_hook; RC=$?
check "a missing kill switch warns and leaves gates on" 0 "$RC" "hook-flags.sh is missing"

# ── 24. a missing comment checker blocks where the toolchain ships ──
setup_gate_fixture toolchain
stage_new "notes.md" "note"
SPECKIT_SKIP_COMMENT_HYGIENE=0 run_hook; RC=$?
check "a missing comment checker blocks" 1 "$RC" "checker is missing or not executable: "

echo ""
echo "pre-commit gates: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
~~~~
