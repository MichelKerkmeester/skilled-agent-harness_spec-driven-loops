#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: OPENCODE HOOK INSTALLER
# ───────────────────────────────────────────────────────────────
# Install repo hooks into the hooks directory Git reports.
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
# A linked worktree keeps .git as a file, and core.hooksPath can move the hooks
# directory outright, so ask Git where they live instead of assuming .git/hooks.
HOOKS_DEST="$(git -C "$REPO_ROOT" rev-parse --git-path hooks)"
[[ "$HOOKS_DEST" == /* ]] || HOOKS_DEST="$REPO_ROOT/$HOOKS_DEST"
mkdir -p "$HOOKS_DEST"
ln -sf "$HOOKS_SRC/pre-commit" "$HOOKS_DEST/pre-commit"
echo "Installed: pre-commit → $HOOKS_DEST/pre-commit"
