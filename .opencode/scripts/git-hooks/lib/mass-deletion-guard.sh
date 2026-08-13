#!/usr/bin/env bash
# Shared guard: refuse a commit or push that removes an unusually large number
# of tracked files unless the operator explicitly authorizes it.
#
# WHY: a `git add -A && commit` taken against a working tree that is BEHIND the
# branch it sits on records every not-yet-present branch file as a deletion. One
# such snapshot silently erased hundreds of committed files here; an unrestricted
# agent write erased dozens another time. Both went through the git CLI, so a
# hook-level ceiling on deletions-per-operation is the cheapest place to stop the
# next one before it reaches history or the remote.
#
# Contract: these helpers NEVER exit and NEVER block on their own — they return a
# verdict and the calling hook decides. Every substitution is guarded so the
# guard fails OPEN (allows) under `set -euo pipefail`; a bug here can never wedge
# commits or pushes.
#
# Tuning:  SPECKIT_MASS_DELETION_THRESHOLD  max tracked-file deletions (default 100)
# Bypass:  SPECKIT_ALLOW_MASS_DELETION=1    authorize this one operation

# Effective threshold, defaulting on any non-numeric/empty value.
_mdg_threshold() {
  local t="${SPECKIT_MASS_DELETION_THRESHOLD:-100}"
  case "$t" in
    ''|*[!0-9]*) printf '100' ;;
    *)           printf '%s' "$t" ;;
  esac
}

# Emit a clean integer for the deleted-file count of a diff, fail-open to 0.
_mdg_count() {
  local n
  n="$("$@" 2>/dev/null | wc -l 2>/dev/null)" || n=0
  n="${n//[[:space:]]/}"
  case "$n" in ''|*[!0-9]*) n=0 ;; esac
  printf '%s' "$n"
}

# Count staged tracked-file deletions (the pre-commit surface).
mass_deletion_staged_count() {
  _mdg_count git diff --cached --name-only --diff-filter=D
}

# Count tracked-file deletions a range would introduce (the pre-push surface).
# Args: <base_sha> <tip_sha>
mass_deletion_range_count() {
  _mdg_count git diff --name-only --diff-filter=D "$1" "$2"
}

# Verdict: return 0 to ALLOW, 1 to BLOCK. Fail-open on any oddity.
# Args: <deleted_count>
mass_deletion_verdict() {
  local deleted="$1" threshold
  threshold="$(_mdg_threshold)"
  case "$deleted" in ''|*[!0-9]*) return 0 ;; esac
  [ "$deleted" -le "$threshold" ] && return 0
  [ "${SPECKIT_ALLOW_MASS_DELETION:-0}" = "1" ] && return 0
  return 1
}

# Explain the block on stderr and best-effort append an audit line. Never fails.
# Args: <mode: commit|push> <deleted_count> [detail]
mass_deletion_report() {
  local mode="$1" deleted="$2" detail="${3:-}" threshold gd ts
  threshold="$(_mdg_threshold)"
  {
    echo ""
    echo "🛑 BLOCKED ($mode): removes $deleted tracked files (ceiling: $threshold). $detail"
    echo "   A snapshot this destructive is usually a stale-tree \`git add -A\` or a runaway"
    echo "   deletion, not an intended change."
    echo "   Intended? authorize this operation:  SPECKIT_ALLOW_MASS_DELETION=1 git $mode ..."
    echo "   Or raise the ceiling for it:          SPECKIT_MASS_DELETION_THRESHOLD=$((deleted + 1)) git $mode ..."
    echo ""
  } >&2
  gd="$(git rev-parse --git-dir 2>/dev/null)" || gd=""
  ts="$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null)" || ts="-"
  [ -n "$gd" ] && printf '%s\t%s\tdeleted=%s\tthreshold=%s\t%s\n' \
    "$ts" "$mode" "$deleted" "$threshold" "$detail" >> "$gd/mass-deletion-guard.log" 2>/dev/null || true
}
