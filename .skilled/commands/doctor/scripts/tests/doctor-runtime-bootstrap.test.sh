#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: DOCTOR RUNTIME BOOTSTRAP TESTS
# ───────────────────────────────────────────────────────────────
# Exercises doctor-runtime-bootstrap.sh against fixture workspaces under a
# temporary directory. The script runs with a PATH holding only the tools it
# needs plus npm and node stubs, so no real install or build runs and flock is
# absent on every host.
#
# Usage: bash .skilled/commands/doctor/scripts/tests/doctor-runtime-bootstrap.test.sh
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
SCRIPT="$TEST_DIR/../doctor-runtime-bootstrap.sh"
BASH_BIN="$(command -v bash)"
REAL_NODE="$(command -v node || true)"
WORK="$(mktemp -d "${TMPDIR:-/tmp}/bootstrap-test.XXXXXX")"
trap 'rm -rf "$WORK"' EXIT

if [[ -z "$REAL_NODE" ]]; then
  echo "FAIL: node is required to read the state file in these tests"
  echo "Results: 0 passed, 1 failed"
  exit 1
fi

PASS=0
FAIL=0
OUT=""
ERR=""
RC=0

pass() { printf 'PASS: %s\n' "$1"; PASS=$((PASS + 1)); }
fail() { printf 'FAIL: %s\n' "$1"; FAIL=$((FAIL + 1)); }

# A tool directory with only what the script needs, so flock is never found.
TOOLS="$WORK/tools"
mkdir -p "$TOOLS"
for tool in cat date mkdir mktemp mv rm; do
  ln -s "$(command -v "$tool")" "$TOOLS/$tool"
done
cat > "$TOOLS/node" <<SH
#!/bin/sh
exec "$REAL_NODE" "\$@"
SH
cat > "$TOOLS/npm" <<'SH'
#!/bin/sh
printf '%s\n' "$*" >> "$NPM_LOG"
echo "npm-stub-output $1"
if [ "$*" = "run build --workspace=@spec-kit/cli" ]; then
  [ -n "${NPM_STUB_FAIL:-}" ] && exit 1
  mkdir -p runtime/cli/dist/graph runtime/cli/dist/spec-folder
  : > runtime/cli/dist/graph/backfill-graph-metadata.js
  : > runtime/cli/dist/spec-folder/generate-description.js
fi
exit 0
SH
chmod +x "$TOOLS/node" "$TOOLS/npm"

