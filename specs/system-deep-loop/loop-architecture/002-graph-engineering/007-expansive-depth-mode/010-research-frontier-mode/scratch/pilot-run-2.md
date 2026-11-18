# Target-2 research pilot, rerun on the fixed tree (FAIL on AC-014)

Run 2026-11-18 00:3x to 01:2x UTC in a throwaway detached worktree at `1642d622a3b` (fixes a, b, c from run 1 merged) on fixture `specs/z_scratch/993-expansive-pilot-rerun` (never merged), cli-pi `deepseek-v4.1-flash-1017` max, `--depth-mode=expansive --max-iterations=16`. This was the one planned rerun; no further pilot runs tonight.

- AC-014: FAIL. Stats `{"total":16,"open":0,"active":0,"answered":16,...}`, stop `maxIterationsReached` at check 17 (`blockedBy:["sourceDiversity"]`, graph `STOP_BLOCKED`).
- Proposed amended criterion (a stop candidate forms before the cap): FAIL. All questions answered with an empty frontier first happened at check 17, the cap check. Checks 15 and 16 had an empty frontier but 16/19 and 17/19 answered.
- Structural cause: `deep-research.yaml` sets `maxFrontierNodes = max_iterations`. Seed 4 + 12 admissions in iterations 1-3 filled all 16 slots, each iteration answered one node, and the three init questions waited until iterations 15-16 because a frontier node outranks strategy focus. A non-cap stop is unreachable while the node cap equals the iteration cap.
- Fixes confirmed live: iteration 1 got a frontier block (fix c); `step_frontier_graph_upsert` exited 0 on all 16 iterations (fix a); all 16 nodes ended answered (fix b).
- Possible residue of fix b: F-2-015 and F-2-016 showed `exhausted/budget` after reduce 14 while already counted answered, and flipped to answered at reduce 15. Not confirmed.
- T032 on this run: `COMMAND_ROWS|TRACKED_COMMANDS` 0 in research.md (iteration-016.md:36 cites COMMAND_ROWS). The check depends on what the leaf cites; run 1 printed 1.
- Outside this phase: synthesis-closeout exited 2 (`count_only_state_findings_not_reconstructed`, needs `registry.metrics.sourceFindings`, which no single-executor producer writes); iteration 5's graph upsert hit a SQLite FOREIGN KEY error on edges to undeclared nodes (`coverage-graph-db.ts:760`).

## Recorded state

```json
{
  "stats": {
    "total": 16,
    "open": 0,
    "active": 0,
    "answered": 16,
    "blocked": 0,
    "exhausted": 0,
    "abstained": 0,
    "pruned": 0
  },
  "budget": {
    "depth1": {
      "allotted": 8,
      "spent": 4
    },
    "depth2": {
      "allotted": 9.6,
      "spent": 10
    },
    "depth3": {
      "allotted": 2.4,
      "spent": 0
    }
  }
}
```
