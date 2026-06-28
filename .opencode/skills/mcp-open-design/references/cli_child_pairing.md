---
title: "Open Design CLI Child Pairing Contract"
description: "Return-path result contract for cross-CLI Open Design transport and parent-side fail-closed re-validation."
trigger_phrases:
  - "open design cli child pairing"
  - "open design transport result"
  - "parent re-validation"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Open Design CLI Child Pairing Contract

`OPEN_DESIGN_TRANSPORT_RESULT v1` is the return-path contract a CLI child emits after it uses Open Design transport. It gives the parent enough structured evidence to replay the operation boundary, compare digests, reconcile the proof-token reference, and deny a handoff that cannot be reconstructed.

This contract is the counterpart to two existing request-path contracts:

| Dependency | Boundary |
|---|---|
| [`DESIGN_PROOF_TOKEN`](../../sk-design/references/design_proof_token.md) | Defines token minting, digest convention, freshness, replay, surface binding, and validator behavior. This document references that contract and does not redefine token internals. |
| [`Open Design Guarded Proxy`](./guarded_proxy.md) | Defines the request-path precondition and guarded/exempt policy before an Open Design call is forwarded. This document references that policy and does not redefine the proxy. |

The transport result is a post-operation receipt, not a new authorization token. It never re-mints or extends a `DESIGN_PROOF_TOKEN`.

---

## Result Schema

The child MUST return the result as structured metadata named `OPEN_DESIGN_TRANSPORT_RESULT v1`. Prose summaries may accompany it, but prose is never the gate.

| Field | Type | Required | Meaning |
|---|---:|---:|---|
| `version` | integer | yes | Contract version. For this contract the value is `1`. |
| `dispatchId` | string | yes | Parent-issued dispatch identity for this child run. |
| `childLoadedSkills` | string array | yes | Skills the child loaded before the Open Design operation, including design judgment and transport when applicable. |
| `direction` | string | yes | One of `WIRE`, `READ`, or `RUN`, matching the Open Design workflow direction. |
| `operationClass` | string | yes | One of `read`, `mutating`, `destructive`, or `transport`, using the guarded-proxy policy classes by reference. |
| `liveToolsListVerified` | boolean | yes | Whether the child verified the live Open Design tool surface before relying on tool names or mutability. |
| `toolsCalled` | object array | yes | Ordered record of Open Design tools, CLI verbs, or adapter calls the child invoked. Empty only when no Open Design call occurred. |
| `toolsCalled[].surface` | string | yes | `mcp`, `http`, `cli`, or `skills`. |
| `toolsCalled[].toolOrVerb` | string | yes | Stable tool name, route, CLI command form, or Skills action. |
| `toolsCalled[].mutationClass` | string | yes | `read`, `mutating`, `destructive`, or `transport`. |
| `toolsCalled[].target` | string | conditional | Target project, run, artifact, file, route, or output identity for guarded calls. |
| `toolsCalled[].feedsDesignDecision` | boolean | yes | Whether the call's input or output shaped design work. |
| `toolCallDigests` | object array | yes | Digests for replayable call records, using the digest format and canonicalization rules defined by the proof-token contract. |
| `runId` | string | conditional | Open Design run identity, required when the operation creates, advances, polls, cancels, or validates a run. |
| `surfaceId` | string | conditional | Discovery-form or UI surface identity, required when the operation answers or pre-fills UI input. |
| `designManifestDigest` | string | conditional | Digest of the parent dispatch manifest the child actually received. |
| `transportAssertionDigest` | string | conditional | Digest of the transport assertion the child actually received. |
| `briefDigest` | string | conditional | Digest of the brief object actually sent to or used by Open Design. |
| `formAnswersDigest` | string | conditional | Digest of discovery-form answers actually sent to Open Design. |
| `openDesignLineageDigest` | string | conditional | Digest of the Open Design lineage object actually used. |
| `proofCardDigest` | string | conditional | Digest of the design proof card or equivalent judgment artifact carried into the operation. |
| `transportResultDigest` | string | yes | Digest of the result envelope excluding this field, so the parent can detect altered return metadata. |
| `designProofTokenRef` | object | conditional | Reference to the token that authorized this boundary. Required for guarded calls; forbidden to contain a full token re-mint. |
| `designProofTokenRef.nonce` | string | conditional | Nonce from the minted token. |
| `designProofTokenRef.runId` | string | conditional | Run boundary from the minted token. |
| `loadedTransportFiles` | string array | yes | Transport reference files the child loaded to perform Open Design work. |
| `artifactRefs` | object array | yes | Files, artifacts, preview URLs, run records, or project records produced or read by the operation. |
| `validationStatus` | string | yes | Child-side status: `pass`, `fail`, `blocked`, or `advisory`. |
| `missingFields` | string array | yes | Schema fields the child could not supply. Empty when complete. |

