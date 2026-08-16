<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Phase 1 — Authoritative rich-block contract and redacted projection

## Summary

This phase exposes relay-authored identity, lifecycle, completeness, and artifact metadata needed for later rich rendering. It keeps legacy clients and cached blocks on their existing safe paths while proving that only redacted projections enter persistence, replay, broadcast, cache fixtures, logs, and errors.

## Problem & Goal

The relay and protocol do not yet expose enough authoritative information for a safe rich-content projection, and clients must not infer pairing or lifecycle from adjacent content or output wording. The goal is to make the redacted rich-block contract safe and backward-compatible while preserving the existing read-only transcript transport and proving that no unredacted rich value can enter persistence, replay, broadcast, cache, or fixtures.

## Scope

### In scope

- Bounded protocol types and guards for opaque `callId`, shell genre, lifecycle/checkpoint, output completeness, block identity, revisions, redaction metadata, and trusted `TextArtifactBlock` metadata.
- Relay projection of stable call identity and authoritative lifecycle/checkpoint/truncation across tool execution and result revisions.
- Safe result-before-call and unmatched-result evidence.
- Redaction before relay-store persistence, replay, broadcast, fixtures, logs, and error reporting.
- Compatibility handling for old clients and cache entries without rich identity or redaction metadata.
- Deterministic protocol, relay, security, and baseline CDP fixtures.

### Out of scope

- Rich UI, inline cards, Copy, F6 Open, syntax highlighting, or fenced-code parsing; current Activity, prose, and safe fallback renderers remain visible.
- Any new transcript endpoint, auth action, mutation ticket, filesystem lookup, host-file operation, or change to the read-only `/api/sessions/:sessionId/transcript` and `/api/sync` transport contract.
- Classification of streaming paragraphs or optimistic prompts as artifacts.
- Changes to the fixed ink-on-parchment design system, WCAG AA requirements, or read-only-by-default security posture.

## User-facing behavior + states

N/A — internal. Existing Activity, prose, and safe fallback rendering remain the visible behavior until Phase 2.

## Acceptance criteria

- New shell-capable transcript blocks carry a stable `callId`, shell genre, authoritative lifecycle/checkpoint, completeness, block identity, and monotonic revision; legacy blocks remain safe non-rich inputs.
- Concurrent, out-of-order, duplicate, lower-revision, result-before-call, and terminal-without-result fixtures retain enough identity for the client to represent the specified state without adjacency matching.
- `isTranscriptBlock` and all new guards reject malformed rich fields and unknown rich variants before rendering.
- Redaction occurs before persistence, page response, sync broadcast, cache fixture generation, logs, and error reporting; no sentinel secret survives outside the expected redaction marker.
- The existing transcript page and `/api/sync` remain read-only and require no new mutation ticket or host-file operation.
- Old clients and cached legacy blocks continue to show their existing renderers, and the true-390px light/dark baseline screenshots show no layout regression.

## Security & Redaction

Rich fields remain projections of the already-redacted ledger. Command input, output, text-artifact source, tool names, and metadata are redacted before persistence and before replay or broadcast; only bounded redaction provenance is retained. Invalid identity, lifecycle, completeness, revision, discriminant, source-size, and redaction metadata is rejected before the web reducer. Fixtures use deterministic sentinels that the redactor replaces and never contain live secrets. The phase adds no endpoint, ticket, mutation path, filesystem lookup, or host operation. Security/privacy review must approve field propagation, redaction ordering, terminal/truncation semantics, fixture hygiene, and negative controls before rich-capable blocks are enabled.

## Dependencies & affected areas

- Protocol: `packages/pi-rpc-protocol/src/types.ts`, `packages/pi-rpc-protocol/src/guards.ts`, `packages/pi-rpc-protocol/src/index.ts`, and `packages/pi-rpc-protocol/tests/guards.test.ts`.
- Relay projection and storage: `apps/pi-remote-relay/src/store/transcript-projector.ts`, `apps/pi-remote-relay/src/store/redaction.ts`, `apps/pi-remote-relay/src/store/relay-store.ts`, and `apps/pi-remote-relay/src/replay/sync.ts`.
- Existing read-only transport verification: `apps/pi-remote-relay/src/http/server.ts` and the existing `/api/sessions/:sessionId/transcript`, `/api/sync`, and `sync:read` paths.
- Relay tests and fixtures: `apps/pi-remote-relay/tests/transcript-projector.test.ts`, `redaction.test.ts`, `store.test.ts`, `sync.test.ts`, `tests/security/negative-controls.test.ts`, and `apps/pi-remote-relay/src/fixtures/`.
- Web compatibility: `apps/pi-remote-web/src/relay.ts`, `apps/pi-remote-web/src/state.ts`, and `apps/pi-remote-web/src/cache.ts`.
- Baseline evidence: `scripts/rich-content-cdp.mjs` with the legacy Activity fixture.
