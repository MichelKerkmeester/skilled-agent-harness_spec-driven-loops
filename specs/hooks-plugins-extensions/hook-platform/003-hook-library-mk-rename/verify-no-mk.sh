#!/usr/bin/env bash
# Grep-gate for the hook-library mk-/mk_ prefix rename.
# Proves no canonical mk-/mk_ hook-library token remains in FUNCTIONAL surfaces
# after a phase. Uses `git grep` (tracked files only) so it matches the real
# rename surface: it respects the repo's .gitignore negations that expose
# .opencode/, and skips gitignored runtime state/logs that must not be edited.
# There is no `rg` binary in this environment (rg is only an interactive shell
# function), so a standalone script must not depend on it.
#
# MK_* env vars are excluded from the failure set (kept as permanent back-compat
# aliases). The historical spec tree and the vendored barter/ subproject are excluded.
#
# Usage: verify-no-mk.sh [2|5|all]   (default: all)
# Exit 0 = clean; 1 = residue found; 2 = usage error.
set -uo pipefail
cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)" || exit 2

PHASE="${1:-all}"

P2='mk-cli-dispatch-audit|mk-codex-hooks-watchdog|mk-communication-projection|mk-completion-sentinel|mk-deep-loop-guard|mk-dist-freshness-guard|mk-git-preflight-advisory|mk-mcp-route-guard|mk-post-edit-quality|mk-speckit-completion|mk-spec-gate|mk-goal|mk_deep_loop_guard|mk_speckit_completion|mk_goal'
P5='mk-spec-memory|mk-skill-advisor|mk-code-index|mk-code-graph|mk-hf-embed|mk-reranker|mk_spec_memory|mk_skill_advisor|mk_code_index|mk_code_graph|mcp__mk_'

case "$PHASE" in
  2)   PAT="$P2" ;;
  5)   PAT="$P5" ;;
  all) PAT="$P2|$P5" ;;
  *)   echo "usage: $0 [2|5|all]"; exit 2 ;;
esac

# Tracked files only; exclude the historical spec tree, this packet's own docs,
# the vendored barter/ subproject, and the files that legitimately hold the old
# names as string literals: the two env-alias tables and the rename-invariant
# tests that assert the old identity is gone. (node_modules/dist/.worktrees are
# untracked/gitignored, so git grep never visits them.)
PATHSPEC=(-- .
  ':(exclude)specs/**'
  ':(exclude)barter/**'
  ':(exclude).opencode/hooks/shared/hook-flags.cjs'
  ':(exclude).opencode/hooks/shared/env-aliases.cjs'
  ':(exclude).opencode/skills/system-skill-advisor/mcp-server/tests/rename-invariants.vitest.ts')

echo "== verify-no-mk (phase=$PHASE) =="
COUNT=$(git grep -hoE "$PAT" "${PATHSPEC[@]}" 2>/dev/null | wc -l | tr -d ' ')

# `git grep` searches neither filenames nor the target-path blobs of symlinks
# (mode 120000), so a renamed-away plugin can survive as a stale symlink whose
# NAME or TARGET still says mk-. Scan both explicitly over the same surface.
SYMLINK_LINES=$(git ls-files -s -- . ':(exclude)specs/**' ':(exclude)barter/**' 2>/dev/null \
  | awk '$1=="120000"{print $4}' \
  | while read -r link; do
      printf '%s\t%s\n' "$link" "$(git cat-file blob ":$link" 2>/dev/null)"
    done \
  | grep -E "$PAT" 2>/dev/null)
SYMLINK_COUNT=$(printf '%s' "$SYMLINK_LINES" | grep -c . | tr -d ' ')

if [ "${COUNT:-0}" -eq 0 ] && [ "${SYMLINK_COUNT:-0}" -eq 0 ]; then
  echo "CLEAN: 0 canonical mk-/mk_ tokens in functional (tracked) surfaces (content + symlink name/target)"
  exit 0
fi
if [ "${COUNT:-0}" -ne 0 ]; then
  echo "RESIDUE (content): $COUNT occurrence(s) across $(git grep -lE "$PAT" "${PATHSPEC[@]}" 2>/dev/null | wc -l | tr -d ' ') file(s):"
  git grep -nE "$PAT" "${PATHSPEC[@]}" 2>/dev/null | head -80
fi
if [ "${SYMLINK_COUNT:-0}" -ne 0 ]; then
  echo "RESIDUE (symlink name/target): $SYMLINK_COUNT link(s):"
  printf '%s\n' "$SYMLINK_LINES" | head -40
fi
exit 1
