#!/usr/bin/env bash
# ╔══════════════════════════════════════════════════════════════════════════╗
# ║ CocoIndex Code MCP Installer                                            ║
# ╚══════════════════════════════════════════════════════════════════════════╝
# Install the spec-kit CocoIndex Code soft-fork into the skill folder venv.
# Source: vendored fork at .opencode/skills/mcp-coco-index/mcp_server/
#         (version 0.2.3+spec-kit-fork.0.2.0 — NOT upstream PyPI cocoindex-code)
# Usage:  bash .opencode/skills/mcp-coco-index/scripts/install.sh
# Verify: ccc --version  → must contain '+spec-kit-fork.'

set -euo pipefail

source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/common.sh"

# ─────────────────────────────────────────────────────────────────────────────
# 1. CONFIGURATION
# ─────────────────────────────────────────────────────────────────────────────

PROJECT_ROOT_INPUT=""
PYTHON_BIN=""

# ─────────────────────────────────────────────────────────────────────────────
# 2. FUNCTIONS
# ─────────────────────────────────────────────────────────────────────────────

show_help() {
    cat <<'EOF'
Usage: bash .opencode/skills/mcp-coco-index/scripts/install.sh [--root <path>]

Options:
  --root <path>  Override the project root to initialize
  -h, --help     Show this help message
EOF
}

create_venv() {
    if [[ -d "$VENV_DIR" ]]; then
        echo "  Venv exists at: $VENV_DIR"
        return 0
    fi

    echo "  Creating Python 3.11 venv..."
    "$PYTHON_BIN" -m venv "$VENV_DIR"
    echo "  Venv created at: $VENV_DIR"
}

install_package() {
    # Default install includes the [local] extra (sentence-transformers + torch) so
    # offline / no-API-key embedding stays the out-of-the-box experience. Set
    # COCOINDEX_SKIP_LOCAL_EMBEDDINGS=1 to install the LiteLLM-only path.
    local target="$SKILL_DIR/mcp_server"
    if [[ "${COCOINDEX_SKIP_LOCAL_EMBEDDINGS:-0}" != "1" ]]; then
        target="$target[local]"
    fi

    echo "  Installing $PACKAGE_NAME (target: $target)..."
    if ! "$VENV_DIR/bin/pip" install --upgrade --quiet --no-build-isolation --editable "$target"; then
        echo ""
        echo "  ╔════════════════════════════════════════════════════════════════════════╗"
        echo "  ║ WARNING: Dependency resolution failed — retrying without deps.        ║"
        echo "  ║ The package will install but tree-sitter, sentence-transformers, etc. ║"
        echo "  ║ may be missing. After this install completes, run doctor.sh to        ║"
        echo "  ║ detect the missing modules. If doctor flags missing deps, fix them    ║"
        echo "  ║ via: $VENV_DIR/bin/pip install -e ${target//$SKILL_DIR/<SKILL_DIR>}    ║"
        echo "  ╚════════════════════════════════════════════════════════════════════════╝"
        echo ""
        "$VENV_DIR/bin/pip" install --upgrade --quiet --no-build-isolation --no-deps --editable "$target"
        INSTALL_FALLBACK_TRIGGERED=1
        # Best-effort recovery: explicitly sync the known runtime-critical deps so a
        # `--no-deps` fallback does not produce a runtime-broken install. If any of
        # these fail, doctor.sh will surface the missing modules later.
        echo "  Best-effort dep recovery: installing tree-sitter + grammars + sentence-transformers..."
        "$VENV_DIR/bin/pip" install --upgrade --quiet \
            "tree-sitter>=0.21" \
            tree-sitter-go tree-sitter-java tree-sitter-javascript \
            tree-sitter-python tree-sitter-rust tree-sitter-typescript \
            2>&1 | tail -3 || echo "  (tree-sitter recovery non-fatal failure — doctor.sh will report)"
    fi

    local version
    version="$("$VENV_DIR/bin/pip" show "$PACKAGE_NAME" 2>/dev/null | grep "^Version:" | cut -d' ' -f2)"
    echo "  Installed: $PACKAGE_NAME $version"
    if [[ "${INSTALL_FALLBACK_TRIGGERED:-0}" == "1" ]]; then
        echo ""
        echo "  ⚠ POST-INSTALL CHECK REQUIRED: --no-deps fallback was triggered."
        echo "  ⚠ Run: bash $(dirname "${BASH_SOURCE[0]}")/doctor.sh --strict"
        echo "  ⚠ If doctor reports missing modules (e.g. tree_sitter, sentence_transformers),"
        echo "  ⚠ re-run install.sh after fixing the underlying network/conflict issue."
    fi
}

verify_binary() {
    if ! "$VENV_DIR/bin/ccc" --help > /dev/null 2>&1; then
        echo "Error: ccc binary not functional after install" >&2
        exit 1
    fi
    echo "  Binary verified: $VENV_DIR/bin/ccc"
}

init_index() {
    local project_root="$1"
    if [[ -d "$project_root/.cocoindex_code" ]]; then
        echo "  Index exists at: $project_root/.cocoindex_code/"
        return 0
    fi

    echo "  Initializing CocoIndex Code project..."
    cd "$project_root"
    "$VENV_DIR/bin/ccc" init
    echo "  Run 'ccc index' to build the semantic index."
}

print_summary() {
    local project_root="$1"
    echo ""
    echo "=== Installation complete ==="
    echo ""
    echo "Binary:  $VENV_DIR/bin/ccc"
    echo "Project: $project_root"
    echo ""
    echo "Next steps:"
    echo "  1. Ensure ready: bash $COMMON_SCRIPT_DIR/ensure_ready.sh --root \"$project_root\""
    echo "  2. Doctor:       bash $COMMON_SCRIPT_DIR/doctor.sh --root \"$project_root\""
    echo "  3. Enable MCP:   Set disabled: false in .mcp.json when needed"
}

# ─────────────────────────────────────────────────────────────────────────────
# 3. MAIN
# ─────────────────────────────────────────────────────────────────────────────

echo "=== CocoIndex Code MCP Install Script ==="
echo ""

while [[ $# -gt 0 ]]; do
    case "$1" in
        --root)
            if [[ $# -lt 2 ]]; then
                log_error "Missing value for --root"
                exit 1
            fi
            PROJECT_ROOT_INPUT="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown argument: $1"
            show_help
            exit 1
            ;;
    esac
done

PROJECT_ROOT="$(resolve_project_root "$PROJECT_ROOT_INPUT")"
PYTHON_BIN="$(require_python_bin)"
echo "Installing CocoIndex Code MCP server..."
echo "  Skill folder:  $SKILL_DIR"
echo "  Project root:  $PROJECT_ROOT"
echo "  Python:       $PYTHON_BIN"
echo ""

create_venv
install_package
verify_binary
init_index "$PROJECT_ROOT"
print_summary "$PROJECT_ROOT"
