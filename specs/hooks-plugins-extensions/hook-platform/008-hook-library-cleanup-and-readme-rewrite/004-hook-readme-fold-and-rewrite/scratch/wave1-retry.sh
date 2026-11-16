#!/usr/bin/env bash
# Run the four wave-one retries in parallel.
S="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
for b in classifier-injection-screen-r2 dist-freshness-r2 completion-evidence-r2 cli-dispatch-r2 directive-lifecycle-r2; do
  (bash "$S/dispatch.sh" run "$S/briefs/$b.md"; echo "$b exit: $?") &
done
wait
echo "WAVE1 RETRY DONE"
