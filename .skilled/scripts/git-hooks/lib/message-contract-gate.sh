#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Message Contract Gate Helpers
# ───────────────────────────────────────────────────────────────
# Shared helpers for the hooks that enforce a repository's template contract.
#
# WHY: the hooks are symlinked machine-wide, so the validator must be found next
# to the real hook script rather than inside whatever repository is being
# committed to, and the "is a rule set declared at all" question must be
# answerable without node. Both hooks ask the same two questions, and two copies
# would drift.
#
# Contract: sourcing defines functions only. Nothing here exits or blocks; the
# calling hook decides.

# Directory of the real script behind a symlink chain. macOS ships no readlink -f.
mcg_resolve_dir() {
  local target="$1" link
  while [[ -L "$target" ]]; do
    link="$(readlink "$target")"
    case "$link" in
      /*) target="$link" ;;
      *) target="$(dirname "$target")/$link" ;;
    esac
  done
  printf '%s\n' "$(cd "$(dirname "$target")" && pwd -P)"
}

# Path of validate-message.mjs for a hook living in <root>/scripts/git-hooks/.
mcg_validator_path() {
  printf '%s\n' "$1/../../skills/sk-git/scripts/validate-message.mjs"
}

# True when the repository at $1 declares an "Enforced rules" block in the
# template named $2. Mirrors the validator's resolution order.
mcg_repo_declares_rules() {
  local repo_root="$1" template="$2" dir candidate
  dir="$(git -C "$repo_root" config --get skgit.contractDir 2>/dev/null || true)"
  case "$dir" in
    ""|/*) ;;
    *) dir="$repo_root/$dir" ;;
  esac
  for candidate in \
    "$dir" "$repo_root/.sk-git" \
    "$repo_root/.skilled/skills/sk-git/assets" "$repo_root/.opencode/skills/sk-git/assets"; do
    [[ -n "$candidate" && -f "$candidate/$template" ]] || continue
    grep -qiE '^#{1,6} .*Enforced rules' "$candidate/$template" && return 0
  done
  return 1
}

# Why the validator cannot run, or nothing when it can.
mcg_unavailable_reason() {
  local validator="$1"
  if ! command -v node >/dev/null 2>&1; then
    printf 'node is not installed'
  elif [[ ! -f "$validator" ]]; then
    printf 'the validator is missing at %s' "$validator"
  fi
}
