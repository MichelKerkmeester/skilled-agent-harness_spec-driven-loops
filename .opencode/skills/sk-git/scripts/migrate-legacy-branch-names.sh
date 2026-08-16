#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Legacy Branch-Name Migration Helper
# ───────────────────────────────────────────────────────────────
# One-shot renumbering of the pre-grammar owner-first worktree branches
# (OWNER/NNNN-SLUG) into the flat worktrees/NNN-SLUG namespace so the Git-UI
# branch tree reads as clean folders instead of a per-skill pile.
#
# It scans every LOCAL branch checked out in a registered .worktrees/* directory
# whose name matches the legacy owner-first grammar, sorts them by ascending
# original 4-digit number, and renumbers them worktrees/001.. in that stable
# order (the 13 original branches map to 001..013). Both the branch and its
# directory are renamed — `git branch -m` plus `git worktree move` — never
# history rewrites, so all WIP and unpushed commits are preserved.
#
# Flags:
#   --dry-run   Print the plan (old branch/dir -> new branch/dir) and change
#               nothing.
#
# Idempotent: a branch already under worktrees/NNN-slug is never renumbered, and
# running again after a partial rename only schedules the still-legacy names.
#
# This script is the ONLY place git rename commands are expected for this
# migration; it is written to be reviewed and run by an operator, not by an AI.

set -uo pipefail

# ───────────────────────────────────────────────────────────────
# 1. ARGUMENT PARSING
# ───────────────────────────────────────────────────────────────

DRY_RUN=0
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=1 ;;
    *) echo "unknown flag: $arg (expected --dry-run)" >&2; exit 2 ;;
  esac
done

# ───────────────────────────────────────────────────────────────
# 2. REPO RESOLUTION
# ───────────────────────────────────────────────────────────────

COMMON="$(git rev-parse --git-common-dir 2>/dev/null || true)"
if [ -z "$COMMON" ]; then
  echo "migrate-legacy-branch-names: not in a git repo" >&2
  exit 1
fi
MAIN_TOPLEVEL="$(cd "$(dirname "$COMMON")" && pwd -P)"
WT_BASE="$MAIN_TOPLEVEL/.worktrees"

# Legacy owner-first grammar: OWNER/NNNN-SLUG where OWNER is a lowercase kebab
# segment, NNNN is a 4-digit number, SLUG is a lowercase kebab description.
_legacy_branch_match() {
  local b="$1"
  [[ "$b" =~ ^[a-z0-9][a-z0-9-]*/([0-9][0-9][0-9][0-9])-([a-z0-9][a-z0-9-]*)$ ]]
}

# ───────────────────────────────────────────────────────────────
# 3. DISCOVER LEGACY PAIRS
# ───────────────────────────────────────────────────────────────

# Map: original-4digit-number SPACE branch SPACE registered-dir. Sorted by the
# ascending original number so renumbering is stable across runs. The registered
# dir path may be relative (porcelain lists it relative to cwd), so resolve it
# against the main toplevel for a stable, deduplicated key.
declare -a ROWS=()
while IFS= read -r line; do
  case "$line" in "worktree "*) ;; *) continue ;; esac
  wt_path="${line#worktree }"
  case "$wt_path" in
    "$WT_BASE"/*) ;;
    /*) [[ "$wt_path" == "$WT_BASE"/* ]] || continue ;;
    *) wt_path="$MAIN_TOPLEVEL/$wt_path" ;;
  esac
  [ -d "$wt_path" ] || continue
  branch="$(git -C "$wt_path" rev-parse --abbrev-ref HEAD 2>/dev/null || echo HEAD)"
  [ "$branch" = "HEAD" ] && continue
  if _legacy_branch_match "$branch"; then
    num="${BASH_REMATCH[1]}"
    ROWS+=("$num $branch $wt_path")
  fi
done < <(git -C "$MAIN_TOPLEVEL" worktree list --porcelain 2>/dev/null | grep '^worktree ')

if [ "${#ROWS[@]}" -eq 0 ]; then
  echo "migrate-legacy-branch-names: no legacy owner-first worktree branches found"
  exit 0
fi

# Stable ascending order by original 4-digit number (ties keep input order).
declare -a SORTED=()
while IFS= read -r row; do
  SORTED+=("$row")
done < <(printf '%s\n' "${ROWS[@]}" | sort -n -k1,1)

# ───────────────────────────────────────────────────────────────
# 4. PLAN + APPLY
# ───────────────────────────────────────────────────────────────

next_num=0
total=0
for row in "${SORTED[@]}"; do
  num="${row%% *}"; rest="${row#* }"; branch="${rest%% *}"; dir="${rest##* }"
  next_num=$((next_num + 1))
  total=$next_num
  nnn="$(printf '%03d' "$next_num")"
  slug="${branch#*/}"
  slug="${slug#${num}-}"
  new_branch="worktrees/$nnn-$slug"
  new_dir=".worktrees/$nnn-$slug"
  # A name collision (a worktrees/NNN-slug already exists) is never silently
  # overwritten — the operator resolves it and re-runs.
  if [ -e "$MAIN_TOPLEVEL/$new_dir" ] || git -C "$MAIN_TOPLEVEL" show-ref --verify --quiet "refs/heads/$new_branch" 2>/dev/null; then
    echo "SKIP (collision; resolve and re-run): $branch -> $new_branch" >&2
    continue
  fi
  echo "PLAN: git branch -m $branch $new_branch"
  echo "PLAN: git worktree move $dir $MAIN_TOPLEVEL/$new_dir"
  if [ "$DRY_RUN" = "0" ]; then
    git -C "$MAIN_TOPLEVEL" branch -m "$branch" "$new_branch" || { echo "FAILED: branch -m $branch" >&2; exit 1; }
    git -C "$MAIN_TOPLEVEL" worktree move "$dir" "$MAIN_TOPLEVEL/$new_dir" || { echo "FAILED: worktree move $dir" >&2; exit 1; }
    echo "DONE: $branch -> $new_branch ($dir -> $new_dir)"
  fi
done

if [ "$DRY_RUN" = "1" ]; then
  echo "migrate-legacy-branch-names: $total legacy pair(s) planned for worktrees/001..$(printf '%03d' "$total") (dry-run; re-run without --dry-run to execute)" >&2
else
  echo "migrate-legacy-branch-names: $total legacy pair(s) renamed to worktrees/001..$(printf '%03d' "$total")" >&2
fi
