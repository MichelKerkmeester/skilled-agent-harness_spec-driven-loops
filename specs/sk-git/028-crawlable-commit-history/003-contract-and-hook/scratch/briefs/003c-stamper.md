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

Every commit will end with a contiguous trailer paragraph carrying `Spec: <packet path>` when the
work belongs to a spec packet and `Commit-Id: NNNNNNN` always. A new `prepare-commit-msg` hook
stamps them. The allocator `.opencode/skills/sk-git/scripts/commit-id-naming.sh allocate` mints
the ordinal. The commit-msg hook already whitelists both keys and refuses a duplicate id.

Facts that shape the hook:
- Hooks are installed machine-wide: the operator's global `core.hooksPath` symlinks every file in
  `.opencode/scripts/git-hooks/` for every repository on the machine. The hook must detect that
  it is running inside this repository (the allocator script exists at its expected path under
  `git rev-parse --show-toplevel`) and exit 0 silently anywhere else.
- `prepare-commit-msg` receives `$1` message file, `$2` source (`message`, `template`, `merge`,
  `squash`, `commit`) and `$3` a SHA when source is `commit`. A cherry-pick arrives as `commit`
  with `$(git rev-parse --git-path CHERRY_PICK_HEAD)` present. An amend arrives as `commit` with
  `$3` equal to HEAD. A rebase keeps messages without running this hook for non-interactive
  picks, and an interactive reword arrives as `commit`.
- `git interpret-trailers` merges a trailer into the last paragraph when that paragraph's last
  line is `Token: value` shaped, for example a body of only `Context: short reason`. The stamper
  must insert a blank line itself when the final non-comment line looks like `Token: value` and
  is not already one of the machine keys, then append.
- Git comment lines (`#` by default, `core.commentChar` otherwise) at the end of the message file
  must stay after the trailer block.

Read before writing:
- `.opencode/scripts/git-hooks/commit-msg` in full, for the repository resolution style, the
  bypass variable pattern and the trailer regex.
- `.opencode/scripts/git-hooks/tests/commit-msg.test.sh` for the harness shape.
- `.opencode/scripts/install-git-hooks.sh` lines 30-110: it symlinks every file in the source
  directory, so a new hook needs no installer change.

# ACTION

Create or edit exactly these files.

1. `.opencode/scripts/git-hooks/prepare-commit-msg` (new, executable). Behavior:
   - `SPECKIT_SKIP_PREPARE_COMMIT_MSG=1` exits 0.
   - Not this repository, or the allocator missing: exit 0 silently.
   - Source `merge` or `squash`: exit 0, leave the message alone.
   - Source `commit` with a cherry-pick in progress: remove every existing `Commit-Id:` line,
     then mint and append a fresh one.
   - Source `commit` otherwise (amend, reword): if a `Commit-Id:` line exists, keep it and
     exit 0; if none, mint and append.
   - Source `message`, `template` or empty: if a `Commit-Id:` line exists, keep it; else mint
     and append.
   - `Spec:` is appended only when `SPECKIT_COMMIT_SPEC` is set in the environment and no
     `Spec:` line exists yet; its value is used verbatim. Nothing guesses a packet.
   - Appending: strip trailing comment lines, ensure the last real line is followed by exactly
     one blank line when it is not already a machine key line, append `Spec:` then `Commit-Id:`,
     then restore the comment lines. Idempotent: running twice changes nothing the second time.
   - A message that is empty apart from comments is left untouched (git aborts it anyway).
   - Allocator failure: print one line to stderr and exit 0 without stamping, because a
     failed mint must not block a commit the commit-msg hook will still validate.

2. `.opencode/scripts/git-hooks/tests/prepare-commit-msg.test.sh` (new). Throwaway repo with the
   allocator reachable at its real path (copy the worktree's `.opencode/skills/sk-git/scripts/`
   directory into the fixture). Cases: message source mints and appends with a blank line after
   prose; template source mints; `Context: reason` as the only body line gets a blank line
   before the block; existing id kept on amend; cherry-pick with `CHERRY_PICK_HEAD` present gets
   a fresh id and the old one is gone; merge source untouched; second run is a no-op; comment
   lines stay after the block; `SPECKIT_COMMIT_SPEC` set adds `Spec:` once; foreign repository
   without the allocator is untouched; bypass variable skips.

3. `.opencode/scripts/git-hooks/README.md`: add `prepare-commit-msg` to the current-state list in
   section 1, one bullet, and to the validation block in section 7.
4. `.opencode/scripts/git-hooks/tests/README.md`: one row and one validation line for the new
   harness.

# FORMAT

Return, in this order:
1. `bash -n` output for the hook and the harness.
2. The full output of `bash .opencode/scripts/git-hooks/tests/prepare-commit-msg.test.sh`.
3. The output of `bash .opencode/scripts/git-hooks/tests/commit-msg.test.sh | tail -2`.
4. One line: FILES_CHANGED: <the four paths>.
5. One line: UNKNOWNS: <anything you could not verify, or "none">.
