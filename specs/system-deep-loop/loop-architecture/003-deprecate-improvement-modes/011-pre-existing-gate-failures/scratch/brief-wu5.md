ROLE: You repair one test harness, .skilled/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh. Work only in this git worktree. Do not commit.

FACT: the harness fails with "FAIL: could not point the installer copy at .skilled" (its lines 107-110). It builds a second installer by running sed on the line HOOK_SOURCE_DIR="$REPO_ROOT/.opencode/... in .skilled/scripts/install-git-hooks.sh. That line no longer exists. The installer now picks its source root itself (lines 35-36 and 45):
  SOURCE_ROOT="$REPO_ROOT/.skilled"
  [[ -f "$SOURCE_ROOT/skills/system-spec-kit/SKILL.md" ]] || SOURCE_ROOT="$REPO_ROOT/.opencode"
  HOOK_SOURCE_DIR="$SOURCE_ROOT/scripts/git-hooks"

TASK: keep the two layout scenarios (lines 112-129) testing the same thing: an installer that resolves to .opencode replaces a .skilled hook link, and one that resolves to .skilled replaces a .opencode hook link. Drive which root the real installer resolves to through the sentinel file in the fixture repo (create .skilled/skills/system-spec-kit/SKILL.md for the .skilled scenario, remove it for the .opencode one) instead of a sed-rewritten copy. Drop the sed and grep lines. Check that the later cases in the file (another tool's link, the .skilled-only repo) still test what their comments say, and adjust the fixture only if the sentinel changes their outcome.

ALLOWED WRITES: that one harness file only. Do not change install-git-hooks.sh.

VERIFY:
1. bash .skilled/scripts/git-hooks/tests/install-git-hooks-worktree-harness.sh; echo "exit=$?"   (baseline exit 1; must become exit 0 with every line PASS)
2. Prove the scenarios still bite: temporarily break the installer's link replacement (any one-line change in a scratch copy you point the harness at, never in the real file) and show the harness fails, then remove the scratch copy.
3. Run every other .skilled/scripts/git-hooks/tests/*.sh and report each exit code (all were 0 before).

HANDBACK: the diff, VERIFY 1 output tail and exit code, how VERIFY 2 was done and its result, the VERIFY 3 exit codes.
