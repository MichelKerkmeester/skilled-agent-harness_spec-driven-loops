---
title: "Feature Specification: Skill Advisor - Provenance Self-Boost Guard, Attested Baseline Drift & Skip-Never-Fabricate (SA-author-self-boost-guard / SA-attested-baseline-drift-sweep / SA-skip-never-fabricate)"
description: "Skill Advisor provenance/drift observability refinements. SA-author-self-boost-guard is implemented default-off behind SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD and generalizes the two existing hardcoded self-recommendation penalties without neutering explicit_author symmetry. SA-attested-baseline-drift-sweep and SA-skip-never-fabricate remain PENDING behind the durable cross-session calibration substrate the current tmpdir JSONL lacks."
trigger_phrases:
  - "advisor provenance drift observability"
  - "SA author self boost guard"
  - "SA attested baseline drift sweep"
  - "SA skip never fabricate"
  - "advisor calibration drift contamination"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/006-provenance-drift-observability"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented default-off self-boost guard"
    next_safe_action: "Await durable calibration substrate"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-006-provenance-drift-observability"
      parent_session_id: null
    completion_pct: 34
    open_questions: []
    answered_questions: []
---

# Feature Specification: Skill Advisor - Provenance Self-Boost Guard, Attested Baseline Drift & Skip-Never-Fabricate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | complete |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/003-skill-advisor |
| **Candidates** | SA-author-self-boost-guard (provenance-contamination), SA-attested-baseline-drift-sweep (temporal-drift), SA-skip-never-fabricate (skip-reason taxonomy) |
| **Status (current)** | SA-author-self-boost-guard DONE (default-off behind `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`), SA-attested-baseline-drift-sweep PENDING (`shared-infra-dep`), SA-skip-never-fabricate PENDING (`shared-infra-dep`) |
<!-- /ANCHOR:metadata -->

### Candidate Status

| Candidate | Status | Gate / Reason | Evidence |
|-----------|--------|---------------|----------|
| SA-author-self-boost-guard | DONE (default-off) | `scope-correction` materialized, ranking behavior requires `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` | `fusion.ts`, `explicit.ts`, `types.ts`, `tests/scorer/provenance-self-boost-guard.vitest.ts` |
| SA-attested-baseline-drift-sweep | PENDING | `shared-infra-dep`, durable attested-baseline substrate absent, live record root still `tmpdir()` | `feedback-calibration.ts` still uses `RECORD_ROOT = join(tmpdir(), ...)`, `MAX_RECORDS = 50` |
| SA-skip-never-fabricate | PENDING | `shared-infra-dep`, drift-specific skip reasons need the attested-baseline path | `signalReason()` unchanged, no durable baseline schema exists in this phase |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The iter-8 mining of aionforge `cross-family-guard.md` + `drift.md` opened **two orthogonal families the fusion-math roadmap never touches** - provenance-contamination and temporal-drift - plus a skip-reason taxonomy refinement [CONFIRMED: iter-008 focus, "both docs occupy families the roadmap never touches"]. Round-E verification (iter-012) then *softened* every one of them: each is PARTIAL/CAUTION, not the build it was first mined as, and all three converge on one shared blocker - **the live calibration records are an ephemeral tmpdir 50-record window** (`RECORD_ROOT = join(tmpdir(), 'speckit-skill-advisor-calibration')` at `feedback-calibration.ts:25`, `MAX_RECORDS = 50` at `:26`, `writeFileSync(... existing.slice(-MAX_RECORDS) ...)` at `:248-251`), so there is no durable cross-session state to attest a baseline against or to persist an enriched signal into [CONFIRMED: iter-008 "both need durable cross-session state the current tmpdir JSONL lacks", iter-012 E12-03]:

- **SA-author-self-boost-guard (provenance-contamination)** is *symmetric-by-design and already mitigated for its real vector.* The `explicit_author` lane pushes an `author:${phrase}` evidence entry for every intent-signal / keyword match (`explicit.ts:318-320`) and returns it as the lane score (`explicit.ts:327`), this evidence then feeds rank/dedup with **no producer-vs-scored-skill check** (`fusion.ts:173,464`) [CONFIRMED: iter-008, iter-012 E12-01]. The naive mined framing - "a blanket guard so a producer never scores off its own authored content" - is REFUTED as over-broad: *every* skill scoring off its own authored signals IS the `explicit_author` lane working as designed, so a blanket guard neuters it. The ONE real self-recommendation vector (the advisor recommending ITSELF) is **already mitigated by two hardcoded penalties** - `readOnlyExplainerFloor` for `skill-advisor` as a read-only explainer (`fusion.ts:134`) and `auditRecsAdvisorPenalty` when the prompt asks to audit recommendation quality (`fusion.ts:313`). The actionable scope is to GENERALIZE those two ad-hoc penalties into one principled self-recommendation guard, NOT a blanket no-self-scoring rule [CONFIRMED: iter-012 E12-01 "Scope to generalizing those, not a blanket guard"].

