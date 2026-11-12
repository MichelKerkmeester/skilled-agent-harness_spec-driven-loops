#!/usr/bin/env bash
# Prints skillId, confidence and command for each recommendation the advisor CLI returns for one prompt.
node .skilled/bin/skill-advisor.cjs advisor_recommend --json "{\"prompt\":\"$1\"}" --format json \
  | node -e 'let s="";process.stdin.on("data",(d)=>{s+=d}).on("end",()=>{const j=JSON.parse(s);console.log(JSON.stringify(j.data.recommendations.map((r)=>[r.skillId,r.confidence,r.command||null])))})'
