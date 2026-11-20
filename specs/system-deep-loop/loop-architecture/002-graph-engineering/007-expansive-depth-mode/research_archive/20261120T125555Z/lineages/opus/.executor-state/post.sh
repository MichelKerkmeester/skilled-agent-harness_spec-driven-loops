#!/bin/bash
# Lineage-local per-iteration post steps: known-texts, admit, reduce, graph upserts, lock refresh.
L=$1; N=$2; SF=$3; SID=$4; NNN=$(printf %03d $N)
node -e '
const fs=require("fs");const L=process.argv[1];
let reg={};try{reg=JSON.parse(fs.readFileSync(L+"/findings-registry.json","utf8"))}catch{}
const t=[...(reg.keyQuestions||[]).map(q=>q.text),...(reg.rejectedPatterns||[]).map(p=>p.pattern)].filter(Boolean);
const s=fs.readFileSync(L+"/deep-research-strategy.md","utf8");const m=/EXHAUSTED APPROACHES[^\n]*\n([\s\S]*?)<!-- \/ANCHOR:exhausted-approaches/.exec(s);
if(m) for(const line of m[1].split("\n")) if(line.trim().startsWith("-")) t.push(line.trim().replace(/^-\s*/,""));
fs.writeFileSync(L+"/frontier-known-texts.json",JSON.stringify(t));' $L
echo "ADMIT:"; node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs admit --artifact-dir "$L" --iteration "$N" --input "$L/deltas/iter-$NNN.jsonl" --known-texts "$L/frontier-known-texts.json"; echo "admit exit=$?"
node .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs $SF --artifact-dir $L > /dev/null; echo "reduce exit=$?"
node .skilled/skills/system-deep-loop/runtime/scripts/iteration-graph-upsert.cjs --delta-dir "$L/deltas" --state-log "$L/deep-research-state.jsonl" --iteration "$N" --spec-folder "$SF" --session-id "$SID" 2>&1 | tail -1
node .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs graph --artifact-dir "$L" --output "$L/frontier-graph-events.json" && node .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs --spec-folder "$SF" --loop-type research --session-id "$SID" --events "$L/frontier-graph-events.json" 2>&1 | tail -1
node .skilled/skills/system-deep-loop/runtime/scripts/loop-lock.cjs refresh --lock-path $L/.deep-research.lock --owner-pid 53058 --nonce 53058-1795137645567-76fdb42d-3df9-45c9-81c8-746e0ee1c49c | head -c 120; echo
