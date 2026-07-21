---
title: "Verification Checklist: semantic communities"
description: "Completed verifier checklist for semantic communities and shadow concept-level novelty."
trigger_phrases:
  - "semantic communities checklist"
  - "concept-level novelty checklist"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
    last_updated_at: "2026-07-21T08:33:34Z"
    last_updated_by: "codex"
    recent_action: "Passed canonical-edge, bridge-order, rebuild, and guard checks"
    next_safe_action: "Preserve the additive-dark boundary during downstream calibration"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/semantic-communities.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Semantic Communities

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 010 child 001. The implementation verifier binds results to the exact
candidate and baseline revisions, projection model/config version, fixture-corpus digest, threshold policy, and replay fingerprint.
Every completed item records the command, exit code, observed counts or metric, and artifact path; zero fixtures, zero candidate
comparisons, silent embedding fallback, or unversioned membership is a failure.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Parent ledger, stable identity, replay fingerprint, and `depends_on: []` are pinned [evidence: `semantic-community-events.ts` compiles against all three frozen substrate APIs]
- [x] CHK-002 [P0] The labeled corpus covers paraphrases, distinct neighbors, bridge claims, evidence, isolation, and drift [evidence: `semantic-communities.vitest.ts` 16/16 pass]
- [x] CHK-003 [P1] Existing graph-growth novelty outputs and commands are captured [evidence: direct legacy parity assertions and `coverage-graph-signals.vitest.ts` pass]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] Raw text, claim ID, evidence, namespace, and ledger position remain immutable [evidence: `createSemanticClaimRecord` plus replay fixture]
- [x] CHK-005 [P0] Edges and memberships carry complete semantic version and lineage fields [evidence: `semantic-communities.vitest.ts` reversed-arrival edge and merge/split tests]
- [x] CHK-006 [P1] Retrieval and affected recomputation are bounded, isolated, deterministic, and observable [evidence: candidate cap, rescan telemetry, bridge permutations, and independent rebuild assertions]
- [x] CHK-007 [P1] Invalid scores, ambiguity, duplicates, and conflicts fail explicitly without string fallback [evidence: `semantic-communities.vitest.ts` negative admission, duplicate claim/rank, and version-collision tests]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] Equivalent paraphrases meet recall 1.0 and resolve to one community [evidence: `semantic-communities.vitest.ts` quality test passes 16/16]
- [x] CHK-009 [P0] Distinct and topical-only fixtures meet precision 1.0 and remain separate [evidence: `semantic-communities.vitest.ts` quality test passes 16/16]
- [x] CHK-010 [P0] A bridge cannot merge communities without cohesion regardless of when it arrives [evidence: `semantic-communities.vitest.ts` six-order bridge permutation test]
- [x] CHK-011 [P0] Arrival permutations retain edge and community bytes and fixed ledger replays retain full bytes [evidence: `semantic-communities.vitest.ts` identity, communities, memberships, and edges assertions]
- [x] CHK-012 [P0] Every incremental prefix equals an independent deterministic rebuild [evidence: whole-graph construction and a hand-authored expected partition]
- [x] CHK-013 [P0] Novelty emits `new_community`, `existing_community_member`, and `ambiguous` [evidence: novelty and bridge fixtures]
- [x] CHK-014 [P0] New evidence remains `new_evidence` after concept deduplication [evidence: dual-direction novelty fixture]
- [x] CHK-015 [P0] Config drift creates a new retained projection version [evidence: `semantic-communities.vitest.ts` model and threshold transition fixture]
- [x] CHK-016 [P0] Namespace fixtures produce no foreign candidates or edges [evidence: `semantic-communities.vitest.ts` isolation assertions]
- [x] CHK-017 [P1] Candidate, affected-work, quality, runtime, and drift budgets pass [evidence: `semantic-communities.vitest.ts` cap 64 and precision/recall 1.0]
- [x] CHK-018 [P0] Existing graph novelty remains unchanged and shadow-authoritative [evidence: direct legacy/window parity and 141/141 frozen tests]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-019 [P1] Every requirement maps to a task and fixture [evidence: `implementation-summary.md` verification and milestone tables]
- [x] CHK-020 [P1] No sibling-owned semantics or authority work leaked [evidence: `git diff review` contains only the sidecar, leaf test, and packet docs]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-021 [P1] No claim text is sent to a provider or written to telemetry [evidence: `semantic-community-types.ts` telemetry contains identifiers and counts only]
- [x] CHK-022 [P2] Long text, malformed Unicode, prompt-like content, and scorer failure stay bounded [evidence: canonical text and invalid-assessment negative fixtures]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-023 [P2] Schema, versioning, threshold, ambiguity, lineage, novelty, and rebuild are documented [evidence: `decision-record.md` and `implementation-summary.md`]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-024 [P1] Logic extends existing graph and ledger boundaries without a new authority [evidence: coverage adapters and `authority: legacy_coverage_graph` assertion]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision and alternatives are documented [evidence: `decision-record.md` ADR-001 is Accepted]
- [x] CHK-101 [P1] Frozen boundary integration is type checked [evidence: repository-pinned TypeScript 5.9 `tsc --noEmit -p runtime/tsconfig.json` exits 0]
- [x] CHK-102 [P1] Rollback removes only additive files [evidence: `decision-record.md` rollback requires no writer or authority reversal]
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Candidate work stays within the configured limit [evidence: `semantic-communities.vitest.ts` over-budget fixture rejects before commit]
- [x] CHK-111 [P1] Incremental work excludes unrelated components [evidence: `semantic-communities.vitest.ts` rescan telemetry omits unrelated claim]
- [x] CHK-112 [P2] Local fixture execution is recorded [evidence: 16 tests pass with Vitest exit 0]
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Runtime authority remains unchanged [evidence: `semantic-communities.vitest.ts` asserts `legacy_coverage_graph` authority]
- [x] CHK-121 [P1] Projection can be disabled by omitting the additive module [evidence: `git diff review` shows no existing writer imports]
- [x] CHK-122 [P1] Rebuild and version transition are available [evidence: typed ledger replay and historical-version fixtures]
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Scope and comment hygiene checks pass [evidence: `rg` forbidden-marker scan and `git diff review` are empty]
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Level 3 packet files carry current template markers [evidence: strict `validate.sh` is the completion gate]
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

