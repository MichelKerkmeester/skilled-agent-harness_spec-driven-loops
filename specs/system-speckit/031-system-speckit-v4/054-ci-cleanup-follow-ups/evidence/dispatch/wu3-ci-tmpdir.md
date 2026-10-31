GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and SYSTEM_SPEC_GATE_ENFORCE=0 are
set in your environment, which this repository's AGENTS.md defines as the autonomous child-dispatch
exemption: the spec-folder question is pre-resolved and MUST NOT be asked. No answer can reach you.
Your write authority is already bound. The spec folder is:
  specs/system-speckit/033-system-speckit-v4/054-ci-cleanup-follow-ups
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

TARGET: .github/workflows/spec-kit-check.yml (1 file, 4 lines removed)

WHY: the runtime vitest step pointed TMPDIR at the runner's temp dir only because the spec gate
exempted every write under /tmp. The gate no longer does, so the workaround goes and CI runs the
suites with the runner's default temp dir, the way a Linux machine would.

EDIT 1 (OLD occurs exactly once)
OLD:
        # only the CLI project ran here.
        # os.tmpdir() is /tmp on this runner and the spec gate exempts every write
        # under /tmp, so temp workspaces go to the runner's own temp dir instead.
        env:
          TMPDIR: ${{ runner.temp }}
        run: |
NEW:
        # only the CLI project ran here.
        run: |

VERIFY - run these, paste each command with its result line
  grep -c 'TMPDIR' .github/workflows/spec-kit-check.yml   # expect 0
  git diff --numstat -- .github/workflows/spec-kit-check.yml   # expect 0 4

HANDBACK - emit exactly this, last thing in your reply
PI_HANDBACK
status: <done|blocked>
summary: <two sentences>
files_changed: <count and path>
edits_applied: <the EDIT numbers applied>
edits_skipped: <none, or each EDIT number with the reason>
verification: <each VERIFY command with its result line>
failures: <none, or what blocked and where you stopped>
