---
title: "Feature Specification: Skill Advisor — Runtime Lane-Health & Graceful Lane-Degrade (C5/C5a/AMB)"
description: "A graceful-degradation unit for the Skill Advisor 5-lane fusion scorer. A P0 runtime per-lane health signal distinguishes a degraded-empty lane (mid-rebuild) from a matched-nothing-empty lane; C5 then elides only runtime-degraded lanes from liveTotal (degrade-to-remaining, not skew-down); C5a surfaces the degraded-lane list for legibility; AMB extends the ambiguity/abstention explanation. A confidence baseline is captured FIRST because the asserted '~13% skew' is unsourced."
trigger_phrases:
  - "advisor runtime lane health degrade"
  - "C5 lane elision livetotal"
  - "C5a degraded lane flag"
  - "advisor liveTotal skew baseline"
  - "skill advisor graceful degrade fusion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/002-002-runtime-lane-health-degrade"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author C5/C5a/AMB lane-health-degrade impl sub-phase spec (re-plan; PENDING)"
    next_safe_action: "Capture the confidence baseline (P0), then build the runtime lane-health signal"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-002-runtime-lane-health-degrade"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: Skill Advisor — Runtime Lane-Health & Graceful Lane-Degrade (C5/C5a/AMB)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/003-skill-advisor |
| **Candidates** | C5, C5a, AMB (+ aliases C5-advisor-lane-elision, C5a-advisor-degraded-lane-flag) |
| **Status (all)** | PENDING — none shipped in 030 Wave-0 (`git log 1ecc531431..ab5459fb6d` has no advisor/lane/C5 commit; 030 §14 has no advisor row; 030 spec line 106 lists C5 as NO-GO until baseline + lane-health signal) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Skill Advisor fuses five lanes — `explicit_author 0.42 / lexical 0.28 / graph_causal 0.13 / derived_generated 0.12 / semantic_shadow 0.05` (`lane-registry.ts:8-19`) — and normalizes confidence against a `liveTotal` denominator built from **registry-static live weights filtered only by the config `disabled` set, never by runtime emptiness** (`fusion.ts:343-345`; `liveNormalized = score / liveTotal` at `fusion.ts:388`) [CONFIRMED: research.md Internal Baseline; iter-003 F5/F7].

When a lane runs but returns `[]` at runtime — e.g. `graph_causal` during a skill-graph rebuild — its weight stays in `liveTotal` while no skill receives any contribution from it, so every survivor's `liveNormalized` is divided by an **inflated denominator** and confidence skews uniformly downward by the missing lane's weight share [CONFIRMED: iter-003 F7, `fusion.ts:388`]. The mechanism is real, but the often-quoted **"~13% skew" is UNSOURCED** — a grep for `13%`/`~13`/`0.13`/confidence-skew across `.opencode/specs` + `system-skill-advisor` returns **zero** matches, so it fails the regression-baseline rule and MUST NOT be cited until measured [CONFIRMED: BROADENING §2/§6, roadmap.md:90,218,262; synthesis 01-go-candidates.md:59].

The naive fix (drop any empty lane from `liveTotal`) is wrong: the scorer has **no runtime per-lane health signal** to tell a **degraded-empty** lane (mid-rebuild) apart from a **matched-nothing-empty** lane (the lane ran fine and legitimately matched nothing). Eliding zero-match lanes would over-credit non-matching skills — a skew *opposite* to the bug C5 fixes [CONFIRMED: roadmap.md:90; synthesis 01-go-candidates.md:103; iter-014 G14-03; iter-016 J16-01]. `disabled` is config-only and is never set from runtime emptiness (`fusion.ts:337,339,343-345`) [CONFIRMED: iter-014]. The existing `metrics.liveLaneCount` is derived from the registry filter (`isLiveScorerLane && !disabled`, `fusion.ts:535-536`) — it does **not** reflect runtime degradation either.

