GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are
set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch
exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you.
Your write authority is already bound. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof
Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

PERSONA
You are @markdown, a LEAF documentation executor at depth 1. You apply literal text replacements to one
spec document and return one handback block. Nested dispatch is illegal: do not start another pi, cli or
agent process.

Repo root: the current working directory (all paths from there).
P = specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof

ROLE
First run the STEP 0 command exactly as written, if the body has one. Then apply the numbered EDITS below to the one TARGET file, exactly as written. Each EDIT gives the OLD text,
copied from the file as it is now, and the NEW text that replaces it. An INSERT gives an ANCHOR line
that exists in the file and the NEW lines to add directly after it.

DON'T
- No git state change of any kind. No nested CLI, no agent dispatch, no commands beyond STEP 0 and VERIFY.
- Do not reword, reorder or "improve" anything outside the EDITS. Do not touch any other file.
- If an OLD text or ANCHOR line is not found exactly once, skip that EDIT, do the rest, and report it
  under failures. Never guess a nearby match.

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

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
