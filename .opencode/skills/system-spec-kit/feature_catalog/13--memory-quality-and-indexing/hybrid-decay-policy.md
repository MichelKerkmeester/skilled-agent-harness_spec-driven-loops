---
title: "Hybrid decay policy"
description: "Hybrid decay policy applies type-aware no-decay rules to permanent artifacts (decision, constitutional, critical context types) while all other types follow the standard FSRS schedule, gated by the SPECKIT_HYBRID_DECAY_POLICY flag."
trigger_phrases:
  - "hybrid decay policy"
  - "SPECKIT_HYBRID_DECAY_POLICY"
  - "type-aware no-decay rules"
  - "FSRS schedule exemption"
  - "permanent artifact decay exemption"
version: 3.6.0.6
---

# Hybrid decay policy

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Hybrid decay policy applies type-aware no-decay rules to permanent artifacts (decision, constitutional, critical context types) while all other types follow the standard FSRS schedule, gated by the `SPECKIT_HYBRID_DECAY_POLICY` flag.

Some memories should never fade. A decision record or a constitutional rule is just as important six months from now as it is today. Without this feature, all memories decay according to the same FSRS schedule, causing important permanent artifacts to gradually lose relevance. The hybrid decay policy classifies each spec-doc record by its context type and assigns permanent artifacts an infinite stability, exempting them from decay while letting everything else follow the normal forgetting curve.

---

## 2. HOW IT WORKS

Enabled by default (graduated). Set `SPECKIT_HYBRID_DECAY_POLICY=false` to disable.

The `isHybridDecayPolicyEnabled()` function in `fsrs-scheduler.ts` checks the flag. When enabled, the `classifyHybridDecay()` function maps context types to one of two decay classes:

- **no_decay**: `decision`, `constitutional`, `critical` context types receive `Infinity` stability (no decay).
- **fsrs_schedule**: All other context types follow the standard FSRS v4 power-law decay.

The `applyHybridDecayPolicy()` function wraps the stability value, returning `Infinity` for no-decay types and the original stability for others. When the flag is disabled, stability passes through unchanged for all types.

The FSRS v4 formula for standard decay is: `R(t) = (1 + 19/81 * t/S)^(-0.5)` where `t` = elapsed days and `S` = stability.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cognitive/fsrs-scheduler.ts` | Lib | `isHybridDecayPolicyEnabled()`, `classifyHybridDecay()`, `applyHybridDecayPolicy()`, FSRS v4 algorithm |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isHybridDecayPolicyEnabled()` flag accessor (central registry) |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/fsrs-hybrid-decay.vitest.ts` | Automated test | Hybrid decay classification, no-decay enforcement |
| `mcp_server/tests/hybrid-decay-policy.vitest.ts` | Automated test | Hybrid decay policy flag gating and integration |

---

## 4. SOURCE METADATA
- Group: Memory Quality And Indexing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `13--memory-quality-and-indexing/hybrid-decay-policy.md`
Related references:
- [assistive-reconsolidation.md](assistive-reconsolidation.md) — Assistive reconsolidation
- [save-quality-gate-exceptions.md](save-quality-gate-exceptions.md) — Save quality gate exceptions