### Purpose
Ship a coherent graceful-degradation unit, in P0-first order:
1. **P0 baseline** — capture the real confidence delta the inflated-denominator skew causes, replacing the unsourced "~13%".
2. **P0 lane-health signal** — a runtime per-lane score-presence/health flag the scorer currently lacks, distinguishing degraded-empty from matched-nothing-empty.
3. **C5** — elide ONLY runtime-degraded lanes from `liveTotal` (degrade-to-remaining), mirroring aionforge's "degrade to the remaining live signals".
4. **C5a** — surface the degraded-lane list / live-lane count in the result explanation, mirroring aionforge's `embedder_available:false` reporting.
5. **AMB** — extend the ambiguity/abstention explanation so a degraded-lane call is legible alongside the existing ambiguity surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A runtime per-lane health/score-presence signal in the scorer that flags a lane as `runtime_degraded` vs `matched_nothing` (the P0 prerequisite C5/C5a both consume).
- C5: compute `liveTotal` over lanes that are NOT runtime-degraded (elide only degraded lanes, never zero-match lanes), so `liveNormalized` degrades-to-remaining instead of skewing down.
- C5a: add a per-call degraded-lane list / `liveLaneCount` to the result explanation/metrics for downstream legibility.
- AMB: extend the existing ambiguity/abstention explanation surface so a degraded-lane condition is reported alongside the ambiguity reason.
- A captured confidence baseline (before/after the elision) per the regression-baseline rule, since C5 changes confidence magnitudes on every rebuild window.

