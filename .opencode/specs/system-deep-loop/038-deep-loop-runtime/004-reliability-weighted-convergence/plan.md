---
title: "Implementation Plan: Reliability-Weighted Convergence (028/004 keystone cluster)"
description: "Approach and sequencing for the deep-loop reliability cluster: extract the content-derived order helper and add the f64 Beta primitive first, derive the keystone D2 reliability signal, reliability-weight the existing convergence conjunction (D3), gate it behind an off-by-default policy (D4), quarantine the lower-trust contradiction side (Q2) and surface reliability council-side (Q2-adjudicator-seat) and in ranking (Q7). The whole cluster sits behind a benefit micro-benchmark gate."
trigger_phrases:
  - "reliability weighted convergence plan"
  - "beta posterior sequencing"
  - "contradiction quarantine plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-deep-loop-runtime/004-reliability-weighted-convergence"
    last_updated_at: "2026-06-19T10:00:00+02:00"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level 3 plan for the reliability cluster sequencing"
    next_safe_action: "Run benchmark gate then build D-orderhelper + D1 f64 primitive"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-004-004-replan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Reliability-Weighted Convergence (028/004 keystone cluster)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`.ts` lib modules) + Node.js CommonJS (`.cjs`), deep-loop-runtime |
| **Framework** | None, pure scorer/signal/query helpers + a convergence policy |
| **Storage** | Coverage-graph nodes/edges (read-only for D2). `metadata`/`weight` slot on `upsert.cjs`. `findings-registry.json` (Q7). No schema migration |
| **Testing** | deep-loop-runtime vitest/contract tests. `node --check` / `tsc` on touched modules. A benefit micro-benchmark fixture |

### Overview

This sub-phase builds the reliability-weighted-learning cluster behind a benchmark gate: extract the content-derived order helper (D-orderhelper) and add the f64 Beta primitive (D1) as leaf shared-infra, derive the keystone D2 reliability posterior read-only off the metadata slot, reliability-weight the EXISTING non-trading convergence conjunction (D3), gate it off-by-default (D4), quarantine the lower-trust contradiction side (Q2) and surface reliability council-side (Q2-adjudicator-seat) and in ranking (Q7). D2 is designed once and consumed five times.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and each candidate's seam cited to research file:line
- [x] Scope frozen: the 9-candidate reliability cluster. Resilience cluster + Q6-anchor explicitly out
- [x] Dependencies identified (D-orderhelper + D1 leaf → D2 keystone → D3/D4/Q2/Q7/seat)
- [x] Per-candidate PENDING status confirmed against 030 §14 (NONE of the cluster shipped)

### Definition of Done
- [ ] REQ-BENCH satisfied: a captured benefit micro-benchmark gates the cluster GO
- [ ] All P0 acceptance criteria met (REQ-D1/D2/D3/Q2) + the P1 set (D-orderhelper/D4/seat/Q7)
- [ ] Each candidate has its own unit test and its own scoped commit
- [ ] `node --check`/`tsc` + deep-loop-runtime focused tests green. Policy-OFF byte-identical to baseline
- [ ] `validate.sh --strict` on this sub-phase passes. Checklist.md items verified with evidence

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive, surgical edits to existing scorer/signal/query/convergence modules, fronted by an off-by-default policy. Two NEW small primitives (a content-derived order helper and an f64 Beta export) are extracted/added first. The keystone D2 signal is the single shared dependency every consumer reads.

### Key Components

