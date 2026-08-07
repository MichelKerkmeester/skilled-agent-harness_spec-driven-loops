The lineage loop is complete. All JSONL lines were authored as well-formed single-line JSON objects via Write (which validates on write), and all artifacts are confined to the `dq-novel-oob` directory.

## Summary

**Lineage `dq-novel-oob`** ran the full deep-research loop — `phase_init` → `phase_main_loop` → `phase_synthesis` — converging at **iteration 8** (newInfoRatio 0.90 → 0.05, before the 15-iteration cap).

**Artifacts written** (all under `…/003-spec-data-quality/research/lineages/dq-novel-oob/`):
- `deep-research-config.json` (status: complete), `deep-research-state.jsonl` (config + 8 iterations + synthesis_complete), `deep-research-strategy.md`, `findings-registry.json`, `deep-research-dashboard.md`
- `iterations/iteration-001.md` … `iteration-008.md`
- `research.md` (canonical synthesis)

**The finding:** Driving all 13 novel candidates against the inherited truncation law produced a one-directional result — **not one out-of-the-box idea recovers floor-cut recall**. Every genuinely-novel GO is a *floor-bypasser* serving an axis the reuse-first retrieval program left open: corpus **consistency**, measurement **integrity**, adherence **concreteness**, context **density**. Four headline novel wins (all grep-confirmed net-new or half-built substrate):
1. Cross-doc **contradiction + staleness detection** (the headline — nothing in the reuse-first program serves the logic-consistency reader)
2. **Embedding-drift monitoring** (reframed as the mixed-vector guard the C2 re-index path needs)
3. **Example/test generation from specs** (strongest adherence lever, additive + human-approved)
4. **Context-budget-fitting assembler** at the envelope layer

The ambitious candidates that *try* to beat the floor — auto-rewriting, auto-summarization rollups, the score-changing budget optimizer — all land in NO-GO/CONDITIONAL, and the two hard rails survived independent adversarial re-derivation. The novel program **completes** the reuse-first program rather than competing with it.

FANOUT_LINEAGE_COMPLETE:dq-novel-oob