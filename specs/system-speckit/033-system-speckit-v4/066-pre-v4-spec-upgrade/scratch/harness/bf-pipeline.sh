#!/usr/bin/env bash
# Full existing-tool pipeline on a pre-v4 tag, in a sandbox that holds a real
# copy of system-spec-kit so every tool's project boundary is the sandbox:
#   backfill-frontmatter --apply  ->  repair-derived --apply  ->  validate all.
# Usage: bf-pipeline.sh <tag> [--include-archive]
set -uo pipefail
REPO="$(git rev-parse --show-toplevel)"
S="${HARNESS_SANDBOX:?set HARNESS_SANDBOX to a scratch directory outside the repo}"
TAG="$1"; ARCH="${2:-}"
W="$S/bf-$TAG"
rm -rf "$W"; mkdir -p "$W/.opencode" "$W/.skilled/skills" "$W/raw"
rsync -a --exclude node_modules "$REPO/.skilled/skills/system-spec-kit" "$W/.skilled/skills/"
ln -s "$REPO/.skilled/skills/system-spec-kit/node_modules" "$W/.skilled/skills/system-spec-kit/node_modules"
( cd "$REPO" && git archive "$TAG" .opencode/specs ) | tar -x -C "$W/raw"
mv "$W/raw/.opencode/specs" "$W/specs"; rm -rf "$W/raw"
echo "[bf $TAG] sandbox ready"

cd "$W"
node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/backfill-frontmatter.js --apply --skip-templates --allow-malformed $ARCH --roots specs --report "$W/bf-apply.json" > "$W/bf-apply.log" 2>&1
echo "[bf $TAG] backfill-frontmatter exit=$? $(node -e 'console.log(JSON.stringify(require(process.argv[1]).summary))' "$W/bf-apply.json")"

node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --roots specs --apply > "$W/rd.log" 2>&1
echo "[bf $TAG] repair-derived exit=$? $(grep -E 'inspected=' "$W/rd.log")"

node "$(dirname "$0")/validate-all.cjs" "$W" "$S/$TAG.pipeline.jsonl"
echo "[bf $TAG] FINISHED"
