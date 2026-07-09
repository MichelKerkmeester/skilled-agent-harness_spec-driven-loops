#!/usr/bin/env bash
#
# check-git-hooks.sh — detect-and-warn guard for AI SessionStart hook chains.
#
# Companion to install-git-hooks.sh. A SessionStart hook cannot install missing
# git hooks into an already-running session, but it CAN warn the operator when a
# versioned hook under .opencode/scripts/git-hooks/ has no matching symlink under
# .git/hooks/ — the state a fresh clone or a forgotten install step leaves behind,
# and the same silent gap that dropped post-merge/post-rewrite drift-marker
# coverage in this checkout until 018-git-hooks-reinstall-and-guard fixed it.
#
# Wire it into any runtime's SessionStart chain, e.g. as an extra hook command:
#   bash /abs/path/.opencode/bin/check-git-hooks.sh
#
# It is intentionally non-fatal: it prints one warning line naming every missing
# hook to stderr and always exits 0, so it never blocks a session.
#
# Silence with SPECKIT_GIT_HOOKS_GUARD=off.

set -euo pipefail

[ "${SPECKIT_GIT_HOOKS_GUARD:-on}" = "off" ] && exit 0

repo_root="$(git rev-parse --show-toplevel 2>/dev/null || true)"

# Not a git repo: nothing to guard.
[ -z "$repo_root" ] && exit 0

hook_source_dir="$repo_root/.opencode/scripts/git-hooks"
hook_target_dir="$repo_root/.git/hooks"

# No versioned hook source in this checkout: nothing to guard.
[ -d "$hook_source_dir" ] || exit 0

missing=()
for hook in "$hook_source_dir"/*; do
  [ -f "$hook" ] || continue
  name="$(basename "$hook")"
  [ "$name" = "README.md" ] && continue
  target="$hook_target_dir/$name"
  if [ ! -L "$target" ]; then
    missing+=("$name")
  fi
done

if [ "${#missing[@]}" -gt 0 ]; then
  joined="$(IFS=', '; echo "${missing[*]}")"
  printf '%s\n' "[check-git-hooks] Missing git hook symlink(s): $joined. Fix: bash .opencode/scripts/install-git-hooks.sh (silence: SPECKIT_GIT_HOOKS_GUARD=off)" >&2
fi

exit 0
