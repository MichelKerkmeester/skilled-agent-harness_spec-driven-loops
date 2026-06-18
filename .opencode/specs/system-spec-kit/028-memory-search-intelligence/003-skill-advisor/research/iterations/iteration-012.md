# Iteration 12: Round E Verify+Feasibility — Advisor Contamination/Drift Family

## Focus
Round E verify+feasibility for the iter-8 contamination/drift family (not covered by Round C's C4-gate scope). Read-only.

## Assessments (newInfoRatio 0.70)
| Candidate | Real | Feasibility | Note |
|---|---|---|---|
| SA-author-self-boost-guard | PARTIAL | CAUTION | mechanism real but **symmetric-by-design** (every skill scores off its own authored signals = the explicit_author lane); a blanket "no self-scoring" guard neuters it. The real vector (advisor recommending ITSELF) is ALREADY mitigated by 2 hardcoded penalties (fusion.ts:134,313). Scope to generalizing those, not a blanket guard |
| SA-family-normalization-dedup | PARTIAL | CAUTION (collapse ≈ NO-GO) | family taxonomy EXISTS in skill-graph but near-siblings are deliberately SOFT edges (0.4-0.6), NOT collapsed; cli-claude-code/cli-codex/cli-opencode are intentionally distinct routable targets (explicit.ts:296-299). Hard-collapse conflicts with the design; grouped-DISPLAY is feasible |
| SA-attested-baseline-drift-sweep | PARTIAL | CAUTION | "never auto-rebaseline" ALREADY holds for live (liveWeightsFrozen/autoPromotion:false); net-new = attested baseline for the SHADOW path only; current records are ephemeral tmpdir (:26) → needs a durable-storage decision (the gating choice) |
| SA-anti-flap-warning-dedup | **REFUTED** | NO-GO | no warning-id/epoch/decile scheme exists anywhere in the advisor — mis-mined from another subsystem (deep-loop/memory-drift); no emitter to migrate |

## Key correction
The contamination/drift family is **softer than mined**: self-boost is symmetric-by-design (already mitigated for the real self-rec vector), family hard-collapse conflicts with the intentional soft-sibling model (cli-* are distinct targets), and anti-flap-dedup is REFUTED (mis-mined). The one genuine net-new is the **attested-baseline-drift for the shadow path** — gated on a durable-storage decision (tmpdir is ephemeral).

## Next Focus
Advisor contamination/drift mostly soft/already-mitigated; attested-baseline (shadow, durable-storage-gated) is the survivor. Drop anti-flap-dedup. Feeds synthesis.
