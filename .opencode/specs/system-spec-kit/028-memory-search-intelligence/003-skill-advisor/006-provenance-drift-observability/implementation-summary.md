---
title: "Implementation Summary: Skill Advisor — Provenance Self-Boost Guard, Attested Baseline Drift & Skip-Never-Fabricate"
description: "SA-author-self-boost-guard shipped as a default-off scorer refinement behind SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD. SA-attested-baseline-drift-sweep and SA-skip-never-fabricate remain documented PENDING candidates behind the durable cross-session calibration substrate the tmpdir JSONL lacks."
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
    recent_action: "Implemented default-off self-boost guard"
    next_safe_action: "Await durable calibration substrate"
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
    completion_pct: 34
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
| **Completed** | Partial — SA-author-self-boost-guard shipped default-off; drift/skip remain pending |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One scorer candidate shipped. SA-author-self-boost-guard now has a default-off implementation behind `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`: explicit-author scoring can carry producer identity when the guard path asks for it, fusion centralizes the advisor self-recommendation guard, and default scorer behavior remains byte-identical with the flag unset. The two substrate-backed candidates remain pending because the calibration store is still the ephemeral tmpdir JSONL window, not a durable attested-baseline substrate.

### SA-author-self-boost-guard — provenance self-recommendation guard (DONE, default-off)

Implemented as a guarded scorer refinement, not a blanket penalty. The explicit-author lane accepts an optional producer-identity mode and leaves its default output unchanged. Fusion reads that provenance only when `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` is enabled, applies the self-recommendation guard to advisor aliases, and keeps non-advisor `explicit_author` routing byte-identical. The existing default path still preserves the current `readOnlyExplainerFloor` and `auditRecsAdvisorPenalty` behavior.

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
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts` | Unchanged (deferred) | Target for SA-skip-never-fabricate + SA-attested-baseline-drift-sweep when the durable substrate exists |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/types.ts` | Modified | Optional producer identity on lane matches |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Modified | Producer identity is threaded only when requested by the default-off guard path |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modified | Adds `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` and the centralized self-recommendation guard |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/provenance-self-boost-guard.vitest.ts` | Created | Default-off, flag-on, non-advisor byte-equivalence, and advisor audit penalty fixtures |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation followed the Round-E correction: generalize only the advisor self-recommendation vector and preserve normal skill self-authored evidence. Drift and skip were deliberately left untouched after confirming the calibration store still uses `tmpdir()` plus a 50-record cap. The 030 Wave-0 record remains historical context only; this turn implemented the first 028/003/006 scorer candidate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Ship only SA-author-self-boost-guard | It needs no durable substrate and can be made byte-identical by default behind a flag. Drift and skip still ride storage that does not exist yet. |
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
| `npm run typecheck` | PASS — 0 TypeScript errors |
| Focused Vitest | PASS — `tests/scorer/provenance-self-boost-guard.vitest.ts` 5 tests passed |
| Broad related Vitest | 119 passed / 2 skipped / 2 failed across 18 files; the 2 failures are pre-existing parity failures also present at baseline (`rr-iter2-060`, expected 62 preserved vs actual 61) |
| OpenCode alignment drift | PASS — 37 files scanned, 0 findings |
| Comment hygiene spot check | PASS — no ADR/REQ/CHK/spec-path strings in changed code files |
| `validate.sh --strict` on this sub-phase | PASS after packet docs were updated |
| Live seam citations (`fusion.ts:134,313`; `explicit.ts:320,327`; `feedback-calibration.ts:25,125-130,171,193-203,230-237`) | PASS — all read directly 2026-06-19; `signalReason()` confirmed to carry three exclude-reasons today (richer than the iter-8 snapshot) |
| Tmpdir/ephemeral record root (the shared blocker) | PASS — `RECORD_ROOT = join(tmpdir(), ...)` (`:25`), `MAX_RECORDS=50` (`:26`), `existing.slice(-MAX_RECORDS)` (`:248-251`) confirm no durable cross-session state |
| Shadow guardrails (anti-rebaseline already holds for live) | PASS — `{defaultOff, shadowOnly, liveWeightsFrozen, autoPromotion:false}` at `:230-237` |
| Cited research iterations / deltas exist | PASS — iteration-008/011/012 + deltas iter-008/iter-012 all present |
| 030 Wave-0 cross-check (none done) | PASS — §14 has no SA-* row; commit range has no matching commit |
| Code shipped | SA-author-self-boost-guard only; drift and skip left pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The shipped guard is default-off.** Live ranking remains unchanged unless `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD` is enabled.
2. **Two of the three candidates are still blocked on infrastructure this sub-phase does not own.** SA-attested-baseline-drift-sweep and SA-skip-never-fabricate need the durable calibration substrate built under sibling `004-c4-shadow-seam-beta-posterior`; co-own it, do not fork a second store (REQ-005).
3. **The guard must stay scoped.** It must NOT become a blanket "no skill scores off its own authored content" rule (REQ-002/REQ-007).
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
