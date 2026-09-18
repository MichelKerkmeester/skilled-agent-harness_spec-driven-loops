#!/usr/bin/env bash
# Fixture test for the independent gate-input check.
#
# Builds a small repository that satisfies every rule, then breaks one rule per case
# and expects the check to exit 1 naming that rule. The same repository with its
# source tree moved under .skilled/ and linked back must still pass, because that is
# the layout the check exists to approve.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
CHECK="${CHECK_GATE_INPUTS:-$SCRIPT_DIR/../check-gate-inputs.sh}"

PASS=0; FAIL=0
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

GATES="scripts/git-hooks/pre-commit scripts/git-hooks/pre-push scripts/git-hooks/prepare-commit-msg
scripts/git-hooks/commit-msg scripts/git-hooks/post-commit scripts/git-hooks/post-merge
scripts/git-hooks/post-rewrite scripts/git-hooks/lib/autostash-orphan-guard.sh
scripts/git-hooks/lib/mass-deletion-guard.sh hooks/git/pre-commit bin/check-git-hooks.sh"

setup_fixture() {
  rm -rf "$TMP/repo"
  mkdir -p "$TMP/repo/.github/workflows" "$TMP/repo/.opencode/bin" "$TMP/repo/.opencode/skills/demo"
  for gate in $GATES; do
    mkdir -p "$TMP/repo/.opencode/$(dirname "$gate")"
    printf '#!/usr/bin/env bash\n' > "$TMP/repo/.opencode/$gate"
  done
  echo "tool" > "$TMP/repo/.opencode/bin/tool.sh"
  echo "skill" > "$TMP/repo/.opencode/skills/demo/SKILL.md"
  cat >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit" <<'HOOK'
TOOL="$REPO_ROOT/.opencode/bin/tool.sh"
git diff --cached --name-only -- '.opencode/skills/*/SKILL.md' '.skilled/skills/*/SKILL.md'
HOOK
  cat > "$TMP/repo/.github/workflows/demo.yml" <<'WORKFLOW'
name: demo
on:
  push:
    paths:
      - '.opencode/skills/**'
      - '.skilled/skills/**'
jobs:
  demo:
    runs-on: ubuntu-latest
    steps:
      - run: bash .opencode/bin/tool.sh
WORKFLOW
  cat > "$TMP/repo/.github/dependabot.yml" <<'DEPENDABOT'
version: 2
updates:
  - package-ecosystem: npm
    directories:
      - "/.opencode/**"
      - "/.skilled/**"
DEPENDABOT
}

run_check() { bash "$CHECK" "$TMP/repo" >"$TMP/out.log" 2>&1; }

expect() { # expect <label> <expected-rc> <actual-rc> <substring the output must carry>
  if [[ "$3" == "$2" ]] && grep -qF -- "$4" "$TMP/out.log"; then
    echo "PASS  $1"; PASS=$((PASS + 1))
  else
    echo "FAIL  $1: expected rc $2 with '$4', got rc $3"
    sed 's/^/        /' "$TMP/out.log" | tail -6
    FAIL=$((FAIL + 1))
  fi
}

# ── 1. a repository that satisfies every rule passes ──
setup_fixture
run_check; RC=$?
expect "a clean repository passes" 0 "$RC" "RESULT: PASSED"

# ── 2. a missing gate file fails gate-files ──
setup_fixture
rm "$TMP/repo/.opencode/scripts/git-hooks/pre-push"
run_check; RC=$?
expect "a missing gate file fails gate-files" 1 "$RC" "FAIL gate-files: .opencode/scripts/git-hooks/pre-push"

# ── 3. a hook input that resolves nowhere fails hook-inputs ──
setup_fixture
echo 'GONE="$REPO_ROOT/.opencode/bin/gone.sh"' >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "an unresolved hook input fails hook-inputs" 1 "$RC" "FAIL hook-inputs: .opencode/scripts/git-hooks/pre-commit:4"

