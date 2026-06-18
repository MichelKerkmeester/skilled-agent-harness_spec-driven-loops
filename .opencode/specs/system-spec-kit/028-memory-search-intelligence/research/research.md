# Improvement Roadmap: Memory Search Intelligence (Packet 028)

> Cross-cutting synthesis of four completed deep-research reports — **Memory MCP** (001, 21 candidates, PRIMARY), **Code Graph** (002, ~13 candidates), **Skill Advisor** (003, 9 candidates), **Deep Loop** (004, 11 candidates) — mining two external memory systems (**aionforge-memory**, Rust; **galadriel**, Python) for evidence-backed, code-mapped improvements across all four internal subsystems. This roadmap is organized by the **six cross-cutting spine themes** (not by subsystem) so that the *generalizable* external techniques are visible across systems. Per-subsystem detail lives in each child's `research/research.md` (linked in §Per-Subsystem Pointers).

## Executive Summary

Three meta-findings lead this roadmap:

1. **PROMOTE-the-off-state-flag is the single biggest pattern.** Across all four subsystems, the highest-leverage wins are existing-but-flag-gated-OFF or structurally-half-built machinery, NOT build-new. Memory ships bi-temporal edges, idempotency receipts, deferred/async save, pure rank-time decay, and graceful-degrade substrate — all gated OFF or unwired. Skill Advisor ships an end-to-end shadow pipeline (durable outcome capture + bounded delta estimator + shadow-weight registry) waiting to graduate. Code Graph ships confidence/evidenceClass fields plumbed to formatting but never multiplied into a score, plus off-by-default tombstones. Deep Loop ships a Beta-mean scorer that is exported but never imported by convergence. Of Memory's top-6, **5 are S-effort and 4 are PROMOTE-off-state**. The implementation spearhead is "flip the flag and wire the seam," not "write the algorithm."

2. **Determinism / reproducibility is the strongest unifying spine.** Every subsystem fuses ranked signals and renders sets a downstream model caches against. The shared `fuseResultsMulti {bonusOverChannels}` primitive plus the apply-exactly-once G2 invariant (both already shared-library code in `system-spec-kit/shared/algorithms/rrf-fusion.ts` + `stage2-fusion.ts`) underpin determinism across Memory, Skill Advisor, Code Graph, and Deep Loop. Determinism is also the unlock for galadriel's **stable-prefix prompt-cache (~84% cache-write reduction)** — byte-identical recall serialization is a prerequisite-by-spirit.

3. **The campaign surfaced a live framework bug — a near-zero-effort correctness FIX.** Deep Loop Q6: the shipped `deep_research_strategy.md` strategy template carries **zero** `<!-- ANCHOR:* -->` markers, but `reduce-state.cjs` (`:699-745`) requires all 7. A freshly-copied strategy therefore hard-fails `Missing anchor section key-questions in strategy file` on the first reduce after iteration 1. This session's own driver hit the bug firsthand and hand-patched its working copy. **Ship this first** — it is template-only, no runtime-code change, no dependencies, and it restores deterministic reducer behavior.

**Sibling priority** (seeded from 001): **code-graph is the heaviest beneficiary — touched by ALL FOUR original 001 spines** (determinism, bi-temporal currentness, query-class routing, graceful degradation), strongest for bi-temporal (commit-time = event-time) and query-class routing (same "indiscriminate graph expansion hurts single-hop precision" failure mode). Skill Advisor is touched broadly but more lightly (shared RRF substrate + already-live exit-75 degrade). Deep Loop is touched by determinism and graceful-degradation meaningfully, bi-temporal/query-class marginally — but owns the keystone reliability-weighted-learning spine.

> **Evidence convention.** Each child report marks claims **[CONFIRMED]** (file:line read directly) vs **[INFERENCE]/[INFERRED]** (reasoning over confirmed evidence, naming what would confirm). All internal seams below are preserved verbatim from the child reports. The *cross-subsystem reuse* mappings in this roadmap are largely **inferred** from the 001 seed and need impl-time confirmation (see §Provenance & Caveats).

---

## The Six Spine Themes

### (1) Determinism / Reproducibility

