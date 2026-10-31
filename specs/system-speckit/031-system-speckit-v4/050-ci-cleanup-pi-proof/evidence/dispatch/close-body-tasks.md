
TARGET: P/tasks.md

STEP 0 (the cited captures moved from scratch/ to evidence/; rewrite their paths)
  sed -i '' -e 's#scratch/dispatch/#evidence/dispatch/#g' -e 's#scratch/pi-#evidence/pi-#g' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/tasks.md

EDIT 1
OLD: - [ ] T013 Packet docs and parent records
NEW: - [x] T013 Packet docs and parent records - **Evidence**: the six packet docs were filled in wu5 and revised in wu8, the parent spec.md gained row 50 and the 049 to 050 handoff row in wu6, 048 gained its live-proof row in wu7, and `repair-derived.cjs --apply` added 050 to the parent `children_ids`.

EDIT 2
OLD: - [ ] T014 Strict validation
NEW: - [x] T014 Strict validation - **Evidence**: `validate.sh --strict` printed RESULT: PASSED with 0 errors and 0 warnings on this packet and on 048.

EDIT 3
OLD: every claim above cites a scratch file or a recorded command result
NEW: every claim above cites an evidence file or a recorded command result

EDIT 4
OLD: - [ ] CHK-040 [P1] The packet validates strict with RESULT: PASSED and the parent records are reconciled
NEW: - [x] CHK-040 [P1] The packet validates strict with RESULT: PASSED and the parent records are reconciled - **Evidence**: `validate.sh --strict` on this packet printed RESULT: PASSED with 0 errors and 0 warnings. The parent spec.md carries row 50 and the 049 to 050 handoff row, and the parent `graph-metadata.json` lists 050 in `children_ids`.

EDIT 5 (CHK-050: replace the evidence text)
OLD: - **Evidence**: the headless and TUI captures and the delivery marker live under `scratch/`, and the dispatch briefs and handbacks live under `evidence/dispatch/`.
NEW: - **Evidence**: temporary output lived under `scratch/` during the work. The cited captures and the dispatch trail then moved to `evidence/`, because the packet docs cite them and the spec-kit folder rules keep cited files out of `scratch/`.

EDIT 6
OLD: - [ ] CHK-051 [P1] `scratch/` is cleaned before completion
NEW: - [x] CHK-051 [P1] `scratch/` is cleaned before completion - **Evidence**: `scratch/` holds only `.gitkeep` after the captures and the dispatch trail moved to `evidence/`.

EDIT 7
OLD: | P1 Items | 13 | 9/13 |
NEW: | P1 Items | 13 | 11/13 |

VERIFY - run these, paste each command with its result line
  grep -c 'scratch/pi-\|scratch/dispatch' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/tasks.md   # expect 0
  grep -c '^- \[ \]' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/tasks.md                         # expect 8
  grep -c '<!-- /\?ANCHOR:' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/tasks.md                  # expect 30
