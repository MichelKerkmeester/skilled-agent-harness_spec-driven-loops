---
title: "Checklist: semantic communities"
description: "Blocking verifier checklist for semantic communities and concept-level novelty in phase 010 child 001."
trigger_phrases:
  - "semantic communities checklist"
  - "concept-level novelty checklist"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/010-novelty-claims-continuity-and-projections/001-semantic-communities"
    last_updated_at: "2026-07-15T17:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined blocking semantic precision, replay parity, and novelty checks"
    next_safe_action: "Execute the fixture gate after the community projection is implemented"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Semantic Communities

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for phase 010 child 001. The implementation verifier binds results to the exact
candidate and baseline revisions, projection model/config version, fixture-corpus digest, threshold policy, and replay fingerprint.
Every completed item records the command, exit code, observed counts or metric, and artifact path; zero fixtures, zero candidate
comparisons, silent embedding fallback, or unversioned membership is a failure.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Parent ledger, stable claim identity, replay fingerprint, compatibility bridge, and durable fan-in prerequisites are pinned; this child's `depends_on: []` is recorded
- [ ] CHK-002 [P0] The labeled corpus covers equivalent paraphrases, notation variants, adjacent concepts, contradictions, repeated evidence, bridge claims, namespace isolation, and model-version drift
- [ ] CHK-003 [P1] Existing graph-growth novelty outputs and coverage-graph test commands are captured against the exact baseline revision
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Raw claim text, stable claim ID, evidence links, namespace, and ledger position remain immutable and independently addressable
- [ ] CHK-005 [P0] Semantic edges and membership rows carry complete model/config, metric, score, threshold, provenance, version, and lineage fields
- [ ] CHK-006 [P1] Candidate retrieval and affected-component recomputation are bounded, namespace-scoped, deterministic, and observable
- [ ] CHK-007 [P1] Missing embeddings, invalid scores, ambiguous membership, and projection conflicts fail explicitly without string-equality fallback
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] Equivalent-paraphrase fixtures meet the declared recall threshold and resolve to one community
- [ ] CHK-009 [P0] Adjacent-but-distinct and topical-only fixtures meet the declared precision threshold and remain in separate communities
- [ ] CHK-010 [P0] A single bridge edge cannot merge established communities; only the frozen cross-community cohesion rule can authorize a merge
- [ ] CHK-011 [P0] Shuffled arrival orders and repeated full replays produce identical edge sets, community IDs, representatives, membership hashes, lineage, and novelty classes
- [ ] CHK-012 [P0] Incremental projection equals a full deterministic rebuild after every join, ambiguity, bridge, merge, split, and version-transition fixture
- [ ] CHK-013 [P0] The first stable concept emits `new_community`; a paraphrase emits `existing_community_member`; unresolved multi-match emits `ambiguous`
- [ ] CHK-014 [P0] New sources or evidence for an existing community remain visible as `new_evidence` and are not suppressed by concept deduplication
- [ ] CHK-015 [P0] Model/config drift creates a new projection version, preserves historical membership, and requires an explicit deterministic rebuild
- [ ] CHK-016 [P0] Namespace-isolation fixtures produce no cross-packet candidates, semantic edges, community memberships, or novelty influence
- [ ] CHK-017 [P1] Candidate-count, latency, affected-component size, recomputation, false-merge, fragmentation, and rebuild-drift metrics stay within declared budgets
- [ ] CHK-018 [P0] Existing coverage-graph suites and pinned graph-novelty values remain unchanged when disabled; enabled output is shadow-only and parity-reportable
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-019 [P1] Every semantic-community requirement maps to an implementation task, executable fixture, and retained verifier artifact
- [ ] CHK-020 [P1] No contradiction, supersession, claim-continuity, next-focus, projection-transaction, or convergence-authority work leaked from its owning sibling phase
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-021 [P1] Claim text sent to an embedding provider follows the declared data-boundary policy; secrets and restricted content are neither logged nor persisted in telemetry
- [ ] CHK-022 [P2] Adversarial long text, malformed Unicode, prompt-like claim content, and embedding-service failures cannot escape namespace, budget, or schema guards
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-023 [P2] Community schema, model/config versioning, threshold policy, ambiguity behavior, lineage, novelty semantics, and rebuild procedure are documented with the shipped interface
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-024 [P1] Community logic extends the existing coverage-graph and ledger boundaries; no parallel ungoverned claim store or novelty authority was introduced
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 check passes, P1 checks pass or carry approved deferral evidence, the frozen corpus meets its
precision/recall gate, incremental and full rebuild outputs are identical, legacy novelty remains backward-compatible, and concept
novelty stays shadow-only with a recorded model/config version, fixture digest, replay fingerprint, commands, and exit codes.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the independent verifier confirms semantic quality, deterministic replay, incremental/full parity, namespace
isolation, evidence-novelty preservation, and backward-compatible coverage-graph behavior on the exact candidate revision.
<!-- /ANCHOR:sign-off -->
