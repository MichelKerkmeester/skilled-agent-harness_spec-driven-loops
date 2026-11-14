#!/usr/bin/env bash
# Resolve every source line and test name the new playbook and catalog sentences cite.
set -uo pipefail

tests_dir=.skilled/hooks/session-relaunch/tests
failed=0

count_in() {
  local name="$1" file="$2" want="$3" got
  got=$(rg -c -F "$name" "$file" || true)
  if [ "$got" = "$want" ]; then
    printf 'OK   %s  [%s x%s]\n' "$name" "$file" "$got"
  else
    printf 'MISS %s  [%s got=%s want=%s]\n' "$name" "$file" "${got:-0}" "$want"
    failed=$((failed + 1))
  fi
}

printf 'Test names named by the new playbook text\n'
count_in 'stop-arm logs missing-transcript-path and marks the pending record deferred' "$tests_dir/claude-adapters.test.cjs" 1
count_in 'a hop says so when the wrapper file changed after the loop started' "$tests_dir/skilled-loop-wrapper-launch-arguments.test.cjs" 1
count_in 'a hop logs wrapper-changed when the wrapper file changed after the loop started' "$tests_dir/skilled-loop-wrapper-launch-arguments.test.cjs" 1
count_in 'a hop prints and logs nothing when the wrapper file cannot be read' "$tests_dir/skilled-loop-wrapper-launch-arguments.test.cjs" 1
count_in 'a hop prints and logs nothing when the wrapper file could not be read at loop start' "$tests_dir/skilled-loop-wrapper-launch-arguments.test.cjs" 1
count_in 'a goal the sender ended stays ended for a receiver that sets none' "$tests_dir/relaunch-core.test.cjs" 1
count_in 'the ended-goal mark counts only from the note this session claimed last' "$tests_dir/relaunch-core.test.cjs" 1
count_in 'a goal the sender ended stays ended when the session log cannot be read' "$tests_dir/relaunch-core.test.cjs" 1
count_in 'resolveGoalPacket looks no further up than the parent of the note folder' "$tests_dir/relaunch-core.test.cjs" 1
count_in 'prepare gives a Claude sender with no goal the unfinished goal of the note packet' "$tests_dir/session-relaunch-cli.test.cjs" 1
count_in 'prepare marks an ended Claude goal in the note and keeps it ended one hop later' "$tests_dir/session-relaunch-cli.test.cjs" 1

printf '\nSource lines the new text describes\n'
printf 'skilled-loop:34   %s\n' "$(sed -n '34p' .skilled/bin/skilled-loop)"
printf 'skilled-loop:1208 %s\n' "$(sed -n '1208p' .skilled/bin/skilled-loop)"
printf 'skilled-loop:1472 %s\n' "$(sed -n '1472p' .skilled/bin/skilled-loop)"
printf 'skilled-loop:1476 %s\n' "$(sed -n '1476p' .skilled/bin/skilled-loop)"
printf 'skilled-loop:1480 %s\n' "$(sed -n '1480p' .skilled/bin/skilled-loop)"
printf 'stop-arm.mjs:139  %s\n' "$(sed -n '139p' .skilled/hooks/session-relaunch/claude/stop-arm.mjs)"
printf 'stop-arm.mjs:146  %s\n' "$(sed -n '146p' .skilled/hooks/session-relaunch/claude/stop-arm.mjs)"
printf 'relaunch-core.cjs:652 %s\n' "$(sed -n '652p' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs)"
printf 'relaunch-core.cjs:691 %s\n' "$(sed -n '691p' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs)"
printf 'relaunch-core.cjs:997 %s\n' "$(sed -n '997p' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs)"
printf 'relaunch-core.cjs:1246 %s\n' "$(sed -n '1246p' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs)"
printf 'relaunch-core.cjs:1315 %s\n' "$(sed -n '1315p' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs)"

printf '\nmismatches: %s\n' "$failed"
[ "$failed" -eq 0 ]
