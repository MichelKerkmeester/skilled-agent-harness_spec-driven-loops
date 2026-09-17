#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# MODULE:    run-source-gates
# COMPONENT: sk-code-obsidian surface source-gate runner
# ───────────────────────────────────────────────────────────────
#
# One entry point for the Note Database plugin's source gates. It runs each
# guard in sequence, prints a PASS/FAIL line per guard, and exits non-zero if
# any one fails, so a completion gate never has to remember four commands.
#
# Guards:
#   scan-naming.mjs             filename grammar (kebab-case under src/ and tools/)
#   scan-comments.mjs           MODULE banners and numbered section rules
#   scan-folder-docs.mjs        folder-doc coverage, both directions, plus path resolution
#   scan-skill-references.mjs   this cross-repo surface skill's plugin paths resolve
#
# Runs FROM the plugin repo root, located by the same markers the hub's surface
# detection uses: a manifest.json carrying minAppVersion, beside esbuild.config.mjs.
# Offline and deterministic: no network, no model dispatch, no state between runs.
#
# A guard that does not exist yet is reported SKIP rather than failing the run,
# so this runner is usable while the convention work is still landing.
#
# Usage:
#   bash run-source-gates.sh [path/to/SKILL.md]
# The skill file for scan-skill-references defaults to this surface's SKILL.md
# reached through the plugin repo's .opencode symlink; pass $1 to override.

set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. LOCATE THE PLUGIN REPO ROOT
# ───────────────────────────────────────────────────────────────

if [ ! -f "manifest.json" ] || ! grep -q '"minAppVersion"' manifest.json 2>/dev/null; then
  echo "run-source-gates: no Obsidian manifest.json found in $(pwd)" >&2
  echo "run-source-gates: run this from the Note Database plugin repo root." >&2
  exit 2
fi

SKILL_MD="${1:-.opencode/skills/sk-code/sk-code-obsidian/SKILL.md}"
SCAN_DIR="tools/naming"

failures=0

# ───────────────────────────────────────────────────────────────
# 2. GUARD RUNNER
# ───────────────────────────────────────────────────────────────

# A guard is skipped, not failed, when its script is absent — the convention
# work lands in phases and the runner must stay usable in between.
run_guard() {
  local name="$1" script="$2"
  shift 2
  echo "── ${name}"
  if [ ! -f "${script}" ]; then
    echo "SKIP: ${script} not present yet"
    echo ""
    return 0
  fi
  if node "${script}" "$@"; then
    echo "PASS: ${name}"
  else
    echo "FAIL: ${name}"
    failures=$((failures + 1))
  fi
  echo ""
}

# ───────────────────────────────────────────────────────────────
# 3. SOURCE GATES
# ───────────────────────────────────────────────────────────────

run_guard "naming          (scan-naming.mjs)"       "${SCAN_DIR}/scan-naming.mjs"
run_guard "comments        (scan-comments.mjs)"     "${SCAN_DIR}/scan-comments.mjs"
run_guard "folder-docs     (scan-folder-docs.mjs)"  "${SCAN_DIR}/scan-folder-docs.mjs"
run_guard "skill-refs      (scan-skill-references.mjs ${SKILL_MD})" \
          "${SCAN_DIR}/scan-skill-references.mjs" "${SKILL_MD}"

# ───────────────────────────────────────────────────────────────
# 4. RESULT
# ───────────────────────────────────────────────────────────────

if [ "${failures}" -ne 0 ]; then
  echo "run-source-gates: ${failures} guard(s) FAILED"
  exit 1
fi

echo "run-source-gates: all source gates PASSED"
exit 0
