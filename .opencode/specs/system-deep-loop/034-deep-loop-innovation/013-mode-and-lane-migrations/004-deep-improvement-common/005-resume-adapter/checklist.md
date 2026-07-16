---
title: "Checklist: Deep Improvement Common Services - Resume Adapter"
description: "Blocking verification checklist for the sealed-ledger resume adapter, continuity-ladder reducers, idempotent re-entry, and common evaluator, canary, and guarded-promotion services."
trigger_phrases:
  - "deep improvement resume adapter checklist"
  - "sealed ledger resume verification"
  - "deep improvement common services checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/004-deep-improvement-common/005-resume-adapter"
    last_updated_at: "2026-07-15T20:40:00Z"
    last_updated_by: "opencode"
    recent_action: "Added blocking checks for replay safety and common-service reuse"
    next_safe_action: "Verify every ladder state and duplicate re-entry fixture"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Improvement Common Services - Resume Adapter

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 008. Every item is a check the paired verifier runs BEFORE the
candidate commit lands; each report pins the candidate SHA, BASE SHA, sealed-ledger range and digest, event-registry/upcaster
identity, reducer-set identity, fixture digest, commands, exit codes, replay fingerprints, and shadow-authority result. The gate
fails on missing evidence, zero exercised transitions, silent fallback, mutated sealed history, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-006 [P0] The phase-012 shared mode contract and write-set conflict graph are available, and the `004-certificates-and-receipts` navigation contract is reviewed
- [ ] CHK-007 [P2] The pinned BASE SHA, sealed-ledger range digest, event-registry/upcaster identity, reducer-set identity, and fixture digest are recorded in the candidate report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-008 [P1] Changes are scoped to the Resume Adapter and its common evaluator/canary/promotion contracts; no sibling concern or variant implementation is absorbed
- [ ] CHK-009 [P2] Reducers remain deterministic and non-emitting; no replay path mutates sealed events, raw observations, receipts, or certificates
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] Repeated full folds of one sealed ledger range produce byte-equivalent projections and resume fingerprints without reading mutable checkpoints or process-local state
- [ ] CHK-002 [P0] Event-level compatibility rejects unknown types, unsupported versions, broken upcasters, reducer drift, seal mismatch, and artifact-fingerprint mismatch before re-entry
- [ ] CHK-003 [P0] Every continuity-ladder level maps to one explicit re-entry decision; unmapped, ambiguous, and terminal-conflict states fail closed
- [ ] CHK-004 [P0] Exact duplicate resume requests return one existing receipt, while the same key with different payload, manifest, or replay fingerprint is rejected
- [ ] CHK-005 [P0] Crash injection proves no logical event or side effect is double-applied, lost, or replayed; branch-local successes remain reusable
- [ ] CHK-013 [P0] An effect-started event without a completion receipt remains `UNKNOWN` and follows a typed query, retry-with-key, compensate, or quarantine policy
- [ ] CHK-014 [P0] The evaluator service replays raw observations under a sealed evaluator capsule and preserves score revisions, uncertainty, and `INSUFFICIENT_EVIDENCE`
- [ ] CHK-015 [P0] The canary service seals epochs, hides canary content, detects candidate-visible leakage, records cross-domain health, and vetoes unsafe or unknown coverage
- [ ] CHK-016 [P0] The promotion service requires target repair, baseline-pass preservation, known-failure accounting, environment-policy freshness, and canary health before `PROMOTE`
- [ ] CHK-017 [P0] `005-agent-improvement`, `006-model-benchmark`, and `007-skill-benchmark` consume the same evaluator, canary, promotion, and resume result contracts
- [ ] CHK-018 [P0] Changed manifests cannot inherit prior success by label; the adapter returns explicit reuse, reexecution, fork, compensation, or rejection evidence
- [ ] CHK-019 [P1] Incomplete evaluator, canary, and promotion work preserves immutable evidence and does not convert `UNKNOWN` or `INCONCLUSIVE` into pass
- [ ] CHK-020 [P1] Shadow resume and promotion leave legacy state, live control flow, user-visible authority, and authority epochs unchanged before phase 017
- [ ] CHK-021 [P1] Re-entry receipts bind stable logical effect identity and idempotency key while preserving distinct attempt history across retries and process restarts
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P1] The common-service consumer matrix enumerates all three benchmark variants and proves no variant duplicates or bypasses the shared Resume Adapter
- [ ] CHK-011 [P1] The continuity-ladder source-to-projection matrix covers run, candidate, evaluator, score, canary, promotion, terminal, blocked, and unknown states
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-012 [P2] Candidate-visible inputs cannot reveal sealed canary content, evaluator secrets, or policy-only evidence; leak detection returns a veto without matching text
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-022 [P2] The phase outcome, common-service ownership boundary, continuity ladder, and variant handoff are reflected in the packet docs and parent phase map where applicable
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-023 [P1] Provider and consumer changes land in dependency-closed, path-scoped commits, with the Resume Adapter contract frozen before variant fan-out
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the candidate report pins the sealed-ledger and contract identities,
all continuity-ladder states have explicit replay evidence, all three variants consume the common service contracts, and the
validate/build/test/replay/shadow gate is green without changing legacy authority or sealed history.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the replay fingerprint and receipt evidence are complete, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
