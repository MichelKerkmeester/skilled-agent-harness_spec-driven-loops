#!/usr/bin/env bash
# Runs the cli Vitest project the way CI does: one process now that no single
# file dominates the project's run time.
set -uo pipefail
cd "$(dirname "$0")/../cli"
npx vitest run --config ../../vitest.config.ts --project cli
