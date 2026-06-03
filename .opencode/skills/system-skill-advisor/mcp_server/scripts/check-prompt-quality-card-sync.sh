#!/usr/bin/env bash
# ====================================================================
# check-prompt-quality-card-sync.sh — Duplication guard for prompt
#                                     quality card framework tables
# ====================================================================
# Asserts that the 7-framework selection table and the CLEAR table
# exist ONLY in their canonical sk-prompt home and are NOT inlined
# in any of the 5 cli-* executor cards.
#
# Canonical locations (allowed to carry the tables):
#   .opencode/skills/sk-prompt/assets/cli_prompt_quality_card.md
#   .opencode/skills/sk-prompt/references/patterns_evaluation.md
#
# Checked cli-* cards (must NOT inline the tables):
#   .opencode/skills/cli-opencode/assets/prompt_quality_card.md
#   .opencode/skills/cli-gemini/assets/prompt_quality_card.md
#   .opencode/skills/cli-devin/assets/prompt_quality_card.md
#   .opencode/skills/cli-codex/assets/prompt_quality_card.md
#   .opencode/skills/cli-claude-code/assets/prompt_quality_card.md
#
# Exit codes:
#   0 — no cli-* card inlines either table (guard passes)
#   1 — a cli-* card is missing OR inlines a canonical table (guard fails)
#
# Usage: check-prompt-quality-card-sync.sh [repo-root]
set -euo pipefail

ROOT="${1:-.}"

# These patterns identify semantic table signals that must not appear
# in cli-* executor cards.  They tolerate spacing and case changes so
# copied canonical tables are still caught after light reformatting.
FRAMEWORK_HEADER_PATTERN='^[[:space:]]*\|[[:space:]]*Framework[[:space:]]*\|[[:space:]]*Best[[:space:]]+for[[:space:]]*\|[[:space:]]*Complexity[[:space:]]+band[[:space:]]*\|'
FRAMEWORK_ROW_PATTERN='^[[:space:]]*\|[^|]*`?RCAF`?[^|]*\|.*Role[[:space:]]*,[[:space:]]*Context[[:space:]]*,[[:space:]]*Action[[:space:]]*,[[:space:]]*Format'
CLEAR_DIMENSIONS=(Correctness Logic Expression Arrangement Reusability)

has_framework_table() {
  local card="$1"

  grep -Eiq -- "$FRAMEWORK_HEADER_PATTERN" "$card" \
    || grep -Eiq -- "$FRAMEWORK_ROW_PATTERN" "$card"
}

has_clear_matrix() {
  local card="$1"
  local dimension

  for dimension in "${CLEAR_DIMENSIONS[@]}"; do
    if ! grep -Eiq -- "^[[:space:]]*\|[^|]*${dimension}[^|]*\|" "$card"; then
      return 1
    fi
  done

  return 0
}

cli_cards=(
  "$ROOT/.opencode/skills/cli-opencode/assets/prompt_quality_card.md"
  "$ROOT/.opencode/skills/cli-gemini/assets/prompt_quality_card.md"
  "$ROOT/.opencode/skills/cli-devin/assets/prompt_quality_card.md"
  "$ROOT/.opencode/skills/cli-codex/assets/prompt_quality_card.md"
  "$ROOT/.opencode/skills/cli-claude-code/assets/prompt_quality_card.md"
)

overall_exit=0

for card in "${cli_cards[@]}"; do
  label="$(basename "$(dirname "$(dirname "$card")")")/assets/$(basename "$card")"

  if [[ ! -f "$card" ]]; then
    echo "MISSING: $label"
    overall_exit=1
    continue
  fi

  has_framework=0
  has_clear=0

  if has_framework_table "$card"; then
    has_framework=1
  fi

  if has_clear_matrix "$card"; then
    has_clear=1
  fi

  if [[ $has_framework -eq 1 || $has_clear -eq 1 ]]; then
    reasons=()
    [[ $has_framework -eq 1 ]] && reasons+=("framework-table")
    [[ $has_clear -eq 1 ]]    && reasons+=("CLEAR-table")
    printf 'FAIL  %s  [inlines: %s]\n' "$label" "$(IFS=','; echo "${reasons[*]}")"
    overall_exit=1
  else
    printf 'PASS  %s\n' "$label"
  fi
done

if [[ $overall_exit -eq 0 ]]; then
  echo "GUARD PASS — no cli-* card inlines the framework or CLEAR table"
else
  echo "GUARD FAIL — see FAIL lines above; thin the inlined tables from those cards" >&2
fi

exit $overall_exit
