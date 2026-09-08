# Iteration 10: Final consolidation — the adversarial re-probes, the F→L dedup, the synthesis

## Focus

The three weakest claims, re-probed before the ledger froze (F1.5's resolution mechanism, F9.5's final hop, F2.4's vec0-shadow nuance); the severity roll-up and the P1 dedup (53 F-rows → the L-ledger); the charter's close: the ranked remove/merge/move backlog, the memory-era residue flagged where it concentrates, and the synthesis into `research.md`.

## Findings

| # | path:line | Claimed vs actual | Severity | Recommendation |
|---|-----------|-------------------|----------|----------------|
| F10.1 | the worktree root (`node_modules` absence) — the F1.5 re-probe | Claimed (F1.5): deep-loop's resolution = "through the parent checkout" via the ancestor-walk. Actual, re-probed: **no `node_modules` exists at the worktree root** (`ls -d node_modules` = nothing) — so the simple ancestor-walk theory cannot alone explain the observed `require.resolve` → `/Users/…/MEGA/Development/Code_Environment/Public/…` result. The observation stands (deep-loop's 3 test files resolve OUTSIDE this worktree); the mechanism = **inference-flagged, not pinned**: one of the worktree-ancestor symlinks, the runner's `NODE_PATH`, or the resolver's realpath indirection. | P2 (refinement) | Fix stays L6 (install-where-declared); the mechanism-honesty = recorded in the synthesis's caveats. |
| F10.2 | the root `opencode.json` — the F9.5 re-probe | Claimed (F9.5): the compact-merge chain's final hop = the operator's settings, outside the audited trees. Actual, re-probed: the root `opencode.json` (3.3 KB) registers **none** of the four compact/precompact hooks — no `compact`/`hook` hit. The caveat stands exactly as written: source-side registration complete (4 adapters + the doctor's runtime-mirror inventory + the parity tests), the installed-settings hop = unverifiable from the five-tree write-surface. | P2 (refinement) | Document (F9.5's caveat = confirmed, not weakened). |
| F10.3 | `skill-advisor/mcp-server/lib/embedders/schema.ts:60-62` — the F2.4 re-probe | Claimed (F2.4, with the noted vec0-shadow caveat): the factory's persisted-pointer precedence = inert, "the failure = the `vec_memories_rowids` row-count gate". Actual, re-probed: `vecTableNameForDim(dim)` = **`vec_${dim}`** (schema.ts:60-62) — *the same convention the factory's `expectedTable` checks* — so the advisor's dim-tagged tables DO exist under the factory's expected names; the precedence-branch fails precisely and only at the `countRowsInSqliteTable(…, 'vec_memories_rowids') > 0` gate (0 occurrences in the advisor's lib). Thevec0-shadow question = moot: the failure = the 0-hit gate, full stop. | P2 (refinement) | Document (F2.4's precision, sharpened — the recommendation unchanged: delete the dead precedence branch + the shard machinery). |
| F10.3 | the F→L dedup (the whole ledger) | Claimed: 53 findings (30 P1 / 23 P2 / 0 P0) across 9 iterations. Actual: deduplicated to **10 P1 L-rows + 23 P2** — L1 the dead half (8 surfaces, ≈2,300+ lines, 0 production termination), L2 the database-path theater (the phantom sentinel, the nonexistent target), L3 the env-var ledger (24 vs 7, the 2-spelling ×4), L4 the proven-stale dist + the unprovisionable guard, L5 the import boundary (4 mechanisms, the 3-symbol barrel, the 5th root-resolver), L6 the dependency wiring (2/5 installed, 1 empirically broken, the 0-door test lane), L7 the isolation doctrine (3 mechanisms for 73 lines; 35 KB direct), L8 the four unwatched coupling conventions, L9 the dead types/diverged contracts/stranded exports/the inverted types→provider import, L10 the registry of dead weights inside the live modules + the census corrections. Each L-row = the F-refs + the blast-radius = the F9.3 strong/weak/dead ledger (nothing in the *strong* set = a removal candidate). | — (the consolidation) | Fix/Remove/Document — the 10-row ranked backlog, the charter's close (research.md §2-3). |
| F10.4 | the synthesis | The charter's deliverable, assembled: `research.md` (the verdict: two packages wearing one directory — the live ~60% and the unwired ~40%; the 10-row P1 ledger with the one-line claimed-vs-actual; the ranked backlog; the six residue concentrations; the ruled-out negatives; the honest caveats) + `convergence-report.json` + this registry. The 8/8 charter questions answered; 0 open questions carried; 3 documented unknowns (the MEGA-locus, the outside-the-audit hops, the vec0 nuance — mooted). | — | — |

**Ruled out this iteration:** an early synthesis at iteration 9 (the charter's 10-iteration mandate — and the re-probes sharpened two findings before the ledger froze); the vec0-shadow explanation of F2.4 (superseded by the convention-match: the tables exist, the rowids gate is the failure).

## Sources Consulted

- The three re-probes: the worktree-root `node_modules` (absent — `ls -d`), the root `opencode.json` (3.3 KB, 0 compact/hook hits), the advisor's `vecTableNameForDim` (schema.ts:60-62: `vec_${dim}`) vs the factory's `expectedTable`
- The 53-F-row ledger (findings-registry.json, the pre-dedup state) → the 10-row L-dedup, cross-checked against the F9.3 strong/weak/dead ledger for the blast-radius ranking
- The synthesis-assembly: `research.md` (the verdict, the ledger, the backlog, the residue concentrations, the ruled-out negatives, the caveats, the provenance)

## Assessment

- newInfoRatio: 0.5 — the consolidation; the new = the three sharpenings + the dedup structure itself.
- Novelty justification: F10.3's dedup = the packet's first complete severity-ranked, evidence-cited, blast-radius-ordered backlog; F10.1/F10.2 convert two caveats from "noted" to "re-probed"; F2.4 upgraded from "0-hit + nuance" to "precisely the rowids gate".
- Confidence: high for all four (the re-probes = direct observations; the dedup = mechanical over the 53-row evidence).

## Reflection

- Worked: spending the final iteration's tool budget on the *weakest* rows, not the strongest — two of three sharpened, one honestly downgraded to inference-flagged; the F9.3 ledger made the L-rows' "breaks no one" column mechanical.
- Failed: the initial `os.path(L, …)` python stub; the harness's var-expansion aversion in the pi-bash (`mkdir -p $L` = "does not prove one direct executor", the literal = fine) — noted for the runner.
- Ruled out: see above.

## Recommended Next Focus

None — the loop is complete. The follow-on implementation packet (the L1-L10 backlog) is a separate, separately-gated exercise; this lineage's write surface ends here.
