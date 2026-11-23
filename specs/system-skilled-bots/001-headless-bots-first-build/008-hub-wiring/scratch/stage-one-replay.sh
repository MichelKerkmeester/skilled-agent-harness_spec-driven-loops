#!/usr/bin/env bash
# Replays the same prompts through stage one (the advisor) and writes one JSON line each.
set -u
W="$1"; OUT="$2"
cd "$W" || exit 2
: > "$OUT"
node -e 'for (const l of require("fs").readFileSync(process.argv[1],"utf8").split("\n")) if (l) console.log(JSON.parse(l).prompt)' "$3" | while IFS= read -r p; do
  out=$(python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "$p" --threshold 0.5 2>&1); rc=$?
  python3 -c '
import json,sys
p,rc,out=sys.argv[1],int(sys.argv[2]),sys.argv[3]
d=json.loads(out)
print(json.dumps({"prompt":p,"exit":rc,"top":d[0]["skill"] if d else None,"results":[{"skill":x["skill"],"score":x["score"],"confidence":x["confidence"],"passes_threshold":x["passes_threshold"]} for x in d]}))' "$p" "$rc" "$out" >> "$OUT"
done
