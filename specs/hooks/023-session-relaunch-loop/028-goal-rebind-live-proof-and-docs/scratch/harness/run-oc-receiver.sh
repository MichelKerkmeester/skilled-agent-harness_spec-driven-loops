#!/usr/bin/env bash
# Receiver half on OpenCode 2. A hop cannot reach OpenCode 2 (the killer signals the plugin's
# server process, not the TUI), so this starts one fresh TUI session in a throwaway checkout
# with the hand-over variable set by hand (or not) and reads what the session says and what the
# goal store holds. Usage: run-oc-receiver.sh <sandbox> <out> [ENV=value ...]
set -u
here="$(cd "$(dirname "$0")" && pwd)"
sb="$1"; out="$2"; shift 2
mkdir -p "$out/bin" "$out/run"; : > "$out/summary.txt"
sock="ev028-ocr-$(basename "$out")"
tm() { command tmux -L "$sock" "$@"; }
trap 'tm kill-server 2>/dev/null' EXIT
real_opencode="$(command -v opencode)"
printf '#!/usr/bin/env bash\nexec "%s" --standalone "$@"\n' "$real_opencode" > "$out/bin/opencode"; chmod +x "$out/bin/opencode"
env_args=""; for kv in "$@"; do env_args+=" $(printf '%q' "$kv")"; done
cat > "$out/launch.sh" <<LAUNCH
#!/usr/bin/env bash
cd '$sb'
unset_args=(); for v in \$(env | sed -n -E "s/^((CLAUDE|ORCA_|SKILLED_LOOP_|SESSION_RELAUNCH_GOAL|AI_SESSION_CHILD|AI_AGENT|CODEX_|OPENCODE_|HERMES_|TMUX)[A-Za-z0-9_]*)=.*/\1/p"); do unset_args+=(-u "\$v"); done
exec env "\${unset_args[@]}" XDG_RUNTIME_DIR='$out/run'$env_args PATH='$out/bin':\$PATH opencode --prompt 'If your context holds an active goal block, which starts with [active_goal:, reply with that first line exactly. Otherwise reply with the single word NONE.'
LAUNCH
chmod +x "$out/launch.sh"
echo "$(date -u +%FT%TZ) env: $*" | tee -a "$out/summary.txt"
tm new-session -d -x 200 -y 50 -s r "bash '$out/launch.sh'"
sleep 20
# --prompt prefills the box; submit it if the TUI has not.
if tm capture-pane -p -t r | grep -q "If your context holds"; then tm send-keys -t r Enter; fi
sleep 60
tm capture-pane -p -S -200 -t r > "$out/pane.txt"
grep -v '^\s*$' "$out/pane.txt" | grep -E "active_goal|NONE|Build ·" | head -6 | tee -a "$out/summary.txt"
node "$here/goal-records.cjs" "$sb/.skilled/skills/.state/goal" | tee "$out/goal-records.txt" | tee -a "$out/summary.txt"
echo "$(date -u +%FT%TZ) done" | tee -a "$out/summary.txt"
