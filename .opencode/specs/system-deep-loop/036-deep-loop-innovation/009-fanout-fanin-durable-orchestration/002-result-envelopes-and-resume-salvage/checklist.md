---
title: "Checklist: Result Envelopes & Resume/Salvage"
description: "Verification contract for typed leaf results, deterministic no-rerun resume, and provenance-preserving salvage."
trigger_phrases:
  - "result envelope resume checklist"
  - "fanout salvage verification checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-fanout-fanin-durable-orchestration/002-result-envelopes-and-resume-salvage"
    last_updated_at: "2026-07-15T14:42:33Z"
    last_updated_by: "codex"
    recent_action: "Defined the planned P0 and P1 verification contract"
    next_safe_action: "Run the contract and crash-injection checks during implementation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Result Envelopes & Resume/Salvage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verification contract for phase 009's `002-result-envelopes-and-resume-salvage` child. Implementation evidence must pin the candidate SHA, ledger/reducer/event-schema versions, replay head, fixture corpus digest, and commands with exit codes. Repeated resume runs must report execution counts per leaf, and every checked item must carry machine-detectable evidence before phase completion is claimed.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Sibling-001 dispatch-receipt identity and phase-006 envelope/ledger interfaces are frozen for this implementation
- [ ] CHK-002 [P0] Phase-007 effect-recovery outcomes and stable idempotency inputs are available to the recovery coordinator
- [ ] CHK-003 [P1] Golden legacy fixtures cover every result, retry, orphan, artifact, salvage, merge-reconstruction, and exit-classification path
- [ ] CHK-004 [P2] Candidate SHA, fixture digest, registry version, reducer version, and replay head are recorded before execution
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P0] Result and salvage events append only through validated phase-006 envelope, authorization, and typed-ledger boundaries
- [ ] CHK-006 [P1] Resume reduction is pure, deterministic, side-effect-free, and rebuildable from a verified ledger
- [ ] CHK-007 [P1] Recovery orchestration separates observation/reconciliation from dispatch and cannot retry an in-doubt or conflicted effect
- [ ] CHK-008 [P1] Large/raw output and credentials remain outside ledger payloads; bounded references carry content digests
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-009 [P0] Every terminal dispatch receipt joins to exactly one canonical result envelope; dangling results and missing terminal outcomes remain explicit
- [ ] CHK-010 [P0] Exact receipt/result repeats return the original append receipt; changed status, result, evidence, artifact, usage, cost, or salvage facts conflict
- [ ] CHK-011 [P0] Success requires a valid parsed result and all required evidence/artifact digests; exit zero and file presence alone fail the success gate
- [ ] CHK-012 [P0] Repeated crash-and-resume cycles never execute a durably completed leaf more than once
- [ ] CHK-013 [P0] Resume refolds identical verified input into byte-identical progress, completed exclusions, unresolved attempts, and retry-eligible sets
- [ ] CHK-014 [P0] Not-applied effects may follow retry policy, applied effects reconcile without re-execution, and in-doubt/conflict outcomes stop automatically
- [ ] CHK-015 [P0] Crash injection covers before/after dispatch receipt, external application, result append, salvage extraction, and salvage append
- [ ] CHK-016 [P0] Salvaged fragments bind source, digest, parser/schema, recovered scope, completeness, confidence, evidence, usage, and cost provenance
- [ ] CHK-017 [P0] Partial or mixed salvage cannot silently become success, and unrecoverable required evidence preserves the failed/partial outcome
- [ ] CHK-018 [P0] Hash gaps, forks, unknown versions, stale artifact digests, missing receipts, pair conflicts, and malformed costs fail closed
- [ ] CHK-019 [P1] Legacy shadow parity covers wait resume, orphan marking, retries, salvage counts, failed markers, registry reconstruction, attribution, summaries, and exit codes
- [ ] CHK-020 [P1] Measured, estimated, and unknown usage/cost remain distinguishable; absent cost is not normalized to zero
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-021 [P1] Every supported leaf kind declares its result schema, required evidence set, terminal status mapping, and salvage adapters
- [ ] CHK-022 [P1] Every shipped fan-out recovery path has either a typed generalization or an explicit preserved compatibility adapter
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-023 [P0] Result, error, evidence, usage, and salvage payloads contain no credentials, unrestricted prompts, tokens, or secret environment values
- [ ] CHK-024 [P1] Artifact references are path-scoped and digest-verified before a result can become successful or a fragment can be assembled
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-025 [P1] Event schemas, reducer versions, recovery classifications, no-rerun invariant, and compatibility limits are documented with implementation evidence
- [ ] CHK-026 [P2] Phase parent and successor handoff docs reflect the final result/recovery projection consumed by later siblings
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-027 [P1] Runtime changes stay within the approved phase write set and preserve legacy artifact layouts during the dark period
- [ ] CHK-028 [P1] Test fixtures isolate ledger, artifact, executor, and effect-target state per case and leave no tracked mutation
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when every P0 and P1 item has evidence, the strict spec gate is green, crash injection proves deterministic no-rerun resume, effect reconciliation blocks ambiguity, salvage remains provenance-honest, and legacy/dark shadow parity holds on the pinned candidate SHA. Planned status intentionally leaves these implementation checks unchecked.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Sign off only after the verifier records the exact candidate SHA, event/reducer versions, replay head, fixture digest, test commands and exit codes, per-leaf execution counts across repeated resumes, and zero unexpected tracked mutation.
<!-- /ANCHOR:sign-off -->
