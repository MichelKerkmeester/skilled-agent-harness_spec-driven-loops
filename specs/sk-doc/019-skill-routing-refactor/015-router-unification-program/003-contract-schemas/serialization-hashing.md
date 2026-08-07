---
title: "Canonical Serialization and Domain-Separated Hashing"
description: "Normative byte-identity rules for the V1 unified-router contract family."
importance_tier: "critical"
contextType: "implementation"
---

# Canonical Serialization and Domain-Separated Hashing

This document is normative for every hashed V1 artifact. It closes the serialization and domain-separation question identified in synthesis §11.4 and implements the pinned base-plus-overlay identity from synthesis §2 and §4 Seam D.

## 1. Canonical JSON profile

The V1 profile is RFC 8785 JSON Canonicalization Scheme (JCS), narrowed as follows:

1. Encode the canonical JSON text as UTF-8 without a byte-order mark.
2. Sort object member names lexicographically by UTF-16 code units, matching ECMAScript string ordering and RFC 8785 property sorting.
3. Emit no insignificant whitespace. Separators are exactly `,` and `:`.
4. Object members whose value is `undefined` are invalid producer input and are omitted only at the producer boundary. Array holes and `undefined` array elements are invalid.
5. Every numeric value in a hashed body MUST be a finite integer. Fractions, `NaN`, and infinities are rejected. Values whose exact decimal meaning matters are decimal strings matching `^-?(0|[1-9][0-9]*)(\\.[0-9]+)?$`.
6. Collections declared by a schema are always present, including empty collections as `[]`. Producers never use `null` to stand for an empty collection.
7. Optional scalar fields are omitted when absent. `overlayHash: null` is accepted only as an input-boundary synonym for no overlay and is removed before hashing; therefore it is byte-identical to an omitted `overlayHash`.
8. Strings are emitted using JSON escaping. Lone UTF-16 surrogates in values or member names are invalid and rejected; valid surrogate pairs are preserved. Booleans and `null` otherwise retain their JSON meanings.

Canonicalization is a pure function. It does not observe locale, time, filesystem order, insertion order, or environment variables. The reference implementation is `lib/canonical.cjs`. It emits each recursively sorted member directly into the output text; it does not rebuild a JavaScript object before `JSON.stringify`, because ECMAScript reorders integer-index property names numerically.

### External reproduction vectors

`fixtures/canonical-vectors.json` is an external byte oracle: its expected strings were derived manually from the rules above, not produced by `lib/canonical.cjs`. The integer-index case is load-bearing. This input:

```json
{ "10": 1, "2": 2 }
```

serializes to these exact UTF-8 bytes:

```text
{"10":1,"2":2}
```

The checked-in oracle also covers a nested object, an array of objects, empty values, and UTF-16 key ordering. The harness compares canonical text to all five expected byte strings, then hashes the expected and actual strings independently with Node's `crypto` SHA-256. Two independent conforming implementations must produce the same bytes before a V1 compiler can pass the Stage-1 shadow gate described in synthesis §9.

## 2. Hash construction

Every V1 digest uses SHA-256 with domain separation:

```text
H(tag, value) = lowercase-hex(SHA-256(ASCII(tag) || 0x00 || canonicalBytes(value)))
```

The tag is non-empty printable ASCII and may not contain NUL. Digest fields are 64 lowercase hexadecimal characters. The NUL delimiter prevents a tag suffix from being confused with the first canonical byte.

## 3. Closed V1 domain-tag registry

No unregistered tag may be used. Adding or changing a tag mints a new contract version.