**External technique:** aionforge separates content-derived `SerializationId` render order from score-based fusion order, fuses by RANK (never raw score), and treats a rescan of unchanged content as an idempotent no-op. galadriel's stable-prefix prompt-cache (~84% cache-write reduction) depends on byte-identical output. The transferable artifact is the shared `fuseResultsMulti {bonusOverChannels}` primitive + the apply-exactly-once G2 invariant.

| Candidate | Subsystem | One-line change | Seam (file:line) | Lev | Eff | Class |
|---|---|---|---|---|---|---|
| **C5-B** | Memory | Content-derived tie-breaks (`score desc, then canonicalId asc`) replacing score-only/clock tie-breaks | `hybrid-search.ts:752-758, 900-904, 922-926` | M-H | S | BUILD-small |
| **C5-A** | Memory | Content-derived serialization-order render stage (`serializationId = sha256(canonical fields)`), separating render order from score order | `formatters/search-results.ts:782`; `envelope.ts:99` | M-H | M | BUILD-new |
| **C-X1** | Memory | Shared `fuseResultsMulti {bonusOverChannels:'active'|'configured'}` so zeroing channels doesn't distort survivors' convergence bonus | `rrf-fusion.ts:345-388` | H | S→M | BUILD-new |
| **C6-A** | Memory | Always-on rank-time decay vs caller-supplied `nowMs` (not just `trackAccess`); reinforcement as a separate explicit event | `stage2-fusion.ts:897-908`; `fsrs.ts:40-47` | H | S→M | PROMOTE |
| **C4-B** | Memory | Content-addressed identity for DERIVED artifacts (`derived_id = sha256(canonical-triple + source + rule_version)`), causal edges first | `causal-edges.ts`; sha256 helper `memory-index.ts:281` | M | M | BUILD-new |
| **C3 (RRF)** | Skill Advisor | Import 001 shared `fuseResultsMulti` + deterministic RRF (fuse by rank, stable id tiebreak, weight:0 elision); advisor passes its OWN smaller `k` | `fusion.ts:69-82, :425+`; `rrf-fusion.ts:272-399` | H | M | PROMOTE (import) |
| **C2 (RRF order)** | Skill Advisor | Deterministic RRF byte-stable output replacing `toFixed(6)`+`localeCompare` tiebreaks (folds into C3) | `fusion.ts:409, 425-433` | M | S | PROMOTE (folds into C3) |
| **Cross-cut (det. impact order)** | Code Graph | Content-derived stable tiebreak (sort on node id/hash) so impact walk output is reproducible across runs instead of DB-iteration order | `code-graph-context.ts:627-671` | M | S | PROMOTE |
| **fuseResultsMulti reuse** | Code Graph | PROMOTE the 001 fuser (not build a code-graph-specific one) to fuse CALLS-channel + IMPORTS-channel impact results with a cross-channel bonus | `code-graph-context.ts:627-671` | M | M | PROMOTE (reuse 001) |
| **D-reproducible-fold** | Deep Loop | Reproducible convergence/newInfoRatio folding + content-derived node-id ordering for quarantine victim tie-break (no new determinism mechanism) | `convergence.cjs` fold; Q2 tie-break | M | S | PROMOTE (reuse 001) |

**Note:** the determinism primitive is the most-transferable single artifact in the whole packet — Memory builds it (C-X1), Skill Advisor imports it (C3), Code Graph promotes it (impact-channel fuse), and Deep Loop reuses its content-derived ordering. See §Sequencing Notes.

---

### (2) Bi-temporal Edge-Based Currentness

**External technique:** aionforge models currentness as **edge presence**, not physical deletion — supersede via `SUPERSEDED_BY`/`CONTRADICTS` edges + closed validity windows (`valid_from`/`valid_to` event-time + `ingested_at`/`expired_at` transaction-time), so a superseded fact is closed (History-readable) rather than destroyed. "Successful call = proof of freshness"; the generation watermark makes a stale read an error, never silently-stale data.

| Candidate | Subsystem | One-line change | Seam (file:line) | Lev | Eff | Class |
|---|---|---|---|---|---|---|

---

## Broadening Addendum (100-iteration campaign)
