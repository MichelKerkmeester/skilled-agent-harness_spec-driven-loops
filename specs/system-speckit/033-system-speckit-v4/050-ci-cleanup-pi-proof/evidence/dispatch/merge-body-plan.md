
TARGET: P/plan.md

EDIT 1
OLD: - [ ] All acceptance criteria met (AC-008 and AC-010 are Unmet)
NEW: - [x] All acceptance criteria met (AC-001 to AC-010 are Met)

EDIT 2
OLD: - [ ] Tests passing (if applicable) (the worktree runs pass, and the merged-tree re-run in T016 is open)
NEW: - [x] Tests passing (if applicable) (the worktree runs and the merged-tree runs pass)

EDIT 3
OLD: | Newer commits on main (three) | External | Yellow | T015 waits on the merge.
NEW: | Newer commits on main | External | Green | Merged in T015. The other session pushed main to 80dc0a118d before the second merge.

VERIFY - run these, paste each command with its result line
  grep -c '^- \[ \]' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/plan.md          # report the count
  grep -c '<!-- /\?ANCHOR:' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/plan.md    # expect 22
