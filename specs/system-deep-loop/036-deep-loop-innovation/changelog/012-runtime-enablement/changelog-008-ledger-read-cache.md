---
title: "Changelog: Ledger Read Cache [012-runtime-enablement/008-ledger-read-cache]"
description: "Opt-in, default-off verified-events read cache on AppendOnlyLedger, enabled on the per-lineage effect ledger for a measured ~40% per-dispatch win."
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

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/008-ledger-read-cache` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement`

### Summary

Added an opt-in, default-off verified-events read cache on `AppendOnlyLedger` so the effect producer's per-lineage ledger stops paying the exclusive-lock read floor on every read. Measured ~40% per-dispatch win; residual concurrent serialization from synchronous durable writes was ratified as accepted.

### What Changed

- Extended `AppendOnlyLedger` with `singleWriterReadCache` constructor option; cache invalidated on the instance's own successful append.
- Routed `readVerifiedEvents` and `getVerifiedHead` through `#scanForRead` with memo on hit and lock-plus-scan on miss.
- Enabled the flag only on the per-lineage effect ledger in `fanout-effect-dispatch.ts`; all existing consumers remain default-off.
- Proved cache-on does one verified scan for N reads, re-scans after append, and default-off preserves byte-identical lock-per-read behavior.

### Status

Complete. New read-cache suite 6/6 green; authorized-ledger regression 52/53 with one pre-existing multiprocess flake causally excluded from this change.
