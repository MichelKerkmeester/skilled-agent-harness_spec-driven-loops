GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures

Proceed directly to the work. Do not print A/B/C/D/E options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.
# ROLE

You are the Code Implementer persona of this repository (`.claude/agents/code.md`): a stack-aware
implementer who edits only the files named in the brief, follows the sk-code opencode shell and
JavaScript standards, runs the named verification, and returns evidence, never a bare completion
claim. You are a leaf: never dispatch another agent or CLI. Do not commit. Never run any command
that writes to this repository or its refs; throwaway repositories under /tmp only. Every
adjustment changes the producer and keeps the gate for interactive use: never silence a check.
Never write a spec path, task id or ADR id into a code comment.

# EVIDENCE

The analysis with reproductions is at
`specs/sk-git/028-crawlable-commit-history/007-git-workflow-run-failures/research/lineages/deepseek/research.md`.
Read the iteration named for each item before touching its file; the R-numbers below are its
reproductions, with commands you can rerun under /tmp.

# ACTION

Four adjustments under `.opencode/scripts/git-hooks/` and one under `.opencode/scripts/`, each
with a harness case. Read iteration 1 (R1.2, R1.3, R1.4) and iteration 2 (R2.5) first.

1. `lib/autostash-orphan-guard.sh` and its callers (iteration 2, R2.5): a conflicting rebase
   with `--autostash` leaves the autostash at `$(git rev-parse --git-path rebase-merge)/autostash`
   or `rebase-apply/autostash`, and the guard never sees it because it only runs from post-merge
   and post-rewrite after the rebase is done. Anchor that autostash under `refs/autostash-rescue/`
   whenever the guard runs and the file exists, and also run the guard from `post-commit`. Harness:
   extend the existing guard test or add a case to `tests/` that performs a conflicting
   `git rebase --autostash` in a throwaway repo and asserts the rescue ref exists with no manual
   call.
2. `pre-commit` (iteration 1, R1.2, R1.3): the blocking branches of the spec-remint and
   route-remint gates print a human fix and omit their bypass variable. Print the documented
   bypass (`SPECKIT_SKIP_SPEC_REMINT=1`, `SPECKIT_SKIP_ROUTE_REMINT=1`, or whatever the file
   already defines) on every BLOCKED line of those gates, and when a packet is dirty only in the
   gate's own derived files, re-derive instead of blocking. Harness: `tests/pre-commit.test.sh`
   gains two cases asserting the bypass line and the derived-only pass.
3. `commit-msg` (iteration 1, R1.4): the body-line length warning fires on trailer lines such as
   a long `Spec:` path. Skip lines that match `TRAILER_RE` in the length check. Harness:
   `tests/commit-msg.test.sh` gains a case with a 110-character `Spec:` line and no warning.
4. `install-git-hooks.sh` (iteration 1): add `--status`, printing where `core.hooksPath` comes
   from (global, local, unset), the directory git resolves with `git rev-parse --git-path hooks`,
   and each hook's realpath, so a session can see that a worktree's edited hook is shadowed by
   the main clone's copy. Harness: `tests/install-git-hooks-worktree-harness.sh` gains a case
   that sets a global hooksPath in a fixture and asserts `--status` names it.
5. `.opencode/scripts/git-hooks/README.md` and `tests/README.md`: one line per change.

# FORMAT

Return, in this order:
1. `bash -n` for every edited script.
2. The pass summary line of each harness you touched, from a real run.
3. `git diff --stat`.
4. One line: FILES_CHANGED: <paths>.
5. One line: UNKNOWNS: <anything you could not verify, or "none">.