Required conditionals are evaluated by operation class. A guarded `RUN`, mutating call, destructive call, or read that feeds a design decision requires the dispatch, payload, lineage, result, and token-reference fields needed for parent replay.

```json
{
  "OPEN_DESIGN_TRANSPORT_RESULT": {
    "version": 1,
    "dispatchId": "dispatch-open-design-example",
    "childLoadedSkills": ["sk-design", "mcp-open-design"],
    "direction": "RUN",
    "operationClass": "mutating",
    "liveToolsListVerified": true,
    "toolsCalled": [
      {
        "surface": "mcp",
        "toolOrVerb": "start_run",
        "mutationClass": "mutating",
        "target": "project:settings-page",
        "feedsDesignDecision": true
      },
      {
        "surface": "cli",
        "toolOrVerb": "od ui respond",
        "mutationClass": "mutating",
        "target": "run:run-example surface:surface-example",
        "feedsDesignDecision": true
      }
    ],
    "toolCallDigests": [
      {
        "toolOrVerb": "start_run",
        "digest": "sha256:<digest>"
      },
      {
        "toolOrVerb": "od ui respond",
        "digest": "sha256:<digest>"
      }
    ],
    "runId": "run-example",
    "surfaceId": "surface-example",
    "designManifestDigest": "sha256:<digest>",
    "transportAssertionDigest": "sha256:<digest>",
    "briefDigest": "sha256:<digest>",
    "formAnswersDigest": "sha256:<digest>",
    "openDesignLineageDigest": "sha256:<digest>",
    "proofCardDigest": "sha256:<digest>",
    "transportResultDigest": "sha256:<digest>",
    "designProofTokenRef": {
      "nonce": "nonce-example",
      "runId": "run-example"
    },
    "loadedTransportFiles": [
      ".opencode/skills/mcp-open-design/SKILL.md",
      ".opencode/skills/mcp-open-design/references/guarded_proxy.md"
    ],
    "artifactRefs": [
      {
        "kind": "previewUrl",
        "ref": "<preview-url>"
      }
    ],
    "validationStatus": "pass",
    "missingFields": []
  }
}
```

---

## Parent Re-Validation

The parent treats the result as evidence to verify, not as a trust signal.

1. Determine whether Open Design was used from the child transcript, MCP/tool logs, explicit CLI call metadata, returned artifacts, or the dispatch scope.
2. If Open Design was used, require a structured `OPEN_DESIGN_TRANSPORT_RESULT v1`.
3. Schema-check required fields, types, operation-class values, and required conditionals for the operation class.
4. Recompute the dispatch manifest, transport assertion, payload, tool-call, and transport-result digests from the material available to the parent.
5. Compare recomputed digests to the result values and to the originating dispatch material.
6. Reconcile `designProofTokenRef.nonce` and `designProofTokenRef.runId` against the `DESIGN_PROOF_TOKEN` minted for this run boundary. The result may reference that token; it must not mint a substitute token.
7. Reconstruct the effective Open Design operation class from `toolsCalled`, returned artifacts, generated files, and run state. The declared `operationClass` must be at least as strict as the observed behavior.
8. Confirm every mutating or destructive Open Design call is present in `toolsCalled`, including the multi-turn case where `start_run` returns a form and a later UI response fires the build that writes files.
9. Return `ALLOW` only when the replay is complete and all comparisons pass. Return `DENY` for every missing, ambiguous, mismatched, stale, or exception path.

