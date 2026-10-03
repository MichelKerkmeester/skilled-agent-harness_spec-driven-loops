#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: MCP DOCTOR TESTS
# ───────────────────────────────────────────────────────────────
# Exercises mcp-doctor.sh against fixture project roots built under a temporary
# directory. The fixture carries a stub interpreter resolver so no test depends
# on the host's Node installs.
#
# Usage: bash .skilled/commands/doctor/scripts/tests/mcp-doctor.test.sh
#
# Exit Codes:
#   0 - Every test passed
#   1 - At least one test failed

# check() evaluates its condition after the run, so the single quotes are intended.
# shellcheck disable=SC2016
set -euo pipefail

# ───────────────────────────────────────────────────────────────
# 1. HARNESS
# ───────────────────────────────────────────────────────────────

TEST_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT="$TEST_DIR/../mcp-doctor.sh"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/mcp-doctor-test.XXXXXX")"
trap 'rm -rf "$WORK"' EXIT

if ! command -v node >/dev/null 2>&1; then
  echo "FAIL: node is required by mcp-doctor.sh"
  echo "Results: 0 passed, 1 failed"
  exit 1
fi

PASS=0
FAIL=0
OUT=""
ERR=""
RC=0
SENTINEL_ENV="SENTINEL-ENV-7c1f0a3e"
SENTINEL_FILE="SENTINEL-FILE-4b9d2e61"

pass() { printf 'PASS: %s\n' "$1"; PASS=$((PASS + 1)); }
fail() { printf 'FAIL: %s\n' "$1"; FAIL=$((FAIL + 1)); }