### Out of Scope
- C3 (import the shared deterministic RRF `fuseResultsMulti`) — tracked under a separate 028/003 RRF sub-phase; it is the determinism spine, not a degrade fix [CONFIRMED: roadmap.md:36; research.md C3 row].
- C4 (Beta-posterior lane auto-tune) and the SHARED-with-Deep-Loop-D2 Beta posterior, plus the C4-seam shadow promoter and the SA-two-gate / cold-start / held-out / decay-un-promotion / content-fold chain — Phase-2/3 work in iter-016's build sequence, gated behind the Beta build [CONFIRMED: iter-016 J16-01].
- QCR (query-class router) and C1 (split-conflict re-rank; `conflicts_with` arrays are empty in production so C1 is deferred regardless) [CONFIRMED: roadmap.md:193].
- The other three subsystems (Memory MCP, Code Graph, Deep Loop) graceful-degradation work — each tracked under its own 028 subsystem; C5/C5a only formalize the in-process advisor version of the same spine [CONFIRMED: roadmap.md:92,95].
- SA-asymmetric-deltas (sign-locked threshold deltas at `feedback-calibration.ts:200-201`) — a different seam in iter-016's Phase-0, not part of this degrade unit [CONFIRMED: iter-016 J16-01 key note].

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modify | Add a runtime per-lane health/score-presence signal; restrict `liveTotal` (`:343-345`) to non-degraded lanes; thread the degraded-lane list into the explanation/metrics (`:535-536`) and the ambiguity/abstention surface (`:484-513`) |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lane-registry.ts` | Modify (likely) | If the health flag is registry-keyed, extend the per-lane shape without changing default weights |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/*.vitest.ts` | Create | Degrade-vs-matched-nothing fixtures: degraded lane elided (confidence rises to degrade-to-remaining), zero-match lane retained (no over-credit), and an unchanged-baseline assertion when all lanes healthy |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Capture a confidence baseline BEFORE quoting any skew number | A recorded before/after confidence delta for a representative prompt with `graph_causal` runtime-empty; the unsourced "~13%" is removed from all docs and replaced with the measured value (or marked UNKNOWN until measured) [CONFIRMED: roadmap.md:218,262; BROADENING §2] |
| REQ-002 | A runtime per-lane health signal exists in the scorer | Each lane is classed per call as `healthy` / `runtime_degraded` / `matched_nothing`; the signal is derived from runtime score-presence (and rebuild/health state), NOT from the config `disabled` set or the registry-static `isLiveScorerLane` filter [CONFIRMED: iter-014 G14-03; iter-016 J16-01] |
| REQ-003 | C5 elides ONLY runtime-degraded lanes from `liveTotal` | `liveTotal` excludes lanes flagged `runtime_degraded`; a lane flagged `matched_nothing` STAYS in `liveTotal`; survivors degrade-to-remaining (no over-credit of non-matching skills) [CONFIRMED: roadmap.md:90; synthesis 01-go-candidates.md:103] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The all-lanes-healthy path is unchanged | When no lane is `runtime_degraded`, `liveTotal` and every recommendation's confidence are byte-identical to the captured baseline (the degrade branch is inert on the happy path) |
| REQ-005 | C5a surfaces the degraded-lane list | The result explanation/metrics carry a per-call degraded-lane list and a runtime-accurate live-lane count, mirroring aionforge `embedder_available:false`; the existing registry-derived `metrics.liveLaneCount` (`fusion.ts:535-536`) is corrected or complemented to reflect runtime degradation [CONFIRMED: iter-003 C5a; roadmap.md:91] |
| REQ-006 | AMB extends the ambiguity/abstention explanation | A degraded-lane condition is reported on the existing ambiguity/abstention surface (`fusion.ts:484-513`) so a degraded call is legible without changing the abstention threshold semantics [CONFIRMED: iter-004 AMB candidate; deltas/iter-004.jsonl rank 9] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With a runtime-degraded lane (e.g. `graph_causal` mid-rebuild), survivor confidence degrades-to-remaining and matches the measured baseline-corrected value — NOT skewed down by the missing lane's weight share (REQ-001/REQ-002/REQ-003 met).
- **SC-002**: A lane that ran and matched nothing is NOT elided, so non-matching skills are not over-credited; and with all lanes healthy the output is byte-identical to baseline (REQ-003/REQ-004 met).
- **SC-003**: A degraded call is legible — the degraded-lane list / runtime live-lane count appears in the explanation and the ambiguity/abstention surface (REQ-005/REQ-006 met).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | C5 changes confidence magnitudes on every rebuild window | High — confidence is a load-bearing output (abstention, ambiguity, ranking ties) | Capture the baseline FIRST (REQ-001) and gate C5 on the measured delta; happy path proven byte-identical (REQ-004) [CONFIRMED: roadmap.md:90 "needs baseline"; research.md C5 conflict-risk Med] |
| Risk | Naive elision over-credits non-matching skills (skew OPPOSITE the bug) | High — would silently invert the fix | The P0 lane-health signal (REQ-002) is a HARD prerequisite; C5 elides only `runtime_degraded`, never `matched_nothing` [CONFIRMED: synthesis 01-go-candidates.md:103; iter-014 G14-03] |
| Risk | The "~13%" number is asserted, not measured | Med — citing it would fabricate evidence | Treat as UNKNOWN until REQ-001 measures it; do not cite "~13%" anywhere [CONFIRMED: roadmap.md:262; BROADENING §6] |
| Dependency | A runtime score-presence / rebuild-health signal the scorer currently lacks | Internal-gap — the P0 prerequisite this unit builds | `laneScores[lane].length` / `scores.graph_causal` give runtime emptiness; rebuild-state distinguishes degraded from matched-nothing; the registry filter alone is insufficient [CONFIRMED: iter-003 C5 touch points; iter-014 G14-03] |
| Dependency | External model — aionforge "degrade to the remaining live signals" / `embedder_available:false` | Reference pattern for C5/C5a | `external/aionforge-memory-development/docs/retrieval.md` (degrade-to-remaining; `embedder_available:false` reporting) [CONFIRMED: deltas/iter-003.jsonl C5a evidence `retrieval.md:300`] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The runtime lane-health classification adds negligible per-call latency — it reuses already-computed `laneScores[lane].length` / `scores.graph_causal` runtime presence, not a new pass over the projection.

