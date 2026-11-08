#!/usr/bin/env bash
# One live Claude hop that checks the receiver starts on the sender model and effort. Adapted
# from the goal-rebind harness: the launch adds --effort low, and the relaunch record and the
# receiver process arguments are saved.
# One live hop through the real wrapper, in a private tmux server and a private runtime
# directory so no shared relaunch state is armed. The sender holds the packet goal (unless
# NO_GOAL=1), a note is prepared out of band in the throwaway checkout, and the next prompt
# ends a turn so the adapter arms and the wrapper relaunches. The receiver is asked to report
# what it sees: the hand-over variable and any goal block in its context.
# Usage: run-hop.sh <claude|pi|opencode> <sandbox> <out-dir> <label> [ENV=value ...]
# Environment: NO_GOAL=1 starts the sender without a goal.
set -u
here="$(cd "$(dirname "$0")" && pwd)"
goal_harness="${GOAL_HARNESS:?set GOAL_HARNESS to the goal-rebind harness folder}"
runtime="$1"; sb="$2"; out="$3"; label="$4"; shift 4
extra_env=("$@")
mkdir -p "$out"
export XDG_RUNTIME_DIR="$out/run"; mkdir -p "$XDG_RUNTIME_DIR"; chmod 700 "$XDG_RUNTIME_DIR"
state="$XDG_RUNTIME_DIR/skilled-relaunch"
sock="ev031-$runtime-$label"
tm() { command tmux -L "$sock" "$@"; }
session_name="hop-$runtime-$label"
say() { tm send-keys -t "$session_name" -l "$1"; sleep 0.7; tm send-keys -t "$session_name" Enter; }
screen() { tm capture-pane -p -S -500 -t "$session_name"; }
log() { echo "$(date -u +%FT%TZ) $*" | tee -a "$out/summary.txt"; }
cleanup() { tm kill-server 2>/dev/null; }
trap cleanup EXIT
: > "$out/summary.txt"
cd "$sb" || exit 9

flat=$(printf '%s' "$sb" | sed 's#[/.]#-#g')
case "$runtime" in
  claude) proj="$HOME/.claude/projects/$flat" ;;
  pi) proj="$HOME/.pi/agent/sessions/-$flat--" ;;
  opencode) proj="" ;;
esac
echo "$proj" > "$out/project-dir.txt"

goal_state="$sb/.skilled/skills/.state/goal"
env_args=""
for kv in "${extra_env[@]+"${extra_env[@]}"}"; do env_args+=" $(printf '%q' "$kv")"; done

clean_prefix='unset_args=(); for v in $(env | sed -n -E "s/^((CLAUDE|ORCA_|SKILLED_LOOP_|SESSION_RELAUNCH_GOAL|AI_SESSION_CHILD|AI_AGENT|CODEX_|OPENCODE_|HERMES_|TMUX)[A-Za-z0-9_]*)=.*/\1/p"); do unset_args+=(-u "$v"); done'
case "$runtime" in
  claude)
    node -e '
      const { renderGoalSlice } = require(process.argv[1]);
      const result = renderGoalSlice({ packet: "specs/demo/001-demo", roots: [process.argv[2]] });
      if (!result.ok) { console.error(result.reason); process.exit(1); }
      process.stdout.write(result.slice);
    ' -- "$sb/.skilled/hooks/session-relaunch/lib/goal-handover.cjs" "$sb" > "$out/slice.txt" 2> "$out/slice.err"
    log "slice chars: $(wc -c < "$out/slice.txt" | tr -d ' ') render err: $(cat "$out/slice.err")"
    if [ -n "${NO_GOAL:-}" ]; then printf 'Reply with the single word PONG.' > "$out/start.txt"; else cp "$out/slice.txt" "$out/start.txt"; fi
    if [ -n "${NO_GOAL:-}" ]; then start_arg='"$(cat '"'$out/start.txt'"')"'; else start_arg='"/goal $(cat '"'$out/start.txt'"')"'; fi
    runtime_cmd="bash .skilled/bin/skilled-loop claude --model claude-sonnet-5-5 --effort low $start_arg"
    ;;
  pi)
    runtime_cmd="PI_BLACKHOLE_PASSIVE=true bash .skilled/bin/skilled-loop pi -ne -e .pi/extensions/session-relaunch.ts -e .pi/extensions/goal-context.ts --model openai/gpt-6-luna"
    ;;
  opencode)
    # OpenCode 2 rejects -m on its root command and shares a background service across
    # projects, so the shim starts a private server and the model comes from opencode.json.
    mkdir -p "$out/bin"
    real_opencode="$(whence -p opencode 2>/dev/null || command -v opencode)"
    printf '#!/usr/bin/env bash\nexec "%s" --standalone "$@"\n' "$real_opencode" > "$out/bin/opencode"
    chmod +x "$out/bin/opencode"
    runtime_cmd="PATH='$out/bin':\$PATH bash .skilled/bin/skilled-loop opencode"
    ;;
