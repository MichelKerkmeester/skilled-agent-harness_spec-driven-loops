#!/usr/bin/env bash
# Assemble the v3.6-style v4 changelog: generate the opening + "What's New at a
# Glance" table and the Internal Seams + Upgrade Notes (DeepSeek-v4-pro), then
# stitch the 12 themed sections between them.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; source "$HERE/config.sh"; source "$HERE/lib.sh"
SECD="$WORK/narrative"; EXEMPLAR="$REPO/.opencode/skills/system-spec-kit/changelog/v3.6.0.0.md"
OUT="$SPEC/CHANGELOG-v4.0.0.0.md"
COMMITS=$(git -C "$REPO" rev-list --count "$BASELINE_TAG..HEAD")
ORDER="01-system-speckit 02-system-deep-loop 03-cli-external-orchestration 04-sk-doc 05-sk-design 06-sk-code 07-sk-git 08-sk-prompt 09-mcp-tooling 10-hooks 11-system-skill-advisor 12-agents"

allsections(){ for s in $ORDER; do [ -f "$SECD/$s.md" ] && { cat "$SECD/$s.md"; echo; }; done; }
have=$(for s in $ORDER; do [ -f "$SECD/$s.md" ] && echo x; done | wc -l | tr -d ' ')
[ "$have" -lt 12 ] && { echo "only $have/12 sections present — run dr-narrative.sh all first"; exit 1; }

# 1) opening + glance table
pf="$RAW_DIR/asm-open.prompt"; raw="$RAW_DIR/asm-open.raw"; open="$WORK/open.md"
{
cat <<EOF
## Role
You are the release-notes author for "OpenCode Spec-Kit", writing the TOP of the v4.0.0.0 changelog in the house voice. You have no tools; reply with markdown only.

## Style exemplar (match voice/shape of its title, opening, and glance table)
<<<EXEMPLAR
$(sed -n '1,24p' "$EXEMPLAR")
EXEMPLAR

## The full v4 sections (already written; summarize their story — do not repeat them)
<<<SECTIONS
$(allsections)
SECTIONS

## Action
Write ONLY the top of the changelog:
1. A title line: "# v4.0.0.0, <2-5 word tagline capturing this release's theme>"
2. A 2-3 paragraph human-voice opening: what this release is really about across all areas ($COMMITS commits since $BASELINE_TAG), what changed for the person using it, and what did NOT change on their everyday path.
3. "## What's New at a Glance" — a 2-column markdown table, 8-12 rows: **Bold theme label** | one-sentence plain-language benefit. Cover the biggest user-facing wins across the sections.

## Format
Reply with ONLY that markdown (title, opening paragraphs, glance table). No section bodies.
EOF
} > "$pf"
echo "assemble: opening + glance"; dispatch_opencode "$SYNTH_MODEL_OPENCODE" "$pf" "$raw"; extract_markdown "$raw" "$open"

# 2) internal seams + upgrade notes (from breaking lines + internal mentions)
pf2="$RAW_DIR/asm-tail.prompt"; raw2="$RAW_DIR/asm-tail.raw"; tail_md="$WORK/tail.md"
{
cat <<EOF
## Role
You are the release-notes author for "OpenCode Spec-Kit", writing the CLOSING of the v4.0.0.0 changelog in the house voice. Reply with markdown only.

## Style exemplar (match the "Internal Seams" and "Upgrade Notes" shape)
<<<EXEMPLAR
$(sed -n '213,231p' "$EXEMPLAR")
EXEMPLAR

## Material: every breaking/change/migration mention across the release
<<<BREAKING
$(allsections | grep -iE 'breaking|migrat|renamed|removed|deprecat|no longer' | sed 's/^[[:space:]]*//' | sort -u)
BREAKING

## Action
Write ONLY two closing sections:
1. "## Upgrade Notes" — a human-voice paragraph (and short list if needed) telling the reader exactly what they must do to move to v4: renames to adopt, removed things to re-route, flags that changed defaults. Ground it only in the breaking material above; if the common path needs nothing, say so.
2. "## Internal Seams (No User-Facing Change)" — a short bulleted list of the notable internal/structural changes worth naming for maintainers, drawn from the material. Keep each bullet to one or two sentences.

## Format
Reply with ONLY those two sections' markdown.
EOF
} > "$pf2"
echo "assemble: upgrade + seams"; dispatch_opencode "$SYNTH_MODEL_OPENCODE" "$pf2" "$raw2"; extract_markdown "$raw2" "$tail_md"

# 3) stitch
{
  cat "$open"; echo
  echo "---"; echo
  for s in $ORDER; do [ -f "$SECD/$s.md" ] && { cat "$SECD/$s.md"; echo; echo "---"; echo; }; done
  cat "$tail_md"; echo
} > "$OUT"
echo "=== assembled -> $OUT ($(wc -l <"$OUT") lines, $(grep -c '^## ' "$OUT") sections, $(grep -c '^#### ' "$OUT") features) ==="
