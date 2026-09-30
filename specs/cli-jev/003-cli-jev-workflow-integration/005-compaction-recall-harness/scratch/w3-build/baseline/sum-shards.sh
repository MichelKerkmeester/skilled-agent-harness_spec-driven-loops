#!/usr/bin/env bash
# usage: sum-shards.sh <shards-dir>  -> per-shard summary lines, aggregate totals, unique failing test ids
D="$1"
for i in $(seq 1 12); do grep -ahE '^ +(Test Files|Tests) ' "$D/shard-$i.txt" | tr -s ' ' | sed "s/^/s$i:/"; done > "$D/totals.txt"
node -e '
const t=require("fs").readFileSync(process.argv[1],"utf8").split("\n");let f={passed:0,failed:0,skipped:0},tt={passed:0,failed:0,skipped:0};
for(const l of t){const m=l.match(/(Test Files|Tests) (.*)/); if(!m)continue; const o=m[1]==="Tests"?tt:f; for(const k of ["passed","failed","skipped"]){const x=m[2].match(new RegExp("(\\d+) "+k)); if(x)o[k]+=+x[1];}}
console.log("files",JSON.stringify(f),"tests",JSON.stringify(tt));' "$D/totals.txt"
grep -ah ' FAIL ' "$D"/shard-*.txt | sed 's/ \[.*//' | sort -u
