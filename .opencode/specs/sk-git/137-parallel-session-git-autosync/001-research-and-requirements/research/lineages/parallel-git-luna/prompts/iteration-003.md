# Deep-Research Iteration 003 Prompt

Resolved route: mode=research target_agent=deep-research. Agent definition loaded: yes.

Focus: compare automation surfaces and existing art named by the brief. Evaluate Git hooks, a local background sync daemon, a launch wrapper, and remote-side merge/submit queues. Compare `git-sync`, `git-autosync`/`git-auto-sync`, mob, Syncthing-style mirroring, GitHub merge queue, git-town, and Gerrit. For each, state what it actually serializes, what it leaves to manual conflict handling, and whether it can preserve arbitrary uncommitted work. Do not synthesize the final recommendation before iteration 5.

Research boundary: write only under `.opencode/specs/skilled-agent-orchestration/137-parallel-session-git-autosync/001-research-and-requirements/research/lineages/parallel-git-luna`. Prefer project-owned or official documentation and cite every load-bearing claim with `[SOURCE: URL]`.

Required negative knowledge: record which tools mirror files, auto-rebase a single checkout, or force-update refs without providing a multi-writer no-loss publication invariant.

Executor contract: `cli-codex`, model `gpt-5.6-luna`, reasoning effort `max`, service tier `fast`, sandbox mode `workspace-write`. This is a detached child lineage; do not spawn a nested same-kind Codex executor.
