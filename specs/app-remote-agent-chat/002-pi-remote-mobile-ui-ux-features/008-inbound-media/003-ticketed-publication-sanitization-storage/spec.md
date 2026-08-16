---
title: "Feature Specification: Phase 2 — Ticketed publication, sanitization, and atomic artifact storage [template:level-2/spec.md]"
description: "Build the ticketed relay publication boundary and store only bounded sanitized derivatives."
trigger_phrases:
  - "ticketed inbound publication"
  - "image sanitization and artifact storage"
  - "atomic artifact settlement"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/002-pi-remote-mobile-ui-ux-features/008-inbound-media/003-ticketed-publication-sanitization-storage"
    last_updated_at: "2026-08-16T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Scaffolded phase docs from implementation-phases.md"
    next_safe_action: "Implement and verify this phase"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Phase 2 — Ticketed publication, sanitization, and atomic artifact storage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Scaffold |
| **Created** | 2026-08-16 |
| **Branch** | `003-ticketed-publication-sanitization-storage` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Inbound bytes require a ticketed, isolated, fail-closed relay boundary before any sanitized derivative can be read. This phase binds publication to the approved context, removes source metadata, and atomically settles ready or withheld state.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

The detailed publication, sanitization, storage, lifecycle, and exclusion boundaries are carried in the phase-specific sections below.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Accept only approved ticketed publication | Valid sources create processing and ready metadata-only blocks. |
| REQ-002 | Sanitize and redact in isolation | Unsafe, unsupported, over-limit, or scanner-failed input is withheld. |
| REQ-003 | Settle at the expected revision | Late completion cannot reorder or overwrite a newer block. |
| REQ-004 | Clean all source/intermediate data | Stored variants contain final sanitized bytes only. |
| REQ-005 | Make cleanup deterministic | Retention, revocation, quota, and abandoned-processing cleanup are tested. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Publication authorization, sanitization, storage, lifecycle, and source cleanup are independently testable.
- Security owner approval is obtained before exact reads expose variants.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 protocol and host seam | No safe publisher context | Keep the capability disabled until the seam is proven. |
| Risk | Decoder, OCR, or cleanup failure | Sensitive or unbounded bytes could persist | Isolate processing and withhold/discard on uncertainty. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

The security-owner signoff boundary before Phase 3 is the required decision point for this phase.
<!-- /ANCHOR:questions -->

## Summary

This phase delivers the secure relay-side publication path: an approved, ticketed publisher can create a processing block and commit only bounded relay-sanitized derivatives as ready. Unsupported, unsafe, interrupted, or failed processing ends withheld with no retrievable original, while the PWA capability may remain disabled.

## Problem & Goal

Inbound image bytes need a dedicated boundary because pi JSONL, sync frames, HTTP JSON, and durable transcript state must remain small and metadata-only. The goal is to bind publication to the approved host context, isolate decoding and redaction, store only final derivatives, and settle the transcript atomically at the expected revision.

## Scope

### In scope

- Relay artifact storage with random immutable artifact IDs/revisions, bounded variant files, digests/ETags, retention, quota, expiry, revocation purge, and filesystem permissions.
- Relay sanitization with streaming limits, magic-byte and decoder validation, isolated worker processing, one-frame checks, orientation, sRGB conversion, metadata stripping, exclusion masks, OCR secret/path detection, opaque burned-in redaction, deterministic thumbnail/full encoding, and fail-closed withholding.
- Separate `artifact:publish` authorization and one-use tickets bound to the required principal, host, session, run, turn, block, submission, revision, length, media family, and start deadline context.
- Extension-only ticket and binary publish operations, partial-body cleanup, exact declared/streamed length enforcement, browser-origin rejection, and raw-error suppression.
- Processing metadata insertion, ready/withheld compare-and-swap settlement, stable block identity/sequence, abandoned-processing finalization, migration, host source allowlist, deterministic relay fixtures, extension tests, and processing/withheld demo states.

### Out of scope

- Browser/PWA publication, a PWA read lane, fullscreen viewer behavior, transcript card promotion, production capability enablement, or any outbound/send/export action.
- Image bytes, source paths, URLs, OCR text, decoder details, tickets, or original buffers in durable relational fields, logs, transcript metadata, or client fixtures.
- Raising pi JSONL, sync-frame, or HTTP-JSON limits, accepting arbitrary repository paths/symlinks, or using the web client as a publisher.
- Changing the fixed ink-on-parchment design system or the read-only-by-default, host-authoritative, ticketed fail-closed security posture.

## User-facing behavior + states

- The web demo exposes deterministic `processing` and `withheld` states only so the CDP harness exercises a real UI state while the PWA remains a non-publisher.
- A publication that cannot be safely decoded, bounded, scanned, redacted, stored, or settled is represented as withheld and exposes no artifact bytes.
- No production UI control enables publication in this phase.

## Acceptance criteria

- Valid JPEG, PNG, and static WebP publication creates a processing block and then a ready block containing metadata and artifact references only.
- Unsupported, animated, malformed, over-limit, scanner-failed, or redaction-failed publication becomes withheld with no artifact bytes readable.
- Replayed or context-mismatched tickets create no block and no artifact.
- A late revision completion is deleted and cannot reorder or overwrite a newer block.
- Stored variants contain only final sanitized bytes; source and intermediate buffers are gone after commit.
- Retention, revocation, quota, and abandoned-processing cleanup are deterministic and tested.
- Security owner signs off on decoder isolation, source allowlist, redaction detectors, and fail-closed behavior before Phase 3 exposes reads.

## Security & Redaction

The publisher is extension-only, consumes a one-use ticket before reading the body, and binds the request to the exact host/session/transcript context. The relay enforces the source ceilings and boundary cases from the phase gate: 15 MiB per image, 30 MiB per batch, four images per turn, 60 MP, 12,000px, two concurrent sanitizations, worker/output/quota limits, and deterministic timeouts. It accepts only JPEG, PNG, and static WebP after decoder validation, reconstructs bounded 8-bit sRGB derivatives, removes source metadata, applies opaque redaction masks, and withholds when scanning or redaction cannot complete confidently. It stores no source or intermediate bytes and fails closed on replay, mismatch, unsupported input, or cleanup failure.

## Dependencies & affected areas

- `apps/pi-remote-relay/src/store/artifact-store.ts`, `artifact-sanitizer.ts`, `relay-store.ts`, and `transcript-projector.ts` for storage, processing, and lifecycle settlement.
- `apps/pi-remote-relay/src/auth/policy.ts` and `auth-service.ts` for `artifact:publish` and ticket binding.
- `apps/pi-remote-relay/src/http/server.ts` for extension-only publication operations.
- `apps/pi-remote-relay/migrations/` for artifact metadata and lifecycle fields without source bytes.
- `extensions/pi-remote-inbound-media/src/index.ts` and its tests for source allowlist and publisher cleanup.
- `apps/pi-remote-relay/tests/`, `tests/security/`, and extension tests for deterministic positive and negative fixtures.
- `apps/pi-remote-web/src/demo.ts` for processing/withheld display fixtures only; the web client remains a non-publisher.
- Phase 1 protocol and host seam are prerequisites; Phase 3 exact reads consume the committed sanitized artifact contract.