### Reliability
- **NFR-R01**: The degrade branch is inert when all lanes are healthy; an all-healthy call MUST be byte-identical to the registry-static `liveTotal` baseline (REQ-004).
- **NFR-R02**: A `matched_nothing` lane is NEVER elided — the over-credit inversion (skew opposite the bug) is a correctness invariant, not a tuning target [CONFIRMED: synthesis 01-go-candidates.md:103].
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Lane-State Boundaries
- All lanes healthy: degrade branch inert; output byte-identical to baseline (REQ-004).
- One lane `runtime_degraded` (e.g. `graph_causal` mid-rebuild): elided from `liveTotal`; survivors degrade-to-remaining (SC-001).
- One lane `matched_nothing` (ran fine, matched nothing): RETAINED in `liveTotal`; non-matching skills NOT over-credited (SC-002).
- ALL live lanes degraded simultaneously: `liveTotal` would collapse — fall back to the registry-static `liveWeightTotal()` floor (already the `|| liveWeightTotal()` guard at `fusion.ts:344`) rather than divide-by-zero.

### Signal Boundaries
- `laneAttributionBySkill` empty: the health signal must stay call-scoped and NOT collapse to a workspace-wide aggregate [CONFIRMED: iter-016 J16-01 key note].
- `disabled` (config) vs `runtime_degraded` (runtime): config-disabled lanes are already excluded; the new flag is orthogonal and additive.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Single skill, ~1-2 scorer files (`fusion.ts`, maybe `lane-registry.ts`) + tests; S-effort per research [CONFIRMED: research.md C5/C5a effort S] |
| Risk | 16/25 | Changes a confidence-bearing output on every rebuild window; the over-credit inversion is a real correctness trap gated on the P0 health signal + baseline |
| Research | 8/20 | Mechanism CONFIRMED (iter-003 F5/F7); the "~13%" magnitude is UNKNOWN until baseline-measured |
| **Total** | **34/70** | **Level 2** (single correctness/degrade unit + P0 prerequisite; no schema migration) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the measured confidence delta when `graph_causal` is runtime-empty (REQ-001)? The "~13%" is unsourced and must be measured before any number is quoted [CONFIRMED: roadmap.md:218].
- Where should the lane-health flag live — keyed on the registry (`lane-registry.ts`) or computed inline per call in `fusion.ts`? iter-016 notes the per-lane health signal "collapses to identical workspace-wide totals when `laneAttributionBySkill` is empty", so the signal must be call-scoped, not aggregate [CONFIRMED: iter-016 J16-01 key note].
- Should `runtime_degraded` be driven only by `graph_causal` rebuild state, or generalized to any lane that can be transiently empty (e.g. `semantic_shadow` when embeddings are reloading)? Pass-1 evidence is `graph_causal`-specific; generalization is INFERRED.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Research evidence**: `../research/research.md` (Internal Baseline `liveTotal skew`; Broadening Addendum), `../research/iterations/iteration-003.md` (Q6 F5/F7, C5, C5a), `../research/iterations/iteration-014.md` (G14-03 lane-health gap), `../research/iterations/iteration-016.md` (J16-01 build sequence, "~13% asserted")
- **Deltas**: `../research/deltas/iter-003.jsonl` (F5/F7, C5, C5a), `../research/deltas/iter-004.jsonl` (AMB rank 9), `../research/deltas/iter-016.jsonl` (J16-01)
- **Roadmap**: `../../research/roadmap.md` (C5 row :90, C5a row :91; degrade-spine §; "~13% unsourced" :218,262)
- **Synthesis**: `../../research/synthesis/01-go-candidates.md` (C5 not-a-free-fix caveat :103; Advisor C4/C5 :59)
- **Parent spec**: `../spec.md`
- **Wave-0 shipped record (evidence none done)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (no advisor row) + line 106 (C5 NO-GO until baseline + lane-health signal)
<!-- /ANCHOR:related-docs -->
