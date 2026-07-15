#!/usr/bin/env bash
# Single-folder metadata regen worker: refreshes graph-metadata.json and
# description.json via the canonical generators (never hand-edited JSON).
set -euo pipefail

folder="$1"
scripts_dir="$REGEN_SCRIPTS_DIR"
specs_root="$REGEN_SPECS_ROOT"

cd "$REGEN_REPO_ROOT"

out_bf="$(SPEC_KIT_DB_DIR="$REGEN_DB_DIR" npx tsx "$scripts_dir/graph/backfill-graph-metadata.ts" "$folder" 2>&1)" || {
    echo "BACKFILL_FAIL $folder: $out_bf" >> "$REGEN_LOG_DIR/failures.log"
    exit 0
}

out_gd="$(SPEC_KIT_DB_DIR="$REGEN_DB_DIR" npx tsx "$scripts_dir/spec-folder/generate-description.ts" "$folder" "$specs_root" 2>&1)" || {
    echo "DESC_FAIL $folder: $out_gd" >> "$REGEN_LOG_DIR/failures.log"
    exit 0
}

echo "OK $folder" >> "$REGEN_LOG_DIR/success.log"
