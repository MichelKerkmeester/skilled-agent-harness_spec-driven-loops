#!/usr/bin/env bash
# Live launchd check for the bots installer. NOT RUN by the builder: it loads
# real launchd agents into the operator's ~/Library/LaunchAgents and needs the
# operator's yes first.
#
# What it proves, in order:
#   1. A harmless cron bot (every 5 minutes, no day field) installs held
#      disabled: print-disabled lists it, print finds no loaded job, and no run
#      record appears across one scheduled slot. The exit codes of the
#      disable, bootstrap and print steps settle the open probe questions
#      (which domain target the verbs accept, what bootstrap does on a disabled
#      label) and are written to the result file.
#   2. bots enable loads it; launchctl print shows the absolute interpreter.
#   3. One real fire under launchd's bare PATH writes one run record carrying
#      the fired slot (request.firedSlot, dispatch.scheduledAt) and the
#      lateness (dispatch.latenessSeconds, dispatch.latenessClass).
#   4. The drain job, enabled, empties requests/inbox after one enqueue and
#      leaves one run record.
#   5. Uninstall removes both job files and both launchd jobs.
#
# The bot never calls a model: its precheck prints [SILENT], so every fire
# ends refused as precheck-silent before any executor is resolved, and its
# record still carries the slot fields. Under the bare PATH a real executor
# such as codex would not resolve; that is an open question, not tested here.
#
# Usage: bash live-install.sh [--skilled-tree <primary checkout>] [--state-from-xdg]
#   --skilled-tree   the primary checkout whose run root takes the run folders;
#                    otherwise SKILLED_TREE from the environment, otherwise the
#                    operator's primary checkout path written below.
#   --state-from-xdg leave stateRoot out of bots/config.json and export
#                    XDG_STATE_HOME pointing at a scratch folder instead, so the
#                    installed jobs must carry that state home to find their
#                    install record and queue. Run the probe once without the
#                    flag and once with it.
# Rollback if anything is left behind (LABEL from the result file):
#   launchctl disable gui/$(id -u)/<label>; launchctl bootout gui/$(id -u)/<label>
#   rm ~/Library/LaunchAgents/<label>.plist

set -u

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORKTREE="$(cd "$HERE/../../../../.." && pwd)"
SKILLED_TREE="${SKILLED_TREE:-/Users/michelkerkmeester/MEGA/Development/Skilled}"
STATE_FROM_XDG=0
while [ $# -gt 0 ]; do
  case "$1" in
    --skilled-tree) [ -n "${2:-}" ] || { echo "usage: --skilled-tree needs a path" >&2; exit 2; }; SKILLED_TREE="$2"; shift 2 ;;
    --state-from-xdg) STATE_FROM_XDG=1; shift ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done
DOMAIN="gui/$(id -u)"
NODE="$(command -v node)"
SCRATCH="$(mktemp -d "${TMPDIR:-/tmp}/bots-live-XXXXXX")"
CONSUMER="$SCRATCH/consumer"
IDENTITY="local/bots-live-probe"
BOT="tick"
if [ "$STATE_FROM_XDG" = 1 ]; then
  RESULT="$HERE/live-install-result-xdg.txt"
  export XDG_STATE_HOME="$SCRATCH/xdg-state"
  STATE="$XDG_STATE_HOME/system-skilled-bots"
  CONFIG_JSON="{ \"identity\": \"$IDENTITY\" }"
else
  RESULT="$HERE/live-install-result.txt"
  STATE="$SCRATCH/state"
  CONFIG_JSON="{ \"identity\": \"$IDENTITY\", \"stateRoot\": \"$STATE\" }"
fi
# The label prefix of this probe's identity, built the way the label module
# builds it: lower-cased, every byte outside [a-z0-9-] written as _ plus two hex digits.
LABEL_STEM="com.skilled.bots.$("$NODE" -e '
  let slug = "";
  for (const ch of process.argv[1].toLowerCase()) {
    if (/[a-z0-9-]/.test(ch)) { slug += ch; continue; }
    for (const byte of Buffer.from(ch, "utf8")) slug += "_" + byte.toString(16).padStart(2, "0");
  }
  process.stdout.write(slug);
' "$IDENTITY")."
# Count only this identity's job files, never another repository's.
own_jobs() { ls "$HOME/Library/LaunchAgents" 2>/dev/null | grep -cF "$LABEL_STEM"; }

