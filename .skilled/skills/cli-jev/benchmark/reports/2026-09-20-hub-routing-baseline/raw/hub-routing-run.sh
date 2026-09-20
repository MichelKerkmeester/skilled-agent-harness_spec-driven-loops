#!/usr/bin/env bash
# Hub-routing corpus run: CJ-001..CJ-003 (plus CJ-003's holdout phrasing) against the
# live front door, from the migrated hub home.

set -u

CR="node .skilled/bin/compiled-route.cjs --hub cli-jev"

probe() {
  local label="$1" prompt="$2" out rc
  out=$($CR --prompt "$prompt" 2>&1)
  rc=$?
  printf '### %s\nPROMPT: %s\nRC: %s\nROUTE: %s\n\n' "$label" "$prompt" "$rc" "$out"
}

probe "CJ-001" 'Use jev judgment to decide whether this incident is urgent, and give me the probability.'
probe "CJ-002" 'cli-jev noul for this question.'
probe "CJ-003" 'Summarize the open questions in this spec packet.'
probe "CJ-003-holdout" 'score this flavor of ice cream'

printf '### CJ-001 kill-switch control\nPROMPT: %s\nRC: ' 'Use jev judgment to decide whether this incident is urgent, and give me the probability.'
SPECKIT_COMPILED_ROUTING=0 $CR --prompt 'Use jev judgment to decide whether this incident is urgent, and give me the probability.'
printf 'rc=%s\n\n' "$?"

printf '### CJ-001 judgment executed through the resolved packet\n'
printf 'CMD: jev noul -q "Is this incident urgent?" -s "Checkout is failing since 09:12 UTC." --value </dev/null\n'
jev noul -q 'Is this incident urgent?' -s 'Checkout is failing since 09:12 UTC.' --value </dev/null
printf 'rc=%s\n' "$?"
