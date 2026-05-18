#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
WORKSPACE="$(cd "$SCRIPT_DIR/../../../../../../.." && pwd)"
LOG_FILE="$SCRIPT_DIR/delete-spec-kit-smoke.log"

SKILLS_DIR="$WORKSPACE/.opencode/skills"
CG_DIR="$SKILLS_DIR/system-code-graph"
SA_DIR="$SKILLS_DIR/system-skill-advisor/mcp_server"
SK_DIR="$SKILLS_DIR/system-spec-kit"

RESTORE_PATH=""

cleanup() {
  if [ -n "$RESTORE_PATH" ] && [ -d "$RESTORE_PATH" ]; then
    mv "$RESTORE_PATH" "$SK_DIR" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "=== delete-spec-kit smoke test ===" | tee "$LOG_FILE"
echo "Date: $(date -u +%Y-%m-%dT%H:%M:%SZ)" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

BASELINE_SHA=$(git -C "$WORKSPACE" rev-parse HEAD)
echo "$BASELINE_SHA" > /tmp/040C-baseline-sha.txt
echo "Baseline SHA: $BASELINE_SHA" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

if [ ! -d "$SK_DIR" ]; then
  echo "ERROR: system-spec-kit not found at $SK_DIR" | tee -a "$LOG_FILE"
  exit 1
fi

STASH_PATH="/tmp/spec-kit-stashed-$(date +%s)"
echo "Removing system-spec-kit to $STASH_PATH ..." | tee -a "$LOG_FILE"
mv "$SK_DIR" "$STASH_PATH"
RESTORE_PATH="$STASH_PATH"

ls "$SKILLS_DIR" > /tmp/040C-post-rename-skills.log
echo "Skills after rename:" | tee -a "$LOG_FILE"
cat /tmp/040C-post-rename-skills.log | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo "--- Running tsc on system-code-graph ---" | tee -a "$LOG_FILE"
CG_EXIT=0
(cd "$CG_DIR" && npx --no-install tsc --noEmit -p tsconfig.json 2>&1) || CG_EXIT=$?
echo "code-graph tsc exit: $CG_EXIT" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo "--- Running tsc on system-skill-advisor ---" | tee -a "$LOG_FILE"
SA_EXIT=0
(cd "$SA_DIR" && npx --no-install tsc --noEmit -p tsconfig.json 2>&1) || SA_EXIT=$?
echo "skill-advisor tsc exit: $SA_EXIT" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo "--- Restoring system-spec-kit ---" | tee -a "$LOG_FILE"
mv "$STASH_PATH" "$SK_DIR"
RESTORE_PATH=""
if [ -d "$SK_DIR" ]; then
  echo "restored" | tee -a "$LOG_FILE"
else
  echo "RESTORE FAILED" | tee -a "$LOG_FILE"
  exit 1
fi
echo "" | tee -a "$LOG_FILE"

echo "--- Post-restore tsc on system-code-graph ---" | tee -a "$LOG_FILE"
CG_POST_EXIT=0
(cd "$CG_DIR" && npx --no-install tsc --noEmit -p tsconfig.json 2>&1) || CG_POST_EXIT=$?
echo "post-restore code-graph tsc exit: $CG_POST_EXIT" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo "--- Post-restore tsc on system-skill-advisor ---" | tee -a "$LOG_FILE"
SA_POST_EXIT=0
(cd "$SA_DIR" && npx --no-install tsc --noEmit -p tsconfig.json 2>&1) || SA_POST_EXIT=$?
echo "post-restore skill-advisor tsc exit: $SA_POST_EXIT" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo "=== SUMMARY ===" | tee -a "$LOG_FILE"
echo "Baseline SHA: $BASELINE_SHA" | tee -a "$LOG_FILE"
echo "code-graph tsc exit (spec-kit removed): $CG_EXIT" | tee -a "$LOG_FILE"
echo "skill-advisor tsc exit (spec-kit removed): $SA_EXIT" | tee -a "$LOG_FILE"
echo "system-spec-kit restored: $(test -d "$SK_DIR" && echo YES || echo NO)" | tee -a "$LOG_FILE"
echo "post-restore code-graph tsc exit: $CG_POST_EXIT" | tee -a "$LOG_FILE"
echo "post-restore skill-advisor tsc exit: $SA_POST_EXIT" | tee -a "$LOG_FILE"
echo "" | tee -a "$LOG_FILE"

echo "=== INTERPRETATION ===" | tee -a "$LOG_FILE"
cat <<'INTERPRET' | tee -a "$LOG_FILE"
This smoke test verifies the three-way isolation contract by physically removing
system-spec-kit and running tsc --noEmit on the other two skills. system-code-graph
is expected to compile cleanly (exit 0), confirming full Path-1 decoupling — all
its dependencies have been copied locally under lib/shared/. system-skill-advisor
is expected to fail (non-zero exit) because its lib/shared/embeddings/ is an
intentional symlink to system-spec-kit/shared/embeddings/. This visible cross-skill
marker is a documented exception — verifying it breaks when the target is removed
proves the marker is live and not a dead symlink. After restoring system-spec-kit,
both skills should return to exit 0, confirming the smoke test caused no permanent
damage.
INTERPRET
echo "" | tee -a "$LOG_FILE"

echo "Done." | tee -a "$LOG_FILE"
