#!/usr/bin/env bash
# Stand-in for sk-git's numbering script in the isolation tests: makes a tree
# folder under the given base and reports provisioning failure (exit 3), the
# one outcome the real script never returns under --no-provision.
set -euo pipefail
[ -n "${NAMING_STUB_LOG:-}" ] && printf '%s\n' "$*" >> "$NAMING_STUB_LOG"
dir="$SPECKIT_WORKTREE_BASE/001-$2"
mkdir -p "$dir"
echo "worktrees/001-$2 $dir"
exit 3
