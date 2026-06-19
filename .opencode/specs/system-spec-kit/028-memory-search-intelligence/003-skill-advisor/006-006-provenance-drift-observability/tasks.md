---
title: "Tasks: Skill Advisor — Provenance Self-Boost Guard, Attested Baseline Drift & Skip-Never-Fabricate"
description: "Task Format: T### [P?] Description (file path). Substrate-first, all candidates deferred. All tasks PENDING — none of SA-author-self-boost-guard / SA-attested-baseline-drift-sweep / SA-skip-never-fabricate shipped in 030 Wave-0."
trigger_phrases:
  - "advisor provenance drift tasks"
  - "SA self boost guard tasks"
  - "SA attested baseline drift tasks"
  - "SA skip never fabricate tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/006-006-provenance-drift-observability"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author SA-self-boost/drift/skip deferred-observability task breakdown (re-plan; all PENDING)"
    next_safe_action: "Verify each gate (T001-T002) before implementing any candidate"
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
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Skill Advisor — Provenance Self-Boost Guard, Attested Baseline Drift & Skip-Never-Fabricate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

**Status:** All tasks PENDING — none of SA-author-self-boost-guard / SA-attested-baseline-drift-sweep / SA-skip-never-fabricate shipped in 030 Wave-0 (`git log 1ecc531431..ab5459fb6d` has no advisor/self-boost/drift/fabricate/signalReason/provenance commit; 030 §14 candidate-status table covers only Memory/Code-Graph/Deep-Loop Wave-0 candidates, no SA-* row). Each candidate is PENDING with its gate: SA-author-self-boost-guard = `scope-correction` (generalize 2 penalties, not a blanket guard; no substrate needed but low-priority); SA-attested-baseline-drift-sweep = `shared-infra-dep` (durable calibration substrate, co-owned with 028/004); SA-skip-never-fabricate = `shared-infra-dep` (same substrate — the drift-skip reasons only have meaning once the attested-baseline path exists).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Confirm the durable calibration substrate status under the sibling `004-004-c4-shadow-seam-beta-posterior` — SA-attested-baseline-drift-sweep + SA-skip-never-fabricate both ride it; both stay BLOCKED while the record root is still the ephemeral `tmpdir()` 50-record window (`../004-004-c4-shadow-seam-beta-posterior/spec.md`; `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts:25-26,248-251`) — REQ-005 [evidence: iter-008 "both need durable cross-session state the tmpdir JSONL lacks"; iter-012 E12-03]
- [ ] T002 Re-confirm the SA-author-self-boost-guard scope-correction: the two penalties to GENERALIZE are `readOnlyExplainerFloor` (`fusion.ts:134`) + `auditRecsAdvisorPenalty` (`fusion.ts:313`); a blanket "no skill scores off its own authored content" guard is REJECTED (neuters the by-design `explicit_author` symmetry at `explicit.ts:327`) (`mcp_server/lib/scorer/fusion.ts:134,313`; `lanes/explicit.ts:327`) — REQ-002 [evidence: iter-012 E12-01]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 SA-author-self-boost-guard (scope-correction ready; no substrate needed, low-priority): thread producer identity through the `author:${phrase}` evidence path and GENERALIZE the two hardcoded penalties into one producer-vs-scored-skill guard at the dedup/rank seam, firing ONLY on the self-recommendation vector; leave every other skill's `explicit_author` self-scoring unchanged (`mcp_server/lib/scorer/lanes/explicit.ts:318-320,327`; `mcp_server/lib/scorer/fusion.ts:134,173,313,464`) — REQ-002/REQ-007 [evidence: iter-008; iter-012 E12-01]
- [ ] T004 [B] SA-skip-never-fabricate (gated on the durable substrate): extend `signalReason()` with the named drift-skip reasons `baselines_needed` / `stale_model` (stale-embedder-space) / `awaiting_first_behavior` / `thin`; a non-calibratable lane reports the specific named reason and is excluded — NEVER forced to a max score or a fabricated alarm (`mcp_server/lib/scorer/feedback-calibration.ts:125-130,171-172`) — REQ-004 [evidence: iter-008 delta; drift.md score-threshold-sweep]
- [ ] T005 [B] SA-attested-baseline-drift-sweep (gated on the durable substrate): move the record root off `tmpdir()` onto the durable store, add an attested (versioned/committed) baseline read + a shadow-path drift sweep `drift = clamp01(cos(baseline,anchor) − cos(current,anchor))` beside the live `thresholdSignals` recompute, behind the existing guardrails; NEVER auto-rebaseline (anti drift-laundering); emit a content-addressed drift gauge so a stable drift state does not re-flap (reuse only the anti-flap dedup discipline, NOT the refuted standalone) (`mcp_server/lib/scorer/feedback-calibration.ts:25-26,193-203,230-237`) — REQ-003/REQ-006 [evidence: iter-008 delta; iter-012 E12-03/E12-04; drift.md baseline-is-the-asset]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 [P] SA-author-self-boost-guard fixtures: the generalized guard reproduces both prior penalty behaviors AND fires on the broader self-recommendation vector; byte-identical for every non-self skill's `explicit_author` contribution (the by-design symmetry is intact) (`mcp_server/tests/*.vitest.ts`) — SC-002/REQ-007
- [ ] T007 [P] SA-attested-baseline-drift-sweep fixtures: the drift sweep scores `clamp01(cos(base,anchor)−cos(cur,anchor))` against an attested baseline, NEVER auto-rebaselines, and stays shadow-only with live weights frozen; the content-addressed gauge no-ops on a stable drift state (anti-flap) and only re-emits on decile/threshold escalation (`mcp_server/tests/*.vitest.ts`) — SC-002/REQ-003/REQ-006
- [ ] T008 [P] SA-skip-never-fabricate fixtures: every named reason (`baselines_needed`/`stale_model`/`awaiting_first_behavior`/`thin`) excludes the lane with that reason; NEVER a forced max score or a fabricated alarm (`mcp_server/tests/*.vitest.ts`) — SC-002/REQ-004
- [ ] T009 Default-inert / shadow-only regression: with each gate unmet, calibration + scorer output matches today's baseline exactly — the drift sweep is default-off, the skip enum is unused, and the self-boost guard leaves the 2 existing penalties in place (`mcp_server/tests/*.vitest.ts`) — SC-001
- [ ] T010 Substrate-backed integration: the attested baseline survives a session restart (no longer in `tmpdir`) and the enriched skip reasons persist across sessions (`mcp_server/tests/*.vitest.ts`) — REQ-005
- [ ] T011 `tsc` + advisor test suite green; independent adversarial review refuting a blanket self-boost guard, a self-laundering (auto-rebaselining) drift sweep, and a fabricated skip alarm — DoD
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (or explicitly deferred with the gate recorded)
- [ ] No `[B]` blocked tasks remaining once the durable substrate (028/004) lands
- [ ] Gate discipline held: the self-boost guard generalizes (never blankets) the 2 penalties (T002); drift + skip not shipped before the durable substrate exists (T001); SA-anti-flap NOT built standalone (only its dedup discipline rides the new gauge, T005)
- [ ] Verification passed for every promoted candidate (self-boost fires only on the self-rec vector; drift never auto-rebaselines + anti-flaps; skip never fabricates; default-inert/shadow-only otherwise)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research evidence**: `../research/iterations/iteration-008.md` (the 6 NET-NEW contamination/drift candidates), `../research/iterations/iteration-011.md` (galadriel-advisor residue all REFUTED), `../research/iterations/iteration-012.md` (Round-E verify: self-boost scope-correction, attested-baseline shadow + durable-storage gate, anti-flap NO-GO)
- **Deltas**: `../research/deltas/iter-008.jsonl` (the 3 candidate rows), `../research/deltas/iter-012.jsonl` (E12-01/E12-03/E12-04)
- **Sibling sub-phase (shared substrate dep)**: `../004-004-c4-shadow-seam-beta-posterior/spec.md` (the durable calibration substrate these ride)
- **Wave-0 shipped record (none done)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (no SA-* row)
<!-- /ANCHOR:cross-refs -->
