#!/usr/bin/env bash
# Rewrite the by-skill changelog into the v3.6 house style (human-voiced, themed
# narrative). DeepSeek-Flash writes each themed section using the real v3.6.0.0
# changelog as a few-shot style exemplar. Parent assembles.
# Usage: dr-narrative.sh <track|all>
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; source "$HERE/config.sh"; source "$HERE/lib.sh"
BYSKILL="$SPEC/003-deep-research-synthesis/changelog-by-skill.md"
EXEMPLAR="$REPO/.opencode/skills/system-spec-kit/changelog/v3.6.0.0.md"
SECD="$WORK/narrative"; mkdir -p "$SECD" "$RAW_DIR" "$FAIL_DIR"

# skill -> (order, source section title in by-skill doc, narrative theme title)
themes(){ cat <<'EOF'
01|system-speckit|Spec Kit & Memory|Spec Kit & Memory
02|system-deep-loop|Deep Loop|The Deep Loops, Unified and Extended
03|cli-external-orchestration|External CLI Orchestration|Orchestrating Other AIs
04|sk-doc|Documentation (sk-doc)|Documentation as a System
05|sk-design|Design (sk-design)|The Design Surface
06|sk-code|Code (sk-code)|One Code Skill
07|sk-git|Git (sk-git)|Safer Git
08|sk-prompt|Prompt (sk-prompt)|Prompt Engineering
09|mcp-tooling|MCP Tooling|MCP Tooling
10|hooks|Hooks & Runtime|Hooks, Goals and the Runtime
11|system-skill-advisor|Skill Advisor|The Skill Advisor
12|agents|Agents|Agent Discipline
EOF
}

extract_section(){ # arg: source section title -> that skill's per-folder block from by-skill doc
  awk -v t="## $1" 'index($0,t)==1{p=1;next} p&&/^## /{exit} p&&/^---/{next} p' "$BYSKILL"
}

synth_theme(){ # args: ord track srctitle themetitle
  local ord="$1" track="$2" src="$3" theme="$4"
  local out="$SECD/$ord-$track.md"; [ -s "$out" ] && { echo "SKIP $track"; return 0; }
  local material; material="$(extract_section "$src")"
  [ -z "$material" ] && { echo "EMPTY $track"; return 0; }
  local pf="$RAW_DIR/nar-$track.prompt" raw="$RAW_DIR/nar-$track.raw"
  local SELECT RANGE
  if [ "${STRICT:-0}" = "1" ]; then
    SELECT="Be RUTHLESS. Select ONLY the highest-scope changes in this area: big refactors, brand-new capabilities, and breaking changes a user must know. DROP everything minor — small bug fixes, doc-only reconciliations, internal scaffolds, benchmark/validation runs, metadata cleanups, and anything that shipped no user-visible change. Do NOT give minor items their own block; at most fold them into a single closing sentence."
    RANGE="2 to 4"
  else
    SELECT="Merge related folders into features."
    RANGE="3 to 8"
  fi
  {
cat <<EOF
## Role
You are the release-notes author for "OpenCode Spec-Kit", writing in the house voice. You have no tools; reply with markdown only.

## Context — STYLE EXEMPLAR (match this voice and shape exactly)
The following is a real prior changelog. Study its voice: human and warm, second person ("you"/"your"), leads with what the user experiences then the mechanism, explains any jargon inline in parentheses, groups by theme not by folder, uses "#### Feature Name" blocks separated by "&nbsp;". Do NOT copy its content — only its voice and structure.

<<<EXEMPLAR
$(cat "$EXEMPLAR")
EXEMPLAR

## Context — RAW MATERIAL for the "$theme" section (this release, v3.6.0.0 -> v4.0.0.0)
Per-folder changelog summaries for this area. Merge related folders into a few themed "#### " features; do not write one block per folder. Ground everything here; invent nothing.

<<<MATERIAL
$material
MATERIAL

## Action
Write ONE section of the new changelog for the "$theme" area, in the exemplar's voice:
- Start with "## $theme"
- A 1-2 sentence human intro paragraph: what this area's story is this release.
- $SELECT
- Then $RANGE "#### <Feature Name>" blocks (Title Case names, NOT folder ids), each a 2-5 sentence human-voice paragraph. Lead with what the user gets, then how; explain jargon inline; flag breaking changes in-prose.
- Put "&nbsp;" on its own line between consecutive "####" blocks.
- If this whole area is minor or internal, keep the section to 1-2 sentences with no blocks, or a single block, so it does not compete with the bigger changes.

## Format
Reply with ONLY the markdown for this one section. No preamble, no other sections.
EOF
  } > "$pf"
  echo "synth: $theme ($track)"
  dispatch_opencode "$SYNTH_MODEL_OPENCODE" "$pf" "$raw"   # pro model for narrative quality
  if extract_markdown "$raw" "$out" && [ -s "$out" ]; then echo "OK $track ($(wc -l <"$out") lines)"; else echo "FAIL $track"; rm -f "$out"; fi
}

target="${1:-all}"
themes | while IFS='|' read -r ord track src theme; do
  [ "$target" = "all" ] || [ "$target" = "$track" ] || continue
  synth_theme "$ord" "$track" "$src" "$theme"
done
