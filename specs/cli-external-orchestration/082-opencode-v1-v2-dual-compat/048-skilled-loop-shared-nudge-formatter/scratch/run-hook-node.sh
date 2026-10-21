#!/usr/bin/env bash
# Runs the hook node:test files with the same selection rule as the CI workflow.
set -uo pipefail
files=()
while IFS= read -r file; do files+=("$file"); done < <(find .skilled/hooks -type f \
  \( -name '*.test.mjs' -o -name '*.test.cjs' -o -name '*.test.js' \) -not -path '*/node_modules/*' -print | sort \
  | while IFS= read -r file; do grep -qE "(from[[:space:]]+|require\()['\"]vitest['\"]" "$file" || printf '%s\n' "$file"; done)
echo "files ${#files[@]}"
node --test --test-reporter=tap "${files[@]}"
