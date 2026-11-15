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
# The probe can leave an advisor daemon serving the scope's socket. When that daemon
# shuts down it writes its generation file into the scope, which recreates a removed
# folder, so it is stopped and waited for before the scope is removed.
pids=$(lsof -t +D "$scope" 2>/dev/null | sort -u)
if [ -n "$pids" ]; then
  kill $=pids 2>/dev/null
  for _ in 1 2 3 4 5 6 7 8 9 10; do
    lsof -t +D "$scope" >/dev/null 2>&1 || break
    sleep 1
  done
fi
sleep 1
rm -rf "$scope"
exit $rc
