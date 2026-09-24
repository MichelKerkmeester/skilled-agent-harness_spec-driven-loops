#!/usr/bin/env bash
# Materialize a pre-v4 tag's spec tree as a v4 workspace, validate, repair the
# derivable facts, validate again. Everything lands under the scratchpad.
# Usage: fullrun.sh <tag>
set -uo pipefail
REPO="$(git rev-parse --show-toplevel)"
S="${HARNESS_SANDBOX:?set HARNESS_SANDBOX to a scratch directory outside the repo}"
TAG="$1"
W="$S/full-$TAG"
rm -rf "$W"; mkdir -p "$W/.opencode" "$W/raw"
( cd "$REPO" && git archive "$TAG" .opencode/specs ) | tar -x -C "$W/raw"
mv "$W/raw/.opencode/specs" "$W/specs"; rm -rf "$W/raw"
ln -sfn "$REPO/.skilled" "$W/.skilled"
echo "[$TAG] extracted $(find "$W/specs" -name spec.md | wc -l) spec.md files"

node "$(dirname "$0")/validate-all.cjs" "$W" "$S/$TAG.before.jsonl"
echo "[$TAG] before done"

( cd "$W" && node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --roots specs --apply > "$S/$TAG.repair.log" 2>&1 )
echo "[$TAG] repair-derived exit=$? $(grep -E 'inspected=' "$S/$TAG.repair.log")"

node "$(dirname "$0")/validate-all.cjs" "$W" "$S/$TAG.after.jsonl"
echo "[$TAG] after done"
echo "[$TAG] FINISHED"
