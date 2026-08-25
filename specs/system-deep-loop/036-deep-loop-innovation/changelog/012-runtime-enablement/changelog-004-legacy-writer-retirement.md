---
title: "Changelog: Legacy Writer Retirement [012-runtime-enablement/004-legacy-writer-retirement]"
description: "Direct-append detection guard, tree-wide inventory, and enforcement under finalized ledger authority without deleting workflow directives."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-24

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/004-legacy-writer-retirement` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement`

### Summary

Retired direct-append write paths by routing workflow directives through the gateway and guarding out-of-band writes, not by deleting prose protocol. Pinned legacy shapes keep their addresses by design; per-mode end-to-end currency is discharged by the whole-system gate's reader-contracts check.

### What Changed

- Inventoried 52 direct-append instruction sites across ten files and confirmed zero executable direct-append code paths — every append is agent-performed from YAML workflow prose.
- Added `check-direct-append.cjs` comparing legacy file sha256 against the gateway watermark `output_digest`; reports `DIRECT_APPEND_DETECTED` on mismatch.
- Gated the guard on ledger authority state so it stays inert under `legacy_authoritative` and enforces under `new_authoritative_reversible` and `new_authoritative_final`.
- Confirmed all twelve workflow assets with append directives declare `state_write_protocol`; nine projection contracts cover seven mode-owned surfaces with `modeOwned.uncovered=0`.

### Status

Complete. Retirement is achieved by mechanism and guard, not directive deletion; the guard fires on a real out-of-band append.
