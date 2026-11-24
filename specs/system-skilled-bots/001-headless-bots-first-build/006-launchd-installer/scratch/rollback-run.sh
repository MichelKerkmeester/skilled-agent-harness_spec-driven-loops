#!/usr/bin/env bash
# Runs the plan.md rollback procedure once, by hand, on a held test bot:
# install held disabled, then disable, bootout, delete the job file and
# delete the install record, and count what is left.
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKTREE="$(cd "$HERE/../../../../.." && pwd)"
SKILLED_TREE="${SKILLED_TREE:-/Users/michelkerkmeester/MEGA/Development/Skilled}"
DOMAIN="gui/$(id -u)"
NODE="$(command -v node)"
SCRATCH="$(mktemp -d "${TMPDIR:-/tmp}/bots-rollback-XXXXXX")"
CONSUMER="$SCRATCH/consumer"; STATE="$SCRATCH/state"
IDENTITY="local/bots-rollback-probe"; BOT="tick"
RESULT="$HERE/rollback-run-result.txt"
: > "$RESULT"
log() { printf '%s\n' "$*" | tee -a "$RESULT"; }
run() { log "\$ $*"; "$@" >>"$RESULT" 2>&1; local rc=$?; log "exit=$rc"; return $rc; }
bots() { "$NODE" "$CONSUMER/.skilled/bin/bots.cjs" "$@" --repo "$CONSUMER" --skilled-tree "$SKILLED_TREE"; }
log "date: $(date -u +%Y-%m-%dT%H:%M:%SZ)  macOS: $(sw_vers -productVersion) ($(sw_vers -buildVersion))  domain: $DOMAIN"
log "hub job files before: $(ls "$HOME/Library/LaunchAgents" | grep -c 'com.skilled.bots.')"
mkdir -p "$CONSUMER/bots/$BOT"; git -C "$CONSUMER" init -q
ln -s "$WORKTREE/.skilled" "$CONSUMER/.skilled"
printf '{ "identity": "%s", "stateRoot": "%s" }\n' "$IDENTITY" "$STATE" > "$CONSUMER/bots/config.json"
cat > "$CONSUMER/bots/$BOT/BOT.md" <<'MD'
---
id: tick
trigger: {kind: cron, expression: "*/5 * * * *"}
runtime: {kind: cli-codex}
isolation: shared
precheck: "echo '[SILENT] rollback probe'"
---
Never dispatched: the precheck always prints the silent marker.
MD
printf '.skilled\n' > "$CONSUMER/.gitignore"
git -C "$CONSUMER" -c user.email=bots-live@example.invalid -c user.name="bots live" add -A
git -C "$CONSUMER" -c user.email=bots-live@example.invalid -c user.name="bots live" commit -q -m "test(bots): add the rollback probe consumer" -m "A scratch consumer for one hand rollback."
log "--- install held disabled"
run bots schedule install "$BOT" || { log "FAIL: install"; exit 1; }
LABEL="$(sed -n 's/^bots: installed \([^ ,]*\) at .*/\1/p' "$RESULT" | tail -1)"
[ -n "$LABEL" ] || { log "FAIL: no label"; exit 1; }
REC="$(ls "$STATE"/*/installs/"$BOT".json)"
log "label: $LABEL"; log "job file: $(ls "$HOME/Library/LaunchAgents/$LABEL.plist")"; log "install record: $REC"
log "--- plan.md rollback, by hand"
run launchctl disable "$DOMAIN/$LABEL"
log "\$ launchctl bootout $DOMAIN/$LABEL"; launchctl bootout "$DOMAIN/$LABEL" >>"$RESULT" 2>&1; log "exit=$? (non-zero expected: a held job is not loaded)"
run rm "$HOME/Library/LaunchAgents/$LABEL.plist"
run rm "$REC"
log "--- after"
launchctl print "$DOMAIN/$LABEL" >/dev/null 2>&1; log "print: exit=$? (expect non-zero)"
log "ls LA | grep -c 'com.skilled.bots.': $(ls "$HOME/Library/LaunchAgents" | grep -c 'com.skilled.bots.') (expect 0)"
log "install records left: $(ls "$STATE"/*/installs/ 2>/dev/null | wc -l | tr -d ' ') (expect 0)"
log "scratch: $SCRATCH"
log "DONE"
