#!/usr/bin/env bash
# Run the sk-doc package checks and the runtime mirror check for this packet.
set -uo pipefail

status=0
run() {
  printf '\n$ %s\n' "$*"
  env -u AI_SESSION_CHILD -u OPENCODE_DB "$@"
  code=$?
  printf 'exit=%s\n' "$code"
  if [ "$code" -ne 0 ]; then status=1; fi
}

run node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook
run node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --strict
run python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py
run python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/tests/test_validator_fixtures.py
run node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check

exit "$status"
