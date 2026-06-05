#!/usr/bin/env bash
# Install git clean/smudge filters that keep the maintainer-mode code-graph
# flags in opencode.json LOCAL ONLY — every commit/push has them set to
# "false" (the framework default) while your working tree keeps them "true".
#
# Run this once after cloning. The filters are stored in .git/config which
# is per-clone (not committed), so each maintainer needs to run it once on
# each machine.
#
# Idempotent: safe to re-run.

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
REPO_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
cd "${REPO_ROOT}"

if [[ ! -d .git ]]; then
  echo "ERROR: not a git repo (no .git/ at ${REPO_ROOT})" >&2
  exit 1
fi

# CLEAN filter: working tree -> index. Strips maintainer mode for commits.
#   Replaces SPECKIT_CODE_GRAPH_INDEX_<NAME> = "true" with "false".
#   Format-agnostic: matches both JSON ("KEY": "true") and TOML (KEY = "true").
#   sed is reentry-safe: if the file already has "false", nothing happens.
git config filter.maintainer-flags.clean \
  'sed -E "s/(\"?SPECKIT_CODE_GRAPH_INDEX_(SKILLS|AGENTS|COMMANDS|SPECS|PLUGINS)\"?[ ]*[:=][ ]*)\"true\"/\1\"false\"/g"'

# SMUDGE filter: index -> working tree. Re-enables maintainer mode locally
#   on checkout/pull/clone. Replaces "false" with "true" for the same keys.
git config filter.maintainer-flags.smudge \
  'sed -E "s/(\"?SPECKIT_CODE_GRAPH_INDEX_(SKILLS|AGENTS|COMMANDS|SPECS|PLUGINS)\"?[ ]*[:=][ ]*)\"false\"/\1\"true\"/g"'

# Required: tell git the filter is REQUIRED so a missing/failing filter
# fails loudly instead of silently letting an unfiltered file through.
git config filter.maintainer-flags.required true

echo "Installed clean+smudge filters for opencode.json maintainer flags."
echo
echo "To rehydrate your working tree through the smudge filter so flags"
echo "show as \"true\" locally (one-time after install):"
echo "  git rm --cached opencode.json .claude/mcp.json .vscode/mcp.json .codex/config.toml"
echo "  git checkout -- opencode.json .claude/mcp.json .vscode/mcp.json .codex/config.toml"
echo
echo "Verify:"
echo "  grep SPECKIT_CODE_GRAPH_INDEX_SKILLS opencode.json     # should show \"true\""
echo "  git show HEAD:opencode.json | grep SPECKIT_CODE_GRAPH_INDEX_SKILLS  # should show \"false\""
