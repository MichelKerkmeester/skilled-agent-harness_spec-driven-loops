#!/usr/bin/env bash
# Read-only counts of the Codex and Pi question-tool surfaces. Prints counts only, never session content.
P=.skilled/skills/.state/decision-capture/probe
echo "probe status: codex=$(jq -r '.status+"/"+.adapter' $P/codex.json) pi=$(jq -r '.status+"/"+.adapter' $P/pi.json)"
echo "cli-codex files naming request_user_input: $(rg -l request_user_input .skilled/skills/cli-external-orchestration/cli-codex/ | wc -l | tr -d ' ')"
echo "codex rollouts: $(find ~/.codex/sessions -name '*.jsonl' | wc -l | tr -d ' ')"
echo "codex-tui rollouts: $(for f in $(find ~/.codex/sessions -name '*.jsonl'); do head -1 "$f" | jq -r '.payload.originator // "-"'; done | grep -c '^codex-tui$')"
ids=$(rg --no-filename '"name":"request_user_input_async"' ~/.codex/sessions | jq -r 'select(.payload.type=="function_call") | .payload.call_id' | sort -u)
echo "codex request_user_input_async calls: $(printf '%s\n' "$ids" | grep -c .)"
acc=$(rg --no-filename -F '"output":"{\"accepted\":true}"' ~/.codex/sessions | jq -r '.payload.call_id' | grep -F -x -f <(printf '%s\n' "$ids"))
echo "codex calls answered {\"accepted\":true}: $(printf '%s\n' "$acc" | grep -c .)"
echo "codex calls rejected for bad arguments: $(rg --no-filename -c 'failed to parse function arguments' ~/.codex/sessions | awk '{s+=$1} END{print s+0}')"
ex=0; usr=0
for id in $acc; do
  f=$(rg -l -F "$id" ~/.codex/sessions | head -1)
  [ "$(head -1 "$f" | jq -r '.payload.originator')" = "codex_exec" ] && ex=$((ex+1))
  ln=$(rg -n -F "\"call_id\":\"$id\",\"output\"" "$f" | head -1 | cut -d: -f1)
  tail -n +$((ln+1)) "$f" | jq -r 'select(.type=="response_item" and .payload.type=="message") | .payload.role' | grep -q '^user$' && usr=$((usr+1))
done
echo "accepted calls inside codex_exec rollouts: $ex"
echo "accepted calls followed by a user message: $usr"
echo "pi session files: $(find ~/.pi/agent/sessions -name '*.jsonl' | wc -l | tr -d ' ')"
echo "pi files with an ask_user_question toolResult: $(rg -l '"toolName":"ask_user_question"' ~/.pi/agent/sessions | wc -l | tr -d ' ')"
echo "pi files with an answered one (cancelled:false): $(rg -l '"toolName":"ask_user_question".*"cancelled":false' ~/.pi/agent/sessions | wc -l | tr -d ' ')"
