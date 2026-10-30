#!/bin/bash
# usage: run-pi.sh <brief-name>   (reads briefs/<name>.txt, writes runs/<name>.out/.err)
D="$(cd "$(dirname "$0")" && pwd)"
P="$(cat "$D/briefs/_common.txt")

$(cat "$D/briefs/$1.txt")"
cd "$D/../../../.." || exit 9
SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "$P" \
  --model llmgateway/deepseek-v4.1-flash-1017 --thinking max --mode text --offline \
  </dev/null > "$D/runs/$1.out" 2> "$D/runs/$1.err"
echo "exit=$?"
