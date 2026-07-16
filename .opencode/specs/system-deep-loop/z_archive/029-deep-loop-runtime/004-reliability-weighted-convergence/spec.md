---
title: "Feature Specification: Reliability-Weighted Convergence (028/004 keystone cluster)"
description: "Build the deep-loop reliability-weighted-learning cluster: a D2 reliability signal derived off the upsert metadata slot, an f64 Beta primitive (D1), a reliability-weighted convergence cap+gate (D3), an off-by-default policy (D4), trust-keyed CONTRADICTS quarantine (Q2), an extracted content-derived order helper (D-orderhelper), a council-side seat-reliability multiplier (Q2-adjudicator-seat) and a reliability rank field (Q7). The whole cluster is NO-GO until built AND benchmarked because no metadata.reliability is written anywhere today (every input r=0.5)."
trigger_phrases:
  - "reliability weighted convergence"
  - "deep loop reliability signal"
  - "contradiction quarantine"
  - "beta posterior convergence"
  - "vote count flood"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/029-deep-loop-runtime/004-reliability-weighted-convergence"
    last_updated_at: "2026-06-19T10:00:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Marked reliability cluster NO-GO. Deferred to benchmark tier"
    next_safe_action: "Held NO-GO. Revisit after benchmark tier supplies a success signal"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "../research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-004-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Reliability-Weighted Convergence (028/004 keystone cluster)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

## EXECUTIVE SUMMARY

> **DETERMINATION: NO-GO, WILL NOT BUILD this cycle (deferred to the benchmark tier).** Reliability-weighted convergence needs real per-execution success data plus a benefit benchmark that does not exist yet, so weighting is premature. Today no writer populates `metadata.reliability`, so every input collapses to the prior mean (`r=0.5`): the weighting layer would have nothing to weight, there is no measurable signal to out-earn the existing confirmation/relevance terms and no benchmark to prove it would. Building D1–D4 / Q2 / Q7 now would ship a default-off feature whose benefit is unmeasurable and whose D3 `convergenceThreshold:0.03` recalibration would be meaningless under the all-0.5 regime. The whole cluster (C1–C8) is therefore marked NO-GO and held intact as a preserved plan. Revisit after the benchmark tier lands a per-execution success signal and the REQ-BENCH benefit micro-benchmark. The problem analysis and dependency graph below are retained as the design of record for that revisit, they are not an active build.

The deep-loop research convergence verdict is a fixed-weight linear blend (`convergence.cjs:115-121`) whose two volume terms saturate on raw COUNT with no reference to source quality, making STOP vote-count-floodable. This sub-phase lands the reliability-weighted-learning cluster that closes the flood: a derived D2 reliability signal, the f64 Beta primitive (D1) it calls, a reliability-weighted convergence cap+gate (D3), an off-by-default policy (D4), trust-keyed contradiction quarantine (Q2), the content-derived order helper the quarantine tie-break needs (D-orderhelper), a council-side seat-reliability multiplier (Q2-adjudicator-seat) and a reliability rank field (Q7).

**Key Decisions**: (1) D2 is a wholly-absent net-new build, every input is `r=0.5` today, so the cluster is NO-GO until built AND benchmarked. (2) The f64 Beta primitive is a NEW export, not the live integer scorer (which throws on fractional inputs). (3) D3 reliability-weights the EXISTING non-trading STOP conjunction (it is NOT a no-op under all-0.5 and forces a measured recalibration of `convergenceThreshold:0.03`).