# Run the bootstrap with the restricted PATH; extra env assignments come first
# Args: [VAR=value ...] -- script arguments
run_boot() {
  local -a env_args=()
  while [[ $# -gt 0 && "$1" != "--" ]]; do
    env_args+=("$1")
    shift
  done
  [[ "${1:-}" == "--" ]] && shift
  RC=0
  : > "$WORK/stderr"
  OUT="$(env PATH="$TOOLS" NPM_LOG="$WORK/npm.log" ${env_args[@]+"${env_args[@]}"} \
    "$BASH_BIN" "$SCRIPT" "$@" 2>"$WORK/stderr")" || RC=$?
  ERR="$(cat "$WORK/stderr")"
}

check() {
  local name="$1" condition="$2"
  if eval "$condition"; then
    pass "$name"
  else
    fail "$name"
    printf '    | exit=%s\n    | stdout: %s\n    | stderr: %s\n' "$RC" "$OUT" "$ERR"
  fi
}

last_line() { printf '%s' "${OUT##*$'\n'}"; }

# Print one field of a JSON file (empty when the file or field is absent)
json_field() {
  local file="$1" field="$2"
  [[ -f "$file" ]] || return 0
  "$REAL_NODE" -e 'const v = JSON.parse(require("fs").readFileSync(process.argv[1], "utf8"))[process.argv[2]]; process.stdout.write(v === undefined ? "" : String(v));' "$file" "$field"
}

# Print one field of a JSON string (fails when the string is not JSON)
json_text_field() {
  "$REAL_NODE" -e 'process.stdout.write(String(JSON.parse(process.argv[1])[process.argv[2]]));' "$1" "$2"
}

# ───────────────────────────────────────────────────────────────
# 2. FIXTURES
# ───────────────────────────────────────────────────────────────

# Create a workspace with the canonical layout and no build output
# Args: $1=skills directory name under .opencode (skills or skill)
new_workspace() {
  local layout="${1:-skills}" root
  root="$(mktemp -d "$WORK/ws.XXXXXX")"
  mkdir -p "$root/.opencode/$layout/system-spec-kit" "$root/.opencode/$layout/system-skill-advisor/runtime/database"
  printf '{}\n' > "$root/.opencode/$layout/system-spec-kit/package-lock.json"
  : > "$WORK/npm.log"
  printf '%s' "$root"
}

add_dist() {
  local kit="$1/.opencode/skills/system-spec-kit/runtime/cli/dist"
  mkdir -p "$kit/graph" "$kit/spec-folder"
  : > "$kit/graph/backfill-graph-metadata.js"
  : > "$kit/spec-folder/generate-description.js"
}

db_of() { printf '%s' "$1/.opencode/skills/system-skill-advisor/runtime/database"; }
state_of() { printf '%s' "$(db_of "$1")/.doctor-rebuild.bootstrap.json"; }

# ───────────────────────────────────────────────────────────────
# 3. BUILD PATHS
# ───────────────────────────────────────────────────────────────

WS="$(new_workspace)"
run_boot -- --root "$WS"
check "fresh workspace bootstraps and exits 0" '[[ "$RC" -eq 0 ]]'
check "fresh workspace reports restart_required=true" '[[ "$(last_line)" == "BOOTSTRAP_READY restart_required=true state_log="* ]]'
check "fresh workspace writes complete state" '[[ "$(json_field "$(state_of "$WS")" status)" == complete ]]'
check "fresh workspace runs npm ci and both builds" 'grep -q "^ci --no-fund --silent$" "$WORK/npm.log" && grep -q "workspace=@spec-kit/runtime" "$WORK/npm.log" && grep -q "workspace=@spec-kit/cli" "$WORK/npm.log"'
check "missing flock is not reported as a busy lock" '[[ "$ERR" != *"Another bootstrap"* && -f "$(state_of "$WS")" ]]'
check "the lock is released after a run" '[[ ! -e "$(db_of "$WS")/.doctor-rebuild.bootstrap.lock" ]]'

WS="$(new_workspace)"
add_dist "$WS"
run_boot -- --root "$WS"
check "built workspace exits 0 without a restart" '[[ "$RC" -eq 0 && "$OUT" == "BOOTSTRAP_READY restart_required=false"* ]]'
check "built workspace runs no npm command" '[[ ! -s "$WORK/npm.log" ]]'

WS="$(new_workspace)"
run_boot -- --root "$WS" --json
check "--json prints only the state JSON on stdout" '[[ "$(json_text_field "$OUT" status)" == complete && "$OUT" != *npm-stub-output* ]]'
check "--json sends npm output to stderr" '[[ "$ERR" == *npm-stub-output* ]]'

WS="$(new_workspace)"
run_boot NPM_STUB_FAIL=1 -- --root "$WS"
check "a failed build exits 1" '[[ "$RC" -eq 1 && "$(last_line)" == BOOTSTRAP_FAILED* ]]'
check "a failed build writes failed state" '[[ "$(json_field "$(state_of "$WS")" status)" == failed ]]'

WS="$(new_workspace)"
rm -rf "$WS/.opencode/skills/system-spec-kit"
run_boot -- --root "$WS"
check "a missing system-spec-kit exits 1 with failed state" '[[ "$RC" -eq 1 && "$(json_field "$(state_of "$WS")" status)" == failed ]]'

# ───────────────────────────────────────────────────────────────
# 4. LEGACY LAYOUT
# ───────────────────────────────────────────────────────────────

WS="$(new_workspace skill)"
run_boot -- --root "$WS"
check "a legacy .opencode/skill directory is promoted" '[[ "$RC" -eq 0 && -f "$WS/.opencode/skills/system-spec-kit/package-lock.json" && ! -e "$WS/.opencode/skill" ]]'
check "promotion leaves no backup directory" '! ls -d "$WS"/.opencode/skill_legacy_backup_* >/dev/null 2>&1'
check "promotion is recorded as an action" 'grep -q "promoted legacy .opencode/skill directory to .opencode/skills" "$(state_of "$WS")"'

WS="$(new_workspace)"
mkdir -p "$WS/.opencode/skill/stray"
run_boot -- --root "$WS"
check "a stray legacy directory beside skills is backed up" '[[ "$RC" -eq 0 && ! -e "$WS/.opencode/skill" ]] && ls -d "$WS"/.opencode/skill_legacy_backup_*/stray >/dev/null 2>&1'

# ───────────────────────────────────────────────────────────────
# 5. LOCKING
# ───────────────────────────────────────────────────────────────

WS="$(new_workspace)"
LOCK="$(db_of "$WS")/.doctor-rebuild.bootstrap.lock"
mkdir -p "$LOCK"
printf '%s\n' "$$" > "$LOCK/pid"
run_boot -- --root "$WS"
check "a held lock exits 3" '[[ "$RC" -eq 3 && "$OUT" == BOOTSTRAP_BUSY* ]]'
check "a held lock writes busy state" '[[ "$(json_field "$(state_of "$WS")" status)" == busy ]]'
check "a busy run leaves the holder's lock in place" '[[ -f "$LOCK/pid" ]]'
check "a busy run builds nothing" '[[ ! -s "$WORK/npm.log" ]]'
run_boot -- --root "$WS" --json
check "a held lock under --json prints busy JSON" '[[ "$RC" -eq 3 && "$(json_text_field "$OUT" status)" == busy ]]'

WS="$(new_workspace)"
LOCK="$(db_of "$WS")/.doctor-rebuild.bootstrap.lock"
mkdir -p "$LOCK"
sleep 0 &
DEAD_PID=$!
wait "$DEAD_PID" || true
printf '%s\n' "$DEAD_PID" > "$LOCK/pid"
run_boot -- --root "$WS"
check "a stale lock from a dead process is reclaimed" '[[ "$RC" -eq 0 && "$(json_field "$(state_of "$WS")" status)" == complete && ! -e "$LOCK" ]]'

WS="$(new_workspace)"
CUSTOM_LOCK="$WORK/custom.lock"
mkdir -p "$CUSTOM_LOCK"
printf '%s\n' "$$" > "$CUSTOM_LOCK/pid"
run_boot DOCTOR_BOOTSTRAP_LOCK="$CUSTOM_LOCK" -- --root "$WS"
check "DOCTOR_BOOTSTRAP_LOCK overrides the lock path" '[[ "$RC" -eq 3 && "$ERR" == *"$CUSTOM_LOCK"* ]]'
rm -rf "$CUSTOM_LOCK"

# ───────────────────────────────────────────────────────────────
# 6. ARGUMENT AND LAYOUT ERRORS
# ───────────────────────────────────────────────────────────────

run_boot -- --bogus
check "an unknown option exits 2" '[[ "$RC" -eq 2 ]]'
run_boot -- --root
check "--root without a value exits 2" '[[ "$RC" -eq 2 ]]'
run_boot -- --help
check "--help exits 0 and names the real target" '[[ "$RC" -eq 0 && "$OUT" == *".opencode/skills"* ]]'

WS="$(mktemp -d "$WORK/empty.XXXXXX")"
run_boot -- --root "$WS"
check "a workspace without .opencode exits 1" '[[ "$RC" -eq 1 ]]'

# ───────────────────────────────────────────────────────────────
# 7. SUMMARY
# ───────────────────────────────────────────────────────────────

printf 'Results: %d passed, %d failed\n' "$PASS" "$FAIL"
[[ "$FAIL" -eq 0 ]]
