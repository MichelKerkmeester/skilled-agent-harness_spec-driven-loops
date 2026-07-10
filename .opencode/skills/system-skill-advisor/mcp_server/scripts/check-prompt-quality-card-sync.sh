#!/usr/bin/env bash
# ====================================================================
# check-prompt-quality-card-sync.sh — Drift guard for the 3-layer
#                                      prompt-knowledge architecture
# ====================================================================
# Enforces "one home per fact" across sk-prompt (framework engine),
# sk-prompt (prompt-models packet), and the 4 cli-* executors.
# Four structural checks (no semantic/NLP matching — pointer presence,
# table absence, registry completeness, trigger membership):
#
#   CHECK 1 — Table inlining: the 7-framework selection table and the
#             CLEAR table live ONLY in their canonical sk-prompt home,
#             never inlined in a cli-* executor card.
#   CHECK 2 — Tier-3 pointer-only: no cli-*/SKILL.md re-enumerates the
#             canonical Tier-3 escalation triggers; it must point to the
#             canonical card instead (prevents the precedence drift class).
#   CHECK 3 — Registry/profile/_index completeness: every adopted model
#             (a model_profiles.json entry with recommended_frameworks)
#             has a references/models/<id>.md profile AND an _index.md
#             row, and every profile maps back to a registry id
#             (prevents zero-hub-weight entries).
#   CHECK 4 — Discovery reachability: every adopted model is reachable by
#             name in EACH dispatching executor's graph-metadata.json
#             (prevents the model-unreachable-by-name class, e.g. qwen3.6).
#
# Canonical locations (allowed to carry the tables / the Tier-3 list):
#   .opencode/skills/sk-prompt/prompt-models/assets/cli_prompt_quality_card.md
#   .opencode/skills/sk-prompt/prompt-improve/references/patterns_evaluation.md
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
  "$ROOT/.opencode/skills/cli-external/cli-opencode/assets/prompt_quality_card.md"
  "$ROOT/.opencode/skills/cli-external/cli-claude-code/assets/prompt_quality_card.md"
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
echo "CHECK 2 — Tier-3 pointer-only (no inlined escalation triggers)"
cli_skills=(cli-external/cli-opencode cli-external/cli-claude-code)
for skill in "${cli_skills[@]}"; do
  f="$ROOT/.opencode/skills/$skill/SKILL.md"
  if [[ ! -f "$f" ]]; then echo "  MISSING: $skill/SKILL.md"; overall_exit=1; continue; fi
  if grep -Eiq -- 'stakeholder' "$f" && grep -Eiq -- 'ambiguous requirement' "$f"; then
    printf '  FAIL  %s/SKILL.md  [re-enumerates Tier-3 triggers — point to the canonical card instead]\n' "$skill"
    overall_exit=1
  elif ! grep -q 'cli_prompt_quality_card.md' "$f"; then
    printf '  FAIL  %s/SKILL.md  [no pointer to the canonical card]\n' "$skill"
    overall_exit=1
  else
    printf '  PASS  %s/SKILL.md\n' "$skill"
  fi
done

# ── CHECK 3 + 4 — completeness + discovery reachability ─────────────
# Registry parse in python3 (no jq dependency); pure structural asserts.
echo "CHECK 3 — registry / profile / _index completeness"
echo "CHECK 4 — discovery reachability (model name in each executor's triggers)"
if python3 - <<'PY'
import json, os, re, glob, sys

ROOT = os.environ["ROOT"]
H = f"{ROOT}/.opencode/skills/sk-prompt/prompt-models"
reg = json.load(open(f"{H}/assets/model_profiles.json"))
idx = open(f"{H}/references/models/_index.md").read()
all_ids = {m["id"] for m in reg["models"]}
adopted = [m for m in reg["models"] if m.get("recommended_frameworks")]

# Family token used for reachability (first id segment by default).
FAMILY = {"deepseek-v4-pro": "deepseek", "kimi-k2.6": "kimi",
          "qwen3.6": "qwen", "glm-5.1": "glm", "minimax-m3": "minimax",
          "minimax-2.7": "minimax", "mimo-v2.5-pro": "mimo"}

c3, c4 = [], []

# CHECK 3 — registry(adopted) -> profile + _index row
for m in adopted:
    mid = m["id"]
    if not os.path.isfile(f"{H}/references/models/{mid}.md"):
        c3.append(f"adopted model '{mid}' has NO profile references/models/{mid}.md (zero-hub-weight entry)")
    if mid not in idx:
        c3.append(f"adopted model '{mid}' missing from references/models/_index.md")
# CHECK 3 — profile -> registry id (no orphan profiles)
for p in sorted(glob.glob(f"{H}/references/models/*.md")):
    b = os.path.basename(p)
    if b == "_index.md":
        continue
    txt = open(p).read()
    mo = re.search(r'(?m)^model_id:\s*"?([^"\n]+)"?', txt)
    if not mo:
        c3.append(f"profile {b} has no model_id frontmatter")
    elif mo.group(1).strip() not in all_ids:
        c3.append(f"profile {b} model_id '{mo.group(1).strip()}' not in the registry")

# CHECK 4 — each adopted model reachable by family token in each dispatching executor
# cli-opencode and cli-claude-code no longer carry their own graph-metadata.json
# (the hub fold-in dissolved both into one hub identity); both
# resolve to the shared cli-external/graph-metadata.json, which folds the union
# of both former identities' trigger_phrases. Any other executor keeps the
# flat per-skill path.
CLI_EXECUTOR_HUB_METADATA = {
    "cli-opencode": "cli-external/graph-metadata.json",
    "cli-claude-code": "cli-external/graph-metadata.json",
}
gm_cache = {}
def gm(executor):
    if executor not in gm_cache:
        rel = CLI_EXECUTOR_HUB_METADATA.get(executor, f"{executor}/graph-metadata.json")
        path = f"{ROOT}/.opencode/skills/{rel}"
        gm_cache[executor] = open(path).read().lower() if os.path.isfile(path) else None
    return gm_cache[executor]

for m in adopted:
    mid = m["id"]
    tok = FAMILY.get(mid, mid.split("-")[0]).lower()
    for ex in sorted({e.get("executor") for e in m.get("executors", []) if e.get("executor")}):
        blob = gm(ex)
        if blob is None:
            c4.append(f"{mid} -> {ex}: executor graph-metadata.json not found")
        elif tok not in blob:
            c4.append(f"{mid} -> {ex}: not reachable by name (token '{tok}' absent from trigger_phrases)")

for label, fails in (("CHECK 3", c3), ("CHECK 4", c4)):
    if fails:
        for fmsg in fails:
            print(f"  FAIL  [{label}] {fmsg}")
    else:
        print(f"  PASS  [{label}] all clear")

sys.exit(1 if (c3 or c4) else 0)
PY
then :; else overall_exit=1; fi

# ── Summary ─────────────────────────────────────────────────────────
if [[ $overall_exit -eq 0 ]]; then
  echo "GUARD PASS — tables not inlined, Tier-3 pointer-only, registry complete, all models discoverable"
else
  echo "GUARD FAIL — see FAIL lines above" >&2
fi

exit $overall_exit
