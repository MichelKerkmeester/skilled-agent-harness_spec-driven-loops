# Edits for unit luna-fix2-tests

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/tests/check-gate-inputs.test.sh`

OLD:

~~~~text
echo 'echo "see .opencode/README.md"' >> "$TMP/repo/.opencode/scripts/git-hooks/post-merge"
run_check; RC=$?
expect "a root mention with no input fails parser-miss" 1 "$RC" "FAIL parser-miss: .opencode/scripts/git-hooks/post-merge"
~~~~

NEW:

~~~~text
echo 'source .opencode/lib/extra.sh' >> "$TMP/repo/.opencode/scripts/git-hooks/post-merge"
run_check; RC=$?
expect "a root mention with no input fails parser-miss" 1 "$RC" "FAIL parser-miss: .opencode/scripts/git-hooks/post-merge:2"
~~~~

## Edit 2

File: `.github/scripts/tests/check-gate-inputs.test.sh`

OLD:

~~~~text
expect "a path inside echo text is not a workflow input" 0 "$RC" "RESULT: PASSED"

echo ""
~~~~

NEW:

~~~~text
expect "a path inside echo text is not a workflow input" 0 "$RC" "RESULT: PASSED"

# ── 19. an array entry whose twin sits only in its trailing comment fails filter-twins ──
setup_fixture
cat > "$TMP/repo/.opencode/scripts/git-hooks/pre-commit" <<'HOOK'
#!/usr/bin/env bash
TOOL="$REPO_ROOT/.opencode/bin/tool.sh"
PATHS=(
  '.opencode/skills/*/SKILL.md'  # twin '.skilled/skills/*/SKILL.md'
)
git diff --cached --name-only -- "${PATHS[@]}"
HOOK
run_check; RC=$?
expect "an array entry with its twin only in a trailing comment fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/*/SKILL.md has no twin"

# ── 20. a pathspec whose twin sits in the next command of a continued line fails filter-twins ──
setup_fixture
cat > "$TMP/repo/.opencode/scripts/git-hooks/pre-commit" <<'HOOK'
#!/usr/bin/env bash
TOOL="$REPO_ROOT/.opencode/bin/tool.sh"
git diff --cached --quiet -- '.opencode/skills/*/SKILL.md' \
  && git diff --quiet -- '.skilled/skills/*/SKILL.md'
HOOK
run_check; RC=$?
expect "a pathspec with its twin in the next command of a continued line fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:3 pathspec .opencode/skills/*/SKILL.md has no twin"

# ── 21. a one-root entry in an inline array fails filter-twins ──
setup_fixture
cat > "$TMP/repo/.opencode/scripts/git-hooks/pre-commit" <<'HOOK'
#!/usr/bin/env bash
TOOL="$REPO_ROOT/.opencode/bin/tool.sh"
PATHS=( ".opencode/skills/*/SKILL.md" )
git diff --cached --name-only -- "${PATHS[@]}"
HOOK
run_check; RC=$?
expect "a one-root entry in an inline array fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:3 pathspec .opencode/skills/*/SKILL.md has no twin"

# ── 22. a plain dependabot directory whose twin sits only in another update fails filter-twins ──
setup_fixture
cat >> "$TMP/repo/.github/dependabot.yml" <<'DEPENDABOT'
  - package-ecosystem: pip
    directories:
      - /.opencode/**
DEPENDABOT
run_check; RC=$?
expect "a plain dependabot directory with its twin only in another update fails filter-twins" 1 "$RC" "FAIL filter-twins: .github/dependabot.yml:9 directory /.opencode/** has no twin"

# ── 23. a command after an echo in the same step is still a workflow input ──
setup_fixture
echo '      - run: echo "checking" && node .opencode/bin/gone.cjs' >> "$TMP/repo/.github/workflows/demo.yml"
run_check; RC=$?
expect "a command after an echo in the same step is still read" 1 "$RC" "FAIL workflow-inputs: .github/workflows/demo.yml:12 .opencode/bin/gone.cjs resolves nowhere"

# ── 24. echo text in a quoted run scalar is a message, not a workflow input ──
setup_fixture
echo '      - run: "echo See .opencode/docs/not-a-gate.md"' >> "$TMP/repo/.github/workflows/demo.yml"
run_check; RC=$?
expect "echo text in a quoted run scalar is not a workflow input" 0 "$RC" "RESULT: PASSED"

# ── 25. an array declared with local keeps its entries in one group ──
setup_fixture
cat > "$TMP/repo/.opencode/scripts/git-hooks/pre-commit" <<'HOOK'
#!/usr/bin/env bash
TOOL="$REPO_ROOT/.opencode/bin/tool.sh"
demo() {
  local -a PATHS=(
    '.opencode/skills/*/SKILL.md'
    '.skilled/skills/*/SKILL.md'
  )
  git diff --cached --name-only -- "${PATHS[@]}"
}
HOOK
run_check; RC=$?
expect "an array declared with local keeps its twins together" 0 "$RC" "RESULT: PASSED"

# ── 26. a root path in a shape no rule reads fails parser-miss beside real inputs ──
setup_fixture
echo 'cp .opencode/bin/tool.sh "$TMPDIR/tool.sh"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "an unread root path beside real inputs fails parser-miss" 1 "$RC" "FAIL parser-miss: .opencode/scripts/git-hooks/pre-commit:4"

# ── 27. a double-quoted pathspec in a git command without -- still needs its twin ──
setup_fixture
echo 'git add ".opencode/skills/demo/SKILL.md"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "a double-quoted pathspec without -- fails filter-twins" 1 "$RC" "FAIL filter-twins: .opencode/scripts/git-hooks/pre-commit:4 pathspec .opencode/skills/demo/SKILL.md has no twin"

echo ""
~~~~
