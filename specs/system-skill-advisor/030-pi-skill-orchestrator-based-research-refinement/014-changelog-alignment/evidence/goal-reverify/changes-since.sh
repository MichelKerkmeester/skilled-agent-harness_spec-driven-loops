#!/usr/bin/env bash
# Writes the record of commits and scenario-path changes since the phase 11 matrix, the last run of all 45, to $1.
# The paths include the compiled-route front door and route manifests, which the advisor reads when it attaches a
# compiled route to a hub recommendation.
set -u
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public || exit 1
CODE=(.skilled/skills/system-skill-advisor .skilled/hooks .opencode/plugins .skilled/bin/skill-advisor.cjs
  .skilled/bin/system-skill-advisor-launcher.cjs .skilled/bin/lib/launcher-ipc-bridge.cjs
  .skilled/skills/system-spec-kit/runtime/hooks .skilled/skills/system-spec-kit/runtime/dist/hooks
  .pi .codex .cursor .devin .claude/settings.json)
ROUTES=(.skilled/bin/compiled-route.cjs .skilled/bin/lib/compiled-routing)
{
echo "# What changed since the phase 11 goal re-verification, $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "The phase 11 scenario matrix, the last run of all 45, ran on the tree committed as 146ab446f2. This lists every"
echo "later commit and the paths the scenarios run through. The re-proof after phase 14 reruns all 45 and carries none."
echo
echo "## commits 146ab446f2..$(git rev-parse --short HEAD)"
git log --format='%h %ad %s' --date=format:'%Y-%m-%dT%H:%M%z' 146ab446f2..HEAD
echo
echo "## advisor runtime, launcher, CLI front door, hooks, plugins and CLI hook configs"
git diff --stat 146ab446f2..HEAD -- "${CODE[@]}" | cat
echo
echo "## of those, anything outside changelog entries"
git diff --name-only 146ab446f2..HEAD -- "${CODE[@]}" | grep -v '/changelog/' || echo "(none)"
echo
echo "## compiled-route front door and route manifests"
git diff --stat 146ab446f2..HEAD -- "${ROUTES[@]}" | cat
echo
echo "## uncommitted changes in all of those paths, this phase's and other sessions'"
git status --porcelain -- "${CODE[@]}" "${ROUTES[@]}" | cat
} > "$1"
