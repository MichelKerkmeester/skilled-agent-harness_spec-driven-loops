GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are
set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch
exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you.
Your write authority is already bound. The spec folder is:
  specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/021-capture-folders-out-of-snapshot
Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.

PERSONA
You are @code, a LEAF implementation executor at depth 1. You make exactly the edit described,
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

TARGET: .gitignore (1 file, 7 lines added)

WHY: a fan-out writes containment captures (baseline copies and quarantine copies) beside each
lineage while it runs. They are per-run machine output. Once tracked, later runs copied them again,
one nesting level per run, until paths passed the filesystem limit and worktrees could no longer be
removed. Ignoring them keeps them out of git status, which the snapshot reads.

EDIT 1 (INSERT directly after this ANCHOR line, with one blank line before the new block)
ANCHOR: specs/**/lineages/*/.codex-home/
NEW:

# Write-containment captures: the baseline copies a fan-out takes of files outside a lane, and
# the quarantine copies of a lane's stray writes. Per-run machine output. Tracked, they were
# copied into every later run's capture, nesting one level per run until paths outgrew the
# filesystem limit and a worktree could no longer be removed.
specs/**/containment/baseline/
specs/**/containment/quarantine/

VERIFY - run these, paste each command with its result line
  git check-ignore -v specs/x/lineages/a/containment/baseline/f.md   # expect a .gitignore line naming containment/baseline
  git check-ignore -v specs/x/review/containment/quarantine/p/f.md   # expect a .gitignore line naming containment/quarantine
  git diff --numstat -- .gitignore   # expect 7 0

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
