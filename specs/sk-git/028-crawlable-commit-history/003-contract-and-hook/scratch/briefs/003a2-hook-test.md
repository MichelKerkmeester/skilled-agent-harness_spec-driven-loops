GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-git/028-crawlable-commit-history/003-contract-and-hook

Proceed directly to the work. Do not print A/B/C/D/E options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

# ROLE

You are the Code Implementer persona of this repository (`.claude/agents/code.md`): a stack-aware
implementer who edits only the files named in the brief, follows the sk-code opencode shell
standards, runs the named verification command, and returns evidence, never a bare completion
claim. You are a leaf: never dispatch another agent or CLI. Do not commit. Do not touch any
file this brief does not name.

Shell standards that bind (sk-code opencode, shell quality P0): portable shebang, `set -euo pipefail`,
every variable expansion double-quoted, a header comment block, no commented-out code, a WHY
comment on anything non-obvious. Never write a spec path, task id or ADR id into a code comment.

# CONTEXT

The hook change is already done: `.opencode/scripts/git-hooks/commit-msg` now whitelists
`Spec:` and `Commit-Id:` as a colon-only trailer branch and refuses a `Commit-Id:` that is not
seven digits or that already belongs to another commit (HEAD excluded, so an amend keeps its id).
The tests README already lists `commit-msg.test.sh`. That harness file does not exist yet. Write
it. Do not edit the hook.

Read before writing:
- `.opencode/scripts/git-hooks/commit-msg` in full
- `.opencode/scripts/git-hooks/tests/pre-commit.test.sh` lines 1-60 for the harness conventions:
  hermetic throwaway repo, `GIT_CONFIG_GLOBAL=/dev/null`, unset GIT_* variables,
  `core.hooksPath` pointed at an empty dir so no other hook runs, PASS/FAIL counters,
  `set -uo pipefail`, trap cleanup

# ACTION

Create exactly one file: `.opencode/scripts/git-hooks/tests/commit-msg.test.sh`.

It runs the real hook file against message files inside a throwaway repo, staging real files
where a case needs four staged paths, and asserts the exit code and, for blocks, that the
expected error text appears on stderr. Cases:
- old grammar still passes: `feat(sk-git): add a thing` with a prose body
- numeric scope still blocked: `feat(028): add a thing`
- four staged paths and a body of only `Spec:` and `Commit-Id:` lines is BLOCKED
- four staged paths and a prose line plus the two keys passes
- `Spec folder was renamed during the wave` counts as prose (four paths staged, passes)
- `Commit-Id: 12` is blocked as malformed
- a `Commit-Id:` value already present in another commit's message is blocked (make two
  commits with `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1`, one on a second branch, carrying the id)
- the same value present only in HEAD's message passes (the amend case)
- `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1` bypasses everything
The harness prints `PASS=<n> FAIL=<n>` and exits non-zero on any failure.

# FORMAT

Return, in this order:
1. The output of `bash -n .opencode/scripts/git-hooks/tests/commit-msg.test.sh`.
2. The full output of `bash .opencode/scripts/git-hooks/tests/commit-msg.test.sh`.
3. One line: FILES_CHANGED: <the path>.
4. One line: UNKNOWNS: <anything you could not verify, or "none">.
