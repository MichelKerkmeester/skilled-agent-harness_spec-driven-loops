---
title: "Implementation Plan: Skill Advisor C4 Shadow Seam + Beta Posterior"
description: "Sequenced shadow-only build of the C4 estimator->registry seam, a shared Beta-posterior primitive and the aionforge promotion-gate family for the Skill Advisor lane scorer."
trigger_phrases:
  - "advisor c4 seam plan"
  - "advisor beta posterior plan"
  - "skill advisor promotion gate plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-advisor-tuning/002-skill-advisor-runtime/004-c4-shadow-seam-beta-posterior"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author plan for the C4 shadow-seam + Beta-posterior sub-phase"
    next_safe_action: "Start Phase 0: capture baseline + build the lane-health signal"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-004-c4-shadow-seam"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Skill Advisor C4 Shadow Seam + Beta Posterior

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope, remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, MCP server) |
| **Framework** | system-skill-advisor MCP server (`mcp_server/lib/scorer/`) |
| **Storage** | Append-only feedback-calibration JSONL (`MAX_RECORDS=50` ring) + env-resolved shadow-weight channel |
| **Testing** | Vitest (existing advisor scorer test harness) |

### Overview
The C4 machinery shipped default-off shadow in `10c5b61493`: `beta-reliability.ts` (shared f64 posterior + advisor adapter), the standalone `shadow-weight-promoter.ts` module as 339 lines alongside `beta-reliability.ts`, and the `feedback-calibration.ts`/`lane-registry.ts` integration wiring (estimator→registry seam, asymmetric deltas, content-fold, decay channel). Git history shows `shadow-weight-promoter.ts` was later deleted in `8efcde0e6b`, the same commit that removed outcome-weighted-rerank, its only consumer. Everything stays shadow-only behind `liveWeightsFrozen`, only the live-flip micro-benchmark remains NO-GO. Everything stays shadow-only behind `liveWeightsFrozen`, promotion to live is a documented NO-GO until a micro-benchmark earns it.

**CORRECTION (2026-07-01, drift-audit remediation -- pass 2 / git-history reconciliation): the 'never committed' claim above is factually wrong -- see full correction.** Git history shows the standalone `shadow-weight-promoter.ts` module was committed in `10c5b61493` as a 339-line module alongside `beta-reliability.ts`. Git history also shows `shadow-weight-promoter.ts` was deleted in `8efcde0e6b`, the same commit that removed the outcome-weighted-rerank feature; in `8efcde0e6b`, outcome-weighted-rerank was the promoter's only consumer. The promoter's sole purpose was feeding that feature's live-adjacent rerank, so when `8efcde0e6b` removed outcome-weighted-rerank for measured-negative reasons, `shadow-weight-promoter.ts` was removed in `8efcde0e6b` alongside it as dead weight. Q-002 (daemon reload semantics) remains a separate, still-unresolved architecture blocker independent of the `8efcde0e6b` deletion. Reviving `shadow-weight-promoter.ts` was considered and explicitly not approved by the operator, so this is a documentation correction only; no code changes accompany it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md §2-3)
- [ ] Success criteria measurable (spec.md §5 SC-001..003)
- [ ] Dependencies identified (Phase-0 health signal, shared Beta primitive w/ D2, daemon reload Q-002)

### Definition of Done
- [ ] All P0 acceptance criteria met (REQ-001..006)
- [ ] Beta math + gate + fold + guardrail unit tests passing
- [ ] `tsc`/build + existing advisor suite green
- [ ] Docs (spec/plan/tasks/checklist/decision-record) synchronized
- [ ] Promotion-to-live NO-GO gate recorded in decision-record.md
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shadow-channel side-pipeline: a read-only estimator (in-process) emits proposals → an out-of-process promoter folds + gates them → writes a non-live shadow-weight channel the daemon resolves at load. The live scorer is never on this path.

### Key Components
- **Estimator** (`feedback-calibration.ts:154-239`): emits `ReadOnlyScorerCalibrationProposal`, extended here with a Beta lane signal, asymmetric/sign-locked deltas, content-addressed fold, cold-start neutral prior.
- **Beta primitive** (new `beta-reliability.ts`): shared f64 `(α₀+s)/(α₀+β₀+s+f)`, cold-start 0.5, count floor, commuting folds. Thin advisor adapter (posterior → weight-delta). Co-owned with Deep-Loop D2.
- **Promoter** (new out-of-process script): reads the JSONL proposal → two-gate (k≥2 AND posterior, reachability-refusal) + held-out attestation → writes `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` → daemon reload trigger. Cron/maintenance only.
- **Lane registry** (`lane-registry.ts:8-13,71-74`): shadow-weight channel `RESOLVED_SHADOW_WEIGHTS`, extended with a decay/un-promotion revert path + audit tags.

