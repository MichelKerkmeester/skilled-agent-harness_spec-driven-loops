# Run notes

Second-pass attempt after the deep-review fixes, run with main's runner and `--repo-root` pointing at the detached worktree of decision record Q011.

- Window: 2026-11-02 11:44:49Z to 11:57:41Z. Exit 1. OpenCode, Codex, Pi and Devin PASS 6/6; Claude Code FAIL 0/6 `LAUNCH_TIMEOUT`.
- Cause: Claude Code draws its folder-trust dialog in two stages. The second drawing adds a settings warning and moves the cursor back to "No, exit". The runner answered the first drawing at once, the redraw swallowed the Down key, and Enter chose "No, exit" (`claude-code/raw-pane.log`).
- Fix: the runner now answers a start-up screen only after it has held still for the settle window, with a fake-subject redraw test (suite group `startup screen waits for redraw`).
