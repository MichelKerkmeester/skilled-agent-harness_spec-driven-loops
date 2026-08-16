---
title: "Feature Specification: Phase 6 — Approved host enablement, security signoff, and release [template:level-2/spec.md]"
description: "Connect the completed slices to the allowlisted host integration and pass security, device, release, and kill-switch gates."
trigger_phrases:
  - "approved inbound media host enablement"
  - "inbound media security signoff"
  - "Pi Remote media release gate"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "apps/pi-remote/002-pi-remote-mobile-ui-ux-features/008-inbound-media/007-host-enablement-security-release"
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
# Phase 6 — Approved host enablement, security signoff, and release

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
| **Branch** | `007-host-enablement-security-release` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Production enablement must prove the real pinned host seam, source allowlist, redaction/read/cache controls, device behavior, and rollback path. This phase turns the feature on only after all gates and security-owner approval pass; otherwise it remains disabled.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

The host enablement, policy review, end-to-end fixture, release checks, negative controls, device proof, visual comparison, security approval, and kill-switch boundary are carried in the phase-specific sections below.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Gate the real host seam | Approved pre-stdout publication works or capability remains disabled. |
| REQ-002 | Enforce source/policy authority | Only allowlisted sources publish and Plan mode stays host-authoritative. |
| REQ-003 | Prove end-to-end lifecycle | Ready, withheld, expiry, revocation, stale, corrupt, offline, and privacy states pass on device. |
| REQ-004 | Preserve non-export posture | No outbound mutation, F5 attachment, send, export, URL, path, or persistent media path exists. |
| REQ-005 | Obtain release approval | Security signoff and full release/kill-switch gate pass with no stray media. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The production capability is allowlisted only with complete evidence and an immediate disable path.
- The final repository contains no generated image media or stray verification artifacts.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Physical device and security-owner approval | Capability cannot be enabled | Keep the release disabled and record the missing gate. |
| Risk | Production seam or policy drift | Unsafe or unapproved source could publish | Default-deny checks, negative controls, and kill switch. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

The enablement decision is made only after the security owner records approval of residual risks and rollback behavior.
<!-- /ANCHOR:questions -->

## Summary

This phase connects the completed protocol, publication, read, transcript, and viewer slices to the real approved host integration and establishes the production release boundary. The capability becomes allowlisted only after end-to-end, redaction, device, security, release, and kill-switch gates pass; otherwise it stays disabled.

## Problem & Goal

Earlier phases can be independently verified behind a capability gate, but production enablement must prove that the pinned cli-pi 0.95/0.20 host intercepts image-bearing output before stdout/session persistence and that every downstream privacy and authorization control holds. The goal is to run the real end-to-end path, preserve an immediate kill switch, obtain security-owner approval, and release without fallback transports or generated media in the repository.

## Scope

### In scope

- Final host source allowlist, capability-handle resolution, host policy checks, Plan-mode behavior, run/turn/block binding, and publisher cleanup.
- Plan extension and relay policy review for separate `artifact:publish` and `artifact:read`, default-deny unknown actions, and emergency disable behavior.
- A cli-pi 0.95/0.20 host-to-relay end-to-end fixture covering pre-stdout interception, processing, ready/withheld settlement, exact reads, revocation, expiry, and UI privacy.
- Release/kill-switch checks, decoder/worker/filesystem/retention/quota/revocation/service-worker/CSP/no-store production verification, negative controls, device verification, visual comparison, and security-owner approval.

### Out of scope

- Any fallback transport, raised transport limit, arbitrary source, outbound mutation, F5 attachment, prompt submission, pi re-send, share, save, copy, download, URL, path, or persistent browser media path.
- Changing the fixed ink-on-parchment design system, light/dark tokens, typography, WCAG AA target, or Plan-mode host authority.
- Enabling the feature when the pre-stdout seam, source allowlist, redaction policy, device matrix, release gate, or security signoff is incomplete.
- Committing screenshots, decoded buffers, binary fixtures, artifact caches, or generated media.

## User-facing behavior + states

- The approved host integration produces the same metadata-only processing, ready, withheld, exact-revision, expiry, revocation, stale, corrupt, offline, and background-privacy states verified in earlier phases.
- When any production precondition fails, the host advertises no inbound-media capability and the user sees the existing disabled/unsupported behavior.
- Physical-device verification covers the real card/viewer flow in light and dark themes without consumer-app export behavior.

## Acceptance criteria

- The real pinned host integration either publishes through the approved pre-stdout seam or leaves the feature disabled; no fallback transport is accepted.
- Only allowlisted sources can publish, and host/extension policy remains authoritative in Plan mode.
- End-to-end ready, withheld, expiry, revocation, stale-revision, corrupt-byte, offline, and background-privacy behavior passes on the physical device.
- No outbound mutation, F5 attachment, prompt submission, pi re-send, share, save, copy, download, URL, path, or persistent browser media path exists.
- Security owner signs off on the publication lane, redaction pipeline, read authorization, cache hygiene, retention, residual risks, and kill switch.
- The release gate passes with light and dark true-390px CDP screenshots, production build, tests, device matrix, no generated repository media, and no stray files.

## Security & Redaction

Production enablement is default-deny and capability-gated. The approved host/extension remains authoritative over capture and publication, including Plan mode; the relay keeps `artifact:publish` separate from `artifact:read`, and the emergency disable path must leave the capability off without falling back to stdout, paths, URLs, base64, or raised limits. Release verification must not log image bytes, IDs, paths, OCR, digests, URLs, or decoder exceptions. Security signoff covers decoder isolation, redaction and fail-closed behavior, exact read authorization, no-store/cache hygiene, retention and revocation, device limitations, residual risk, and rollback/kill-switch operation.

## Dependencies & affected areas

- `extensions/pi-remote-inbound-media/src/index.ts` for the final source allowlist, capability handles, host checks, bindings, and cleanup.
- `extensions/pi-remote-plan/src/index.ts` for Plan-mode capture semantics and read-only behavior.
- `apps/pi-remote-relay/src/policy/mutation-policy.ts` and `src/auth/policy.ts` for separate actions, default deny, and emergency disable.
- The cli-pi 0.95/0.20 host-to-relay end-to-end fixture and host publisher tests.
- `scripts/release-verify.mjs` or the existing release gate, `scripts/inbound-media-cdp.mjs`, relay security negative controls, and production verification fixtures.
- Physical Safari/installed-PWA device validation and the security-owner approval record are release dependencies, not substitutes for automated tests.
