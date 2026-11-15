#!/usr/bin/env bash
# Live hop harness: start one runtime under skilled-loop in tmux with the same task on every
# runtime, answer only the first-launch trust dialogs, and keep the evidence the scorer reads.
# Usage: live-hop.sh <claude|pi|opencode|codex> <label> [timeout-seconds]
set -uo pipefail

runtime=${1:?runtime}
label=${2:?label}
limit=${3:-600}
here=$(cd "$(dirname "$0")" && pwd)
repo=$(git -C "$here" rev-parse --show-toplevel)
out="$here/../runs/$label-$runtime"
mkdir -p "$out"
if [ -n "${XDG_RUNTIME_DIR:-}" ]; then state="$XDG_RUNTIME_DIR/skilled-relaunch"; else state="${TMPDIR:-/tmp}/skilled-relaunch-$(id -u)"; fi
notes="$repo/.skilled/skills/.state/session-handover/handoffs"
mkdir -p "$notes"

code_word="ORCHID-$RANDOM"
prompt="Carry this short task through a context handoff, then finish it in the new session. The task: report the line count of .skilled/hooks/session-handover/README.md, name its first heading and repeat the code word $code_word. Start by reading the README. Gate 3: D) Skip, no spec folder."

name="hoptest-$label-$runtime"
case "$runtime" in
  claude) launch=(--model sonnet --effort medium --name "$name" "$prompt") ;;
  pi) launch=(--provider openai --model gpt-6-luna --thinking low --name "$name" "$prompt") ;;
  opencode) launch=(--auto --prompt "$prompt") ;;
  codex) launch=(-m gpt-6-luna -c model_reasoning_effort=low --dangerously-bypass-approvals-and-sandbox "$prompt") ;;
  *) echo "unknown runtime $runtime" >&2; exit 2 ;;
esac

touch "$state/relaunch.log"
log_offset=$(wc -l < "$state/relaunch.log" | tr -d ' ')
start_ms=$(node -e 'console.log(Date.now())')
session="hop-$label-$runtime"
tmux kill-session -t "$session" 2>/dev/null

quoted=$(printf '%q ' "${launch[@]}")
envs="SYSTEM_SESSION_HANDOVER_ENABLED=1 SESSION_HANDOVER_THRESHOLD=0.05 SESSION_HANDOVER_WINDOW_TOKENS=100 SESSION_HANDOVER_MAX_HOPS=1"
tmux new-session -d -s "$session" -x 200 -y 50 \
  "cd '$repo' && env -u SKILLED_LOOP_HOPS -u SKILLED_LOOP_ID -u CLAUDECODE -u CLAUDE_CODE_SESSION_ID $envs bash .skilled/bin/skilled-loop $runtime $quoted; echo WRAPPER_EXIT=\$?; sleep 600"
tmux set-option -t "$session" remain-on-exit on >/dev/null

cat > "$out/meta.json" <<EOF
{"runtime":"$runtime","label":"$label","codeWord":"$code_word","name":"$name","startMs":$start_ms,"logOffset":$log_offset,"stateDir":"$state","notesDir":"$notes","launch":$(node -e 'console.log(JSON.stringify(process.argv.slice(1)))' -- "${launch[@]}")}
EOF

dialogs=0
argv_seen=""
pane_pid=$(tmux display-message -p -t "$session" '#{pane_pid}')
end=$(( $(date +%s) + limit ))
: > "$out/argv.log"
while [ "$(date +%s)" -lt "$end" ]; do
  screen=$(tmux capture-pane -p -t "$session" 2>/dev/null) || break
  # First-launch trust dialogs are not part of a hop; answer them and count them apart.
  if printf '%s' "$screen" | grep -q -E "Do you trust the files in this folder|Yes, I trust this folder|trust this (folder|directory)\?"; then
    tmux send-keys -t "$session" Enter; dialogs=$((dialogs + 1)); sleep 3; continue
  fi
  if printf '%s' "$screen" | grep -q "Hooks need review"; then
    tmux send-keys -t "$session" Down Enter; dialogs=$((dialogs + 1)); sleep 3; continue
  fi
  # Record every runtime process the wrapper starts, so the scorer sees the relaunch flags.
  while read -r pid ppid args; do
    case "$args" in
      *"$runtime "*|*"/$runtime "*|*"$runtime") ;;
      *) continue ;;
    esac
    case "$argv_seen" in *"|$pid|"*) continue ;; esac
    # Keep only descendants of the tmux pane.
    p=$ppid; inside=0
    for _ in 1 2 3 4 5 6; do
      [ "$p" = "$pane_pid" ] && { inside=1; break; }
      p=$(ps -o ppid= -p "$p" 2>/dev/null | tr -d ' '); [ -z "$p" ] && break
    done
    [ "$inside" = 1 ] || continue
    argv_seen="$argv_seen|$pid|"
    printf '%s %s %s\n' "$(node -e 'console.log(Date.now())')" "$pid" "$args" >> "$out/argv.log"
  done < <(ps -axo pid=,ppid=,args=)
  tmux capture-pane -p -S -400 -t "$session" > "$out/pane.txt" 2>/dev/null
  if grep -q "WRAPPER_EXIT=" "$out/pane.txt"; then break; fi
  # A receiver that closed the note has finished the hop; give it time to print its answer.
  done_note=$(grep -l -E "^status: (done|complete)" "$notes"/*.md 2>/dev/null | while read -r f; do
    [ "$(node -e 'console.log(require("fs").statSync(process.argv[1]).mtimeMs)' "$f" | cut -d. -f1)" -ge "$start_ms" ] && grep -q "$code_word" "$f" && echo "$f"; done | head -1)
  if [ -n "$done_note" ]; then
    sleep 25
    tmux capture-pane -p -S -400 -t "$session" > "$out/pane.txt"
    break
  fi
  sleep 4
done
end_ms=$(node -e 'console.log(Date.now())')
tail -n +"$((log_offset + 1))" "$state/relaunch.log" > "$out/relaunch.log"
for f in "$notes"/*.md; do
  [ -f "$f" ] || continue
  grep -q "$code_word" "$f" && cp "$f" "$out/note-$(basename "$f")"
done
node -e '
const fs=require("fs"); const p=process.argv[1]; const m=JSON.parse(fs.readFileSync(p));
m.endMs=Number(process.argv[2]); m.trustDialogs=Number(process.argv[3]); fs.writeFileSync(p, JSON.stringify(m,null,2));
' "$out/meta.json" "$end_ms" "$dialogs"
tmux kill-session -t "$session" 2>/dev/null
echo "$out"
