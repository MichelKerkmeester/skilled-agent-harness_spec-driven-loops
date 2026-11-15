#!/usr/bin/env zsh
# Runs one planning probe under an isolated advisor scope: a fresh temporary folder
# under $TMPDIR holds the socket, the advisor database, the directive receipts and a
# flags-file path that does not exist, and the folder is removed afterwards.
set -u
probe=$1; shift
root=$(git rev-parse --show-toplevel)
scope=$(mktemp -d "${TMPDIR:-/var/tmp/}vibe-probe.XXXXXX")
mkdir -p "$scope/ipc" "$scope/db" "$scope/state"
env -u AI_SESSION_CHILD -u SYSTEM_SKILL_ADVISOR_DISABLED -u SYSTEM_HOOKS_DISABLED \
  HOOK_FLAGS_CONFIG="$scope/no-such-hook-flags.env" \
  SPECKIT_IPC_SOCKET_DIR="$scope/ipc" \
  SYSTEM_SKILL_ADVISOR_DB_DIR="$scope/db" \
  MEMORY_DB_PATH="$scope/memory.sqlite" \
  SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR="$scope/state" \
  SPECKIT_ADVISOR_SHADOW_DELTA_PATH="$scope/shadow-deltas.jsonl" \
  SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED=0 \
  SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC=1 \
  node "$probe" "$root" "$@"
rc=$?
# The advisor can still write its skill-graph generation file for a moment after
# the probe exits, so the scope is removed after it has settled.
sleep 2
rm -rf "$scope"
exit $rc
