#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: OPENCODE HOOK INSTALLER
# ───────────────────────────────────────────────────────────────
# Install repo hooks into .git/hooks/.
#
# .opencode/scripts/install-git-hooks.sh is the primary installer for this
# repo's .git/hooks/pre-commit; that hook chains into this folder's
# pre-commit as its comment-hygiene sub-gate. Run this script directly only
# to install/test the hygiene gate standalone, without the other gates.
#
# Usage: .opencode/hooks/git/install-hooks.sh
set -euo pipefail
# The hooks this installs sit beside it, under whichever name the source root carries.
HOOKS_SRC="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$HOOKS_SRC/../../.." && pwd)"
HOOKS_DEST="$REPO_ROOT/.git/hooks"
ln -sf "$HOOKS_SRC/pre-commit" "$HOOKS_DEST/pre-commit"
echo "Installed: pre-commit → .git/hooks/pre-commit"
