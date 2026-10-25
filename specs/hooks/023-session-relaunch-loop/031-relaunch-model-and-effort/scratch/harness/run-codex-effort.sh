#!/usr/bin/env bash
# One live Codex hop that checks the receiver starts on the sender model and effort, adapted
# from the goal-rebind harness: the launch adds -c model_reasoning_effort="low", and the
# relaunch record and the receiver process arguments are saved.
# One live Codex hop in this checkout (Codex senders write no goal packet, so this is the no-goal
# control and the only Codex run there is). Private tmux server and private runtime directory.
# The sender is asked to write the note itself and to make the receiver report its hand-over
# variable into a file outside the repository. Usage: run-codex.sh <repo-root> <out-dir>
set -u
repo_root="$1"; out="$2"
mkdir -p "$out"
export XDG_RUNTIME_DIR="$out/run"; mkdir -p "$XDG_RUNTIME_DIR"; chmod 700 "$XDG_RUNTIME_DIR"
state="$XDG_RUNTIME_DIR/skilled-relaunch"
sock="ev031-codex"
tm() { command tmux -L "$sock" "$@"; }
cli() { node "$repo_root/.skilled/hooks/session-relaunch/bin/session-relaunch.cjs" "$@"; }
session_name="codex-c"
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
log() { echo "$(date -u +%FT%TZ) $*" | tee -a "$out/summary.txt"; }
cleanup() { tm kill-server 2>/dev/null; }
trap cleanup EXIT
: > "$out/summary.txt"
rm -f "$out/GOALENV.marker"
clean_prefix='unset_args=(); for v in $(env | sed -n -E "s/^((CLAUDE|ORCA_|SKILLED_LOOP_|SESSION_RELAUNCH_GOAL|AI_SESSION_CHILD|AI_AGENT|CODEX_|OPENCODE_|HERMES_|TMUX)[A-Za-z0-9_]*)=.*/\1/p"); do unset_args+=(-u "$v"); done'
cat > "$out/launch.sh" <<LAUNCH
#!/usr/bin/env bash
cd '$repo_root'
$clean_prefix
exec env "\${unset_args[@]}" XDG_RUNTIME_DIR='$XDG_RUNTIME_DIR' SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1 bash .skilled/bin/skilled-loop codex -m gpt-6-luna -c 'model_reasoning_effort="low"' --sandbox danger-full-access
LAUNCH
chmod +x "$out/launch.sh"
tm new-session -d -x 200 -y 50 -s "$session_name" "bash '$out/launch.sh'"
tm set-option -w -t "$session_name" remain-on-exit on
ready=no
for _ in $(seq 1 30); do
  sleep 2
  s="$(screen)"
  if printf '%s' "$s" | grep -qiE "do you trust|trust the contents|allow codex to work"; then tm send-keys -t "$session_name" Enter; sleep 2; continue; fi
  if printf '%s' "$s" | grep -qE "^\s*›|Ask Codex|context left|gpt-6"; then ready=yes; break; fi
done
log "sender ready=$ready"
t1=$(date +%s)
say "Gate 3 is answered: D) Skip. Run the shell command 'echo probe'. When the [session-relaunch] instructions arrive, follow them. The operator requires the hand-over now, so do not finish the remaining work yourself and do not skip the note: write the note with spec_folder none and this single sentence as its Remaining work: run the shell command printenv SESSION_RELAUNCH_GOAL_PACKET and write its output, or the single word EMPTY when it prints nothing, into the file $out/GOALENV.marker, then reply DONE. Then run prepare and end your turn. Do not create GOALENV.marker in this session."
loop_id=$(wait_for_record armed 3000) || { log "RESULT=NO_ARMED_RECORD"; screen > "$out/pane-final.txt"; cp "$state/relaunch.log" "$out/relaunch.log" 2>/dev/null; exit 3; }
log "armed after $(( $(date +%s) - t1 ))s loop_id=$loop_id"
cp "$state/relaunch-$loop_id.json" "$out/relaunch-record-armed.json" 2>/dev/null
log "record live values: $(node -e 'const r=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));console.log("model="+(r.model||"<none>")+" effort="+(r.effort||"<none>"))' "$out/relaunch-record-armed.json" 2>&1)"
for _ in $(seq 1 120); do
  sleep 3
  [ -f "$out/GOALENV.marker" ] && break
done
ps -axo pid,ppid,command | grep -E "[c]odex .*model_reasoning_effort" | grep -v skilled-loop | cut -c1-220 > "$out/processes-receiver.txt"
log "receiver args: $(grep -oE -- '-m [^ ]+ -c model_reasoning_effort=[^ ]+' "$out/processes-receiver.txt" | sort -u | tr '\n' ' ')"
sleep 20
screen > "$out/pane-receiver.txt"
log "GOALENV.marker: $(cat "$out/GOALENV.marker" 2>/dev/null || echo '<absent>')"
cp "$state/relaunch.log" "$out/relaunch.log" 2>/dev/null
cli history --last 3 > "$out/history.txt" 2>&1
note=$(grep -l "loop_id: $loop_id" "$repo_root"/.skilled/skills/.state/session-relaunch/handoffs/*.md 2>/dev/null | head -1)
log "note: ${note##*/} $(grep -E '^(status|goal_packet|runtime):' "$note" 2>/dev/null | tr '\n' ' ')"
[ -n "$note" ] && cp "$note" "$out/note-final.md" && echo "$note" > "$out/note-path.txt"
log "done"
