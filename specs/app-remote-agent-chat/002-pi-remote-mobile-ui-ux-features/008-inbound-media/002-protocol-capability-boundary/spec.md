---
title: "Feature Specification: Phase 1 — Protocol and pre-stdout capability boundary [template:level-2/spec.md]"
description: "Version the inbound image contract and prove the pre-stdout capability boundary without exposing image bytes."
trigger_phrases:
  - "inbound image protocol"
  - "pre-stdout capability boundary"
  - "unsupported inbound media"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/002-pi-remote-mobile-ui-ux-features/008-inbound-media/002-protocol-capability-boundary"
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
# Phase 1 — Protocol and pre-stdout capability boundary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Scaffold |
| **Created** | 2026-08-16 |
| **Branch** | `002-protocol-capability-boundary` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The protocol has no inbound image block, and the existing transports must not carry unsanitized bytes. This phase defines the contract and proves the host interception seam while leaving the capability disabled unless the seam is available.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

The detailed in-scope and out-of-scope boundaries are carried in the phase-specific sections below.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define the versioned inbound image lifecycle | Valid lifecycle shapes are accepted by strict guards. |
| REQ-002 | Preserve safe old-client behavior | Unknown inbound blocks render as unsupported/redacted rows. |
| REQ-003 | Prove the host seam | Capability is advertised only after pre-stdout interception is proven. |
| REQ-004 | Keep existing boundaries unchanged | No byte, path, URL, or base64 value reaches existing transports or durable state. |
| REQ-005 | Keep Plan mode host-authoritative | The phone cannot authorize capture. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `inbound_image` types, guards, exports, fixtures, and compatibility behavior are documented and testable.
- The disabled/unsupported state has true 390px light and dark CDP evidence.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-pi pre-stdout interception | Capability cannot be enabled | Advertise no capability and retain unsupported behavior. |
| Risk | Unsafe metadata crossing the boundary | Read-only transcript could become a file/network client | Strict exact-key guards and host-side interception. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

Security review remains a release prerequisite before the Phase 2 binary publication boundary.
<!-- /ANCHOR:questions -->

## Summary

This phase delivers the versioned `inbound_image` protocol contract, strict guards, and the isolated host adapter seam. It also preserves honest unsupported behavior in clients while keeping inbound media disabled unless the pinned pi integration can intercept image-bearing output before stdout or session persistence.

## Problem & Goal

Pi Remote has no inbound image block, and allowing image bytes, paths, URLs, or base64 through the existing JSONL, sync, or durable transcript paths would violate the read-only and redaction posture. The goal is to define the lifecycle contract and prove the pre-stdout interception capability without exposing bytes to the phone or raising any transport limit.

## Scope

### In scope

- Add the versioned `InboundImageBlock` processing, ready, and terminal unions, artifact descriptors, safe presentation metadata, redaction fields, and strict guards in `packages/pi-rpc-protocol`.
- Add the isolated `extensions/pi-remote-inbound-media` host adapter seam and tests; advertise no capability when the seam is unavailable.
- Review the Plan-mode host policy so capture authority remains on the host and the phone cannot authorize capture.
- Add the minimal web compatibility branch, disabled/unsupported demo fixture, and initial 390px light/dark CDP harness.
- Add only the root workspace wiring needed for the new extension package and CDP runner.

### Out of scope

- Delivering image bytes to the phone, adding a binary publication or artifact-read route, sanitizing images, or enabling the production capability.
- Accepting filesystem paths, URLs, Markdown image references, base64 payloads, or changing pi JSONL, sync-frame, or HTTP-JSON limits.
- Changing the fixed bone/carbon/clay ink-on-parchment design system, Inter + Source Serif 4 typography, light/dark themes, or WCAG AA target.
- Changing the read-only-by-default posture, ticketed fail-closed mutations, redaction requirements, or host/extension Plan-mode authority.

## User-facing behavior + states

- A client that receives an unknown or not-yet-enabled `inbound_image` renders the existing unsupported/redacted row and does not silently drop the block.
- The disabled/unsupported fixture shows no feature-enabling control and no image pixels in either light or dark theme.
- The CDP harness exercises the existing transcript plus the disabled/unsupported state at exactly 390 CSS pixels.

## Acceptance criteria

- The protocol guard accepts all valid inbound lifecycle shapes and rejects the unsafe shapes listed in the feature acceptance criteria, including unknown fields, paths, URLs, base64, OCR text, malformed digests/revisions, and invalid bounds.
- Existing transcript kinds and F5 `ImageContent` remain type-compatible.
- An unknown inbound block is visible as an honest unsupported/redacted row rather than being silently dropped.
- The host advertises inbound media only when cli-pi 0.95/0.20 proves the pre-stdout seam.
- No image byte, base64, path, or URL reaches stdout, JSONL, sync, transcript, or durable state.
- Security review is recorded before Phase 2 introduces the inbound binary publication boundary.

## Security & Redaction

The protocol boundary carries metadata only and uses strict exact-key guards to reject unsafe content combinations. The host adapter must intercept approved image-bearing output before stdout and session persistence; if that seam is unavailable, it exposes no capability. The phone remains unable to authorize capture, and no source path, URL, base64, image bytes, OCR output, or decoder detail is forwarded or persisted. The fixed redaction and fail-closed posture remains unchanged for the later publication phase.

## Dependencies & affected areas

- `packages/pi-rpc-protocol/src/types.ts`, `guards.ts`, and `index.ts` for the contract and exports.
- `packages/pi-rpc-protocol/tests/guards.test.ts` for lifecycle and rejection fixtures.
- `extensions/pi-remote-inbound-media/package.json`, `tsconfig.json`, `src/index.ts`, and `tests/publisher-boundary.test.ts` for the host seam.
- `extensions/pi-remote-plan/src/index.ts` and the host policy contract for Plan-mode authority.
- `apps/pi-remote-web/src/state.ts`, `App.tsx`, and `demo.ts` for unsupported behavior.
- `scripts/inbound-media-cdp.mjs` and the root workspace manifest for the verification harness and package wiring.
- Relay publication, artifact storage, and read endpoints are not changed in this phase; existing transport ceilings remain consumers of the unchanged contract.
