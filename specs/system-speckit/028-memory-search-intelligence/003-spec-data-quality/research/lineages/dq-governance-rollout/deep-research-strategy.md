# Deep Research Strategy: dq-governance-rollout

## Topic

Consolidate the full data-quality program from all prior lineages into one shippable, safe **governance and rollout** layer. Do NOT re-derive the program; sequence and govern it. Produce five deliverables: (1) unified priority-ordered rollout sequence across on-write/retroactive/retrieval tiers with dependency order and safe-first staging; (2) the corpus migration plan (warn-then-error, backfill, coverage-guard gating); (3) the safety/governance model (safe vs guarded vs report-only fixes, per-stage rollback, human-in-the-loop boundaries, idempotency + drift guards); (4) the measurement plan (prod-mode completeRecall@3 for retrieval, adherence/coverage for write-time, how each tier earns its keep); (5) the consolidated NO-GO list + anti-patterns.

## Known Context

Inherited as settled from the parent and the four sibling building-block lineages (NOT re-derived; this is the exclusion set this lineage CONSOLIDATES rather than extends):

- **The truncation law (parent).** Prod retrieval truncates each query to a 3-result floor (`confidence-truncation.ts:35` `DEFAULT_MIN_RESULTS=3`, wrapped in `if(!evaluationMode)` at `hybrid-search.ts:2049`). 028 measured completeRecall 0.212 eval vs 0.036 prod at K8 (5.9x gap). A feature earns a prod keep only by changing the composition of the truncated top-3. Retrieval candidates pay the floor tax + a re-index cost; adherence/logic/write-time candidates bypass the floor.
- **The two hard rails (parent + all siblings, adversarially re-derived by dq-novel-oob).** RAIL-1: NO body-mutating auto-fix (the `quality-loop.ts:463-468` substring budget-trim is destructive on authored docs). RAIL-2: NO retrieval promotion without a prod-mode completeRecall@3 read.
- **The reuse-first program (dq-deep / dq-automation-impl).** A1 extend the PURE scorer (`computeMemoryQualityScore`) + non-mutating reviewer (`reviewPostSaveQuality`) to the authored + metadata-JSON surface — NOT the destructive `runQualityLoop`. A2-A8 enum/schema/propagation/EARS/REQ_COVERAGE/HVR-linter/provenance. B1 standing scheduled corpus sweep (the empty cron tier). B2 `/doctor data-quality` auto-remediation tier. B3 retrieval-learning feedback edge (report-only queue, edge-a bypass / edge-b C2-gated via `min_rank_seen`). C1 header-path chunk prefix (retrieval, C2-gated). C2 prod-mode completeRecall@3 benchmark+regression gate (the unblocker; `run-eval-v2.mjs` already dual-mode).
- **The shared architecture (dq-automation-impl).** ONE `dq-engine.ts` + `detector-registry.ts` (frozen deny-by-default `fixClass` allow-list), THREE front doors (A1 on-write report-only, B1 scheduled report+safe-apply, B2 interactive report+`--confirm`-safe), B3 detector→report-only queue, C2 gate for every retrieval/risky promotion.
- **The three timing tiers (dq-skilldoc-cmd-ctx).** on-write (pre-commit: 5 gates), PR-time (CI: 8 path-filtered workflows), scheduled (cron: ZERO — the empty multiplier tier). Per-surface detectors S1-S5 (skill docs), C1-C4 (commands), X1-X5 (context-engineering).
- **The novel correctness/adherence program (dq-novel-oob).** N6a embedding-drift monitor (mixed-vector guard), N5a cross-doc contradiction+staleness (headline), N6b example/test generation, N1a context-budget-fitting assembler, N4a typed-relation KG, N5b freshness queue, N7b per-doc SLAs, N2a LLM-judge governance. Every novel GO is a floor-bypasser; the program is a CORRECTNESS+ADHERENCE program disjoint from the retrieval program.

resource-map.md not present; skipping coverage gate.

