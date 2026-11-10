| Variant | Packets | Blind total mean | grounding | requirements | verification | scope | consistency | clarity |
|---|---|---|---|---|---|---|---|---|
| pre054 | 8 | 22.9 | 4.0 | 4.5 | 1.9 | 4.4 | 4.0 | 4.1 |
| main-no054 | 5 | 23.6 | 4.0 | 4.6 | 1.8 | 4.4 | 4.6 | 4.2 |
| now054 | 8 | 24.8 | 4.4 | 4.5 | 3.2 | 4.5 | 4.1 | 4.0 |
| refined | 8 | 25.5 | 4.1 | 4.5 | 3.6 | 4.8 | 4.4 | 4.1 |

| Variant | Baseline | Meaning | Pairs | Diffs by round | Diff mean | Verify ratio means | Residue means | Verdict |
|---|---|---|---|---|---|---|---|---|
| main-no054 | pre054 | main drift alone | 5 | r1:+3 r2:+1 r6:+2 r7:-2 r8:-1 | +0.6 | 0.00 vs 0.00 | 7.00 vs 6.50 | INCONCLUSIVE |
| now054 | pre054 | includes main drift | 8 | r1:+1 r2:+1 r3:+2 r4:+2 r5:+3 r6:+4 r7:+1 r8:+1 | +1.9 | 1.00 vs 0.00 | 5.75 vs 6.50 | REAL better |
| refined | pre054 | includes main drift | 8 | r1:+3 r2:+2 r3:+2 r4:+7 r5:-1 r6:+2 r7:+3 r8:+3 | +2.6 | 0.98 vs 0.00 | 6.00 vs 6.50 | INCONCLUSIVE |
| now054 | main-no054 | authoring work alone | 5 | r1:-2 r2:+0 r6:+2 r7:+3 r8:+2 | +1.0 | 1.00 vs 0.00 | 5.75 vs 7.00 | INCONCLUSIVE |
| refined | main-no054 | authoring work alone | 5 | r1:+0 r2:+1 r6:+0 r7:+5 r8:+4 | +2.0 | 0.98 vs 0.00 | 6.00 vs 7.00 | INCONCLUSIVE |
| refined | now054 | refinement effect | 8 | r1:+2 r2:+1 r3:+0 r4:+5 r5:-4 r6:-2 r7:+2 r8:+2 | +0.8 | 0.98 vs 1.00 | 6.00 vs 5.75 | INCONCLUSIVE |
