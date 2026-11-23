#!/usr/bin/env bash
# Stage-one trial of one candidate run keyword for the needs-you answer prompt.
# Usage: fix4-trial.sh <workspace> <current-keyword|NONE|REPLAY> <candidate-keyword|NONE>
# REPLAY skips the swap and rebuild and only replays the probes.
# Swaps the keyword in hub-router.json and ROUTER.md (NONE removes it), regenerates
# graph-metadata.json, rescans and rebuilds the advisor, then replays the probe set.
set -u
W="$1"; CUR="$2"; NEW="$3"; cd "$W"
H=.skilled/skills/system-skilled-bots
if [ "$CUR" != "REPLAY" ]; then
python3 - "$CUR" "$NEW" <<'EOF'
import sys
cur, new = sys.argv[1], sys.argv[2]
for p in ['.skilled/skills/system-skilled-bots/hub-router.json', '.skilled/skills/system-skilled-bots/ROUTER.md']:
    s = open(p).read()
    if cur == 'NONE':
        anchor = '"answer a needs-you"'
        assert s.count(anchor) == 1, p
        s = s.replace(anchor, anchor + ', "%s"' % new, 1)
        open(p, 'w').write(s)
        continue
    old = '"%s"' % cur
    assert s.count(old) == 1, (p, cur)
    if new == 'NONE':
        s = s.replace(', ' + old, '', 1) if (', ' + old) in s else s.replace(old + ', ', '', 1)
    else:
        s = s.replace(old, '"%s"' % new, 1)
    open(p, 'w').write(s)
EOF
node -e 'JSON.parse(require("fs").readFileSync(".skilled/skills/system-skilled-bots/hub-router.json","utf8"))' || exit 2
node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --write --hub system-skilled-bots | grep -E '^\s+[+-] '
node .skilled/bin/skill-advisor.cjs skill_graph_scan --trusted --format text >/dev/null
node .skilled/bin/skill-advisor.cjs advisor_rebuild --trusted --force true --workspace-root "$PWD" --format text >/dev/null
fi
OOD=("answer this question" "run the tests" "schedule a meeting for tomorrow" "status of the build" "author a skill" "check my email inbox"
     "answer the open question" "answer the open ticket" "answer the open issues" "answer the open" "answer the question"
     "answer my open questions" "answer the open pr comments" "answer the pending question" "open questions in the spec"
     "what do you need from me" "answer the open review threads" "my manager needs you to sign this"
     "it needs you to confirm the deploy" "the team needs you")
IN=("answer the release bot's needs-you question" "answer the open needs-you question for the release bot" "what is waiting in my bots inbox" "answer the bot" "bots answer" "answer the bot's open question with yes")
fails=0
for p in "${OOD[@]}"; do
  out=$(python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "$p" --threshold 0.5 | python3 -c 'import json,sys; d=json.load(sys.stdin); top=d[0] if d else None; bots=[(i+1,x["confidence"],round(x["score"],3)) for i,x in enumerate(d) if x["skill"]=="system-skilled-bots"]; first=bool(top and top["skill"]=="system-skilled-bots"); print(("FAIL" if first else "ok  "), "top=" + str((top["skill"],top["confidence"],round(top["score"],3)) if top else None), "bots=" + str(bots))')
  case "$out" in FAIL*) fails=$((fails+1));; esac
  echo "ood | $out | $p"
done
for p in "${IN[@]}"; do
  out=$(python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "$p" --threshold 0.5 | python3 -c 'import json,sys; d=json.load(sys.stdin); top=d[0] if d else None; first=bool(top and top["skill"]=="system-skilled-bots"); print(("ok  " if first else "FAIL"), "top=" + str((top["skill"],top["confidence"]) if top else None))')
  case "$out" in FAIL*) fails=$((fails+1));; esac
  echo "in  | $out | $p"
done
echo "candidate=$NEW stage-one-fails=$fails"
