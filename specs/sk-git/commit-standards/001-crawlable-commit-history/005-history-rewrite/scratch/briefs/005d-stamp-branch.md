GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-git/028-crawlable-commit-history/005-history-rewrite

Proceed directly to the work. Do not print A/B/C/D/E options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.
# ROLE

You are the Code Implementer persona of this repository (`.claude/agents/code.md`): a stack-aware
implementer who edits only the files named in the brief, follows the sk-code opencode shell
standards, runs the named verification, and returns evidence, never a bare completion claim. You
are a leaf: never dispatch another agent or CLI. Do not commit. Never run the script against this
repository; only against throwaway repositories you create under `/tmp`. Do not write outside the
two paths named below. Never write a spec path, task id or ADR id into a code comment.

# CONTEXT

After the two release lines are rewritten with stamped trailers, about 23 other branches still
carry roughly 200 commits of their own with no `Commit-Id:`. Each such branch is rebased onto the
rewritten base by its owner. The rebase preserves messages, and the `prepare-commit-msg` hook does
not run on rebase picks, so those commits need a separate stamping step that mints from the live
allocator `.opencode/skills/sk-git/scripts/commit-id-naming.sh allocate` in commit order and
rewrites only the branch's unique range.

Read before writing:
- `.opencode/skills/sk-git/scripts/commit-id-naming.sh` (allocate, validate)
- `.opencode/scripts/git-hooks/prepare-commit-msg`, for the stamping shape and the trailer-shaped
  last-line rule
- `git filter-repo --help` on `--refs` and `--commit-callback`

# ACTION

Create exactly two files.

1. `.opencode/skills/sk-git/scripts/stamp-branch.sh`: CLI `stamp-branch.sh <branch> <base>`.
   For every commit in `<base>..<branch>` in `--reverse --topo-order` that has no `Commit-Id:`
   line, mint an ordinal with the allocator, then rewrite the range in one `git filter-repo
   --force --refs <base>..<branch> --commit-callback` pass that appends `Commit-Id:` (opening a
   blank line first unless the last paragraph is already trailer-shaped, then placing the key
   before any `Co-Authored-By:` line). Commits that already carry an id are left byte-identical.
   Refuse to run when the branch is checked out in a worktree with uncommitted changes, when
   `<base>` is not an ancestor of `<branch>`, or when the allocator is missing. Print the old and
   new tip and the number of commits stamped. Never touch any ref other than `<branch>`.
   Include a `--dry-run` flag that lists the commits that would be stamped and mints nothing.

2. `.opencode/skills/sk-git/scripts/tests/stamp-branch.test.sh`: hermetic harness in the shape
   of `tests/commit-id-naming.test.sh`: a throwaway repo with a base branch, a feature branch of
   three commits where the middle one already carries an id, a dirty-worktree refusal, a
   non-ancestor refusal, a dry run that changes nothing, and a real run that stamps exactly two
   commits with consecutive ordinals, keeps the middle id, keeps tree hashes and authors, and
   leaves the base branch untouched. Prints `PASS=<n> FAIL=<n>`, non-zero on failure.

# FORMAT

Return, in this order:
1. `bash -n` output for both files.
2. The full output of `bash .opencode/skills/sk-git/scripts/tests/stamp-branch.test.sh`.
3. The output of `bash .opencode/skills/sk-git/scripts/tests/commit-id-naming.test.sh | tail -1`.
4. One line: FILES_CHANGED: <the two paths>.
5. One line: UNKNOWNS: <anything you could not verify, or "none">.