Operation-class consistency is conservative. A child may classify a pure read as guarded when the read fed a design decision, but it may not downgrade observed writes, run advancement, generated files, project creation, file writes, cancellation, deletion, UI responses, or other mutating behavior to `read` or `transport`.

---

## Deny Rules

The parent MUST fail closed for these cases:

| Rule | Denial condition |
|---|---|
| Missing result after Open Design use | If Open Design was used and no structured `OPEN_DESIGN_TRANSPORT_RESULT v1` is returned, deny the handoff. Natural-language summaries, Agent I/O envelopes, or artifact links do not satisfy this gate. |
| Digest mismatch | If the dispatch manifest digest, transport assertion digest, result digest, payload digest, tool-call digest, proof-card digest, or lineage digest cannot be recomputed or does not match the result and originating dispatch material, deny the handoff. |
| Unlisted mutating call | If a mutating or destructive Open Design call occurred and is absent from `toolsCalled`, deny the handoff. This includes a `start_run` flow whose later build wrote files without a matching tool record. |

The parent also denies on unsupported version, malformed schema, unsupported operation class, missing guarded-call token reference, token-reference mismatch, target/surface drift, unreadable required inputs, ambiguous reconstruction, stale replay state, or validator exception.

---

## Named Residual

`cli-claude-code` can be used in a text-only mode where the parent receives no machine-readable tool stream. In that path, the parent cannot deterministically prove the child did not replay a stale token or omit an Open Design call from prose.

For that path, digest matching degrades to **ADVISORY** when the only available evidence is text. The parent may report the residual and compare any supplied digest fields, but it must not claim a deterministic guarantee. A structured `OPEN_DESIGN_TRANSPORT_RESULT v1` plus replayable tool metadata is required for a machine-checkable pass.

This residual is not hidden by the result schema. It is the honest boundary of a text-only child channel.

---

## Agent I/O Is Not The Gate

The [`Agent I/O Contract`](../../system-spec-kit/references/workflows/agent-io-contract.md) is optional-advisory. It may carry routing hints, summaries, evidence fields, or the transport-result payload as data, but it is not the Open Design gate.

Absence of Agent I/O never allows an Open Design handoff. Presence of Agent I/O never replaces the structured transport result, proof-token reference, guarded-proxy classification, digest comparison, or parent re-validation algorithm.

---

## Acceptance

This contract is acceptable when all of these are true:

| Requirement | Acceptance condition |
|---|---|
| Result schema | `OPEN_DESIGN_TRANSPORT_RESULT v1` defines child-loaded skills, operation class, tools called, tool-call digests, payload digests, result digest, artifacts, validation status, and a `designProofTokenRef` that references nonce and run boundary without re-minting. |
| Parent deny rules | Missing result after Open Design use, manifest/assertion/result digest mismatch, and unlisted mutating Open Design calls each map to fail-closed `DENY`. |
| Contract citations | The proof-token and guarded-proxy contracts are cited as dependencies and are not redefined here. |
| Named residual | Text-only `cli-claude-code` without a machine-readable tool stream is named as advisory-only, with no deterministic guarantee. |
| Agent I/O boundary | Agent I/O is explicitly optional-advisory and is not accepted as the gate. |

---

## Cross-Delegation Token Laundering Guard

