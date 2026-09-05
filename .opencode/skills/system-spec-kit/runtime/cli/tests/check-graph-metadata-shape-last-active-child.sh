#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# TEST: check-graph-metadata-shape — last_active_child_id fallback
# ───────────────────────────────────────────────────────────────
# Verifies that the GRAPH_METADATA_SHAPE rule accepts a full packet_id
# in derived.last_active_child_id (e.g. track/parent/004-code-graph)
# and only warns when neither the full path nor the bare basename
# resolves to a real child directory.
#
# COMPATIBILITY: bash 3.2+ (macOS default)

set -euo pipefail
set +u  # rule scripts may reference unset globals

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RULES_DIR="$SCRIPT_DIR/../rules"
LIB_DIR="$SCRIPT_DIR/../lib"
RULE_SCRIPT="$RULES_DIR/check-graph-metadata-shape.sh"

# Source shared helpers (provides is_phase_parent)
source "$LIB_DIR/shell-common.sh"

PASS=0
FAIL=0
TMP_DIRS=()

pass() { PASS=$((PASS + 1)); echo "  PASS: $1"; }
fail() { FAIL=$((FAIL + 1)); echo "  FAIL: $1" >&2; }

cleanup_all() {
    local i=0
    while [[ $i -lt ${#TMP_DIRS[@]} ]]; do
        [[ -d "${TMP_DIRS[$i]}" ]] && rm -rf "${TMP_DIRS[$i]}"
        i=$((i + 1))
    done
}
trap cleanup_all EXIT

make_temp_root() {
    local tmp
    tmp=$(mktemp -d "${TMPDIR:-/tmp}/test-gm-shape-XXXXXX")
    TMP_DIRS+=("$tmp")
    echo "$tmp"
}

# Build a minimal valid graph-metadata.json for a phase parent,
# with a configurable last_active_child_id.
write_parent_graph_metadata() {
    local folder="$1"
    local last_active_child_id="$2"
    cat > "$folder/graph-metadata.json" <<EOF
{
  "schema_version": 1,
  "packet": { "id": "test/026-parent", "level": 1, "track": "test" },
  "derived": {
    "last_known_status": "in-progress",
    "last_active_child_id": "$last_active_child_id",
    "last_active_at": "2026-01-01T00:00:00.000Z"
  }
}
EOF
}

run_rule() {
    local folder="$1"
    # Reset all globals the rule reads/writes
    RULE_NAME="" RULE_STATUS="pass" RULE_MESSAGE="" RULE_DETAILS=() RULE_REMEDIATION=""
    source "$RULE_SCRIPT"
    run_check "$folder" "1"
}

# ───────────────────────────────────────────────────────────────
# TEST 1: full packet_id with real bare-basename child → no warning
# ───────────────────────────────────────────────────────────────
echo ""
echo "Running: GRAPH_METADATA_SHAPE — full packet_id with existing child"
{
    root=$(make_temp_root)
    parent="$root/026-parent"
    child="$parent/004-code-graph"
    mkdir -p "$child"
    # Minimal content to pass is_phase_parent
    echo '# Child' > "$child/spec.md"
    # Use a full packet_id pointing to this child
    write_parent_graph_metadata "$parent" "system-spec-kit/026-parent/004-code-graph"
    run_rule "$parent"
    if [[ "$RULE_STATUS" == "pass" ]]; then
        pass "Full packet_id whose basename resolves → status=pass (no spurious warn)"
    else
        fail "Full packet_id whose basename resolves → expected pass, got $RULE_STATUS: $RULE_MESSAGE"
    fi
}

# ───────────────────────────────────────────────────────────────
# TEST 2: stale pointer where NEITHER full path NOR basename exists → warn
# ───────────────────────────────────────────────────────────────
echo ""
echo "Running: GRAPH_METADATA_SHAPE — genuinely stale last_active_child_id"
{
    root=$(make_temp_root)
    parent="$root/026-parent"
    # Create a real child so is_phase_parent returns true
    real_child="$parent/001-real-child"
    mkdir -p "$real_child"
    echo '# Child' > "$real_child/spec.md"
    # last_active_child_id points to a child that does not exist
    write_parent_graph_metadata "$parent" "system-spec-kit/026-parent/999-gone"
    run_rule "$parent"
    if [[ "$RULE_STATUS" == "warn" ]]; then
        pass "Stale pointer (neither full path nor basename exists) → status=warn"
    else
        fail "Stale pointer → expected warn, got $RULE_STATUS: $RULE_MESSAGE"
    fi
}

# ───────────────────────────────────────────────────────────────
# SUMMARY
# ───────────────────────────────────────────────────────────────
echo ""
echo "Results: $PASS passed, $FAIL failed"
if [[ $FAIL -gt 0 ]]; then
    exit 1
fi
exit 0
