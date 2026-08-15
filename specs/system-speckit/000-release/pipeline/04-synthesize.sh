#!/usr/bin/env bash
# PHASE 3b — synthesize one user-facing section per track from its fragments,
# using the configured cheap synth model. Small inputs; one call per section.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; source "$HERE/config.sh"; source "$HERE/lib.sh"
mkdir -p "$OUT_SECTIONS" "$RAW_DIR"

# friendly section titles per track
title_for(){ case "$1" in
  cli-external-orchestration) echo "External CLI Orchestration";;
  system-deep-loop) echo "Deep Loop";;
  system-speckit) echo "Spec Kit & Memory";;
  sk-doc) echo "Documentation (sk-doc)";;
  sk-code) echo "Code (sk-code)";;
  sk-git) echo "Git (sk-git)";;
  sk-design) echo "Design (sk-design)";;
  sk-prompt) echo "Prompt (sk-prompt)";;
  mcp-tooling) echo "MCP Tooling";;
  hooks) echo "Hooks & Runtime";;
  system-skill-advisor) echo "Skill Advisor";;
  agents) echo "Agents";;
  *) echo "$1";; esac; }

for b in "$WORK/buckets"/uf__*.json; do
  [ -f "$b" ] || continue
  track=$(basename "$b" .json | sed 's/^uf__//')
  title=$(title_for "$track")
  out="$OUT_SECTIONS/$track.md"
  [ -s "$out" ] && { log "section $track exists, skip"; continue; }
  pf="$RAW_DIR/section_$track.prompt"; raw="$RAW_DIR/section_$track.raw"
  {
cat <<EOF
## Role
You are the editor writing the "$title" section of the $VERSION release notes for the OpenCode Spec-Kit framework. You have no tools; reply with markdown only.

## Context
Below are per-packet release fragments (JSON) for this section, extracted from shipped work. Each has a title and user-facing bullets.
<<<FRAGMENTS
EOF
cat "$b"
cat <<EOF
FRAGMENTS

## Action
Write the "$title" section. Group related packets into a coherent narrative; merge duplicates; lead with the most user-visible changes. Keep only what a framework USER cares about. Do not invent anything beyond the fragments. Flag any breaking change explicitly.

## Format
Reply with ONLY markdown, starting with:
### $title
then 4-10 concise bullets (merge/rank the fragment bullets; one sentence each). If any fragment has breaking=true, add a final line "**Breaking:** ...".
EOF
  } > "$pf"
  log "synth section: $track ($title)"
  synth_dispatch "$pf" "$raw"
  extract_markdown "$raw" "$out"
done
log "PHASE3b sections -> $OUT_SECTIONS"
mark_done phase3b
