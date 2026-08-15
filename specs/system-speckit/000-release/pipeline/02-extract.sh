#!/usr/bin/env bash
# PHASE 2 (worker) — extract ONE packet's release fragment. Read-only: the model
# emits JSON on stdout, this parent writes the file. Resumable. Arg: <slug>
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; source "$HERE/config.sh"; source "$HERE/lib.sh"
mkdir -p "$FRAG_DIR" "$RAW_DIR" "$FAIL_DIR"
slug="$1"; src="$SRC_DIR/$slug.md"; frag="$FRAG_DIR/$slug.json"; raw="$RAW_DIR/$slug.txt"
[ -f "$src" ] || { echo "MISS $slug"; exit 0; }
if [ -s "$frag" ] && python3 -c "import json;json.load(open('$frag'))" 2>/dev/null; then echo "SKIP $slug"; exit 0; fi

packet=$(sed -n '1s/^# PACKET: //p' "$src" | sed -E 's/ \(.*//')
track=$(echo "$slug" | sed -E 's/__.*//')
pf="$RAW_DIR/$slug.prompt"
{
cat <<EOF
## Role
You are a release-notes writer for "OpenCode Spec-Kit", a developer framework of AI skills, commands and hooks. Turn ONE shipped work-packet's internal docs into a concise, user-facing release-notes fragment. You have no tools; reply with text only.

## Context
Packet id: $packet
Track/section: $track
Cycle: shipped in the $BASELINE_TAG -> $VERSION development cycle.

Internal source docs (verbatim; may contain YAML frontmatter and internal metadata you must IGNORE):
<<<SOURCE
EOF
cat "$src"
cat <<EOF
SOURCE

## Action
Write a release-notes fragment: what a framework USER can now do or what changed, and why it matters. IGNORE internal noise (YAML frontmatter, ANCHOR markers, spec-folder ids, CI check names, session/continuity metadata, phase numbers, commit hashes). Ground every bullet in the source; invent nothing. If the work is purely internal tooling/process, set audience "internal" and still summarize in 1-2 bullets.

Acceptance criteria:
- 1 to 5 bullets, each ONE sentence, benefit-first, plain English.
- breaking=true ONLY if the source shows a removed/renamed/changed PUBLIC behavior.
- audience "user-facing" if a framework user would notice, else "internal".

## Format
Reply with ONLY a fenced json block, exactly:
\`\`\`json
{"packet":"$packet","section":"$track","title":"<=8 words","audience":"user-facing|internal","breaking":false,"bullets":["..."]}
\`\`\`
EOF
} > "$pf"

dispatch_opencode "$EXTRACT_MODEL" "$pf" "$raw"; rc=$?
if extract_json "$raw" "$frag"; then echo "OK   $slug"; rm -f "$FAIL_DIR/$slug.err"; else echo "FAIL $slug (rc=$rc)"; cp "$raw" "$FAIL_DIR/$slug.err" 2>/dev/null; fi
