#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# SCRIPT: verify-zombie-soak.sh
# ───────────────────────────────────────────────────────────────
# Verifies that each MCP launcher maintains a single live process after
# the launcher binaries have been live for ≥ 24 hours under normal
# multi-runtime use.
#
# Exit 0 = clean (≤ 1 launcher per server, no excess).
# Exit 1 = duplicates found (zombie state — investigate).
#
# Usage:
#   bash .opencode/skills/system-skill-advisor/mcp-server/scripts/verify-zombie-soak.sh
#   bash .opencode/skills/system-skill-advisor/mcp-server/scripts/verify-zombie-soak.sh --verbose
#
# Evidence capture:
#   bash .../verify-zombie-soak.sh --verbose > /tmp/soak-evidence-$(date +%Y%m%d).log 2>&1

set -euo pipefail

VERBOSE=0
case "${1:-}" in
  --verbose|-v) VERBOSE=1 ;;
esac

ts() { date -u +"%Y-%m-%dT%H:%M:%SZ"; }

count_launcher() {
  local pattern="$1"
  ps -eo command | grep -E "^node .*${pattern}" | grep -v grep | wc -l | tr -d '[:space:]'
}

count_child_context_server() {
  ps -eo command | grep -E "node.*context-server\.js" | grep -v grep | wc -l | tr -d '[:space:]'
}

list_launcher_pids() {
  local pattern="$1"
  ps -eo pid,etime,command | grep -E "^[[:space:]]*[0-9]+.*node .*${pattern}" | grep -v grep
}

SKILL_ADVISOR_COUNT=$(count_launcher "mk-skill-advisor-launcher")
CODE_INDEX_COUNT=$(count_launcher "mk-code-index-launcher")
SPEC_MEMORY_COUNT=$(count_launcher "mk-spec-memory-launcher")
CONTEXT_SERVER_COUNT=$(count_child_context_server)

EXIT=0

printf "=== Zero-Zombie Soak Verification ===\n"
printf "Timestamp: %s\n" "$(ts)"
printf "Working tree: %s\n" "$(pwd)"
printf "\n"
printf "Launcher process counts (target: ≤ 1 each):\n"
printf "  mk-skill-advisor-launcher: %s\n" "$SKILL_ADVISOR_COUNT"
printf "  mk-code-index-launcher:    %s\n" "$CODE_INDEX_COUNT"
printf "  mk-spec-memory-launcher:   %s\n" "$SPEC_MEMORY_COUNT"
printf "  context-server.js (child): %s\n" "$CONTEXT_SERVER_COUNT"
printf "\n"

# Verify each launcher count is at most 1.
if [ "$SKILL_ADVISOR_COUNT" -gt 1 ]; then
  printf "FAIL: mk-skill-advisor-launcher has %s instances (expected ≤ 1)\n" "$SKILL_ADVISOR_COUNT" >&2
  EXIT=1
fi
if [ "$CODE_INDEX_COUNT" -gt 1 ]; then
  printf "FAIL: mk-code-index-launcher has %s instances (expected ≤ 1)\n" "$CODE_INDEX_COUNT" >&2
  EXIT=1
fi
if [ "$SPEC_MEMORY_COUNT" -gt 1 ]; then
  printf "FAIL: mk-spec-memory-launcher has %s instances (expected ≤ 1)\n" "$SPEC_MEMORY_COUNT" >&2
  EXIT=1
fi
# context-server.js is the spec-memory child; should match spec-memory launcher count.
if [ "$CONTEXT_SERVER_COUNT" -gt 1 ]; then
  printf "FAIL: context-server.js has %s instances (expected ≤ 1)\n" "$CONTEXT_SERVER_COUNT" >&2
  EXIT=1
fi

# Verify any leftover .corrupt files (carry-over hygiene check).
CORRUPT_COUNT=$(find .opencode/skills/system-skill-advisor/mcp-server/database -name "*.corrupt*" 2>/dev/null | wc -l | tr -d '[:space:]')
printf "Quarantine files (.corrupt*) on disk: %s\n" "$CORRUPT_COUNT"
if [ "$CORRUPT_COUNT" -gt 0 ]; then
  printf "WARN: %s .corrupt* files present — soak window may have produced corruption.\n" "$CORRUPT_COUNT" >&2
  if [ "$VERBOSE" -eq 1 ]; then
    find .opencode/skills/system-skill-advisor/mcp-server/database -name "*.corrupt*" 2>/dev/null
  fi
fi

if [ "$VERBOSE" -eq 1 ]; then
  printf "\n=== Detailed launcher PIDs ===\n"
  printf "\n-- mk-skill-advisor-launcher --\n"
  list_launcher_pids "mk-skill-advisor-launcher" || true
  printf "\n-- mk-code-index-launcher --\n"
  list_launcher_pids "mk-code-index-launcher" || true
  printf "\n-- mk-spec-memory-launcher --\n"
  list_launcher_pids "mk-spec-memory-launcher" || true
fi

printf "\n"
if [ "$EXIT" -eq 0 ]; then
  printf "RESULT: PASS — no zombie launchers detected.\n"
else
  printf "RESULT: FAIL — duplicate launcher(s) present. The 006-skill-advisor lease invariants may be broken; investigate.\n"
fi

exit "$EXIT"
