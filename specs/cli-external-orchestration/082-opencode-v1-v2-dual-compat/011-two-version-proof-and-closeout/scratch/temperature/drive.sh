#!/usr/bin/env bash
# Runs each case against the capture provider; every OpenCode state path is private.
set -u
T=$1
cd "$T/ws" || exit 9
run() { # version label agent-or-empty
  local v=$1 label=$2 agent=$3
  local args=()
  [ -n "$agent" ] && args=(--agent "$agent")
  local prompt="CASE=$label Reply with one word."
  if [ "$v" = v2 ]; then
    OPENCODE_DB=$T/state/v2-$label.db XDG_DATA_HOME=$T/state/data perl -e 'alarm 120; exec @ARGV' \
      opencode2 run --standalone -m capture/fake ${args[@]+"${args[@]}"} --format json "$prompt" </dev/null > "$T/out/$label.jsonl" 2> "$T/out/$label.err"
  else
    OPENCODE_DB=$T/state/v1-$label.db perl -e 'alarm 120; exec @ARGV' \
      opencode run --model capture/fake ${args[@]+"${args[@]}"} --format json --dir "$T/ws" "$prompt" </dev/null > "$T/out/$label.jsonl" 2> "$T/out/$label.err"
  fi
  echo "$label exit=$?" >> "$T/out/exits.txt"
}
mkdir -p "$T/out"; : > "$T/out/exits.txt"
run v2 v2-review review
run v2 v2-debug debug
run v2 v2-default ""
run v1 v1-review review
run v1 v1-debug debug
run v1 v1-orchestrate orchestrate
run v1 v1-markdown markdown
run v1 v1-default ""
