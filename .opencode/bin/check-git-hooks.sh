#!/usr/bin/env bash
#
# check-git-hooks.sh — detect-and-warn guard for AI SessionStart hook chains.
#
# Companion to install-git-hooks.sh. A SessionStart hook cannot install missing
# git hooks into an already-running session, but it CAN warn the operator when a
# versioned hook under .opencode/scripts/git-hooks/ has no matching effective
# hook symlink — the state a fresh clone or a forgotten install step leaves behind,
# and the same silent gap that can drop post-merge/post-rewrite drift-marker
# coverage.
#
# Wire it into any runtime's SessionStart chain, e.g. as an extra hook command:
#   bash /abs/path/.opencode/bin/check-git-hooks.sh
#
# It is intentionally non-fatal: it prints one warning line naming every invalid
# hook to stderr and always exits 0, so it never blocks a session.
#
# Silence with SPECKIT_GIT_HOOKS_GUARD=off.

set -euo pipefail

[ "${SPECKIT_GIT_HOOKS_GUARD:-on}" = "off" ] && exit 0

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"

# Not a git repo: nothing to guard.
[ -z "$repo_root" ] && exit 0

hook_source_dir="$repo_root/.opencode/scripts/git-hooks"
hook_target_dir="$(git -C "$repo_root" rev-parse --git-path hooks 2>/dev/null || true)"
[ -n "$hook_target_dir" ] || exit 0
case "$hook_target_dir" in
  /*) ;;
  *) hook_target_dir="$repo_root/$hook_target_dir" ;;
esac

# No versioned hook source in this checkout: nothing to guard.
[ -d "$hook_source_dir" ] || exit 0

canonical_path() {
  local path="$1"
  local path_dir
  local path_name
  path_dir="$(dirname "$path")"
  path_name="$(basename "$path")"
  (cd -P "$path_dir" 2>/dev/null && printf '%s/%s\n' "$(pwd -P)" "$path_name")
}

resolved_link_path() {
  local link_path="$1"
  local link_target
  link_target="$(readlink "$link_path" 2>/dev/null || true)"
  [ -n "$link_target" ] || return 1
  case "$link_target" in
    /*) ;;
    *) link_target="$(dirname "$link_path")/$link_target" ;;
  esac
  canonical_path "$link_target"
}

invalid=()
for hook in "$hook_source_dir"/*; do
  [ -f "$hook" ] || continue
  name="$(basename "$hook")"
  [ "$name" = "README.md" ] && continue
  target="$hook_target_dir/$name"
  if [ ! -L "$target" ]; then
    invalid+=("$name (missing)")
  elif [ ! -e "$target" ]; then
    invalid+=("$name (broken)")
  elif [ "$(resolved_link_path "$target" || true)" != "$(canonical_path "$hook" || true)" ]; then
    invalid+=("$name (mismatched)")
  elif [ ! -x "$target" ]; then
    invalid+=("$name (non-executable)")
  fi
done

if [ "${#invalid[@]}" -gt 0 ]; then
  joined="$(IFS=', '; echo "${invalid[*]}")"
  printf '%s\n' "[check-git-hooks] Invalid git hook symlink(s): $joined. Fix: bash .opencode/scripts/install-git-hooks.sh (silence: SPECKIT_GIT_HOOKS_GUARD=off)" >&2
fi

exit 0