# ── 4. a workflow path that resolves nowhere fails workflow-inputs ──
setup_fixture
echo '      - run: node .opencode/bin/gone.cjs' >> "$TMP/repo/.github/workflows/demo.yml"
run_check; RC=$?
expect "an unresolved workflow input fails workflow-inputs" 1 "$RC" "FAIL workflow-inputs: .github/workflows/demo.yml:12 .opencode/bin/gone.cjs"

# ── 5. a path filter without its twin fails filter-twins ──
setup_fixture
grep -vF "'.skilled/skills/**'" "$TMP/repo/.github/workflows/demo.yml" > "$TMP/demo.yml"
mv "$TMP/demo.yml" "$TMP/repo/.github/workflows/demo.yml"
run_check; RC=$?
expect "a path filter without its twin fails filter-twins" 1 "$RC" "FAIL filter-twins: .github/workflows/demo.yml:5 path filter .opencode/skills/** has no twin"

# ── 6. a regex that admits one root fails filter-twins ──
setup_fixture
echo "git diff --cached --name-only | grep -E '^\.(opencode|claude)/agents/'" >> "$TMP/repo/.opencode/scripts/git-hooks/pre-commit"
run_check; RC=$?
expect "a one-root regex fails filter-twins" 1 "$RC" "regex (opencode|claude) matches one source root"

# ── 7. a file that names a root but yields no input fails parser-miss ──
setup_fixture
echo 'source .opencode/lib/extra.sh' >> "$TMP/repo/.opencode/scripts/git-hooks/post-merge"
run_check; RC=$?
expect "a root mention with no input fails parser-miss" 1 "$RC" "FAIL parser-miss: .opencode/scripts/git-hooks/post-merge:2"

# ── 8. the whole tree moved under .skilled/ and linked back still passes ──
setup_fixture
mv "$TMP/repo/.opencode" "$TMP/repo/.skilled"
ln -s .skilled "$TMP/repo/.opencode"
run_check; RC=$?
expect "a tree moved under .skilled with a link back passes" 0 "$RC" "RESULT: PASSED"

# ── 9. a one-root filter listed at the key's own indent fails filter-twins ──
setup_fixture
cat > "$TMP/repo/.github/workflows/demo.yml" <<'WORKFLOW'
name: demo
on:
  push:
    paths:
    - '.opencode/skills/**'
jobs:
  demo:
    runs-on: ubuntu-latest
    steps:
      - run: bash .opencode/bin/tool.sh
WORKFLOW
run_check; RC=$?
expect "a one-root filter at the key's indent fails filter-twins" 1 "$RC" "FAIL filter-twins: .github/workflows/demo.yml:5 path filter .opencode/skills/** has no twin"

# ── 10. a one-root filter written inline fails filter-twins ──
setup_fixture
cat > "$TMP/repo/.github/workflows/demo.yml" <<'WORKFLOW'
name: demo
on:
  push:
    paths: ['.opencode/skills/**']
jobs:
  demo:
    runs-on: ubuntu-latest
    steps:
      - run: bash .opencode/bin/tool.sh
WORKFLOW
run_check; RC=$?
expect "an inline one-root filter fails filter-twins" 1 "$RC" "FAIL filter-twins: .github/workflows/demo.yml:4 path filter .opencode/skills/** has no twin"

# ── 11. an inline filter that names both roots passes ──
setup_fixture
cat > "$TMP/repo/.github/workflows/demo.yml" <<'WORKFLOW'
name: demo
on:
  push:
    paths: ['.opencode/skills/**', '.skilled/skills/**']
jobs:
  demo:
    runs-on: ubuntu-latest
    steps:
      - run: bash .opencode/bin/tool.sh
WORKFLOW
run_check; RC=$?
expect "an inline filter with both roots passes" 0 "$RC" "RESULT: PASSED"

# ── 12. a path filter in a shape the parser cannot read fails parser-miss ──
setup_fixture
cat > "$TMP/repo/.github/workflows/demo.yml" <<'WORKFLOW'
name: demo
on:
  push:
    paths: [
      '.opencode/skills/**' ]
