#!/usr/bin/env bash
# Runs the cli Vitest project the way CI does: the slow upgrade-legacy file in
# one process and every other file in a second, side by side. If the slow file
# is renamed, the first process finds no file and fails, so it cannot be dropped.
set -uo pipefail
cd "$(dirname "$0")/../cli"
npx vitest run --config ../../vitest.config.ts --project cli tests/upgrade-legacy.vitest.ts &
first=$!
npx vitest run --config ../../vitest.config.ts --project cli --exclude tests/upgrade-legacy.vitest.ts &
second=$!
status=0
wait "$first" || status=1
wait "$second" || status=1
exit "$status"
