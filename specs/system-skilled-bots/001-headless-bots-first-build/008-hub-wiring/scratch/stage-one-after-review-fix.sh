#!/usr/bin/env bash
# Replays the stage-one prompts after the review fix through the advisor CLI and
# writes one JSON line each: the full ranked list, plus the bots hub's list
# position and confidence. Read only apart from the output file.
# Usage: stage-one-after-review-fix.sh <repo-root> <out.jsonl>
set -u
W="$1"; OUT="$2"
cd "$W" || exit 2
: > "$OUT"
while IFS='|' read -r kind p; do
  out=$(python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "$p" --threshold 0.5 2>&1); rc=$?
  python3 -c '
import json,sys
kind,p,rc,out=sys.argv[1],sys.argv[2],int(sys.argv[3]),sys.argv[4]
d=json.loads(out)
ranked=[[x["skill"],round(x["confidence"],3),x["passes_threshold"]] for x in d]
pos=next((i+1 for i,x in enumerate(d) if x["skill"]=="system-skilled-bots"),None)
conf=next((round(x["confidence"],3) for x in d if x["skill"]=="system-skilled-bots"),None)
print(json.dumps({"kind":kind,"prompt":p,"exit":rc,"bots_position":pos,"bots_confidence":conf,"top3":ranked[:3],"ranked":ranked}))' "$kind" "$p" "$rc" "$out" >> "$OUT"
done <<'EOF'
gate|write a new BOT.md for a nightly dependency check bot
gate|run the nightly-digest bot by hand
gate|install the launchd schedule for my nightly-digest bot
gate|show me the status of my bots and their last runs
gate|what is waiting in my bots inbox
gate|answer the open needs-you question for the release bot
new|run my nightly bot
new|kick off the nightly-digest bot
new|run the nightly bot now
new|pause the nightly-digest bot
new|install the schedule for the nightly-digest bot
ood|run the tests
ood|status of the build
ood|author a skill
ood|schedule a meeting for tomorrow
ood|update skilled now
ood|is my skilled install healthy
EOF
