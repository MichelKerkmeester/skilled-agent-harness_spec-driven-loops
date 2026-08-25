---
title: "Changelog: Append Gateway and Legacy Projection [012-runtime-enablement/001-append-gateway-and-projection]"
description: "Append gateway that binds, validates, authorizes, fences, and projects every mode event, plus the first production legacy projection contract and shell CLI entry point."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-08-19

> Spec folder: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement/001-append-gateway-and-projection` (Level 2)
> Parent packet: `specs/system-deep-loop/036-deep-loop-innovation/012-runtime-enablement`

### Summary

Delivered the canonical persistence boundary the deep-loop modes never had. A plain JSON record through a shell command now becomes an authorized, fenced, receipted ledger event, and the legacy state file is materialised from that ledger.

### What Changed

- Added `runtime/lib/mode-append-gateway/` with `appendModeEvent` composing bind, envelope, authorize, fenced append, and project.
- Added the first production projection contract in `runtime/lib/legacy-projections/deep-research-contract.ts`.
- Added `runtime/scripts/append-mode-event.cjs` as the shell entry point, loading TypeScript through the existing tsx pattern.
- Added two unit suites with ten tests and proven negative controls on authorization denial, projection failure, and fence concurrency.
- Fixed `deep-improvement-common` surface routing so every frozen-order mode routes through the gateway.

### Status

Complete. Authorization precedes the fence; projection refresh failure does not fail a durable append.
