
TARGET: P/tasks.md

EDIT 1
OLD: - [ ] T015 Merge main and re-mint cli-jev
NEW: - [x] T015 Merge main and re-mint cli-jev - **Evidence**: main was merged into the worktree branch twice, as `f127890ea7` and `0b39a1f6c3`, the second after the other session pushed main to `80dc0a118d`. The second merge conflicted on three generated Hermes mirrors, resolved by taking main's copies and regenerating every mirror. The cli-jev re-mint ran through the route-remint pre-commit gate inside `f0411552aa`.

EDIT 2
OLD: - [ ] T016 Merged-tree re-verification
NEW: - [x] T016 Merged-tree re-verification - **Evidence**: on `0b39a1f6c3`, Hermes sync reports 70 copies and 33 prompts in sync, frontmatter 0 violations, the graph compiler VALIDATION PASSED, freshness 15/15, links 0 broken, the route guard all seven hubs fresh, the deep-loop contract tests 42 passed and the advisor routing and ratchet tests 28 passed, all at exit 0.

EDIT 3
OLD: - [ ] CHK-013 [P1] main is merged and cli-jev's compiled-routing manifest is re-minted so the guard reports fresh and CJ-001 routes compiled
NEW: - [x] CHK-013 [P1] main is merged and cli-jev's compiled-routing manifest is re-minted so the guard reports fresh and CJ-001 routes compiled - **Evidence**: the route-remint pre-commit gate re-minted cli-jev in `f0411552aa`, and on the merged tree the guard reports all seven hubs fresh and the CJ-001 prompt routes compiled to cli-usage.

EDIT 4
OLD: - [ ] CHK-024 [P1] The merged-tree re-verification of Hermes sync, the scorer ratchet, the link check and the route guard passes before any push
NEW: - [x] CHK-024 [P1] The merged-tree re-verification of Hermes sync, the scorer ratchet, the link check and the route guard passes before any push - **Evidence**: on `0b39a1f6c3` the Hermes sync reports 70 in sync, the ratchet and routing tests pass 28/28, the link check reports 0 broken and the route guard reports all seven hubs fresh, each at exit 0.

EDIT 5
OLD: | P1 Items | 13 | 11/13 |
NEW: | P1 Items | 13 | 13/13 |

VERIFY - run these, paste each command with its result line
  grep -c '^- \[ \]' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/tasks.md          # expect 4
  grep -c '<!-- /\?ANCHOR:' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/tasks.md    # expect 30
