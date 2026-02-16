#!/usr/bin/env bash

# ------------------------------------------------------------------------------
# COMPONENT: AGENT PROVIDER STATUS
# ------------------------------------------------------------------------------
# Reports runtime/profile parity for `.opencode/agent/*.md` managed files.
#
# Usage: provider-status.sh
#
# Exit Codes:
#   0 - Runtime fully matches one provider profile
#   1 - Runtime is mixed/unknown
#   2 - Runtime root not found

set -euo pipefail

# ------------------------------------------------------------------------------
# 1. CLI HELP
# ------------------------------------------------------------------------------

usage() {
  cat <<'EOF'
Usage: provider-status.sh

Reports active provider state for runtime agents in .opencode/agent/*.md by
comparing runtime files against profile sources in .opencode/agent/copilot and
.opencode/agent/chatgpt.
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

# ------------------------------------------------------------------------------
# 2. PATH RESOLUTION
# ------------------------------------------------------------------------------

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
if [[ -z "$REPO_ROOT" ]]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"
fi

AGENT_ROOT="$REPO_ROOT/.opencode/agent"
COPILOT_DIR="$AGENT_ROOT/copilot"
CHATGPT_DIR="$AGENT_ROOT/chatgpt"
MARKER_FILE="$AGENT_ROOT/.active-provider"

declare -ar MANAGED=(context debug handover orchestrate research review speckit write)

if [[ ! -d "$AGENT_ROOT" ]]; then
  echo "ERROR: Agent root not found: $AGENT_ROOT" >&2
  exit 2
fi

# ------------------------------------------------------------------------------
# 3. STATUS REPORT
# ------------------------------------------------------------------------------

echo "Provider Status"
echo "- Runtime path: .opencode/agent/*.md"
echo "- Copilot profile: $([[ -d "$COPILOT_DIR" ]] && echo present || echo missing)"
echo "- ChatGPT profile: $([[ -d "$CHATGPT_DIR" ]] && echo present || echo missing)"

if [[ -f "$MARKER_FILE" ]]; then
  echo "- Marker: $(cat "$MARKER_FILE" 2>/dev/null || true)"
else
  echo "- Marker: (not set)"
fi

printf '\n%-14s %-10s %-10s %-10s\n' "Agent" "Runtime" "Copilot" "ChatGPT"
printf '%-14s %-10s %-10s %-10s\n' "--------------" "----------" "----------" "----------"

copilot_matches=0
chatgpt_matches=0
unknown=0

for agent in "${MANAGED[@]}"; do
  runtime_file="$AGENT_ROOT/$agent.md"
  copilot_file="$COPILOT_DIR/$agent.md"
  chatgpt_file="$CHATGPT_DIR/$agent.md"

runtime_state="ok"
[[ -f "$runtime_file" ]] || runtime_state="missing"

copilot_state="ok"
[[ -f "$copilot_file" ]] || copilot_state="missing"

chatgpt_state="ok"
[[ -f "$chatgpt_file" ]] || chatgpt_state="missing"

  active="unknown"
  if [[ "$runtime_state" == "ok" && "$copilot_state" == "ok" ]]; then
    if cmp -s "$runtime_file" "$copilot_file"; then
      active="copilot"
      copilot_matches=$((copilot_matches + 1))
    fi
  fi

  if [[ "$active" == "unknown" && "$runtime_state" == "ok" && "$chatgpt_state" == "ok" ]]; then
    if cmp -s "$runtime_file" "$chatgpt_file"; then
      active="chatgpt"
      chatgpt_matches=$((chatgpt_matches + 1))
    fi
  fi

  if [[ "$active" == "unknown" ]]; then
    unknown=$((unknown + 1))
  fi

printf '%-14s %-10s %-10s %-10s\n' "$agent" "$runtime_state" "$copilot_state" "$chatgpt_state"
echo "  -> active match: $active"
done

echo
echo "Summary"
echo "- Copilot matches: $copilot_matches/${#MANAGED[@]}"
echo "- ChatGPT matches: $chatgpt_matches/${#MANAGED[@]}"
echo "- Unknown/mixed: $unknown/${#MANAGED[@]}"

if [[ "$copilot_matches" -eq "${#MANAGED[@]}" ]]; then
  echo "- Active provider: copilot"
  exit 0
fi

if [[ "$chatgpt_matches" -eq "${#MANAGED[@]}" ]]; then
  echo "- Active provider: chatgpt"
  exit 0
fi

echo "- Active provider: mixed/unknown"
exit 1
