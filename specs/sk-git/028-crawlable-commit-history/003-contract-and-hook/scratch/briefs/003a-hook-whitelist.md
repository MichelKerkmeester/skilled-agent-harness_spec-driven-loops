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

`.opencode/scripts/git-hooks/commit-msg` is the blocking commit-message hook. Line 117 holds
`TRAILER_RE`, the whitelist that decides which body lines are machine trailers and which are
explanatory prose. Lines 127-129 set `HAS_EXPLANATORY_BODY=1` for any non-empty line that does
not match it, and lines 153-155 block a commit with four or more staged paths and no explanatory
line.

Two new trailer keys are being introduced repository-wide: `Spec:` (a packet path such as
`sk-git/028-crawlable-commit-history/003-contract-and-hook`) and `Commit-Id:` (a seven-digit
zero-padded ordinal such as `0009113`). Today a body made only of those keys counts as prose and
satisfies the four-path gate. Once every commit carries them, that gate is dead unless the hook
learns they are trailers first. This change is that prerequisite.

Read before editing:
- `.opencode/scripts/git-hooks/commit-msg` in full
- `.opencode/scripts/git-hooks/tests/pre-commit.test.sh` lines 1-60, the harness conventions:
  hermetic throwaway repo, `GIT_CONFIG_GLOBAL=/dev/null`, unset GIT_* variables,
  `PASS`/`FAIL` counters, `set -uo pipefail`, trap cleanup
- `.opencode/scripts/git-hooks/tests/README.md`, the harness inventory table

# ACTION

Make exactly this change, in three files.

1. `.opencode/scripts/git-hooks/commit-msg`
   a. Extend `TRAILER_RE` with a separate colon-only branch for the new keys:
      `(Spec|Commit-Id):`. Do NOT add them to the existing alternation, because that branch
      also accepts a space after the key and would classify prose such as
      `Spec folder was renamed during the wave` as a trailer. Add a WHY comment saying so.
   b. Add a duplicate-identifier check. If the message carries a line matching
      `^Commit-Id: [0-9]{7}$`, run
      `git -C "$REPO_ROOT" log --all --not HEAD --fixed-strings --grep="Commit-Id: <value>" --format=%h`
      and append an error when it returns anything. Exclude HEAD on purpose: an amend keeps
      its own id, and the copy a cherry-pick makes is never HEAD. Say that in a WHY comment.
      A `Commit-Id:` line whose value is not seven digits is an error too.
   c. Keep every existing check and message unchanged. Keep the bypass variable.

2. `.opencode/scripts/git-hooks/tests/commit-msg.test.sh` (new). A harness in the same shape
   as `pre-commit.test.sh` that runs the real hook file against a throwaway repo. Cases, each
   asserting the exit code and, for blocks, the error text:
   - old grammar still passes: `feat(sk-git): add a thing` with a prose body
   - numeric scope still blocked: `feat(028): add a thing`
   - four staged paths and a body of only `Spec:` and `Commit-Id:` lines is BLOCKED
   - four staged paths and a prose line plus the two keys passes
   - `Spec folder was renamed during the wave` counts as prose (four paths staged, passes)
   - `Commit-Id: 12` is blocked as malformed
   - a `Commit-Id:` value already present in another commit's message is blocked
   - the same value present only in HEAD's message passes (the amend case)
   - `SPECKIT_SKIP_COMMIT_MSG_VALIDATE=1` bypasses everything
   The harness prints `PASS=<n> FAIL=<n>` and exits non-zero on any failure.

3. `.opencode/scripts/git-hooks/tests/README.md`: add one row for the new harness to the
   contents table and one line to the validation block.

# FORMAT

Return, in this order:
1. The unified diff of the hook change.
2. The output of `bash -n .opencode/scripts/git-hooks/commit-msg`.
3. The full output of `bash .opencode/scripts/git-hooks/tests/commit-msg.test.sh`.
4. The output of `bash .opencode/scripts/git-hooks/tests/pre-commit.test.sh | tail -3`, to show
   the existing harness still passes.
5. One line: FILES_CHANGED: <the three paths>.
6. One line: UNKNOWNS: <anything you could not verify, or "none">.
