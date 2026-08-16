<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Normalized Pi Image Bridge and Redacted Transcript

## Summary

This phase delivers only normalized JPEG/PNG bytes to Pi through the existing image-bearing prompt, steer, and follow-up fields, then publishes only allowlisted redacted attachment cards. It also proves the pinned Pi build and configured provider do not persist or echo image payloads; the web UI may remain flag-gated while this boundary is verified.

## Problem & Goal

Validated image bytes still need a narrowly controlled host-to-Pi boundary, revision-checked atomic commit, acknowledgement handling, and durable redaction. The goal is to bridge normalized in-memory images without exposing source objects or paths, prevent stale/mismatched/unauthorized invocation, and ensure all transcript, sync, export, push, log, SQLite, and Pi-visible records remain metadata-minimal.

## Scope

### In scope

- Loading normalized bytes only after ownership, readiness, expiry, capability, plan-policy, and prompt-revision checks.
- Ordered image delivery for `prompt`, `steer`, and `follow_up`, including image-only empty-message turns and submission idempotency.
- Prompt revision coordination that advances on accepted user/runtime mutations, not streaming token events.
- Redacted attachment transcript projection and store/redaction enforcement.
- Strict normalized `ImageContent` protocol constraints without expanding browser submission DTOs to carry image data.
- Stale, model-mismatch, plan-mode, duplicate, rejection, dropped-acknowledgement, export/push, and workspace-immutability tests.
- Pinned-Pi/provider persistence and echo probe plus RPC framing and 1 MiB event-record verification.

### Out of scope

- Local composer pickers, draft storage, preview UI, upload orchestration, or end-to-end browser enablement.
- Host flag enablement when the pinned probe fails.
- Source-byte delivery, host paths, public URLs, provider-specific retention promises, or durable pixels/base64.
- Changes to the fixed ink-on-parchment design system, WCAG AA behavior, or read-only-by-default/plan-mode authority enforcement.

## User-facing behavior + states

N/A — internal. The web UI remains flag-gated or uses a redacted-card fixture only; the phase’s externally observable result is an ordered redacted attachment card with `delivered` or `delivery-unknown`, never an image preview or payload.

## Acceptance criteria

- Pi receives ordered normalized image blocks and never a host path or raw source object.
- A stale, mismatched, expired, replayed, text-only-model, or plan-policy-invalid set causes no Pi invocation.
- Positive acknowledgement deletes host bytes and publishes redacted cards; ambiguous acknowledgement is `delivery-unknown` and cannot auto-resend.
- Durable DTOs, sync frames, exports, push text, logs, SQLite, and Pi-visible transcript data contain no pixels, base64, filename, path, hash, URL, EXIF, OCR, provider payload, or decoder error.
- The pinned Pi/provider persistence and echo probe passes, or the media host capability remains disabled.

## Security & Redaction

The bridge opens normalized bytes only after final ownership, readiness, expiry, active-model `imageIn`, plan policy, and expected revision checks. Base64 construction is local to the host-to-Pi request and never enters browser HTTP JSON, the sync socket, SQLite, JSONL, logs, analytics, crash reports, or workspace paths. Prompt/steer/follow-up submissions are ordered and atomic; stale, mismatched, expired, replayed, text-only, or plan-invalid sets are rejected before Pi invocation. Only fixed redacted card fields are durable, and ambiguous acknowledgement cannot trigger an automatic resend. Image content remains untrusted input and cannot grant filesystem, process, network, shell, edit, approval, or mode authority.

## Dependencies & affected areas

- `apps/pi-remote-relay/src/attachments/pi-image-bridge.ts`
- `apps/pi-remote-relay/src/prompt/prompt-service.ts`
- Prompt revision coordinator under `apps/pi-remote-relay/src/prompt/` or the existing session authority seam
- `apps/pi-remote-relay/src/attachments/attachment-transcript-projector.ts`
- `apps/pi-remote-relay/src/store/transcript-projector.ts`
- `apps/pi-remote-relay/src/store/redaction.ts`
- `apps/pi-remote-relay/src/store/relay-store.ts`
- `packages/pi-rpc-protocol/src/types.ts`
- `packages/pi-rpc-protocol/src/guards.ts`
- `packages/pi-rpc-protocol/src/index.ts`
- `apps/pi-remote-relay/tests/prompt.test.ts`
- `apps/pi-remote-relay/tests/transcript-projector.test.ts`
- `apps/pi-remote-relay/tests/redaction.test.ts`
- `apps/pi-remote-relay/tests/security/negative-controls.test.ts`
- Pinned-Pi integration fixture/probe under `apps/pi-remote-relay/tests/integration/`

