#!/usr/bin/env bash
# snap.sh <NN> <pre|post>: record the tree's porcelain status for one dispatch,
# and on post print what changed outside the other parallel builds' paths.
set -u
ROOT=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
W=$ROOT/specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/w3-build
cd "$ROOT" || exit 90
OTHER='^.. (\.skilled/skills/system-spec-kit/|\.skilled/hooks/goal/|\.skilled/hooks/README\.md|\.hermes/skills/system-spec-kit/|specs/cli-jev/003-cli-jev-workflow-integration/0(03|05|17)-[^/]+/|specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/scratch/)'
git status --porcelain --untracked-files=all | grep -Ev "$OTHER" | sort > "$W/logs/$1.$2.status"
if [ "$2" = post ]; then
  echo "--- changed since pre (outside other builds and this scratch):"
  comm -13 "$W/logs/$1.pre.status" "$W/logs/$1.post.status"
  echo "--- gone since pre:"
  comm -23 "$W/logs/$1.pre.status" "$W/logs/$1.post.status"
fi