### Data Flow
outcome records (durable, `accepted|corrected|ignored`) → `reduceAdvisorFeedbackCalibration` → proposal in JSONL → **[the seam built here]** → promoter folds (content-addressed, commuting Beta) → gates (two-gate + held-out) → shadow-weight channel → advisor daemon (shadow recommendation channel `_shadow`). The live recommendation path is untouched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `feedback-calibration.ts:176` (weight delta) | Symmetric single `clamp((accept−correct)*MAX_WEIGHT_DELTA)` | unchanged for the weight delta (it is provably symmetric - corrected iter-17), the asymmetry lands at `:200-201` instead | Read live: `:176` is `round4(clamp((acceptancePressure − correctionPressure)*MAX_WEIGHT_DELTA, ...))` |
| `feedback-calibration.ts:200-201` (threshold deltas) | `confidenceThresholdDelta`/`uncertaintyThresholdDelta` | add NEW sign-locked asymmetric helper (down≥up, gain→0) | Read live: `:200-201` `round4(clamp(correctionRate*…))` / `round4(clamp(-ignoredRate*…))` |
| `feedback-calibration.ts:193-197` (low-sample exclude) | EXCLUDES the signal (`low_sample_excluded`) | replace with cold-start neutral prior (Beta(1,1)→0.5), NEEDS-BENCHMARK vs the cliff | Read live: `:197` `reason: records.length < minSamples ? 'low_sample_excluded' : …` |
| `feedback-calibration.ts:222-238` (proposal emit) | Emits `buildReadOnlyScorerCalibrationProposal`, `:230-237` guardrails | add a CONSUMER (the promoter), guardrails MUST stay TRUE | Read live: `:233-234` `liveWeightsFrozen:true, autoPromotion:false` |
| `feedback-calibration.ts:241-251` (persist) | `slice(-MAX_RECORDS)` insertion-ordered append | content-addressed, replay-safe, commuting fold | Read live: `:251` `existing.slice(-MAX_RECORDS).join('\n')` |
| `lane-registry.ts:71-74` (`RESOLVED_SHADOW_WEIGHTS`) | Env-resolved shadow channel, resolved ONCE at module load | the promoter writes the env var/file, add decay/revert + audit | Read live: `:71-74` resolves `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` |
| `deep-loop-runtime/lib/deep-loop/bayesian-scorer.ts` `computeScore` (`:13-25`) | NOT a consumer - throws on non-integer inputs | not reused, build a separate f64 primitive | Read live: `:14-15` `if (!Number.isInteger(success)…) throw new RangeError`, 44-line file (synthesis `:182-191` is stale) |
| advisor `_shadow` recommendation channel | Shadow recommendation surface | unchanged consumer of shadow weights | grep `advisor-recommend.ts` `_shadow` |

Required inventories:
- Same-class producers: `rg -n 'MAX_WEIGHT_DELTA|proposedDelta|clamp\(' .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts`.
- Consumers of changed symbols: `rg -n 'RESOLVED_SHADOW_WEIGHTS|SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON|ReadOnlyScorerCalibrationProposal|reduceAdvisorFeedbackCalibration' .opencode/skills/system-skill-advisor --glob '*.ts'`.
- Matrix axes: {empty log, below-minSamples, concentrated, k=1 vs k≥2 attesters, unreachable policy, replay/double-delivery, decayed-then-regained support} × {shadow-only invariant}.
- Algorithm invariant: the C4-seam can NEVER write a live lane weight (`liveWeightsFrozen` holds), the Beta fold is order-independent and replay-idempotent.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Baseline + Foundation (REQ-001, REQ-002)
- [ ] Capture an estimator/proposal baseline into `scratch/` (no leverage number quoted without it, the 13% is unsourced)
- [ ] Build the per-lane runtime score-presence (lane-health) signal in `laneSignals`
- [ ] Add the NEW asymmetric-deltas helper at `:200-201` (down≥up, gain→0, do NOT mutate the shared `clamp`)