**Critical Dependencies**: D2 (the keystone) gates D3/Q2/Q7/Q2-adjudicator-seat. D-orderhelper (extracted-first, the 001-reuse claim was REFUTED) gates Q2's deterministic victim tie-break. One benefit micro-benchmark gates the whole cluster's GO.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | NO-GO (deferred to benchmark tier) |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent research phase** | `system-deep-loop/029-deep-loop-runtime` (Deep Loop, convergence/fan-out/council intelligence) |
| **Source research** | `../research/research.md`, `../../research/roadmap.md` (BROADENING + MEMORY-SYSTEMS addenda authoritative), `../../research/synthesis/01-go-candidates.md` + `03` + `04` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The deep-loop research convergence verdict (`computeCompositeScore`, `convergence.cjs:107-141`) is a fixed-weight linear blend whose two volume terms (`normalizedDiversity = min(sourceDiversity/3.0, 1.0)` at `:112`, `normalizedDepth = min(evidenceDepth/5.0, 1.0)` at `:113`) saturate to their 0.15 ceiling on raw COUNT with no source-quality reference, and `claimVerificationRate` (`:117`) is a ratio any self-citing finding satisfies, so STOP is **vote-count-floodable** with no asymptotic reliability bound [CONFIRMED iter-1 F1-2, iter-3 F1]. The underlying signals are pure structural counts, never trust-weighted [CONFIRMED iter-1 F2]. Contradictions are listed but never quarantined: both contradicting findings stay live and penalize each other symmetrically, so a weak finding drags a strong one's stability down via an `OR` over endpoints (`coverage-graph-signals.ts:511-522`) [CONFIRMED iter-1 F7-8, iter-4 F-Q2a-b]. The fix substrate, a per-source `reliability` field on the existing `upsert.cjs` `metadata`/`weight` slot (`:179`,`:224`), exists structurally but **no writer populates it: every input is `r=0.5` today** [CONFIRMED iter-13 F13-01, roadmap BROADENING §1].

### Purpose

Land the reliability-weighted-learning cluster as a sequenced, off-by-default, benchmark-gated build: derive a D2 reliability posterior, weight the existing convergence conjunction by it (D3), quarantine the lower-trust side of a contradiction (Q2) and surface reliability for ranking (Q7). Design the keystone signal once, consume it everywhere.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### Cluster candidates (9 with the D3 alias, all NO-GO / WILL-NOT-BUILD this cycle)

> All rows below are **NO-GO, held, not built**. They are kept as the design of record so the cluster can be revisited once the benchmark tier supplies a per-execution success signal and the REQ-BENCH micro-benchmark. The "deferred (…)" note in each Status cell preserves the original dependency reason.

