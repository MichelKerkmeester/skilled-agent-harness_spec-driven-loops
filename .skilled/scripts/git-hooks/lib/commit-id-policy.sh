#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Commit-Id Policy Helpers
# ───────────────────────────────────────────────────────────────
# Decides which repositories carry a Commit-Id on every commit, and finds an
# allocator to mint one, without running any code from the repository itself.
#
# WHY: the hook trust gate hides an untrusted repository's own toolchain, and
# the stamper used to mint only through that toolchain, so an untrusted clone
# and a repository that never shipped the allocator went unstamped without a
# word. Stamping, the commit-msg check and the pre-push check ask the same
# question, and three copies would drift.
#
# Contract: sourcing defines functions only. Nothing here exits or blocks; the
# calling hook decides.

# True when commits in the repository at $1 must carry a Commit-Id.
# Local config skilled.commitId decides first, true or false. Without it, a
# repository that ships the sk-git allocator or the toolchain sentinel, trusted
# or not, or whose recent history already carries Commit-Id trailers, is in.
# Only local config counts, so a cloned repository cannot switch itself in or
# out, and a file-existence test runs nothing from the repository.
cip_repo_wants_ids() {
  local repo_root="$1" flag tree
  flag="$(git -C "$repo_root" config --local --bool skilled.commitId 2>/dev/null || true)"
  case "$flag" in
    true) return 0 ;;
    false) return 1 ;;
  esac
  for tree in "$repo_root/.skilled" "$repo_root/.opencode"; do
    if [[ -f "$tree/skills/sk-git/scripts/commit-id-naming.sh" \
       || -f "$tree/skills/system-spec-kit/SKILL.md" ]]; then
      return 0
    fi
  done
  # Fifty commits reach past any run of unstamped ones a broken hook could leave,
  # and keep the probe cheap in a large repository that never adopted the trailer.
  git -C "$repo_root" log -n 50 --no-merges \
    --format='%(trailers:key=Commit-Id,valueonly)' HEAD 2>/dev/null \
    | grep -qE '^[0-9]{7}$'
}

# Path of the allocator beside the hooks in $1, the checkout these hooks run
# from. The allocator only reads history and writes its counter under the
# target's git dir, so it is safe to run against any repository.
cip_own_allocator() {
  printf '%s\n' "$1/../../skills/sk-git/scripts/commit-id-naming.sh"
}

# True when the message file $1 carries a Commit-Id trailer line.
cip_message_has_id() {
  grep -qE '^Commit-Id: [0-9]{7}$' "$1"
}
