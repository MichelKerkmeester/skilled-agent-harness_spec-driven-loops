#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: DOCTOR ROUTE VALIDATE
# ───────────────────────────────────────────────────────────────
# CI assertion script for .skilled/commands/doctor/_routes.yaml.
# Validates the canonical route manifest against the on-disk YAML
# assets, the router's frontmatter allowed-tools union, and
# internal consistency rules.
#
# Usage:
#   bash .skilled/commands/doctor/scripts/route-validate.sh
#   bash .skilled/commands/doctor/scripts/route-validate.sh --self-test
#
# Environment overrides (tests point these at fixtures):
#   ROUTES_FILE, ROUTER_FILE, ASSETS_DIR, PRESENTATION_FILE, REPO_ROOT
#
# Exit codes:
#   0  - manifest valid; all assertions pass
#   1  - assertion failure (single or multiple)
#   2  - bad arguments, or manifest missing or unparseable
#   3  - missing dependency (python3 with PyYAML)
#
# Dependencies:
#   - python3 with PyYAML
set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCTOR_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
COMMANDS_DIR="$(cd "$DOCTOR_DIR/.." && pwd)"
ROOT_DIR="${REPO_ROOT:-$(cd "$COMMANDS_DIR/../.." && pwd)}"
ROUTES_FILE="${ROUTES_FILE:-$DOCTOR_DIR/_routes.yaml}"
ROUTER_FILE="${ROUTER_FILE:-$DOCTOR_DIR/speckit.md}"
ASSETS_DIR="${ASSETS_DIR:-$DOCTOR_DIR/assets}"
PRESENTATION_FILE="${PRESENTATION_FILE:-$ASSETS_DIR/doctor-speckit-presentation.txt}"

# ───────────────────────────────────────────────────────────────
# 2. ARGUMENTS
# ───────────────────────────────────────────────────────────────

show_help() {
  sed -n '5,24p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'
}

SELF_TEST=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --self-test) SELF_TEST=true; shift ;;
    --help|-h)   show_help; exit 0 ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      show_help >&2
      exit 2
      ;;
  esac
done

if ! python3 -c 'import yaml' 2>/dev/null; then
  echo "ERROR: python3 with PyYAML is required. Install via: pip3 install pyyaml" >&2
  exit 3
fi

# ───────────────────────────────────────────────────────────────
# 3. SELF-TEST MODE
# ───────────────────────────────────────────────────────────────

# Validate one fixture and require the rule it targets. Single-route fixtures
# also trip J1 (target-set parity against the real router), so a bare non-zero
# exit would hide a broken rule or a crash; the rule id must appear in the
# output and the exit must be the assertion-failure code.
# Args: $1=fixture name $2=expected rule id $3=assets dir (optional)
run_fixture() {
  local fixture="$1" rule="$2" assets="${3:-$ASSETS_DIR}" output rc=0
  echo "INFO: Self-test: $fixture (should fail with $rule)…"
  output="$(ROUTES_FILE="$TMPDIR_FIX/$fixture.yaml" ASSETS_DIR="$assets" bash "$0" 2>&1)" || rc=$?
  if [[ "$rc" -ne 1 ]]; then
    echo "SELF-TEST FAIL: $fixture exited $rc; expected 1 (assertion failure)" >&2
    return 1
  fi
  if ! printf '%s\n' "$output" | grep -q "FAIL: $rule:"; then
    echo "SELF-TEST FAIL: $fixture did not report $rule" >&2
    return 1
  fi
  echo "PASS: Self-test: $fixture rejected by $rule"
}

if [[ "$SELF_TEST" == true ]]; then
  echo "INFO: Running self-tests on fixture manifests…"
  TMPDIR_FIX="$(mktemp -d)"
  trap 'rm -rf "$TMPDIR_FIX"' EXIT

  # Missing required keys (B2)
  cat > "$TMPDIR_FIX/missing-key.yaml" <<'EOF'
schema_version: 1
routes:
  - target: memory
    yaml: doctor-memory.yaml
    # missing: setup_vars, allowed_flags, mutating, gate3_location, mcp_tools, trigger_phrases
EOF

  # Missing YAML asset (D1)
  cat > "$TMPDIR_FIX/missing-asset.yaml" <<'EOF'
