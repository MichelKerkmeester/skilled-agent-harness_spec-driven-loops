#!/usr/bin/env bash
# Run the measurement-traceability builder twice, then every negative fixture.
set -euo pipefail

PHASE_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$PHASE_DIR"

node --check ./build-traceability.ts

node ./build-traceability.ts --write
node ./build-traceability.ts --verify

while IFS= read -r name; do
  set +e
  node ./build-traceability.ts --fixture "$name"
  rc=$?
  set -e
  if [[ "$rc" -eq 0 ]]; then
    echo "FAIL: negative fixture $name exited 0" >&2
    exit 1
  fi
done < <(node ./build-traceability.ts --list-fixtures)

echo "PASS verify-traceability.sh: node --check, write, verify, and all negative fixtures"
