#!/bin/bash
# Runs the suites the sk-vision prompt-hook port touches and prints one count line per suite.
W=/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/143-opencode-dual-compat-build
export PATH=/Users/michelkerkmeester/.nvm/versions/node/v26.8.2/bin:$PATH
OUT=$1; mkdir -p "$OUT"; cd "$W" || exit 9
run() { name=$1; shift; "$@" > "$OUT/$name.txt" 2>&1; echo "$name exit=$? $(grep -E '^ℹ (pass|fail) |^ *[0-9]+ (pass|fail)$|Tests +[0-9]' "$OUT/$name.txt" | tr '\n' ' ')"; }
run sk-vision sh -c 'cd .skilled/skills/sk-vision/vision-runtime && bun test'
run sk-vision-typecheck sh -c 'cd .skilled/skills/sk-vision/vision-runtime && bunx tsc --noEmit'
run plugins node --test .opencode/plugins/tests/
run v2-bridge node --test .opencode/plugins/tests/v2-bridge.test.cjs .opencode/plugins/tests/v2-hard-plugins.test.cjs
