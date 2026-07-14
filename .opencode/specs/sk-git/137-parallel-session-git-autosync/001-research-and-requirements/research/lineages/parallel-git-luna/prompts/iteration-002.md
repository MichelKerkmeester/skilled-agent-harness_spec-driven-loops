# Deep-Research Iteration 002 Prompt

Resolved route: mode=research target_agent=deep-research. Agent definition loaded: yes.

Focus: determine how an IDE-facing checkout can stay current without overwriting or losing arbitrary uncommitted work. Compare fetch-only watchers, fast-forward-only updates, `pull --rebase --autostash`, `merge --autostash`, `reset --keep`, and destructive reset behavior. Record exact rollback and autostash invariants, and separate documented Git behavior from architecture inference. Do not synthesize the final recommendation before iteration 5.

Research boundary: write only under `.opencode/specs/skilled-agent-orchestration/137-parallel-session-git-autosync/001-research-and-requirements/research/lineages/parallel-git-luna`. Use primary Git documentation and cite each load-bearing claim with `[SOURCE: URL]`.

Required negative knowledge: state which tempting checkout-refresh mechanisms cannot guarantee both “always current” and “no loss of arbitrary dirty work,” and why.

Executor contract: `cli-codex`, model `gpt-5.6-luna`, reasoning effort `max`, service tier `fast`, sandbox mode `workspace-write`. This is a detached child lineage; do not spawn a nested same-kind Codex executor.
