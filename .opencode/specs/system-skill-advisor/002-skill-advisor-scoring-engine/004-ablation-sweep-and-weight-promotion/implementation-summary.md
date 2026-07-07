---
title: "Implementation Summary: Promote semantic lane to live"
description: "Promoted the skill-advisor semantic cosine lane with a conservative 0.05 live weight."
trigger_phrases:
  - "ablation sweep summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/004-ablation-sweep-and-weight-promotion"
    last_updated_at: "2026-05-13T20:20:00Z"
    last_updated_by: "codex"
    recent_action: "Promoted semantic lane"
    next_safe_action: "Review known plugin-bridge baseline failure if desired"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "decision-record.md"
      - "lane-registry.ts"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Summary: Promote semantic lane to live

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete — known Vitest baseline caveat |
| **Created** | 2026-05-13 |
| **Branch** | `002-ablation-sweep-and-promote` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Promoted `semantic_shadow` from a shadow-only cosine lane to a live scoring lane with a conservative `0.05` weight. The existing four live lanes were rebalanced so the live total is exactly `1.00`.

| Lane | Previous Live Weight | New Live Weight | Status |
|------|----------------------|-----------------|--------|
| `explicit_author` | 0.45 | 0.42 | Live |
| `lexical` | 0.30 | 0.28 | Live |
| `graph_causal` | 0.15 | 0.13 | Live |
| `derived_generated` | 0.15 | 0.12 | Live |
| `semantic_shadow` | 0.00 | 0.05 | Live |
| **Total** | **1.05** | **1.00** | - |

Artifacts shipped:
- Updated `skill_advisor/lib/scorer/lane-registry.ts`.
- Updated hardcoded lane-weight expectations in advisor status, recommend, unavailable, daemon probe, native scorer, and cosine-lane tests.
- Added `skill_advisor/tests/scorer/semantic-lane-promotion.vitest.ts` for live-weight normalization and routing baseline checks.
- Added ADR-001 in `decision-record.md`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Child 001 already shipped the real cosine lane. This packet intentionally did not build a weight-vector sweep harness because the existing `runLaneAblation` path only supports lane on/off ablation. Instead, it applied the selected conservative vector from the packet brief:

| Lane | New Weight |
|------|------------|
| `explicit_author` | 0.42 |
| `lexical` | 0.28 |
| `graph_causal` | 0.13 |
| `derived_generated` | 0.12 |
| `semantic_shadow` | 0.05 |

`shadowWeight` values were left unchanged because they belong to the separate parallel-shadow model.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Promote semantic at `0.05` | Gives cosine a live contribution without letting it dominate explicit/lexical evidence. |
| Do not build a sweep harness in this packet | Existing ablation is on/off only; weight-vector sweep is follow-on work. |
| Keep `shadowWeight` unchanged | The parallel-shadow model is separate from live fusion weights. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status |
|------|--------|
| Targeted scorer Vitest | PASS: `semantic-lane-promotion`, `native-scorer`, `semantic-shadow-cosine` |
| Typecheck | PASS: `npm run typecheck` from `mcp_server/` |
| Full `vitest run skill_advisor` | BASELINE FAIL: 300 total, 1 failed (`plugin-bridge` forced-local fail-open expectation) |
| Dist rebuild | PASS: `npx tsc --build` from `system-spec-kit/` |
| Strict spec validation: child 002 | PASS |
| Strict spec validation: parent 015 | PASS |
| Dist registry inspection | PASS: generated registry has `semantic_shadow` weight `0.05` and `live: true` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Eval coverage**: only covers prompts in the existing gold battery. Real-world intent-described prompts may differ.
2. **Lane competition**: bumping semantic weight reduces other lanes' weights; may underweight an explicit lane in some scenarios.
3. **Negative-result path**: if ablation shows no improvement, packet ships with `status: complete` and a documented "no-go" decision; the lane stays shadow-only.
<!-- /ANCHOR:limitations -->