### Phase 1: The C4-seam (REQ-003, REQ-004)
- [ ] Build the out-of-process promoter that reads the proposal JSONL and writes the shadow-weight channel
- [ ] Wire the daemon reload trigger (resolve Q-002 first)
- [ ] Assert (test) the shadow-only guardrails hold and no live weight can move

### Phase 2: Beta posterior (REQ-005)
- [ ] Build the shared f64 Beta primitive `(α₀+s)/(α₀+β₀+s+f)` (cold-start 0.5, count floor)
- [ ] Build the thin advisor adapter (posterior → weight-delta), coordinate the shared module with Deep-Loop D2

### Phase 3: Promotion-gate family (REQ-006..010)
- [ ] SA-two-gate (k≥2 AND posterior, non-trading, reachability-refusal)
- [ ] SA-cold-start-neutral-prior (Beta(1,1)→0.5, NEEDS-BENCHMARK vs the cliff)
- [ ] SA-heldout-attestation-gate (distinct-source, one-vote-per-source, distinct-author guard)
- [ ] SA-decay-un-promotion (reversible demote + audit tags, shadow-only)
- [ ] SA-content-addressed-fold (replay-safe, order-independent)

### Phase 4: Verification + NO-GO gate (REQ-011)
- [ ] Beta math + gate + fold + guardrail unit tests green, `tsc`/build + existing suite green
- [ ] Record the promotion-to-live NO-GO gate (micro-benchmark required) in decision-record.md
- [ ] `validate.sh --strict` on this packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Beta math (commutativity, cold-start 0.5, anti-flood 8-vs-10k), gate (k-floor, reachability-refusal), fold (replay/double-delivery idempotence), guardrail (no live write) | Vitest |
| Integration | Promoter reads JSONL proposal → writes shadow channel → daemon reload (shadow `_shadow` channel only) | Vitest + harness |
| Manual | Baseline capture before/after the delta-shape change | scratch/ harness |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase-0 lane-health signal | Internal | Green (build here) | Naive attribution over-credits non-matching skills |
| Shared Beta primitive (Deep-Loop D2 co-owner) | Internal | Yellow (cross-subsystem coordination) | Divergent forks, build one module + adapters |
| `laneAttributionBySkill` per-lane attribution | Internal | Red (empty in production, 027 shipped none) | No per-lane tuning signal → stays shadow-only |
| Daemon shadow-weight reload (Q-002) | Internal | Yellow (unconfirmed) | Promoter writes may not take effect without an explicit trigger |
| aionforge attestation-and-promotion.md / trust-model.md | External (research) | Green (mined, iter-7/8) | Gate design lacks a reference |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any sign a shadow weight could reach live routing, or a unit test proves the guardrail is breachable.
- **Procedure**: All changes are additive and shadow-gated, revert the scoped commits per candidate. The shadow-weight channel is env-resolved - unset `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` to restore default shadow weights. No live weight ever changes, so rollback is reversion-only with no data migration.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Baseline + lane-health + asymmetric-deltas) ──► Phase 1 (C4-seam) ──► Phase 2 (Beta posterior) ──► Phase 3 (gate family) ──► Phase 4 (Verify + NO-GO)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 0 | None | C4-seam, gate family |
| Phase 1 (C4-seam) | Phase 0 | Beta posterior, gate family |
| Phase 2 (Beta) | Phase 1, D2 co-build | gate family |
| Phase 3 (gates) | Phase 1 + Phase 2 | Verify |
| Phase 4 (Verify) | Phase 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 0 (Baseline + foundation) | Med | baseline capture + lane-health signal + asymmetric helper |
| Phase 1 (C4-seam) | Med | out-of-process promoter + reload trigger |
| Phase 2 (Beta posterior) | Med | shared f64 primitive + adapter (co-build) |
| Phase 3 (gate family) | High | two-gate + held-out + cold-start + decay + fold |
| Phase 4 (Verify + NO-GO) | Med | unit tests + NO-GO record + validate |
| **Total** | High | Level 3, critical path C4-seam → Beta → two-gate → held-out → decay |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (N/A - additive shadow-only, no data migration)
- [ ] Feature flag configured (`SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` shadow channel, guardrails default-off)
- [ ] Monitoring alerts set (N/A for shadow channel)

