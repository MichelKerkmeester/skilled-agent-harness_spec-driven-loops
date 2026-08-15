#!/usr/bin/env bash
# Shared helpers: dispatch to a cheap model READ-ONLY (model emits text, the
# parent writes files) and extract a JSON object from the reply. Keeping all
# file writes on the parent side removes the RM-8 destructive-write class:
# workers never get write authority and never see --dangerously-skip-permissions.

log(){ printf '%s %s\n' "$(date +%H:%M:%S)" "$*" | tee -a "$LOG" >&2; }

# dispatch_opencode <model> <prompt-file> <raw-out>  -> model's stdout in raw-out
dispatch_opencode(){
  local model="$1" pf="$2" out="$3"
  mkdir -p "$FAIL_DIR" "$(dirname "$out")"
  timeout "$DISPATCH_TIMEOUT" env MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 \
    opencode run --model "$model" --dir "$REPO" "$(cat "$pf")" </dev/null \
    >"$out" 2>>"$FAIL_DIR/dispatch.err"
}

# dispatch_devin <model> <prompt-file> <raw-out>
# Read-only intent: prompt says "print only, edit nothing". suggest mode keeps
# Devin from writing files; we still rely on the parent to persist output.
dispatch_devin(){
  local model="$1" pf="$2" out="$3"
  mkdir -p "$FAIL_DIR" "$(dirname "$out")"
  timeout "$DISPATCH_TIMEOUT" devin -p --model "$model" --permission-mode suggest \
    -- "$(cat "$pf")" </dev/null >"$out" 2>>"$FAIL_DIR/dispatch.err"
}

# synth_dispatch <prompt-file> <raw-out> — routes to the configured synth backend
synth_dispatch(){
  local pf="$1" out="$2"
  if [ "$SYNTH_KIND" = "devin" ]; then dispatch_devin "$SYNTH_MODEL_DEVIN" "$pf" "$out"
  else dispatch_opencode "$SYNTH_MODEL_OPENCODE" "$pf" "$out"; fi
}

# extract_json <raw-file> <json-out> — pull the first valid JSON object w/ bullets
extract_json(){
  python3 - "$1" "$2" <<'PY'
import json,sys,re
raw,out=sys.argv[1:3]
t=open(raw,encoding='utf-8',errors='replace').read()
cands=[]
m=re.search(r'```json\s*(\{.*?\})\s*```', t, re.S)
if m: cands.append(m.group(1))
cands+=re.findall(r'\{[^{}]*"bullets"\s*:\s*\[[^\]]*\][^{}]*\}', t, re.S)
if not cands:
    s=t.find('{'); e=t.rfind('}')
    if s!=-1 and e>s: cands.append(t[s:e+1])
for c in cands:
    try:
        o=json.loads(c)
        if isinstance(o,dict) and (o.get('changes') or o.get('summary') or o.get('bullets')):
            json.dump(o, open(out,'w'), ensure_ascii=False); sys.exit(0)
    except Exception: pass
sys.exit(3)
PY
}

# extract_markdown <raw-file> <md-out> — strip an opencode/devin wrapper, keep the
# largest fenced ```markdown block if present, else the whole reply body.
extract_markdown(){
  python3 - "$1" "$2" <<'PY'
import sys,re
raw,out=sys.argv[1:3]
t=open(raw,encoding='utf-8',errors='replace').read()
m=re.search(r'```(?:markdown|md)?\s*(.*?)```', t, re.S)
body=m.group(1).strip() if m and len(m.group(1).strip())>40 else t.strip()
open(out,'w',encoding='utf-8').write(body+'\n')
PY
}

mark_done(){ mkdir -p "$STATE_DIR"; touch "$STATE_DIR/$1.done"; }
is_done(){ [ -f "$STATE_DIR/$1.done" ]; }