- **`bayesian-scorer.ts`**, the live integer scorer (`computeScore` `:13-25`, `shouldDemote` `:35-44`) that THROWS on fractional inputs (`:182-191`). D1 adds a NEW f64 `computeWeightedScore` export beside it (the integer path is untouched).
- **`council-graph-query.ts:280`**, the inline content-derived tie-break. D-orderhelper extracts it into a reusable hand-written total comparator + content-derived id (the 001-reuse PROMOTE claim was REFUTED, no reusable helper exists).
- **`coverage-graph-signals.ts:295-450`**, the research signal emitters (question coverage, contradiction density, source diversity, evidence depth) + the symmetric `findingStability` penalty (`:511-522`). D2 adds the reliability posterior emitter here. Q2 excludes the quarantined victim here.
- **`coverage-graph-query.ts:221-252`**, `findContradictions` lists CONTRADICTS pairs with no victim. Q2 adds deterministic victim selection (`argmin reliability`, D-orderhelper tie-break).
- **`convergence.cjs:107-141`**, `computeCompositeScore` (research blend `:115-121`, volume terms `:112-113`). D3 caps the volume terms and adds the two-gate STOP. D4 reads the off-by-default policy mirroring `promotion.enabled` (`:109`).
- **`adjudicator-verdict-scoring.cjs:118-146`**, `scoreVerdictDelta`. Q2-adjudicator-seat rides the existing `options.weights` override (`:121`).
- **`findings-registry.json` consumer**, Q7 adds a reliability rank field.

### Data Flow (target, policy ON)

1. **D-orderhelper + D1** (leaf): a content-derived total comparator and an f64 Beta primitive exist as reusable helpers.
2. **D2** (keystone): walk finding/source nodes, read `metadata.reliability` (default 0.5, read-only), accumulate `Σr`/`Σ(1−r)`, call D1 → `reliabilityPosterior` + `distinctReliableSourceCount`.
3. **D3**: cap each volume term at `min(posterior, volumeTerm)`. STOP requires `posterior ≥ stopThreshold AND distinctReliableSourceCount ≥ kMin`.
4. **D4**: a config load refuses a `kMin` that can't reach `stopThreshold`. Default OFF.
5. **Q2**: on a CONTRADICTS pair, the `argmin reliability` side (D-orderhelper tie-break) is excluded by edge presence from stability/contradiction/depth. Both nodes retained.
6. **Q2-adjudicator-seat / Q7**: reliability rides the council `options.weights` and the findings-registry rank field.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This cluster touches shared scoring policy and a public convergence verdict, so the inventory is required.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `bayesian-scorer.ts` integer `computeScore`/`shouldDemote` | model-demotion helper. Throws on fractional inputs | unchanged (D1 is a NEW export) | parity/throw test. `rg -n 'computeScore|shouldDemote' lib/` consumer scan |
| `convergence.cjs` `computeCompositeScore`/STOP | the floodable blend + STOP conjunction | update (D3 cap+gate, default-off) | recalibration run + policy-OFF byte-identical test |
| `coverage-graph-signals.ts` emitters + `findingStability` | structural-count signals | update (D2 emitter, Q2 victim exclusion) | unit test each emitter. `rg -n 'findingStability|sourceDiversity|evidenceDepth'` consumer scan |
| `coverage-graph-query.ts` `findContradictions` | lists CONTRADICTS pairs symmetrically | update (Q2 victim selection) | determinism test (same victim across runs) |
| `adjudicator-verdict-scoring.cjs` `options.weights` | per-axis verdict-delta weights | update (Q2-seat multiplier, additive) | policy-OFF byte-identical council scoring |
| `findings-registry.json` ranking | finding rank output | update (Q7 reliability field, additive) | absent-data order-unchanged test |
| `metadata.reliability` writers | none populate it (every input 0.5) | NOT a consumer / not added | `rg -n 'metadata.reliability'` proves no writer (D2 read-only) |

Required inventories:
- Same-class producers: `rg -n 'metadata.reliability|reliabilityPosterior|computeWeightedScore' <deep-loop-runtime/scripts/lib>`.
- Consumers of changed symbols: `rg -n 'computeCompositeScore|findContradictions|findingStability|options.weights' . --glob '*.ts' --glob '*.cjs' --glob '*.md'`.
- Matrix axes: reliability regime (all-0.5 / mixed), policy state (OFF/ON), source count (`<kMin`/`≥kMin`), contradiction trust (equal/unequal).
- Algorithm invariant: the Beta posterior is monotone and bounded. The Q2 victim comparator is a TOTAL order (NaN/−0 rejected).