jobs:
  demo:
    runs-on: ubuntu-latest
    steps:
      - run: bash .opencode/bin/tool.sh
WORKFLOW
run_check; RC=$?
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

# ── 43. a variable path under .skilled that resolves nowhere fails hook-inputs ──
setup_fixture
echo 'CHECKER="$REPO_ROOT/.skilled/bin/missing.sh"' >> "$TMP/repo/.opencode/hooks/git/pre-commit"
run_check; RC=$?
expect "a variable path under .skilled that resolves nowhere fails hook-inputs" 1 "$RC" 'FAIL hook-inputs: .opencode/hooks/git/pre-commit:2 $REPO_ROOT/.skilled/bin/missing.sh resolves nowhere'

# ── 44. a literal .skilled assignment that resolves nowhere fails hook-inputs ──
setup_fixture
echo 'CHECKER=".skilled/bin/gone.sh"' >> "$TMP/repo/.opencode/hooks/git/pre-commit"
run_check; RC=$?
expect "a literal .skilled assignment that resolves nowhere fails hook-inputs" 1 "$RC" 'FAIL hook-inputs: .opencode/hooks/git/pre-commit:2 $REPO_ROOT/.skilled/bin/gone.sh resolves nowhere'

# ── 45. a quoted .skilled command path that resolves nowhere fails hook-inputs ──
setup_fixture
echo 'bash ".skilled/bin/gone.sh"' >> "$TMP/repo/.opencode/hooks/git/pre-commit"
run_check; RC=$?
expect "a quoted .skilled command path that resolves nowhere fails hook-inputs" 1 "$RC" 'FAIL hook-inputs: .opencode/hooks/git/pre-commit:2 $REPO_ROOT/.skilled/bin/gone.sh resolves nowhere'

# ── 46. a SOURCE_ROOT path resolves under the selected root, and a missing one fails ──
setup_fixture
printf '%s\n' 'TOOL="$SOURCE_ROOT/bin/tool.sh"' 'GONE="$SOURCE_ROOT/bin/gone.sh"' >> "$TMP/repo/.opencode/hooks/git/pre-commit"
run_check; RC=$?
expect "a missing SOURCE_ROOT path fails hook-inputs" 1 "$RC" 'FAIL hook-inputs: .opencode/hooks/git/pre-commit:3 $SOURCE_ROOT/bin/gone.sh resolves nowhere'

# ── 47. the selection prefers .skilled by its sentinel and ignores a placeholder ──
setup_fixture
mv "$TMP/repo/.opencode" "$TMP/repo/.skilled"
mkdir -p "$TMP/repo/.skilled/skills/system-spec-kit"
echo "sentinel" > "$TMP/repo/.skilled/skills/system-spec-kit/SKILL.md"
sed -i.bak 's#\.opencode/bin/tool#.skilled/bin/tool#' "$TMP/repo/.skilled/scripts/git-hooks/pre-commit" "$TMP/repo/.github/workflows/demo.yml"
rm -f "$TMP/repo/.skilled/scripts/git-hooks/pre-commit.bak" "$TMP/repo/.github/workflows/demo.yml.bak"
echo 'TOOL="$SOURCE_ROOT/bin/tool.sh"' >> "$TMP/repo/.skilled/hooks/git/pre-commit"
run_check; RC=$?
expect "a .skilled-only tree resolves SOURCE_ROOT paths under .skilled" 0 "$RC" "RESULT: PASSED"
setup_fixture
mkdir -p "$TMP/repo/.skilled/bin" "$TMP/repo/.opencode/skills/system-spec-kit"
echo "sentinel" > "$TMP/repo/.opencode/skills/system-spec-kit/SKILL.md"
echo 'TOOL="$SOURCE_ROOT/bin/tool.sh"' >> "$TMP/repo/.opencode/hooks/git/pre-commit"
run_check; RC=$?
expect "a placeholder .skilled directory does not win the selection" 0 "$RC" "RESULT: PASSED"

echo ""
echo "check-gate-inputs: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
