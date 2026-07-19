---
title: DESIGN_PROOF_TOKEN Contract
description: Shared content-bound token contract for proving sk-design context, payload lineage, and freshness at design-affecting boundaries.
trigger_phrases:
  - "design proof token"
  - "content bound design token"
  - "sk design gate token"
  - "open design proof token"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# DESIGN_PROOF_TOKEN Contract

`DESIGN_PROOF_TOKEN v1` is the shared, content-bound proof token for design-affecting work. It binds loaded design context, the outgoing subject, brief, form answers, lineage, and freshness into one validator contract.

---

## 1. OVERVIEW

This token replaces self-attested checkboxes with structured metadata a boundary can recompute. The mint side computes hashes and digests from the actual authorized design context; the boundary side recomputes from the actual outgoing payload and rejects on absence, staleness, replay, surface drift, or mismatch.

The token is run-scoped and transport-neutral. It proves that the request carried the required design context and payload lineage; it does not prove that the resulting design is good.

---

## 2. FIELD SCHEMA (v1)

| Field | Type | Required | Meaning |
|---|---:|---:|---|
| `version` | integer | yes | Contract version. For this contract the value MUST be `1`. |
| `loadedFiles` | array | yes | Non-empty list of design-context files that were loaded before authorization. |
| `loadedFiles[].path` | string | yes | Repository-relative POSIX path used as the file identity key. |
| `loadedFiles[].sha256` | string | yes | `sha256:<64 lowercase hex>` digest of the loaded file's raw bytes. |
| `workflowModes` | string array | yes | Non-empty list of registry-valid sk-design workflow modes used for the decision. |
| `subjectDigest` | string | yes | Digest of the canonical subject string for the design-affecting request. |
| `briefDigest` | string | yes | Digest of the canonical brief object carried by the outgoing payload. |
| `formAnswersDigest` | string | yes | Digest of the canonical form-answer object carried by the outgoing payload. |
| `openDesignLineageDigest` | string | yes | Digest of the canonical lineage object carried by the outgoing payload. |
| `issuedAt` | string | yes | ISO-8601 UTC timestamp for token minting time. |
| `expiresAt` | string | yes | ISO-8601 UTC timestamp after which the token is invalid. Default TTL is approximately 300 seconds. |
| `singleUse` | boolean | yes | MUST be `true` for design-affecting operations. |
| `nonce` | string | conditional | Required when `singleUse` is `true`; unique per minted token. |
| `runId` | string | conditional | Required when `singleUse` is `true`; identifies the run boundary this token is bound to. |
| `mintedBy` | string | yes | Stable name of the sk-design minting component or workflow. |
| `boundSurface` | string | yes | Stable surface identity the token authorizes, such as a route, page, frame, file, or artifact target. |

All digest fields use `sha256:<64 lowercase hex>`. Unknown top-level fields MAY be ignored by older readers, but they MUST NOT weaken validation of the required v1 fields.

---

## 3. JSON SHAPE

```json
{
  "version": 1,
  "loadedFiles": [
    {
      "path": ".opencode/skills/sk-design/shared/context-loading-contract.md",
      "sha256": "sha256:4c61e5d5f5f8e9a7a02c17dc7a96f7a2e2a1dd39a7f0e8e3d7b84cfa44f56b2a"
    },
    {
      "path": ".opencode/skills/sk-design/shared/assets/proof-of-application-card.md",
      "sha256": "sha256:b9df8f2bcbf1b5e0c20d3e105a2db5d0802b257cb65ebf3ec779d99f7f8ce4c1"
    }
  ],
  "workflowModes": ["interface", "foundations"],
  "subjectDigest": "sha256:97cf3e7d3f45a02f6500d8d44ab227772adf51e0d8c0fd22b25c7e13e13d9c6b",
  "briefDigest": "sha256:0d6b8ce8b3f5d372f3c86f4f06cf7f575d8c7fe0f68b3f245d2a9916c4d73301",
  "formAnswersDigest": "sha256:6d57c0f6a25d8ad0d2a88e6e65f379dfb6a5a4d0a7db6a5567a8747b2f04ad19",
  "openDesignLineageDigest": "sha256:49889c3e468d55c2b68a1a69f34f03ecadce24383c41e861ec25d1a5571dc0e2",
  "issuedAt": "2026-06-28T12:00:00Z",
  "expiresAt": "2026-06-28T12:05:00Z",
  "singleUse": true,
  "nonce": "7a68a722-7d39-42e7-a11a-5c5d1f2716c5",
  "runId": "run_01j1designproof000000000000000",
  "mintedBy": "sk-design",
  "boundSurface": "settings/billing-page"
}
```