| # | Candidate | One-line | Seam (file:line) | Eff | Status |
|---|-----------|----------|------------------|-----|--------|
| C1 | **D-orderhelper** | extract the inline content-derived tie-break (`council-graph-query.ts:280`) into a reusable hand-written total comparator + content-derived id helper. The 001-reuse "PROMOTE" claim was REFUTED, no reusable helper exists, so it is BUILD-new and a prereq for Q2's deterministic victim selection | `council-graph-query.ts:280` (inline tie-break) → new shared helper | S | NO-GO, deferred (shared-infra-dep) |
| C2 | **D1-weighted-Beta** | add `computeWeightedScore(evidenceFor=Σrᵢ, evidenceAgainst=Σ(1−rᵢ), α=1, β=1) = (α+for)/(α+β+for+against)` as an ADDITIVE export, the live integer `computeScore`/`shouldDemote` (`bayesian-scorer.ts:13-44`) THROW on fractional inputs, so this is a NEW f64 export, not a reuse | `bayesian-scorer.ts:13-44` (new export beside the integer scorer) | S | NO-GO, deferred (shared-infra-dep) |
| C3 | **D2-reliability** | derive `reliabilityPosterior` + `distinctReliableSourceCount`: walk finding/source nodes, read `metadata.reliability` (default 0.5, READ-ONLY), accumulate `Σr`/`Σ(1−r)`, call D1's `computeWeightedScore`, THE KEYSTONE shared dependency | `coverage-graph-signals.ts:295-450`, reads `upsert.cjs:179,224` | M | NO-GO, deferred (needs-benchmark + needs D1) |
| C4 | **D3-cap-and-gate** | reliability-weight the EXISTING non-trading STOP conjunction: cap each volume term at `min(reliabilityPosterior, normalizedDiversity/Depth)` and add a two-gate STOP (`reliabilityPosterior ≥ stopThreshold` AND `distinctReliableSourceCount ≥ kMin`), NOT a no-op under all-0.5. Forces a measured `convergenceThreshold:0.03` recalibration | `convergence.cjs:112-121` (+ STOP path) | M | NO-GO, deferred (needs-benchmark + needs D2) |
| C5 | **D4-policy-config** | off-by-default `convergence.reliability` policy (`priorAlpha=1, priorBeta=1, stopThreshold∈(0.5,1.0], kMin≥2`) mirroring `promotion.enabled` (`convergence.cjs:109`), with a config-validation rule that REFUSES a policy whose `kMin` can't reach `stopThreshold` under `(α+kMin)/(α+β+kMin)` | `convergence.cjs` (mirror `promotion.enabled:109`) | S | NO-GO, deferred (shared-infra-dep on D2/D3) |
| C6 | **Q2-quarantine** | trust-keyed CONTRADICTS quarantine of the lower-trust side: deterministic victim `argmin reliability`, tie-break via D-orderhelper's content-derived id, edge-presence read-path exclusion (retain both nodes), victim stops feeding stability/contradiction/depth | `coverage-graph-query.ts:221-252` + `coverage-graph-signals.ts:511-522` + `convergence.cjs:114,216-218` | M | NO-GO, deferred (until D2 exists) |
| C7 | **Q2-adjudicator-seat** | council-side analogue: a seat-reliability multiplier via the existing `options.weights` override (`adjudicator-verdict-scoring.cjs:121`). Shares D2 | `adjudicator-verdict-scoring.cjs:118-146` (`:121`) | S | NO-GO, deferred (needs D2, optional) |
| C8 | **Q7-rank-field** | a reliability field for finding ranking into `findings-registry.json` (consumes the D2 signal) | findings-registry consumer | S | NO-GO, deferred (needs D2) |

> Note: the inbound candidate list named D3 twice (`D3-cap-and-gate`, `D3-cap-gate`), they are ONE candidate (C4). The second slug is an alias.

> Build order (dependency-driven): **D-orderhelper (C1) + D1 (C2)** are the leaf shared-infra deps (extract/export first) → **D2 (C3)** keystone → **D3 (C4)** cap+gate → **D4 (C5)** policy → **Q2 (C6)** quarantine → **Q2-adjudicator-seat (C7) + Q7 (C8)** consumers. The whole cluster sits BEHIND a benefit micro-benchmark gate. See `plan.md`.

### Out of Scope (documented, NOT built this sub-phase)

- **The resilience cluster (failure-class taxonomy, transient/fatal retry, orphan reset, recover-vs-fresh gate)**, lives in the sibling sub-phase `003-fanout-failure-recovery`. That cluster is independent of D2 and is keyed only on exit-code/timeout/ledger state. Not re-implemented here.
- **Q6-anchor FIX**, already SHIPPED in 030 Wave-0 (commit `738e118751`). The reducer-anchor template bug is closed. Not in this cluster.
- **DL-newInfoRatio non-consumption**, a known structured-module residual (`convergence.cjs:285,378-381`): `newInfoRatio` is computed but never ingested into the structured stop/continue decision. Tracked as a residual, NOT part of this cluster (it is not reliability-weighted).
- **A reliability WRITE-PATH (a writer that populates `metadata.reliability` to something other than 0.5)**, out of scope. D2 is read-only by design (the scoring layer reads reliability, never writes it, per aionforge `attestation-and-promotion.md:60-67`). Without a writer, every input stays 0.5 and the benchmark measures the prior-mean regime only. The write-path is a separate follow-on.
- Modifying the external reference systems under `028.../external/`.

### Files to Change

