# Staging decision: transient run state versus lock-coordinator state

## Decision

`step_stage_artifact_dir` in both deep-research workflows keeps staging the whole artifact directory, but excludes four transient paths with git exclude pathspecs:

- `.deep-research.lock` (the live single-writer lock; staging runs before `step_release_lock`, so it always existed at staging time)
- `.deep-research-pause` and `.deep-research-run-now` (one-shot sentinels)
- `.legacy-projection-watermarks/` (projection refresh cursors, rebuilt from the ledger)

Lock-coordinator state under `locks-and-fencing-v1/` (`coordinator-state.json`, `grant-journal.jsonl`) stays staged, as do the ledgers, deltas, iterations, prompts and the state log. Other packets track that coordinator state on purpose (382 tracked files repo-wide at build time, all `coordinator-state.json` or `grant-journal.jsonl`), because the grant journal is the fencing evidence a replay reads.

## Why exclude pathspecs instead of ignore rules

The workflow owns its own staging command, so excluding at the pathspec closes the defect without depending on `.gitignore`. Ignore rules would also stop an operator from adding these files by accident, which is still worth doing; that edit belongs to the repository root and is handed off.

## Proof

Temp git repo with `research/.deep-research.lock`, `research/.deep-research-pause`, `research/.legacy-projection-watermarks/research-state.json`, `research/deltas/iter-001.jsonl`, `research/locks-and-fencing-v1/x/coordinator-state.json`:

- `git add --dry-run -- research` lists all five.
- The rendered workflow command with `--dry-run` lists only `research/deltas/iter-001.jsonl` and `research/locks-and-fencing-v1/x/coordinator-state.json`.

## Not done here

The 33 `.deep-research.lock` files already tracked stay as they are (out of scope: history cleanup is a separate decision).
