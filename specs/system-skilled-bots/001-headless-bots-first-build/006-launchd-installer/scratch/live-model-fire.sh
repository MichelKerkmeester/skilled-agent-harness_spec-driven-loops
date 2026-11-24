#!/usr/bin/env bash
# One real model run under launchd: a bot whose executor resolves only through
# the path pinned at install fires once on its schedule, under launchd's bare
# PATH, then is disabled and uninstalled. Spends one small model call.
# Rollback if anything is left: bots schedule uninstall pong, or
#   launchctl disable gui/$(id -u)/<label>; launchctl bootout gui/$(id -u)/<label>; rm ~/Library/LaunchAgents/<label>.plist
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKTREE="$(cd "$HERE/../../../../.." && pwd)"
SKILLED_TREE="${SKILLED_TREE:-/Users/michelkerkmeester/MEGA/Development/Skilled}"
DOMAIN="gui/$(id -u)"
NODE="$(command -v node)"
SCRATCH="$(mktemp -d "${TMPDIR:-/tmp}/bots-model-XXXXXX")"
CONSUMER="$SCRATCH/consumer"; STATE="$SCRATCH/state"
IDENTITY="local/bots-model-probe"; BOT="pong"
RESULT="$HERE/live-model-fire-result.txt"
: > "$RESULT"
log() { printf '%s\n' "$*" | tee -a "$RESULT"; }
run() { log "\$ $*"; "$@" >>"$RESULT" 2>&1; local rc=$?; log "exit=$rc"; return $rc; }
bots() { "$NODE" "$CONSUMER/.skilled/bin/bots.cjs" "$@" --repo "$CONSUMER" --skilled-tree "$SKILLED_TREE"; }
records() { ls -1 "$STATE"/*/records/*.json 2>/dev/null | wc -l | tr -d ' '; }
cleanup() { log "--- cleanup"; bots disable "$BOT" >>"$RESULT" 2>&1; bots schedule uninstall "$BOT" >>"$RESULT" 2>&1; }
trap cleanup EXIT
log "date: $(date -u +%Y-%m-%dT%H:%M:%SZ)  macOS: $(sw_vers -productVersion)  domain: $DOMAIN"
log "shell resolves vibe at: $(/bin/sh -c 'command -v vibe')"
log "launchd PATH resolves vibe: $(env -i PATH=/usr/bin:/bin:/usr/sbin:/sbin /bin/sh -c 'command -v vibe || echo none')"
mkdir -p "$CONSUMER/bots/$BOT"; git -C "$CONSUMER" init -q
ln -s "$WORKTREE/.skilled" "$CONSUMER/.skilled"
printf '{ "identity": "%s", "stateRoot": "%s" }\n' "$IDENTITY" "$STATE" > "$CONSUMER/bots/config.json"
cat > "$CONSUMER/bots/$BOT/BOT.md" <<'MD'
---
id: pong
trigger: {kind: cron, expression: "*/5 * * * *"}
runtime: {kind: cli-mistral-vibe, model: deepseek-flash}
budget: {maxIterations: 1, maxDurationMinutes: 10, timeoutSeconds: 300}
isolation: shared
sandbox: read-only
---
Reply with the single word PONG and nothing else. Do not read, create or change any file, and run no command.
MD
printf '.skilled\n' > "$CONSUMER/.gitignore"
git -C "$CONSUMER" -c user.email=bots-live@example.invalid -c user.name="bots live" add -A
git -C "$CONSUMER" -c user.email=bots-live@example.invalid -c user.name="bots live" commit -q -m "test(bots): add the live model fire consumer" -m "A scratch consumer whose one bot replies PONG."
log "--- install"
run bots schedule install "$BOT" || { log "FAIL: install"; exit 1; }
LABEL="$(sed -n 's/^bots: installed \([^ ,]*\) at .*/\1/p' "$RESULT" | tail -1)"; log "label: $LABEL"
log "install record executor: $("$NODE" -e 'const r=require(process.argv[1]);console.log(JSON.stringify(r.executor))' "$(ls "$STATE"/*/installs/$BOT.json)")"
log "job EnvironmentVariables keys: $(plutil -extract EnvironmentVariables json -o - "$HOME/Library/LaunchAgents/$LABEL.plist")"
log "--- enable"
run bots enable "$BOT" || { log "FAIL: enable"; exit 1; }
log "--- wait for one fire and its record (up to 15 minutes)"
DEADLINE=$(( $(date +%s) + 900 ))
while [ "$(records)" -lt 1 ] && [ "$(date +%s)" -lt "$DEADLINE" ]; do sleep 15; done
FIRED="$(ls -1t "$STATE"/*/records/*.json 2>/dev/null | head -1)"
run bots disable "$BOT"
if [ -z "$FIRED" ]; then log "FAIL: no run record within 15 minutes"; cat "$STATE"/*/agent-logs/*.log >>"$RESULT" 2>&1; exit 1; fi
log "record: $FIRED"
"$NODE" -e '
  const r = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  console.log(JSON.stringify({ source: r.dispatch?.source, firedSlot: r.request?.firedSlot, latenessClass: r.dispatch?.latenessClass, exit: r.exit, executor: r.posture ?? r.executor ?? null }, null, 2));
' "$FIRED" | tee -a "$RESULT"
RUNDIR="$(ls -1dt "$SKILLED_TREE"/.skilled/skills/.state/system-skilled-bots/local%2Fbots-model-probe/runs/* 2>/dev/null | head -1)"
log "run folder: $RUNDIR"
log "stdout.log (first 20 lines):"; head -20 "$RUNDIR/stdout.log" 2>&1 | tee -a "$RESULT"
log "agent log:"; cat "$STATE"/*/agent-logs/*.log >>"$RESULT" 2>&1
log "--- uninstall"
trap - EXIT
run bots schedule uninstall "$BOT"
log "hub job files left for this identity: $(ls "$HOME/Library/LaunchAgents" | grep -c 'bots-model-probe')"
launchctl print "$DOMAIN/$LABEL" >/dev/null 2>&1; log "print after uninstall: exit=$?"
log "scratch: $SCRATCH"
log "DONE"
