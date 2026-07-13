---
title: "Implementation Summary: alignment render-pipeline parity + ai-council fix flip"
description: "Level 2 implementation summary — /deep:alignment joins the compiled-contract render pipeline and alignment + ai-council run in fix mode."
trigger_phrases:
  - "deep alignment render pipeline parity"
  - "ai-council fix rollout flip"
  - "contract drift clean"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/064-deep-command-family-parity/001-pipeline-command-parity"
    last_updated_at: "2026-07-13T14:00:00Z"
    last_updated_by: "claude"
    recent_action: "WS1 + WS2 implemented and verified; all P0 gates green"
    next_safe_action: "Proceed to child 002 (convert skill-benchmark + ai-system-improvement to yaml-backed)"
    completion_pct: 100
---
# Implementation Summary: alignment render-pipeline parity + ai-council fix flip

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-pipeline-command-parity |
| **Completed** | 2026-07-13 |
| **Level** | 2 |
| **Actual Effort** | ~110 minutes (estimated: 110 minutes) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

`/deep:alignment` now joins the compiled-contract render pipeline as a full peer of `research`/`review`/`ai-council`. Both `alignment` and `ai-council` run in `fix` injection mode. The whole registered command family is drift-clean and rendering.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/deep/assets/deep_alignment_presentation.txt` | Created | 4-section presentation, family-convention markers, placeholder-free slices |
| `.opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` | Modified | Registered `deep/alignment` (leaf-dispatch, native-only tools) |
| `.opencode/commands/deep/assets/compiled/deep_alignment.contract.md` | Regenerated | Machine-generated contract replaces the placeholder |
| `.opencode/skills/system-deep-loop/shared/rollout/command-injection-rollout.json` | Modified | `deep/alignment: fix` added; `deep/ai-council` → `fix` |
| `.opencode/commands/deep/assets/legacy/deep_alignment.body.md` | Modified | §2 owned-assets references the presentation; fallback note replaced |
| `.opencode/commands/deep/assets/compiled/deep_{ai-council,review,research}.contract.md` | Refreshed | Stale `mode-registry.json` (+ ai-council SKILL/agent) digests, body-identical |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read the compile/drift/render scripts directly to derive the three hard constraints (placeholder-free slices, tool-allowlist subset, sourcePaths superset), authored the presentation to satisfy them, registered the command, generated the contract, refreshed the stale peers, flipped the rollout, and verified every gate before writing the docs.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Reuse the ai-council/review marker convention | Makes alignment structurally diffable against its closest leaf-dispatch siblings |
| Native-only `tools.allowed`, no `Write`/`Edit`/`code_graph_context` | Required subset of the command frontmatter; matches alignment's read-only nature |
| Refresh the pre-existing stale peer contracts | `assertCompiledContractFresh` throws on any drift, so `review`/`research` were live-broken; the fix is body-identical |
| Leaf-dispatch shape (omit `delegationKind`) | Alignment dispatches one `@deep-alignment` LEAF per iteration, like `deep/review` |
| Owned-assets home is the legacy body | `alignment.md` is a 9-line thin router; editing only the legacy body also keeps the contract fresh |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Contract drift | Pass | All 4 registered commands | `node check-contract-drift.cjs` → `OK commands=4` |
| Render smoke | Pass | alignment + ai-council in `fix` | `renderCommandContract` `mode=fix`, contract injected, `manifest clean` |
| Placeholder-free slices | Pass | Both lifted slices | `PLACEHOLDER_PATTERN` → `CLEAN` |
| Command conformance | Pass | All 8 deep commands | `validate_document.py --type command` → `8 pass / 0 fail` |
| Body-identical refresh | Pass | ai-council, review, research | `BODY UNCHANGED` sha256 match |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| Pipeline scripts | Covered by drift + render CLIs | Covered by drift + render CLIs | Covered by drift + render CLIs |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | Compile + drift finish sub-second | Both complete locally in well under a second | Pass |
| NFR-S01 | Read-only native tool surface | `tools.allowed` omits `Write`/`Edit` | Pass |
| NFR-R01 | Deterministic compilation | Same sources → byte-identical body | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The two direct-dispatch commands (`skill-benchmark`, `ai-system-improvement`) are not yet yaml-backed — that is child 002.
2. The deep-* agent reconciliation is child 003.
3. `alignment.md`, the presentation, and the two YAMLs are compiler sources: any future edit requires `compile-command-contracts.cjs --command deep/alignment --write` to keep the contract fresh.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Edit `alignment.md` §2 owned-assets | Edited only `legacy/deep_alignment.body.md` §2 | `alignment.md` is a 9-line thin router; the owned-assets section lives in the legacy body |
| Refresh only ai-council's contract for the fix flip | Also refreshed `review` + `research` | The full drift sweep found all three stale on `mode-registry.json`; leaving `review`/`research` stale keeps a live-broken pipeline. Refresh proven body-identical |
| Level 3 child (per parent plan) | Level 2 child | The change is an additive registration into an existing pipeline plus a content asset, not an architecture change; Level 2 is the honest fit |

<!-- /ANCHOR:deviations -->
