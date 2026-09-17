# Edits for unit luna-fix3-tests

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/tests/check-gate-inputs.test.sh`

OLD:

~~~~text
expect "a double-quoted pathspec without -- fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/demo/SKILL.md has no twin"

echo ""
~~~~

NEW:

~~~~text
expect "a double-quoted pathspec without -- fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/demo/SKILL.md has no twin"

# ── 28. a negated one-root entry in an inline filter fails filter-twins ──
setup_fixture
cat > "$TMP/repo/.github/workflows/demo.yml" <<'WORKFLOW'
name: demo
on:
  push:
    paths: ['.opencode/skills/**', '.skilled/skills/**', '!.opencode/skills/private/**']
jobs:
  demo:
    runs-on: ubuntu-latest
    steps:
      - run: bash .opencode/bin/tool.sh
WORKFLOW
run_check; RC=$?
expect "a negated one-root filter entry fails filter-twins" 1 "$RC" "FAIL filter-twins: .github/workflows/demo.yml:4 path filter !.opencode/skills/private/** has no twin"

# ── 29. a one-root pathspec behind a variable in a git command fails filter-twins ──
setup_fixture
echo 'git diff --cached --name-only -- "$REPO_ROOT/.skilled/skills/demo/SKILL.md"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "a one-root pathspec behind a variable fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .skilled/skills/demo/SKILL.md has no twin"

# ── 30. a command beside an echo on the same line must itself be read ──
setup_fixture
echo 'echo "See .opencode/docs/not-a-gate.md" && source .opencode/lib/extra.sh' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "an unread command beside an echo fails parser-miss" 1 "$RC" "FAIL parser-miss: .opencode/scripts/git-hooks/pre-commit:4"

# ── 31. a trailing comment that holds a regex or a root path is not read ──
setup_fixture
echo "true # the gate matches '^\.(opencode)/agents/' under .opencode/docs" >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "a trailing comment with a regex or root path is not read" 0 "$RC" "RESULT: PASSED"

echo ""
~~~~
