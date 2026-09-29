#!/usr/bin/env bash
# Hub-routing corpus run after the jev-dispatch class gained its verb and preposition
# phrasings: CJ-001 with its six advertised phrasings, CJ-002, CJ-003 with its holdout,
# and out-of-domain replays aimed at the new phrasings. Routing only, so no provider
# credential is needed and no quota is spent.

set -uo pipefail

CR="node .skilled/bin/compiled-route.cjs --hub cli-jev"

probe() {
  local label="$1" prompt="$2" out rc
  out=$($CR --prompt "$prompt" 2>&1)
  rc=$?
  printf '### %s\nPROMPT: %s\nRC: %s\nROUTE: %s\n\n' "$label" "$prompt" "$rc" "$out"
}

probe "CJ-001" 'Use jev judgment to decide whether this incident is urgent, and give me the probability.'
probe "CJ-001-phrasing-1" 'ask jev for a probability that this plan ships on time'
probe "CJ-001-phrasing-2" 'score these three levels with jev'
probe "CJ-001-phrasing-3" 'run a batch of typed questions through jev'
probe "CJ-001-phrasing-4" 'pick one option with jev'
probe "CJ-001-phrasing-5" 'order levels with jev'
probe "CJ-001-phrasing-6" 'batch typed questions through jev'
probe "CJ-002" 'cli-jev noul for this question.'
probe "CJ-003" 'Summarize the open questions in this spec packet.'
probe "CJ-003-holdout" 'score this flavor of ice cream'
probe "out-of-domain-1" 'Plan a trip to Sarajevo with friends'
probe "out-of-domain-2" 'ask jeeves for directions'
probe "out-of-domain-3" 'use jevons paradox to explain this'

printf '### guard\n'
node .skilled/bin/compiled-route-guard.cjs
printf 'rc=%s\n' "$?"
