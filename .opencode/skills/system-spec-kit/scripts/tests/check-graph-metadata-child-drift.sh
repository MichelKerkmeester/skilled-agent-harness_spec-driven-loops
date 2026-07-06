#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# TEST: check-graph-metadata-child-drift — children_ids drift signal
# ───────────────────────────────────────────────────────────────
# Unit-level (run_check of the dedicated GRAPH_METADATA_CHILD_DRIFT rule):
#   * a numbered on-disk child absent from children_ids is reported as drift,
#   * advisory by default (status "pass", never fails --strict) and only a
#     warning when SPECKIT_CHILD_DRIFT_ENFORCE=true,
#   * once the child is added to children_ids the check is clean,
#   * a listed entry with no matching folder is NOT drift (the writer unions
#     and never prunes),
#   * the derived child set follows the writer's loose spec-leaf pattern
#     (bare-number / underscore folders count), not the strict slug rule.
# Integration-level (default validate.sh path, i.e. the Node orchestrator with
# NO SPECKIT_RULES / SPECKIT_VALIDATE_LEGACY):
#   * the distinct rule id fires there (it is not deduped against the native
#     GRAPH_METADATA_PRESENT), pass when advisory and warn when enforced.
#
# COMPATIBILITY: bash 3.2+ (macOS default)

set -euo pipefail
set +u  # rule scripts may reference unset globals

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RULES_DIR="$SCRIPT_DIR/../rules"
RULE_SCRIPT="$RULES_DIR/check-graph-metadata-child-drift.sh"
VALIDATE_SCRIPT="$SCRIPT_DIR/../spec/validate.sh"

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
    tmp=$(mktemp -d "${TMPDIR:-/tmp}/test-gm-child-drift-XXXXXX")
    TMP_DIRS+=("$tmp")
    echo "$tmp"
}

# Minimal graph-metadata.json (valid enough to parse children_ids), with a
# caller-supplied children_ids array.
write_graph_metadata() {
    local folder="$1"
    local children_json="$2"
    mkdir -p "$folder"
    cat > "$folder/graph-metadata.json" <<EOF
{
  "schema_version": 1,
  "packet_id": "test/900-drift-parent",
  "spec_folder": "test/900-drift-parent",
  "parent_id": null,
  "children_ids": $children_json,
  "manual": { "depends_on": [], "supersedes": [], "related_to": [] },
  "derived": { "trigger_phrases": [], "key_files": [], "source_docs": [] }
}
EOF
}

# Run the dedicated rule's run_check against a folder with a given enforcement
# mode. mode: "advisory" (flag unset) or "enforce" (flag=true).
run_rule() {
    local folder="$1"
    local mode="$2"
    RULE_NAME="" RULE_STATUS="pass" RULE_MESSAGE="" RULE_DETAILS=() RULE_REMEDIATION=""
    if [[ "$mode" == "enforce" ]]; then
        export SPECKIT_CHILD_DRIFT_ENFORCE=true
    else
        unset SPECKIT_CHILD_DRIFT_ENFORCE 2>/dev/null || true
    fi
    source "$RULE_SCRIPT"
    run_check "$folder" "1"
    unset SPECKIT_CHILD_DRIFT_ENFORCE 2>/dev/null || true
    set +u  # restore lenient mode for assertions after the rule re-set -u
}

details_str() { printf '%s' "${RULE_DETAILS[*]:-}"; }

# Drive the DEFAULT validate.sh path (Node orchestrator) and report the emitted
# GRAPH_METADATA_CHILD_DRIFT entry as "<path>|<status>", e.g. "orchestrator|pass".
# No SPECKIT_RULES / SPECKIT_VALIDATE_LEGACY: this is the real default path.
orchestrator_rule_status() {
    local folder="$1"
    local mode="$2"
    local json=""
    if [[ "$mode" == "enforce" ]]; then
        json=$(SPECKIT_CHILD_DRIFT_ENFORCE=true bash "$VALIDATE_SCRIPT" "$folder" --strict --no-recursive --json 2>/dev/null || true)
    else
        json=$(env -u SPECKIT_CHILD_DRIFT_ENFORCE bash "$VALIDATE_SCRIPT" "$folder" --strict --no-recursive --json 2>/dev/null || true)
    fi
    printf '%s' "$json" | node -e '
let s = "";
process.stdin.on("data", (d) => (s += d)).on("end", () => {
  let j;
  try { j = JSON.parse(s.trim()); } catch { process.stdout.write("nojson|absent"); return; }
  const isOrchestrator = Array.isArray(j.entries);
  const entries = j.entries || j.results || [];
  const rule = entries.find((r) => r.rule === "GRAPH_METADATA_CHILD_DRIFT");
  process.stdout.write((isOrchestrator ? "orchestrator" : "shell") + "|" + (rule ? rule.status : "absent"));
});'
}

