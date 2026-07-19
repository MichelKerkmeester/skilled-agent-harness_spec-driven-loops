---
title: "Open Design Freshness Invalidation"
description: "Consumer contract for rejecting stale, future-issued, malformed, absurd-span, replayed, or payload-mismatched design proof tokens at the boundary that has enough evidence to enforce each rule."
trigger_phrases:
  - "open design freshness invalidation"
  - "design proof token freshness consumer"
  - "ttl span reject rule"
  - "design proof replay residual"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Open Design Freshness Invalidation

This document defines the freshness consumer for `DESIGN_PROOF_TOKEN` validation. It does not define a second token schema. Token fields, boundary responsibilities, and validator acceptance are inherited by citation from [`DESIGN_PROOF_TOKEN` §2, §6, and §7](../../shared/design-proof-token.md#2-field-schema-v1).

The opencode boundary is token-only and stateless. It can enforce malformed-time, stale, future-issued, and unreasonable TTL-span checks because those are fully determined by `issuedAt` and `expiresAt`. Replay and payload mismatch are run-scoped residuals at that boundary: they are mandatory reject rules, but they require state or payload data held by the guarded proxy or parent.

## Freshness Axes

| Axis | Reject rule | Enforcement label | Enforcement home |
|---|---|---|---|
| Stale / expired | `now >= expiresAt` -> reject. | CODE-ENFORCED at the opencode boundary. | The opencode structural token check rejects tokens outside `issuedAt <= now < expiresAt`. |
| Future-issued | `issuedAt > now` -> reject. | CODE-ENFORCED at the opencode boundary. | The same opencode time-window check rejects tokens minted in the future. |
| Malformed timestamp | `issuedAt` or `expiresAt` parses to a non-finite time -> reject. | CODE-ENFORCED at the opencode boundary. | The opencode time parser fails closed before evaluating the window. |
| TTL span | `expiresAt - issuedAt` is unreasonably large for a short-lived token -> reject. | CODE-ENFORCED at the opencode boundary. | The opencode boundary applies a generous hard ceiling; minting still follows the approximately 300s default in the proof-token contract. |
| Replay | A `nonce` and `runId` pair has already been consumed -> reject. | RUN-SCOPED RESIDUAL at the opencode boundary. | The guarded proxy or parent must maintain a consumed-set keyed by `nonce` plus `runId` and consume successful tokens exactly once. |
| Subject / payload mismatch | Recomputed payload digests differ from the token values -> reject. | RUN-SCOPED RESIDUAL at the opencode boundary. | The guarded proxy or parent must rebuild the actual outgoing subject, brief, form-answer, lineage, surface, and reachable file-hash inputs and compare them to the token. |

## Boundary Contract

The opencode boundary MUST reject a guarded Open Design request when the structured token is absent, malformed, expired, future-issued, has non-finite timestamps, or carries an excessive `expiresAt - issuedAt` span. This applies to both the MCP-tool lane and the `od` CLI lane because both validate through the same structural token path.

The opencode boundary MUST NOT claim replay or payload-digest closure from token structure alone. It can require `singleUse: true`, `nonce`, `runId`, and well-formed digest fields, but that is not the same as proving the nonce was unused or that the digest inputs match the actual outgoing payload.

The guarded proxy or parent MUST close those residuals before forwarding a design-affecting call:

| Residual | Required state or evidence | Reject when |
|---|---|---|
| Replay consumed-set | A run-scoped set keyed by `nonce` and `runId`, updated after successful validation. | The pair is absent, already consumed, or cannot be persisted for the run. |
| Payload recompute | The actual outgoing payload inputs named by the proof-token contract. | Any recomputed digest, target surface, or reachable file hash cannot be reconstructed or differs from the token. |

## Acceptance

| Scenario | Expected result |
|---|---|
| Token has finite timestamps and `issuedAt <= now < expiresAt`, with a short-lived span. | ACCEPT at the opencode time-window layer, subject to the other structural checks. |
| Token has `now >= expiresAt`. | REJECT as stale or expired. |
| Token has `issuedAt > now`. | REJECT as future-issued. |
| Token has non-finite `issuedAt` or `expiresAt`. | REJECT as malformed-time. |
| Token has an excessive `expiresAt - issuedAt` span. | REJECT as freshness-defeating TTL span. |
| Token reuses a consumed `nonce` and `runId`. | REJECT at the run-scoped proxy or parent consumed-set. |
| Token digest fields do not match the actual outgoing payload. | REJECT at the run-scoped proxy or parent recompute point. |

## Implementation Notes

The expected mint-side TTL remains approximately 300 seconds by default, per the proof-token field schema and validator acceptance. A larger opencode ceiling is only a defensive upper bound against obviously non-fresh tokens, not permission to mint long-lived design authorization.

Consumers should cite the proof-token contract for the field schema, boundary requirements, and validator acceptance. This document only enumerates freshness invalidation responsibilities and names which boundary can enforce each one.
