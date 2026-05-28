#!/bin/zsh
# wrapper.sh

set -euo pipefail

ALLOWED_FLAGS=(
  --model
  --permission-mode
  --prompt-file
  --config
  --print
  -p
  --continue
  -c
  --resume
  --sandbox
  --agent-config
)

REJECTED=()
VALID=()
HALLUCINATED=false

FLAG_WITH_VALUE='--model|--permission-mode|--prompt-file|--config|--continue|--resume|--sandbox|--agent-config'

while [[ $# -gt 0 ]]; do
  case "$1" in
    --reasoning-effort)
      HALLUCINATED=true
      REJECTED+=("$1")
      shift
      ;;
    --print)
      VALID+=("$1")
      shift
      ;;
    $FLAG_WITH_VALUE)
      VALID+=("$1" "$2")
      shift 2
      ;;
    -p|-c)
      VALID+=("$1")
      shift
      ;;
    -*)
      HALLUCINATED=true
      REJECTED+=("$1")
      shift
      ;;
    *)
      shift
      ;;
  esac
done

if [[ "$HALLUCINATED" == "true" ]]; then
  jq -n \
    --argjson rejected "$(printf '%s\n' "${REJECTED[@]}" | jq -R . | jq -s .)" \
    --argjson valid "$(printf '%s\n' "${VALID[@]}" | jq -R . | jq -s .)" \
    --arg status "rejected" \
    '{status: $status, rejected: $rejected, valid: $valid, reason: "hallucinated flag detected"}' \
    > flag-verify.json
  echo "ERROR: hallucinated flag(s) detected: ${REJECTED[*]}" >&2
  exit 1
fi

jq -n \
  --argjson valid "$(printf '%s\n' "${VALID[@]}" | jq -R . | jq -s .)" \
  --arg status "verified" \
  '{status: $status, valid: $valid}' \
  > flag-verify.json

exec devin "${VALID[@]}"