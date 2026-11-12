#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────
# COMPONENT: NPM CI RETRY TESTS
# ───────────────────────────────────────────────────────────────
# Runs the retry wrapper against a stand-in npm that fails a set number of times,
# so the test needs no network and no real install.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
RETRY="$SCRIPT_DIR/../npm-ci-retry.sh"

PASS=0; FAIL=0
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

mkdir -p "$TMP/bin" "$TMP/pkg"
cat > "$TMP/bin/npm" <<'STUB'
#!/usr/bin/env bash
count="$(cat "$FAKE_NPM_COUNT")"
count=$((count + 1))
echo "$count" > "$FAKE_NPM_COUNT"
[ "$count" -ge "$FAKE_NPM_OK_AT" ]
STUB
chmod +x "$TMP/bin/npm"

# run_case <name> <attempt that succeeds> <expected exit> <expected npm calls>
run_case() {
  local name="$1" ok_at="$2" want_exit="$3" want_calls="$4" got_exit got_calls
  echo 0 > "$TMP/count"
  PATH="$TMP/bin:$PATH" FAKE_NPM_COUNT="$TMP/count" FAKE_NPM_OK_AT="$ok_at" \
    NPM_CI_RETRY_PAUSE_SECONDS=0 bash "$RETRY" "$TMP/pkg" >/dev/null 2>&1
  got_exit=$?
  got_calls="$(cat "$TMP/count")"
  if [ "$got_exit" -eq "$want_exit" ] && [ "$got_calls" -eq "$want_calls" ]; then
    PASS=$((PASS + 1)); echo "ok   $name"
  else
    FAIL=$((FAIL + 1)); echo "FAIL $name: exit $got_exit after $got_calls calls, wanted exit $want_exit after $want_calls"
  fi
}

run_case "a first attempt that succeeds runs npm once" 1 0 1
run_case "a failed attempt is repeated until one succeeds" 3 0 3
run_case "three failed attempts end with the failing status" 9 1 3

bash "$RETRY" >/dev/null 2>&1
if [ "$?" -eq 2 ]; then
  PASS=$((PASS + 1)); echo "ok   a missing package folder is a usage error"
else
  FAIL=$((FAIL + 1)); echo "FAIL a missing package folder is a usage error"
fi

echo "passed: $PASS, failed: $FAIL"
[ "$FAIL" -eq 0 ]