# Run the doctor; extra env assignments come before "--"
run_doctor() {
  local -a env_args=()
  while [[ $# -gt 0 && "$1" != "--" ]]; do
    env_args+=("$1")
    shift
  done
  [[ "${1:-}" == "--" ]] && shift
  RC=0
  OUT="$(env NO_COLOR=1 ${env_args[@]+"${env_args[@]}"} bash "$SCRIPT" "$@" 2>"$WORK/stderr")" || RC=$?
  ERR="$(cat "$WORK/stderr")"
}

check() {
  local name="$1" condition="$2"
  if eval "$condition"; then
    pass "$name"
  else
    fail "$name"
    printf '    | exit=%s\n    | stdout: %s\n    | stderr: %s\n' "$RC" "$OUT" "$ERR" | head -40
  fi
}

# Print a JSON expression evaluated against stdout (empty when stdout is not JSON)
json_eval() {
  node -e 'try { const r = JSON.parse(process.argv[1]); process.stdout.write(String(eval(process.argv[2]))); } catch { process.stdout.write(""); }' "$OUT" "$1"
}

# Status of one named check in the JSON report
check_status() {
  json_eval "(r.checks.find((c) => c.check === '$1') || {}).status"
}

# ───────────────────────────────────────────────────────────────
# 2. FIXTURES
# ───────────────────────────────────────────────────────────────

# Build a project root whose Code Mode install and every runtime config are healthy
new_root() {
  local root server
  root="$(mktemp -d "$WORK/root.XXXXXX")"
  server="$root/.skilled/skills/mcp-code-mode/mcp-server"
  mkdir -p "$root/.opencode" "$root/.skilled/bin/lib" "$server/dist" "$server/node_modules" \
    "$root/.claude" "$root/.codex" "$root/.cursor" "$root/.pi" "$root/.devin"
  printf '// launcher stub\n' > "$root/.skilled/bin/mcp-code-mode-launcher.cjs"
  cat > "$root/.skilled/bin/lib/node-engine-resolver.cjs" <<'JS'
'use strict';
module.exports.resolveNodeInterpreter = () => ({ path: process.execPath, range: '>=20' });
JS
  printf '{"name":"code-mode","engines":{"node":">=20"}}\n' > "$server/package.json"
  printf '{}\n' > "$server/package-lock.json"
  printf '{}\n' > "$server/tsconfig.json"
  printf 'export {};\n' > "$server/index.ts"
  touch -t 202001010000 "$server/package.json" "$server/package-lock.json" "$server/tsconfig.json" "$server/index.ts"
  printf "'use strict';\n" > "$server/dist/index.js"
  printf '{"manual_call_templates":[{"name":"demo","call_template_type":"mcp"}]}\n' > "$root/.utcp_config.json"

  local wired='{"mcpServers":{"code_mode":{"command":"node","args":[".skilled/bin/mcp-code-mode-launcher.cjs"],"env":{"UTCP_CONFIG_FILE":".utcp_config.json"}}}}'
  printf '{"mcp":{"code_mode":{"command":["node",".skilled/bin/mcp-code-mode-launcher.cjs"],"environment":{"UTCP_CONFIG_FILE":".utcp_config.json"}}}}\n' > "$root/opencode.json"
  local cfg
  for cfg in .mcp.json .claude/mcp.json .cursor/mcp.json .pi/mcp.json .devin/mcp_config.json; do
    printf '%s\n' "$wired" > "$root/$cfg"
  done
  cat > "$root/.codex/config.toml" <<'TOML'
[mcp_servers.code_mode]
command = "node"
args = [".skilled/bin/mcp-code-mode-launcher.cjs"]

[mcp_servers.code_mode.env]
UTCP_CONFIG_FILE = ".utcp_config.json"
TOML
  printf '%s' "$root"
}

HAS_TOMLLIB=false
for candidate in python3 python3.14 python3.13 python3.12 python3.11; do
  if command -v "$candidate" >/dev/null 2>&1 && "$candidate" -c 'import tomllib' >/dev/null 2>&1; then
    HAS_TOMLLIB=true
    break
  fi
done

# ───────────────────────────────────────────────────────────────
# 3. HEALTHY AND BROKEN INSTALLS
# ───────────────────────────────────────────────────────────────

ROOT="$(new_root)"
run_doctor -- --root "$ROOT" --json
check "healthy fixture reports zero failures" '[[ "$(json_eval r.summary.fail)" == 0 ]]'
if [[ "$HAS_TOMLLIB" == true ]]; then
  check "healthy fixture exits 0 with status healthy" '[[ "$RC" -eq 0 && "$(json_eval r.status)" == healthy ]]'
else
  check "healthy fixture warns only that Codex TOML is unvalidated" '[[ "$RC" -eq 1 && "$(json_eval r.summary.warn)" == 1 ]]'
fi

ROOT="$(new_root)"
rm "$ROOT/.skilled/skills/mcp-code-mode/mcp-server/dist/index.js"
run_doctor -- --root "$ROOT" --json
check "a missing dist exits 2 with status unhealthy" '[[ "$RC" -eq 2 && "$(json_eval r.status)" == unhealthy ]]'
check "a missing dist is reported as dist_exists FAIL" '[[ "$(check_status dist_exists)" == FAIL ]]'

ROOT="$(new_root)"
rm "$ROOT/.skilled/skills/mcp-code-mode/mcp-server/dist/index.js"
run_doctor -- --root "$ROOT"
check "human summary no longer points at --fix" '[[ "$RC" -eq 2 && "$ERR" != *"--fix"* && "$OUT" != *"--fix"* ]]'

ROOT="$(new_root)"
printf 'null\n' > "$ROOT/.utcp_config.json"
run_doctor -- --root "$ROOT" --json
check "a null .utcp_config.json still prints the JSON report" '[[ -n "$(json_eval r.status)" ]]'
check "a null .utcp_config.json is a FAIL with exit 2" '[[ "$RC" -eq 2 && "$(check_status utcp_manuals)" == FAIL ]]'

ROOT="$(new_root)"
printf '[1, 2]\n' > "$ROOT/.utcp_config.json"
run_doctor -- --root "$ROOT" --json
check "a top-level array .utcp_config.json is a FAIL with exit 2" '[[ "$RC" -eq 2 && "$(check_status utcp_manuals)" == FAIL ]]'

ROOT="$(new_root)"
printf '{"mcp": \n' > "$ROOT/opencode.json"
run_doctor -- --root "$ROOT" --json
check "an invalid runtime config is a FAIL" '[[ "$RC" -eq 2 && "$(check_status opencode.json:code_mode)" == FAIL ]]'

# ───────────────────────────────────────────────────────────────
# 4. CREDENTIAL PRIVACY
# ───────────────────────────────────────────────────────────────

ROOT="$(new_root)"
printf '{"manual_call_templates":[{"name":"demo","call_template_type":"mcp","config":{"token":"${API_KEY}","secret":"${FILE_KEY}"}}]}\n' > "$ROOT/.utcp_config.json"
printf 'demo_FILE_KEY=%s\n' "$SENTINEL_FILE" > "$ROOT/.env"
run_doctor demo_API_KEY="$SENTINEL_ENV" -- --root "$ROOT" --json
check "credential keys are reported present" '[[ "$(check_status utcp_credentials)" == PASS && "$OUT" == *"demo_API_KEY=present"* && "$OUT" == *"demo_FILE_KEY=present"* ]]'
check "JSON output never contains a credential value" '[[ "$OUT$ERR" != *"$SENTINEL_ENV"* && "$OUT$ERR" != *"$SENTINEL_FILE"* ]]'
run_doctor demo_API_KEY="$SENTINEL_ENV" -- --root "$ROOT"
check "human output never contains a credential value" '[[ "$OUT$ERR" != *"$SENTINEL_ENV"* && "$OUT$ERR" != *"$SENTINEL_FILE"* ]]'

# ───────────────────────────────────────────────────────────────
# 5. ARGUMENT ERRORS
# ───────────────────────────────────────────────────────────────

ROOT="$(new_root)"
run_doctor -- --root "$ROOT" --fix
check "--fix is rejected as an unknown option with exit 3" '[[ "$RC" -eq 3 && "$ERR" == *"Unknown option: --fix"* ]]'

run_doctor -- --bogus
check "an unknown option exits 3, not the warnings code" '[[ "$RC" -eq 3 ]]'

run_doctor -- --root
check "--root without a value exits 3" '[[ "$RC" -eq 3 ]]'

run_doctor -- --root "$WORK/does-not-exist" --json
check "--root at a missing directory exits 3" '[[ "$RC" -eq 3 && "$ERR" == *"does-not-exist"* ]]'
check "--root at a missing directory never diagnoses another tree" '[[ "$OUT" != *"Project root"* && "$OUT" != *"checks"* ]]'

run_doctor -- --help
check "--help exits 0 and documents exit 3" '[[ "$RC" -eq 0 && "$OUT" == *"3  Bad arguments"* && "$OUT" != *"--fix"* ]]'

# ───────────────────────────────────────────────────────────────
# 6. SUMMARY
# ───────────────────────────────────────────────────────────────

printf 'Results: %d passed, %d failed\n' "$PASS" "$FAIL"
[[ "$FAIL" -eq 0 ]]