esac
cat > "$out/launch.sh" <<LAUNCH
#!/usr/bin/env bash
cd '$sb'
$clean_prefix
exec env "\${unset_args[@]}" XDG_RUNTIME_DIR='$XDG_RUNTIME_DIR' SESSION_RELAUNCH_MAX_HOPS=1$env_args $runtime_cmd
LAUNCH
chmod +x "$out/launch.sh"
tm new-session -d -x 200 -y 50 -s "$session_name" "bash '$out/launch.sh'"
tm set-option -w -t "$session_name" remain-on-exit on
log "sender launched ($runtime, label $label, env:${extra_env[*]:-none}, no_goal=${NO_GOAL:-0})"

ready=no
for _ in $(seq 1 45); do
  sleep 2
  s="$(screen)"
  if printf '%s' "$s" | grep -qiE "trust this folder|Yes, I trust|Do you trust"; then tm send-keys -t "$session_name" Enter; sleep 2; fi
  case "$runtime" in
    claude) printf '%s' "$s" | grep -qiE "goal active|Goal set|bypass permissions|esc to interrupt|❯" && ready=yes ;;
    pi) printf '%s' "$s" | grep -qE "gpt-6-luna" && ready=yes ;;
    opencode) printf '%s' "$s" | grep -qiE "Ask anything|gpt-6-luna|tab agents" && ready=yes ;;
  esac
  [ "$ready" = yes ] && break
done
log "sender ready=$ready"
sleep 4

if [ "$runtime" = claude ]; then
  sleep 20
