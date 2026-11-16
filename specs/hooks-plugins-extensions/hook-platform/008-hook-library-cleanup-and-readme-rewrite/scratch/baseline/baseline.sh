#!/usr/bin/env bash
# Baseline capture for the hook library cleanup. Read-only against tracked files.
# Usage: baseline.sh <worktree-root> <out-dir>
set -u
ROOT="$1"
OUT="$2"
mkdir -p "$OUT"
cd "$ROOT" || exit 2
SUMMARY="$OUT/summary.txt"
: > "$SUMMARY"

run() {
  local name="$1"; shift
  local log="$OUT/$name.log"
  "$@" > "$log" 2>&1
  local rc=$?
  printf '%s\texit=%s\tlog=%s\n' "$name" "$rc" "$log" >> "$SUMMARY"
}

run hooks-vitest .skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts

node_test_files() {
  find .skilled/hooks .vibe/plugins/repo-guards/tests -type f \
    \( -name '*.test.mjs' -o -name '*.test.cjs' -o -name '*.test.js' \) \
    -not -path '*/node_modules/*' 2>/dev/null | sort | while IFS= read -r f; do
      if ! grep -Eq "(from[[:space:]]+|require\()['\"]vitest['\"]" "$f"; then printf '%s\n' "$f"; fi
    done
}
node_test_files > "$OUT/node-test-files.txt"
# shellcheck disable=SC2046
run hooks-node-test node --test $(cat "$OUT/node-test-files.txt")

run opencode-plugin-tests node --test '.opencode/plugins/tests/*.test.cjs'

for ext in .pi/extensions/*/package.json; do
  dir="$(dirname "$ext")"
  run "pi-$(basename "$dir")" npm --prefix "$dir" test
done

run sync-hook-registrations node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check
run sync-runtime-mirrors node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check
run readme-verdict-parity python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py
run readme-manifest python3 .skilled/skills/sk-doc/scripts/tests/test_readme_manifest.py
run check-gate-inputs bash .github/scripts/check-gate-inputs.sh
run check-gate-inputs-test bash .github/scripts/tests/check-gate-inputs.test.sh
run git-hooks-pre-commit-test bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh
run source-root-selection-test bash .skilled/scripts/git-hooks/tests/source-root-selection.test.sh

# README gates over every tracked hook README.
vd_pass=0; vd_fail=0; hvr_pass=0; hvr_fail=0
: > "$OUT/readme-validate-fail.txt"; : > "$OUT/readme-hvr-fail.txt"
while IFS= read -r f; do
  if python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py "$f" >/dev/null 2>&1; then vd_pass=$((vd_pass+1)); else vd_fail=$((vd_fail+1)); echo "$f" >> "$OUT/readme-validate-fail.txt"; fi
  if python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py "$f" >/dev/null 2>&1; then hvr_pass=$((hvr_pass+1)); else hvr_fail=$((hvr_fail+1)); echo "$f" >> "$OUT/readme-hvr-fail.txt"; fi
done < <(git ls-files .skilled/hooks | grep -E '/README\.md$|^\.skilled/hooks/README\.md$')
printf 'readme-validate_document\tpass=%s\tfail=%s\n' "$vd_pass" "$vd_fail" >> "$SUMMARY"
printf 'readme-hvr_scan\tpass=%s\tfail=%s\n' "$hvr_pass" "$hvr_fail" >> "$SUMMARY"
echo "BASELINE_DONE" >> "$SUMMARY"
