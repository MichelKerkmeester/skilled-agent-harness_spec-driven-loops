#!/usr/bin/env bash
# Second probe pass: subcommand help surfaces, a valid `run` payload, and the
# MCP tool list over stdio. Keys cleared, so no authenticated call is attempted.

set -u

D=specs/cli-external-orchestration/074-cli-jev-creation/001-jev-contract-research-and-pin/scratch

printf '### noul-help\n'
jev noul --help 2>&1
printf '\n### choice-help\n'
jev choice --help 2>&1
printf '\n### score-help\n'
jev score --help 2>&1
printf '\n### run-help\n'
jev run --help 2>&1
printf '\n### auth-help\n'
jev auth --help 2>&1
printf '\n### auth-set-help\n'
jev auth set --help 2>&1
printf '\n### install-skills-help\n'
jev install-skills --help 2>&1

printf '\n### run-valid-payload-no-key\n'
printf '{"state":"x","questions":{"answer":{"type":"noul","instructions":"Is it?"}}}' \
  | env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL jev run -
printf 'rc=%s\n' "$?"

printf '\n### run-valid-payload-no-key-with-value\n'
printf '{"state":"x","questions":{"answer":{"type":"noul","instructions":"Is it?"}}}' \
  | env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL jev run - --value
printf 'rc=%s\n' "$?"

printf '\n### run-missing-questions-no-key\n'
printf '{"state":"x"}' \
  | env -u TYPESAFE_API_KEY -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL jev run -
printf 'rc=%s\n' "$?"

printf '\n### mcp-tools-list\n'
python3 "${D}/mcp-probe.py" 2>&1
printf 'rc=%s\n' "$?"