| File Path | Change Type | Candidate(s) |
|-----------|-------------|--------------|
| `.opencode/skills/deep-loop-runtime/scripts/lib/bayesian-scorer.ts` | Modify (additive f64 export) | C2 (D1) |
| `.opencode/skills/deep-loop-runtime/scripts/lib/council-graph-query.ts` | Modify (extract inline tie-break) | C1 (D-orderhelper) |
| `.opencode/skills/deep-loop-runtime/scripts/lib/coverage-graph-signals.ts` | Modify (new reliability emitter, quarantine exclusion) | C3 (D2), C6 (Q2) |
| `.opencode/skills/deep-loop-runtime/scripts/lib/coverage-graph-query.ts` | Modify (victim selection on CONTRADICTS pairs) | C6 (Q2) |
| `.opencode/skills/deep-loop-runtime/scripts/lib/convergence.cjs` | Modify (cap+gate, policy read) | C4 (D3), C5 (D4) |
| `.opencode/skills/deep-loop-runtime/scripts/lib/adjudicator-verdict-scoring.cjs` | Modify (seat-reliability via options.weights) | C7 |
| `findings-registry.json` consumer (reliability field) | Modify | C8 (Q7) |
| Tests alongside each change (deep-loop-runtime test suite) | Create/Modify | all |