### Rollback Procedure
1. Unset `SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON` to restore default shadow weights.
2. Revert the per-candidate scoped commits.
3. Verify the advisor recommend path is byte-identical to baseline (live path was never touched).
4. Notify N/A (no user-facing change).

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A - append-only JSONL is read-only input, the promoter is idempotent.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Phase 0    │────►│   Phase 1    │────►│   Phase 2    │────►│  Phase 3/4   │
│ baseline +   │     │  C4-seam     │     │ Beta (w/D2)  │     │ gates+verify │
│ lane-health  │     │  promoter    │     │              │     │              │
└──────────────┘     └──────────────┘     └──────┬───────┘     └──────────────┘
                                                 │
                                          ┌──────▼───────┐
                                          │ Deep-Loop D2 │ (sibling consumer,
                                          │  adapter     │  028/004 - co-build)
                                          └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase-0 foundation | None | lane-health signal, baseline, asymmetric helper | C4-seam, gates |
| C4-seam promoter | Phase-0 | closed estimator→registry loop | Beta, gates |
| Beta primitive | C4-seam, D2 co-build | posterior + advisor adapter | gate family |
| Gate family | C4-seam + Beta | two-gate/held-out/cold-start/decay/fold | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 0 - baseline + lane-health + asymmetric-deltas** - CRITICAL (everything sequences behind the health signal)
2. **C4-seam promoter** - CRITICAL (closes the loop the rest needs)
3. **Beta posterior (shared w/ D2)** - CRITICAL (the gate family consumes it)
4. **SA-two-gate → SA-held-out → SA-decay** - CRITICAL (the conservative promotion chain)

**Total Critical Path**: Phase 0 → C4-seam → Beta → two-gate → held-out → decay.

**Parallel Opportunities**:
- `SA-asymmetric-deltas`, the C5 baseline capture and C3 (RRF import, off-path, owned elsewhere) are off-critical-path parallel tracks.
- `SA-content-addressed-fold` and `SA-cold-start-neutral` can land alongside the gate chain.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Foundation ready | baseline captured + lane-health signal + asymmetric helper landed | Phase 0 |
| M2 | Loop closed | promoter reads proposal → writes shadow channel, guardrails hold | Phase 1 |
| M3 | Posterior live (shadow) | shared Beta primitive + adapter, anti-flood/cold-start tests green | Phase 2 |
| M4 | Gates + NO-GO | two-gate/held-out/decay/fold tested, NO-GO recorded | Phase 3-4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: C4 is a BUILD, shadow-only, not a graduation

**Status**: Accepted

**Context**: Research framed C4 as graduating an already-shipped Beta estimator. Live code (`feedback-calibration.ts:176`) is raw-frequency, grep for `posterior|prior|alpha|beta` in the scorer = 0 (iter-14). 027 shipped no lane attribution.

**Decision**: Build the Beta posterior + promotion gate from scratch, keep the whole pipeline shadow-only behind `liveWeightsFrozen`, gate the live flip behind a micro-benchmark (NO-GO until it beats the `minSamples` cliff).

**Consequences**:
- Net-new math + a net-new out-of-process seam, larger than a "promote-the-flag" task.
- A bad shadow weight cannot corrupt routing (the lane is non-live).

**Alternatives Rejected**:
- "Graduate the existing estimator": rejected - there is no Beta math to graduate.
- "Reuse `deep-loop-runtime/lib/deep-loop/bayesian-scorer.ts` integer scorer": rejected - `computeScore` throws `RangeError` on non-integer inputs (`:14-15`) the fractional posterior needs.

### ADR-002: One shared Beta f64 primitive + thin per-consumer adapters

**Status**: Accepted

**Context**: The anti-flood Beta posterior is shared by Advisor C4 and Deep-Loop D2 (roadmap §4 shared-infra). It is NOT "one module, three identical callers" (synthesis 04 RC6): the advisor consumes the posterior as a weight-delta, D2 as a posterior, the integer scorer throws on fractional inputs.

**Decision**: Build one f64 primitive `(α₀+s)/(α₀+β₀+s+f)` with cold-start 0.5 and a count floor, plus a thin advisor adapter, coordinate the module location with the Deep-Loop subsystem (028/004).

**Consequences**: Avoids a divergent fork, D2 wiring lands in its own subsystem.

**Alternatives Rejected**:
- "Advisor builds its own Beta": rejected - duplicates the keystone math.
<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->
