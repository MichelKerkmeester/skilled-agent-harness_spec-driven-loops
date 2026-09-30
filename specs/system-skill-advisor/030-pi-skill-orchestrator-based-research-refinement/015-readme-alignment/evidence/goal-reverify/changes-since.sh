#!/usr/bin/env bash
# Writes to $1 what changed since the re-proof after phase 14 ran all 45 scenarios on the tree committed as
# 0dc044de8c: every later commit, the paths the scenarios run through, and the uncommitted edits in those paths.
set -u
cd "$(git rev-parse --show-toplevel)" || exit 1
BASE=0dc044de8c
CODE=(.skilled/skills/system-skill-advisor .skilled/hooks .opencode/plugins .skilled/bin/skill-advisor.cjs
  .skilled/bin/system-skill-advisor-launcher.cjs .skilled/bin/lib/launcher-ipc-bridge.cjs
  .skilled/skills/system-spec-kit/runtime/hooks .skilled/skills/system-spec-kit/runtime/dist/hooks
  .skilled/scripts/session-cleanup.sh .pi .codex .cursor .devin .claude/settings.json)
ROUTES=(.skilled/bin/compiled-route.cjs .skilled/bin/lib/compiled-routing)
{
echo "# What changed since the re-proof after phase 14, $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "That re-proof ran all 45 scenario runs on the tree committed as $BASE (12:49Z to 14:20Z, all PASS)."
echo
echo "## commits $BASE..$(git rev-parse --short HEAD)"
git log --format='%h %ad %s' --date=format:'%Y-%m-%dT%H:%M%z' $BASE..HEAD
echo
echo "## every path those commits changed outside specs/"
git diff --name-only $BASE..HEAD | grep -v '^specs/' || echo "(none)"
echo
echo "## of those, paths the scenarios run through"
git diff --name-only $BASE..HEAD -- "${CODE[@]}" "${ROUTES[@]}" || true
echo
echo "## advisor or hook code that reads the trigger index (the other changed data)"
git grep -l 'trigger-index' -- "${CODE[@]}" "${ROUTES[@]}" ':!*.md' ':!*.toml' || echo "(none)"
echo
echo "## uncommitted edits in the scenario paths, all from another session"
git status --porcelain -- "${CODE[@]}" "${ROUTES[@]}"
echo
echo "## which scenario-path files source hook-flags.sh"
git grep -l 'hook-flags\.sh' -- "${CODE[@]}" ':!*.md' ':!*test*' || echo "(none)"
echo
echo "## the only flags hook-flags.env sets (values), and whether it starts with a byte order mark"
grep -v -E '^[[:space:]]*(#|$)' .skilled/hooks/hook-flags.env
printf 'first bytes: '; head -c 3 .skilled/hooks/hook-flags.env | od -An -tx1
} > "$1"