> Seam file:line references are [CONFIRMED] from `../research/research.md` unless the candidate row marks otherwise. Exact module paths under `lib/` are [INFERRED] from the research's bare file names and MUST be confirmed at build time via the structural index.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-BENCH | One benefit micro-benchmark before any GO | A captured before/after micro-benchmark (D2 reliability or single-hop precision) shows the reliability signal out-earns the existing confirmation/relevance signals, OR the cluster is held. No candidate ships on structural inference alone. [research: synthesis `01` "Needs validation / benchmark BEFORE go", roadmap §269] |
| REQ-D1 | f64 Beta primitive is a NEW additive export | `computeWeightedScore(Σrᵢ, Σ(1−rᵢ), α=1, β=1) = (α+for)/(α+β+for+against)` is added beside the integer scorer. The integer `computeScore`/`shouldDemote` are byte-unchanged. A parity/throw test proves the integer path still throws on fractional inputs and the new f64 path accepts them. [research: D1 row, synthesis `01` Shared-infra, `bayesian-scorer.ts:182-191` throws] |
| REQ-D2 | D2 is derived READ-ONLY off the metadata slot | `reliabilityPosterior` + `distinctReliableSourceCount` are computed by walking finding/source nodes and reading `metadata.reliability` with a default of 0.5. NO write to `metadata.reliability` is introduced. With all-0.5 inputs the posterior equals the prior mean (test-asserted). [research: D2 row, iter-2 F16, iter-3 F4] |
| REQ-D3 | D3 weights the EXISTING conjunction (not a no-op, not a new gate axis) | Each volume term is capped at `min(reliabilityPosterior, volumeTerm)`. The STOP path gains the two-gate `posterior ≥ stopThreshold AND distinctReliableSourceCount ≥ kMin`. A recalibration run re-baselines `convergenceThreshold:0.03`. A test proves D3 changes the composite under all-0.5 (so it is documented NOT a no-op). [research: D3 row + Open Items, synthesis `04` §41: D3 weights the existing non-trading conjunction] |
| REQ-Q2 | Quarantine is deterministic and non-destructive | The lower-trust side is selected by `argmin reliability`. Ties broken via D-orderhelper's content-derived id (reproducible across runs / id reassignment). The victim is excluded by EDGE PRESENCE on the read path (both nodes retained, nothing deleted) and stops feeding `findingStability`/`invertedContradictions`/evidence-depth. [research: Q2 row, iter-1 F7-8, iter-4 F-Q2a-d] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-D-ORDER | Extract the content-derived order helper first | The inline tie-break at `council-graph-query.ts:280` is extracted into a hand-written TOTAL comparator (`(a,b)=>b-a` is rejected, NaN/−0 poison it) + a content-derived id. Q2's victim tie-break consumes it. The REFUTED 001-reuse claim is recorded. [research: synthesis `03` §27, roadmap §249] |
| REQ-D4 | Off-by-default policy with config-validation | A `convergence.reliability` policy mirrors `promotion.enabled` (default OFF). A config whose `kMin` cannot reach `stopThreshold` under `(α+kMin)/(α+β+kMin)` is REFUSED at load. [research: D4 row, aionforge `attestation-and-promotion.md:48-54`] |
| REQ-Q2-SEAT | Council seat-reliability is additive and optional | A seat-reliability multiplier rides the existing `options.weights` override at `adjudicator-verdict-scoring.cjs:121`. With no reliability data the council scoring is byte-identical to today. [research: Q2-adjudicator-seat row] |
| REQ-Q7 | Reliability rank field is additive | A reliability field is added to `findings-registry.json` ranking output. Absent reliability data, ranking order is unchanged. [research: Q7 row] |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A benefit micro-benchmark is captured and its result gates the cluster GO (REQ-BENCH), no candidate ships on inference alone.
- **SC-002**: D2 is read-only. No writer to `metadata.reliability` is introduced. All-0.5 inputs yield the prior-mean posterior (REQ-D2).
- **SC-003**: D3 is documented and test-proven NOT a no-op under all-0.5. `convergenceThreshold:0.03` is recalibrated with the measured number recorded (REQ-D3).
- **SC-004**: Q2 victim selection is deterministic and reproducible across runs via D-orderhelper. Both contradiction nodes are retained (REQ-Q2 / REQ-D-ORDER).
- **SC-005**: With the policy OFF (default), the whole cluster is byte-identical to today's convergence/adjudicator/ranking behavior (D4 default-off. Q2-seat/Q7 additive).
- **SC-006**: `node --check` / `tsc` on touched modules, the deep-loop-runtime focused tests and `validate.sh --strict` on this sub-phase all pass.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The whole cluster's benefit is unmeasured (all inputs r=0.5) | Ships a feature with no demonstrable delta | REQ-BENCH hard gate: capture a before/after micro-benchmark. Hold the cluster if it does not out-earn existing signals |
| Risk | D3 silently shifts the composite scale and breaks `convergenceThreshold:0.03` | Loops never/always STOP | REQ-D3 recalibration run. Default-off policy (D4) so the change is opt-in until the threshold is re-baselined |
| Risk | Reusing the live integer scorer for fractional inputs | Runtime throw (`bayesian-scorer.ts:182-191`) | D1 is a NEW f64 export. The integer path is byte-unchanged (REQ-D1) |
| Risk | Q2 victim tie-break is non-deterministic | Convergence non-reproducible | D-orderhelper extracts a hand-written total comparator + content-derived id (REQ-D-ORDER). `(a,b)=>b-a` is rejected |
| Risk | Q2 deletes a contradiction node | Data loss / asymmetric recall | Edge-presence read-path exclusion ONLY. Both nodes retained (REQ-Q2, aionforge `bi-temporal-model.md:124-126`) |
| Dependency | **D2 reliability signal** | Q2 / D3 / Q7 / Q2-seat all consume it | Build D2 (the keystone) before its consumers. NO-GO on Q2 until D2 exists |
| Dependency | **D-orderhelper** (extracted, not reused) | Q2 victim tie-break | Extract from `council-graph-query.ts:280` first. The 001-reuse PROMOTE claim was REFUTED |
| Dependency | **D1 f64 primitive** | D2/D3 math | Additive export beside the integer scorer. Build before D2 |
| Dependency | A reliability WRITE-PATH | Without it every input is 0.5 | Out of scope. Benchmark measures the prior-mean regime. Write-path is a follow-on |
| Dependency | Shared Beta with Advisor C4 | One f64 primitive, per-consumer adapters | Build the primitive once. C4 consumes the posterior as a weight-delta (synthesis `04` §40), coordinate, do not fork |

