# Iteration 3: Flood-Resistant Beta-Posterior Convergence Design

## Focus

Q1 (deep): Design a bounded reliability-weighted Beta-posterior convergence term for the
research loop so a flood of weak/low-trust findings cannot manufacture a STOP verdict. Three
sub-parts: (a) source per-finding/per-source reliability from the existing `upsert.cjs`
metadata/weight slot, (b) wire the currently-unwired `bayesian-scorer.ts` into
`computeCompositeScore`, (c) cap the convergence contribution at the flood-resistance ceiling
`(α+k)/(α+β+k)`. Also confirm the current blend is vote-count-floodable. Candidate proposals
only — no implementations.

## Actions Taken

1. Read aionforge `attestation-and-promotion.md` (the canonical Beta-posterior flood-resistance
   source).
2. Read `convergence.cjs:107-141` (`computeCompositeScore`) — the live research blend.
3. Read `bayesian-scorer.ts:1-44` (the exported-but-unwired Laplace helper).
4. Cross-checked iter 1-2 context: `upsert.cjs` metadata (`:179`) + weight (`:224`) slot,
   `coverage-graph-signals.ts:295-450` signal emitters.

## Findings [file:line]

### F1 — Current research blend is fixed-weight and vote-count-floodable [CONFIRMED]
`convergence.cjs:115-121`: the research composite is a flat linear sum —
`questionCoverage*0.30 + claimVerificationRate*0.25 + invertedContradictions*0.15 +
normalizedDiversity*0.15 + normalizedDepth*0.15`. Two of the five terms are pure volume measures
normalized by a small constant: `normalizedDiversity = min(sourceDiversity/3.0, 1.0)`
(`:112`) and `normalizedDepth = min(evidenceDepth/5.0, 1.0)` (`:113`). Both saturate to their
0.15 ceiling on raw COUNT — 3 sources, 5 evidence items — with no reference to source quality.
`claimVerificationRate` (`:117`) is a ratio that any self-citing finding can satisfy. **A flood
of N weak, mutually-citing findings drives diversity and depth to their caps and inflates
coverage, monotonically raising the score toward STOP.** There is no asymptotic bound keyed to
reliability; the score is bounded only by the fixed weights, not by attester/source quality.
[CONFIRMED by direct read of `:107-141`.]

### F2 — `bayesian-scorer.ts` is a Beta(1,1) mean but unwired AND not reliability-weighted [CONFIRMED]
`bayesian-scorer.ts:13-25`: `computeScore(success, total) = (success+1)/(total+2)` is the
posterior mean of a Beta(1,1) prior updated by integer success/total counts (Laplace smoothing).
Two gaps: (i) it is exported but **no `require`/import of it exists in `convergence.cjs`** —
confirmed unwired (the composite never references it). (ii) Even if wired, its current signature
takes integer COUNTS, not per-source reliability `r ∈ [0,1]`. The aionforge design
(`attestation-and-promotion.md:30-40`) requires each source to contribute its reliability `r`
toward "correct" and `1-r` toward "not-correct" as FRACTIONAL evidence, so the denominator grows
by exactly 1 per source. The current integer signature cannot express that — it would need a
`computeWeightedScore(evidenceFor, evidenceAgainst, priorAlpha, priorBeta)` companion accepting
floats. [CONFIRMED: `:13-44` signature + grep-level absence of import in convergence.cjs.]

