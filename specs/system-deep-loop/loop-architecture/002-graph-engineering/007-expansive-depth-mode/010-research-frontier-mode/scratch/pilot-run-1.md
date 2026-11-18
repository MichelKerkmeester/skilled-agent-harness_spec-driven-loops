# Target-2 research pilot, first run (FAIL on AC-014)

Run 2026-11-17 22:4x to 23:5x UTC in a throwaway detached worktree at `f8c334b9c39` on fixture `specs/z_scratch/995-expansive-pilot-advisor` (never merged), cli-pi `deepseek-v4.1-flash-1017` max, `--depth-mode=expansive --max-iterations=12`.

- Result: stop `maxIterationsReached` after 12 iterations (checks 1-12 all CONTINUE `noStopCandidate`; blockedBy `sourceDiversity`). AC-014 FAIL. SC-002 admission half met: 4 seed depth-1 nodes (rooted at prompt-policy.ts and the default prompt-policy JSON), 8 admitted beyond them (5 at iteration 2, 3 at iteration 3), scorer at depth 2 (F-2-005).
- Defects found and fixed on integration (`1642d622a3b`, each with a fail-first test): frontier graph upsert fed JSONL to a single-JSON reader; the budget close ran before the answered projection and relabelled answered nodes exhausted; iteration 1 had no frontier block (new `step_frontier_reduce_seed`).
- Stop analysis: the cap check (`convergence.cjs` cap before the all-answered candidate) and the default-path source-diversity guard and graph STOP_BLOCKED keep a non-cap stop out of reach at these caps; changing those gates would change default runs (D2).

## Recorded state

```json
{
  "stats": {
    "total": 12,
    "open": 0,
    "active": 0,
    "answered": 4,
    "blocked": 0,
    "exhausted": 8,
    "abstained": 0,
    "pruned": 0
  },
  "budget": {
    "depth1": {
      "allotted": 6,
      "spent": 4
    },
    "depth2": {
      "allotted": 4.2,
      "spent": 5
    },
    "depth3": {
      "allotted": 1.8,
      "spent": 0
    }
  },
  "nodes": [
    {
      "nodeId": "F-1-001",
      "depth": 1,
      "status": "answered",
      "reason": null
    },
    {
      "nodeId": "F-1-002",
      "depth": 1,
      "status": "answered",
      "reason": null
    },
    {
      "nodeId": "F-1-003",
      "depth": 1,
      "status": "answered",
      "reason": null
    },
    {
      "nodeId": "F-1-004",
      "depth": 1,
      "status": "answered",
      "reason": null
    },
    {
      "nodeId": "F-2-005",
      "depth": 2,
      "status": "exhausted",
      "reason": "budget"
    },
    {
      "nodeId": "F-2-006",
      "depth": 2,
      "status": "exhausted",
      "reason": "budget"
    },
    {
      "nodeId": "F-2-007",
      "depth": 2,
      "status": "exhausted",
      "reason": "budget"
    },
    {
      "nodeId": "F-2-008",
      "depth": 2,
      "status": "exhausted",
      "reason": "budget"
    },
    {
      "nodeId": "F-2-009",
      "depth": 2,
      "status": "exhausted",
      "reason": "budget"
    },
    {
      "nodeId": "F-2-010",
      "depth": 2,
      "status": "exhausted",
      "reason": "budget"
    },
    {
      "nodeId": "F-2-011",
      "depth": 2,
      "status": "exhausted",
      "reason": "budget"
    },
    {
      "nodeId": "F-2-012",
      "depth": 2,
      "status": "exhausted",
      "reason": "budget"
    }
  ]
}
```