<!-- /ANCHOR:risks -->
---

## 7. NON-FUNCTIONAL REQUIREMENTS

<!-- ANCHOR:nfr -->
### Performance
- **NFR-P01**: D2's node walk is a read-only single pass over finding/source nodes already loaded for the existing signal emitters, no new query round-trips beyond the existing `coverage-graph-signals` read path.

### Security
- **NFR-S01**: No new write path is introduced (D2 is read-only). The cluster cannot corrupt the reliability slot.

### Reliability
- **NFR-R01**: Flood-resistance, the Beta posterior bounds certainty: "every attester adds exactly one to the denominator … can never be pushed to certainty by sheer numbers" (aionforge `attestation-and-promotion.md:30-52`). The two-gate STOP (`k≥2` AND posterior, neither trades off) is the structural property D3 buys.
- **NFR-R02**: Cold-start neutrality, an unknown source contributes an uninformative 0.5 (aionforge `:60-67`), so the default-off + all-0.5 regime is behaviorally inert.
- **NFR-R03**: Determinism, Q2 victim selection is reproducible run-to-run via a hand-written total comparator + content-derived id (no insertion order, no timestamp).

<!-- /ANCHOR:nfr -->
---

## 8. EDGE CASES

<!-- ANCHOR:edge-cases -->
### Data Boundaries
- **All inputs r=0.5 (today's reality)**: D2 posterior = prior mean. D3 caps the volume terms at 0.5 ONLY where they exceed it (so D3 is NOT a pure no-op). Q2 finds equal-trust contradictions → falls to the D-orderhelper tie-break. Every test runs in this regime until a writer exists.
- **Single source / zero distinct reliable sources**: `distinctReliableSourceCount < kMin` → the two-gate STOP is held regardless of posterior (the `k≥2` gate, aionforge `:42-58`).
- **Missing `metadata.reliability`**: defaults to 0.5 (uninformative), never null/NaN into the Beta math.

### Error Scenarios
- **Fractional input into the integer scorer**: must THROW (preserved). Only the new f64 export accepts fractional `Σr`.
- **Config `kMin` can't reach `stopThreshold`**: REFUSED at load (D4 config-validation), never a silently-unreachable STOP.
- **Equal-reliability contradiction (tie)**: victim chosen by content-derived id (deterministic), never by insertion order or timestamp.

### State Transitions
- **Policy OFF → ON**: the convergence/adjudicator/ranking surface must be byte-identical with the policy OFF (default). Turning it ON requires the recalibrated threshold to be in place first.

<!-- /ANCHOR:edge-cases -->
---

## 9. COMPLEXITY ASSESSMENT

<!-- ANCHOR:complexity -->
| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: ~7 lib modules + tests. Multi-candidate cluster touching convergence, signals, query, adjudicator, registry |
| Risk | 22/25 | Breaking: convergence threshold recalibration. Algorithmic: Beta posterior + deterministic comparator. No auth/API |
| Research | 18/20 | Heavy external mining (aionforge attestation/consolidation/bi-temporal/trust) + 001 reuse refutation already done in research |
| Multi-Agent | 8/15 | Sequenced single-stream build with an adversarial benchmark gate |
| Coordination | 12/15 | Shared Beta primitive with Advisor C4. D2 keystone fans out to 5 consumers |
| **Total** | **80/100** | **Level 3** |

<!-- /ANCHOR:complexity -->
---

## 10. RISK MATRIX

<!-- ANCHOR:risk-matrix -->
| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Cluster ships with no measured benefit (all r=0.5) | H | H | REQ-BENCH hard gate. Hold if no out-earn |
| R-002 | D3 breaks `convergenceThreshold:0.03` calibration | H | M | Recalibration run + default-off policy |
| R-003 | Fractional input crashes the integer scorer | M | M | New f64 export. Integer path byte-unchanged |
| R-004 | Q2 non-deterministic victim selection | M | M | D-orderhelper total comparator + content-derived id |
| R-005 | Q2 destroys a contradiction node | H | L | Edge-presence read exclusion only. Retain both nodes |
| R-006 | D2 accidentally writes `metadata.reliability` | M | L | Read-only assertion in D2. No writer in scope |

<!-- /ANCHOR:risk-matrix -->
---

## 11. USER STORIES

<!-- ANCHOR:user-stories -->
### US-001: Flood-resistant convergence (Priority: P0)

**As a** deep-research loop, **I want** the STOP verdict to be bounded by source reliability, **so that** a flood of weak, mutually-citing findings cannot drive the score to STOP.

**Acceptance Criteria**:
1. Given a batch of low-reliability self-citing findings, When convergence is scored with the policy ON, Then the two-gate STOP is held until `distinctReliableSourceCount ≥ kMin` AND `posterior ≥ stopThreshold`.

---

### US-002: Trust-keyed contradiction quarantine (Priority: P1)

**As a** deep-research loop, **I want** the lower-trust side of a contradiction quarantined (not deleted), **so that** a weak finding stops dragging a strong one's stability down.

**Acceptance Criteria**:
1. Given two CONTRADICTS-linked findings of unequal reliability, When quarantine runs, Then the `argmin reliability` side is excluded by edge presence from stability/contradiction/depth while both nodes remain stored.

<!-- /ANCHOR:user-stories -->
---

## 12. OPEN QUESTIONS

<!-- ANCHOR:questions -->
> All questions below are **deferred under the NO-GO**, none is resolved this cycle. They are the open items to settle if and when the cluster is revisited after the benchmark tier.

- Does a measured `convergenceThreshold` recalibration confirm D3 is safe to enable, or does the all-0.5 regime make the recalibration meaningless until a reliability writer exists? **PENDING, decide at D3 benchmark time** (iter-3 D3, iter-4 remaining).
- Is the exact 001 content-derived ordering call site truly absent (research [INFERRED] it was unread)? The synthesis `03` REFUTED reuse and named D-orderhelper as the extract-first prereq, confirm at C1 build time by reading `council-graph-query.ts:280` and grepping for any sibling helper. **PENDING, confirm at D-orderhelper build time.**
- Does any non-prompt-pack continuity path consume reliability that the read-only D2 walk would miss? **PENDING, trace before wiring Q7's registry field** (iter-2 F12-15 remaining).
- Is `kMin≥2` / `stopThreshold` from aionforge right for the deep-loop fixture profile, or does the recalibration suggest different defaults? **PENDING, confirm at D4 config time.**

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent research**: `../research/research.md` (Deep Loop external-mining synthesis, D1/D2/D3/D4/Q2/Q7 candidate catalog + Q1-Q7 answers + references). Broadening corrections in `../research/research.md` "Broadening Addendum".
- **Cross-cutting roadmap**: `../../research/roadmap.md` (reliability-weighted-learning spine. BROADENING §1-2. MEMORY-SYSTEMS addendum. §249-250 shared total-comparator + Beta posterior).
- **Synthesis**: `../../research/synthesis/01-go-candidates.md` ("Needs validation / benchmark BEFORE go" + Shared-infra), `03-corrections-caveats-and-residuals.md` (§11 D2 absent. §27 D-reproducible-fold REFUTED → D-orderhelper), `04-sibling-and-cross-cutting.md` (§40 shared Beta primitive. §41 D3 weights the existing conjunction).
- **Shipped record (Wave-0)**: Wave-0 record, NONE of this cluster shipped (Q6-anchor, Deep-Loop trio, Q4-C1 are the only Deep-Loop/adjacent entries marked Done).

<!-- /ANCHOR:questions -->
