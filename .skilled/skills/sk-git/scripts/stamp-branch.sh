#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: Branch Commit-Id Stamper
# ───────────────────────────────────────────────────────────────
# A rebase re-plays a branch's own commits onto the rewritten base, but
# the prepare-commit-msg hook does not run on rebase picks, so the picks
# arrive with no `Commit-Id:`.  This script mints one ordinal per unique
# commit from the live allocator, in the order the branch presents them,
# and rewrites only the branch's unique range so the base and every other
# ref stay where they were.
#
# The rewrite is one `git filter-repo` pass over `<base>..<branch>`.  The
# callback reads a sha-to-ordinal map from a temporary file, which keeps
# the trailer-shape logic in Python and the allocator in the shell.  A
# commit that already carries an id is absent from the map, so its message
# is left alone.
#
# Usage: stamp-branch.sh [--dry-run] <branch> <base>
#
# Exit Codes:
#   0 - Success; or a dry run that changed nothing
#   1 - Refused: dirty worktree, non-ancestor base, or a failed rewrite
#   2 - Misuse: bad arguments, no repository, or a missing allocator
# ───────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
ALLOCATOR="$SCRIPT_DIR/commit-id-naming.sh"

DRY_RUN=0
BRANCH=""
BASE=""

usage() {
  cat >&2 <<'USAGE'
usage: stamp-branch.sh [--dry-run] <branch> <base>

  Mint a Commit-Id for every commit in <base>..<branch> that lacks one,
  then rewrite only that range to add the trailer.

  --dry-run  List the commits that would be stamped; mint nothing.
USAGE
}

_add_positional() {
  if [ -z "$BRANCH" ]; then
    BRANCH="$1"
  elif [ -z "$BASE" ]; then
    BASE="$1"
  else
    echo "error: unexpected argument '$1'" >&2
    usage
    exit 2
  fi
}

END_OPTIONS=0
while [ $# -gt 0 ]; do
  if [ "$END_OPTIONS" -eq 1 ]; then
    _add_positional "$1"
    shift
    continue
  fi
  case "$1" in
    --dry-run)
      DRY_RUN=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --)
      END_OPTIONS=1
      shift
      ;;
    -*)
      echo "error: unknown option '$1'" >&2
      usage
      exit 2
      ;;
    *)
      _add_positional "$1"
      shift
      ;;
  esac
done

if [ -z "$BRANCH" ] || [ -z "$BASE" ]; then
  usage
  exit 2
fi

# ───────────────────────────────────────────────────────────────
# 1. GUARDS
# ───────────────────────────────────────────────────────────────

git rev-parse --show-toplevel >/dev/null 2>&1 || { echo "error: not inside a git repository" >&2; exit 2; }
[ -f "$ALLOCATOR" ] || { echo "error: allocator not found at $ALLOCATOR" >&2; exit 2; }

git rev-parse --verify --quiet "$BRANCH^{commit}" >/dev/null || { echo "error: '$BRANCH' does not resolve to a commit" >&2; exit 2; }
git rev-parse --verify --quiet "$BASE^{commit}" >/dev/null || { echo "error: '$BASE' does not resolve to a commit" >&2; exit 2; }

if ! git merge-base --is-ancestor "$BASE" "$BRANCH" 2>/dev/null; then
  echo "error: base '$BASE' is not an ancestor of '$BRANCH'" >&2
  exit 1
fi

# A branch can only be checked out in one worktree, so the first match is
# the one whose dirt matters.  A clean checkout is safe to rewrite because
# only message text changes, which is why dirt is the refusal, not presence.
_worktree_for_branch() {
  local want="refs/heads/$1" line path="" branch=""
  while IFS= read -r line; do
    case "$line" in
      "worktree "*) path="${line#worktree }" ;;
      "branch "*) branch="${line#branch }" ;;
      "")
        if [ "$branch" = "$want" ]; then
          printf '%s\n' "$path"
          return 0
        fi
        path=""
        branch=""
        ;;
    esac
  done < <(git worktree list --porcelain; printf '\n')
  return 1
}

WORKTREE="$(_worktree_for_branch "$BRANCH" || true)"
if [ -n "$WORKTREE" ] && [ -n "$(git -C "$WORKTREE" status --porcelain 2>/dev/null)" ]; then
  echo "error: branch '$BRANCH' is checked out with uncommitted changes in $WORKTREE" >&2
  exit 1