- **SA-attested-baseline-drift-sweep (temporal-drift)** is *real but scoped to the shadow path only, and gated on durable storage.* The calibration estimator recomputes its threshold/lane signals **live every call with NO persisted baseline** (`reduceAdvisorFeedbackCalibration` at `feedback-calibration.ts:154`, `thresholdSignals` recomputed at `:193-203`) [CONFIRMED: iter-008, iter-012 E12-03]. The net-new is an **attested calibration baseline** (a versioned, committed snapshot) plus a drift sweep that scores `drift = clamp01(cos(baseline, anchor) − cos(current, anchor))` and **NEVER auto-rebaselines** (anti drift-laundering - a drifting system must not silently move its own reference point) [CONFIRMED: iter-008 delta, drift.md baseline-is-the-asset/score-threshold-sweep]. The "never auto-rebaseline" property ALREADY holds for *live* behavior - the calibration guardrails are `{defaultOff:true, shadowOnly:true, liveWeightsFrozen:true, autoPromotion:false, heldOutValidationRequired:true}` (`feedback-calibration.ts:230-237`) - so the genuine work is an attested baseline for the **shadow path only**, and the gating design choice is moving the baseline OUT of the ephemeral tmpdir into durable/committed storage [CONFIRMED: iter-012 E12-03 "Low live blast (frozen weights)"]. The mined companion **SA-anti-flap-warning-dedup** (a content-addressed warning id over `(block, baseline-epoch, score-decile)` so re-detected drift no-ops and only decile escalation re-warns) was **REFUTED as a standalone candidate** - no warning-id/epoch/decile scheme exists anywhere in the advisor and there is no emitter to migrate (`feedback-calibration` emits no warnings) [CONFIRMED: iter-012 E12-04 NO-GO]. Its *intent* is folded in here only as a content-addressed dedup discipline on the NEW drift gauge this candidate introduces - the one place an emitter would actually exist - so a stable drift state does not re-flap.

