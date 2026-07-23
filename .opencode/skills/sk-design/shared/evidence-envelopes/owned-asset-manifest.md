---
title: Owned Asset Manifest
description: Provider-neutral evidence contract for asset source, rights, dimensions, role, crop/aspect, checksum, and fallback without third-party hotlinking.
trigger_phrases:
  - "owned asset manifest"
  - "asset rights receipt"
  - "asset crop checksum fallback"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Owned Asset Manifest

## 1. OVERVIEW

This manifest records why an asset may be used and how a consumer should place it. It is evidence, not a downloader: reading the manifest never grants permission to fetch, execute, bundle, or redistribute the referenced material.

## 2. AUTHORITY AND BOUNDARY

Use one entry per owned, commissioned, generated-with-verified-rights, or separately licensed asset. A usable entry must point to a local repository path or an owner-controlled origin, record affirmative reuse rights, and provide a fallback that is independently safe to ship.

Hallmark binaries must never be hotlinked, copied, bundled, cached, or redistributed through this contract. The same prohibition applies to any third-party binary whose rights and hosting authority are not independently established. A Hallmark page or research citation may explain precedent, but it can never populate `source.location` for a shippable entry.

## 3. MANIFEST SHAPE

```json
{
  "version": "1.0",
  "assets": [
    {
      "id": "hero-product-overview",
      "source": {
        "location": "assets/hero/product-overview.webp",
        "kind": "owned-file",
        "controlledBy": "project-owner"
      },
      "rights": {
        "status": "owned",
        "holder": "project-owner",
        "license": null,
        "attribution": null,
        "reuse": "allowed"
      },
      "dimensions": {
        "width": 2400,
        "height": 1600,
        "unit": "px"
      },
      "role": "hero-primary",
      "crop": {
        "mode": "cover",
        "focalPoint": { "x": 0.62, "y": 0.44 }
      },
      "aspect": "3:2",
      "checksum": {
        "algorithm": "sha256",
        "value": "<64 lowercase hexadecimal characters>"
      },
      "fallback": {
        "assetId": "hero-product-overview-static",
        "reason": "animation unavailable or reduced motion requested"
      }
    }
  ]
}
```

## 4. FIELD CONTRACT

| Field | Required | Contract |
|---|---:|---|
| `id` | yes | Stable manifest-local identifier; it does not encode a provider name. |
| `source.location` | yes | Repository-relative path or owner-controlled origin. A third-party hotlink is invalid. |
| `source.kind` | yes | `owned-file`, `owner-hosted`, `commissioned`, `generated`, or `licensed-file`. |
| `source.controlledBy` | yes | Party that controls the file or hosting origin; never inferred from a URL. |
| `rights.status` | yes | `owned`, `commissioned`, `licensed`, `public-domain`, or `unknown`. `unknown` blocks use. |
| `rights.holder` | yes | Rights holder or accountable owner. |
| `rights.license` | conditional | License identifier or agreement reference for `licensed` and `public-domain` entries. |
| `rights.attribution` | conditional | Required credit when the applicable rights require it. |
| `rights.reuse` | yes | `allowed`, `restricted`, or `blocked`; only `allowed` is ready for direct use. |
| `dimensions` | yes | Intrinsic positive width and height with an explicit unit. |
| `role` | yes | Semantic placement role such as `hero-primary`, `editorial-support`, `product-proof`, or `background-texture`. |
| `crop` | yes | Intended fit plus optional normalized focal point (`0` through `1` on each axis). |
| `aspect` | yes | Intended rendered ratio, recorded separately from intrinsic dimensions. |
| `checksum` | yes | Digest of the exact local/shippable binary; use lowercase SHA-256. |
| `fallback` | yes | Another manifest `assetId` and the condition that selects it. The fallback must pass this contract independently. |

## 5. VALIDATION AND CONSUMPTION

An entry is ready only when all of these checks pass:

- `source.location` is local or owner-controlled and resolves to the exact binary named by `checksum`.
- `rights.status` is not `unknown`, `rights.reuse` is `allowed`, and any license or attribution condition is recorded.
- Intrinsic dimensions are positive, and the requested `aspect` and `crop` preserve the named role at each target layout.
- The SHA-256 digest matches the file that will ship.
- The fallback exists, is not the same entry, and has its own valid rights, dimensions, crop/aspect, and checksum evidence.

Consumers must not auto-fetch `source.location`, execute file content, or treat a checksum as permission. Acquisition and hosting remain explicit owner actions outside this document.

## 6. PROVENANCE OF THE CONTRACT

This is an independently worded, provider-neutral contract derived from research synthesis rather than copied source material.

| Field family | Relationship to the research precedent |
|---|---|
| `source`, `dimensions`, `role`, `fallback` | The source system demonstrated equivalent asset-manifest concerns. |
| `rights` | The source system carried a global rights posture; this contract promotes it to required per-asset evidence. |
| `crop` / `aspect`, `checksum` | Net-new fields added here for placement fidelity and exact-binary verification. |

