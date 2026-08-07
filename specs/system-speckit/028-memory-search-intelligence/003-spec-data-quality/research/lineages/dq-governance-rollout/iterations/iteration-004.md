# Iteration 004 — KQ4: The measurement plan (how each tier earns its keep)

## Focus

Every tier must prove its own metric on its own reader before it earns a keep. The measurement plan is the proof obligation per tier, and the single discipline that prevents a proxy from being mistaken for a retrieval win.

## The governing principle: one reader, one metric, no cross-credit

The truncation law splits readers (R retrieval / A adherence / L logic). A win for one reader is NOT a win for another. The cardinal error the whole packet guards against: treating a high form-only quality score (an A/L proxy) as a retrieval win (an R outcome). "Perfected" is honest for adherence/logic/governance (directly enforced) and aspirational-until-measured for retrieval (parent §5; dq-deep §3 measurement honesty).

## Tier 1 — Write-time / on-write (adherence + coverage metrics)

**What it claims:** the corpus conforms to shape/enum/schema/EARS/coherence rules.
**Metric:** corpus-wide conformance count, driven to zero, plus a regression-catch proof.
**The proof sequence (per gate):**
1. Stage-0 census → the real failing band (N docs fail this detector).
2. WARN report → confirms N corpus-wide.
3. backfill → re-measure → N = 0.
4. flip to ERROR → a deliberately-corrupted scratch packet now exits 2 (the gate catches a regression it is supposed to catch).
**Earns its keep when:** conformance count reaches and holds at 0 AND the scratch-packet test proves the gate blocks a real regression. This is NOT a retrieval claim; it is a conformance + regression-catch claim. Honest and directly measurable.

## Tier 2 — Retroactive / scheduled (the multiplier metric)

**What it claims:** the standing sweep catches defects the change-triggered tiers (pre-commit + CI path-gates) structurally cannot.
**Metric:** defects caught in files the change-triggered tiers missed, across the three escape classes (dq-skilldoc §1):
- (a) path-filter escapes — a file no CI `paths:` filter matches (e.g. a SKILL.md hub edit under a `references/**`-only filter).
- (b) backfill blind spots — latent defects in files untouched since a rule shipped.
- (c) cross-surface coherence — defects spanning multiple `paths` roots no single-root PR triggers.
**Plus operational metrics:** safe-fix apply rate; idempotency proof (a second run on the cleaned corpus produces zero diffs).
**Earns its keep when:** the first scheduled run finds ≥1 defect in each escape class that the existing 8 CI workflows + 5 pre-commit gates demonstrably did not catch. If the scheduled tier finds nothing the change-triggered tiers missed, it has not earned its keep and should be downgraded to on-demand.

## Tier 3 — Retrieval (prod-mode completeRecall@3 ONLY)

**What it claims:** a candidate changes the composition of the truncated prod top-3.
**Metric:** prod-mode completeRecall@3, measured by `run-eval-v2.mjs` dual-mode (eval path vs prod path on the same copy DB) with the eval-vs-prod fidelity delta (dq-automation-impl C2; `run-eval-v2.mjs:5-26,233-238`).
**The proof obligation (the C2 gate, S14):**
- PROMOTION: prod@3 must RISE. REGRESSION: fail on a prod@3 drop. The gate reads ONLY the prod column (`skill_advisor_bench.py:248` blocking-gate pattern ported).
- Precondition: coverage = 100% under the current `embedding_context_version` (else the mixed-vector confound, guarded by N6a/S9).
**Earns its keep when:** a dual-mode read shows prod@3 RISE, not eval@K. External benchmarks (@5/@10/@20) and eval-mode @K are explicitly INADMISSIBLE — the K=3 floor hides exactly that band (parent §1: "real and irrelevant in the same breath"). This is the single most-guarded measurement in the program.

## Tier 4 — The novel correctness/adherence program (each on its own non-retrieval metric)

None of these is a retrieval claim; each proves a distinct reader outcome:
- **Contradiction detector (N5a):** precision/recall on graph-nominated candidate pairs (a build-stage measurement; dq-novel-oob open question).
- **Context-budget assembler (N1a):** token-per-relevant-row + duplicate rate in the assembled window — measurable WITHOUT a re-index (dq-novel-oob iter 1). Explicitly NOT recall.
- **Example/test generation (N6b):** an adherence A/B study — does a generated example steer an implementing agent better than a prose requirement (inherits the parent's EARS A/B obligation).
- **Embedding-drift monitor (N6a):** the mixed-embedding-regime chunk census (the Stage-0 census for the retrieval half).
- **LLM-judge (N2a):** marginal value of LLM semantics over the form-only scorer — and for any RANKING use (N2b), the same C2 prod@3 gate as every other retrieval item.

## The two open measurements deferred to a build (inherited, not resolved here)

1. The on-write write-latency of A1 scoring on a large spec (the 005 spec.md is 10.6KB) — a timing measurement (dq-deep / dq-automation-impl open Q).
2. The per-detector corpus-wide failure counts — the Stage-0 census, deferred to a build (every prior lineage's "asserted, not counted").

Governance does not resolve these; it NAMES them as the build's first two measurements so they are not silently skipped.

## The measurement discipline in one sentence

Each tier proves its own metric on its own reader — conformance-to-zero + regression-catch for write-time, escape-class defects for the scheduled sweep, prod-mode completeRecall@3 RISE for retrieval, and a distinct non-retrieval metric for each novel item — and no tier may borrow another tier's evidence, because a high proxy score is never a retrieval win.

## Dead Ends

- Promoting a retrieval candidate on the external brief's @5/@10/@20 numbers or eval-mode @K. The floor hides that band; this is the eval-mode saturation trap (parent §3).
- Crediting the write-time quality-loop score as a retrieval improvement. A high form score is not a retrieval win (dq-deep §3).

## Sources

- `../../research.md` §1 (recall@K hidden), §5 (hypothesis-until-prod-measured)
- `../dq-automation-impl/research.md` C2 (`run-eval-v2.mjs:5-26,233-238`; `skill_advisor_bench.py:248`), §7 (open measurements)
- `../dq-deep/research.md` §3 (measurement honesty)
- `../dq-novel-oob/research.md` iter 1 (assembler metric), §6 (open questions)

## Assessment

newInfoRatio 0.66 — the measurement plan consolidates into four tiers, each with a named metric, a proof obligation, and an explicit "earns its keep" bar. The key consolidation: the one-reader-one-metric-no-cross-credit principle is the discipline that unifies every prior lineage's measurement caveat. The scheduled tier's "earns its keep" bar (escape-class defects) is novel to this synthesis — prior lineages asserted the sweep's value but did not state its falsification condition.
