---
title: "Changelog: Deep-Research Enablement [012-runtime-enablement/002-deep-research-enablement]"
description: "Pilot mode write-protocol migration onto the append gateway, authority flip on observed classification evidence, and post-flip fan-out proving the legacy file is a pure projection."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-22

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/002-deep-research-enablement` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement`

### Summary

Migrated the deep-research write protocol onto the gateway and executed the pilot authority flip end to end on observed classification evidence. Post-flip fan-out writes through the gateway; the legacy state file is a projection the direct-append guard verifies.

### What Changed

- Wired the gateway to resolve authority through `admitCanonicalWrite` and refuse fail-closed on denial, malformed records, or unknown modes.
- Added `prepareCutover` as the promotion edge from `legacy_authoritative` to `cutover_ready` at the same epoch.
- Moved classification evidence derivation into production code and added `observeRestartFacts` with fail-closed ledger presence checks.
- Declared `state_write_protocol` once in both command manifests, naming the gateway as the mechanism for every `append_to_jsonl` directive.
- Executed the pilot flip to `new_authoritative_reversible` via `AuthorityFlipCoordinator.requestCutover` on a MIGRATE round-trip drill.
- Proved post-flip multi-leaf fan-out writes through the gateway with byte-for-byte projection verification.

### Status

Complete. The pilot pattern is proven; fleet enablement can follow the same mechanism at scale.
