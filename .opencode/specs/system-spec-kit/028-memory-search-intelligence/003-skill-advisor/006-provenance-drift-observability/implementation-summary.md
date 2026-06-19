---
title: "Implementation Summary: Skill Advisor — Provenance Self-Boost Guard, Attested Baseline Drift & Skip-Never-Fabricate"
description: "Three deferred observability/integrity refinements held as documented, evidence-cited PENDING candidates. No code shipped: the self-boost guard is a scoped generalization of two existing penalties, and the attested-baseline drift sweep plus the skip-never-fabricate taxonomy both ride a durable cross-session calibration substrate the tmpdir JSONL lacks (shared with Deep-Loop 028/004)."
trigger_phrases:
  - "advisor provenance drift summary"
  - "SA self boost guard implementation summary"
  - "SA attested baseline drift state"
  - "SA skip never fabricate state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/006-provenance-drift-observability"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author SA-self-boost/drift/skip deferred-plan impl doc (all PENDING)"
    next_safe_action: "Hold until the durable calibration substrate (shared with 028/004) lands"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-006-provenance-drift-observability"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-memory-search-intelligence/003-skill-advisor/006-provenance-drift-observability |
| **Completed** | N/A — deferred plan authored 2026-06-19; no candidate shipped |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No calibration or scorer code shipped. This sub-phase captures three observability/integrity refinements the iter-8 mining of aionforge `cross-family-guard.md` + `drift.md` surfaced — two orthogonal NET-NEW families the fusion-math roadmap never touches (provenance-contamination, temporal-drift) plus a skip-reason taxonomy enrich — and that Round-E verification (iter-012) then deliberately softened to PARTIAL/CAUTION. The deliverable is the deferred plan: a problem statement, a per-candidate gate, and the one shared blocker that holds two of the three — a durable cross-session calibration substrate the current tmpdir JSONL window lacks. None of the three appears in the 030 Wave-0 shipped record (`git log 1ecc531431..ab5459fb6d` has no advisor/self-boost/drift/fabricate/signalReason/provenance commit; 030 §14 covers only the Memory, Code-Graph, and Deep-Loop Wave-0 candidates).

### SA-author-self-boost-guard — provenance self-recommendation guard (PENDING, scope-correction gate)

The mined framing was a blanket "a producer must not score off its own authored content." Round-E REFUTED that as over-broad: every skill scoring off its own authored signals IS the `explicit_author` lane working as designed (`explicit.ts:318-320` pushes `author:${phrase}` evidence; `:327` returns it as the lane score), so a blanket guard neuters it. The ONE real self-recommendation vector — the advisor recommending ITSELF — is already mitigated by two hardcoded penalties (`readOnlyExplainerFloor` at `fusion.ts:134`; `auditRecsAdvisorPenalty` at `fusion.ts:313`). The actionable scope is to GENERALIZE those two ad-hoc penalties into one principled producer-vs-scored-skill guard at the dedup/rank seam (`fusion.ts:173,464`), firing only on the self-recommendation vector. It needs no durable substrate, so it is the least-blocked of the three — but low-priority, because the real vector is already handled.

### SA-attested-baseline-drift-sweep — shadow-path drift sweep (PENDING, shared-infra-dep gate)

The calibration estimator recomputes its threshold/lane signals live every call with NO persisted baseline (`reduceAdvisorFeedbackCalibration` at `feedback-calibration.ts:154`; `thresholdSignals` at `:193-203`). The net-new is an attested (versioned/committed) baseline plus a drift sweep that scores `drift = clamp01(cos(baseline, anchor) − cos(current, anchor))` and NEVER auto-rebaselines (anti drift-laundering — a drifting system must not move its own reference). The "never auto-rebaseline" property already holds for live behavior — the guardrails are `{defaultOff, shadowOnly, liveWeightsFrozen, autoPromotion:false, heldOutValidationRequired}` (`feedback-calibration.ts:230-237`) — so the genuine work is the attested baseline for the SHADOW path, gated on moving the record root off the ephemeral `tmpdir()` 50-record window (`:25-26,248-251`) onto the durable substrate. The mined companion SA-anti-flap-warning-dedup was REFUTED as a standalone (no warning-id/epoch/decile scheme or emitter exists in the advisor, iter-012 E12-04); only its content-addressed dedup discipline survives, applied to the NEW drift gauge this candidate introduces so a stable drift state does not re-flap.

