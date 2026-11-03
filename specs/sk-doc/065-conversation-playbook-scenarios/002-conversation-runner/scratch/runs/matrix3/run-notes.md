# Run notes

This run used main's runner with `--repo-root` pointing at a detached worktree of main (`~/worktrees/public/309-detached-conversation-runner-live-runs`, commit `4c3222d5b9`). The worktree held copies of main's runtime folders (`.claude`, `.opencode`, `opencode.json`, `.codex`, `.pi`, `.devin`) and the playbook package, so setup copied the same files it copies from main. Other sessions were writing to the main checkout at the time, which is why the run moved to the worktree (decision record Q011).

- Window: 2026-11-02 09:30:46Z to 09:42:48Z. Exit 0, all five rows PASS 6/6, `repo.changed` false on every runtime, every `conv-3284-*` socket gone afterwards.
- Main checkout during the window: one file changed under `specs/` or `.skilled/skills/.state/`, `.skilled/skills/.state/decision-capture/<hex>.jsonl`. The hex decodes to session `beb6e7b1-5f31-42db-8cd9-f58f27216e79`, the orchestrating session itself, and the file holds none of the scratch path, the colour or size answers or `answers.txt`.
