#!/usr/bin/env bash
# PHASE 3a — deterministic consolidation. Merge fragments into one JSONL, then
# bucket by track (user-facing) and collect all internal fragments for the
# appendix. Two-tier split uses each fragment's own "audience" field.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; source "$HERE/config.sh"; source "$HERE/lib.sh"
mkdir -p "$(dirname "$OUT_FRAGMENTS")" "$WORK/buckets"
python3 - "$FRAG_DIR" "$OUT_FRAGMENTS" "$WORK/buckets" <<'PY'
import json,os,sys,glob,collections
frag_dir,outjsonl,buckets=sys.argv[1:4]
rows=[]
for f in sorted(glob.glob(os.path.join(frag_dir,'*.json'))):
    try: rows.append(json.load(open(f,encoding='utf-8')))
    except Exception: pass
with open(outjsonl,'w',encoding='utf-8') as w:
    for r in rows: w.write(json.dumps(r,ensure_ascii=False)+'\n')
uf=collections.defaultdict(list); internal=[]
for r in rows:
    (internal if r.get('audience')=='internal' else uf[r.get('section','misc')]).append(r)
for track,items in uf.items():
    json.dump(items, open(os.path.join(buckets,f'uf__{track}.json'),'w'), ensure_ascii=False, indent=1)
json.dump(internal, open(os.path.join(buckets,'internal.json'),'w'), ensure_ascii=False, indent=1)
print(f"fragments={len(rows)} tracks={len(uf)} internal={len(internal)}")
print("user-facing per track:", {k:len(v) for k,v in sorted(uf.items())})
PY
log "PHASE3a consolidate -> $OUT_FRAGMENTS + $WORK/buckets"
mark_done phase3a
