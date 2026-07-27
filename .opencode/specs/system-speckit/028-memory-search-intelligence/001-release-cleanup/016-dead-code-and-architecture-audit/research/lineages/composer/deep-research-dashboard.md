# Deep Research Dashboard — composer lineage

| Field | Value |
|-------|-------|
| **Lineage** | composer |
| **Session** | fanout-composer-1785133613018-3fbdzo |
| **Status** | complete |
| **Stop reason** | max_iterations (forced depth 5/5) |
| **Iterations** | 5 / 5 |
| **Findings** | 22 |
| **Avg newInfoRatio** | 0.76 |
| **Executor** | cli-cursor / composer-2.5-fast |

## newInfoRatio trend

| Iter | Focus | Ratio |
|------|-------|-------|
| 1 | bin/ launchers | 1.00 |
| 2 | MCP-server trees | 0.85 |
| 3 | deep-loop runtime | 0.75 |
| 4 | hub metadata | 0.65 |
| 5 | commands/agents/mirrors | 0.55 |

## Findings by category

| CAT | Count | IDs |
|-----|-------|-----|
| CAT-1 dead code | 3 | F1, F9, F22 |
| CAT-2 legacy/superseded | 4 | F5, F7, F18, (F6 partial) |
| CAT-3 backup/scratch residue | 3 | F6, F13, F21 |
| CAT-4 misplaced files | 3 | F2, F16, F9 |
| CAT-5 architecture problems | 6 | F3, F8, F11, F14, F17, F19, F20 |
| CAT-6 over-engineering | 4 | F4, F12, F15, (F11 partial) |

## Convergence report

- **Stop reason:** max_iterations (operator forced depth; convergence threshold never triggered early stop)
- **Questions answered:** 5 / 5 key questions
- **Quality guards:** source diversity pass, focus alignment pass, no single weak source pass
- **Carried forward:** Whether calibration/decision-evaluator closure files are required for manifest sync only (F4)

## Iteration artifacts

- `iterations/iteration-001.md` … `iteration-005.md`
- Synthesis: `research.md`