- **SA-skip-never-fabricate (skip-reason taxonomy)** is the cheapest of the three: *a lane that cannot be calibrated must be NAMED-skipped, never forced to a max score or a fabricated alarm.* The estimator already abstains conservatively - `signalReason()` returns one of `low_sample_excluded` / `sample_concentration_excluded` / `no_lane_attribution_excluded` / `supported_shadow_candidate` (`feedback-calibration.ts:125-130`), and the lane status collapses to `'excluded'` for any non-supported reason (`:171-172`) [CONFIRMED: iter-008, live read 2026-06-19 - the taxonomy is richer than the iter-8 "low_sample/concentration only" snapshot but still lacks the drift-specific distinctions]. The net-new is to ENRICH that taxonomy with the named-skip reasons drift introduces - `baselines_needed` (no attested baseline yet), `stale_model` / stale-embedder-space (the anchor embedding's model changed), `awaiting_first_behavior`, `thin` - so a not-yet-calibratable lane reports WHY it was skipped instead of silently collapsing to `excluded` or (the anti-pattern) being forced to a max/alarm value [CONFIRMED: iter-008 delta, drift.md score-threshold-sweep].

### Purpose
Ship the self-recommendation guard as a default-off, auditable scorer refinement, while keeping the two substrate-backed refinements documented and gated. The provenance-contamination family now has a real implementation path that does not blanket-penalize normal `explicit_author` symmetry. The temporal-drift sweep and skip taxonomy remain deferred until an attested baseline can exist outside the ephemeral tmpdir window.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **SA-author-self-boost-guard** - GENERALIZE the two existing hardcoded self-recommendation penalties (`readOnlyExplainerFloor` at `fusion.ts:134`, `auditRecsAdvisorPenalty` at `fusion.ts:313`) into one principled, auditable producer-vs-scored-skill guard on the self-recommendation vector ONLY, explicitly NOT a blanket "no skill scores off its own authored content" rule (that neuters the by-design `explicit_author` symmetry, `explicit.ts:327`).
- **SA-attested-baseline-drift-sweep** - an attested (versioned/committed) calibration baseline + a drift sweep `drift = clamp01(cos(baseline, anchor) − cos(current, anchor))` for the SHADOW path, with anti-drift-laundering (NEVER auto-rebaseline) and content-addressed anti-flap dedup on the new drift gauge so a stable drift state does not re-flap. Default-off, shadow-only, live weights stay frozen.
- **SA-skip-never-fabricate** - enrich the `signalReason()` taxonomy (`feedback-calibration.ts:125-130`) with named drift-skip reasons (`baselines_needed`, `stale_model`/stale-embedder-space, `awaiting_first_behavior`, `thin`) so a non-calibratable lane is named-skipped, never forced to a max score or a fabricated alarm.
- The durable cross-session calibration substrate these three share with Deep-Loop (028/004), and the gate tracking that holds each PENDING until it exists.

### Out of Scope
- **The durable substrate BUILD itself / the C4 Beta-posterior + shadow-promotion seam** - the shared calibration durability work and the Beta math are tracked under the sibling sub-phase `004-c4-shadow-seam-beta-posterior`, this sub-phase is a downstream CONSUMER of that substrate, not its owner [CONFIRMED: 004 spec "captured baseline (no benefit number exists)", iter-012 E12-03 durable-storage gate].
- **SA-anti-flap-warning-dedup as a standalone candidate** - REFUTED/NO-GO (no warning-id/epoch/decile scheme or emitter exists in the advisor, mis-mined from another subsystem) [CONFIRMED: iter-012 E12-04]. Only its content-addressed-dedup *discipline* survives, scoped onto the new drift gauge inside SA-attested-baseline-drift-sweep.
- **SA-family-normalization-dedup** - PARTIAL → hard-collapse ≈ NO-GO (cli-claude-code / cli-codex / cli-opencode are intentionally distinct routable targets, `explicit.ts:296-299`, near-siblings are deliberately SOFT 0.4-0.6 edges, not collapsed), only grouped-DISPLAY is feasible and that is a separate UI concern, not a scorer integrity fix [CONFIRMED: iter-012 E12-02].
- **The galadriel-derived advisor residue (SA-cooling-window, SA-keyword-category-drift-check, SA-scoped-hard-filter-degradation)** - all three REFUTED in iter-011 (read-only proposals already neutralize the cooling-window risk, `category` is author-declared, not keyword-derived, no hard-scope degradation path) [CONFIRMED: iter-011 all REFUTED].
- **Fusion-math routing refinements (C1 / QCR / C6 / C3 RRF spine / C5 lane-health / C4 Beta tune)** - separate sibling sub-phases (`001`–`005`), these families are orthogonal to provenance/drift [CONFIRMED: iter-008 "zero overlap with these 6"].
- The other three subsystems (Memory MCP, Code Graph, Deep Loop) - each tracked under its own 028 subsystem (Deep-Loop co-owns only the shared substrate).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts` | Unchanged (left pending) | SA-skip-never-fabricate + SA-attested-baseline-drift-sweep stay gated on the durable substrate, record root remains `tmpdir()` |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/types.ts` | Modified | Add optional producer identity on lane matches for guarded provenance checks |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Modified | Thread producer identity through author evidence only when the default-off guard path requests it, default output remains unchanged |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modified | Add `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` and centralize advisor self-recommendation guard behavior, flag off preserves current ranking |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/provenance-self-boost-guard.vitest.ts` | Created | Fixtures for default-off output, flag-on producer identity, non-advisor byte-equivalence and advisor audit penalties |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each candidate carries an explicit status and a named gate | SA-author-self-boost-guard = DONE behind default-off flag after `scope-correction`, SA-attested-baseline-drift-sweep = PENDING `shared-infra-dep`, SA-skip-never-fabricate = PENDING `shared-infra-dep`. No substrate-gated candidate is implemented while its gate is unmet [CONFIRMED: iter-008, iter-012 E12-01/E12-03] |
| REQ-002 | SA-author-self-boost-guard generalizes the two existing penalties WITHOUT neutering the by-design `explicit_author` symmetry | The guard fires only on the self-recommendation vector (a producer scoring off its OWN authored content for itself), replacing `readOnlyExplainerFloor` (`fusion.ts:134`) + `auditRecsAdvisorPenalty` (`fusion.ts:313`) with one principled producer-vs-scored-skill rule, every OTHER skill's `author:${phrase}` self-scoring (`explicit.ts:320,327`) is unchanged - a blanket guard is explicitly REJECTED [CONFIRMED: iter-012 E12-01] |
| REQ-003 | SA-attested-baseline-drift-sweep never auto-rebaselines (anti drift-laundering) and stays shadow-only | The drift sweep scores `clamp01(cos(baseline, anchor) − cos(current, anchor))` against an ATTESTED (versioned/committed, never self-updated) baseline, live weights stay frozen and the guardrails (`feedback-calibration.ts:230-237`: defaultOff/shadowOnly/liveWeightsFrozen/autoPromotion:false) are preserved, the new drift gauge is content-addressed so a stable drift state does not re-flap [CONFIRMED: iter-008 delta, iter-012 E12-03, drift.md baseline-is-the-asset] |
| REQ-004 | SA-skip-never-fabricate names every non-calibratable lane and NEVER fabricates | `signalReason()` (`feedback-calibration.ts:125-130`) is extended with `baselines_needed` / `stale_model` (stale-embedder-space) / `awaiting_first_behavior` / `thin`, a lane that cannot be calibrated reports the specific named reason and is excluded - it is NEVER forced to a max score nor emitted as a fabricated alarm [CONFIRMED: iter-008 delta, drift.md score-threshold-sweep] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The shared durable substrate is the gating decision and is co-owned with Deep-Loop (028/004), not forked | The attested baseline + enriched skip reasons persist via the durable calibration substrate built under `004-c4-shadow-seam-beta-posterior` (moving the record root off `tmpdir()` at `feedback-calibration.ts:25`), this sub-phase does NOT fork a second durability mechanism [CONFIRMED: iter-008 shared-blocker, 004 spec shared-substrate pattern, iter-012 E12-03 durable-storage gate] |
| REQ-006 | SA-anti-flap-warning-dedup is NOT built as a standalone, only its dedup discipline is reused | No standalone warning-id/epoch/decile scheme is created (REFUTED - no emitter exists), the content-addressed dedup discipline is applied ONLY to the new drift gauge introduced by SA-attested-baseline-drift-sweep, which is the sole real emitter [CONFIRMED: iter-012 E12-04 NO-GO] |
| REQ-007 | The self-boost guard's blast radius is verified inert for non-self skills | A fixture proves the generalized guard changes scoring ONLY for the self-recommendation vector and is byte-identical for all other skills' `explicit_author` contributions, the live blast is low (the penalties it replaces are already scoped to `skill-advisor` / audit-recommendation prompts) [CONFIRMED: iter-012 E12-01 "already mitigated by 2 hardcoded penalties"] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Candidate status is explicit: SA-author-self-boost-guard is DONE default-off, SA-attested-baseline-drift-sweep and SA-skip-never-fabricate stay PENDING until the shared durable calibration substrate exists. REFUTED items (SA-anti-flap as standalone, SA-family-normalization hard-collapse, the galadriel residue) remain out of scope (REQ-001/REQ-006).
- **SC-002**: When promoted, each candidate honors its invariant - the self-boost guard generalizes 2 penalties without touching by-design symmetry (REQ-002/REQ-007), the drift sweep never auto-rebaselines and stays shadow-only with an anti-flap gauge (REQ-003) and skip-never-fabricate names every skip reason and never fabricates a max/alarm (REQ-004).
- **SC-003**: The shared-substrate dependency on the sibling `004-c4-shadow-seam-beta-posterior` is explicit for SA-attested-baseline-drift-sweep and SA-skip-never-fabricate (both ride the durable substrate), SA-author-self-boost-guard additionally names its scope-correction (generalize, don't blanket).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A blanket self-boost guard neuters the by-design `explicit_author` symmetry (every skill scoring off its own authored signals is correct) | High if shipped as the naive mined framing | Scope SA-author-self-boost-guard to GENERALIZING the 2 existing penalties on the self-recommendation vector only, never a blanket no-self-scoring rule [CONFIRMED: iter-012 E12-01] |
| Risk | SA-attested-baseline-drift-sweep auto-rebaselines and launders its own drift away | Med - defeats the detector's purpose | NEVER auto-rebaseline, the baseline is an attested (versioned/committed) asset, updated only by an explicit re-attestation, not by the running system [CONFIRMED: iter-008 delta, drift.md baseline-is-the-asset] |
| Risk | Building anti-flap warning dedup as a standalone | Wasted effort - REFUTED, no emitter exists | Do NOT build it standalone, reuse only its content-addressed-dedup discipline on the new drift gauge (the one real emitter) [CONFIRMED: iter-012 E12-04 NO-GO] |
| Risk | A non-calibratable lane is forced to a max score or a fabricated alarm | Med - pollutes the shadow signal with false confidence | SA-skip-never-fabricate names the skip (`baselines_needed`/`stale_model`/`awaiting_first_behavior`/`thin`) and excludes it, never fabricate [CONFIRMED: iter-008 delta] |
| Risk | The drift baseline persists in the ephemeral tmpdir 50-record window | High - no cross-session attestation is possible there | Gate the drift sweep on moving the record root off `tmpdir()` (`feedback-calibration.ts:25`) onto the durable substrate, until then, drift is un-attestable [CONFIRMED: iter-012 E12-03, feedback-calibration.ts:25-26,248-251] |
| Dependency | Durable cross-session calibration substrate (shared with Deep-Loop 028/004) | HARD for SA-attested-baseline-drift-sweep + SA-skip-never-fabricate - the tmpdir JSONL is ephemeral, an attested baseline and the enriched skip reasons need durable state | Sequence this sub-phase after the substrate lands under `004-c4-shadow-seam-beta-posterior`, co-own the durability, do not fork it [CONFIRMED: iter-008 "both need durable cross-session state the tmpdir JSONL lacks", iter-012 E12-03] |
| Dependency | The two existing self-recommendation penalties (`fusion.ts:134,313`) | SOFT for SA-author-self-boost-guard - it generalizes them | The guard is a refactor/generalization of code that already exists, so it is the least-blocked of the three (no substrate needed), but low-priority - the real self-rec vector is already mitigated [CONFIRMED: iter-012 E12-01] |
| Dependency | External model - aionforge `cross-family-guard.md` (who-the-writers-are, union-with-authoring-model) + `drift.md` (baseline-is-the-asset, score-threshold-sweep) | Reference pattern for the self-boost guard + the attested-baseline drift sweep | `external/aionforge-memory-development/docs/{cross-family-guard.md, drift.md}` [CONFIRMED: iter-008 mining source] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: SA-author-self-boost-guard runs at the existing dedup/rank seam (`fusion.ts:173,464`) - it replaces two existing per-recommendation checks with one, so it adds no net per-skill cost.
- **NFR-P02**: SA-attested-baseline-drift-sweep computes one cosine pair per anchor per call (`cos(baseline, anchor)` is read from the attested snapshot, `cos(current, anchor)` reuses the already-computed current signal) - O(anchors), bounded and shadow-path only, it does NOT add per-skill cost to the live scorer.

### Security
- **NFR-S01**: None of the three introduce a new untrusted-input path, SA-skip-never-fabricate only labels an internal calibration state, the drift sweep reads an attested internal baseline and the self-boost guard reads producer identity already present in the projection.

### Reliability
- **NFR-R01**: Each candidate is reversible. SA-author-self-boost-guard is default-off and leaves current scorer behavior unchanged unless `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` is enabled. SA-attested-baseline-drift-sweep remains default-off/shadow-only with live weights frozen (`feedback-calibration.ts:230-237`), SA-skip-never-fabricate remains unimplemented until the substrate exists.
- **NFR-R02**: With the new self-guard flag unset, scorer + calibration behavior is today's default path. The drift gauge, when added, is content-addressed so a stable drift state never re-flaps (anti-flap discipline reused, not the refuted standalone).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- No attested baseline yet (today's state): SA-attested-baseline-drift-sweep reports `baselines_needed` via SA-skip-never-fabricate and emits NO drift score (never a fabricated 0 or a forced alarm).
- The self-recommendation vector is absent from a query (the common case): SA-author-self-boost-guard is a no-op, every skill's `explicit_author` self-scoring proceeds unchanged.
- Embedder/model change since the baseline was attested: the anchor cosine is cross-space and meaningless - SA-skip-never-fabricate reports `stale_model` (stale-embedder-space) and the lane is excluded, not scored.

### Error Scenarios
- Calibration record store unreadable / mid-rotation: the drift sweep degrades to `baselines_needed` (named-skip), never a fabricated alarm, the live scorer is unaffected (calibration is shadow-only).
- Stable drift across consecutive calls: the content-addressed drift gauge no-ops (anti-flap) - only a decile/threshold escalation re-emits, so a steady drift does not spam.
- A producer skill legitimately authored content it is now being scored for, but it is NOT the self-recommendation vector: SA-author-self-boost-guard does NOT fire (by-design `explicit_author` symmetry preserved) - only the self-recommendation case is guarded.

### State Transitions
- Substrate lands (the durable calibration store ships under 028/004): SA-attested-baseline-drift-sweep + SA-skip-never-fabricate move PENDING → promotable, attest an initial baseline, then enable the shadow drift sweep.
- Partial promotion: SA-author-self-boost-guard has landed independently of the substrate and is default-off, SA-skip-never-fabricate may land as soon as the substrate exists even if the full drift sweep follows.
- Re-attestation: a baseline is updated ONLY by an explicit human/committed re-attestation event - never by the running system (anti drift-laundering).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | Three calibration/scorer-seam candidates in `feedback-calibration.ts` (+ `explicit.ts`/`fusion.ts` for the self-boost guard), two new orthogonal families (provenance, drift) + a taxonomy enrich, all deferred - this sub-phase authors the deferred plan, not code |
| Risk | 12/25 | Drift sweep is shadow-only/default-off (low live blast, frozen weights), self-boost guard generalizes 2 scoped penalties (low blast), skip-never-fabricate is enum-only, main risk is the over-broad blanket-guard framing (mitigated by scope-correction), no schema migration in this sub-phase (the durable substrate is 028/004's) |
| Research | 7/20 | Fully researched (iter-8 mining + iter-11/12 adversarial verify), residual is the durable-substrate design choice (owned by 028/004) + the exact stale-model detection signal |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where does the durable calibration substrate live, and is it the SAME store 028/004 builds for the C4 shadow-promotion seam? Both ride it, the storage choice is the gating decision and is co-owned [CONFIRMED: iter-012 E12-03, 004 spec shared-substrate].
- What is the precise stale-embedder-space detection signal for `stale_model` - an embedder-model id stamped on the attested baseline, compared to the live embedder? Open, needs the attested-baseline schema [CONFIRMED: iter-008 delta, drift.md].
- For the generalized self-boost guard, what is the exact producer-vs-scored-skill predicate that fires ONLY on the self-recommendation vector and never on the by-design `explicit_author` symmetry? The two existing penalties (`fusion.ts:134,313`) are the calibration anchors [CONFIRMED: iter-012 E12-01].
- Should the drift gauge's content-addressed key be `(lane, baseline-epoch, drift-decile)` - the iter-8 mined shape, minus the refuted warning-id machinery - applied only to the new emitter? [CONFIRMED: iter-008 delta, iter-012 E12-04 standalone REFUTED].
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research evidence**: `../research/research.md` (Internal Baseline, Broadening Addendum - shadow pipeline + raw-frequency estimator), `../research/iterations/iteration-008.md` (the 6 NET-NEW contamination/drift candidates, both families need durable state), `../research/iterations/iteration-011.md` (galadriel-advisor residue all REFUTED), `../research/iterations/iteration-012.md` (Round-E verify: self-boost symmetric-by-design + already-mitigated, attested-baseline shadow-only + durable-storage-gated, anti-flap REFUTED, family hard-collapse ≈ NO-GO)
- **Deltas**: `../research/deltas/iter-008.jsonl` (SA-author-self-boost-guard, SA-attested-baseline-drift-sweep, SA-skip-never-fabricate candidate rows), `../research/deltas/iter-012.jsonl` (E12-01 self-boost scope-correction, E12-03 attested-baseline durable gate, E12-04 anti-flap NO-GO)
- **Roadmap**: `../../research/roadmap.md` (BROADENING ADDENDUM - raw-frequency estimator, shadow pipeline, Skill Advisor open items)
- **Synthesis**: `../../research/synthesis/01-go-candidates.md` (Advisor needs-validation cluster), `../../research/synthesis/03-corrections-caveats-and-residuals.md`, `../../research/synthesis/04-sibling-and-cross-cutting.md` (provenance-signing disposition)
- **Sibling sub-phase (shared substrate dep)**: `../004-c4-shadow-seam-beta-posterior/spec.md` (the durable calibration substrate + C4 shadow-promotion seam these two ride)
- **Sibling sub-phases (orthogonal families)**: `../001-rrf-determinism-spine/spec.md`, `../005-conflict-rerank-query-routing/spec.md` (fusion-math routing - zero overlap with provenance/drift)
- **Parent spec**: `../spec.md`
- **Wave-0 shipped record (historical evidence)**: Wave-0 record (no SA-author-self-boost-guard / SA-attested-baseline-drift-sweep / SA-skip-never-fabricate row, the table covers only Memory/Code-Graph/Deep-Loop Wave-0 candidates)
<!-- /ANCHOR:related-docs -->