---

## 4. DIGEST CANONICALIZATION

`loadedFiles[].sha256` is computed over raw file bytes exactly as read from disk. Do not trim, normalize line endings, decode text, remove frontmatter, or resolve symlinks before hashing. The `path` field is not part of the file byte hash; it is the repository-relative POSIX identity key for the file.

Structured digests use canonical JSON:

| Rule | Contract |
|---|---|
| Encoding | Serialize to UTF-8 bytes. |
| Object keys | Sort keys by Unicode code point. |
| Separators | Use compact separators: `,` and `:` with no added whitespace. |
| Strings | Normalize every string value to NFC before serialization. |
| Arrays | Preserve array order exactly. |
| Integers | Serialize as base-10 integers without exponent notation. |
| Floating point | Not allowed in v1 digest inputs. Use strings or integers. |
| Booleans and null | Serialize as JSON `true`, `false`, and `null`. |
| Digest fields | Exclude the digest field being computed from its own input. |
| Missing optional data | Use the explicit empty canonical value for that digest input. |

`subjectDigest` is the SHA-256 digest of the canonical subject string, not a JSON object. Canonicalize the subject by normalizing to NFC, trimming outer whitespace, replacing every internal run of whitespace with a single U+0020 space, then UTF-8 encoding the resulting string. The empty/no-data subject canonical value is the empty string.

The structured digest inputs are:

| Digest | Input object | Empty/no-data canonical value |
|---|---|---|
| `briefDigest` | The exact brief object sent to the design-affecting operation, after canonical JSON normalization. | `{}` |
| `formAnswersDigest` | The exact form-answer object sent to the design-affecting operation, after canonical JSON normalization. | `{}` |
| `openDesignLineageDigest` | The exact lineage object sent to the design-affecting operation, after canonical JSON normalization. | `{"lineage":[]}` |

A validator MUST reject any digest whose input cannot be reconstructed unambiguously.

---

## 5. MINT-SIDE RESPONSIBILITIES

The mint side creates the token only after sk-design context is loaded and the design-affecting request is authorized.

It MUST:

| Step | Requirement |
|---|---|
| Version | Set `version` to `1`. |
| File proof | Record each loaded context file as `{path, sha256}` using repository-relative POSIX paths and raw-byte SHA-256. |
| Workflow modes | Record the non-empty workflow-mode bundle used for the decision. |
| Payload binding | Compute `subjectDigest`, `briefDigest`, `formAnswersDigest`, and `openDesignLineageDigest` from the actual outgoing subject, brief, form answers, and lineage. |
| Freshness | Set `issuedAt` to the minting instant and `expiresAt` to roughly five minutes later. |
| Replay defense | Set `singleUse: true` and include both `nonce` and `runId`. |
| Attribution | Set `mintedBy` and `boundSurface` to stable, validator-readable values. |
| Emission | Attach the token as structured metadata, not prose. |

The mint side MUST NOT copy a previous token, mint from summarized prose, or mint before the outgoing payload is known.

---

## 6. BOUNDARY-SIDE RESPONSIBILITIES

The boundary side validates before a design-affecting operation can run.

It MUST:

| Check | Requirement |
|---|---|
| Required fields | Reject if any required v1 field is absent. |
| Types | Reject if any field has the wrong type, an empty required array, or a malformed digest. |
| Version | Reject unsupported versions. |
| Time | Reject if `issuedAt` is in the future, if `expiresAt` is malformed, or if now is not before `expiresAt`. |
| TTL | Reject if `expiresAt - issuedAt` is unreasonable for a short-lived token. The default expected span is about 300 seconds. |
| Single use | Reject unless `singleUse` is exactly `true` for a design-affecting operation. |
| Replay | Reject a `nonce` and `runId` pair that has already been consumed. |
| Surface | Reject when `boundSurface` does not match the target surface of the outgoing operation. |
| Payload digests | Recompute the subject, brief, form-answer, and lineage digests from the actual outgoing payload and reject on mismatch. |
| File hashes | Recompute loaded-file hashes when the files are reachable and reject on mismatch. |
| Exceptions | Fail closed on validator exceptions, unreadable required inputs, stale token state, or ambiguous reconstruction. |

The boundary side MUST treat the token as evidence to verify, not as authority to trust.

---

## 7. VALIDATOR CONTRACT & ACCEPTANCE

A token is `VALID` only when all of these are true:

| Rule | Acceptance condition |
|---|---|
| Schema | All required fields are present, well typed, and v1-compatible. |
| Digests | All required digest fields exist and match recomputed values. |
| Files | `loadedFiles` is non-empty and every reachable file hash matches. |
| Modes | `workflowModes` is non-empty and every mode is registry-valid. |
| Time | `issuedAt <= now < expiresAt`, with no future-issued token. |
| TTL | The expiry window is short-lived and approximately five minutes by default. |
| Replay | `singleUse` is `true`, `nonce` and `runId` are present, and the pair has not been consumed. |
| Surface | `boundSurface` matches the outgoing operation's target surface. |

A token is `REJECTED` when any rule fails. Required rejection cases include:

| Case | Example failure |
|---|---|
| Missing required digest | `briefDigest` is absent, empty, malformed, or cannot be recomputed. |
| Malformed `expiresAt` | `expiresAt` is not ISO-8601 UTC, is before `issuedAt`, is too far from `issuedAt`, or is already expired. |
| Malformed `singleUse` | `singleUse` is missing, not a boolean, `false`, or lacks `nonce` or `runId`. |
| Replayed token | The same `nonce` and `runId` pair appears after successful consumption. |
| Surface mismatch | `boundSurface` does not match the actual target surface. |
| Payload mismatch | Any recomputed structured digest differs from the token value. |

Valid example: the JSON shape above is valid only if the file hashes and payload digests recompute to the same values, the current time is inside the token window, the nonce has not been consumed, and the target surface matches.

Reject examples:

```json
{ "version": 1, "briefDigest": "" }
```

Rejected because required fields and a required digest are missing or malformed.

```json
{
  "version": 1,
  "expiresAt": "five minutes from now",
  "singleUse": true,
  "nonce": "n",
  "runId": "r"
}
```

Rejected because `expiresAt` is not an ISO-8601 UTC timestamp and required fields are missing.

```json
{
  "version": 1,
  "singleUse": "true",
  "nonce": "n",
  "runId": "r"
}
```

Rejected because `singleUse` is a string, not the boolean `true`, and required fields are missing.

---

## 8. CONSUMERS

This contract defines the shared currency consumed by:

| Consumer purpose | Validation use |
|---|---|
| Run/build gate | Deny design-affecting execution unless a valid token is present. |
| Pre-tool-use precondition | Stop a guarded tool call before it reaches the design-affecting boundary. |
| Source-proof check | Confirm that cited context files and their hashes match the loaded design proof. |
| Cross-delegation laundering guard | Prevent a child or delegated workflow from replaying, omitting, or weakening the proof token. |
| Freshness check | Reject stale, future-issued, replayed, or subject-mismatched design authorization. |

This document names the consumers by purpose only. It does not build the gates, hooks, checks, guards, or freshness machinery.

---

## 9. VERSIONING

`version: 1` is frozen for this contract. Future versions may add fields, but they must not reinterpret any required v1 field.

Validators MUST reject unknown or unsupported versions. A v1 validator MAY ignore additive fields only after every required v1 check passes.
