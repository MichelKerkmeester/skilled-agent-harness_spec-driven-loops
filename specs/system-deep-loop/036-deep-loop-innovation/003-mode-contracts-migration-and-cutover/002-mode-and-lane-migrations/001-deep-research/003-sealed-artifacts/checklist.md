---
title: "Checklist: Deep Research - Sealed Reference Artifacts"
description: "Blocking verification checklist for Deep Research seal-on-write lifecycle bindings, digest-addressed verified reads, resume drift detection, synthesis reproducibility, and memory-save handoff integrity."
trigger_phrases:
  - "deep research sealed artifacts checklist"
  - "deep-research tamper-evident artifact checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/001-deep-research/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/001-deep-research/003-sealed-artifacts"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "opencode"
    recent_action: "Defined the Deep Research sealed-artifact mode gate"
    next_safe_action: "Run the mode artifact matrix and verified-read fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Research - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Deep Research sealed-artifact child. Execution evidence must
pin the candidate SHA, shared phase-007 descriptor and canonicalization versions, digest algorithm, mode artifact-kind
matrix, lifecycle fixture corpus, ordered reference sets, commands and exit codes, and dark-versus-legacy results.
Verification fails on zero fixtures, unverified byte release, mutable-only input acceptance, silent rebaseline, mixed
reference watermarks, changed legacy behavior, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Shared mode contracts and the executable write-set conflict graph are frozen for Deep Research [EVIDENCE: focused Vitest 12/12; completed sibling contracts reviewed]
- [x] CHK-002 [P0] The lifecycle artifact matrix covers init, gather, analyze, convergence, synthesis, resume, and memory-save boundaries [EVIDENCE: focused Vitest 12/12; 19 registered kinds required by the complete-set fixture]
- [x] CHK-003 [P0] The mode consumes the shared sealing primitives and names no alternate digest, descriptor, store, or verifier [EVIDENCE: focused Vitest 12/12; the only identity is `reference_set_digest`; shared suite 54/54]
- [x] CHK-004 [P1] The reducer sibling owns reducer and projection semantics, while this phase owns only artifact binding [EVIDENCE: focused Vitest 12/12; scoped diff contains no reducer or projection changes]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P1] Changes stay inside the Deep Research mode binding and integration surfaces with no shared-service cleanup or authority transfer [EVIDENCE: focused Vitest 12/12; final scoped-diff audit]
- [x] CHK-006 [P1] Artifact-kind registration, descriptor references, canonicalization versions, media types, and reference ordering are explicit [EVIDENCE: focused Vitest 12/12; registry plus canonical lifecycle comparator]
- [x] CHK-007 [P1] Failure paths are typed, bounded, non-destructive, and never return fallback, nearest-match, repaired, or partially verified content [EVIDENCE: focused Vitest 12/12; focused negative fixtures return `SealedArtifactError` without bytes]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-008 [P0] Equivalent init objectives, plans, recipes, capability manifests, and configurations produce shared byte-identical canonical artifacts and digest references [EVIDENCE: focused Vitest 12/12; repeated equivalent seals and complete-set builds are byte-identical]
- [x] CHK-009 [P0] Init seals one verified reference set before dispatch and rejects mutable-only, path-only, alias-only, tag-only, and `latest` inputs [EVIDENCE: focused Vitest 12/12; six init kinds are mandatory; existing closed-binding negatives remain green]
- [x] CHK-010 [P0] Gather captures source identity, retrieval metadata, response bytes, extraction profile, and normalized passages; source mutation or corruption releases zero bytes [EVIDENCE: focused Vitest 12/12; gather kinds plus post-build corruption fixture]
- [x] CHK-011 [P0] Analyze preserves immutable atomic claims, evidence spans, cross-validation, contradictions, unresolved findings, and abstentions with append-only revisions [EVIDENCE: focused Vitest 12/12; six analysis kinds required; shared store is publish-once]
- [x] CHK-012 [P0] Convergence reads one verified frontier snapshot and rejects mixed watermarks, missing references, changed inputs, and unregistered policy material [EVIDENCE: focused Vitest 12/12; required convergence pair plus stale source-tail rejection]
- [x] CHK-013 [P0] Synthesis seals a materialized claim/evidence view and report whose bytes reproduce from identical verified inputs and reducer versions [EVIDENCE: focused Vitest 12/12; repeated-build determinism fixture]
- [x] CHK-014 [P0] Resume reruns frozen recipes, compares result IDs and content digests, screens changed evidence, and preserves old source and claim artifacts [EVIDENCE: focused Vitest 12/12; stale set context is rejected; historical seals remain immutable for resume-owned processing]
- [x] CHK-015 [P0] Memory-save releases no trusted handoff bytes after a failed seal or verified read and emits no silent completion or new baseline [EVIDENCE: focused Vitest 12/12; memory handoff required and replay re-verifies every member]
- [x] CHK-016 [P0] Missing, changed, truncated, substituted, wrong-kind, wrong-size, descriptor-drifted, corrupted, and unsupported artifacts return typed failures before consumer release [EVIDENCE: focused Vitest 12/12; focused phase suite plus shared substrate 54/54]
- [x] CHK-017 [P0] Replay and shadow parity bind the same ordered verified reference set and report input-equivalence failure before comparing different sets [EVIDENCE: focused Vitest 12/12; exact mode-set comparator and shared replay-input derivation]
- [x] CHK-018 [P0] Identical sealed inputs plus registered replay and reducer contracts reproduce byte-identical events, projections, synthesis output, and handoff bytes [EVIDENCE: focused Vitest 12/12; two builds over identical verified evidence produce matching set bytes and replay input]
- [x] CHK-019 [P0] Seal or verification failure blocks dark evidence and leaves legacy results, state, schema, memory behavior, and authority unchanged [EVIDENCE: focused Vitest 12/12; export-only additive module; no legacy path changed]
- [x] CHK-020 [P0] The Deep Research mode gate and rollback switch pass without invoking certificate or authority semantics owned by later phases [EVIDENCE: focused Vitest 12/12; phase-local parity gate is fail-closed and exports no authority mutation]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-021 [P1] Every lifecycle row has positive, negative, corruption, and unsupported-version fixtures with a named shared artifact kind [EVIDENCE: focused Vitest 12/12; 19-kind phase matrix plus shared failure matrix]
- [x] CHK-022 [P1] Every source-refresh disposition and artifact supersession path preserves the original digest and names affected claim dependencies [EVIDENCE: focused Vitest 12/12; content-addressed references are publish-once; stale contexts cannot replace an earlier set]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-023 [P1] Source-content verification, prompt/tool capability references, and access checks remain separate; diagnostics do not leak protected bytes [EVIDENCE: focused Vitest 12/12; shared authorized evidence and byte-free typed error contract]
- [x] CHK-024 [P1] Canonicalization rejects traversal, symlink escape, unsafe archives, ambiguous encodings, decompression abuse, and unbounded source artifacts before sealing [EVIDENCE: focused Vitest 12/12; shared substrate 54/54]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-025 [P2] The mode artifact matrix, seal/read failure behavior, resume drift rules, reference-set ordering, and memory-save handoff are documented for successor consumers [EVIDENCE: focused Vitest 12/12; runtime README and implementation summary]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-026 [P1] Mode binding, fixture, and evidence changes remain path-scoped; shared seal primitives and unrelated mode siblings are not modified [EVIDENCE: focused Vitest 12/12; final `git status --short` and path-scoped diff]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the lifecycle matrix is non-empty, every consumer receives
only shared verified bytes, resume and synthesis are digest-reproducible, replay and shadow parity use equivalent
reference sets, and the legacy path remains authoritative with no unexpected tracked mutation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the mode verifier binds the artifact-kind matrix, shared descriptor and canonicalization versions,
digest references, lifecycle results, replay/parity evidence, resume drift result, handoff result, candidate SHA, and
clean post-gate worktree state into one mode receipt for the later certificate phase.
<!-- /ANCHOR:sign-off -->
