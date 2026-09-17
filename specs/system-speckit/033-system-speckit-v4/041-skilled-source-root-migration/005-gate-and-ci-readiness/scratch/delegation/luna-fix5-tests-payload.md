# Edits for unit luna-fix5-tests

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/tests/check-gate-inputs.test.sh`

OLD:

~~~~text
expect "a one-root pathspec inside a command substitution fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .skilled/skills/demo/SKILL.md has no twin"

echo ""
~~~~

NEW:

~~~~text
expect "a one-root pathspec inside a command substitution fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .skilled/skills/demo/SKILL.md has no twin"

# ── 37. an array of variable paths expanded into git needs twins for its entries ──
setup_fixture
printf '%s\n' 'PATHS=( "$REPO_ROOT/.opencode/skills/demo/SKILL.md" )' 'git diff --cached -- "${PATHS[@]}"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "an array expanded into git needs twins for its entries" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/demo/SKILL.md has no twin"

# ── 38. a path that continues into a variable is dynamic, not resolved ──
setup_fixture
printf '%s\n' 'MISSING=bin/missing.js' 'node "$REPO_ROOT/.opencode/skills/demo/$MISSING"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "a path that continues into a variable is dynamic, not resolved" 0 "$RC" "inputs_resolved=2 dynamic_inputs=1"

# ── 39. two one-root regexes joined on one line each fail filter-twins ──
setup_fixture
echo "git diff --cached --name-only | grep -Eq '\\.opencode/agents/' && git diff --cached --name-only | grep -Eq '\\.skilled/agents/'" >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "two one-root regexes joined on one line fail filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 regex \\.opencode/ matches one source root"

# ── 40. an option value that names the other root is not a pathspec twin ──
setup_fixture
echo "git log --format='.skilled/skills/demo/SKILL.md' -- .opencode/skills/demo/SKILL.md" >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "an option value is not a pathspec twin" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/demo/SKILL.md has no twin"

# ── 41. a flow-style dependabot entry is its own group ──
setup_fixture
echo '  - { package-ecosystem: "pip", directories: ["/.opencode/**"] }' >> "$TMP/repo/.github/dependabot.yml"
run_check; RC=$?
expect "a flow-style dependabot entry is its own group" 1 "$RC" "FAIL filter-twins: .github/dependabot.yml:7 directory /.opencode/** has no twin"

# ── 42. a workflow input written with a ? glob resolves through its match ──
setup_fixture
echo '      - run: bash .opencode/bin/tool.s?' >> "$TMP/repo/.github/workflows/demo.yml"
run_check; RC=$?
expect "a ? glob in a workflow input resolves through its match" 0 "$RC" "RESULT: PASSED"

echo ""
~~~~
