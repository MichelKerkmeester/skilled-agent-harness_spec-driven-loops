#!/usr/bin/env bash
# Gap probe: start one runtime in tmux, under skilled-loop or straight, with a probe prompt,
# then type each scripted step once its trigger shows on screen or in the relaunch log.
# Usage: probe.sh <claude|pi|opencode|codex> <label> <steps-file|-> [timeout-seconds]
#   HOP_PROMPT   prompt text; {CODE} becomes a fresh code word
#   HOP_DIRECT=1 start the runtime without skilled-loop (outside the loop)
#   HOP_LAUNCH   extra launch arguments, word-split, added before the prompt
#   HOP_REPO     checkout to run in, such as an unchanged one for a baseline
# A steps file holds one step per line: <screen|log>\t<extended regex>\t<keys>. Keys are typed
# literally then Enter, except a value that starts with KEYS: is sent as tmux key names.
# A DELAY:<seconds>: prefix waits that long after the trigger before typing. Keys NONE send
# nothing, which lets one step wait for another. Where screen! fires when the regex is absent.
set -uo pipefail

runtime=${1:?runtime}
label=${2:?label}
steps_file=${3:--}
limit=${4:-600}
here=$(cd "$(dirname "$0")" && pwd)
repo=${HOP_REPO:-$(git -C "$here" rev-parse --show-toplevel)}
out="$here/../runs/$label-$runtime"
mkdir -p "$out"
if [ -n "${XDG_RUNTIME_DIR:-}" ]; then state="$XDG_RUNTIME_DIR/skilled-relaunch"; else state="${TMPDIR:-/tmp}/skilled-relaunch-$(id -u)"; fi
notes="$repo/.skilled/skills/.state/session-relaunch/handoffs"
mkdir -p "$notes"

code_word="ORCHID-$RANDOM"
prompt=${HOP_PROMPT:?HOP_PROMPT is required}
prompt=${prompt//\{CODE\}/$code_word}

read -r -a extra <<< "${HOP_LAUNCH:-}"
case "$runtime" in
  claude) launch=(--model sonnet --effort medium ${extra[@]+"${extra[@]}"} "$prompt") ;;
  pi) launch=(--provider openai --model gpt-6-luna --thinking low ${extra[@]+"${extra[@]}"} "$prompt") ;;
  opencode) launch=(--auto ${extra[@]+"${extra[@]}"} --prompt "$prompt") ;;
  codex) launch=(-m gpt-6-luna -c model_reasoning_effort=low --dangerously-bypass-approvals-and-sandbox ${extra[@]+"${extra[@]}"} "$prompt") ;;
  *) echo "unknown runtime $runtime" >&2; exit 2 ;;
esac

touch "$state/relaunch.log"
log_offset=$(wc -l < "$state/relaunch.log" | tr -d ' ')
start_ms=$(node -e 'console.log(Date.now())')
session="probe-$label-$runtime"
tmux kill-session -t "$session" 2>/dev/null

quoted=$(printf '%q ' "${launch[@]}")
envs="SYSTEM_SESSION_RELAUNCH_ENABLED=1 SESSION_RELAUNCH_THRESHOLD=0.05 SESSION_RELAUNCH_WINDOW_TOKENS=100 SESSION_RELAUNCH_MAX_HOPS=1"
if [ "${HOP_DIRECT:-0}" = 1 ]; then
  start="$runtime $quoted"
  [ "$runtime" = opencode ] && start="opencode --standalone $quoted"
  [ "$runtime" = codex ] && start="codex --no-daemon $quoted"
else
  start="bash .skilled/bin/skilled-loop $runtime $quoted"
fi
tmux new-session -d -s "$session" -x 200 -y 50 \
  "cd '$repo' && env -u SKILLED_LOOP_HOPS -u SKILLED_LOOP_ID -u CLAUDECODE -u CLAUDE_CODE_SESSION_ID $envs $start; echo WRAPPER_EXIT=\$?; sleep 600"
tmux set-option -t "$session" remain-on-exit on >/dev/null

steps=()
if [ "$steps_file" != - ]; then
  while IFS= read -r line; do [ -n "$line" ] && steps+=("$line"); done < "$steps_file"
fi
step=0
: > "$out/steps.log"
end=$(( $(date +%s) + limit ))
while [ "$(date +%s)" -lt "$end" ]; do
  screen=$(tmux capture-pane -p -t "$session" 2>/dev/null) || break
  if printf '%s' "$screen" | grep -q -E "Do you trust the files in this folder|Yes, I trust this folder|[Tt]rust this (folder|directory)\?"; then
    tmux send-keys -t "$session" Enter; sleep 3; continue
  fi
  if printf '%s' "$screen" | grep -q "Hooks need review"; then
    tmux send-keys -t "$session" Down Enter; sleep 3; continue
  fi
  if [ "$step" -lt "${#steps[@]}" ]; then
    IFS=$'\t' read -r where pattern keys <<< "${steps[$step]}"
    if [ "$where" = log ]; then
      haystack=$(tail -n +"$((log_offset + 1))" "$state/relaunch.log")
    else
      haystack=$screen
    fi
    hit=0
    printf '%s' "$haystack" | grep -q -E "$pattern" && hit=1
    [ "$where" = 'screen!' ] && hit=$((1 - hit))
    if [ "$hit" = 1 ]; then
      if [[ "$keys" =~ ^DELAY:([0-9.]+): ]]; then
        sleep "${BASH_REMATCH[1]}"; keys=${keys#DELAY:*:}
      fi
      if [ "$keys" = NONE ]; then
        :
      elif [[ "$keys" == KEYS:* ]]; then
        # shellcheck disable=SC2086
        tmux send-keys -t "$session" ${keys#KEYS:}
      else
        tmux send-keys -t "$session" -l "$keys"; sleep 0.5; tmux send-keys -t "$session" Enter
      fi
      printf '%s step %s sent after %s /%s/\n' "$(node -e 'console.log(Date.now())')" "$step" "$where" "$pattern" >> "$out/steps.log"
      step=$((step + 1))
      sleep 2
      continue
    fi
  fi
  tmux capture-pane -p -S -600 -t "$session" > "$out/pane.txt" 2>/dev/null
  if grep -q "WRAPPER_EXIT=" "$out/pane.txt"; then break; fi
  done_note=$(grep -l -E "^status: (done|complete)" "$notes"/*.md 2>/dev/null | while read -r f; do
    grep -q "$code_word" "$f" && echo "$f"; done | head -1)
  if [ -n "$done_note" ] && [ "$step" -ge "${#steps[@]}" ]; then
    sleep 25; tmux capture-pane -p -S -600 -t "$session" > "$out/pane.txt"; break
  fi
  # A pending step polls fast, because a withdraw step must land inside the killer's idle wait.
  if [ "$step" -lt "${#steps[@]}" ]; then sleep 0.5; else sleep 3; fi
done
tail -n +"$((log_offset + 1))" "$state/relaunch.log" > "$out/relaunch.log"
for f in "$notes"/*.md; do
  [ -f "$f" ] || continue
  grep -q "$code_word" "$f" && cp "$f" "$out/note-$(basename "$f")"
done
printf '{"runtime":"%s","label":"%s","codeWord":"%s","startMs":%s,"endMs":%s,"stepsSent":%s,"stepsTotal":%s}\n' \
  "$runtime" "$label" "$code_word" "$start_ms" "$(node -e 'console.log(Date.now())')" "$step" "${#steps[@]}" > "$out/meta.json"
tmux kill-session -t "$session" 2>/dev/null
echo "$out"
