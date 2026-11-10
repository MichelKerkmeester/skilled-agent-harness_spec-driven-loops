# Edits for unit check-filter-shapes-tests

Each edit names a file, an OLD block and a NEW block. The block is the text between its two fence lines, without the fence lines themselves.

## Edit 1

File: `.github/scripts/tests/check-gate-inputs.test.sh`

OLD:

~~~~text
echo ""
echo "check-gate-inputs: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
~~~~

NEW:

~~~~text
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

echo ""
echo "check-gate-inputs: $PASS passed, $FAIL failed"
[[ "$FAIL" -eq 0 ]]
~~~~
