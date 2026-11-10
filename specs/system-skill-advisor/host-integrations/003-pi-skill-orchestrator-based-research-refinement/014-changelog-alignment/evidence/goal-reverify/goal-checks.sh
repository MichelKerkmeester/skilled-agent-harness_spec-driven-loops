#!/usr/bin/env bash
# Parent goal criteria 1, 2 and the installer half of 6, run from the current tree into the folder
# given as $1: the four suites, the OpenCode plugin live load and the Codex hooks installer check.
# Read-only for the live advisor: the suites run in-process and the OpenCode session only calls it.
set -u
R=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
F=${1:?output folder}
mkdir -p "$F"
cd "$R" || exit 1
H=$(git rev-parse --short HEAD)
stamp() { date -u +%Y-%m-%dT%H:%M:%SZ; }

{ echo "# advisor runtime suite, HEAD $H, $(stamp)"; cd .skilled/skills/system-skill-advisor/runtime
  echo '## npm run typecheck'; npm run typecheck </dev/null 2>&1; echo "typecheck_exit=$?"
  echo '## npx vitest run'; npx --no-install vitest run </dev/null 2>&1; echo "vitest_exit=$?"; cd "$R"; } > "$F/suite-advisor-runtime.txt"

{ echo "# spec-kit hook suites, HEAD $H, $(stamp)"; cd .skilled/skills/system-spec-kit/runtime
  files=$(ls tests | grep -E -i "hook|shim|directive|lifecycle" | sed "s#^#tests/#" | tr "\n" " ")
  echo "## files: $files"; npx --no-install vitest run $files </dev/null 2>&1; echo "vitest_exit=$?"; cd "$R"; } > "$F/suite-spec-kit-hooks.txt"

{ echo "# Pi dispatch suite, HEAD $H, $(stamp)"; cd .skilled
  npx --no-install vitest run --config hooks/vitest.config.ts --dir hooks/dispatch/pi </dev/null 2>&1; echo "vitest_exit=$?"; cd "$R"; } > "$F/suite-pi-dispatch.txt"

{ echo "# OpenCode plugin tests, HEAD $H, $(stamp)"
  node --test .opencode/plugins/tests/system-skill-advisor.test.cjs </dev/null 2>&1; echo "node_test_exit=$?"; } > "$F/suite-opencode-plugin.txt"

start=$(stamp)
perl -e 'alarm shift; exec @ARGV' 600 opencode run --print-logs --log-level INFO --dir "$R" -m opencode-go/deepseek-v4.1-flash \
  "List every tool you can call whose name contains advisor. Print only the tool names, one per line." \
  </dev/null > "$F/cl-005.stdout.raw" 2> "$F/cl-005.log.raw"
rc=$?
{ echo "# OpenCode plugin live load (CL-005 step 4), HEAD $H, run $start to $(stamp)"
  echo "opencode $(opencode --version 2>/dev/null) exit=$rc"
  echo "failed to load plugin lines naming system-skill-advisor.js: $(grep 'failed to load plugin' "$F/cl-005.log.raw" | grep -c 'system-skill-advisor.js')"
  echo "failed to load plugin lines in the whole log: $(grep -c 'failed to load plugin' "$F/cl-005.log.raw")"
  echo "## grep -n 'spec_kit_skill_advisor_status' stdout"; grep -n 'spec_kit_skill_advisor_status' "$F/cl-005.stdout.raw"
  echo "## stdout"; cat "$F/cl-005.stdout.raw"; } > "$F/opencode-plugin-live-load.txt"
rm -f "$F/cl-005.stdout.raw" "$F/cl-005.log.raw"

{ echo "# install-codex-hooks --check, HEAD $H, $(stamp)"
  node .skilled/bin/install-codex-hooks.mjs --check </dev/null 2>&1 | sed "s#$HOME#~#g"; echo "check_exit=${PIPESTATUS[0]}"; } > "$F/install-codex-hooks-check.txt"

grep -h -E '_exit=|Test Files|Tests  |^ℹ (pass|fail)' "$F"/suite-*.txt
head -6 "$F/opencode-plugin-live-load.txt"
cat "$F/install-codex-hooks-check.txt"
