
TARGET: P/plan.md

EDIT 1
OLD: - [ ] All acceptance criteria met (AC-008, AC-009 and AC-010 are Unmet)
NEW: - [ ] All acceptance criteria met (AC-008 and AC-010 are Unmet)

EDIT 2
OLD: - [ ] Docs updated (spec/plan/tasks) (T013 and T014 are open)
NEW: - [x] Docs updated (spec/plan/tasks) (T013 and T014 are done)

VERIFY - run these, paste each command with its result line
  grep -c 'AC-009' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/plan.md             # expect 0
  grep -c '<!-- /\?ANCHOR:' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/plan.md    # expect 22
