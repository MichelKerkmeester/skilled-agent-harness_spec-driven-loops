---
title: "Tasks: continuity identities"
description: "Tasks for stable continuity identity minting, ledger persistence, resume and handover restoration, cross-mode references, and replay verification."
trigger_phrases:
  - "continuity identities tasks"
  - "stable deep-loop identity tasks"
importance_tier: "high"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/007-continuity-identities"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-shared-evidence-and-control-services/007-continuity-identities"
    last_updated_at: "2026-07-21T00:31:56Z"
    last_updated_by: "codex"
    recent_action: "Completed implementation and verification tasks for durable continuity identities"
    next_safe_action: "Keep the additive service dark until authority cutover"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/continuity-identity/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/continuity-identities.vitest.ts"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Continuity Identities

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Pin the phase-006 envelope, transition gate, event version, append idempotency, and replay cursor contracts on the candidate BASE [Evidence: `implementation-summary.md` pins exact substrate source anchors and SHA.]
- [x] T002 Inventory every shipped lineage, claim/finding, candidate, mode-session, resume, handover, fan-out, and graph identifier producer/consumer under `runtime/` [Evidence: `implementation-summary.md` contains a disposition-complete producer/consumer manifest.]
- [x] T003 Freeze legacy fixtures and a lifecycle matrix for new, retry, resume, handover, restart, fork, and cross-mode reference semantics [Evidence: `implementation-summary.md` records the seven-boundary lifecycle table.]
- [x] T004 Confirm the local child contract remains `depends_on: []` and document the inherited parent integration boundary without converting adjacency into dependency [Evidence: `implementation-summary.md` metadata records the empty dependency and adjacency-only boundary.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the versioned `lineage`, `claim`, `candidate`, and `mode_session` identity registry, opaque mint format, parser, kind checks, and typed errors [Evidence: `continuity-identity-schema.ts` and `continuity-identity-types.ts` own the v1 contract.]
- [x] T006 Add durable mint-request idempotency, collision handling, non-reuse enforcement, and retry-safe resolution through the transition-authorized append path [Evidence: `continuity-identity-service.ts` plus focused Vitest 20/20 cover retry, crash, and concurrency.]
- [x] T007 Add versioned identity-mint, alias-bind, relationship-bind, and cross-mode-reference events plus a deterministic replay fold [Evidence: `continuity-identity-events.ts` registers five event types and their typed reducers.]
- [x] T008 Thread stable refs through continuity reduction and logical mode-session state while separating attempt, iteration, label, path, timestamp, and content metadata [Evidence: `continuity-identity-events.ts` stores identities and attempts in separate projection fields.]
- [x] T009 Persist and restore the typed identity frontier, ledger cursor, and replay fingerprint through resume and handover; reject unresolved or wrong-kind refs before dispatch [Evidence: `continuity-frontier.ts` and focused Vitest 20/20 prove exact restoration and rejection.]
- [x] T010 Add explicit `continues_from` and `forked_from` relationships for true restarts/forks while keeping retry/resume on the original logical identity [Evidence: `continuity-identities.vitest.ts` exercises both relationship kinds and stable attempts.]
- [x] T011 Add cross-mode typed-reference validation and boundary events that preserve the original entity ID and source provenance [Evidence: focused Vitest 20/20 covers all six registered modes.]
- [x] T012 Add a dark legacy alias observer for current session IDs, lineage labels/run IDs, graph IDs, finding fallbacks, candidate IDs, and text-derived continuity keys [Evidence: focused Vitest 20/20 covers six alias namespaces and collision telemetry.]
- [x] T013 Publish stable identity fixtures and consumer contracts for program phase 010 claim continuity and phase 014 per-mode authority cutover [Evidence: `index.ts` exports typed refs and `validateIdentityBearingDomainPayload`.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify: identity shape and kind safety — valid kinds round-trip; malformed, unknown-kind, and cross-kind substitutions fail closed [Evidence: focused Vitest 20/20 includes kind/version rejection fixtures.]
- [x] T015 Verify: mint idempotency — crash/retry and concurrent duplicate requests return one accepted logical identity [Evidence: focused Vitest 20/20 includes interruption and concurrent-request fixtures.]
- [x] T016 Verify: stability — reorder, rename, path/text/timestamp change, and replay retain the original ID [Evidence: focused Vitest 20/20 includes mutable-coordinate metamorphic inputs.]
- [x] T017 Verify: resume and handover — the same frontier is restored; missing, ambiguous, stale, and wrong-kind refs stop before execution [Evidence: focused Vitest 20/20 covers exact, stale, tampered, missing, and wrong-kind frontiers.]
- [x] T018 Verify: lifecycle distinction — retry/resume keeps the ID; restart/fork mints one linked child without mutating or reusing the parent [Evidence: focused Vitest 20/20 covers attempts plus both child relationship types.]
- [x] T019 Verify: cross-mode matrix — receiving modes resolve the source ID and cannot clone, remint, or change its kind [Evidence: focused Vitest 20/20 crosses research through benchmark with one claim ID.]
- [x] T020 Verify: replay — identical authorized event prefixes reconstruct identical registry, alias, and relationship state; tampering fails explicitly [Evidence: replay fingerprint `ffad1b34fa165ac51b905a39987ccf08b5e227c1490770fb3713593451683649` is pinned in `implementation-summary.md`.]
- [x] T021 Verify: dark compatibility — legacy alias resolution matches shipped behavior and changes no authoritative runtime output [Evidence: focused Vitest 20/20 preserves exact legacy object identity and records collision telemetry.]
- [x] T022 Run targeted unit/integration tests, build/typecheck gates, replay fixtures, and strict phase validation on the exact candidate overlay [Evidence: Vitest 20/20, tsc exit 0, and validate.sh Errors 0 are recorded in `implementation-summary.md`.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/build/test/replay/shadow-parity as applicable)

Evidence: `implementation-summary.md` pins the source anchors, producer/consumer census, lifecycle table, BASE and candidate overlay digests, event-registry and replay fingerprints, additive-dark path check, focused 20-test result, TypeScript exit, and strict-validation result.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
