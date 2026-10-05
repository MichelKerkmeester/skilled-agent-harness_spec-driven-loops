#!/usr/bin/env bash
# GLM 5.3 Flash max on cli-pi through LLM Gateway, one row per call, five calls at a time.
# Used after the cli-devin quota ran out; same model, same brief, same single-row files.
P="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$TMPDIR/panel-empty-glm"; cd "$TMPDIR/panel-empty-glm" || exit 1
run(){ b=$1; s=$(date +%s)
  SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 pi -p "$(cat "$P/brief.txt" "$P/batch-$b.md")" --model llmgateway/glm-5.3-flash --thinking max --mode text --offline </dev/null > "$P/glm-b$b-gw.out" 2> "$P/glm-b$b-gw.err" & pid=$!
  while kill -0 $pid 2>/dev/null; do
    if [ $(( $(date +%s) - s )) -ge 600 ]; then kill $pid; echo "glm-gw b$b killed after 600s $(date +%T)" >> "$P/runs.log"; return; fi
    sleep 5; done
  wait $pid; echo "glm-gw b$b rc=$? $(( $(date +%s) - s ))s $(date +%T)" >> "$P/runs.log"; }
set -- "$@"; while [ $# -gt 0 ]; do
  for i in 1 2 3 4 5; do [ $# -gt 0 ] && { run "$1" & shift; }; done; wait
done
