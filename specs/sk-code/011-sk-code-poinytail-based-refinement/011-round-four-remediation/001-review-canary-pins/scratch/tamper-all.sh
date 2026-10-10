#!/usr/bin/env bash
# Renames each AGENTS.md evidence-floor label in a scratch copy of the canary's inputs
# and counts how many renames the canary rejects. Writes only under this script's folder.
# Usage: bash tamper-all.sh [source-root]   (default: the current directory, the repository root)
set -uo pipefail
SRC="$(cd "${1:-.}" && pwd)"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WORK="$HERE/tamper-tree"
CHECKER="$SRC/.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js"
FILES=(
  ".skilled/skills/sk-code/sk-code-review/SKILL.md"
  ".skilled/skills/sk-code/sk-code-review/README.md"
  ".skilled/skills/sk-code/sk-code-review/changelog/v1.3.0.0.md"
  ".skilled/skills/sk-code/sk-code-review/references/pr-state-dedup.md"
  ".skilled/skills/sk-code/sk-code-review/references/review-ux-single-pass.md"
  ".skilled/skills/sk-code/shared/references/workflow-verify.md"
  ".skilled/skills/sk-code/shared/references/universal/code-quality-standards.md"
  "AGENTS.md"
)
for rel in "${FILES[@]}"; do
  mkdir -p "$WORK/$(dirname "$rel")"
  cp "$SRC/$rel" "$WORK/$rel"
done
caught=0
for label in '**Confirmed vs inferred**' '**Observed command evidence**' '**Finding = hypothesis**' '**Your own read is also one lens**'; do
  cp "$SRC/AGENTS.md" "$WORK/AGENTS.md"
  LABEL="$label" node -e 'const fs=require("fs");const f=process.argv[1];fs.writeFileSync(f, fs.readFileSync(f,"utf8").split(process.env.LABEL).join("**renamed floor**"));' "$WORK/AGENTS.md"
  out="$(node "$CHECKER" --root "$WORK" 2>&1)"
  code=$?
  if [ "$code" -eq 1 ] && printf '%s' "$out" | grep -qF -- "missing exact invariant string: \"$label\""; then
    echo "CAUGHT $label"
    caught=$((caught + 1))
  else
    echo "MISSED $label (exit $code)"
  fi
done
cp "$SRC/AGENTS.md" "$WORK/AGENTS.md"
echo "RESULT: $caught of 4 label renames caught"
