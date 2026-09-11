#!/usr/bin/env bash
# ====================================================================
# check-prompt-quality-card-sync.sh — Drift guard for the shared
#                                      prompt-knowledge layers
# ====================================================================
# Enforces "one home per fact" across sk-prompt (framework engine) and
# the 4 cli-* executors.
# Two structural checks (no semantic/NLP matching — pointer presence and
# table absence):
#
#   CHECK 1 — Table inlining: the 7-framework selection table and the
#             CLEAR table live ONLY in their canonical sk-prompt home,
#             never inlined in a cli-* executor card.
#   CHECK 2 — Deep-path pointer-only: no cli-*/SKILL.md re-enumerates the
#             canonical Tier-3 escalation triggers; it must point to the
#             canonical card instead (prevents the precedence drift class).
#
# Canonical locations (allowed to carry the tables / the Tier-3 list):
#   .opencode/skills/sk-prompt/assets/cli-prompt-quality-card.md
#   .opencode/skills/sk-prompt/references/patterns-evaluation.md
#
# Exit codes:
#   0 — all checks pass
#   1 — any check fails (see FAIL lines)
#
# Usage: check-prompt-quality-card-sync.sh [repo-root]
set -euo pipefail

ROOT="${1:-.}"
export ROOT

overall_exit=0

# ── CHECK 1 — framework / CLEAR table inlining ──────────────────────
FRAMEWORK_HEADER_PATTERN='^[[:space:]]*\|[[:space:]]*Framework[[:space:]]*\|[[:space:]]*Best[[:space:]]+for[[:space:]]*\|[[:space:]]*Complexity[[:space:]]+band[[:space:]]*\|'
FRAMEWORK_ROW_PATTERN='^[[:space:]]*\|[^|]*`?RCAF`?[^|]*\|.*Role[[:space:]]*,[[:space:]]*Context[[:space:]]*,[[:space:]]*Action[[:space:]]*,[[:space:]]*Format'
CLEAR_DIMENSIONS=(Correctness Logic Expression Arrangement Reusability)

has_framework_table() {
  local card="$1"
  grep -Eiq -- "$FRAMEWORK_HEADER_PATTERN" "$card" \
    || grep -Eiq -- "$FRAMEWORK_ROW_PATTERN" "$card"
}

has_clear_matrix() {
  local card="$1" dimension
  for dimension in "${CLEAR_DIMENSIONS[@]}"; do
    grep -Eiq -- "^[[:space:]]*\|[^|]*${dimension}[^|]*\|" "$card" || return 1
  done
  return 0
}

cli_cards=(
  "$ROOT/.opencode/skills/cli-external-orchestration/cli-opencode/assets/prompt-quality-card.md"
  "$ROOT/.opencode/skills/cli-external-orchestration/cli-claude-code/assets/prompt-quality-card.md"
  "$ROOT/.opencode/skills/cli-external-orchestration/cli-cursor/assets/prompt-quality-card.md"
  "$ROOT/.opencode/skills/cli-external-orchestration/cli-pi/assets/prompt-quality-card.md"
  "$ROOT/.opencode/skills/cli-external-orchestration/cli-codex/assets/prompt-quality-card.md"
  "$ROOT/.opencode/skills/cli-external-orchestration/cli-devin/assets/prompt-quality-card.md"
)

echo "CHECK 1 — framework / CLEAR table inlining"
for card in "${cli_cards[@]}"; do
  label="$(basename "$(dirname "$(dirname "$card")")")/assets/$(basename "$card")"
  if [[ ! -f "$card" ]]; then
    echo "  MISSING: $label"; overall_exit=1; continue
  fi
  has_framework=0; has_clear=0
  has_framework_table "$card" && has_framework=1
  has_clear_matrix "$card" && has_clear=1
  if [[ $has_framework -eq 1 || $has_clear -eq 1 ]]; then
    reasons=()
    [[ $has_framework -eq 1 ]] && reasons+=("framework-table")
    [[ $has_clear -eq 1 ]] && reasons+=("CLEAR-table")
    printf '  FAIL  %s  [inlines: %s]\n' "$label" "$(IFS=','; echo "${reasons[*]}")"
    overall_exit=1
  else
    printf '  PASS  %s\n' "$label"
  fi
done

# ── CHECK 2 — Tier-3 escalation rule is pointer-only in cli-*/SKILL.md ─
# The enumerated trigger list is canonical ONLY in the sk-prompt card.
# A cli-*/SKILL.md that re-enumerates it (signature: a line naming both
# "stakeholder" and "ambiguous requirement") has drifted — must point.
echo "CHECK 2 — Deep-path pointer-only (no inlined escalation triggers)"
cli_skills=(cli-external-orchestration/cli-opencode cli-external-orchestration/cli-claude-code cli-external-orchestration/cli-cursor cli-external-orchestration/cli-pi cli-external-orchestration/cli-codex cli-external-orchestration/cli-devin)
for skill in "${cli_skills[@]}"; do
  f="$ROOT/.opencode/skills/$skill/SKILL.md"
  if [[ ! -f "$f" ]]; then echo "  MISSING: $skill/SKILL.md"; overall_exit=1; continue; fi
  if grep -Eiq -- 'stakeholder' "$f" && grep -Eiq -- 'ambiguous requirement' "$f"; then
    printf '  FAIL  %s/SKILL.md  [re-enumerates deep-path triggers — point to the canonical card instead]\n' "$skill"
    overall_exit=1
  elif ! grep -q 'cli-prompt-quality-card.md' "$f"; then
    local_card="$ROOT/.opencode/skills/$skill/assets/prompt-quality-card.md"
    if [[ -f "$local_card" ]] && grep -q 'cli-prompt-quality-card.md' "$local_card"; then
      printf '  PASS  %s/SKILL.md  [canonical card delegated through local prompt-quality card]\n' "$skill"
    else
      printf '  FAIL  %s/SKILL.md  [no pointer to the canonical card]\n' "$skill"
      overall_exit=1
    fi
  else
    printf '  PASS  %s/SKILL.md\n' "$skill"
  fi
done

# ── Summary ─────────────────────────────────────────────────────────
if [[ $overall_exit -eq 0 ]]; then
  echo "GUARD PASS — tables not inlined, deep-path pointer-only"
else
  echo "GUARD FAIL — see FAIL lines above" >&2
fi

exit $overall_exit
