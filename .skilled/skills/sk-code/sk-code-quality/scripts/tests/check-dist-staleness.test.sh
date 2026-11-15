#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: DIST STALENESS ERROR HANDLING TESTS
# ───────────────────────────────────────────────────────────────
# Exit Codes: 0 expected errors are handled; 1 an assertion fails; strict-mode failures return nonzero.
set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. TEST SETUP
# ───────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CHECKER="$SCRIPT_DIR/check-dist-staleness.sh"

# ───────────────────────────────────────────────────────────────
# 2. EXCEPTION BOUNDARIES
# ───────────────────────────────────────────────────────────────

python3 - "$CHECKER" <<'PY'
import builtins
import os
import runpy
import subprocess
import sys

module = runpy.run_path(sys.argv[1])
os.environ["HOOK_FLAGS_CONFIG"] = os.path.join(os.getcwd(), "missing-hook-flags-config")
assert module["_hook_flags_config"]() == {}

original_open = builtins.open

def unexpected_open(*args, **kwargs):
    raise RuntimeError("unexpected config reader failure")

builtins.open = unexpected_open
try:
    try:
        module["_hook_flags_config"]()
    except RuntimeError as error:
        assert str(error) == "unexpected config reader failure"
    else:
        raise AssertionError("unexpected config reader failure was swallowed")
finally:
    builtins.open = original_open

original_run = subprocess.run

def unexpected_run(*args, **kwargs):
    raise RuntimeError("unexpected subprocess failure")

subprocess.run = unexpected_run
try:
    for call in (
        lambda: module["_run_checker"]("checker", os.getcwd(), []),
        lambda: module["_try_rebuild"]({"rebuildCommand": "true"}, os.getcwd()),
    ):
        try:
            call()
        except RuntimeError as error:
            assert str(error) == "unexpected subprocess failure"
        else:
            raise AssertionError("unexpected subprocess failure was swallowed")
finally:
    subprocess.run = original_run
PY

printf 'Dist staleness error-handling cases passed\n'

# ───────────────────────────────────────────────────────────────
# 3. ALL-PACKAGES WORKSPACE OVERRIDE
# ───────────────────────────────────────────────────────────────

# A runner that names another workspace must get that workspace's verdict from
# --all too, or a stale package there reads as fresh.
WORKSPACE="$(mktemp -d)"
trap 'rm -rf "$WORKSPACE"' EXIT
PACKAGE="$WORKSPACE/.skilled/skills/mcp-code-mode/mcp-server"
mkdir -p "$PACKAGE/dist" "$PACKAGE/node_modules"
printf '{"name":"@utcp/code-mode-mcp","version":"0.0.0"}\n' > "$PACKAGE/package.json"
printf '{"compilerOptions":{}}\n' > "$PACKAGE/tsconfig.json"
printf 'export const ready = true;\n' > "$PACKAGE/index.ts"
printf 'export const ready = true;\n' > "$PACKAGE/dist/index.js"
touch -t 202001010000 "$PACKAGE/dist/index.js"

OUTPUT="$(SPECKIT_DIST_AUTO_REBUILD=0 SPECKIT_DIST_WORKSPACE_ROOT="$WORKSPACE" python3 "$CHECKER" --all)"
if ! grep -q 'STALE DIST WARNING: @utcp/code-mode-mcp' <<<"$OUTPUT"; then
  printf 'FAIL: --all ignored SPECKIT_DIST_WORKSPACE_ROOT\n%s\n' "$OUTPUT" >&2
  exit 1
fi

printf 'Dist staleness all-packages workspace case passed\n'
