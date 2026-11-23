#!/usr/bin/env bash
# Live check of bots status against one real, held-disabled launchd label.
# NOT RUN by the builder: it installs a real launchd agent into the operator's
# ~/Library/LaunchAgents (held disabled, never enabled) and needs the
# operator's yes first.
#
# What it proves: a bot installed by `bots schedule install` and never run
# shows in `bots status` as installed, with the row state never-run, read
# through a real `launchctl print` (which answers 113 for a held label).
# It never enables the label, so nothing fires.
#
# Usage: bash live-status-check.sh [--skilled-tree <primary checkout>]
# Rollback if anything is left behind (LABEL from the result file):
#   launchctl disable gui/$(id -u)/<label>; launchctl bootout gui/$(id -u)/<label>
#   rm ~/Library/LaunchAgents/<label>.plist

set -u

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKTREE="$(cd "$HERE/../../../../.." && pwd)"
SKILLED_TREE="${SKILLED_TREE:-/Users/michelkerkmeester/MEGA/Development/Skilled}"
while [ $# -gt 0 ]; do
  case "$1" in
    --skilled-tree) [ -n "${2:-}" ] || { echo "usage: --skilled-tree needs a path" >&2; exit 2; }; SKILLED_TREE="$2"; shift 2 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done
NODE="$(command -v node)"
SCRATCH="$(mktemp -d "${TMPDIR:-/tmp}/bots-status-live-XXXXXX")"
CONSUMER="$SCRATCH/consumer"
STATE="$SCRATCH/state"
IDENTITY="local/bots-status-probe"
BOT="tick"
RESULT="$HERE/live-status-result.txt"

: > "$RESULT"
log() { printf '%s\n' "$*" | tee -a "$RESULT"; }
run() { log "\$ $*"; "$@" >>"$RESULT" 2>&1; local rc=$?; log "exit=$rc"; return $rc; }
bots() { "$NODE" "$CONSUMER/.skilled/bin/bots.cjs" "$@" --repo "$CONSUMER" --skilled-tree "$SKILLED_TREE"; }

cleanup() {
  log "--- cleanup"
  bots schedule uninstall "$BOT" >>"$RESULT" 2>&1
}
trap cleanup EXIT

log "date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
log "macOS: $(sw_vers -productVersion) ($(sw_vers -buildVersion))"
log "worktree: $WORKTREE"
log "skilled tree: $SKILLED_TREE"

if ! git -C "$SKILLED_TREE" check-ignore -q .skilled/skills/.state/system-skilled-bots/x/runs/y; then
  log "FAIL: $SKILLED_TREE does not ignore run folders"; exit 1
fi

mkdir -p "$CONSUMER/bots/$BOT"
git -C "$CONSUMER" init -q
ln -s "$WORKTREE/.skilled" "$CONSUMER/.skilled"
printf '{ "identity": "%s", "stateRoot": "%s" }\n' "$IDENTITY" "$STATE" > "$CONSUMER/bots/config.json"
cat > "$CONSUMER/bots/$BOT/BOT.md" <<'MD'
---
id: tick
trigger: {kind: cron, expression: "*/5 * * * *"}
runtime: {kind: cli-codex}
isolation: shared
precheck: "echo '[SILENT] live status probe'"
---
Never dispatched: the label stays held disabled and the precheck is silent.
MD
printf '.skilled\n' > "$CONSUMER/.gitignore"
git -C "$CONSUMER" -c user.email=bots-live@example.invalid -c user.name="bots live" add -A
git -C "$CONSUMER" -c user.email=bots-live@example.invalid -c user.name="bots live" commit -q \
  -m "test(bots): add the live status probe consumer" -m "A scratch consumer whose one bot stays held disabled." \
  || { log "FAIL: the consumer commit was refused"; exit 1; }

log "--- 1. install held disabled (never enabled)"
run bots schedule install "$BOT" || { log "FAIL: install"; exit 1; }
LABEL="$(sed -n 's/^bots: installed \([^ ,]*\) at .*/\1/p' "$RESULT" | tail -1)"
log "label: $LABEL"
launchctl print "gui/$(id -u)/$LABEL" >/dev/null 2>&1; log "print while held: exit=$? (113 means not loaded)"

log "--- 2. bots status"
run bots status
bots status --json > "$SCRATCH/status.json" 2>>"$RESULT"; log "status --json exit=$?"
"$NODE" -e '
  const report = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  const row = report.rows.find((r) => r.kind === "bot" && r.botId === "tick");
  console.log(JSON.stringify({ state: row?.state, installed: row?.installed, labels: row?.labels, launchd: row?.launchd }, null, 2));
  process.exit(row?.state === "never-run" && row?.installed === true ? 0 : 1);
' "$SCRATCH/status.json" | tee -a "$RESULT"
log "row check exit=${PIPESTATUS[0]} (expect 0: installed and never-run)"

log "--- 3. uninstall"
trap - EXIT
run bots schedule uninstall "$BOT"
log "job files left: $(ls "$HOME/Library/LaunchAgents" | grep -c 'bots-status-probe') (expect 0)"
log "scratch left for inspection: $SCRATCH"
log "DONE"
