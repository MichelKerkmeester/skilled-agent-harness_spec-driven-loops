#!/usr/bin/env bash
# oc-run.sh <out-file> <prompt> [scope-file]
# Read-only DeepSeek V4.1 Flash max call through opencode-go. Writes the final reply text to <out-file>.
# With a scope file, any edit the call makes to those files is undone, so audits and reviews stay read-only.
out=$1; prompt=$2; scope=${3:-}
raw="$out.json"
if [ -n "$scope" ]; then before=$(mktemp); git diff -- $(cat "$scope") > "$before"; fi
SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run -m 'opencode-go/deepseek-v4.1-flash#max' --format json --standalone "$prompt" > "$raw" 2>"$out.err" </dev/null
rc=$?
python3 -I - "$raw" "$out" <<'PY'
import json, sys
texts = []
for line in open(sys.argv[1], errors='ignore'):
    try: o = json.loads(line)
    except Exception: continue
    p = o.get('part') if isinstance(o.get('part'), dict) else {}
    if p.get('type') == 'text' and p.get('text'): texts.append(p['text'])
open(sys.argv[2], 'w').write(texts[-1].strip() + '\n' if texts else '')
PY
if [ -n "$scope" ]; then
  after=$(mktemp); git diff -- $(cat "$scope") > "$after"
  if ! cmp -s "$before" "$after"; then
    echo "WROTE-SCOPE: the read-only call changed scope files; restoring" >&2
    git checkout -- $(cat "$scope") && [ -s "$before" ] && git apply "$before"
  fi
  rm -f "$before" "$after"
fi
tail -3 "$out.err" >&2
exit $rc
