#!/usr/bin/env bash
# Spike: does interactive Vibe update context-breakdown.json every turn, and does it exit
# cleanly on SIGTERM to the process the wrapper would target? Writes evidence to ./out.
set -uo pipefail
here=$(cd "$(dirname "$0")" && pwd)
repo=$(git -C "$here" rev-parse --show-toplevel)
out="$here/out"; rm -rf "$out"; mkdir -p "$out"
home="$out/vibe-home"; mkdir -p "$home"
cp "$repo/.vibe/config.toml" "$home/config.toml"
printf '\nactive_model = "deepseek-flash"\n' >> "$home/config.toml"
session=vibe-spike
tmux kill-session -t "$session" 2>/dev/null
tmux new-session -d -s "$session" -x 200 -y 50 \
  "cd '$repo' && env SYSTEM_HOOKS_DISABLED=1 VIBE_HOME='$home' vibe --trust --agent auto-approve 'Reply with the single word ready.'; echo VIBE_EXIT=\$?; sleep 120"
tmux set-option -t "$session" remain-on-exit on >/dev/null

breakdown() { find "$home" -name context-breakdown.json -newer "$home/config.toml" 2>/dev/null | head -1; }
wait_for() { local pat=$1 limit=$2 t=0; while [ $t -lt $limit ]; do tmux capture-pane -p -t "$session" | grep -q -E "$pat" && return 0; sleep 2; t=$((t+2)); done; return 1; }

wait_for 'ready' 120 && echo "turn1 answered" >> "$out/log"
sleep 3
f=$(breakdown); echo "breakdown file: ${f:-none}" >> "$out/log"
[ -n "$f" ] && { echo "after turn1 mtime=$(stat -f %m "$f") $(cat "$f")" >> "$out/log"; }
tmux send-keys -t "$session" -l 'Read the file README.md and reply with its first heading only.'; sleep 0.5; tmux send-keys -t "$session" Enter
sleep 5; wait_for '^\s*[#]|heading|Skilled' 120 && echo "turn2 answered" >> "$out/log"
sleep 5
f=$(breakdown); [ -n "$f" ] && echo "after turn2 mtime=$(stat -f %m "$f") $(cat "$f")" >> "$out/log"
pane_pid=$(tmux display-message -p -t "$session" '#{pane_pid}')
ps -o pid=,ppid=,comm= -A > "$out/ps.txt"
echo "pane pid $pane_pid" >> "$out/log"
# The wrapper's child is the process the shell started for `vibe`: the pane shell's child.
target=$(awk -v p="$pane_pid" '$2==p && $3 !~ /sleep/ {print $1}' "$out/ps.txt" | head -1)
echo "target pid $target comm $(ps -o comm= -p "$target" 2>/dev/null)" >> "$out/log"
kill -TERM "$target"
t=0; while [ $t -lt 30 ]; do tmux capture-pane -p -t "$session" | grep -q VIBE_EXIT && break; sleep 1; t=$((t+1)); done
echo "exit after ${t}s: $(tmux capture-pane -p -t "$session" | grep -o 'VIBE_EXIT=[0-9]*')" >> "$out/log"
sleep 2; ps -o pid=,comm= -A | grep -E "vibe-rs|vibe-app-server" | grep -v grep > "$out/leftover.txt"
echo "leftover vibe processes: $(wc -l < "$out/leftover.txt" | tr -d ' ')" >> "$out/log"
tmux capture-pane -p -S -200 -t "$session" > "$out/pane.txt"
tmux kill-session -t "$session" 2>/dev/null
cat "$out/log"
