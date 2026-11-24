#!/usr/bin/env bash
# One real queued model run under launchd: a bot with no schedule, only
# approved by bots enable, is run by the drain job after one enqueue. Its
# executor resolves only through the paths the drain job pinned at install.
# Spends one small model call.
# Rollback if anything is left: bots schedule uninstall drain, or
#   launchctl disable gui/$(id -u)/<label>; launchctl bootout gui/$(id -u)/<label>; rm ~/Library/LaunchAgents/<label>.plist
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKTREE="$(cd "$HERE/../../../../.." && pwd)"
SKILLED_TREE="${SKILLED_TREE:-/Users/michelkerkmeester/MEGA/Development/Skilled}"
DOMAIN="gui/$(id -u)"
NODE="$(command -v node)"
SCRATCH="$(mktemp -d "${TMPDIR:-/tmp}/bots-drain-XXXXXX")"
CONSUMER="$SCRATCH/consumer"; STATE="$SCRATCH/state"
IDENTITY="local/bots-drain-probe"; BOT="pong"
RESULT="$HERE/live-drain-fire-result.txt"
: > "$RESULT"
log() { printf '%s\n' "$*" | tee -a "$RESULT"; }
run() { log "\$ $*"; "$@" >>"$RESULT" 2>&1; local rc=$?; log "exit=$rc"; return $rc; }
bots() { "$NODE" "$CONSUMER/.skilled/bin/bots.cjs" "$@" --repo "$CONSUMER" --skilled-tree "$SKILLED_TREE"; }
records() { ls -1 "$STATE"/*/records/*.json 2>/dev/null | wc -l | tr -d ' '; }
cleanup() { log "--- cleanup"; bots schedule uninstall drain >>"$RESULT" 2>&1; }
trap cleanup EXIT
log "date: $(date -u +%Y-%m-%dT%H:%M:%SZ)  macOS: $(sw_vers -productVersion)  domain: $DOMAIN"
log "launchd PATH resolves vibe: $(env -i PATH=/usr/bin:/bin:/usr/sbin:/sbin /bin/sh -c 'command -v vibe || echo none')"
mkdir -p "$CONSUMER/bots/$BOT"; git -C "$CONSUMER" init -q
ln -s "$WORKTREE/.skilled" "$CONSUMER/.skilled"
printf '{ "identity": "%s", "stateRoot": "%s" }\n' "$IDENTITY" "$STATE" > "$CONSUMER/bots/config.json"
cat > "$CONSUMER/bots/$BOT/BOT.md" <<'MD'
---
id: pong
trigger: {kind: manual}
runtime: {kind: cli-mistral-vibe, model: deepseek-flash}
budget: {maxIterations: 1, maxDurationMinutes: 10, timeoutSeconds: 300}
isolation: shared
sandbox: read-only
---
Reply with the single word PONG and nothing else. Do not read, create or change any file, and run no command.
MD
printf '.skilled\n' > "$CONSUMER/.gitignore"
git -C "$CONSUMER" -c user.email=bots-live@example.invalid -c user.name="bots live" add -A
git -C "$CONSUMER" -c user.email=bots-live@example.invalid -c user.name="bots live" commit -q -m "test(bots): add the live drain fire consumer" -m "A scratch consumer whose one manual bot replies PONG."
log "--- approve the bot, no schedule"
run bots enable "$BOT" || { log "FAIL: enable bot"; exit 1; }
log "bot install record present: $(ls "$STATE"/*/installs/$BOT.json 2>/dev/null || echo none)"
log "--- install and enable the drain job"
run bots schedule install drain || { log "FAIL: drain install"; exit 1; }
REC="$(ls "$STATE"/*/installs/drain.json)"
log "drain record executors: $("$NODE" -e 'console.log(JSON.stringify(require(process.argv[1]).executors))' "$REC")"
LABEL="$(sed -n 's/^bots: installed \([^ ,]*\) at .*/\1/p' "$RESULT" | tail -1)"; log "label: $LABEL"
log "job EnvironmentVariables: $(plutil -extract EnvironmentVariables json -o - "$HOME/Library/LaunchAgents/$LABEL.plist")"
run bots enable drain || { log "FAIL: drain enable"; exit 1; }
log "--- enqueue one request"
run "$NODE" "$CONSUMER/.skilled/bin/bots.cjs" enqueue "$BOT" --source live-probe --event-id "evt-$(date +%s)" --repo "$CONSUMER"
INBOX="$(ls -d "$STATE"/*/requests/inbox)"
DEADLINE=$(( $(date +%s) + 600 ))
while { [ -n "$(ls -A "$INBOX")" ] || [ "$(records)" -lt 1 ]; } && [ "$(date +%s)" -lt "$DEADLINE" ]; do sleep 10; done
log "inbox after: [$(ls -A "$INBOX")] (expect empty)"
log "done: $(ls -A "$STATE"/*/requests/done 2>/dev/null)"
log "quarantine: $(ls -A "$STATE"/*/requests/quarantine 2>/dev/null)"
FIRED="$(ls -1t "$STATE"/*/records/*.json 2>/dev/null | head -1)"
if [ -z "$FIRED" ]; then log "FAIL: no run record within 10 minutes"; cat "$STATE"/*/agent-logs/*.log >>"$RESULT" 2>&1; exit 1; fi
log "record: $FIRED"
"$NODE" -e '
  const r = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  console.log(JSON.stringify({ source: r.dispatch?.source, requestKind: r.request?.kind, exit: r.exit, executor: r.posture ?? null }, null, 2));
' "$FIRED" | tee -a "$RESULT"
RUNDIR="$(ls -1dt "$SKILLED_TREE"/.skilled/skills/.state/system-skilled-bots/local%2Fbots-drain-probe/runs/* 2>/dev/null | head -1)"
log "run folder: $RUNDIR"
log "stdout.log (first 20 lines):"; head -20 "$RUNDIR/stdout.log" 2>&1 | tee -a "$RESULT"
log "agent log:"; cat "$STATE"/*/agent-logs/*.log >>"$RESULT" 2>&1
log "--- uninstall"
trap - EXIT
run bots schedule uninstall drain
log "hub job files left for this identity: $(ls "$HOME/Library/LaunchAgents" | grep -c 'bots-drain-probe')"
launchctl print "$DOMAIN/$LABEL" >/dev/null 2>&1; log "print after uninstall: exit=$?"
log "scratch: $SCRATCH"
log "DONE"
