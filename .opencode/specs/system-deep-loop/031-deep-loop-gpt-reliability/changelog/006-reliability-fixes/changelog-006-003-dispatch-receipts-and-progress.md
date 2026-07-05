---
title: "Changelog: Dispatch Receipts and Progress Records [031-deep-loop-gpt-reliability/006-reliability-fixes/003-dispatch-receipts-and-progress]"
description: "Planning-state changelog for the dispatch receipts and progress records child of the reliability-fixes track."
trigger_phrases:
  - "phase changelog"
  - "dispatch receipts changelog"
  - "progress records changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-07-03

> Spec folder: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability/006-reliability-fixes/003-dispatch-receipts-and-progress` (Level 1)
> Parent packet: `.opencode/specs/deep-loops/031-deep-loop-gpt-reliability`

### Summary

Status: Planned. This child defines two dispatch-integrity mechanisms for GPT reliability: engine-held HMAC dispatch receipts that cannot be forged by a child process, and step-transition progress records that distinguish real liveness from no-op heartbeats.

### Added

- Planned INTENT and COMPLETION dispatch receipt records, with the key kept inside the engine process.
- Planned post-dispatch validator that binds receipt parts and demotes model-written route fields when a valid receipt exists.
- Planned additive `progress_record` JSONL type with step-transition semantics and work-anchored fields.
- Planned reducer allowlist so progress records do not count as completion artifacts.

### Changed

- No production changes recorded for the active packet status. The child remains Planned under the 7-track status truth.

### Fixed

- Not yet fixed in this track state. The planned work targets receipt forgery, role absorption, route-proof fabrication and structured-mode dark-window stalls.

### Verification

- Not run for completion. Planned acceptance includes receipt key containment, forged-receipt rejection, wrapper routing across CLI branches, route-proof migration and progress reducer allowlist tests.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Authored | Planned receipt and progress requirements |
| `implementation-summary.md` | Authored | Planning-state closeout notes |

### Follow-Ups

- Execute after the Gate-3 validator work or as the standalone receipt/progress mechanism once the rollout boundary is ready.
- Re-run live acceptance cells after the compiled contract compiler wires these mechanisms into the live path.
