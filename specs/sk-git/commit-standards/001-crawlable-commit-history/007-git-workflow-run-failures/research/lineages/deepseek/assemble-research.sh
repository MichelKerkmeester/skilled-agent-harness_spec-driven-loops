#!/usr/bin/env bash
# Assemble research.md = synthesis header + every iteration file, in order.
set -eu
L="/Users/michelkerkmeester/worktrees/public/048-crawlable-commit-history/.opencode/specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek"
OUT="$L/research.md"
cat "$L/synthesis-header.md" > "$OUT"
for n in 001 002 003 004 005; do
  cat "$L/iterations/iteration-$n.md" >> "$OUT"
  printf '\n\n---\n\n' >> "$OUT"
done
wc -l "$OUT"