<!-- /ANCHOR:affected-surfaces -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Benchmark gate (REQ-BENCH), blocks all GO
- [ ] Build a benefit micro-benchmark fixture (reliability vs existing confirmation/relevance signals, or single-hop precision)
- [ ] Capture the before number. Decide GO/HOLD on the measured delta (no candidate ships on inference alone)

### Phase 1: Leaf shared-infra, D-orderhelper (C1), D1 (C2)
- [ ] C1: read `council-graph-query.ts:280`. Extract the inline tie-break into a hand-written TOTAL comparator + content-derived id helper. Record the REFUTED 001-reuse claim. Unit test (NaN/−0/equal-id cases)
- [ ] C2: add the f64 `computeWeightedScore(Σr, Σ(1−r), α=1, β=1)` export to `bayesian-scorer.ts` beside the integer scorer. Parity test proves the integer path is byte-unchanged and still throws on fractional inputs

### Phase 2: Keystone, D2 (C3)
- [ ] C3: add the read-only reliability emitter to `coverage-graph-signals.ts` (`reliabilityPosterior` + `distinctReliableSourceCount`, default 0.5, no writer). Test the all-0.5 prior-mean equality and the absent-field default

### Phase 3: Convergence weighting + policy, D3 (C4), D4 (C5)
- [ ] C4: cap the volume terms at `min(posterior, volumeTerm)` and add the two-gate STOP in `convergence.cjs`. Run the `convergenceThreshold:0.03` recalibration. Prove NOT-a-no-op under all-0.5
- [ ] C5: add the off-by-default `convergence.reliability` policy (mirror `promotion.enabled:109`) with config-validation refusing an unreachable `kMin`/`stopThreshold`

### Phase 4: Consumers, Q2 (C6), Q2-adjudicator-seat (C7), Q7 (C8)
- [ ] C6: deterministic victim selection in `coverage-graph-query.ts` (`argmin reliability`, D-orderhelper tie-break) + edge-presence exclusion in `coverage-graph-signals.ts` (retain both nodes)
- [ ] C7: seat-reliability multiplier via `options.weights` in `adjudicator-verdict-scoring.cjs` (policy-OFF byte-identical)
- [ ] C8: reliability rank field in the `findings-registry.json` consumer (absent-data order-unchanged)

### Phase 5: Verification
- [ ] `node --check`/`tsc` on every touched module
- [ ] deep-loop-runtime focused tests green vs a captured baseline. Policy-OFF byte-identical to today
- [ ] adversarial review of D3 count/threshold correctness and the Q2 determinism invariant
- [ ] `validate.sh --strict` on this sub-phase

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Benchmark | reliability-vs-existing-signals benefit delta (the GO gate) | micro-benchmark fixture |
| Unit | f64 Beta primitive (parity + throw). D2 prior-mean. D3 not-a-no-op + recalibration. Q2 determinism. Total comparator (NaN/−0) | deep-loop-runtime vitest |
| Property | Q2 victim selection is reproducible across runs and id reassignment | property test |
| Syntax | every touched `.ts`/`.cjs` parses/type-checks | `node --check` / `tsc` |
| Regression | policy-OFF convergence/adjudicator/ranking byte-identical to captured baseline | existing suite |
| Adversarial | independent seat tries to refute D3 threshold safety + the unknown→0.5 cold-start | cli-codex/opus review seat |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| **D2 reliability signal** | Internal (this cluster) | Build first | Q2/D3/Q7/seat all blocked, keystone |
| **D-orderhelper** | Internal (this cluster) | Extract first | Q2 victim tie-break non-deterministic |
| **D1 f64 primitive** | Internal (this cluster) | Build first | D2/D3 math unavailable |
| Benefit micro-benchmark | Process gate | Required | Whole cluster HOLDS without it (REQ-BENCH) |
| Reliability WRITE-PATH | External (follow-on) | Absent | Every input stays 0.5. Benchmark measures prior-mean regime only |
| `convergence.cjs` `promotion.enabled:109` pattern | Internal | Green | D4 mirrors it for the off-by-default policy |
| Shared Beta with Advisor C4 | Cross-packet | Coordinate | One f64 primitive + per-consumer adapters (do not fork) |

