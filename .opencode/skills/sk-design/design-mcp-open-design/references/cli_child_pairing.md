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
| [`DESIGN_PROOF_TOKEN`](../../shared/design_proof_token.md) | Defines token minting, digest convention, freshness, replay, surface binding, and validator behavior. This document references that contract and does not redefine token internals. |
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
    "childLoadedSkills": ["sk-design", "design-mcp-open-design"],
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
      ".opencode/skills/sk-design/design-mcp-open-design/SKILL.md",
      ".opencode/skills/sk-design/design-mcp-open-design/references/guarded_proxy.md"
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

The [`Agent I/O Contract`](../../../system-spec-kit/references/workflows/agent-io-contract.md) is optional-advisory. It may carry routing hints, summaries, evidence fields, or the transport-result payload as data, but it is not the Open Design gate.

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

---

## Open Design Transport Assertion Pairing

`OPEN_DESIGN_TRANSPORT_ASSERTION v1` is the child-side, pre-operation assertion paired with the post-operation `OPEN_DESIGN_TRANSPORT_RESULT v1`. It is evidence the parent re-validates, not a replacement authorization token, and it reuses `DESIGN_PROOF_TOKEN v1` §2 for digest field shape and §6 for boundary-side recompute-and-reject rules. This section defines no second token schema.

Every Open Design transport operation that returns a transport result MUST also carry a structured transport assertion. A prose claim that the child loaded design context, checked live tools, or used a particular payload is not enough; the assertion must be content-bound so the parent can recompute it and compare it to the returned result and the originating dispatch manifest.

### Assertion Schema

The child MUST emit the assertion as structured metadata named `OPEN_DESIGN_TRANSPORT_ASSERTION v1`.

| Field | Type | Required | Meaning |
|---|---:|---:|---|
| `version` | integer | yes | Contract version. For this assertion contract the value is `1`. |
| `dispatchId` | string | yes | Parent-issued dispatch identity. It MUST match the paired transport result and originating dispatch manifest. |
| `childLoadedSkills` | string array | yes | Skills the child loaded before the Open Design operation. A design-affecting operation MUST include design judgment and Open Design transport. |
| `operationClass` | string | yes | One of `read`, `mutating`, `destructive`, or `transport`. The value is conservative and MUST NOT downgrade observed behavior. |
| `liveToolsListVerified` | boolean | yes | Whether the child verified the live Open Design tool surface before relying on tool names, availability, or mutability. |
| `payloadDigests` | object | yes | Content-bound digests for the dispatch and operation payload, using the digest field shape from `DESIGN_PROOF_TOKEN v1` §2. Required keys are `designManifestDigest`, `transportAssertionDigest`, `briefDigest`, `formAnswersDigest`, `openDesignLineageDigest`, and `proofCardDigest` when those materials are part of the operation. |
| `assertionDigest` | string | yes | Digest of the assertion envelope excluding `assertionDigest` itself. The parent recomputes this before accepting any assertion field. |

```json
{
  "OPEN_DESIGN_TRANSPORT_ASSERTION": {
    "version": 1,
    "dispatchId": "dispatch-open-design-example",
    "childLoadedSkills": ["sk-design", "design-mcp-open-design"],
    "operationClass": "mutating",
    "liveToolsListVerified": true,
    "payloadDigests": {
      "designManifestDigest": "sha256:<digest>",
      "transportAssertionDigest": "sha256:<digest>",
      "briefDigest": "sha256:<digest>",
      "formAnswersDigest": "sha256:<digest>",
      "openDesignLineageDigest": "sha256:<digest>",
      "proofCardDigest": "sha256:<digest>"
    },
    "assertionDigest": "sha256:<digest>"
  }
}
```

### Result-Assertion Pairing Rule

For each Open Design transport operation, the child return MUST carry both blocks:

1. `OPEN_DESIGN_TRANSPORT_ASSERTION v1`, emitted before the operation or at the earliest child boundary where the operation inputs are known.
2. `OPEN_DESIGN_TRANSPORT_RESULT v1`, emitted after the operation as the post-operation receipt.

