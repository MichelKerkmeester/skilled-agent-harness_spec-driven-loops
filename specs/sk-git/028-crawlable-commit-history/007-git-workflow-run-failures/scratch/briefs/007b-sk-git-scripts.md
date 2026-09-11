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

Two adjustments under `.opencode/skills/sk-git/scripts/`, each with a harness case. Read
iteration 3 (R3.2, R3.3) and iteration 5 (R5.1) first.

1. `lib/git-rule-checks.mjs` and `lib/git-context.mjs` (iteration 3): the advisory builds its
   git context from the session cwd and drops a `-C <dir>` or a leading `cd <dir> &&`, so
   `git add <existing paths>` evaluated against the wrong directory fires
   `add-pathspec-matches-nothing`, and `git reset --hard` in a dirty worktree stays silent when
   the session cwd is clean. Make `parseGitCommand` return the effective directory: the first
   `-C <dir>` target, or the directory of a leading `cd <dir> &&`, resolved against the session
   cwd. Build the context on that directory. When the effective directory cannot be resolved,
   every cwd-sensitive check returns true, silence, per the module's stated fail-open principle.
   Keep the three adapters under `hooks/` passing whatever cwd they already pass. Harness:
   `lib/git-rule-checks.test.mjs` gains the R3.2 cases 3 and 4 (no advisory when the target
   directory holds the paths) and R3.3 case 7 (an advisory for a reset --hard in the dirty
   target directory even from a clean session cwd).
2. `commit-id-naming.sh` (iteration 5, R5.1): a kill between the lock directory's creation and
   its pid write leaves a lock nobody reclaims, and every later mint waits the full timeout and
   fails. In the acquisition loop, treat a lock directory whose pid file is missing or empty as
   stale once it is older than two seconds, and reclaim it through the same atomic rename path
   the dead-owner branch uses. Keep the live-owner behavior unchanged. Harness:
   `tests/commit-id-naming.test.sh` gains the R5.1a case: a pre-created empty lock directory,
   and allocate succeeds within five seconds.

# FORMAT

Return, in this order:
1. `node --check` for the two .mjs files and `bash -n` for the shell script.
2. The pass summary of `node --test .opencode/skills/sk-git/scripts/lib/git-rule-checks.test.mjs`
   and of `bash .opencode/skills/sk-git/scripts/tests/commit-id-naming.test.sh`, from real runs.
3. `git diff --stat`.
4. One line: FILES_CHANGED: <paths>.
5. One line: UNKNOWNS: <anything you could not verify, or "none">.
