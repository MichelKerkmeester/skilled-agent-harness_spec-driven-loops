# Iteration 24: Round J GO Re-Verify — Memory + Code Graph GOs (evidence quality)

## Focus
Round J: adversarial re-verification of the top Memory + Code Graph GOs' evidence quality. Read-only.

## Re-verdicts (newInfoRatio 0.40)
| GO | Quality | Caveat |
|---|---|---|
| M-spare-only | **SOLID** | feedback-retention-reducer.ts:15 `new Set(['important'])` + :107 non-important→return-false; gap exact |
| C9 | **WEAKER-THAN-CLAIMED** | lexical fallback live ONLY on embed-fail + no-sqlite_vec preconditions (vector-index-queries.ts:1030,1041); the actual vector query :1044 is unguarded + arity-check :1019 throws — vector/multi-concept EXECUTION throws are NOT lexical-backed (I3 confirmed) |
| Q6-C2 | **ASSERTED** | ensure-ready.ts:497 = setLastGitHead in the out-of-scope-HEAD branch (won't fire on full_scan :504 / selective_reindex :517); the bump site is a proposed insertion, NOT existing additive code; `generation` token doesn't exist in the mcp_server |
| Q6-C1-generation | **WEAKER** | standalone IS feasible via the column-free code_graph_metadata store (no Q1-C1 dependency — the GO-standalone thrust holds), but the field is unimplemented (substrate-plausible, not confirmed-live) |
| CG-closed-vocab-CHECK | **WEAKER** | writers clean (10-value union) but the column has NO db enforcement; a rebuild adding CHECK hard-fails on any legacy/out-of-vocab row incl nullable tombstone.edge_type (:253) → needs a pre-migration SELECT DISTINCT scan; "no risk" unverified |

## Key note
The only SOLID Memory/Code-Graph GO here is M-spare-only. C9 + the Q6 pair + closed-vocab all carry a verification caveat the I-round sketches understated — each needs the noted confirm (C9's vector-branch lexical route; Q6-C2's real bump site; Q6-C1's implementation; closed-vocab's pre-migration scan) before "ready-to-spec." Honest deflation of the GO evidence quality.

## Next Focus
Feeds the roadmap re-sync — mark C9/Q6-C2/Q6-C1/closed-vocab as GO-with-verification-caveat, M-spare-only as clean GO.
