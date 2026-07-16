---
title: "Checklist: Deep Review - Sealed Reference Artifacts"
description: "Blocking verification checklist for Deep Review seal-on-write lifecycle bindings, digest-addressed verified reads, candidate evidence integrity, convergence reproducibility, review-report synthesis, and resume handoff references."
trigger_phrases:
  - "deep review sealed artifacts checklist"
  - "deep-review tamper-evident artifact checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/003-sealed-artifacts"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined the Deep Review sealed-artifact mode gate"
    next_safe_action: "Run the Deep Review artifact matrix and verified-read fixtures"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Deep Review - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the Deep Review sealed-artifact child. Execution evidence must pin
the candidate SHA, shared phase-006 descriptor and canonicalization versions, digest algorithm, mode artifact-kind matrix,
lifecycle fixture corpus, ordered reference sets, commands and exit codes, and dark-versus-legacy results. Verification
fails on zero fixtures, unverified byte release, mutable-only input acceptance, silent rebaseline, mixed reference
watermarks, changed legacy behavior, or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase-012 shared review-loop contracts and the executable write-set conflict graph are frozen for Deep Review
- [ ] CHK-002 [P0] The lifecycle artifact matrix covers scope/init, dimension-pass, candidate/adjudication, convergence, synthesis, resume, and save boundaries
- [ ] CHK-003 [P0] The mode consumes the shared phase-006 sealing primitives and names no alternate digest, descriptor, store, or verifier
- [ ] CHK-004 [P1] Predecessor `002-reducers-and-projections` owns findings, dashboard, strategy, and report projection semantics, while this phase owns only artifact binding
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-005 [P1] Changes stay inside the Deep Review mode binding and integration surfaces with no shared-service cleanup or authority transfer
- [ ] CHK-006 [P1] Artifact-kind registration, descriptor references, canonicalization versions, media types, and reference ordering are explicit
- [ ] CHK-007 [P1] Failure paths are typed, bounded, non-destructive, and never return fallback, nearest-match, repaired, or partially verified content
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] Equivalent scope targets, review contracts, context snapshots, prompt/rubric inputs, capability manifests, and policies produce shared byte-identical canonical artifacts and digest references
- [ ] CHK-009 [P0] Scope init seals one verified reference set before dispatch and rejects mutable-only, path-only, alias-only, tag-only, and `latest` inputs
- [ ] CHK-010 [P0] Dimension-pass fixtures preserve selected targets, search/depth ledger, diagnostics, raw observations, graph events, iteration output, and JSONL delta; mutation or corruption releases zero bytes
- [ ] CHK-011 [P0] Candidate/adjudication fixtures preserve intermediate facts, evidence classes, reproduction/refutation, orthogonal confidence and impact fields, and append-only revisions before P0/P1/P2 activation
- [ ] CHK-012 [P0] Convergence reads one verified state and findings snapshot and rejects mixed watermarks, missing references, changed inputs, and unregistered policy material
- [ ] CHK-013 [P0] Synthesis seals findings/dashboard views, optional resource-map coverage, unresolved obligations, verdict metadata, and `review-report.md` whose bytes reproduce from identical verified inputs and reducer versions
- [ ] CHK-014 [P0] Changed-target and resume fixtures classify unchanged, changed, missing, and unverifiable references, identify affected findings or report views, and preserve old artifacts
- [ ] CHK-015 [P0] Continuity-save or handoff releases no trusted bytes after a failed seal or verified read and emits no silent completion or new baseline
- [ ] CHK-016 [P0] Missing, changed, truncated, substituted, wrong-kind, wrong-size, descriptor-drifted, corrupted, and unsupported artifacts return typed failures before consumer release
- [ ] CHK-017 [P0] Replay and shadow parity bind the same ordered verified reference set and report input-equivalence failure before comparing different sets
- [ ] CHK-018 [P0] Identical sealed inputs plus registered review-loop, replay, reducer, and projection contracts reproduce byte-identical events, findings views, convergence evidence, report bytes, and verdict metadata
- [ ] CHK-019 [P0] Finding lineage preserves original observations across moved lines, renamed symbols, resolution, suppression, severity changes, and append-only supersession
- [ ] CHK-020 [P0] Seal or verification failure blocks dark evidence and trusted synthesis while leaving legacy results, state, schema, report behavior, and authority unchanged
- [ ] CHK-021 [P0] The Deep Review mode gate and rollback switch pass without invoking certificate or authority semantics owned by later phases
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-022 [P1] Every lifecycle row has positive, negative, corruption, and unsupported-version fixtures with a named shared artifact kind
- [ ] CHK-023 [P1] Every target-drift disposition and artifact supersession path preserves the original digest and names affected finding or report dependencies
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-024 [P1] Target-content verification, prompt/tool capability references, evaluator or judge evidence, and access checks remain separate; diagnostics do not leak protected bytes
- [ ] CHK-025 [P1] Canonicalization rejects traversal, symlink escape, unsafe archives, ambiguous encodings, decompression abuse, and unbounded review artifacts before sealing
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-026 [P2] The mode artifact matrix, seal/read failure behavior, candidate evidence rules, reference-set ordering, report reproducibility, and resume drift rules are documented for successor consumers
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-027 [P1] Mode binding, fixture, and evidence changes remain path-scoped; shared seal primitives and unrelated Deep Review siblings are not modified
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the lifecycle matrix is non-empty, every consumer receives only
shared verified bytes, candidate evidence and report synthesis are digest-reproducible, replay and shadow parity use
equivalent reference sets, changed inputs do not silently rebaseline, and the legacy path remains authoritative with no
unexpected tracked mutation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the mode verifier binds the artifact-kind matrix, shared descriptor and canonicalization versions, digest
references, lifecycle results, candidate/adjudication evidence, convergence gates, replay/parity evidence, drift result,
handoff result, candidate SHA, and clean post-gate worktree state into one mode receipt for the later certificate phase.
<!-- /ANCHOR:sign-off -->
