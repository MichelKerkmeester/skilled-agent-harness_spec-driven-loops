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

Shell standards that bind (sk-code opencode, shell quality P0): portable shebang, `set -euo pipefail`
scoped to direct execution when the file is also sourced, every variable expansion double-quoted,
a header comment block, no commented-out code, a WHY comment on anything non-obvious. Never write
a spec path, task id or ADR id into a code comment.

# CONTEXT

Every commit will carry a trailer `Commit-Id: NNNNNNN`, a seven-digit zero-padded repository-wide
ordinal. It needs an allocator with the same guarantees `scripts/worktree-naming.sh` gives
worktree numbers: a lock held in the common Git directory, a persisted high-water mark, next equals
max plus one, gaps never back-filled. The difference: there is no ref to scan for the max. The
source of truth is the message history itself, so a cold start scans
`git log --all --format=%B` for the highest `^Commit-Id: [0-9]{7}$` value and the high-water file
caches that result.

Read before writing:
- `.opencode/skills/sk-git/scripts/worktree-naming.sh` lines 1-120 (repo resolution, high-water
  and lock file helpers) and 200-384 (scan, lock acquire and release with stale-lock reclaim,
  persist high-water, allocate_number). Mirror its structure and its function naming style.
- `.opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh` lines 1-60 for the harness
  shape: hermetic repo, `core.hooksPath` pointed at an empty dir, `expect_rc` and `expect_eq`
  helpers, PASS/FAIL counters.

# ACTION

Create exactly two files.

1. `.opencode/skills/sk-git/scripts/commit-id-naming.sh`, sourceable and executable, commands:
   - `allocate`            reserve the next ordinal under the lock, persist the high-water,
                           print it seven digits wide
   - `next`                preview without lock or write
   - `scan-max`            highest ordinal in use: the high-water file, then every commit
                           message across all refs
   - `validate <value>`    exit 0 for exactly seven digits in 0000001..9999999
   - `rebuild-highwater`   rescan history and rewrite the high-water file (recovery after a
                           history rewrite)
   Files: `<common-dir>/commit-id-number.highwater` and `<common-dir>/commit-id-number.lock`.
   Reuse the lock algorithm from worktree-naming.sh including stale-lock reclaim, but do not
   source that file: the two allocators must not share a lock or a counter. Ceiling 9999999,
   refuse beyond it. Numbers are base-10 with leading zeros, never octal.

2. `.opencode/skills/sk-git/scripts/tests/commit-id-naming.test.sh`, a harness that in a
   throwaway repo covers: validate accepts and rejects, scan-max is 0 on empty history,
   scan-max finds the highest id across two branches, allocate returns max plus one and
   persists it, two concurrent allocates in background subshells return distinct consecutive
   values, a deleted high-water file is rebuilt from history, the ceiling is refused, and the
   high-water is never lower than history after rebuild-highwater.

# FORMAT

Return, in this order:
1. `bash -n` output for both files.
2. The full output of `bash .opencode/skills/sk-git/scripts/tests/commit-id-naming.test.sh`.
3. The output of `bash .opencode/skills/sk-git/scripts/tests/worktree-naming.test.sh | tail -2`.
4. One line: FILES_CHANGED: <the two paths>.
5. One line: UNKNOWNS: <anything you could not verify, or "none">.
