#!/usr/bin/env bash
# Install advisory git hooks shipped under .opencode/scripts/git-hooks/.
#
# Usage:
#   bash .opencode/scripts/install-git-hooks.sh             # install
#   bash .opencode/scripts/install-git-hooks.sh --uninstall # remove
#
# Hooks installed:
#   pre-commit  — runs validate-doc-model-refs.js (advisory, non-blocking)
#
# Bypass any installed hook: SPECKIT_SKIP_DOC_MODEL_VALIDATE=1 git commit ...

set -eu

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)"
if [ -z "$REPO_ROOT" ]; then
  echo "ERROR: not inside a git working tree" >&2
  exit 1
fi

HOOK_SOURCE_DIR="$REPO_ROOT/.opencode/scripts/git-hooks"
HOOK_TARGET_DIR="$REPO_ROOT/.git/hooks"

if [ "${1:-}" = "--uninstall" ]; then
  for hook in "$HOOK_SOURCE_DIR"/*; do
    [ -f "$hook" ] || continue
    name="$(basename "$hook")"
    target="$HOOK_TARGET_DIR/$name"
    if [ -L "$target" ]; then
      rm -f "$target"
      echo "removed symlink: $target"
    elif [ -f "$target" ]; then
      echo "skipped (not a symlink we installed): $target" >&2
    fi
  done
  exit 0
fi

mkdir -p "$HOOK_TARGET_DIR"
for hook in "$HOOK_SOURCE_DIR"/*; do
  [ -f "$hook" ] || continue
  name="$(basename "$hook")"
  target="$HOOK_TARGET_DIR/$name"
  if [ -e "$target" ] && [ ! -L "$target" ]; then
    echo "WARNING: $target exists and is not a symlink — skipping" >&2
    continue
  fi
  chmod +x "$hook"
  ln -sf "$hook" "$target"
  echo "installed: $target -> $hook"
done

echo ""
echo "Hooks installed. Test: 'git commit --allow-empty -m \"hook smoke\"' should run the validator silently (no output unless drift)."
echo "Bypass: SPECKIT_SKIP_DOC_MODEL_VALIDATE=1 git commit ..."
