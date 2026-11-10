# Edits for unit luna-ci-tests

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/tests/check-gate-inputs.test.sh`

OLD:

~~~~text
expect "an unreadable filter shape fails parser-miss" 1 "$RC" "FAIL parser-miss: .github/workflows/demo.yml:4 path filter shape not recognized"

echo ""
~~~~

NEW:

~~~~text
expect "an unreadable filter shape fails parser-miss" 1 "$RC" "FAIL parser-miss: .github/workflows/demo.yml:4 path filter shape not recognized"

# ── 13. a generated path under a directory that resolves nowhere fails workflow-inputs ──
setup_fixture
echo '      - run: node --import ./.opencode/skills/gone/node_modules/tsx/dist/loader.mjs x.ts' >> "$TMP/repo/.github/workflows/demo.yml"
run_check; RC=$?
expect "a generated path under a missing directory fails workflow-inputs" 1 "$RC" "FAIL workflow-inputs: .github/workflows/demo.yml:12 .opencode/skills/gone/node_modules/tsx/dist/loader.mjs is generated under .opencode/skills/gone"

# ── 14. a variable assigned a literal path that resolves nowhere fails hook-inputs ──
setup_fixture
printf '%s\n' 'CHECKER=".opencode/bin/gone.sh"' 'TOOL="$REPO_ROOT/.opencode/bin/tool.sh"' >> "$TMP/repo/.opencode/hooks/git/pre-commit"
run_check; RC=$?
expect "a literal path assignment that resolves nowhere fails hook-inputs" 1 "$RC" 'FAIL hook-inputs: .opencode/hooks/git/pre-commit:2 $REPO_ROOT/.opencode/bin/gone.sh resolves nowhere'

# ── 15. a pathspec whose twin sits only in a comment or another command fails filter-twins ──
setup_fixture
cat > "$TMP/repo/.opencode/scripts/git-hooks/pre-commit" <<'HOOK'
#!/usr/bin/env bash
# The twin '.skilled/skills/*/SKILL.md' is listed below.
TOOL="$REPO_ROOT/.opencode/bin/tool.sh"
git diff --cached --name-only -- '.opencode/skills/*/SKILL.md'
git ls-files -- '.skilled/skills/*/SKILL.md'
HOOK
run_check; RC=$?
expect "a pathspec with its twin only in a comment or another command fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/*/SKILL.md has no twin"

# ── 16. a path filter whose twin sits only in another event's filter fails filter-twins ──
setup_fixture
cat > "$TMP/repo/.github/workflows/demo.yml" <<'WORKFLOW'
name: demo
on:
  push:
    paths:
      - '.opencode/skills/**'
      - '.skilled/skills/**'
  pull_request:
    paths:
      - '.opencode/skills/**'
jobs:
  demo:
    runs-on: ubuntu-latest
    steps:
      - run: bash .opencode/bin/tool.sh
WORKFLOW
run_check; RC=$?
expect "a path filter with its twin only in another event's filter fails filter-twins" 1 "$RC" "FAIL filter-twins: .github/workflows/demo.yml:9 path filter .opencode/skills/** has no twin"

# ── 17. a dependabot directory whose twin sits only in another update fails filter-twins ──
setup_fixture
cat >> "$TMP/repo/.github/dependabot.yml" <<'DEPENDABOT'
  - package-ecosystem: pip
    directories:
      - "/.opencode/**"
DEPENDABOT
run_check; RC=$?
expect "a dependabot directory with its twin only in another update fails filter-twins" 1 "$RC" "FAIL filter-twins: .github/dependabot.yml:9 directory /.opencode/** has no twin"

# ── 18. a path inside echo text is a message, not a workflow input ──
setup_fixture
echo '      - run: echo "See .opencode/docs/not-a-gate.md"' >> "$TMP/repo/.github/workflows/demo.yml"
run_check; RC=$?
expect "a path inside echo text is not a workflow input" 0 "$RC" "RESULT: PASSED"

echo ""
~~~~
