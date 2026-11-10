# Run notes

Five-runtime pass with the macOS write sandbox on, run with main's runner and `--repo-root` pointing at a detached worktree of main, as in decision record Q011.

- Window: 2026-11-02 15:55:45Z to 16:06:29Z. Exit 0. All five runtimes PASS 6/6.
- `result.json` records `sandbox` as `seatbelt` for Claude Code, OpenCode, Pi and Devin, and `codex-workspace-write` for Codex.
- The wrapper was observed, not only recorded: during a separate fake-runtime run the tmux server's command line read `/usr/bin/sandbox-exec -p (version 1)(allow default)` with deny rules for the repository root, the runner's own checkout and the git common dir. The suite group `sandbox policy` proves the profile denies a repository write while a scratch write succeeds.
- Every runtime's `result.json` reports `cleanup.ok` true and `repo.changed` false. No `conv-*` socket was left.
- Main checkout: `git status --porcelain --ignored -- specs .skilled/skills/.state` printed the same lines before and after the run.
- The `repo-before.txt` and `repo-after.txt` listings were removed from this copy, as for the earlier runs (decision record Q014).