The laundering guard is the request-path token-side twin of the transport-result re-validation above. It prevents a child or delegated workflow from replaying, omitting, or weakening the `DESIGN_PROOF_TOKEN` while preserving the rule that this document consumes the proof-token contract and does not define a second token schema.

The guard reuses `DESIGN_PROOF_TOKEN v1` §2 for the replay-defense fields and §6 for boundary-side rejection rules. It applies those existing rules at the child design boundary and again at parent demand-back.

### Threat Model

| Attack | Definition |
|---|---|
| REPLAY | A child presents a token whose `nonce` and `runId` pair was already consumed by an earlier design-affecting operation. |
| OMIT | A child runs a design-affecting operation without the token, relying on absence being treated as exempt, advisory, or unverifiable. |
| WEAKEN | A child presents a token derived from a real mint but relaxed: `singleUse` stripped or flipped, `expiresAt` extended, `issuedAt` backdated, or `boundSurface` swapped away from the authorized target. |

### Deny Rules

The parent and any modifiable child boundary MUST fail closed for these cases:

| Rule | Denial condition |
|---|---|
| Replay consumed pair | Reuse the §2 replay defense and §6 consumed-pair rejection. The parent owns the run-scoped consumed set for `nonce` and `runId`; if that pair reappears after consumption, return `DENY` for the call or handoff. |
| Missing child design token | Reuse the §6 required-field rejection, elevated to mandatory token presence on every design-affecting child operation. Absence is never exempt; if the child operation affects design and no token is present, return `DENY` for the call or handoff. |
| Relaxed token fields | Reuse §6 single-use, time, TTL, surface, payload-digest, and file-hash validation against the original mint. If the presented token relaxes `singleUse`, extends or backdates the freshness window, changes `boundSurface`, or cannot reproduce the content-bound digests from the authorized material, return `DENY` for the call or handoff. |

Content-bound digests are the tamper evidence for weakening. A child may reference the minted token, but it must not re-mint, mutate, summarize, or substitute it to pass a looser boundary.

### Enforcement Points

1. **Child PreToolUse re-validation** runs before the design-affecting call. A modifiable child validates token presence, the unconsumed `nonce` and `runId` pair, field integrity against the original mint, target-surface match, freshness, and digest recomputation before any guarded call reaches Open Design.
2. **Parent demand-back** is the enforceable floor. The parent reconciles the returned `designProofTokenRef` and operation evidence against the original mint, the run-scoped consumed set, the outgoing target, and the transport-result replay. It returns `DENY` for replay, omission, weakening, ambiguity, stale state, or validator exception.

### Named Residual

An unmodifiable child CLI may ignore the guard and skip the child-side PreToolUse re-validation. That loses the early child-side denial and is covered only by the parent demand-back floor, which remains mandatory and fail-closed.

A fully compromised child that steals authorized inputs and forges a digest-valid token inside the freshness window is out of scope for child-side guarantees. The enforceable control remains the parent boundary: reconcile against the original mint, consumed set, target surface, and replayable operation evidence, then deny anything that cannot be reconstructed.

### Laundering Guard Acceptance

This guard is acceptable when all of these are true:

| Requirement | Acceptance condition |
|---|---|
| Attack coverage | REPLAY, OMIT, and WEAKEN are each defined as cross-delegation token-laundering attacks. |
| Deny mapping | Each attack maps to one fail-closed deny rule: consumed-pair replay, missing child design token, and relaxed token fields. |
| Proof-token reuse | The guard cites `DESIGN_PROOF_TOKEN v1` §2 and §6 for replay, required-field, single-use, time, TTL, surface, digest, and consumed-pair validation; it defines no new token schema. |
| Enforcement points | Child PreToolUse re-validation and parent demand-back are both named, with parent demand-back as the enforceable floor. |
| Named residuals | An unmodifiable child CLI and a fully compromised child forging a digest-valid token from stolen authorized inputs are named as residuals, not hidden by the guard. |
