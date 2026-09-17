# Edits for unit luna-fix4-tests

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/tests/check-gate-inputs.test.sh`

OLD:

~~~~text
expect "a trailing comment with a regex or root path is not read" 0 "$RC" "RESULT: PASSED"

echo ""
~~~~

NEW:

~~~~text
expect "a trailing comment with a regex or root path is not read" 0 "$RC" "RESULT: PASSED"

# ── 32. a one-root pathspec for git called by its full path fails filter-twins ──
setup_fixture
echo '/usr/bin/git diff --cached -- ".opencode/skills/missing/SKILL.md"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "a one-root pathspec for git called by its full path fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/missing/SKILL.md has no twin"

# ── 33. the root directory as a pathspec behind a variable fails filter-twins ──
setup_fixture
echo 'git diff --cached -- "$REPO_ROOT/.opencode/"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "the root directory as a one-root pathspec fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/ has no twin .skilled/"

# ── 34. a command after an array's closing paren is read ──
setup_fixture
cat >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit" <<'HOOK'
PATHS=(
  ".opencode/skills/*/SKILL.md"
  ".skilled/skills/*/SKILL.md"
) ; git diff --cached -- ".opencode/skills/missing/SKILL.md"
HOOK
run_check; RC=$?
expect "a command after an array's closing paren is read" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:7 pathspec .opencode/skills/missing/SKILL.md has no twin"

# ── 35. a declared literal path that resolves nowhere fails hook-inputs ──
setup_fixture
echo 'declare -r CHECKER=".opencode/bin/missing.sh"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "a declared literal path that resolves nowhere fails hook-inputs" 1 "$RC" 'FAIL hook-inputs: .opencode/scripts/git-hooks/pre-commit:4 $REPO_ROOT/.opencode/bin/missing.sh resolves nowhere'

# ── 36. a one-root pathspec in a git command inside a substitution fails filter-twins ──
setup_fixture
echo 'STAGED="$(git diff --cached --name-only -- "$REPO_ROOT/.skilled/skills/demo/SKILL.md")"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "a one-root pathspec inside a command substitution fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .skilled/skills/demo/SKILL.md has no twin"

echo ""
~~~~
