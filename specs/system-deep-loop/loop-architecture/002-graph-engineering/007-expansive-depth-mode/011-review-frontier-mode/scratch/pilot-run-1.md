# Target-1 review pilot (FAIL on AC-011, T031 PASS)

Run 2026-11-17 23:0x to 2026-11-18 00:0x UTC in a throwaway detached worktree at pilot sha `adedc72e930` on fixture `specs/z_scratch/994-expansive-review-pilot` (never merged): review of `adedc72e930~100..adedc72e930` (400 commits, 60 merges, 49 index rebuilds), fan-out 6 lineages x maxIterations 16 on cli-pi `deepseek-v4.1-flash-1017` max, all four dimensions (T000).

- T031 PASS: `{"half":8,"need":8,"holds":true}`, 50% of 16 = 8 >= ceil(7/6)*4 = 8.
- AC-011 FAIL: 6 depth-1 nodes, not 7 (the root children cap of 6 pruned the 7th as `fanout`), and 3 of 6 lineages stopped on `maxIterationsReached` (pi-2, pi-5, pi-6; pi-1 and pi-4 stuckRecovery, pi-3 converged). Zero open and zero active: `{"total":12,"open":0,"active":0,"answered":6,"pruned":6}`. Merge guard `{"passed":true,"missing":[]}`.
- Seed prunes: 26 `merge-no-own-diff`, 48 `generated-artifact`, 2 `fanout`. 34 of 60 merges carry their own conflict-resolution diffs and were kept.
- Defects found and fixed on integration (`43eb6d47b8e`, each with a fail-first test): the root depth-1 cap now honors the documented range; a git-range target checks proposal scope against `reviewScopeFiles` (all 6 depth-2 proposals had been pruned `relevance`); merged node ids are lineage-qualified (`F-2-002` appeared three times); the docs name the recorded key `frontier_partition`.
- Open for the operator: a lineage keeps running after its node is answered (pi-2 and pi-6 ran 12 more iterations to the cap).
