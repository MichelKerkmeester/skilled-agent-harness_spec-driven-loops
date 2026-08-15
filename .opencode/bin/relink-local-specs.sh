#!/usr/bin/env bash
# -----------------------------------------------------------------------------
# Restore machine-local spec pointers after a destructive clean removed them.
# -----------------------------------------------------------------------------
# Some spec folders are irreplaceable local-only work that must never live inside
# this working tree, because `git clean -fdx` deletes ignored files and would
# erase them permanently. The real content lives in sibling project directories;
# this checkout holds only gitignored symlinks. A clean can therefore delete just
# the pointer, never the data. Re-run this to recreate any missing pointer.
#
# Idempotent: an already-correct link is left untouched; a missing target is
# reported, never invented.

set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"          # .opencode/bin -> repo root
CE_DIR="$(cd "$REPO_ROOT/.." && pwd)"                 # the Code_Environment root
DEV_DIR="$(cd "$CE_DIR/.." && pwd)"                   # the Development root

# link-relative-to-repo  ->  external real target
MAP=(
  "specs/barter|$CE_DIR/Barter/specs"
  "specs/anobel.com|$CE_DIR/Websites/anobel.com/specs"
  "specs/ai-systems|$DEV_DIR/AI_Systems/Barter/specs"
)

status=0
for entry in "${MAP[@]}"; do
  link="$REPO_ROOT/${entry%%|*}"
  target="${entry##*|}"
  rel="${entry%%|*}"

  if [ ! -e "$target" ]; then
    printf '%s\n' "MISSING TARGET: $rel -> $target (cannot relink; recover the data first)" >&2
    status=1
    continue
  fi
  if [ -L "$link" ] && [ "$(readlink "$link")" = "$target" ]; then
    printf '%s\n' "ok:      $rel -> $target"
    continue
  fi
  if [ -e "$link" ] && [ ! -L "$link" ]; then
    printf '%s\n' "SKIP (real path present, not a link): $rel — move it out first" >&2
    status=1
    continue
  fi
  rm -f "$link" 2>/dev/null || true
  mkdir -p "$(dirname "$link")"
  if ln -s "$target" "$link"; then
    printf '%s\n' "relinked: $rel -> $target"
  else
    printf '%s\n' "FAILED to relink: $rel" >&2
    status=1
  fi
done

exit "$status"
