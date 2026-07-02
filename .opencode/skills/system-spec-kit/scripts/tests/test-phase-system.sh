#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Test Phase System
# ───────────────────────────────────────────────────────────────
# Regression tests for create.sh phase-mode defaults and parent append mode.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_SCRIPTS_DIR="${SCRIPT_DIR}/../spec"
SOURCE_LIB_DIR="${SCRIPT_DIR}/../lib"
SOURCE_SCRIPT_TEMPLATES_DIR="${SCRIPT_DIR}/../templates"
SOURCE_TEMPLATES_DIR="${SCRIPT_DIR}/../../templates"

PASS=0
FAIL=0
TOTAL=0
TMP_DIRS=()

pass() {
  PASS=$((PASS + 1))
  TOTAL=$((TOTAL + 1))
  echo "  PASS: $1"
}

fail() {
  FAIL=$((FAIL + 1))
  TOTAL=$((TOTAL + 1))
  echo "  FAIL: $1" >&2
}

cleanup_all() {
  local i=0
  while [[ $i -lt ${#TMP_DIRS[@]} ]]; do
    [[ -d "${TMP_DIRS[$i]}" ]] && rm -rf "${TMP_DIRS[$i]}"
    i=$((i + 1))
  done
}

trap cleanup_all EXIT

make_temp_repo() {
  local temp_repo
  temp_repo=$(mktemp -d "${TMPDIR:-/tmp}/test-phase-system-XXXXXX")
  TMP_DIRS+=("$temp_repo")

  mkdir -p "$temp_repo/.specify"
  mkdir -p "$temp_repo/specs"

  mkdir -p "$temp_repo/.opencode/skills/system-spec-kit/scripts/spec"
  mkdir -p "$temp_repo/.opencode/skills/system-spec-kit/scripts/lib"
  mkdir -p "$temp_repo/.opencode/skills/system-spec-kit/scripts/templates"
  mkdir -p "$temp_repo/.opencode/skills/system-spec-kit/templates"

  cp "$SOURCE_SCRIPTS_DIR/create.sh" "$temp_repo/.opencode/skills/system-spec-kit/scripts/spec/create.sh"
  cp "$SOURCE_LIB_DIR/shell-common.sh" "$temp_repo/.opencode/skills/system-spec-kit/scripts/lib/shell-common.sh"
  cp "$SOURCE_LIB_DIR/git-branch.sh" "$temp_repo/.opencode/skills/system-spec-kit/scripts/lib/git-branch.sh"
  cp "$SOURCE_LIB_DIR/template-utils.sh" "$temp_repo/.opencode/skills/system-spec-kit/scripts/lib/template-utils.sh"
  cp "$SOURCE_SCRIPT_TEMPLATES_DIR/inline-gate-renderer.sh" "$temp_repo/.opencode/skills/system-spec-kit/scripts/templates/inline-gate-renderer.sh"

  cp -R "$SOURCE_TEMPLATES_DIR"/. "$temp_repo/.opencode/skills/system-spec-kit/templates/"

  echo "$temp_repo"
}

# Installs a stub in place of the real (workspace-linked, not copyable into a
# throwaway sandbox) description generator. The stub only records each
# invocation's target path and --level to DESC_STUB_LOG so tests can assert on
# WHICH paths create.sh attempted to write to, independent of the real
# generator's own output correctness.
install_desc_generator_stub() {
  local temp_repo="$1"
  local stub_dir="$temp_repo/.opencode/skills/system-spec-kit/scripts/dist/spec-folder"
  mkdir -p "$stub_dir"
  cat > "$stub_dir/generate-description.js" <<'STUB_EOF'
const fs = require('fs');
const logPath = process.env.DESC_STUB_LOG;
const targetPath = process.argv[2];
const level = (() => {
  const idx = process.argv.indexOf('--level');
  return idx >= 0 ? process.argv[idx + 1] : '';
})();
if (logPath) {
  fs.appendFileSync(logPath, `${targetPath}\t${level}\n`);
}
process.exit(0);
STUB_EOF
}

json_field() {
  local field_name="$1"
  python3 -c "import json, sys; print(json.load(sys.stdin)[\"${field_name}\"])"
}

echo ""
echo "---------------------------------------------------------------"
echo "  test-phase-system.sh"
echo "---------------------------------------------------------------"

if [[ ! -f "$SOURCE_SCRIPTS_DIR/create.sh" ]]; then
  echo "ERROR: create.sh not found at $SOURCE_SCRIPTS_DIR/create.sh" >&2
  exit 1
fi

# ───────────────────────────────────────────────────────────────
# Test 1: --phase defaults to 3 child phases
# ───────────────────────────────────────────────────────────────
echo ""
echo "-- Default phase count --"

repo1=$(make_temp_repo)
create1="$repo1/.opencode/skills/system-spec-kit/scripts/spec/create.sh"

json1=$(cd "$repo1" && bash "$create1" --json --phase --skip-branch --number 1 "Default phase count")
branch1=$(echo "$json1" | json_field "BRANCH_NAME")
phase_count1=$(echo "$json1" | json_field "PHASE_COUNT")

if [[ "$phase_count1" == "3" ]]; then
  pass "create.sh --phase defaults to 3 phases"
else
  fail "Expected PHASE_COUNT=3, got ${phase_count1}"
fi

child_count1=$(find "$repo1/specs/$branch1" -mindepth 1 -maxdepth 1 -type d -name '[0-9][0-9][0-9]-*' | wc -l | tr -d ' ')
if [[ "$child_count1" == "3" ]]; then
  pass "Default phase run created 3 child folders"
else
  fail "Expected 3 child folders, got ${child_count1}"
fi

# ───────────────────────────────────────────────────────────────
# Test 2: --parent appends phases to existing parent folder
# ───────────────────────────────────────────────────────────────
echo ""
echo "-- Parent append mode --"

repo2=$(make_temp_repo)
create2="$repo2/.opencode/skills/system-spec-kit/scripts/spec/create.sh"

base_json=$(cd "$repo2" && bash "$create2" --json --phase --skip-branch --number 2 --phases 1 --phase-names "foundation" "Parent append base")
base_branch=$(echo "$base_json" | json_field "BRANCH_NAME")
parent_rel="specs/$base_branch"

append_json=$(cd "$repo2" && bash "$create2" --json --phase --parent "$parent_rel" --phases 2 --phase-names "implementation,integration" "Parent append run")
append_count=$(echo "$append_json" | json_field "PHASE_COUNT")

if [[ "$append_count" == "2" ]]; then
  pass "Append mode reports 2 newly created phases"
else
  fail "Expected append PHASE_COUNT=2, got ${append_count}"
fi

if [[ -d "$repo2/$parent_rel/002-implementation" ]] && [[ -d "$repo2/$parent_rel/003-integration" ]]; then
  pass "Append mode created sequential child folders under parent"
else
  fail "Expected parent to contain 002-implementation and 003-integration"
fi

if grep -q "001-foundation" "$repo2/$parent_rel/002-implementation/spec.md" \
  && grep -q "003-integration" "$repo2/$parent_rel/002-implementation/spec.md"; then
  pass "Appended phase child headers link predecessor and successor correctly"
else
  fail "Appended phase child headers do not contain expected predecessor/successor links"
fi

# ───────────────────────────────────────────────────────────────
# Test 3: Append mode never regenerates the existing parent's description.json
# ───────────────────────────────────────────────────────────────
# The real description generator is workspace-linked (@spec-kit/mcp-server/api)
# and cannot be copied into this throwaway sandbox, so a recording stub stands
# in for it; the assertion is on WHICH paths create.sh attempted to write to.
echo ""
echo "-- Parent description.json regeneration guard --"

repo3=$(make_temp_repo)
install_desc_generator_stub "$repo3"
create3="$repo3/.opencode/skills/system-spec-kit/scripts/spec/create.sh"
desc_log="$repo3/desc-invocations.log"

base_json=$(cd "$repo3" && DESC_STUB_LOG="$desc_log" bash "$create3" --json --phase --skip-branch --number 3 --phases 1 --phase-names "foundation" "Stability base parent")
base_branch=$(echo "$base_json" | json_field "BRANCH_NAME")
parent_rel="specs/$base_branch"
# Canonicalize: create.sh resolves FEATURE_DIR to a normalized absolute path
# internally, which can differ textually from naive concatenation when TMPDIR
# itself carries a trailing slash (common on macOS). Use logical (non-symlink-
# resolving) pwd to match create.sh's own resolution, since -P would resolve
# macOS's /var -> /private/var symlink and create a new mismatch.
parent_abs="$(cd "$repo3/$parent_rel" && pwd)"

if [[ -f "$desc_log" ]] && grep -qF "$(printf '%s\t%s' "$parent_abs" "phase")" "$desc_log"; then
  pass "New-parent creation still invokes the description generator for the parent"
else
  fail "Expected a phase-level description-generator invocation for $parent_abs on new-parent creation"
fi

: > "$desc_log"

cd "$repo3" && DESC_STUB_LOG="$desc_log" bash "$create3" --json --phase --parent "$parent_rel" \
  --phases 1 --phase-names "extra" "Append should not touch parent description" >/dev/null

if grep -qF "$(printf '%s\t%s' "$parent_abs" "phase")" "$desc_log"; then
  fail "Append mode invoked the description generator against the existing parent's own path"
else
  pass "Append mode never invokes the description generator against the existing parent's path"
fi

if grep -q "	1$" "$desc_log"; then
  pass "Append mode still generates description.json for the newly created child phase"
else
  fail "Expected a level-1 description-generator invocation for the new child phase"
fi

echo ""
echo "---------------------------------------------------------------"
echo "  Results: ${PASS} passed, ${FAIL} failed (of ${TOTAL})" >&2
echo "---------------------------------------------------------------"
echo ""

if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi

exit 0

# Exit codes:
#   0 - Success
#   1 - ERROR: create.sh not found at $SOURCE_SCRIPTS_DIR/create.sh
