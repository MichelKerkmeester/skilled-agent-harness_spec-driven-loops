#!/usr/bin/env bash
# Authenticated half, re-run from the migrated hub home: the credential lives in the
# store, no provider key variable is set in the environment.
#
# Usage: bash auth-probe.sh > auth-probe.txt 2>&1

set -u

D=/tmp/cli-jev-005

printf '### auth-status\nCMD: jev auth status\n'
jev auth status
printf 'rc=%s\n\n' "$?"

printf '### auth-status-absent-provider\nCMD: jev auth status --provider vercel\n'
jev auth status --provider vercel
printf 'rc=%s\n\n' "$?"

printf '### auth-test\nCMD: jev auth test\n'
jev auth test
printf 'rc=%s\n\n' "$?"

printf '### noul-value\nCMD: jev noul -q "Does this message express urgency?" -s "Please restore service today." --value\n'
jev noul   -q 'Does this message express urgency?' -s 'Please restore service today.' --value </dev/null
printf 'rc=%s\n\n' "$?"

printf '### choice\nCMD: jev choice -q "Which queue owns this?" -s @state.txt -o billing=... -o technical=...\n'
jev choice -q 'Which queue owns this?' -s @$D/state.txt -o billing='Payment or refund' -o technical='Bug' </dev/null
printf 'rc=%s\n\n' "$?"

printf '### score-value\nCMD: jev score -q "How severe is this?" -s @state.txt -l "no impact" -l "degraded" -l "outage" --value\n'
jev score  -q 'How severe is this?' -s @$D/state.txt -l 'no impact' -l 'degraded' -l 'outage' --value </dev/null
printf 'rc=%s\n\n' "$?"

printf '### noul-wrong-provider\nCMD: jev noul -q "Is it?" -s "x" --provider vercel\n'
jev noul -q 'Is it?' -s 'x' --provider vercel
printf 'rc=%s\n' "$?"
