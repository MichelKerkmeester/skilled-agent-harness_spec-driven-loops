# Run notes

Second five-runtime pass after the deep-review and alignment fixes, run with main's runner and `--repo-root` pointing at the detached worktree of decision record Q011. Codex ran with `--sandbox workspace-write --ask-for-approval never` (decision record Q013).

- Window: 2026-11-02 12:28:55Z to 12:39:31Z. Exit 1. Claude Code, OpenCode, Codex and Devin PASS 6/6; Pi FAIL 1/6 at `multi-select` `CHECK_FAILED`.
- Cause: the runner selected small and large, and Pi's model wrote them capitalized ("Selected Small, Large"). The scenario's check, `awk /small/ && /large/`, was case-sensitive (`pi/turns/multi-select/check.txt`, `screen.txt`). Every earlier Pi run had written the labels in lowercase.
- Fix: the scenario's four value checks ignore letter case, and the scenario says why. The runner did not change.
- Every runtime's `result.json` reports `cleanup.ok` true, and no `conv-8681-*` socket was left. No runtime failed `REPO_CHANGED`.
- Main checkout: `git status --porcelain --ignored -- specs .skilled/skills/.state` printed the same lines before and after the run.
