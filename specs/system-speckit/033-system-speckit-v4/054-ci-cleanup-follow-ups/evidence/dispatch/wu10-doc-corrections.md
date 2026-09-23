GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are
set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch
exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you.
Your write authority is already bound. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups
Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

PERSONA
You are @markdown, a LEAF documentation executor at depth 1. You make exactly the edit described,
run the named VERIFY commands, and return one handback block. Nested dispatch is illegal: do not start
another pi, cli or agent process. If you cannot finish, stop and report where.

Repo root: the current working directory (all paths from there).

DON'T
- No git state change of any kind (no add, commit, checkout, stash, restore).
- No nested CLI, no agent dispatch, no command beyond the VERIFY commands.
- Do not reword, reorder or "improve" anything outside the EDITS. Do not touch any other file.
- Never put spec paths, packet or phase numbers, or task ids in code comments.
- If an OLD text is not found exactly once, skip that EDIT, do the rest, and report it under
  failures. Never guess a nearby match.

TARGETS: specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/goal.md and specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/tasks.md (2 files)

WHY: four sentences in these docs are unsourced, awkward or wrong. The goal still carries a scaffold placeholder and
a claim the evidence does not support. The tasks file opens six evidence cells with "command N/A" although each one
cites a brief, and one checklist item says the branch holds two commits when it holds more.

EDIT 1 in specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/goal.md (OLD occurs exactly once, replace the whole text)
OLD:       session_id: "[SESSION-ID]"
NEW:       session_id: "scaffold-021-capture-folders-out-of-snapshot"

EDIT 2 in specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/goal.md (OLD occurs exactly once, replace the whole text)
OLD: | T009 run the suites and typecheck | Done | write-containment.vitest.ts 79 passed and runtime typecheck exit 0, observed at both commits |
NEW: | T009 run the suites and typecheck | Done | write-containment.vitest.ts 79 passed, the six containment-related test files 395 passed and 1 skipped, runtime typecheck exit 0 |

EDIT 3 in specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/tasks.md (OLD occurs exactly once, replace the whole text)
OLD: - [x] CHK-FIX-002 [P0] The same-class producer inventory is completed by search - **Evidence**: a repo-wide search found no other text describing the /tmp exemption or the old 107 count (command N/A - insufficient source context).
NEW: - [x] CHK-FIX-002 [P0] The same-class producer inventory is completed by search - **Evidence**: a repo-wide search found no other text describing the /tmp exemption or the old 107 count (rg over the tree outside specs/ for the exemption wording and for the old count, 0 hits).

EDIT 4 in specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/tasks.md (OLD occurs exactly once, replace the whole text)
OLD: - [x] CHK-051 [P1] The change set holds only the recorded files and commits - **Evidence**: the branch carries exactly two commits, `9b95bd06b1` and `9ace27983c`, and the what-changed section of `evidence/dispatch/evidence.md` lists every touched file (command N/A - insufficient source context).
NEW: - [x] CHK-051 [P1] The change set holds only the recorded files and commits - **Evidence**: this phase's code landed in exactly two commits, `9b95bd06b1` and `9ace27983c`, and the what-changed section of `evidence/dispatch/evidence.md` lists every touched file.

EDIT 5 in specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/tasks.md (replace ALL 7 occurrences, nothing else on those lines)
OLD: command N/A - insufficient source context. Result recorded 
NEW: recorded 
(note: OLD ends with one space after "recorded", and NEW is "recorded" plus one space)

VERIFY - run these, paste each command with its result line
  grep -c 'SESSION-ID' specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/goal.md   # expect 0
  grep -c 'observed at both commits' specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/goal.md   # expect 0
  grep -c 'command N/A' specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/tasks.md   # expect 0
  grep -c 'branch carries exactly two commits' specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/tasks.md   # expect 0
  grep -c '^- \[x\]' specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/tasks.md   # report the count, it must equal the count before your edits

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