schema_version: 1
routes:
  - target: nonexistent
    yaml: doctor_nonexistent.yaml
    setup_vars: [execution_mode]
    allowed_flags: ["--dry-run"]
    mutating: read-only
    gate3_location: "n/a"
    mcp_tools: []
    trigger_phrases: ["nonexistent test"]
EOF

  # Duplicate target (C1)
  cat > "$TMPDIR_FIX/duplicate-target.yaml" <<'EOF'
schema_version: 1
routes:
  - target: memory
    yaml: doctor-memory.yaml
    setup_vars: [execution_mode]
    allowed_flags: ["--dry-run"]
    mutating: mutates
    gate3_location: "n/a"
    mcp_tools: []
    trigger_phrases: ["one"]
  - target: memory
    yaml: doctor-memory.yaml
    setup_vars: [execution_mode]
    allowed_flags: ["--dry-run"]
    mutating: mutates
    gate3_location: "n/a"
    mcp_tools: []
    trigger_phrases: ["two"]
EOF

  # Route to script existence (I1): real yaml asset, bogus script path
  cat > "$TMPDIR_FIX/missing-script.yaml" <<'EOF'
schema_version: 1
routes:
  - target: deep-loop
    yaml: doctor-deep-loop.yaml
    setup_vars: [execution_mode]
    allowed_flags: []
    mutating: read-only
    gate3_location: "n/a"
    mcp_tools: []
    trigger_phrases: ["fixture missing script"]
    script_invocations:
      - 'node .skilled/commands/doctor/scripts/does-not-exist-fixture.cjs'
EOF

  # Target-set parity (J1): target name absent from speckit.md and the presentation
  cat > "$TMPDIR_FIX/target-set-mismatch.yaml" <<'EOF'
schema_version: 1
routes:
  - target: totally-different-target
    yaml: doctor-deep-loop.yaml
    setup_vars: [execution_mode]
    allowed_flags: []
    mutating: read-only
    gate3_location: "n/a"
    mcp_tools: []
    trigger_phrases: ["fixture target mismatch"]
EOF

  # Read-only mutation policy (K1): a read-only route whose own fixture
  # workflow YAML declares a write
  cat > "$TMPDIR_FIX/read-only-with-write.yaml" <<'EOF'
schema_version: 1
routes:
  - target: memory
    yaml: doctor-memory.yaml
    setup_vars: [execution_mode, intent, incremental]
    allowed_flags: ["--incremental=true|false"]
    mutating: read-only
    gate3_location: "n/a (fixture)"
    mcp_tools: []
    trigger_phrases: ["fixture read-only write"]
EOF
  mkdir -p "$TMPDIR_FIX/write-assets"
  cat > "$TMPDIR_FIX/write-assets/doctor-memory.yaml" <<'EOF'
workflow:
  step_1:
    activities:
      - "Write report to the packet folder"
EOF

  # Workflow activity coverage (L1): the route names a real script that its
  # workflow YAML never invokes
  cat > "$TMPDIR_FIX/activity-missing.yaml" <<'EOF'
schema_version: 1
routes:
  - target: deep-loop
    yaml: doctor-deep-loop.yaml
    setup_vars: [execution_mode]
    allowed_flags: []
    mutating: read-only
    gate3_location: "n/a"
    mcp_tools: []
    trigger_phrases: ["fixture activity missing"]
    script_invocations:
      - 'python3 .skilled/commands/doctor/scripts/route-validate.py'
EOF

  run_fixture missing-key B2
  run_fixture missing-asset D1
  run_fixture duplicate-target C1
  run_fixture missing-script I1
  run_fixture target-set-mismatch J1
  run_fixture read-only-with-write K1 "$TMPDIR_FIX/write-assets"
  run_fixture activity-missing L1

  echo "INFO: All self-tests passed."
  exit 0
fi

# ───────────────────────────────────────────────────────────────
# 4. MAIN VALIDATION (delegated to python3 + PyYAML)
# ───────────────────────────────────────────────────────────────

exec python3 "$SCRIPT_DIR/route-validate.py" \
  --routes "$ROUTES_FILE" \
  --router "$ROUTER_FILE" \
  --assets-dir "$ASSETS_DIR" \
  --presentation "$PRESENTATION_FILE" \
  --repo-root "$ROOT_DIR"
