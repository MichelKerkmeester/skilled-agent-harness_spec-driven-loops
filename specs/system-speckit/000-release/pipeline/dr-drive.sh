#!/usr/bin/env bash
# Claude-orchestrated deep-research loop that builds the per-folder changelog. Each iteration
# dispatches a READ-ONLY DeepSeek-Flash leaf that writes a DETAILED, house-style
# changelog for a few folders; the parent (this script) persists all packet state.
# Usage: dr-drive.sh [BATCH_ITERS]   (default 10 iterations per invocation)
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; source "$HERE/config.sh"; source "$HERE/lib.sh"
RES="$SPEC/003-deep-research-synthesis/research"
ITERD="$RES/iterations"; DELD="$RES/deltas"; PROMPTD="$RES/prompts"
RMD="$RES/research.md"; COVER="$RES/coverage.txt"
mkdir -p "$ITERD" "$DELD" "$PROMPTD" "$RAW_DIR"; touch "$COVER"
[ -f "$RMD" ] || printf '# v4.0.0.0 Changelog — per-folder detail (deep-research, DeepSeek V4 Flash)\n\n' > "$RMD"
FPI="${FPI:-3}"; BATCH="${1:-10}"
TS(){ date -u +%Y-%m-%dT%H:%M:%SZ; }

allslugs(){ awk -F'\t' '{n=split($4,a,"/"); f=a[n]; sub(/\.md$/,"",f); print f}' "$MANIFEST"; }
made=0
for ((b=0;b<BATCH;b++)); do
  # next FPI folders not yet covered, in manifest order
  batch=$(allslugs | grep -vxF -f "$COVER" 2>/dev/null | head -n "$FPI")
  [ -z "$batch" ] && { echo "ALL 249 COVERED"; break; }
  N=$(( $(ls "$ITERD"/iteration-*.md 2>/dev/null | wc -l | tr -d ' ') + 1 ))
  NNN=$(printf '%03d' "$N")
  pf="$PROMPTD/iter-$NNN.prompt"; raw="$RAW_DIR/dr-$NNN.txt"; out="$ITERD/iteration-$NNN.md"
  {
cat <<EOF
## Role
You are writing the v4.0.0.0 changelog for "OpenCode Spec-Kit", a developer framework of AI skills/commands/hooks. For EACH spec folder below, write a DETAILED, house-style changelog entry. You have no tools; reply with markdown only.

## Context
Each folder shipped in the v3.6.0.0 -> v4.0.0.0 cycle. Its internal docs are given verbatim (ignore YAML frontmatter, ANCHOR markers, spec ids, CI names, session metadata, phase numbers).

EOF
for s in $batch; do
  pkt=$(sed -n '1s/^# PACKET: //p' "$SRC_DIR/$s.md" | sed -E 's/ \(.*//')
  echo "<<<FOLDER id=\"$pkt\""
  cat "$SRC_DIR/$s.md"
  echo "FOLDER"
  echo
done
cat <<'EOF'
## Action
For EACH folder, write one detailed changelog entry in this house style:

#### <concise feature/change title, <= 9 words>
A prose paragraph of 3-6 sentences: what changed and, where the source shows it, the before -> after; then why it matters to a framework user; then any key specifics (behaviors, renamed/removed items, files or components) grounded in the source. Do NOT invent anything not in the source. If a change is breaking, end the paragraph with "**Breaking:** ..." naming the migration.

Rules: plain English; benefit- and mechanism-rich, not a one-line bullet; one `####` block per folder; keep internal jargon out of the prose. If a folder is purely internal tooling with no user-visible effect, still write its entry and note it is internal.

## Format
Reply with ONLY the markdown `####` blocks, one per folder, in the given order. No preamble, no closing summary.
EOF
  } > "$pf"

  echo "ITER $NNN dispatching flash over: $(echo $batch | tr '\n' ' ')"
  dispatch_opencode "$EXTRACT_MODEL" "$pf" "$raw"
  if extract_markdown "$raw" "$out" && [ -s "$out" ]; then
    { printf '\n<!-- iteration %s -->\n' "$NNN"; cat "$out"; echo; } >> "$RMD"
    ts=$(TS); folders_json=$(echo $batch | tr ' ' '\n' | python3 -c "import sys,json;print(json.dumps([l for l in sys.stdin.read().split() if l]))")
    printf '{"type":"iteration","iteration":%s,"mode":"research","target_agent":"deep-research","resolved_route":"cli-opencode/opencode-go/deepseek-v4-flash","agent_definition_loaded":true,"folders":%s,"timestamp":"%s"}\n' "$N" "$folders_json" "$ts" > "$DELD/iter-$NNN.jsonl"
    echo "$batch" >> "$COVER"
    made=$((made+1)); echo "ITER $NNN OK -> $(wc -l <"$out") lines"
  else
    echo "ITER $NNN FAILED (empty reply) — not marking covered, will retry next run"
  fi
done
covered=$(grep -c . "$COVER" 2>/dev/null || echo 0)
echo "=== batch done: +$made iterations | coverage $covered/249 | research.md $(wc -l <"$RMD") lines ==="
