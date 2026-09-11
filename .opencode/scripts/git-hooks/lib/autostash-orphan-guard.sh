#!/usr/bin/env bash
# Autostash orphan guard — makes --autostash work unloseable and visible.
#
# WHY: `git merge|pull|rebase --autostash` stashes uncommitted changes, runs the
# operation, then re-applies them. When the re-apply CONFLICTS, git leaves the
# changes un-applied in the stash and prints a warning that is easily swallowed
# by automated / tool-driven git. An unnoticed orphaned autostash is a single
# `git stash drop`/`clear` (or gc) away from permanently losing the entire
# uncommitted changeset. This guard runs from post-commit / post-merge /
# post-rewrite: it anchors every autostash entry under
# refs/autostash-rescue/<sha> (so it can never be garbage-collected even if the
# stash ref is dropped) and prints a visible, logged alert so an orphan is never
# silently lost. It never blocks.

# Anchor one autostash commit under refs/autostash-rescue/<sha> and record the
# alert. <source> names where the entry was found, <recover> is the recovery
# line. Idempotent and best-effort; never fails.
_autostash_anchor() {
  local root="$1" source="$2" sha="$3" recover="$4" rescue
  [[ -n "$sha" ]] || return 0

  # Durable, GC-proof anchor keyed on the stash commit SHA (idempotent).
  rescue="refs/autostash-rescue/${sha:0:12}"
  git update-ref "$rescue" "$sha" 2>/dev/null || true

  {
    printf '\n\033[1;33m⚠️  AUTOSTASH DETECTED\033[0m  %s  (%s)\n' "$source" "${sha:0:12}"
    printf '   If this entry is still present after the operation finishes, your uncommitted\n'
    printf '   work was NOT re-applied — recover it, do not run git stash drop/clear first.\n'
    printf '   %s\n' "$recover"
    printf '   Safety:   anchored at %s (survives a dropped stash)\n\n' "$rescue"
  } >&2

  mkdir -p "$root/.opencode/logs" 2>/dev/null || true
  printf '%s\tHEAD=%s\t%s\t%s\n' \
    "$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || echo unknown-time)" \
    "$(git rev-parse --short HEAD 2>/dev/null || echo unknown)" \
    "$source" "$sha" >> "$root/.opencode/logs/autostash-orphan-alerts.log" 2>/dev/null || true
}

# Anchor + surface any autostash-marked stash entry. Best-effort; never fails.
autostash_orphan_guard() {
  local root ref sha subject seq seq_file seq_sha
  root="$(git rev-parse --show-toplevel 2>/dev/null)" || return 0

  # `rebase --autostash` records its stash object in the sequencer directory and
  # re-applies it only AFTER post-rewrite has run, so refs/stash does not list it
  # at hook time. Anchor the recorded object here too: without this, a conflicting
  # re-apply leaves the entry with no later hook left to anchor it.
  for seq in rebase-merge rebase-apply; do
    seq_file="$(git rev-parse --git-path "$seq/autostash" 2>/dev/null || true)"
    if [[ -z "$seq_file" || ! -f "$seq_file" ]]; then
      continue
    fi
    seq_sha="$(tr -d '[:space:]' < "$seq_file" 2>/dev/null || true)"
    _autostash_anchor "$root" "sequencer:$seq" "$seq_sha" \
      'Recover:  git stash pop   (on conflict: resolve, then commit immediately)'
  done

  while IFS=$'\t' read -r ref sha subject; do
    [[ -n "${sha:-}" ]] || continue
    case "$subject" in
      *autostash*|*"Auto stash before"*) : ;;
      *) continue ;;
    esac

    _autostash_anchor "$root" "$ref" "$sha" \
      "Recover:  git stash pop $ref     (on conflict: resolve, then commit immediately)"
  done < <(git stash list --format='%gd%x09%H%x09%gs' 2>/dev/null)

  return 0
}