### SA-skip-never-fabricate — named-skip taxonomy enrich (PENDING, shared-infra-dep gate)

The estimator already abstains conservatively — `signalReason()` returns `low_sample_excluded` / `sample_concentration_excluded` / `no_lane_attribution_excluded` / `supported_shadow_candidate` (`feedback-calibration.ts:125-130`) and a non-supported reason collapses the lane to `'excluded'` (`:171-172`). The net-new is to ENRICH that taxonomy with the named drift-skip reasons (`baselines_needed`, `stale_model` / stale-embedder-space, `awaiting_first_behavior`, `thin`) so a not-yet-calibratable lane reports WHY it was skipped instead of silently collapsing — and is NEVER forced to a max score or a fabricated alarm. It is the small leading edge (enum-only), but the new reasons only have meaning once the attested-baseline path exists, so it rides the same durable substrate.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md` | Created | Problem, scope, REQ-001..007, per-candidate PENDING status + gate, REFUTED out-of-scope items |
| `plan.md` | Created | Substrate-first sequencing, affected-surface inventory, rollback, phase deps |
| `tasks.md` | Created | T001-T011 breakdown, all PENDING/blocked with cited evidence |
| `checklist.md` | Created | Level-2 verification checklist (planning items checked; build/test items gate on promotion) |
| `implementation-summary.md` | Created | This deferred-plan summary |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts` | Unchanged (deferred) | Target for SA-skip-never-fabricate (`signalReason()` enum) + SA-attested-baseline-drift-sweep (attested baseline + drift sweep; move record root off tmpdir) when promoted |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Unchanged (deferred) | SA-author-self-boost-guard target — thread producer identity through the `author:` evidence path |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Unchanged (deferred) | SA-author-self-boost-guard target — generalize the two self-rec penalties (`:134,313`) into one producer-vs-scored guard |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

