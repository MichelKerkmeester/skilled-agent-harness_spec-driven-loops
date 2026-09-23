
TARGET: P/acceptance-criteria.md

STEP 0 (the cited captures moved from scratch/ to evidence/; rewrite their paths)
  sed -i '' -e 's#scratch/dispatch/#evidence/dispatch/#g' -e 's#scratch/pi-#evidence/pi-#g' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/acceptance-criteria.md

EDIT 1
OLD:     recent_action: "Six CI surfaces green, scorer drop fixed at cli-jev, CLI suite passed"
NEW:     recent_action: "Packet docs revised, strict validation passed, evidence moved out of scratch"

EDIT 2
OLD:     next_safe_action: "Strict-validate, commit, merge main, re-mint cli-jev, re-verify"
NEW:     next_safe_action: "Commit on the worktree branch, merge main, re-mint cli-jev, re-verify"

EDIT 3
OLD:     completion_pct: 70
NEW:     completion_pct: 80

EDIT 4 (the AC-009 row: Verification cell and Status cell)
OLD: | bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof --strict must print RESULT: PASSED, and the parent spec.md must carry phase map row 50 and the 049 to 050 handoff row. Task T014 is open, so the row is Unmet | Unmet | - |
NEW: | bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof --strict printed RESULT: PASSED with 0 errors and 0 warnings. The parent spec.md carries phase map row 50 and the 049 to 050 handoff row, the parent graph-metadata.json children_ids lists 050 as its 50th entry, and the parent folder's own strict checks pass | Met | - |

EDIT 5
OLD: AC-008, AC-009 and AC-010 are the open rows and each must turn Met or carry a waiver ADR before this packet may close.
NEW: AC-008 and AC-010 are the open rows and each must turn Met or carry a waiver ADR before this packet may close. Both are steps after the merge.

VERIFY - run these, paste each command with its result line
  grep -c 'scratch/' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/acceptance-criteria.md    # expect 0
  grep -c '| Met | - |' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/acceptance-criteria.md   # expect 8
  grep -c '<!-- /\?ANCHOR:' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/acceptance-criteria.md # expect 6
