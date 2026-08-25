#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# MODULE:    run-source-gates
# COMPONENT: sk-code-mobile-cli surface source-gate runner
# ───────────────────────────────────────────────────────────────
#
# One entry point for the Pi Remote phone app's source gates, mirroring the
# model skill's run-all-drift-guards.sh. It runs each guard in sequence, prints
# a PASS/FAIL line per guard, and exits non-zero if any one fails, so a
# completion gate never has to remember five separate commands.
#
# Guards:
#   scan-naming.mjs             in-repo filename grammar
#   scan-comments.mjs           comment grammar (reporting scan)
#   scan-folder-docs.mjs        folder-doc coverage + path resolution
#   scan-skill-references.mjs   this cross-repo surface skill's paths resolve
#   token-identity.mjs verify   resolved app.css tokens match the goldens
#
# Runs FROM the app repo root: the guards are invoked by CWD-relative paths and
# the app repo is located by the presence of app-mobile/. Offline and
# deterministic: no network, no model dispatch, no state carried between runs.
#
# Usage:
#   bash run-source-gates.sh [path/to/SKILL.md]
# The skill file for scan-skill-references defaults to the sk-code-mobile-cli
# SKILL.md reached through the app repo's .opencode symlink; pass $1 to override.

set -euo pipefail

# ── Locate and confirm the app repo root (this must run from there).
if [ ! -d "app-mobile" ]; then
  echo "run-source-gates: app-mobile/ not found in $(pwd)" >&2
  echo "run-source-gates: run this from the Pi Remote app repo root." >&2
  exit 2
fi

SKILL_MD="${1:-.opencode/skills/sk-code/sk-code-mobile-cli/SKILL.md}"
APP_CSS="app-mobile/src/app.css"
TOKEN_IDENTITY="scripts/token-identity.mjs"

failures=0

run_guard() {
  local name="$1"
  shift
  echo "── ${name}"
  if "$@"; then
    echo "PASS: ${name}"
  else
    echo "FAIL: ${name}"
    failures=$((failures + 1))
  fi
  echo ""
}

run_guard "naming          (scan-naming.mjs)" \
  node scripts/naming/scan-naming.mjs

run_guard "comments        (scan-comments.mjs)" \
  node scripts/naming/scan-comments.mjs

run_guard "folder-docs     (scan-folder-docs.mjs)" \
  node scripts/naming/scan-folder-docs.mjs

run_guard "skill-refs      (scan-skill-references.mjs ${SKILL_MD})" \
  node scripts/naming/scan-skill-references.mjs "${SKILL_MD}"

# token-identity verify needs app.css as input so the var() chains resolve to
# the goldens; skip cleanly if the subcommand is ever removed.
if grep -q "cmd === 'verify'" "${TOKEN_IDENTITY}"; then
  run_guard "token-identity  (token-identity.mjs verify ${APP_CSS})" \
    node "${TOKEN_IDENTITY}" verify "${APP_CSS}"
else
  echo "── token-identity  (token-identity.mjs verify)"
  echo "SKIP: verify subcommand not present in ${TOKEN_IDENTITY}"
  echo ""
fi

if [ "${failures}" -ne 0 ]; then
  echo "run-source-gates: ${failures} guard(s) FAILED"
  exit 1
fi

echo "run-source-gates: all source gates PASSED"
exit 0