### Shared-infra note
The Beta posterior is shared with Skill Advisor **C4** (synthesis `04` §40): build ONE f64 primitive `(α₀+s)/(α₀+β₀+s+f)` + thin per-consumer adapters, the live integer scorer throws on the fractional inputs D2 needs. C4 consumes the posterior as a weight-delta, not a multiplier. The total-comparator + content-derived id (D-orderhelper) is the same determinism keystone every 028 determinism candidate needs (roadmap §249): `(a,b)=>b-a` is not a total order. Build both once, wire across consumers.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the benchmark shows no benefit. D3 breaks the convergence threshold. Q2 is non-deterministic or destroys a node. Or the integer scorer regresses.
- **Procedure**: the default-off policy (D4) is the master switch, the cluster ships dormant. Each candidate is a separate scoped commit. `git revert` the offending candidate. D-orderhelper/D1 are additive leaves (safe). D3/Q2 are the higher-blast hunks and revert independently of the leaves.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Benchmark gate) ──► GO/HOLD
        │ (GO)
        ▼
Phase 1 (D-orderhelper, D1 — leaf shared-infra)
        │
        ▼
Phase 2 (D2 — keystone signal)
        │
        ▼
Phase 3 (D3 cap+gate ──► D4 policy)
        │
        ▼
Phase 4 (Q2 quarantine, Q2-seat, Q7 — consumers) ──► Phase 5 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 0 (Benchmark) | None | 1 (gates all GO) |
| 1 (D-orderhelper, D1) | 0 | 2, 4 |
| 2 (D2) | 1 | 3, 4 |
| 3 (D3, D4) | 2 | 4, 5 |
| 4 (Q2, Q2-seat, Q7) | 1, 2 | 5 |
| 5 (Verify) | 3, 4 | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Candidate | Research effort tag | Note |
|-----------|---------------------|------|
| C1 D-orderhelper | S | extract inline tie-break → reusable total comparator + content id |
| C2 D1-weighted-Beta | S | additive f64 export. Integer path untouched |
| C3 D2-reliability | M | keystone read-only emitter. Node walk + Beta accumulation |
| C4 D3-cap-and-gate | M | cap+gate. Recalibration run (the unmeasured risk) |
| C5 D4-policy-config | S | off-by-default policy + config-validation |
| C6 Q2-quarantine | M | deterministic victim + edge-presence exclusion |
| C7 Q2-adjudicator-seat | S | options.weights multiplier (council-side, optional) |
| C8 Q7-rank-field | S | additive reliability field |

> Effort tags are structural inference, NEVER benchmarked. The cluster is Level 3 by risk/coordination (Beta math, threshold recalibration, 5-consumer keystone fan-out), not raw LOC. The recalibration risk on D3 and the determinism invariant on Q2 are why Phase 5 has an adversarial gate.

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Benchmark captured and GO recorded (REQ-BENCH)
- [ ] Baseline captured: deep-loop-runtime test counts + policy-OFF convergence/adjudicator/ranking output
- [ ] Policy defaults OFF. Nothing enabled until the recalibrated threshold is in place
- [ ] Each candidate in its own scoped commit. Branch-only

### Rollback Procedure
1. Flip the `convergence.reliability` policy OFF (master switch, instant inert)
2. Identify the offending candidate's commit (one candidate per commit)
3. `git revert <commit>`, D-orderhelper/D1 are additive and revert cleanly. D3/Q2 revert independently
4. Re-run `node --check`/`tsc` + the deep-loop-runtime suite to confirm the policy-OFF baseline restored

### Data Reversal
- **Has data migrations?** No, D2 is read-only. No `metadata.reliability` writer. `findings-registry.json` field is additive.
- **Reversal procedure**: N/A (no schema change. The Q7 field is ignored when absent).

<!-- /ANCHOR:enhanced-rollback -->
---

<!-- ANCHOR:dependency-graph -->
## L3: Dependency Graph

