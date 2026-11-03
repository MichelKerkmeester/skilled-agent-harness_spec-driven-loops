# Run notes

Five-runtime pass on the scenario with case-insensitive checks, run with main's runner and `--repo-root` pointing at the detached worktree of decision record Q011.

- Window: 2026-11-02 12:41:01Z to 12:52:42Z. Exit 1. Claude Code, OpenCode, Pi and Devin PASS 6/6; Codex FAIL 0/6 at `single-select` `CHECK_FAILED`.
- Cause: Codex's account hit its weekly usage limit before the first answer. The screen reads "You've hit your usage limit ... try again at Nov 5th, 2026 3:45 PM" and the status line "weekly 0% left" (`codex/turns/single-select/screen.txt`). Codex asked no question, so no `answers.txt` was written and the check failed.
- Codex's own proof for the final runner is `../matrix5/`: PASS 6/6 with the sandbox flags. Between the two runs only the scenario's checks changed, to ignore letter case.
- Every runtime's `result.json` reports `cleanup.ok` true, and no `conv-*` socket was left. No runtime failed `REPO_CHANGED`.
- Main checkout: `git status --porcelain --ignored -- specs .skilled/skills/.state` printed the same lines before and after the run.