: > "$RESULT"
log() { printf '%s\n' "$*" | tee -a "$RESULT"; }
run() { log "\$ $*"; "$@" >>"$RESULT" 2>&1; local rc=$?; log "exit=$rc"; return $rc; }
bots() { "$NODE" "$CONSUMER/.skilled/bin/bots.cjs" "$@" --repo "$CONSUMER" --skilled-tree "$SKILLED_TREE"; }
records() { ls -1 "$STATE"/*/records/*.json 2>/dev/null | wc -l | tr -d ' '; }

cleanup() {
  log "--- cleanup"
  bots schedule uninstall "$BOT" >>"$RESULT" 2>&1
  bots schedule uninstall drain >>"$RESULT" 2>&1
}
trap cleanup EXIT

log "date: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
log "macOS: $(sw_vers -productVersion) ($(sw_vers -buildVersion))"
log "node: $NODE ($("$NODE" --version))"
log "worktree: $WORKTREE"
log "skilled tree: $SKILLED_TREE"
log "domain: $DOMAIN"
log "state from XDG_STATE_HOME: $STATE_FROM_XDG (state root: $STATE)"

# Preconditions: the Skilled tree must be a primary checkout that ignores run folders.
if ! git -C "$SKILLED_TREE" check-ignore -q .skilled/skills/.state/system-skilled-bots/x/runs/y; then
  log "FAIL: $SKILLED_TREE does not ignore run folders"; exit 1
fi

# A scratch consumer repository: its .skilled links to the worktree's, so the
# real runner path is the worktree's, and --skilled-tree names the primary
# checkout for run folders.
mkdir -p "$CONSUMER/bots/$BOT"
git -C "$CONSUMER" init -q
ln -s "$WORKTREE/.skilled" "$CONSUMER/.skilled"
printf '%s\n' "$CONFIG_JSON" > "$CONSUMER/bots/config.json"
cat > "$CONSUMER/bots/$BOT/BOT.md" <<'MD'
---
id: tick
trigger: {kind: cron, expression: "*/5 * * * *"}
runtime: {kind: cli-codex}
isolation: shared
precheck: "echo '[SILENT] live launchd probe'"
---
Never dispatched: the precheck always prints the silent marker.
MD
printf '.skilled\n' > "$CONSUMER/.gitignore"
git -C "$CONSUMER" -c user.email=bots-live@example.invalid -c user.name="bots live" add -A
git -C "$CONSUMER" -c user.email=bots-live@example.invalid -c user.name="bots live" commit -q \
  -m "test(bots): add the live launchd probe consumer" -m "A scratch consumer whose one bot is held by a silent precheck." \
  || { log "FAIL: the consumer commit was refused"; exit 1; }

log "--- 1. install held disabled"
run bots schedule install "$BOT" || { log "FAIL: install"; exit 1; }
# The label comes from this install's own output, filtered on this probe's identity.
LABEL="$(sed -n 's/^bots: installed \([^ ,]*\) at .*/\1/p' "$RESULT" | grep -F "$LABEL_STEM" | tail -1)"
[ -n "$LABEL" ] || { log "FAIL: no installed label for $IDENTITY in the install output"; exit 1; }
log "label: $LABEL"
if [ "$STATE_FROM_XDG" = 1 ]; then
  log "job EnvironmentVariables: $(plutil -extract EnvironmentVariables.XDG_STATE_HOME raw -o - "$HOME/Library/LaunchAgents/$LABEL.plist" 2>&1) (expect $XDG_STATE_HOME)"
  log "install record under the XDG state root: $(ls "$STATE"/*/installs/"$BOT".json 2>/dev/null)"
fi
log "print-disabled line: $(launchctl print-disabled "$DOMAIN" | grep -F "\"$LABEL\"")"
launchctl print "$DOMAIN/$LABEL" >/dev/null 2>&1; log "print while held: exit=$? (non-zero means not loaded)"
log "record count before the held slot: $(records)"
# Wait past the next 5-minute slot plus a margin, then confirm nothing ran.
NOW=$(date +%s); NEXT=$(( (NOW / 300 + 1) * 300 + 45 )); log "waiting until $(date -r $NEXT +%H:%M:%S) for one held slot"
sleep $(( NEXT - NOW ))
HELD_COUNT="$(records)"; log "record count after the held slot: $HELD_COUNT (expect 0)"

