#!/usr/bin/env bash
# Autostash orphan guard — makes --autostash work unloseable and visible.
#
# WHY: `git merge|pull|rebase --autostash` stashes uncommitted changes, runs the
# operation, then re-applies them. When the re-apply CONFLICTS, git leaves the
# changes un-applied in the stash and prints a warning that is easily swallowed
# by automated / tool-driven git. An unnoticed orphaned autostash is a single
# `git stash drop`/`clear` (or gc) away from permanently losing the entire
# uncommitted changeset. This guard runs from post-merge / post-rewrite: it
# anchors every autostash entry under refs/autostash-rescue/<sha> (so it can
# never be garbage-collected even if the stash ref is dropped) and prints a
# visible, logged alert so an orphan is never silently lost. It never blocks.

# Anchor + surface any autostash-marked stash entry. Best-effort; never fails.
autostash_orphan_guard() {
  local root ref sha subject rescue
  root="$(git rev-parse --show-toplevel 2>/dev/null)" || return 0

  while IFS=$'\t' read -r ref sha subject; do
    [ -n "${sha:-}" ] || continue
    case "$subject" in
      *autostash*|*"Auto stash before"*) : ;;
      *) continue ;;
    esac

    # Durable, GC-proof anchor keyed on the stash commit SHA (idempotent).
    rescue="refs/autostash-rescue/${sha:0:12}"
    git update-ref "$rescue" "$sha" 2>/dev/null || true

    {
      printf '\n\033[1;33m⚠️  AUTOSTASH DETECTED\033[0m  %s  (%s)\n' "$ref" "${sha:0:12}"
      printf '   If this entry is still present after the operation finishes, your uncommitted\n'
      printf '   work was NOT re-applied — recover it, do not run git stash drop/clear first.\n'
      printf '   Recover:  git stash pop %s     (on conflict: resolve, then commit immediately)\n' "$ref"
      printf '   Safety:   anchored at %s (survives a dropped stash)\n\n' "$rescue"
    } >&2

    mkdir -p "$root/.opencode/logs" 2>/dev/null || true
    printf '%s\tHEAD=%s\t%s\t%s\n' \
      "$(date -u +%Y-%m-%dT%H:%M:%SZ 2>/dev/null || echo unknown-time)" \
      "$(git rev-parse --short HEAD 2>/dev/null || echo unknown)" \
      "$ref" "$sha" >> "$root/.opencode/logs/autostash-orphan-alerts.log" 2>/dev/null || true
  done < <(git stash list --format='%gd%x09%H%x09%gs' 2>/dev/null)

  return 0
}
