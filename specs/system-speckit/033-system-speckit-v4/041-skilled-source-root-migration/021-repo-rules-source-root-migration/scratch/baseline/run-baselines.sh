#!/usr/bin/env bash
# Records the before-state of every check this migration re-runs, so each later
# comparison has an observation that could have come out differently.
set -uo pipefail

cd "$(git rev-parse --show-toplevel)"
OUT="${1:-}"
[ -n "$OUT" ] || { echo "usage: run-baselines.sh <out-dir>" >&2; exit 2; }
mkdir -p "$OUT"

run() {
  local name="$1"; shift
  {
    echo "\$ $*"
    "$@"
    echo "exit=$?"
  } > "$OUT/$name.txt" 2>&1
}

run corpus-checker  node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs
run gate-inputs     bash .github/scripts/check-gate-inputs.sh
run markdown-links  node .skilled/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs

run sync-runtime-mirrors  node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
run sync-agents-codex     node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-agents.cjs --check
run sync-prompts-codex    node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs --check
run sync-agents-pi        node .skilled/skills/system-spec-kit/runtime/cli/pi/sync-agents-pi.cjs --check
run sync-skills-hermes    node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check

run doctor-agent-roster      node .skilled/commands/doctor/scripts/agent-roster-mirror-check.cjs
run doctor-command-catalog   node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs

{
  git rev-parse HEAD
  git status --porcelain
} > "$OUT/worktree-state.txt" 2>&1

git ls-files -s -- specs > "$OUT/freeze-specs.txt"
git ls-files -s -- ':(glob)**/changelog/**' ':!:(glob)**/node_modules/**' > "$OUT/freeze-changelog.txt"
git ls-files -s -- ':(glob)**/benchmark/reports/**' ':!:(glob)**/node_modules/**' > "$OUT/freeze-benchmark-reports.txt"
git ls-files -s -- \
  .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/latency-report.json \
  .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/semantic-probes.json \
  .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/recipe-execution.json \
  .skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/daemon-off-proof.json \
  > "$OUT/freeze-captured-once.txt"

for f in "$OUT"/*.txt; do
  printf '%-28s lines=%s\n' "$(basename "$f")" "$(wc -l < "$f" | tr -d ' ')"
done
