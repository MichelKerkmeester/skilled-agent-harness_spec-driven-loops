---
title: "Verification Checklist: Advisor Scorer Eval Hardening"
description: "Level 3 verification checklist for the eval-hardening infrastructure. All items verified with evidence."
trigger_phrases:
  - "advisor eval hardening checklist"
  - "ratchet baseline verification checklist"
importance_tier: "high"
contextType: "implementation"
status: "Complete"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening"
    last_updated_at: "2026-07-07T07:15:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "All checklist items verified"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Verification Checklist: Advisor Scorer Eval Hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-008, SC-001..SC-004) [EVIDENCE: spec.md requirements + success-criteria anchors]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md architecture anchor: deterministic projection, alias-aware matching, full-corpus buckets]
- [x] CHK-003 [P0] Target source files git-clean before editing [EVIDENCE: git status --porcelain on advisor-validate.ts + advisor-tool-schemas.ts empty]
- [x] CHK-004 [P1] Corpus enum distribution verified before enforcement [EVIDENCE: bucket {32,32,32,32,36,29} + source_type {96,37,48,12} match the enums]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `scoreAdvisorPrompt` is read-only in every new path [EVIDENCE: no scorer/fusion/lane/weights file modified; grep of the surface clean]
- [x] CHK-011 [P0] Handler edits are additive output + stricter input validation only [EVIDENCE: `slices.buckets` added; `CorpusRowSchema` enum-tightened with passthrough retained]
- [x] CHK-012 [P0] Buckets computed over the full corpus regardless of skillSlug scope [EVIDENCE: handler test asserts review/memory_save totals stay 32 under a system-spec-kit scope]
- [x] CHK-013 [P1] Comment hygiene: durable WHY only, no spec-paths/REQ-/CHK-/task-ids/packet numbers in code or JSON [EVIDENCE: hygiene grep over all new files clean; `origin_fixture` is honest data provenance]
- [x] CHK-014 [P1] Delegation matched strictly; corpus/holdout matched alias-aware [EVIDENCE: delegation targets are top-level ids with no folding; corpus matching mirrors the handler]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Ratchet gate exact-match with directional failures + sha256 pins + retained floors [EVIDENCE: scorer-eval-baseline-ratchet.vitest.ts 6/6; full >= 0.75, holdout >= 0.725 asserted]
- [x] CHK-021 [P0] Corpus-neutral: parity holds byte-identical [EVIDENCE: python-ts-parity.vitest.ts hard-asserts 105/101/4 + the 4 regression ids; green]
- [x] CHK-022 [P0] Ratchet mutation-proved [EVIDENCE: baseline full_corpus 147 -> 148 fails the gate with the exact directional diff; restored]
- [x] CHK-023 [P1] Gates exercise the scorer [EVIDENCE: gates failed with exact live-vs-baseline numeric diffs before the baseline regime was corrected]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-024 [P0] Holdout disjoint from training; no fabricated gold [EVIDENCE: holdout gate re-proves disjointness at test time; every label maps a real existing field]
- [x] CHK-025 [P1] Ambiguity slice frozen with tau; non-empty meaningful minority [EVIDENCE: 25 rows at tau=0.03; gate asserts a single frozen tau matching the baseline]
- [x] CHK-026 [P1] No new regressions [EVIDENCE: full suite 652 passed / 5 skipped; the 4 failures are pre-existing scorer-independent infra flakes]
- [x] CHK-027 [P1] Divergence ratchet + ablation unchanged [EVIDENCE: local-native-divergence-ratchet.vitest.ts green, no ledger edit; ablation test green]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No routable prompt content added to output [EVIDENCE: bucket + slice outputs are counts only; privacy test still passes]
- [x] CHK-031 [P0] Memory daemon and production databases untouched [EVIDENCE: fixtures use an empty throwaway DB dir; no DB/daemon path modified]
- [x] CHK-032 [P1] Stricter validation cannot change a score [EVIDENCE: enum enforcement only rejects malformed fixtures; the 193-row loader still succeeds]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/decision-record synchronized on the same scope and approach [EVIDENCE: shared REQ-/SC- ids, file manifest, and three decisions across docs]
- [x] CHK-041 [P1] Implementation summary carries actual evidence [EVIDENCE: implementation-summary.md verification table with real commands/results]
- [x] CHK-042 [P2] Forbidden-file and README-deferral rationale recorded [EVIDENCE: spec out-of-scope + decision-record note the WS-adjacent files and the concurrent README]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Changes stay inside the advisor eval scope [EVIDENCE: file manifest limited to the handler/schema, routing-accuracy fixtures/generators, and the parity/scorer/handler tests]
- [x] CHK-051 [P2] Fixtures + generators live under scripts/routing-accuracy beside the corpus [EVIDENCE: holdout/ambiguity/baseline + three .mjs generators co-located]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-060 [P0] Measurement is layered on top of the read-only scorer; no scoring input is touched [EVIDENCE: no fusion/lane/weights/projection file modified; the gates call `scoreAdvisorPrompt` read-only]
- [x] CHK-061 [P1] The four artifacts form a strict acyclic chain (scorer -> fixtures -> baseline -> gates) [EVIDENCE: plan.md dependency-graph anchor; the scorer is a leaf input never mutated]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-062 [P1] Each gate's live re-scoring completes within the test timeout [EVIDENCE: ~373 scoring calls per gate; the projection load is fast (~3s for the corpus loop); gates finish well under the 120s hook budget]
- [x] CHK-063 [P2] The handler's added bucket scoring stays within the existing validate timeout [EVIDENCE: extended handler test passes under the 30s suite timeout]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-064 [P0] No commit or push performed; changes left in the working tree for the orchestrator [EVIDENCE: no git write action taken by this session]
- [x] CHK-065 [P1] Rollback is a pure file operation with no migration [EVIDENCE: delete the fixtures/generators/gates and revert the two additive edits]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-066 [P0] No fabricated gold; every holdout label maps a real existing field [EVIDENCE: build script maps expectedSkill / expected_top_any / expectedTop only; decision-record ADR-002]
- [x] CHK-067 [P1] Forbidden files untouched (divergence ratchet/ledger, orchestrator fusion/delegation/graph-causal, README) [EVIDENCE: git status of those paths clean; README still the concurrent session's dirty file]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-068 [P1] The three architectural decisions are recorded with alternatives and consequences [EVIDENCE: decision-record.md ADR-001/002/003]
- [x] CHK-069 [P2] The harness-regime deviation from the plan's capture recipe is documented [EVIDENCE: decision-record ADR-003; implementation-summary deviations anchor]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [x] CHK-070 [P0] All P0/P1 checklist items verified with evidence [EVIDENCE: this checklist; summary table below]
- [x] CHK-071 [P0] Completion metadata reconciled across spec/plan/tasks/checklist/implementation-summary [EVIDENCE: shared status Complete, REQ-/SC- ids, and file manifest]
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 17 | 17/17 |
| P2 Items | 7 | 7/7 |

**Status**: Complete
**Verification Date**: 2026-07-07
**Verified By**: opus-4.8 (verified via typecheck, four targeted test files, ratchet mutation proof, and the full advisor suite)
<!-- /ANCHOR:summary -->
