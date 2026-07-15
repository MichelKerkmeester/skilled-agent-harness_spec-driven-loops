---
title: "Checklist: Blinded Adjudication Service"
description: "Blocking verifier checklist for the shared blinded and counterfactual adjudication service."
trigger_phrases:
  - "blinded adjudication checklist"
  - "counterfactual adjudication verification"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/007-shared-evidence-and-control-services/003-blinded-adjudication-service"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined P0 gates for blinding, counterfactual stability, and raw evidence"
    next_safe_action: "Build canary identity, order-swap, correlation, and replay fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Blinded Adjudication Service

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the blinded adjudication service. Every item remains pending until
an implementation candidate exists. The verifier binds results to the candidate SHA, event-schema version, judge and
counterfactual policy versions, reducer version, replay fingerprint, and fixture-corpus digest; it records commands,
exit codes, discovered fixture counts, and ledger evidence IDs, and fails on zero discovery or unexpected mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The phase-001 adjudication invariant and phase-003 envelope, authorization, and replay-fingerprint contracts are pinned before implementation
- [ ] CHK-002 [P0] Identity-bearing fields, allowed presentation transformations, required counterfactuals, and mode-adapter boundaries are reviewed and versioned
- [ ] CHK-003 [P1] The service is configured additive-dark and the legacy path remains the sole decision authority
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P1] Registration, identity-map access, blinded presentation, judging, reduction, deblinding, and mode adaptation are separate typed capabilities
- [ ] CHK-005 [P1] Unknown event, policy, probe, reducer, identity field, or adapter input fails closed without a guessed default
- [ ] CHK-006 [P2] Reducer and adapter code preserves explicit ties, abstentions, invalid results, cycles, vetoes, minority evidence, and uncertainty
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Canary identity/provider/author/position/confidence fields never reach the judge payload, prompt, cache key, weight, tie-break, or reducer input
- [ ] CHK-008 [P0] Per-assignment opaque labels cannot be linked across assignments by stable naming, order, metadata, context, timing fields, or identity-map access
- [ ] CHK-009 [P0] Golden fixtures prove every allowed presentation normalization preserves candidate meaning and records its versioned transformation manifest
- [ ] CHK-010 [P0] Every required pair receives A/B and B/A judgments; order disagreement yields unstable/inconclusive status rather than a preferred candidate
- [ ] CHK-011 [P0] Identity, order, confidence, claimed expertise, majority cue, and policy-specific interventions each record linked flip/no-flip/indeterminate results
- [ ] CHK-012 [P0] A missing required probe, invalid assignment, insufficient quorum, insufficient independence, unresolved tie/cycle, or veto cannot reduce to a stable winner
- [ ] CHK-013 [P0] Candidate producers cannot judge their own candidates directly or through an equivalent identity, and rejected attempts append no accepted raw-score event
- [ ] CHK-014 [P0] Every final verdict traverses to immutable candidate/reference digests, raw component scores, rationales/evidence locators, uncertainty, abstentions, probes, policy versions, and fingerprint
- [ ] CHK-015 [P0] Replaying the same ordered events under the same reducer and fingerprint reproduces the verdict; changed reducer versions retain and reference the original raw evidence
- [ ] CHK-016 [P0] Duplicate, reordered, missing, unauthorized, unsupported-version, and malformed events are rejected or handled exactly as the phase-003 envelope contract declares
- [ ] CHK-017 [P0] Cloned-seat and shared-provider fixtures keep measured effective independence below configured seat count and expose residual-correlation evidence
- [ ] CHK-018 [P0] Dawid-Skene-style competence weighting never suppresses correlation warnings, replaces raw-score gauges, or claims conditional independence was established
- [ ] CHK-019 [P0] Pre-verdict and unauthorized deblinding fail; authorized post-verdict deblinding records actor, purpose, scope, identity-map version, and result
- [ ] CHK-020 [P0] Deep-review adapters preserve hard evidence and severity uncertainty without reviewer identity or confidence cues
- [ ] CHK-021 [P0] Deep-ai-council adapters preserve the pairwise graph, ties/cycles, minority evidence, effective-independence evidence, and counterfactual convergence status
- [ ] CHK-022 [P0] Deep-improvement, model-benchmark, and skill-benchmark adapters blind treatment/generator/provider identity, retain per-task raw scores, and join cost only after blind quality scoring where applicable
- [ ] CHK-023 [P0] No adapter re-reduces raw service scores, turns unstable/inconclusive into stable, or moves mode state without a mode-owned authorized transition
- [ ] CHK-024 [P0] Shadow fixtures compare service and legacy outcomes while proving the service remains non-authoritative
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-025 [P1] All fourteen requirements have direct implementation evidence and a named positive, negative, replay, or adapter fixture
- [ ] CHK-026 [P1] The complete multi-candidate surface inventory shows deep-review, deep-ai-council, deep-improvement, model-benchmark, and skill-benchmark use the shared service contract
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-027 [P0] Identity-map custody is least-privilege, judge/reducer capabilities cannot read it, and logs/errors/telemetry do not leak blinded provenance
- [ ] CHK-028 [P0] Deblinding, policy override, reducer selection, invalidation, and verdict emission require explicit transition authorization and produce auditable events
- [ ] CHK-029 [P1] Untrusted candidate content cannot inject identity metadata, control judge instructions, forge opaque labels, or reference another adjudication's evidence
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-030 [P2] Event schemas, blinding policy, counterfactual policy, reducer semantics, failure modes, mode adapters, and deblinding procedure are documented
- [ ] CHK-031 [P2] Load-bearing decisions cite `research-modes.md`, the phase-001 spine ADR, and `manifest/phase-tree.json`
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-032 [P1] Shared service code owns generic adjudication behavior; mode packages contain typed adapters only and do not fork the reducer or identity-map logic
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes on non-zero fixtures, mirrored and counterfactual judgments are
bias-stable or explicitly inconclusive, cloned seats cannot manufacture independence, every verdict retains replayable
raw evidence, all five adapters preserve the shared status, and shadow execution leaves legacy authority unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the blocking verifier binds the complete gate evidence to the candidate SHA and replay fingerprint,
strict validation is green, every required mode adapter passes its contract suite, and repository status shows no
unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
