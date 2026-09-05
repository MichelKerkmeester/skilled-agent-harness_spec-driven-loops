#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: SYSTEM SPEC KIT DOCTOR
# ───────────────────────────────────────────────────────────────
# Read-only health check for the system-spec-kit runtime package
# installation. Catches the install-time silent-skip-deps failure
# mode where the compiled engine exists but its native and runtime
# imports fail at first real use.
#
# Usage: bash .opencode/skills/system-spec-kit/runtime/cli/doctor.sh [--strict]
#
# Exit Codes:
#   0  - Health checks passed (or advisory mode complete)
#   1  - Invalid arguments
#   20 - runtime dist missing
#   26 - Runtime Node imports missing (zod)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
RUNTIME_DIR="$SKILL_DIR/runtime"

STRICT_MODE=false
while [[ $# -gt 0 ]]; do
    case "$1" in
        --strict) STRICT_MODE=true; shift ;;
        -h|--help) echo "Usage: $0 [--strict]"; exit 0 ;;
        *) echo "Unknown arg: $1" >&2; exit 1 ;;
    esac
done

log_pass() { printf '  PASS: %s\n' "$1"; }
log_warn() { printf '  WARN: %s\n' "$1"; }

echo "=== system-spec-kit Doctor ==="
echo "Runtime package: $RUNTIME_DIR"
echo ""

# Verify the runtime dist exists.
if [[ ! -d "$RUNTIME_DIR/dist" ]]; then
    log_warn "Runtime dist missing at $RUNTIME_DIR/dist — run \`npm run build\` in $RUNTIME_DIR, or \`bash $SCRIPT_DIR/deploy-mcp.sh\` to rebuild every daemon-backed dist."
    exit 20
fi
log_pass "Runtime dist present"

# Resolve Node interpreter — uses workspace-managed Node (npm in PATH).
NODE_BIN="$(command -v node || true)"
if [[ -z "$NODE_BIN" ]]; then
    log_warn "node not on PATH"
    exit 26
fi
log_pass "Node interpreter: $NODE_BIN"

# Critical imports the runtime package resolves at first use.
DEP_CHECK_MODULES="zod"
DEP_CHECK_MISSING=()
for mod in $DEP_CHECK_MODULES; do
    ( cd "$RUNTIME_DIR" && "$NODE_BIN" -e "require('$mod')" 2>/dev/null ) || DEP_CHECK_MISSING+=("$mod")
done

if [[ ${#DEP_CHECK_MISSING[@]} -eq 0 ]]; then
    log_pass "Runtime imports OK (zod)"
else
    log_warn "Runtime imports FAILED — missing modules: ${DEP_CHECK_MISSING[*]}"
    echo "  Fix via: ( cd $SKILL_DIR && npm install )"
    # A health check that reports a broken install and exits 0 is a check the
    # caller cannot act on, so missing imports fail regardless of --strict.
    exit 26
fi

echo ""
echo "Doctor done."