Independent verification targets semantic quality, deterministic replay, incremental/full parity, isolation, evidence preservation,
and legacy compatibility on the scoped candidate delta.
<!-- /ANCHOR:sign-off -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, P1 checks pass or carry approved deferral evidence, the frozen corpus meets its
precision/recall gate, incremental and full rebuild outputs are identical, legacy novelty remains backward-compatible, and concept
novelty stays shadow-only with a recorded model/config version, fixture digest, replay fingerprint, commands, and exit codes.

| Checks | Evidence |
|--------|----------|
| CHK-001, CHK-004, CHK-005, CHK-024 | New sidecar imports existing coverage, envelope, ledger, and replay types; frozen files have no diff |
| CHK-002, CHK-008 through CHK-017, CHK-022 | `semantic-communities.vitest.ts`: 16/16 pass, precision 1.0, recall 1.0 |
| CHK-003, CHK-018 | Direct legacy and windowed parity assertions plus unchanged substrate run: 141/141 pass |
| CHK-006, CHK-007 | Candidate cap, namespace filtering, forged-set rejection, non-finite score, duplicate claim/rank, version collision, and immutable failure fixtures |
| CHK-019, CHK-020, CHK-023 | `spec.md`, `tasks.md`, `decision-record.md`, and `implementation-summary.md` |
| CHK-021 | No provider call exists; raw text is retained only in the immutable claim event/projection and omitted from telemetry |
<!-- /ANCHOR:summary -->
