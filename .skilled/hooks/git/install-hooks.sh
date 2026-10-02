#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: OPENCODE HOOK INSTALLER
# ───────────────────────────────────────────────────────────────
# Install repo hooks into .git/hooks/.
#
# .skilled/scripts/install-git-hooks.sh is the primary installer. Its pre-commit
# carries its own comment-hygiene gate and does not call this folder's
# pre-commit. Run this script directly only to install this folder's standalone
# hygiene helper, without the other gates.
#
# Usage: .opencode/hooks/git/install-hooks.sh
set -euo pipefail
# The hooks this installs sit beside it, under whichever name the source root carries.
HOOKS_SRC="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$HOOKS_SRC/../../.." && pwd)"
HOOKS_DEST="$REPO_ROOT/.git/hooks"
ln -sf "$HOOKS_SRC/pre-commit" "$HOOKS_DEST/pre-commit"
echo "Installed: pre-commit → .git/hooks/pre-commit"
