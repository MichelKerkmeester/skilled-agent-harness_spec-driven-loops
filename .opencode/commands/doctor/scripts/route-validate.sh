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
ROOT_DIR="$(cd "$COMMANDS_DIR/../.." && pwd)"
ROUTES_FILE="${ROUTES_FILE:-$DOCTOR_DIR/_routes.yaml}"
ROUTER_FILE="${ROUTER_FILE:-$DOCTOR_DIR/speckit.md}"
ASSETS_DIR="${ASSETS_DIR:-$DOCTOR_DIR/assets}"
PRESENTATION_FILE="${PRESENTATION_FILE:-$ASSETS_DIR/doctor_speckit_presentation.txt}"

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

  # Fixture 4: route→script existence (assertion I) — real yaml asset, bogus script path
  cat > "$TMPDIR_FIX/missing-script.yaml" <<'EOF'
schema_version: 1
routes:
  - target: embeddings
    yaml: doctor_embeddings.yaml
    setup_vars: [execution_mode]
    allowed_flags: []
    mutating: read-only
    gate3_location: "n/a"
    mcp_tools: []
    trigger_phrases: ["fixture missing script"]
    script_invocations:
      - 'node .opencode/commands/doctor/scripts/does-not-exist-fixture.cjs'
EOF

  # Fixture 5: target-set parity (assertion J) — target name absent from speckit.md/presentation
  cat > "$TMPDIR_FIX/target-set-mismatch.yaml" <<'EOF'
schema_version: 1
routes:
  - target: totally-different-target
    yaml: doctor_embeddings.yaml
    setup_vars: [execution_mode]
    allowed_flags: []
    mutating: read-only
    gate3_location: "n/a"
    mcp_tools: []
    trigger_phrases: ["fixture target mismatch"]
EOF

  # Fixture 6: read-only mutation-policy (assertion K) — read-only route whose YAML writes
  cat > "$TMPDIR_FIX/read-only-with-write.yaml" <<'EOF'
schema_version: 1
routes:
  - target: memory
    yaml: doctor_memory.yaml
    setup_vars: [execution_mode, intent, incremental]
    allowed_flags: ["--incremental=true|false"]
    mutating: read-only
    gate3_location: "n/a (fixture)"
    mcp_tools: []
    trigger_phrases: ["fixture read-only write"]
EOF

  # NOTE: fixtures 4-6 are single-route manifests, so each also trips assertion J
  # (target-set parity against the real 10-route speckit.md/presentation) in
  # addition to the assertion it targets — that is expected; self-test only
  # requires a non-zero exit, matching the isolation level of fixtures 1-3.
  for fixture in missing-key missing-asset duplicate-target missing-script target-set-mismatch read-only-with-write; do
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
  --assets-dir "$ASSETS_DIR" \
  --presentation "$PRESENTATION_FILE" \
  --repo-root "$ROOT_DIR"
