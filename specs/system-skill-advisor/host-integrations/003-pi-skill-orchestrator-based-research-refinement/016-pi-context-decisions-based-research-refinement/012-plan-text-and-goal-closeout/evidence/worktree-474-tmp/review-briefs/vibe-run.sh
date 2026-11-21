#!/usr/bin/env bash
# Usage: vibe-run.sh <id> -- one read-only DeepSeek V4.1 Flash (max) review through Mistral Vibe.
set -uo pipefail
REPO=/Users/michelkerkmeester/worktrees/public/474-advisor-pasted-context-and-crash-fallback
SPEC=specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement
D=$REPO/tmp/review-briefs
ID=$1
command -v vibe >/dev/null || { echo "$ID vibe missing" >> "$D/vexits.txt"; exit 9; }
[ "$(vibe --version </dev/null)" = "vibe 3.1.2" ] || { echo "$ID wrong vibe version" >> "$D/vexits.txt"; exit 9; }
RUN_DIR=$(mktemp -d "${TMPDIR:-/tmp}/vibe-review-$ID-XXXXXX")
mkdir -p "$RUN_DIR/.vibe-home"
cp "$REPO/.vibe/config.toml" "$RUN_DIR/.vibe-home/config.toml"
node "$REPO/.vibe/plugins/repo-guards/render-home-hooks.cjs" "$RUN_DIR/.vibe-home" || exit 9
MISTRAL_API_KEY="$(/usr/bin/security find-generic-password -s ai.mistral.vibe -a MISTRAL_API_KEY -w)"
export MISTRAL_API_KEY
WORK="$REPO/tmp/vibe-scratch/$ID"
mkdir -p "$WORK"
cd "$WORK" && AI_SESSION_CHILD=1 SYSTEM_SPEC_GATE_ENFORCE=0 VIBE_SPEC_FOLDER="$REPO/$SPEC" VIBE_HOME="$RUN_DIR/.vibe-home" vibe --prompt-file "$D/vprompt-$ID.txt" --model deepseek-flash --add-dir "$REPO" --output-dir "$RUN_DIR/out" </dev/null > "$D/vout-$ID.txt" 2> "$D/verr-$ID.log"
CODE=$?
cp "$RUN_DIR/out/export.json" "$D/vexport-$ID.json" 2>/dev/null
echo "$ID EXIT=$CODE RUN_DIR=$RUN_DIR" >> "$D/vexits.txt"