| Artifact or identity body | Domain tag |
|---|---|
| Compiled base policy | `speckit.router.CompiledPolicyV1` |
| Correction overlay | `speckit.router.CorrectionOverlayV1` |
| Effective policy identity tuple | `speckit.router.EffectivePolicyV1` |
| Route request facts | `speckit.router.RouteRequestV1` |
| Route decision | `speckit.router.RouteDecisionV1` |
| Route proof | `speckit.router.RouteProofV1` |
| Shared uncertainty budget | `speckit.router.UncertaintyBudgetV1` |
| Advisor projection | `speckit.router.AdvisorProjectionV1` |
| Typed route-gold projection | `speckit.router.TypedRouteGoldV1` |
| Human policy-card view | `speckit.router.PolicyCardV1` |

The registry is duplicated as an immutable object in `lib/canonical.cjs`; the harness checks it is closed and unique.

## 4. Identity-field definitions

### `basePolicyHash`

Take the complete `CompiledPolicyV1` object and exclude exactly `basePolicyHash`, `overlayHash`, and `effectivePolicyHash`. Canonicalize the remaining base body and hash it with `speckit.router.CompiledPolicyV1`. `activationGeneration` remains in the base body because it is an authored field of the compiled snapshot; the effective tuple binds it again explicitly to make the activation boundary auditable.

### `overlayHash`

Take the complete `CorrectionOverlayV1` object and exclude `overlayHash`. Canonicalize and hash it with `speckit.router.CorrectionOverlayV1`. The object binds exactly one `basePolicyHash`. No overlay is represented by omitting `overlayHash` from the compiled policy; a serialized `null` is never emitted.

### `effectivePolicyHash`

Construct this identity body, omitting `overlayHash` when no overlay is active:

```json
{
  "activationGeneration": 1,
  "basePolicyHash": "<64 lowercase hex>",
  "overlayHash": "<64 lowercase hex, optional>",
  "schemaVersion": "V1"
}
```

Hash it with `speckit.router.EffectivePolicyV1`. The digest changes if and only if the base digest, overlay presence/digest, schema version, or activation generation changes. This is the request-pinned `hash(base, overlay|null, schema, generation)` identity from synthesis §2 and §4 Seam D.

### `requestFactsHash`

Take the complete `RouteRequestV1` snapshot and exclude `requestFactsHash`. Canonicalize and hash it with `speckit.router.RouteRequestV1`. This binds `explicitMode` independently from evidence weighting, all observations, evidence provenance/trust, and `pinnedActivationGeneration` as required by synthesis §2.1 and §8.1.

### `proofHash`

Take the complete `RouteProofV1` object and exclude `proofHash`. Canonicalize and hash it with `speckit.router.RouteProofV1`. The digest is evidence only; its presence grants no COMMIT capability.

### Projection hashes

- `AdvisorProjectionV1.projectionHash`: hash the complete projection excluding `projectionHash` with `speckit.router.AdvisorProjectionV1`.
- `TypedRouteGoldV1.projectionHash`: hash the complete projection excluding `projectionHash` with `speckit.router.TypedRouteGoldV1`.
- `PolicyCardV1.humanViewHash`: hash the complete parsed front-matter object excluding `humanViewHash` with `speckit.router.PolicyCardV1`.

Each projection also carries the same `effectivePolicyHash`, but matching that digest alone does not prove that a human view is complete; document replay remains a separate gate as synthesis §8.3 requires.

## 5. Schema evolution

V1 artifacts are immutable contracts. Any change to a hashed field's presence, name, type, meaning, ordering normalization, number rule, optional-scalar normalization, digest exclusion set, hash algorithm, or domain tag is breaking and mints the next version (`V1` to `V2`). `schemaVersion` participates in `effectivePolicyHash`, so a V2 snapshot cannot reuse a V1 effective identity even when other logical values appear equal.

Example: adding `riskClass` to the effective identity body changes hashed-field membership. A producer must emit an `EffectivePolicyV2` tuple under a new registered V2 tag; it may not silently add the field to V1.

Additive prose clarification that does not change bytes or validation semantics may retain V1. Schema changes that only tighten an unhashed compatibility description still require an explicit compatibility review because projections are independently hashed.
