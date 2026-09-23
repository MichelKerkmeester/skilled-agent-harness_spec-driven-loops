#!/usr/bin/env bash
# Second probe pass, re-run from the migrated hub home: subcommand help surfaces, a
# valid `run` payload, and the MCP tool list over stdio. Store pointed away, so no
# authenticated call is attempted.

set -uo pipefail

ISO=/tmp/cli-jev-005/iso
D=/tmp/cli-jev-005

clear_env() {
  XDG_CONFIG_HOME="$ISO" env -u TYPESAFE_API_KEY -u AI_GATEWAY_API_KEY -u OPENROUTER_API_KEY \
    -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL "$@"
}

printf '### noul-help\n'
clear_env jev noul --help 2>&1
printf '\n### choice-help\n'
clear_env jev choice --help 2>&1
printf '\n### score-help\n'
clear_env jev score --help 2>&1
printf '\n### run-help\n'
clear_env jev run --help 2>&1
printf '\n### auth-help\n'
clear_env jev auth --help 2>&1
printf '\n### auth-set-help\n'
clear_env jev auth set --help 2>&1
printf '\n### install-skills-help\n'
clear_env jev install-skills --help 2>&1

printf '\n### run-valid-payload-no-key\n'
printf '{"state":"x","questions":{"answer":{"type":"noul","instructions":"Is it?"}}}' \
  | clear_env jev run -
printf 'rc=%s\n' "$?"

printf '\n### run-valid-payload-no-key-with-value\n'
printf '{"state":"x","questions":{"answer":{"type":"noul","instructions":"Is it?"}}}' \
  | clear_env jev run - --value
printf 'rc=%s\n' "$?"

printf '\n### run-missing-questions-no-key\n'
printf '{"state":"x"}' \
  | clear_env jev run -
printf 'rc=%s\n' "$?"

printf '\n### mcp-tools-list\n'
XDG_CONFIG_HOME="$ISO" python3 "${D}/mcp-probe.py" 2>&1
printf 'rc=%s\n' "$?"
