#!/usr/bin/env bash
# Weekday-only launchd probe: does {Hour, Minute, Weekday} with no Day key fire
# only on the matching weekday? The job runs /bin/sh to append `date` output to
# a log outside any checkout. It calls no runner and no agent.
#
# DO NOT RUN without the operator's explicit yes: `install` loads a launchd
# agent on this machine.
#
#   probe-weekday.sh install <weekday 0-6>   write the plist, lint it, bootstrap it
#   probe-weekday.sh status                  launchctl print, the plist and the fire log
#   probe-weekday.sh remove                  bootout, delete the plist, confirm it is gone
#
# Pick a weekday that is tomorrow, so the observation covers one matching day
# and the following non-matching day. Read `pmset -g log` beside the fire log:
# a catch-up fire after wake is not a fire on a non-matching day.
set -euo pipefail

LABEL=com.skilled.probe.weekday
HERE="$(cd "$(dirname "$0")" && pwd)"
TEMPLATE="$HERE/$LABEL.plist"
TARGET="$HOME/Library/LaunchAgents/$LABEL.plist"
LOG_DIR="$HOME/.local/state/skilled-probe"
DOMAIN="gui/$(id -u)"

case "${1:-}" in
  install)
    weekday="${2:-}"
    [[ "$weekday" =~ ^[0-6]$ ]] || { echo "usage: $0 install <weekday 0-6>" >&2; exit 2; }
    mkdir -p "$LOG_DIR"
    sed "s/WEEKDAY_PLACEHOLDER/$weekday/" "$TEMPLATE" > "$TARGET"
    plutil -lint "$TARGET"
    launchctl bootstrap "$DOMAIN" "$TARGET"
    echo "installed $(date '+%Y-%m-%dT%H:%M:%S%z %a'), Weekday $weekday"
    launchctl print "$DOMAIN/$LABEL" | grep -E 'state|Weekday|Hour|Minute' || true
    ;;
  status)
    launchctl print "$DOMAIN/$LABEL" || echo "not loaded"
    [[ -f "$TARGET" ]] && cat "$TARGET"
    [[ -f "$LOG_DIR/weekday.log" ]] && cat "$LOG_DIR/weekday.log" || echo "no fires logged"
    ;;
  remove)
    launchctl bootout "$DOMAIN/$LABEL" 2>/dev/null || true
    rm -f "$TARGET"
    if launchctl print "$DOMAIN/$LABEL" >/dev/null 2>&1; then echo "still loaded" >&2; exit 1; fi
    ls "$HOME/Library/LaunchAgents" | grep com.skilled.probe && { echo "plist remains" >&2; exit 1; }
    echo "removed"
    ;;
  *)
    echo "usage: $0 install <weekday 0-6> | status | remove" >&2
    exit 2
    ;;
esac