fi

OLD_TIP="$(git rev-parse "$BRANCH")"

# ───────────────────────────────────────────────────────────────
# 2. MINT (OR LIST) IN COMMIT ORDER
# ───────────────────────────────────────────────────────────────

MAP_FILE="$(mktemp "${TMPDIR:-/tmp}/stamp-branch-map.XXXXXX")"
trap 'rm -f "$MAP_FILE"' EXIT
: > "$MAP_FILE"

COUNT=0
while IFS= read -r sha; do
  [ -n "$sha" ] || continue
  if git log -1 --format=%B "$sha" | grep -q '^Commit-Id:'; then
    continue
  fi
  if [ "$DRY_RUN" -eq 1 ]; then
    printf '%s %s\n' "$sha" "$(git log -1 --format=%s "$sha")"
    COUNT=$((COUNT + 1))
    continue
  fi
  if ! ordinal="$(bash "$ALLOCATOR" allocate)"; then
    echo "error: could not mint an ordinal for $sha" >&2
    exit 1
  fi
  printf '%s\t%s\n' "$sha" "$ordinal" >> "$MAP_FILE"
  COUNT=$((COUNT + 1))
done < <(git rev-list --reverse --topo-order "$BASE..$BRANCH")

if [ "$DRY_RUN" -eq 1 ]; then
  echo "stamp-branch: $BRANCH: $COUNT commit(s) would be stamped (dry run; nothing minted)"
  exit 0
fi

if [ "$COUNT" -eq 0 ]; then
  echo "stamp-branch: $BRANCH: $OLD_TIP -> $OLD_TIP (0 commits stamped; nothing to rewrite)"
  exit 0
fi

# ───────────────────────────────────────────────────────────────
# 3. REWRITE THE RANGE
# ───────────────────────────────────────────────────────────────

command -v git-filter-repo >/dev/null 2>&1 || { echo "error: git-filter-repo is not on PATH" >&2; exit 2; }

# The callback appends `Commit-Id:` the same way the stamping hook does:
# join the final paragraph when it is already a trailer block, otherwise
# open a blank line first; inside a trailer block the key goes ahead of
# any Co-Authored-By line.  A single-line message that merely looks like
# `Token: value` is a subject, not a trailer paragraph, so it gets the
# blank line and keeps its subject intact.
CALLBACK="$(cat <<'PY'
import os
import re

_MAP = {}
with open(os.environ["STAMP_BRANCH_MAP"], "r", encoding="ascii") as _handle:
    for _line in _handle:
        _sha, _, _ordinal = _line.strip().partition("\t")
        if _sha:
            _MAP[_sha] = _ordinal

_TRAILER_LINE = re.compile(rb"^[A-Za-z][A-Za-z0-9-]*:[ \t]+\S.*$")
_CO_AUTHOR = re.compile(rb"^Co-Authored-By:")


def _stamp(message, ordinal):
    lines = message.split(b"\n")
    if lines and lines[-1] == b"":
        lines = lines[:-1]
    key = b"Commit-Id: " + ordinal.encode("ascii")
    if not lines:
        return key + b"\n"

    start = len(lines)
    while start > 0 and _TRAILER_LINE.match(lines[start - 1]):
        start -= 1

    trailer_shaped = False
    if start < len(lines):
        if start == 0:
            trailer_shaped = len(lines) > 1
        else:
            trailer_shaped = lines[start - 1].strip() == b""

    if trailer_shaped:
        insert = len(lines)
        for index in range(start, len(lines)):
            if _CO_AUTHOR.match(lines[index]):
                insert = index
                break
        lines = lines[:insert] + [key] + lines[insert:]
    else:
        lines = lines + [b"", key]

    return b"\n".join(lines) + b"\n"


_ordinal = _MAP.get(commit.original_id.decode("ascii"))
if _ordinal is not None:
    commit.message = _stamp(commit.message, _ordinal)
PY
)"

if ! STAMP_BRANCH_MAP="$MAP_FILE" git filter-repo --force --refs "$BASE..$BRANCH" \
  --commit-callback "$CALLBACK" >&2; then
  echo "error: git filter-repo failed for '$BRANCH'" >&2
  exit 1
fi

NEW_TIP="$(git rev-parse "$BRANCH")"
echo "stamp-branch: $BRANCH: $OLD_TIP -> $NEW_TIP ($COUNT commits stamped)"