# ───────────────────────────────────────────────────────────────
# TEST 1 (RED, advisory default): numbered child absent from children_ids
# is reported as drift but the status stays "pass" — must not fail --strict.
# ───────────────────────────────────────────────────────────────
echo ""
echo "Running: child-drift — RED advisory (missing child, flag off)"
{
    root=$(make_temp_root)
    parent="$root/900-drift-parent"
    mkdir -p "$parent/001-foo"          # bare child dir, no spec.md
    write_graph_metadata "$parent" '[]' # children_ids empty → 001-foo missing
    run_rule "$parent" advisory
    if [[ "$RULE_STATUS" == "pass" && "$RULE_MESSAGE" == *ADVISORY* && "$(details_str)" == *001-foo* ]]; then
        pass "missing child → advisory (status=pass, ADVISORY message, names 001-foo)"
    else
        fail "advisory expected pass+ADVISORY+001-foo, got status=$RULE_STATUS msg='$RULE_MESSAGE' details='$(details_str)'"
    fi
}

# ───────────────────────────────────────────────────────────────
# TEST 2 (RED, enforce): same drift promoted to a warning under the flag.
# ───────────────────────────────────────────────────────────────
echo ""
echo "Running: child-drift — RED enforce (missing child, flag on)"
{
    root=$(make_temp_root)
    parent="$root/900-drift-parent"
    mkdir -p "$parent/001-foo"
    write_graph_metadata "$parent" '[]'
    run_rule "$parent" enforce
    if [[ "$RULE_STATUS" == "warn" && "$(details_str)" == *001-foo* ]]; then
        pass "missing child + enforce → status=warn naming 001-foo (--strict escalates)"
    else
        fail "enforce expected warn+001-foo, got status=$RULE_STATUS details='$(details_str)'"
    fi
}

# ───────────────────────────────────────────────────────────────
# TEST 3 (GREEN): child added to children_ids → clean, both modes pass.
# ───────────────────────────────────────────────────────────────
echo ""
echo "Running: child-drift — GREEN (child listed, both modes clean)"
{
    root=$(make_temp_root)
    parent="$root/900-drift-parent"
    mkdir -p "$parent/001-foo"
    write_graph_metadata "$parent" '["test/900-drift-parent/001-foo"]'
    run_rule "$parent" advisory
    green_advisory=$([[ "$RULE_STATUS" == "pass" && "$RULE_MESSAGE" != *ADVISORY* ]] && echo ok || echo no)
    run_rule "$parent" enforce
    green_enforce=$([[ "$RULE_STATUS" == "pass" ]] && echo ok || echo no)
    if [[ "$green_advisory" == "ok" && "$green_enforce" == "ok" ]]; then
        pass "listed child → clean pass in advisory and enforce (no drift)"
    else
        fail "GREEN expected clean pass both modes, advisory=$green_advisory enforce=$green_enforce (last status=$RULE_STATUS msg='$RULE_MESSAGE')"
    fi
}

# ───────────────────────────────────────────────────────────────
# TEST 3b (wrong parent): a foreign listed entry with the same child basename
# must not mask a genuinely missing local child under enforce.
# ───────────────────────────────────────────────────────────────
echo ""
echo "Running: child-drift — foreign same-basename entry does not mask drift"
{
    root=$(make_temp_root)
    parent="$root/900-drift-parent"
    mkdir -p "$parent/001-foo"
    write_graph_metadata "$parent" '["test/other-parent/001-foo"]'
    run_rule "$parent" enforce
    if [[ "$RULE_STATUS" == "warn" && "$(details_str)" == *001-foo* ]]; then
        pass "foreign other-parent/001-foo does not satisfy local 001-foo"
    else
        fail "foreign same-basename expected warn+001-foo, got status=$RULE_STATUS details='$(details_str)'"
    fi
}

# ───────────────────────────────────────────────────────────────
# TEST 4 (writer-parity): a bare-number/underscore folder is a writer child.
# The strict slug rule would miss 010_experiment; the drift check must not.
# ───────────────────────────────────────────────────────────────
echo ""
echo "Running: child-drift — writer-parity (underscore folder counts)"
{
    root=$(make_temp_root)
    parent="$root/900-drift-parent"
    mkdir -p "$parent/010_experiment"
    write_graph_metadata "$parent" '[]'
    run_rule "$parent" enforce
    if [[ "$RULE_STATUS" == "warn" && "$(details_str)" == *010_experiment* ]]; then
        pass "underscore folder 010_experiment flagged (writer pattern, not strict slug)"
    else
        fail "writer-parity expected warn+010_experiment, got status=$RULE_STATUS details='$(details_str)'"
    fi
}

