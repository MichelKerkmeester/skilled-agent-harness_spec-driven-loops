#!/usr/bin/env bash
# Two live hops through the real wrapper on OpenCode 2 with NO PATH shim, in a private tmux
# server and a private runtime directory. The wrapper itself must add --standalone to the
# first launch and to the relaunch, or the second hop never arms.
# Usage: run-two-hop.sh <sandbox> <out-dir> <worktree>
set -u
sb="$1"; out="$2"; worktree="$3"
here="$(cd "$(dirname "$0")" && pwd)"
build="$worktree/specs/hooks/023-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/build-sandbox.sh"
mkdir -p "$out"
export XDG_RUNTIME_DIR="$out/run"; mkdir -p "$XDG_RUNTIME_DIR"; chmod 700 "$XDG_RUNTIME_DIR"
sock="ev032-two-hop"
session_name="hop-opencode-two"
tm() { command tmux -L "$sock" "$@"; }
say() { tm send-keys -t "$session_name" -l "$1"; sleep 0.7; tm send-keys -t "$session_name" Enter; }
screen() { tm capture-pane -p -S -500 -t "$session_name"; }
log() { echo "$(date -u +%FT%TZ) $*" | tee -a "$out/summary.txt"; }
cleanup() { tm kill-server 2>/dev/null; }
trap cleanup EXIT
: > "$out/summary.txt"

bash "$build" opencode "$sb" 3990 "$worktree" > "$out/build.txt" 2>&1 || { log "sandbox build failed"; exit 9; }
real_opencode="$(command -v opencode)"
log "opencode: $real_opencode $("$real_opencode" --version 2>&1 | head -1); PATH shim: none"
cd "$sb" || exit 9

clean_prefix='unset_args=(); for v in $(env | sed -n -E "s/^((CLAUDE|ORCA_|SKILLED_LOOP_|SESSION_RELAUNCH_GOAL|AI_SESSION_CHILD|AI_AGENT|CODEX_|OPENCODE_|HERMES_|TMUX)[A-Za-z0-9_]*)=.*/\1/p"); do unset_args+=(-u "$v"); done'
cat > "$out/launch.sh" <<LAUNCH
#!/usr/bin/env bash
cd '$sb'
$clean_prefix
exec env "\${unset_args[@]}" XDG_RUNTIME_DIR='$XDG_RUNTIME_DIR' SESSION_RELAUNCH_MAX_HOPS=2 bash .skilled/bin/skilled-loop opencode
LAUNCH
chmod +x "$out/launch.sh"
tm new-session -d -x 200 -y 50 -s "$session_name" "bash '$out/launch.sh'"
tm set-option -w -t "$session_name" remain-on-exit on
log "sender launched"

wait_ready() {
  for _ in $(seq 1 45); do
    sleep 2
    s="$(screen)"
    if printf '%s' "$s" | grep -qiE "trust this folder|Yes, I trust|Do you trust"; then tm send-keys -t "$session_name" Enter; sleep 2; fi
    printf '%s' "$s" | grep -qiE "Ask anything|gpt-6-luna|tab agents" && { echo yes; return; }
  done
  echo no
}
newest_session() {
  ( cd "$sb" && "$real_opencode" session list --standalone --format json 2>/dev/null </dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const a=JSON.parse(s);console.log((Array.isArray(a)?a:a.sessions||[])[0]?.id||"")}catch{console.log("")}})' )
}
snapshot_processes() {
  ps -axo pid,ppid,command | grep -E "skilled-loop|opencode" | grep -v grep | grep -F "$sb" > "$out/processes-$1.txt" 2>&1
  ps -axo pid,ppid,command | grep -E "[o]pencode" | grep -E -e "--standalone|--prompt" | cut -c1-260 >> "$out/processes-$1.txt" 2>&1
}
prepare_note() {
  local label="$1" session_id="$2" hops="$3" marker="$4"
  local note="$sb/.skilled/skills/.state/session-relaunch/handoffs/note-$label.md"
  mkdir -p "$(dirname "$note")"
  cat > "$note" <<NOTE
---
status: open
session_id: $session_id
loop_id: $pane_pid
runtime: opencode
cwd: $sb
spec_folder: none
created_at: $(date -u +%FT%TZ)
---
## Goal
Keep the pong keeper running.
## Done
The previous session answered once.
## Remaining work
Write the single word $marker into the file $marker.marker with a shell command. Then reply with the single word PONG.
## In-flight state
Nothing is running.
NOTE
  ( cd "$sb" && env -u CLAUDECODE -u CLAUDE_CODE_SESSION_ID -u SKILLED_LOOP_MANUAL_TEMPLATE SKILLED_LOOP_RUNTIME=opencode SKILLED_LOOP_HOPS="$hops" SKILLED_LOOP_ID="$pane_pid" node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs prepare --handoff "$note" --session "$session_id" --runtime opencode ) > "$out/prepare-$label.txt" 2>&1
  log "prepare $label exit=$? ; $(head -c 200 "$out/prepare-$label.txt")"
  NOTE_PATH="$note"
}
await_claim() {
  local note="$1" marker="$2"
  for _ in $(seq 1 150); do
    sleep 3
    if grep -qE '^status: (claimed|done)' "$note" && [ -f "$sb/$marker.marker" ]; then break; fi
  done
  sleep 20
  log "$marker: note $(grep -E '^status:' "$note"); marker $(cat "$sb/$marker.marker" 2>/dev/null || echo '<absent>')"
}

ready=$(wait_ready); log "sender ready=$ready"
sleep 4
snapshot_processes sender
say "Reply with the single word PONG."; sleep 25
screen > "$out/pane-sender.txt"
pane_pid=$(tm list-panes -t "$session_name" -F '#{pane_pid}' | head -1)
log "wrapper pid (loop id): $pane_pid"

sender_id=$(newest_session); log "sender session: $sender_id"
[ -z "$sender_id" ] && { log "no sender session id; stopping"; exit 4; }
prepare_note hop1 "$sender_id" 0 HOP1; note1="$NOTE_PATH"
say "Reply with the single word PONG again."
await_claim "$note1" HOP1
screen > "$out/pane-receiver1.txt"
snapshot_processes receiver1

ready=$(wait_ready); log "receiver 1 ready=$ready"
receiver_id=$(newest_session); log "receiver 1 session: $receiver_id"
if [ -z "$receiver_id" ] || [ "$receiver_id" = "$sender_id" ]; then log "no distinct receiver session; stopping"; exit 5; fi
prepare_note hop2 "$receiver_id" 1 HOP2; note2="$NOTE_PATH"
say "Reply with the single word PONG once more."
await_claim "$note2" HOP2
screen > "$out/pane-receiver2.txt"
snapshot_processes receiver2

cp "$note1" "$out/note1-final.md"; cp "$note2" "$out/note2-final.md"
cp "$XDG_RUNTIME_DIR/skilled-relaunch/relaunch.log" "$out/relaunch.log" 2>/dev/null
( cd "$sb" && node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs history --last 6 ) > "$out/history.txt" 2>&1
log "done"
