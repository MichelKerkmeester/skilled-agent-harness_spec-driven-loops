## Edit 1

File: `.opencode/scripts/install-git-hooks.sh`

OLD:

~~~~text
}

# Ownership check: a symlink counts as "ours" only if it resolves into
# HOOK_SOURCE_DIR. Without this, install/uninstall would blindly overwrite
# or remove a hook symlink some other tool (husky, pre-commit, lefthook)
# installed at the same path.
is_our_symlink() {
  local target="$1" resolved
  [ -L "$target" ] || return 1
  resolved="$(readlink "$target")"
  [[ "$resolved" = /* ]] || resolved="$(cd "$(dirname "$target")" && cd "$(dirname "$resolved")" 2>/dev/null && pwd)/$(basename "$resolved")"
  case "$resolved" in
    "$HOOK_SOURCE_DIR"/*) return 0 ;;
    *) return 1 ;;
  esac
}
~~~~

NEW:

~~~~text
}

# The source tree sits under .skilled or .opencode, and a checkout may link one
# name to the other, so hook links written through either name are ours. A
# reinstall then replaces links made before the tree moved instead of skipping
# them as another tool's.
OWNED_HOOK_SOURCE_DIRS=("$REPO_ROOT/.skilled/scripts/git-hooks" "$REPO_ROOT/.opencode/scripts/git-hooks")

# Ownership check: a symlink counts as "ours" only if it resolves into this
# repository's hook sources under either source-root name. Without this,
# install/uninstall would blindly overwrite or remove a hook symlink some other
# tool (husky, pre-commit, lefthook) installed at the same path.
is_our_symlink() {
  local target="$1" resolved owned_dir
  [ -L "$target" ] || return 1
  resolved="$(readlink "$target")"
  [[ "$resolved" = /* ]] || resolved="$(cd "$(dirname "$target")" && cd "$(dirname "$resolved")" 2>/dev/null && pwd)/$(basename "$resolved")"
  for owned_dir in "${OWNED_HOOK_SOURCE_DIRS[@]}"; do
    case "$resolved" in
      "$owned_dir"/*) return 0 ;;
    esac
  done
  return 1
}
~~~~