## Key Questions

- KQ1: What is the single unified priority-ordered rollout sequence that merges dq-automation-impl's 11-stage build order, the novel correctness/adherence slate, and the per-surface detectors into ONE dependency-ordered, safe-first staging across the three timing tiers?
- KQ2: What is the migration plan for the EXISTING corpus — the warn-then-error discipline, the backfill ordering, the coverage-guard gate that does not exist yet, and the Stage-0 census — so no gate flips to error before its backfill clears?
- KQ3: What is the consolidated safety/governance model — the `fixClass` taxonomy (safe vs guarded vs report-only) unified across EVERY detector from all lineages, the per-stage rollback, the human-in-the-loop boundaries, and the idempotency + drift guards?
- KQ4: What is the measurement plan — prod-mode completeRecall@3 for retrieval, adherence/coverage metrics for write-time, and the explicit "earns its keep" proof obligation per tier so a proxy is never mistaken for a retrieval win?
- KQ5: What is the consolidated NO-GO list and the governance anti-patterns (the meta-traps) merged from every lineage?
- KQ6: What cross-lineage conflicts and corrections must governance reconcile (dq-deep "extend quality-loop" vs dq-automation-impl "don't"; dq-deep "no retroactive automation" vs dq-skilldoc "8 CI workflows"; dq-probe "build wikilink validator" vs dq-skilldoc "already built")?
- KQ7 (adversarial): Does the consolidated program have governance gaps, sequencing contradictions, or unstated dependencies? Resolve them into one authoritative governance spine.

## Next Focus

None. Lineage converged at iteration 7 (newInfoRatio 0.05). Synthesis written to research.md.

## Non-Goals

- Re-deriving the truncation law, the two rails, or any prior-lineage finding. They are inherited settled.
- Re-listing or re-justifying the reuse-first program, the per-surface detectors, or the novel candidates as new work. This lineage SEQUENCES and GOVERNS them.
- Building or shipping anything. This lineage produces a governance/rollout design only.
- Touching any path outside this lineage's artifact_dir.

## Stop Conditions

- All five deliverables (rollout sequence, migration plan, safety/governance model, measurement plan, NO-GO + anti-patterns) are complete and grounded to a prior-lineage finding or a file:line.
- The cross-lineage conflicts are reconciled into one authoritative spine.
- An adversarial pass has tested the consolidated program for sequencing contradictions and governance gaps.
- newInfoRatio drops below 0.05, or 15 iterations reached.

## What Worked

- Treating the SAFETY PROPERTY as the ordering function. Every prior lineage said "the order is the safety property"; consolidating them means literally deriving the master stage list from the dependency rule "no gate reaches error before its backfill, no retrieval promotion before C2, no front door before the shared engine."
- Mapping every prior-lineage ID (A1-A8, B1-B3, C1-C2, S/C/X detectors, N1a-N7b) onto exactly two axes: TIMING tier (on-write / scheduled / retrieval) and SAFETY class (safe / guarded / report-only). The two-axis grid is the whole governance model.
- Reconciling the cross-lineage corrections FIRST (the quality-loop conflict, the empty-cron correction, the wikilink correction) so the spine is built on the survived facts, not the superseded framings.

## What Failed

- Trying to keep retrieval and the novel program on one timeline. They are disjoint: the retrieval half is frozen behind C2; the novel correctness/adherence half ships report-only on cost. Forcing one order obscured that the novel slate can ship in parallel with the floor-bypassing reuse-first half.
- An early attempt to make CI auto-apply safe fixes. CI auto-commit is a corpus-wide blast radius; the governance rule is CI report-only, safe-apply is local/`--confirm` only.

## Exhausted

- Trying to compress the migration into fewer than the warn→backfill→re-measure→error sequence. Every prior lineage independently requires the same four-beat per gate; it does not compress.
- Trying to find a retrieval promotion path that skips C2. None exists; the truncation law forecloses it.
