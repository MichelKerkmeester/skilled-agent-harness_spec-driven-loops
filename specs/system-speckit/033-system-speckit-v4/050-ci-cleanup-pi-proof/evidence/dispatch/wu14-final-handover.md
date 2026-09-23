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

TARGET: P/handover.md

EDIT 1
OLD: - **Recent action**: Removed the bare word "run" from the cli-jev skill keywords and key topics, regenerated the Hermes cli-jev copy, and restored scorer-eval-baseline.json to its committed content. The live scorer reads 152/195 full corpus and 27/32 memory_save again.
NEW: - **Recent action**: Fixed the two CI failures the first push exposed, rebased the fix commits onto main and pushed them at 5b522489a2. All 21 CI runs passed on main and skilled/v4.0.0.0.

EDIT 2
OLD: **Blockers**: the primary checkout residue, which blocks the primary checkout's own sync after the push.
NEW: **Blockers**: none. The primary checkout residue was removed with the operator's yes, and that checkout belongs to another session.

EDIT 3
OLD: | The primary checkout holds this phase's scaffold residue: two placeholder rows in the parent spec.md and an untracked copy of the original 050 scaffold folder | open | Both block updating the primary checkout's main to the phase commit. Removing them touches the primary checkout, so it waits for the operator's yes at the merge step |
NEW: | The primary checkout holds this phase's scaffold residue: two placeholder rows in the parent spec.md and an untracked copy of the original 050 scaffold folder | resolved | Backed up and removed with the operator's yes. The primary checkout's main was not synced, because another session owns that checkout |

EDIT 4
OLD: - **Next safe action**: Push the worktree branch tip to main and skilled/v4.0.0.0 after the operator's yes, then watch CI.
NEW: - **Next safe action**: Remove the worktree after the closing commit is pushed.

EDIT 5
OLD: The work is committed and merged on the worktree branch, and nothing is pushed yet.
NEW: The work is pushed to main and skilled/v4.0.0.0 at 5b522489a2, and all 21 CI runs passed.

EDIT 6
OLD: Tasks T001 to T016 are done and T017 is open.
NEW: Tasks T001 to T018 are done.

EDIT 7 (replace the whole numbered list)
OLD:
1. Push the worktree branch tip to main and skilled/v4.0.0.0 after the operator's yes (T017).
2. Watch CI on the pushed commit (T017).
3. Clear the primary checkout residue with the operator's yes, so the primary checkout can fast-forward.
4. Remove the worktree after the operator's yes (the rest of T017).
NEW:
1. Push the closing documentation commit to main and skilled/v4.0.0.0 after the operator's yes.
2. Remove the worktree after the operator's yes.

EDIT 8
OLD: - [ ] All in-progress work committed or stashed. Open. Nothing is committed, merged or pushed yet.
NEW: - [x] All in-progress work committed or stashed. The phase and both CI fixes are pushed, and the closing documentation commit follows.

EDIT 9
OLD: Status now is In Progress.
NEW: Status now is Complete.

EDIT 10
OLD: - REQ-003 P0 The six CI surfaces pass locally without weakening a gate. AC-003 Met. AC-004 Met. AC-005 Met. AC-006 Met.
NEW: - REQ-003 P0 The six CI surfaces pass locally without weakening a gate. AC-003 Met. AC-004 Met. AC-005 Met. AC-006 Met. AC-011 Met, with all 21 CI runs passing on 5b522489a2.

EDIT 11
OLD: Task status: T001 to T016 are done. T017 is open.
NEW: Task status: T001 to T018 are done.

EDIT 12 (INSERT two lines directly after this ANCHOR line)
ANCHOR: - merges -> f127890ea7 was clean. 0b39a1f6c3 conflicted on three generated Hermes mirrors, resolved by taking main's copies and regenerating every mirror. `compiled-route-admission.cjs --all` warns on sk-design with 1 drift, the same as on origin/main, and CI runs it with --warn-only
NEW:
- CI on the first push 997cd8ee2e -> 13 workflows passed. The routing-accuracy corpus gate failed on the moved baseline path, and the runtime vitest project failed 5 Pi enforce tests because the spec gate exempts writes under /tmp, the runner's temp dir
- CI on the second push 5b522489a2 -> all 21 runs passed, 10 on main and 11 on skilled/v4.0.0.0, after b566f9fc28 repointed the baseline and 5b522489a2 set TMPDIR to the runner's temp dir

VERIFY - run these, paste each command with its result line
  grep -c 'In Progress\|nothing is pushed' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/handover.md   # expect 0
  grep -c '<!-- /\?ANCHOR:' specs/system-speckit/033-system-speckit-v4/050-ci-cleanup-pi-proof/handover.md   # expect 14

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
