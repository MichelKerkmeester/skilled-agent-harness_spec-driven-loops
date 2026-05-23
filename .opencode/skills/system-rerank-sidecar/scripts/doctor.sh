#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: SYSTEM RERANK SIDECAR DOCTOR
# ───────────────────────────────────────────────────────────────
# Read-only health check for the system-rerank-sidecar Python
# venv installation. Catches the install-time silent-skip-deps
# failure mode where uvicorn launches but model imports fail at
# first real rerank request.
#
# Usage: bash .opencode/skills/system-rerank-sidecar/scripts/doctor.sh [--strict]
#
# Exit Codes:
#   0  - Health checks passed (or advisory mode complete)
#   1  - Invalid arguments
#   20 - venv missing
#   26 - Runtime Python imports missing (torch, sentence_transformers, fastapi)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILL_DIR="$(dirname "$SCRIPT_DIR")"
VENV_DIR="$SKILL_DIR/.venv"
VENV_PY="$VENV_DIR/bin/python"

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

echo "=== system-rerank-sidecar Doctor ==="
echo "Skill dir: $SKILL_DIR"
echo "Venv:      $VENV_DIR"
echo ""

if [[ ! -x "$VENV_PY" ]]; then
    log_warn "Venv Python missing at $VENV_PY — run \`bash $SCRIPT_DIR/install.sh\`."
    exit 20
fi
log_pass "Venv Python: $VENV_PY"

# Critical runtime imports for the rerank sidecar.
# torch is heaviest (and most likely to fail on dep-resolution issues).
# sentence_transformers depends on torch.
# fastapi + uvicorn are the HTTP server core.
DEP_CHECK_MODULES="torch sentence_transformers fastapi uvicorn"
DEP_CHECK_MISSING=()
for mod in $DEP_CHECK_MODULES; do
    "$VENV_PY" -c "import $mod" 2>/dev/null || DEP_CHECK_MISSING+=("$mod")
done

if [[ ${#DEP_CHECK_MISSING[@]} -eq 0 ]]; then
    log_pass "Runtime imports OK (torch + sentence_transformers + fastapi + uvicorn)"
else
    log_warn "Runtime imports FAILED — missing modules: ${DEP_CHECK_MISSING[*]}"
    echo "  Fix via: $VENV_PY -m pip install -e $SKILL_DIR"
    echo "  Or full re-install: bash $SCRIPT_DIR/install.sh"
    if [[ "$STRICT_MODE" == true ]]; then
        exit 26
    fi
fi

echo ""
echo "Doctor done."
