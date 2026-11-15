#!/usr/bin/env bash
# One live Hermes hop that checks the receiver starts on the model and provider the sender was
# using when it armed, not the launch flags. The sender launches on copilot gpt-4.1 at reasoning
# low and switches to gpt-5.4-nano with /model inside the session. The harness writes the note
# and runs prepare itself, as the two-hop OpenCode harness does, so a weak sender model cannot
# skip the hand-over; the plugin still supplies the live model when the next turn ends and arms.
# The /model switch saves the new default to ~/.hermes/config.yaml, so that file is copied first
# and put back on exit. Private tmux server and private runtime directory.
# Usage: run-hermes-effort.sh <repo-root> <out-dir>
set -u
repo_root="$1"; out="$2"
mkdir -p "$out"
export XDG_RUNTIME_DIR="$out/run"; mkdir -p "$XDG_RUNTIME_DIR"; chmod 700 "$XDG_RUNTIME_DIR"
state="$XDG_RUNTIME_DIR/skilled-relaunch"
sock="ev031-hermes"
tm() { command tmux -L "$sock" "$@"; }
cli() { node "$repo_root/.skilled/hooks/session-relaunch/bin/session-relaunch.cjs" "$@"; }
session_name="hermes-h"
say() { tm send-keys -t "$session_name" -l "$1"; sleep 0.5; tm send-keys -t "$session_name" Enter; }
screen() { tm capture-pane -p -S -300 -t "$session_name"; }
wait_for_record() {
  local pattern="$1" file="" tries=0
  while [ -z "$file" ] && [ "$tries" -lt "${2:-1800}" ]; do
    file=$(find "$state" -maxdepth 1 -name 'relaunch-*.json' -exec grep -lE "\"status\":\"($pattern)\"" {} + 2>/dev/null | head -1)
    [ -n "$file" ] || { sleep 0.1; tries=$((tries + 1)); }
  done
  [ -n "$file" ] || return 1
  file=${file##*/relaunch-}; echo "${file%.json}"
}
newest_session() {
  hermes sessions list --source cli --workspace "$(basename "$repo_root")" --limit 1 </dev/null 2>/dev/null \
    | grep -oE '[0-9]{8}_[0-9]{6}_[0-9a-f]+' | head -1
}
log() { echo "$(date -u +%FT%TZ) $*" | tee -a "$out/summary.txt"; }
config="$HOME/.hermes/config.yaml"
cp -p "$config" "$out/config.yaml.before"
cleanup() {
  tm kill-server 2>/dev/null
  cp -p "$out/config.yaml.before" "$config" && rm -f "$out/config.yaml.before"
}
trap cleanup EXIT
: > "$out/summary.txt"
rm -f "$out/RECEIVER.marker"
clean_prefix='unset_args=(); for v in $(env | sed -n -E "s/^((CLAUDE|ORCA_|SKILLED_LOOP_|SESSION_RELAUNCH_GOAL|AI_SESSION_CHILD|AI_AGENT|CODEX_|OPENCODE_|HERMES_|TMUX)[A-Za-z0-9_]*)=.*/\1/p"); do unset_args+=(-u "$v"); done'
cat > "$out/launch.sh" <<LAUNCH
#!/usr/bin/env bash
cd '$repo_root'
$clean_prefix
exec env "\${unset_args[@]}" HERMES_ENABLE_PROJECT_PLUGINS=1 XDG_RUNTIME_DIR='$XDG_RUNTIME_DIR' SESSION_RELAUNCH_MAX_HOPS=1 bash .skilled/bin/skilled-loop hermes chat --provider copilot -m gpt-4.1 --reasoning low --yolo
LAUNCH
chmod +x "$out/launch.sh"
tm new-session -d -x 200 -y 50 -s "$session_name" "bash '$out/launch.sh'"
tm set-option -w -t "$session_name" remain-on-exit on
ready=no
for _ in $(seq 1 30); do
  sleep 2
  if screen | grep -qE "gpt-4\.1|❯"; then ready=yes; break; fi
done
sleep 3
screen > "$out/pane-sender-start.txt"
log "sender ready=$ready"
pane_pid=$(tm list-panes -t "$session_name" -F '#{pane_pid}' | head -1)
log "wrapper pid (loop id): $pane_pid"
say "/model gpt-5.4-nano --provider copilot"
sleep 6
say "Reply with the single word PONG."
sleep 25
screen > "$out/pane-sender-switch.txt"
sender_id=$(newest_session); log "sender session: $sender_id"
[ -z "$sender_id" ] && { log "no sender session id; stopping"; exit 4; }
note="$repo_root/.skilled/skills/.state/session-relaunch/handoffs/ev031-hermes-$sender_id.md"
mkdir -p "$(dirname "$note")"
cat > "$note" <<NOTE
---
status: open
session_id: $sender_id
loop_id: $pane_pid
runtime: hermes
cwd: $repo_root
spec_folder: none
created_at: $(date -u +%FT%TZ)
---
## Goal
Prove the receiver picked up this hand-over.
## Done
The previous session answered once.
## Remaining work
Write the single word RECEIVED into the file $out/RECEIVER.marker with a shell command. Then reply with the single word DONE.
## In-flight state
Nothing is running.
NOTE
( cd "$repo_root" && env -u CLAUDECODE -u CLAUDE_CODE_SESSION_ID -u SKILLED_LOOP_MANUAL_TEMPLATE SKILLED_LOOP_RUNTIME=hermes SKILLED_LOOP_HOPS=0 SKILLED_LOOP_ID="$pane_pid" XDG_RUNTIME_DIR="$XDG_RUNTIME_DIR" node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs prepare --handoff "$note" --session "$sender_id" --runtime hermes ) > "$out/prepare.txt" 2>&1
log "prepare exit=$? ; $(head -c 200 "$out/prepare.txt")"
t1=$(date +%s)
say "Reply with the single word PONG again."
loop_id=$(wait_for_record armed 1200) || { log "RESULT=NO_ARMED_RECORD"; screen > "$out/pane-final.txt"; cp "$state/relaunch.log" "$out/relaunch.log" 2>/dev/null; exit 3; }
log "armed after $(( $(date +%s) - t1 ))s loop_id=$loop_id"
cp "$state/relaunch-$loop_id.json" "$out/relaunch-record-armed.json" 2>/dev/null
log "record live values: $(node -e 'const r=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));console.log("model="+(r.model||"<none>")+" provider="+(r.provider||"<none>")+" effort="+(r.effort||"<none>"))' "$out/relaunch-record-armed.json" 2>&1)"
: > "$out/processes-receiver.txt"
for _ in $(seq 1 120); do
  sleep 2
  ps -axo pid,ppid,command | grep -E "[h]ermes chat .*-q" | grep -v skilled-loop | cut -c1-300 >> "$out/processes-receiver.txt"
  [ -f "$out/RECEIVER.marker" ] && break
done
log "receiver args: $(grep -oE -- 'hermes chat .* -q' "$out/processes-receiver.txt" | sort -u | tr '\n' ' ')"
sleep 15
screen > "$out/pane-receiver.txt"
receiver_id=$(newest_session); log "receiver session: $receiver_id"
log "RECEIVER.marker: $(cat "$out/RECEIVER.marker" 2>/dev/null || echo '<absent>')"
cp "$state/relaunch.log" "$out/relaunch.log" 2>/dev/null
( cd "$repo_root" && XDG_RUNTIME_DIR="$XDG_RUNTIME_DIR" node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs history --last 3 ) > "$out/history.txt" 2>&1
log "note: $(grep -E '^(status|runtime):' "$note" 2>/dev/null | tr '\n' ' ')"
cp "$note" "$out/note-final.md"
log "done"