# ───────────────────────────────────────────────────────────────
# TEST 5 (union semantics): a listed entry with no matching folder is NOT
# drift — the writer never prunes, so an extra must not fail even under enforce.
# ───────────────────────────────────────────────────────────────
echo ""
echo "Running: child-drift — extra listed entry is not drift"
{
    root=$(make_temp_root)
    parent="$root/900-drift-parent"
    mkdir -p "$parent/001-foo"          # only on-disk child, and it is listed
    write_graph_metadata "$parent" '["test/900-drift-parent/001-foo","test/900-drift-parent/999-gone"]'
    run_rule "$parent" enforce
    if [[ "$RULE_STATUS" == "pass" ]]; then
        pass "extra listed entry 999-gone (not on disk) → still pass under enforce"
    else
        fail "extra-not-drift expected pass, got status=$RULE_STATUS details='$(details_str)'"
    fi
}

# ───────────────────────────────────────────────────────────────
# TEST 6 (no false positive): a leaf with no numbered children stays clean
# even under enforce.
# ───────────────────────────────────────────────────────────────
echo ""
echo "Running: child-drift — leaf (no numbered children) not flagged"
{
    root=$(make_temp_root)
    leaf="$root/900-leaf"
    mkdir -p "$leaf/research"            # non-numbered subdir, never a child
    write_graph_metadata "$leaf" '[]'
    run_rule "$leaf" enforce
    if [[ "$RULE_STATUS" == "pass" ]]; then
        pass "leaf with no numbered children → pass under enforce (no false positive)"
    else
        fail "leaf expected pass, got status=$RULE_STATUS details='$(details_str)'"
    fi
}

# ───────────────────────────────────────────────────────────────
# TEST 6b (fail-closed): when the child-scanner dependency is unavailable, a
# run that cannot determine drift must warn under enforce (not silently pass),
# while advisory stays best-effort clean.
# ───────────────────────────────────────────────────────────────
echo ""
echo "Running: child-drift — fail-closed when scanner unavailable"
{
    root=$(make_temp_root)
    parent="$root/900-drift-parent"
    mkdir -p "$parent/001-foo"
    write_graph_metadata "$parent" '[]'
    export SPECKIT_CHILD_SCANNER="$root/nonexistent-scanner.js"
    run_rule "$parent" enforce
    fc_enforce=$([[ "$RULE_STATUS" == "warn" && "$RULE_MESSAGE" == *"could not run"* ]] && echo ok || echo no)
    run_rule "$parent" advisory
    fc_advisory=$([[ "$RULE_STATUS" == "pass" ]] && echo ok || echo no)
    unset SPECKIT_CHILD_SCANNER
    if [[ "$fc_enforce" == "ok" && "$fc_advisory" == "ok" ]]; then
        pass "scanner unavailable → enforce warns (fail-closed), advisory stays clean"
    else
        fail "fail-closed expected enforce=warn+'could not run' / advisory=pass, got enforce=$fc_enforce advisory=$fc_advisory (last status=$RULE_STATUS msg='$RULE_MESSAGE')"
    fi
}

# ───────────────────────────────────────────────────────────────
# TEST 7 (DEFAULT PATH): the distinct rule id fires in the Node orchestrator
# (no SPECKIT_RULES / SPECKIT_VALIDATE_LEGACY) — advisory pass, enforce warn.
# ───────────────────────────────────────────────────────────────
echo ""
echo "Running: child-drift — DEFAULT orchestrator path fires the rule"
{
    root=$(make_temp_root)
    parent="$root/900-p"
    mkdir -p "$parent/001-foo"
    printf '# Spec\n\n| **Level** | 1 |\n' > "$parent/spec.md"
    write_graph_metadata "$parent" '[]'
    res_off=$(orchestrator_rule_status "$parent" advisory)
    res_on=$(orchestrator_rule_status "$parent" enforce)
    if [[ "$res_off" == "orchestrator|pass" && "$res_on" == "orchestrator|warn" ]]; then
        pass "default path: flag OFF → orchestrator pass (advisory), flag ON → orchestrator warn"
    else
        fail "default-path expected orchestrator|pass / orchestrator|warn, got off=$res_off on=$res_on"
    fi
}

# ───────────────────────────────────────────────────────────────
# TEST 8 (DEFAULT PATH, no false positive): reconciled parent stays pass
# under enforce in the orchestrator path.
# ───────────────────────────────────────────────────────────────
echo ""
echo "Running: child-drift — DEFAULT path no false positive (reconciled)"
{
    root=$(make_temp_root)
    parent="$root/900-p"
    mkdir -p "$parent/001-foo"
    printf '# Spec\n\n| **Level** | 1 |\n' > "$parent/spec.md"
    write_graph_metadata "$parent" '["test/900-p/001-foo"]'
    res_on=$(orchestrator_rule_status "$parent" enforce)
    if [[ "$res_on" == "orchestrator|pass" ]]; then
        pass "reconciled parent → orchestrator pass under enforce (no false positive)"
    else
        fail "default-path reconciled expected orchestrator|pass, got $res_on"
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