This is a re-plan, not an implementation. The deferred plan was authored from the Skill Advisor research campaign — iter-008 (the 6 NET-NEW contamination/drift candidates), iter-011 (the galadriel-advisor residue all REFUTED), and iter-012 (Round-E verify, which softened all three of these candidates) — plus the deltas `iter-008.jsonl` (the three candidate rows) and `iter-012.jsonl` (E12-01/E12-03/E12-04). The seam citations were re-confirmed live before authoring: the two self-rec penalties (`fusion.ts:134,313`), the `author:${phrase}` push + symmetric lane score (`explicit.ts:320,327`), the `signalReason()` taxonomy (`feedback-calibration.ts:125-130`, now three exclude-reasons — richer than the iter-8 "two only" snapshot but still lacking the drift-specific distinctions), the live `thresholdSignals` recompute (`:193-203`), the shadow guardrails (`:230-237`), and the ephemeral tmpdir record root (`:25-26,248-251`). The all-PENDING status was cross-checked against the 030 Wave-0 shipped record (§14 candidate-status table has no SA-* row; the commit range carries no matching commit), confirming nothing here is already done.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep all three candidates PENDING; ship no code | Two of the three ride a durable calibration substrate that does not exist yet (the live store is an ephemeral tmpdir 50-record window); the third is a scoped generalization that is already mitigated for its real vector. Speculative implementation would either build on a substrate that is not there or harden a path that is already handled. |
| Scope SA-author-self-boost-guard to GENERALIZING two penalties, NOT a blanket guard | Round-E proved the blanket framing neuters the by-design `explicit_author` symmetry (every skill scoring off its own authored signals is correct). The only real vector is the advisor recommending itself, already mitigated by `readOnlyExplainerFloor` + `auditRecsAdvisorPenalty`; the guard generalizes those, nothing wider. |
| Gate the attested-baseline drift sweep on durable storage, co-owned with 028/004 | An attested baseline must survive across sessions to mean anything; the tmpdir 50-record window cannot hold one. The durable substrate is the same one the C4 shadow-promotion seam (sibling 004) needs — build it once, do not fork a second store. |
| NEVER auto-rebaseline the drift sweep | A drifting system that silently moves its own reference point launders its drift away. The baseline is an attested asset, updated only by an explicit re-attestation event, never by the running system. |
| Do NOT build SA-anti-flap-warning-dedup as a standalone | It was REFUTED — no warning-id/epoch/decile scheme or emitter exists in the advisor (mis-mined from another subsystem). Only its content-addressed dedup discipline survives, applied to the one real emitter (the new drift gauge). |
| Make SA-skip-never-fabricate never force a max/alarm | A lane that cannot be calibrated must be NAMED-skipped, not assigned a fabricated high-confidence value. Naming the reason (`baselines_needed`/`stale_model`/`awaiting_first_behavior`/`thin`) keeps the shadow signal honest. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on this sub-phase | PASS expected after spec/plan/tasks/checklist/implementation-summary land (the FILE_EXISTS error was the 2 missing Level-2 files) |
| Live seam citations (`fusion.ts:134,313`; `explicit.ts:320,327`; `feedback-calibration.ts:25,125-130,171,193-203,230-237`) | PASS — all read directly 2026-06-19; `signalReason()` confirmed to carry three exclude-reasons today (richer than the iter-8 snapshot) |
| Tmpdir/ephemeral record root (the shared blocker) | PASS — `RECORD_ROOT = join(tmpdir(), ...)` (`:25`), `MAX_RECORDS=50` (`:26`), `existing.slice(-MAX_RECORDS)` (`:248-251`) confirm no durable cross-session state |
| Shadow guardrails (anti-rebaseline already holds for live) | PASS — `{defaultOff, shadowOnly, liveWeightsFrozen, autoPromotion:false}` at `:230-237` |
| Cited research iterations / deltas exist | PASS — iteration-008/011/012 + deltas iter-008/iter-012 all present |
| 030 Wave-0 cross-check (none done) | PASS — §14 has no SA-* row; commit range has no matching commit |
| Code shipped | NONE — all three candidates PENDING by design |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **All three candidates are unbuilt.** The calibration + scorer behave exactly as today. This sub-phase adds no default-on behavior; the drift sweep, when built, is default-off and shadow-only.
2. **Two of the three are blocked on infrastructure this sub-phase does not own.** SA-attested-baseline-drift-sweep and SA-skip-never-fabricate need the durable calibration substrate built under sibling `004-c4-shadow-seam-beta-posterior`; co-own it, do not fork a second store (REQ-005).
3. **SA-author-self-boost-guard is low-priority.** The real self-recommendation vector is already mitigated by the two existing penalties; the guard generalizes them for principled-ness, not to fix an open bug. It must NOT be shipped as a blanket guard (REQ-002/REQ-007).
4. **The stale-embedder-space signal is undefined.** `stale_model` needs an embedder-model id stamped on the attested baseline to compare against the live embedder; that schema is owned by the durable-substrate design (028/004) and is open.
5. **SA-anti-flap as a standalone, SA-family-normalization hard-collapse, and the galadriel residue are REFUTED.** They are recorded out-of-scope (spec §3) so they are not silently re-mined; only the anti-flap dedup discipline survives, scoped onto the new drift gauge.
6. **No leaf `graph-metadata.json`.** Like sibling 004, this leaf sub-phase has no graph-metadata file; the parent `003-skill-advisor` owns the graph. The validator surfaces this as a non-blocking pass only.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