The two blocks are a pair only when `dispatchId`, `operationClass`, and every shared payload digest reconcile. The assertion's `payloadDigests` MUST match the corresponding transport-result digest fields and the originating dispatch manifest. A digest present in only one side is not accepted unless the operation class makes that material inapplicable and the parent can reconstruct that inapplicability from the dispatch and result.

The assertion is checkable only when the parent can recompute the asserted digests from material it holds or receives back. If the parent cannot reconstruct a digest input unambiguously, the assertion does not pass.

### Parent Re-Validation Extension

The parent runs the existing transport-result re-validation first, then applies this extension to the paired assertion:

1. Require a structured `OPEN_DESIGN_TRANSPORT_ASSERTION v1` whenever Open Design transport was used and a structured result is required.
2. Schema-check assertion fields, supported version, required conditionals, operation-class values, digest shape, and types.
3. Recompute `assertionDigest` from the assertion envelope excluding `assertionDigest`.
4. Recompute `payloadDigests` using `DESIGN_PROOF_TOKEN v1` §2 digest field shape and the §6 recompute-and-reject discipline.
5. Compare assertion digests to the paired result digests and to the originating dispatch manifest.
6. Confirm `childLoadedSkills` includes design judgment and Open Design transport for design-affecting work.
7. Confirm `operationClass` is at least as strict as the behavior reconstructed from the result, artifacts, run state, and tool-call evidence.
8. Confirm `liveToolsListVerified` is `true` when the child relied on live Open Design tool names, availability, or mutability.
9. Return `ALLOW` only when the existing transport-result re-validation and this assertion extension both pass. Return `DENY` for missing, malformed, ambiguous, mismatched, stale, downgraded, non-recomputable, or exception paths.

### Assertion Deny Rules

| Rule | Denial condition |
|---|---|
| Missing assertion after Open Design use | If Open Design was used and no structured `OPEN_DESIGN_TRANSPORT_ASSERTION v1` accompanies the required result, deny the handoff. |
| Assertion digest mismatch | If `assertionDigest` cannot be recomputed from the assertion envelope excluding itself, deny the handoff. |
| Result-assertion mismatch | If any assertion payload digest conflicts with the paired transport-result digest fields, deny the handoff. |
| Manifest-assertion mismatch | If any assertion payload digest conflicts with the originating dispatch manifest or cannot be reconstructed from parent-held material, deny the handoff. |
| Operation-class downgrade | If the assertion declares a less strict operation class than the observed Open Design behavior, deny the handoff. |
| Live-tools verification missing | If the operation depended on live tool names, availability, or mutability and `liveToolsListVerified` is not `true`, deny the handoff. |
| Missing design judgment | If `childLoadedSkills` does not show design judgment for design-affecting work, deny the handoff. |

### Named Residual

A text-only or unmodifiable child may emit the assertion as prose or omit it entirely. In that path, assertion checking degrades to **ADVISORY** because the parent has no structured assertion envelope to recompute.

The enforceable floor remains parent demand-back plus the existing transport-result re-validation, and both fail closed. The parent may report supplied assertion-like prose as advisory evidence, but it must not claim a machine-checkable assertion pass from prose alone.

### Assertion Pairing Acceptance

This assertion-pairing extension is acceptable when all of these are true:

| Requirement | Acceptance condition |
|---|---|
| Assertion schema | `OPEN_DESIGN_TRANSPORT_ASSERTION v1` defines `version`, `dispatchId`, `childLoadedSkills`, `operationClass`, `liveToolsListVerified`, `payloadDigests`, and a self-excluding `assertionDigest`. |
| Result-assertion pairing | Every Open Design transport operation carries both the assertion block and the result block, and shared digests reconcile against the paired result and originating dispatch manifest. |
| Parent re-validation | Parent validation cites and reuses `DESIGN_PROOF_TOKEN v1` §2 and §6 for digest shape and recompute-and-reject behavior, without defining a second token schema. |
| Deny mapping | Missing assertion, digest mismatch, manifest mismatch, operation-class downgrade, missing live-tools verification, missing design judgment, and non-recomputable assertion digest each map to fail-closed `DENY`. |
| Named residual | Text-only or unmodifiable child paths are explicitly advisory for assertion checking, with parent demand-back plus transport-result re-validation as the fail-closed enforceable floor. |
| File integration | This section is appended after the existing contract sections, with prior contract text unchanged. |

