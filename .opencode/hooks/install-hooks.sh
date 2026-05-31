#!/usr/bin/env bash
# Install repo hooks into .git/hooks/
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
HOOKS_SRC="$REPO_ROOT/.opencode/hooks"
HOOKS_DEST="$REPO_ROOT/.git/hooks"
ln -sf "$HOOKS_SRC/pre-commit" "$HOOKS_DEST/pre-commit"
echo "Installed: pre-commit → .git/hooks/pre-commit"