### F3 — The flood-resistance ceiling is a hard asymptotic bound, not a tuning knob [CONFIRMED]
`attestation-and-promotion.md:34-40, 50-51`: "every attester adds exactly one to the
denominator, [so] the confidence settles toward the average quality of the attesters and can
never be pushed to certainty by sheer numbers." The explicit ceiling: `k` sources, however many,
"can't push the posterior past `(α + k) / (α + β + k)`." This is the property the design must
import: STOP is gated on a Beta posterior whose numerator carries `Σ r_i` (reliability mass), so
adding low-`r` findings moves the posterior toward the *average* `r` (~0.5 for uninformative
sources) rather than toward 1.0. With prior `(1,1)`, a flood of 0.5-reliability findings asymptotes
to 0.5 — well below any sane STOP threshold. [CONFIRMED from doc; maps cleanly onto F1's gap.]

### F4 — `upsert.cjs` metadata/weight slot is a no-migration reliability carrier [CONFIRMED iter-2 + reconfirmed]
Per iter-2 (`f-upsert-metadata-slot`): `upsert.cjs:179` threads `metadata` and `:224` threads
`weight` onto nodes/edges. This is the storage slot for a per-finding/per-source `reliability`
field with zero schema migration — reliability rides in `metadata.reliability` (or reuses the
existing numeric `weight` as the `r` carrier). `attestation-and-promotion.md:60-67` confirms the
correct ownership boundary: the scoring layer **reads** reliability and never writes it; an
unscored source contributes the uninformative `0.5`. So the convergence change is read-only
against this slot. [CONFIRMED slot exists; reliability semantics INFERRED-then-validated against doc.]

### F5 — Two-gate STOP (count AND posterior) prevents single-strong-source false STOP [CONFIRMED design import]
`attestation-and-promotion.md:42-58`: promotion needs BOTH `k ≥ 2` distinct attesters AND
posterior ≥ threshold, and "neither trades off against the other." Imported to convergence: STOP
should require BOTH a minimum distinct-source count AND the reliability-weighted posterior ≥
threshold — so one hyper-reliable source can't alone trip STOP (count gate), and a flood of weak
ones can't (posterior ceiling gate). The doc's caveat (`:48-54`) — refuse a policy whose `k`
can't reach its threshold — is a config-validation rule to import alongside.

## Convergence design (candidate proposals, no implementation)

**Proposal D1 — add `computeWeightedScore` to `bayesian-scorer.ts`** [S, conflict-risk LOW]
New exported fn `computeWeightedScore(evidenceFor: number, evidenceAgainst: number, alpha=1,
beta=1): number = (alpha + evidenceFor) / (alpha + beta + evidenceFor + evidenceAgainst)`, where
`evidenceFor = Σ r_i` and `evidenceAgainst = Σ (1 - r_i)` over contributing sources. Additive —
existing integer `computeScore` untouched, so the model-demotion caller (`shouldDemote`) is
unaffected. Conflict-risk LOW (new export only).

**Proposal D2 — derive a `reliabilityPosterior` signal in `coverage-graph-signals.ts`** [M, conflict-risk MED]
Where the research signals are emitted (`coverage-graph-signals.ts:295-450`), add a derived
signal: walk finding/source nodes, read `metadata.reliability` (default `0.5` per F4/doc:60-67),
accumulate `Σ r` and `Σ(1-r)`, call `computeWeightedScore`. Emit `signals.reliabilityPosterior ∈
[0,1]` AND `signals.distinctReliableSourceCount` (sources with `r` above a floor, for the count
gate). Conflict-risk MED: touches the signals emitter contract; must not break the existing
`sourceDiversity`/`evidenceDepth` consumers.

**Proposal D3 — gate + cap inside `computeCompositeScore` research branch** [M, conflict-risk MED]
At `convergence.cjs:115-121`, replace the two raw-count terms' unbounded influence with a
reliability-capped contribution. Candidate blend:
`score = questionCoverage*0.30 + claimVerificationRate*0.25 + invertedContradictions*0.15 +
min(reliabilityPosterior, normalizedDiversity)*0.15 + min(reliabilityPosterior,
normalizedDepth)*0.15`. The `min(reliabilityPosterior, …)` clamps each volume term so it can
never exceed what source quality justifies — a flood of weak findings caps the diversity/depth
contribution at the (low) average-`r` posterior. THEN apply the two-gate STOP (F5): the loop only
emits STOP if `reliabilityPosterior ≥ stopThreshold` AND `distinctReliableSourceCount ≥ kMin`,
regardless of composite score. Conflict-risk MED: changes the composite formula → recalibrates
thresholds; the `convergenceThreshold:0.03` in config may need re-tuning. Backward-compat path:
when no reliability metadata exists anywhere, all `r=0.5`, `reliabilityPosterior` ≈ prior mean,
and `min(...)` reduces to today's `normalizedDiversity`/`normalizedDepth` only if those are ≤ 0.5
— so this is NOT a pure no-op; thresholds must be re-baselined (flagged risk).

**Proposal D4 — config surface mirroring aionforge policy** [S, conflict-risk LOW]
Add `convergence.reliability` policy: `priorAlpha=1, priorBeta=1, stopThreshold` (in (0.5,1.0]),
`kMin≥2`, plus the doc's validation rule (`:50-54`): refuse a config whose `kMin` can't reach
`stopThreshold` under `(α+kMin)/(α+β+kMin)`. Off-by-default flag mirrors
`promotion.enabled` (`:109`) so existing loops are unchanged until opted in. Conflict-risk LOW.

## Questions Answered

- **Q1 (CONFIRMED + designed):** Yes — the current research blend (`convergence.cjs:115-121`) is
  vote-count-floodable via `normalizedDiversity`/`normalizedDepth` (count-normalized, quality-blind)
  and `claimVerificationRate`. Design: D1 weighted Beta helper → D2 reliability signal from the
  `upsert.cjs` metadata slot → D3 `min(posterior, volumeTerm)` cap + two-gate STOP at the
  `(α+k)/(α+β+k)` ceiling → D4 off-by-default policy with the aionforge config-validation rule.

## Questions Remaining

- **Q2:** CONTRADICTS-edge quarantine of the lower-trust side — needs the same per-source
  reliability (D2) to decide which side is "lower-trust"; design the quarantine + how a quarantined
  finding stops feeding `invertedContradictions`/`evidenceDepth`.
- **Q7:** Reliability-aware ranking/promotion of findings into the registry (does
  `findings-registry.json` need a reliability field?).
- Threshold re-baselining: D3 changes composite scale → `convergenceThreshold:0.03` recalibration
  is unvalidated (INFERRED risk, not measured).

## Next Focus

Iter 4 → Q2 (trust-keyed CONTRADICTS-edge quarantine: read aionforge consolidation/contradiction
doc, design lower-trust-side quarantine reusing the D2 reliability signal) + Q7 (reliability-aware
finding ranking into the registry). The D2 reliability signal is the shared dependency — design it
once, consume it in convergence (done here), quarantine (Q2), and ranking (Q7).
