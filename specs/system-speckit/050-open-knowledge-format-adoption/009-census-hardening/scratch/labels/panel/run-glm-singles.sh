#!/usr/bin/env bash
# GLM 5.3 Flash max on cli-devin, one row per call, five calls at a time.
# Five-row calls all hit the model's output-token limit; Gemini needed the same split.
P="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$TMPDIR/panel-empty-glm"; cd "$TMPDIR/panel-empty-glm" || exit 1
run(){ b=$1; s=$(date +%s)
  SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 devin -p --model glm-5-3-flash-max --permission-mode dangerous --respect-workspace-trust false -- "$(cat "$P/brief.txt" "$P/batch-$b.md")" </dev/null > "$P/glm-b$b-devin.out" 2> "$P/glm-b$b-devin.err" & pid=$!
  while kill -0 $pid 2>/dev/null; do
    if [ $(( $(date +%s) - s )) -ge 600 ]; then kill $pid; echo "glm-devin b$b killed after 600s $(date +%T)" >> "$P/runs.log"; return; fi
    sleep 5; done
  wait $pid; echo "glm-devin b$b rc=$? $(( $(date +%s) - s ))s $(date +%T)" >> "$P/runs.log"; }
for g in 2a 2b 3a 4a 4b; do
  for i in 1 2 3 4 5; do run $g$i & done; wait
done
