#!/usr/bin/env bash
# PHASE 5 — propose README edits (NOT applied). Auto-editing a 98KB shipped file
# with a cheap model is unsafe, so this emits a reviewable delta the operator (or
# a strong model) applies by hand. Bounded input: only version/link anchors.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; source "$HERE/config.sh"; source "$HERE/lib.sh"
mkdir -p "$(dirname "$OUT_README_DELTA")" "$RAW_DIR"
readme="$REPO/README.md"
anchors="$WORK/readme-anchors.txt"
grep -nE 'shields.io/github/v/release|[Vv][0-9]+\.[0-9]+|[Cc]hangelog|[Rr]elease [Nn]otes|version:' "$readme" 2>/dev/null | head -40 > "$anchors"

pf="$RAW_DIR/readme.prompt"; raw="$RAW_DIR/readme.raw"
{
cat <<EOF
## Role
You are proposing surgical edits to the public root README.md for the $VERSION release of OpenCode Spec-Kit. You have no tools; reply with markdown only. You are NOT editing the file — you propose a precise edit list a human will apply.

## Context
Release highlights:
<<<HIGHLIGHTS
EOF
sed -n '1,60p' "$WORK/intro.md" 2>/dev/null
cat <<EOF
HIGHLIGHTS

README lines that mention a version, release badge, changelog, or release-notes link (format "lineno:content"):
<<<ANCHORS
EOF
cat "$anchors"
cat <<EOF
ANCHORS

## Action
List the specific, minimal edits to bring the README to $VERSION: version/badge bumps, and fixing any stale "release notes" link to point at the new $VERSION notes. Only propose edits grounded in the anchors above; do not rewrite prose or invent sections. For each edit give the line number, the old text, and the new text.

## Format
Reply with ONLY markdown: a numbered list; each item = "Line N: \`old\` -> \`new\`" plus a one-line why. End with any edit you are UNSURE about under a "Needs human check" heading.
EOF
} > "$pf"
log "readme-delta: proposing edits (not applying)"
synth_dispatch "$pf" "$raw"; extract_markdown "$raw" "$OUT_README_DELTA"
log "PHASE5 -> $OUT_README_DELTA (PROPOSAL ONLY — review + apply by hand)"
mark_done phase5
