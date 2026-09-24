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

TARGETS: 10 files, listed below

WHY: the branch was rebased onto a newer origin/main before the push, which gave every commit a new id. The packet
docs and evidence packs still cite the old ids. Each old id maps to exactly one new id with the same subject.

MAPPING (old -> new, same commit subject)
  162a3bd816 -> 1c6f97a004   fix(deep-loop): keep containment captures out of the snapshot and detection
  b7648ec0b0 -> 8a932df0ab   chore(specs): untrack the containment capture output and ignore it
  9b95bd06b1 -> 7bde922cba   fix(system-spec-kit): gate a repository under /tmp like any other
  9ace27983c -> a06dba0800   fix(cli-jev): run the recorded probe scripts under pipefail

EDIT: in each file below, replace EVERY occurrence of each old id with its new id. Change nothing else.
  specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/implementation-summary.md
  specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/goal.md
  specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/plan.md
  specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/tasks.md
  specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/evidence/dispatch/evidence.md
  specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/implementation-summary.md
  specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/spec.md
  specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/plan.md
  specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/tasks.md
  specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/evidence/dispatch/evidence.md
Do NOT touch any *-stdout.txt, *-stderr.txt or brief file. They are records of what ran.

VERIFY - run these, paste each command with its result line
  grep -l -e 162a3bd816 -e b7648ec0b0 -e 9b95bd06b1 -e 9ace27983c specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/*.md specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/evidence/dispatch/evidence.md specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/*.md specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/evidence/dispatch/evidence.md | wc -l   # expect 0
  grep -c -e 1c6f97a004 -e 8a932df0ab specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot/tasks.md   # report the count, expect at least 1
  grep -c -e 7bde922cba -e a06dba0800 specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups/tasks.md   # report the count, expect at least 1

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