log "--- 2. enable"
run bots enable "$BOT" || { log "FAIL: enable"; exit 1; }
log "print-disabled line: $(launchctl print-disabled "$DOMAIN" | grep -F "\"$LABEL\"")"
launchctl print "$DOMAIN/$LABEL" > "$SCRATCH/print.txt" 2>&1; log "print after enable: exit=$?"
grep -E 'program|arguments|^\s+/' "$SCRATCH/print.txt" | head -15 | tee -a "$RESULT"

log "--- 3. wait for one fire"
DEADLINE=$(( $(date +%s) + 420 ))
while [ "$(records)" -lt 1 ] && [ "$(date +%s)" -lt "$DEADLINE" ]; do sleep 10; done
FIRED="$(ls -1t "$STATE"/*/records/*.json 2>/dev/null | head -1)"
if [ -z "$FIRED" ]; then log "FAIL: no run record within 7 minutes"; log "agent log:"; cat "$STATE"/*/agent-logs/*.log >>"$RESULT" 2>&1; exit 1; fi
log "record: $FIRED"
# The fired job resolved its identity and state root under launchd's environment, the install under the shell's.
FIRED_IDENTITY_DIR="$(dirname "$(dirname "$FIRED")")"
INSTALL_IDENTITY_DIR="$(dirname "$(dirname "$(ls -1 "$STATE"/*/installs/"$BOT".json 2>/dev/null | head -1)")")"
log "fired record identity folder: $FIRED_IDENTITY_DIR"
log "install record identity folder: $INSTALL_IDENTITY_DIR (expect equal)"
"$NODE" -e '
  const r = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"));
  console.log(JSON.stringify({ firedSlot: r.request.firedSlot, source: r.dispatch.source, scheduledAt: r.dispatch.scheduledAt,
    dispatchedAt: r.dispatch.dispatchedAt, latenessSeconds: r.dispatch.latenessSeconds, latenessClass: r.dispatch.latenessClass,
    skippedSlots: r.dispatch.skippedSlots, exit: r.exit }, null, 2));
' "$FIRED" | tee -a "$RESULT"
log "agent log:"; cat "$STATE"/*/agent-logs/*.log >>"$RESULT" 2>&1
# Stop further fires of the bot before the drain section adds records.
run bots disable "$BOT"

log "--- 4. drain job"
run bots schedule install drain || { log "FAIL: drain install"; exit 1; }
run bots enable drain || { log "FAIL: drain enable"; exit 1; }
BEFORE="$(records)"
run "$NODE" "$CONSUMER/.skilled/bin/bots.cjs" enqueue "$BOT" --source live-probe --event-id "evt-$(date +%s)" --repo "$CONSUMER"
INBOX="$(ls -d "$STATE"/*/requests/inbox)"
DEADLINE=$(( $(date +%s) + 180 ))
while [ -n "$(ls -A "$INBOX")" ] && [ "$(date +%s)" -lt "$DEADLINE" ]; do sleep 5; done
log "ls -A $INBOX: [$(ls -A "$INBOX")] (expect empty)"
log "records before $BEFORE, after $(records) (expect one more)"
log "quarantine: $(ls -A "$STATE"/*/requests/quarantine 2>/dev/null)"

log "--- 5. uninstall"
trap - EXIT
run bots schedule uninstall "$BOT"
run bots schedule uninstall drain
log "job files left for $IDENTITY: $(own_jobs) (expect 0)"
launchctl print "$DOMAIN/$LABEL" >/dev/null 2>&1; log "print bot label after uninstall: exit=$? (expect non-zero)"
DRAIN_LABEL="${LABEL%.tick.0}.drain"
launchctl print "$DOMAIN/$DRAIN_LABEL" >/dev/null 2>&1; log "print drain label after uninstall: exit=$? (expect non-zero)"
log "run folders kept: $(ls -d "$SKILLED_TREE"/.skilled/skills/.state/system-skilled-bots/*/runs 2>/dev/null)"
if [ "$STATE_FROM_XDG" = 1 ]; then
  log "records under the default state root for $IDENTITY: $(ls -1 "$HOME/.local/state/system-skilled-bots/$("$NODE" -e 'process.stdout.write(encodeURIComponent(process.argv[1].toLowerCase()))' "$IDENTITY")/records" 2>/dev/null | wc -l | tr -d ' ') (expect 0)"
fi
log "scratch left for inspection: $SCRATCH"
log "DONE"