| Node | Depends On | Blocks |
|------|------------|--------|
| Benchmark gate | None | All reliability implementation |
| D-orderhelper | Benchmark GO | Q2 deterministic victim choice |
| D1 f64 Beta | Benchmark GO | D2, D3 and shared advisor adapter |
| D2 reliability | D1 | D3, D4, Q2, Q2-seat and Q7 |
| D3 cap and gate | D2 | D4 policy validation and verification |
| Q2 quarantine | D2 and D-orderhelper | Q2-seat review and ranking consistency |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: Critical Path

Benchmark GO comes first. The shortest safe path is D-orderhelper plus D1, then D2, then D3 and D4, then Q2, Q2-seat and Q7. No consumer starts before D2 exists.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: Milestones

| Milestone | Exit Criteria |
|-----------|---------------|
| M1 Benchmark gate | GO or HOLD recorded with fixture output |
| M2 Leaf primitives | D-orderhelper and D1 tests pass |
| M3 D2 keystone | Read-only reliability posterior emitted with all-0.5 tests |
| M4 Consumer policy | D3/D4/Q2/Q7 tests pass with policy OFF parity |
| M5 Packet closeout | Strict validation passes and evidence is pinned |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION

- **Build-order discipline**: the benchmark gate (Phase 0) is a HARD precondition. No implementer dispatch begins until GO is recorded. The leaf shared-infra (D-orderhelper, D1) is extracted/added before the keystone D2, and D2 before any of its five consumers.
- **Gate-3 / executor discipline**: any model dispatched via `opencode run` to EDIT these modules will be intercepted by the Gate-3 write block, dispatch read-only confirm/analysis seats. The orchestrating agent implements (per the operator memory `gpt55-opencode-dispatch-hits-gate3`).
- **Shared-primitive coordination**: the f64 Beta primitive is co-owned with Advisor C4, surface the shared module location before building so the two consumers do not fork it.

<!-- /ANCHOR:ai-execution -->
---

<!-- ANCHOR:architecture-overview -->
## L3: ARCHITECTURE OVERVIEW

```
                    metadata.reliability (read-only, default 0.5; NO writer in scope)
                                  │
                                  ▼
        ┌──────────────┐    ┌───────────────┐
        │ D1 f64 Beta  │◄───┤ D2 reliability │  (keystone signal)
        │ primitive    │    │ posterior + k  │
        └──────────────┘    └──────┬────────┘
                                   │ consumed by
        ┌────────────┬─────────────┼──────────────┬──────────────┐
        ▼            ▼             ▼              ▼              ▼
   D3 cap+gate   Q2 quarantine  Q7 rank     Q2-adj-seat   (D4 policy gates D3)
   (convergence) (contradiction) (registry)  (council)
        │
        └─ D-orderhelper (content-derived total comparator) ─► Q2 victim tie-break
```

The single keystone (D2) fans out to five consumers. Two leaf primitives (D1 f64, D-orderhelper) are extracted/added first. D4 is the off-by-default master switch.

<!-- /ANCHOR:architecture-overview -->
---

<!-- ANCHOR:risk-mitigation -->
## L3: RISK MITIGATION

| Risk | Trigger | Mitigation | Owner |
|------|---------|------------|-------|
| Unmeasured benefit (all r=0.5) | Phase 0 | HARD benchmark gate. HOLD on no out-earn | implementer |
| D3 threshold miscalibration | Phase 3 | recalibration run + default-off policy. Not-a-no-op test | implementer |
| Integer scorer throw on fractional input | Phase 1 | NEW f64 export. Integer path byte-unchanged + throw test | implementer |
| Q2 non-determinism | Phase 4 | D-orderhelper total comparator + content-derived id. Property test | implementer |
| Q2 node destruction | Phase 4 | edge-presence read exclusion only. Retain-both test | reviewer |
| Forking the shared Beta with Advisor C4 | Phase 1 | one primitive + per-consumer adapters. Surface module location first | orchestrator |

<!-- /ANCHOR:risk-mitigation -->
