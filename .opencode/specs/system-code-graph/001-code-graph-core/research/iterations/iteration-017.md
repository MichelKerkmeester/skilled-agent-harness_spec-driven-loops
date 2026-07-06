# Iteration 17: Round G Final Honesty Audit — The Roadmap Is Stale; Most-Likely-Wrong Surviving Claim

## Focus
Round G final honesty self-audit of the broadening campaign (75 iterations). Read-only over roadmap.md + child research.md verdicts. (Assigned to 002 for accounting; the audit is cross-system.)

## Findings (newInfoRatio 0.35)

**THE roadmap is now a stale over-claim artifact (highest-priority synthesis action).** Every correction the campaign made lives in the iteration/delta/handover files (timestamps to ~20:20) but was **never propagated into `research/roadmap.md` (mtime ~18:59)** — so the roadmap still asserts verbatim: "Determinism… is the **strongest unifying spine**" (→ refuted, 2-of-4), C4 as a "**GRADUATION**… not a new build" (→ refuted, no Beta math at all), D2 as the "**KEYSTONE**" (→ refuted, absent), "**PROMOTE-off-state** is the single biggest pattern" (→ refuted, 0-of-4 clean flips). **The synthesis MUST re-sync the roadmap before it can serve as the spec source of truth.**

**Most-likely-wrong SURVIVING claim:** **C3-A "flip `SPECKIT_TEMPORAL_EDGES` ON = clean reversible S-effort win"** (ship-first #3). Machinery is CONFIRMED (contradiction-detection.ts:75-77,99-110, gated OFF), but the "clean flip" leverage is contradicted by the promote-off-state 0-of-4 finding + the roadmap's own open-items (causal-edge↔lineage reconciliation `vector-index-schema.ts:184-185` "must unify, not fork"; FSRS-reinforcement under the C6-A split). **What would confirm:** enable on a corpus copy, run recall + contradiction-detection suites, verify no false auto-invalidations / no FSRS interaction / the two temporal stores reconcile. Runner-up: **C5's "confirmed ~13% skew"** is asserted-not-measured (Provenance lists "C5 baseline capture" as open — fails the regression-baseline rule).

**Structured-trace gaps:** child research.md files are 24/34/44-line stubs (Code Graph's Candidate Catalog is an empty heading); the real evidence lives in findings-registry.json + iterations. `ruledOutDirections` is empty in both registries — the ~12 refutations have no structured trace, only narrative.

**Implementation readiness: MIXED** — the additive/rank-time/correctness picks (Q6-anchor FIX, Q4-C1, Q6-C2, C9, C5-B) are ready-to-spec (CONFIRMED file:line, neutral fallback, no schema/txn); the flag-flips + learning/temporal clusters (C3-A, C4-A, C5 baseline, D2/D3) need per-candidate validation; AND the roadmap must be re-synced first.

**Top-3 highest-confidence picks:** Q6-anchor FIX (live bug hit firsthand, template-only) · Q4-C1 (confidence/evidenceClass plumbed to formatting, needs only a scoring read-site, neutral fallback) · C9 (keep-lexical substrate present, recall throwing — pure unwire + flag). Honorable: Q6-C2 (additive int, non-breaking).

## Next Focus
**Synthesis action #1: re-sync roadmap.md** with all corrections (this iteration is the directive). Then the additive/correctness picks are ready-to-spec; the rest needs per-candidate validation. This closes the broadening at honest 75/75.