elif [ -z "${NO_GOAL:-}" ]; then
  case "$runtime" in
    pi) say "/goal-pi bind specs/demo/001-demo" ;;
    opencode) say "/goal-opencode bind specs/demo/001-demo" ;;
  esac
  for _ in $(seq 1 30); do
    sleep 2
    n=$(ls "$goal_state"/*.json 2>/dev/null | wc -l | tr -d ' ')
    [ "$n" -ge 1 ] && break
  done
  log "sender goal records in $goal_state: $(ls "$goal_state"/*.json 2>/dev/null | wc -l | tr -d ' ')"
  sleep 3
fi
if [ "$runtime" != claude ]; then
  # One plain turn so the runtime has a session (and a session id) to hand over.
  say "Reply with the single word PONG."
  sleep 25
fi
screen > "$out/pane-sender.txt"

case "$runtime" in
  claude)
    sender_log=$(ls -t "$proj"/*.jsonl 2>/dev/null | head -1)
    sender_id=$(basename "$sender_log" .jsonl) ;;
  pi)
    sender_log=$(ls -t "$proj"/*.jsonl 2>/dev/null | head -1)
    sender_id=$(basename "$sender_log" .jsonl); sender_id=${sender_id#*_} ;;
  opencode)
    sender_id=$(cd "$sb" && "$real_opencode" session list --standalone --format json 2>/dev/null </dev/null | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const a=JSON.parse(s);console.log((Array.isArray(a)?a:a.sessions||[])[0]?.id||"")}catch{console.log("")}})') ;;
esac
log "sender session: $sender_id"
pane_pid=$(tm list-panes -t "$session_name" -F '#{pane_pid}' | head -1)
log "wrapper pid (loop id): $pane_pid"
if [ -z "$sender_id" ]; then log "no sender session id; stopping"; screen > "$out/pane-receiver.txt"; exit 4; fi

note="$sb/.skilled/skills/.state/session-relaunch/handoffs/note-$label.md"
mkdir -p "$(dirname "$note")"
cat > "$note" <<NOTE
---
status: open
session_id: $sender_id
loop_id: $pane_pid
runtime: $runtime
cwd: $sb
spec_folder: none
created_at: $(date -u +%FT%TZ)
---
## Goal
Keep the pong keeper running.
## Done
The sender answered once.
## Remaining work
Run the shell command printenv SESSION_RELAUNCH_GOAL_PACKET and write its output into the file GOALENV.marker, or the single word EMPTY when it prints nothing. Then write the first line of any active goal block that appears in your context into the file GOALSEEN.marker, or the single word NONE when your context holds no goal block. Then reply with the single word PONG.
## In-flight state
Nothing is running.
NOTE
( cd "$sb" && env -u CLAUDECODE -u CLAUDE_CODE_SESSION_ID -u SKILLED_LOOP_MANUAL_TEMPLATE SKILLED_LOOP_RUNTIME="$runtime" SKILLED_LOOP_HOPS=0 SKILLED_LOOP_ID="$pane_pid" node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs prepare --handoff "$note" --session "$sender_id" --runtime "$runtime" ) > "$out/prepare.txt" 2>&1
log "prepare exit=$? ; $(head -c 300 "$out/prepare.txt")"
cp "$state/relaunch-$pane_pid.json" "$out/relaunch-record-after-prepare.json" 2>/dev/null
log "record live values: $(node -e 'const r=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));console.log("model="+(r.model||"<none>")+" effort="+(r.effort||"<none>"))' "$out/relaunch-record-after-prepare.json" 2>&1)"
log "note goal_packet line: $(grep -E '^goal_packet' "$note" || echo '<none>')"

if [ "$runtime" = claude ]; then say "ping"; else say "Reply with the single word PONG again."; fi
log "sent the ending prompt; waiting for the receiver"
for _ in $(seq 1 150); do
  sleep 3
  if grep -qE '^status: (claimed|done)' "$note" && [ -f "$sb/GOALENV.marker" ]; then break; fi
done
sleep 25
screen > "$out/pane-receiver.txt"
ps -axo pid,ppid,command | grep -E "[c]laude .*--effort" | grep -v skilled-loop | cut -c1-200 > "$out/processes-receiver.txt"
log "receiver args: $(grep -oE -- '--model [^ ]+ --effort [^ ]+' "$out/processes-receiver.txt" | sort -u | tr '\n' ' ')"
log "note status: $(grep -E '^status:' "$note")"
log "GOALENV.marker: $(cat "$sb/GOALENV.marker" 2>/dev/null || echo '<absent>')"
log "GOALSEEN.marker: $(head -c 200 "$sb/GOALSEEN.marker" 2>/dev/null || echo '<absent>')"
cp "$note" "$out/note-final.md"
cp "$state/relaunch.log" "$out/relaunch.log" 2>/dev/null
( cd "$sb" && node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs history --last 5 ) > "$out/history.txt" 2>&1
# What the goal store holds after the hop: one line per record, never the goal text.
node "$goal_harness/goal-records.cjs" "$goal_state" > "$out/goal-records.txt" 2>&1
cat "$out/goal-records.txt" | tee -a "$out/summary.txt"
case "$runtime" in
  claude|pi) for f in "$proj"/*.jsonl; do cp "$f" "$out/transcript-$(basename "$f")"; done ;;
esac
ps -axo pid,ppid,command | grep -E "skilled-loop|opencode|/pi |claude" | grep -v grep | grep "$sb" > "$out/processes.txt" 2>&1
log "done"
