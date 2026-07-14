# Deep-Research Iteration 004 Prompt

Resolved route: mode=research target_agent=deep-research. Agent definition loaded: yes.

Focus: conflict avoidance and handling. Compare path partitioning, per-session subtrees, additive-only commits, generated/cross-cutting files, three-way merge preflight with `git merge-tree --write-tree`, custom merge drivers, and `rerere`. Turn the evidence into explicit rules and testable acceptance conditions. Distinguish structural conflict avoidance from heuristic conflict reuse. Do not synthesize the final recommendation before iteration 5.

Research boundary: write only under `.opencode/specs/skilled-agent-orchestration/137-parallel-session-git-autosync/001-research-and-requirements/research/lineages/parallel-git-luna`. Prefer primary Git documentation and cite every load-bearing claim with `[SOURCE: URL]`.

Required negative knowledge: state why arbitrary overlapping edits cannot be promised conflict-free, why sparse/path projection is not ref isolation, and why `rerere` or a custom merge driver cannot substitute for a correctness policy.

Executor contract: `cli-codex`, model `gpt-5.6-luna`, reasoning effort `max`, service tier `fast`, sandbox mode `workspace-write`. This is a detached child lineage; do not spawn a nested same-kind Codex executor.
