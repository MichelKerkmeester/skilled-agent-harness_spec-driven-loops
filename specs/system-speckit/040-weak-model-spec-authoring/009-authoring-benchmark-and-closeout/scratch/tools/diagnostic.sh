source /private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/fcd93cd7-b3f2-45e6-b976-87fabe792df3/scratchpad/env009.sh
cd $WORKTREE
REQ=$(jq -r '.requiredAnchors[]' $SC/closeout/contract-3-tasks.json); OPT=$(jq -r '.optionalAnchors[]' $SC/closeout/contract-3-tasks.json)
BP=/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/5b1d067f-8217-4522-81f7-e9564e92286f/scratchpad/bench-packets/swe-2-max-baseline-l3
score(){ f=$2/001-recommend-level-quiet-flag/tasks.md; m=0; for a in $REQ; do /usr/bin/grep -q "<!-- ANCHOR:$a -->" $f || m=$((m+1)); done; o=0; ol=""; for a in $OPT; do /usr/bin/grep -q "<!-- ANCHOR:$a -->" $f || { o=$((o+1)); ol="$ol $a"; }; done; echo "$1 required_missing=$m (of $(echo $REQ | wc -w | tr -d ' ')) optional_missing=$o$ol"; }
for n in 1 2 3; do score baseline-$n $BP/packet-$n; done
for n in 1 2 3; do score final-$n $SCR/bench-packets/swe-2-max-final-l3/packet-$n; done
