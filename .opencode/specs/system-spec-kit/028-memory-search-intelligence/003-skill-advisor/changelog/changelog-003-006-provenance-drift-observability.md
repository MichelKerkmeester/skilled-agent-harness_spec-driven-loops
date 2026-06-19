---
title: "Changelog: Skill Advisor — Provenance Self-Boost Guard, Attested Baseline Drift & Skip-Never-Fabricate [003-skill-advisor/006-provenance-drift-observability]"
description: "Chronological changelog for the Skill Advisor — Provenance Self-Boost Guard, Attested Baseline Drift & Skip-Never-Fabricate phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/006-provenance-drift-observability` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor`

### Summary

One scorer candidate shipped. SA-author-self-boost-guard now has a default-off implementation behind SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD: explicit-author scoring can carry producer identity when the guard path asks for it, fusion centralizes the advisor self-recommendation guard, and default scorer behavior remains byte-identical with the flag unset. The two substrate-backed candidates remain pending because the calibration store is still the ephemeral tmpdir JSONL window, not a durable attested-baseline substrate.

### Added

- No new additions recorded.

### Changed

- Confirm the durable calibration substrate status under the sibling 004-c4-shadow-seam-beta-posterior — SA-attested-baseline-drift-sweep + SA-skip-never-fabricate both ride it; both stay BLOCKED while the record root is still the ephemeral tmpdir() 50-record window (../004-c4-shadow-seam-beta-posterior/spec.md; .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts:25-26,248-251) — REQ-005
- Default-inert / shadow-only regression: with each gate unmet, calibration + scorer output matches today's baseline exactly — the drift sweep is default-off, the skip enum is unused, and the self-boost guard leaves the 2 existing penalties in place (mcp_server/tests/*.vitest.ts) — SC-001
- CHK-001 Requirements documented in spec.md (REQ-001..007 with per-candidate gates) — evidence: spec.md §4
- CHK-040 Spec/plan/tasks synchronized (self-boost DONE default-off; drift/skip PENDING with substrate gate; REFUTED out-of-scope items retained)
- CHK-041 Code comments adequate (durable WHY; no spec-path/packet ids in comments — comment-hygiene) — evidence: changed-code rg spot check returned no matches

### Fixed

- Re-confirm the SA-author-self-boost-guard scope-correction: the two penalties to GENERALIZE are readOnlyExplainerFloor (fusion.ts:134) + auditRecsAdvisorPenalty (fusion.ts:313); a blanket "no skill scores off its own authored content" guard is REJECTED (neuters the by-design explicit_author symmetry at explicit.ts:327) (mcp_server/lib/scorer/fusion.ts:134,313; lanes/explicit.ts:327) — REQ-002
- SA-author-self-boost-guard (scope-correction ready; no substrate needed, low-priority): thread producer identity through the author:${phrase} evidence path and GENERALIZE the two hardcoded penalties into one producer-vs-scored-skill guard at the dedup/rank seam, firing ONLY on the self-recommendation vector; leave every other skill's explicit_author self-scoring unchanged (mcp_server/lib/scorer/lanes/explicit.ts:318-320,327; mcp_server/lib/scorer/fusion.ts:134,173,313,464) — REQ-002/REQ-007
- [P] SA-author-self-boost-guard fixtures: the generalized guard reproduces both prior penalty behaviors AND fires on the broader self-recommendation vector; byte-identical for every non-self skill's explicit_author contribution (the by-design symmetry is intact) (mcp_server/tests/*.vitest.ts) — SC-002/REQ-007
- CHK-002 Technical approach defined in plan.md (substrate-first sequencing; Phases 1-3; affected-surface inventory) — evidence: plan.md §3-4, FIX ADDENDUM
- CHK-003 Dependencies identified (durable calibration substrate shared with 028/004 for drift + skip; scope-correction for the self-boost guard; REFUTED items recorded out-of-scope) — evidence: plan.md §6, spec.md §3/§6
- CHK-010 Code passes lint/format/tsc checks (per promoted candidate) — evidence: npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck passed with 0 errors

### Verification

- npm run typecheck - PASS — 0 TypeScript errors
- Focused Vitest - PASS — tests/scorer/provenance-self-boost-guard.vitest.ts 5 tests passed
- Broad related Vitest - 119 passed / 2 skipped / 2 failed across 18 files; the 2 failures are pre-existing parity failures also present at baseline (rr-iter2-060, expected 62 preserved vs actual 61)
- OpenCode alignment drift - PASS — 37 files scanned, 0 findings
- Comment hygiene spot check - PASS — no ADR/REQ/CHK/spec-path strings in changed code files
- validate.sh --strict on this sub-phase - PASS after packet docs were updated
- Live seam citations (fusion.ts:134,313; explicit.ts:320,327; feedback-calibration.ts:25,125-130,171,193-203,230-237) - PASS — all read directly 2026-06-19; signalReason() confirmed to carry three exclude-reasons today (richer than the iter-8 snapshot)
- Tmpdir/ephemeral record root (the shared blocker) - PASS — RECORD_ROOT = join(tmpdir(), ...) (:25), MAX_RECORDS=50 (:26), existing.slice(-MAX_RECORDS) (:248-251) confirm no durable cross-session state

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Created | Problem, scope, REQ-001..007, per-candidate PENDING status + gate, REFUTED out-of-scope items |
| `plan.md` | Created | Substrate-first sequencing, affected-surface inventory, rollback, phase deps |
| `tasks.md` | Created | T001-T011 breakdown, all PENDING/blocked with cited evidence |
| `checklist.md` | Created | Level-2 verification checklist (planning items checked; build/test items gate on promotion) |
| `implementation-summary.md` | Created | This deferred-plan summary |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts` | Unchanged (deferred) | Target for SA-skip-never-fabricate + SA-attested-baseline-drift-sweep when the durable substrate exists |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/types.ts` | Modified | Optional producer identity on lane matches |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts` | Modified | Producer identity is threaded only when requested by the default-off guard path |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modified | Adds SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD and the centralized self-recommendation guard |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/provenance-self-boost-guard.vitest.ts` | Created | Default-off, flag-on, non-advisor byte-equivalence, and advisor audit penalty fixtures |

### Follow-Ups

- CHK-011 No console errors or warnings; existing advisor calibration + scorer suite green
- CHK-012 Error handling implemented (calibration store unreadable → baselines_needed named-skip; embedder change → stale_model; never a fabricated alarm)
- CHK-013 Code follows advisor patterns (self-boost guard generalizes the existing penalties at fusion.ts:134,313; drift sweep sits beside the live thresholdSignals recompute feedback-calibration.ts:193-203 behind the :230-237 guardrails; skip enum extends signalReason() :125-130)
- CHK-020 All acceptance criteria met when promoted (SC-001 status explicit; SC-002 each honors its invariant; SC-003 the shared-substrate dependency on 028/004 explicit) — partial: self-boost met, drift/skip deferred
- CHK-022 Edge cases tested (no attested baseline → baselines_needed, no drift score; self-rec vector absent → self-boost guard a no-op; embedder change → stale_model; stable drift → gauge no-ops/anti-flap)
- CHK-023 Error scenarios validated (calibration store mid-rotation → named-skip not alarm; non-self producer scored for its own content → self-boost guard does NOT fire; baseline never auto-rebaselines)
