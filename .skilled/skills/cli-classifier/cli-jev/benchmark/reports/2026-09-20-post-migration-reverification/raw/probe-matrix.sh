#!/usr/bin/env bash
# Live probe matrix, re-run from the migrated hub home.
#
# Two isolations reproduce the no-key contract now that a credential exists in the
# real store: the provider variables are cleared, and XDG_CONFIG_HOME points at an
# empty directory so the credential store cannot resolve ahead of the key check.
#
# Usage: bash probe-matrix.sh > probe-matrix.txt 2>&1

set -uo pipefail

ISO=/tmp/cli-jev-005/iso
D=/tmp/cli-jev-005

run_probe() {
  local label="$1"
  shift
  local out rc err
  out=$(XDG_CONFIG_HOME="$ISO" env -u TYPESAFE_API_KEY -u AI_GATEWAY_API_KEY -u OPENROUTER_API_KEY \
    -u JEV_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL "$@" 2>/tmp/jev-probe-err)
  rc=$?
  err=$(cat /tmp/jev-probe-err)
  printf '### %s\nCMD: %s\nRC: %s\nSTDOUT: %s\nSTDERR: %s\n\n' \
    "$label" "$*" "$rc" "${out:-<empty>}" "${err:-<empty>}"
}

# Negative control: a sentinel key WITH an unreachable endpoint, so the probe leaves the
# process. It greps its own stderr for the sentinel afterwards: a credential leak has to
# be visible in the transcript rather than assumed absent.
run_probe_with_key() {
  local label="$1" key="$2"
  shift 2
  local out rc err leak
  out=$(XDG_CONFIG_HOME="$ISO" env -u TYPESAFE_API_KEY -u JEV_PROVIDER -u JEV_ENDPOINT -u JEV_MODEL \
    JEV_API_KEY="$key" "$@" 2>/tmp/jev-probe-err)
  rc=$?
  err=$(cat /tmp/jev-probe-err)
  case "$err" in
    *"$key"*) leak="SENTINEL PRESENT IN STDERR" ;;
    *) leak="sentinel absent from stderr" ;;
  esac
  printf '### %s\nCMD: JEV_API_KEY=<sentinel> %s\nRC: %s\nSTDOUT: %s\nSTDERR: %s\nCHECK: %s\n\n' \
    "$label" "$*" "$rc" "${out:-<empty>}" "${err:-<empty>}" "$leak"
}

{
  run_probe "version" jev --version
  run_probe "root-help" jev --help
  run_probe "auth-status-no-key" jev auth status
  run_probe "auth-test-no-key" jev auth test
  run_probe "noul-no-key" jev noul -q "Is this urgent?" -s "Please restore service today."
  run_probe "noul-no-key-value" jev noul -q "Is this urgent?" -s "Please restore service today." --value
  run_probe "noul-stdin-form" jev noul -q "Is this urgent?" -s "-"
  run_probe "noul-at-file-missing" jev noul -q "Is it?" -s "@$D/absent.txt"
  run_probe "custom-provider-no-endpoint" jev noul -q "Is it?" -s "x" --provider custom
  run_probe "custom-provider-with-endpoint" jev noul -q "Is it?" -s "x" --provider custom --endpoint "https://127.0.0.1:1/v1/systemone"
  run_probe "missing-question" jev noul -s "x"
  run_probe "choice-missing-option" jev choice -q "Which?" -s "x"
  run_probe "score-missing-level" jev score -q "How bad?" -s "x"
  run_probe "bad-json-state" jev noul -q "Is it?" -s "not json" --json-state
  run_probe "value-with-run-stdin" jev run - --value
  run_probe "run-bad-payload" jev run "@$D/absent-request.json"
  run_probe "unknown-subcommand" jev judge -q "Is it?"
  run_probe "unknown-provider-env" env JEV_PROVIDER=nope jev noul -q "Is it?" -s "x"
  run_probe "choice-single-option-cli" jev choice -q "Which?" -s "x" -o "only=The only option"
  run_probe "score-single-level-cli" jev score -q "How bad?" -s "x" -l "Only level"
  run_probe_with_key "negative-control-unreachable-endpoint" "jev-negative-control-sentinel" \
    jev noul -q "Is it urgent?" -s "Restore service today." \
    --provider custom --endpoint "http://127.0.0.1:9/v1/systemone"
}
