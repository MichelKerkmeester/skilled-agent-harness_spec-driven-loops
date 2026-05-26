#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# route-validate.sh
# ─────────────────────────────────────────────────────────────────
# CI assertion script for .opencode/commands/doctor/_routes.yaml.
# Validates the canonical route manifest against the on-disk YAML
# assets, the router's frontmatter allowed-tools union, and
# internal consistency rules.
#
# Exit codes:
#   0  — manifest valid; all assertions pass
#   1  — assertion failure (single or multiple)
#   2  — manifest missing or unparseable
#   3  — missing dependency (python3 with PyYAML)
#
# Usage:
#   bash .opencode/commands/doctor/scripts/route-validate.sh
#   bash .opencode/commands/doctor/scripts/route-validate.sh --self-test
#
# Dependencies:
#   - python3 with PyYAML (universally available on macOS / Linux)
#
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCTOR_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
COMMANDS_DIR="$(cd "$DOCTOR_DIR/.." && pwd)"
ROUTES_FILE="${ROUTES_FILE:-$DOCTOR_DIR/_routes.yaml}"
ROUTER_FILE="${ROUTER_FILE:-$DOCTOR_DIR/speckit.md}"
ASSETS_DIR="${ASSETS_DIR:-$DOCTOR_DIR/assets}"

# Dependency check
if ! python3 -c 'import yaml' 2>/dev/null; then
  echo "ERROR: python3 with PyYAML is required. Install via: pip3 install pyyaml" >&2
  exit 3
fi

# ─────────────────────────────────────────────────────────────────
# SELF-TEST MODE
# ─────────────────────────────────────────────────────────────────
if [ "${1:-}" = "--self-test" ]; then
  echo "INFO: Running self-tests on fixture manifests…"
  TMPDIR_FIX="$(mktemp -d)"
  trap 'rm -rf "$TMPDIR_FIX"' EXIT

  # Fixture 1: missing required key
  cat > "$TMPDIR_FIX/missing-key.yaml" <<'EOF'
schema_version: 1
routes:
  - target: memory
    yaml: doctor_memory.yaml
    # missing: setup_vars, allowed_flags, mutating, gate3_location, mcp_tools, trigger_phrases
EOF

  # Fixture 2: missing YAML asset
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

  # Fixture 3: duplicate target
  cat > "$TMPDIR_FIX/duplicate-target.yaml" <<'EOF'
schema_version: 1
routes:
  - target: memory
    yaml: doctor_memory.yaml
    setup_vars: [execution_mode]
    allowed_flags: ["--dry-run"]
    mutating: mutates
    gate3_location: "n/a"
    mcp_tools: []
    trigger_phrases: ["one"]
  - target: memory
    yaml: doctor_memory.yaml
    setup_vars: [execution_mode]
    allowed_flags: ["--dry-run"]
    mutating: mutates
    gate3_location: "n/a"
    mcp_tools: []
    trigger_phrases: ["two"]
EOF

  for fixture in missing-key missing-asset duplicate-target; do
    echo "INFO: Self-test: $fixture (should fail)…"
    if ROUTES_FILE="$TMPDIR_FIX/$fixture.yaml" bash "$0" >/dev/null 2>&1; then
      echo "SELF-TEST FAIL: $fixture should have caused non-zero exit" >&2
      exit 1
    else
      echo "PASS: Self-test: $fixture correctly rejected"
    fi
  done

  echo "INFO: All self-tests passed."
  exit 0
fi

# ─────────────────────────────────────────────────────────────────
# MAIN VALIDATION (delegated to python3 + PyYAML)
# ─────────────────────────────────────────────────────────────────
exec python3 "$SCRIPT_DIR/route-validate.py" \
  --routes "$ROUTES_FILE" \
  --router "$ROUTER_FILE" \
  --assets-dir "$ASSETS_DIR"
