---
title: "Checklist: In-Flight State Classification"
description: "Blocking verification checklist for exhaustive, exclusive, fail-closed in-flight state classification before phase-014 cutover."
trigger_phrases:
  - "in-flight state classification checklist"
  - "deep-loop cutover state verification"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/004-inflight-state-classification"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-compatibility-shadow-and-rollback-bridge/004-inflight-state-classification"
    last_updated_at: "2026-07-15T14:32:45Z"
    last_updated_by: "codex"
    recent_action: "Defined the blocking verifier contract for five-way classification"
    next_safe_action: "Run the verifier after every census row has one disposition"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: In-Flight State Classification

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking verifier contract for the in-flight-state classification phase. The verifier binds the
frozen phase-003 census digest, BASE, policy versions, classifier build, canonical classification-manifest digest, and
class-specific receipts. It runs against snapshots or fixtures, never live authoritative state. Zero rows may be
missing, multiply classified, silently defaulted to a permissive class, or admitted to phase 014 with stale evidence.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The executed phase-003 census is frozen with stable row IDs, complete state-family coverage, BASE identity, evidence digests, and rollback anchors
- [ ] CHK-002 [P0] The phase-004 transition/versioning/rollback policy revision and phase-tree migration model are pinned
- [ ] CHK-003 [P1] Classification runs only against immutable snapshots or fixtures and has no write path to live authoritative state
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] The classifier has one centralized enum and reason-code registry; no consumer reimplements decision precedence
- [ ] CHK-005 [P0] `BLOCK` vetoes are evaluated before positive classes and missing evidence cannot fall through to a permissive default
- [ ] CHK-006 [P1] Canonicalization and hashing are deterministic across repeated runs and supported platforms
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Totality test proves every frozen census row appears exactly once in the classification manifest
- [ ] CHK-008 [P0] Exclusivity test rejects empty, multiple, unknown, or out-of-registry dispositions
- [ ] CHK-009 [P0] Family-coverage test exercises packet state, deltas, inboxes, council state, improvement journals, fan-out state, observability, projections, locks, pause markers, packet directories, benchmark outputs, SQLite backends, and dynamically resolved packet-local state
- [ ] CHK-010 [P0] `UPCAST` fixtures prove complete pure adjacent chains, preserved source bytes and identity, and deterministic replay-equivalent effective state
- [ ] CHK-011 [P0] `PIN` fixtures prove legacy-only authority through a bounded terminal receipt and convert timeout or unavailable completion to `BLOCK`
- [ ] CHK-012 [P0] `FORK` fixtures prove isolated execution/effect namespaces, no live publication, no budget or authority impact, and unchanged source state
- [ ] CHK-013 [P0] `MIGRATE` fixtures prove quiescent transactional import, preserved identity/order/idempotency/budgets/receipts/pending work, and successful legacy-anchor restoration
- [ ] CHK-014 [P0] `BLOCK` fixtures cover missing or stale evidence, corruption, unknown shape/version, active locks, uncertain effects, lossy conversion, partial checkpoints, and absent rollback anchors
- [ ] CHK-015 [P0] Post-classification changes to state digest, authority epoch, schema, lease set, pending effects, or rollback anchor invalidate the row before phase-014 compare-and-swap
- [ ] CHK-016 [P0] A mode with any live `BLOCK` row, unterminated `PIN`, failed verifier, missing parity fork, or stale manifest cannot receive a cutover certificate
- [ ] CHK-017 [P1] Repeated classification over identical census evidence produces byte-identical row order, reason codes, evidence references, and whole-manifest digest
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-018 [P0] The final closure report records zero missing rows, zero duplicates, zero unknown classes, zero unreviewed family overrides, and zero live blocks for each cutover-eligible mode
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-019 [P0] Classification evidence contains bounded metadata and digests only; secrets, prompts, model output, and sensitive payload bytes are not copied into manifests or receipts
- [ ] CHK-020 [P1] Fork sinks and migration fixtures are sandboxed from live effect endpoints, authority controls, and authoritative artifact roots
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-021 [P1] The class decision table, family baselines, reason codes, evidence schema, freshness rule, and phase-014 handoff are documented against the frozen census and policy revisions
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-022 [P1] Versioned manifests and verifier receipts are append-only, census-addressable, mode-addressable, and never overwrite evidence referenced by a drill or certificate
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete only when the frozen census closes one-to-one to the canonical classification manifest, every
positive disposition passes its verifier, every unsafe row is explicitly blocked, repeated classification is
deterministic, and phase 014 demonstrably refuses stale or incomplete evidence. Classification success changes no
runtime authority; it supplies a prerequisite for later per-mode cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the blocking verifier binds the exact census and manifest digests, confirms all P0 checks, records no
live state mutation, and proves every cutover-eligible mode has zero live `BLOCK` rows at the verified snapshot.
<!-- /ANCHOR:sign-off -->