---

## Register Acceptance Gate

The cross-CLI design dispatch boundary MUST fail closed when the effective design register is unresolved or outside the accepted register policy. The parent resolves the effective register before launch using `registerPolicy.resolutionOrder` and the operating postures defined by `shared/register.md`: Brand means the design is the product; Product means the design serves the product.

The membership source is `registerPolicy.accepted` in `command-metadata.json`. The parent reads that field by reference and MUST NOT maintain a second hardcoded accepted-register list in this contract, prompts, or child dispatch glue.

### Parent Re-Validation Extension

The parent applies this extension before launching a cross-CLI design child, and again at demand-back when the child returns machine-readable register material:

1. Resolve the effective register in policy order from the explicit flag, declared register, task cue, surface in focus, and safe default sources named by `registerPolicy.resolutionOrder`.
2. Interpret the resolved value using `shared/register.md`; `unknown` means the register file was not read and no posture judgment was made.
3. Test the resolved value against `registerPolicy.accepted` from `command-metadata.json`.
4. Return `DENY` before launch when the value is `unknown`, empty, absent, malformed, or not a member of `registerPolicy.accepted`.
5. Escalate unresolved register state through `STATUS=ASK MISSING_REGISTER`; do not coerce a default at this boundary.
6. Return `ALLOW` for the register check only when the resolved value is accepted by policy. The existing transport-result, assertion, token, digest, operation-class, and demand-back checks still have to pass independently.

An unresolved register is a missing precondition. It inherits the same deny-by-default posture as every other missing, ambiguous, stale, mismatched, or non-recomputable boundary input in this contract.

### Register Deny Rules

| Rule | Denial condition |
|---|---|
| Unknown register | If the effective register is `unknown`, deny before launch and escalate with `STATUS=ASK MISSING_REGISTER`. |
| Missing register | If no effective register can be reconstructed from the dispatch manifest, policy resolution inputs, or machine-readable child material, deny before launch or demand-back. |
| Out-of-set register | If the effective register is present but not a member of `registerPolicy.accepted`, deny before launch or demand-back. |
| Parallel accepted list | If the boundary relies on a copied accepted-register list instead of reading `registerPolicy.accepted`, the membership check is invalid and the dispatch is denied until reconciled. |

### Register Truth Table

| Effective register | Boundary result |
|---|---|
| `unknown` | `DENY`; ask with `STATUS=ASK MISSING_REGISTER`; do not launch the child. |
| `marketing` | `DENY`; this is an out-of-set token even though it is concrete. |
| `brand` | Passes the register membership check. |
| `product` | Passes the register membership check. |

### Named Residuals

Register correctness on a genuinely mixed surface is advisory. The deterministic gate proves only that the value is a member of `registerPolicy.accepted`; it cannot prove the selected accepted posture is the right design judgment for a surface where Brand and Product dials diverge.

A text-only child with no machine-readable register field degrades register checking to **ADVISORY**. That residual is bounded by the existing text-only Named Residual and parent demand-back: the parent may report prose evidence, but it must not claim a machine-checkable register pass without structured material to reconstruct.

### Register Acceptance

This register gate is acceptable when all of these are true:

| Requirement | Acceptance condition |
|---|---|
| Membership test | The parent tests the effective register against `registerPolicy.accepted` read from `command-metadata.json`. |
| Fail-closed deny | `unknown`, empty, missing, malformed, or out-of-set register values return `DENY` before child launch or at demand-back. |
| Accepted postures | `brand` and `product` pass the register membership check because they are accepted by the policy field. |
| ASK reuse | Unresolved register state escalates through `STATUS=ASK MISSING_REGISTER`; no new escalation token or silent default is introduced. |
| Single source | `registerPolicy.accepted` is the only accepted-register membership source; no parallel hardcoded list is introduced. |
| Named residuals | Mixed-surface register correctness and text-only child register evidence are named as advisory residuals. |
