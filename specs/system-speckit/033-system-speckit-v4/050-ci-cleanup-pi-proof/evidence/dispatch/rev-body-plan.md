
TARGET: P/plan.md

EDIT 1
OLD: - [ ] All acceptance criteria met (AC-006, AC-008, AC-009 and AC-010 are Unmet)
NEW: - [ ] All acceptance criteria met (AC-008, AC-009 and AC-010 are Unmet)

EDIT 2
OLD: - [ ] Tests passing (if applicable) (the clean full CLI re-run is still open)
NEW: - [ ] Tests passing (if applicable) (the worktree runs pass, and the merged-tree re-run in T016 is open)

EDIT 3 (the consumer row for the scorer: name the projection and the baseline as two separate things)
OLD: | Consumer: scorer projection `scorer-eval-baseline.json` | Observes the keyword and topic change as route scores | Update. Restore the committed content |
NEW: | Consumer: the scorer projection `.skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts` and the ratchet baseline `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | The projection reads the keyword and the topic into route scores, and the baseline pins the expected counts | Update. Restore the baseline to its committed content, the projection is unchanged |

EDIT 4
OLD: | T015 waits on the merge. Two are f5a89115b1 and 2c8f243607. The third is N/A - insufficient source context |
NEW: | T015 waits on the merge. They are 377a22e1a9 (LLM Gateway MiMo route), f5a89115b1 and 2c8f243607 (sk-design compiled routing from another session, local only) |

VERIFY - run these, paste each command with its result line
  grep -c 'The third is' P/plan.md          # expect 0
  grep -c 'AC-006' P/plan.md                # expect 0
  grep -c 'projection.ts' P/plan.md         # expect 1
  grep -c '<!-- /\?ANCHOR:' P/plan.md       # expect 22
(replace P with the full folder path when you run them)
