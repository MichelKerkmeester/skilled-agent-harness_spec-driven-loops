# Live fan-out lineage on cli-deepseek-harness

Two `fanout-run.cjs` deep-research runs, one lineage each, kind `cli-deepseek-harness`, model `deepseek-v4.1-flash-1017` (LLM Gateway route), one iteration.

| Run | Artifacts | Exit | Duration | Lineage final | Containment |
|---|---|---|---|---|---|
| 1 `dsh-live` | `../research/fanout-live/`, `fanout-lineage.stdout.txt` | 0 | 520 s | `completed`, `FANOUT_LINEAGE_COMPLETE:dsh-live` | advisory: 4 untracked paths. Three are evidence files the orchestrator wrote into this folder during the run (`confinement.md`, `latency-and-tokens.md`, `reasoning-max.md`, mtime inside the run window) and were preserved; the fourth is the parent `description.json`, created inside the same window and not attributable to the lineage with certainty |
| 2 `dsh-live-2` (clean re-run, tree untouched) | `../research/fanout-live-2/`, `fanout-lineage-clean.*` | 0 | 381 s | `completed`, `FANOUT_LINEAGE_COMPLETE:dsh-live-2` | clean: 0 `containment_advisory` events, no quarantine, `completed_with_containment_advisory` 0 |

Both runs: `did not activate` count 0 in the lineage stderr, and the disposable `dsh-home-*` was removed (no home dated inside either run window remains under `$TMPDIR`). Run 1's iteration read both route patches and reported their endpoints, model ids and reasoning effort with `[SOURCE: path:line]` citations (`../research/fanout-live/lineages/dsh-live/iterations/iteration-001.md`).
