---
title: "Implementation Summary: convert the two direct-dispatch deep commands to yaml-backed"
description: "Level 2 implementation summary — skill-benchmark and ai-system-improvement now own workflow YAML + a presentation asset, with a byte-identical loop-host dispatch."
trigger_phrases:
  - "deep direct dispatch to yaml"
  - "skill-benchmark ai-system-improvement yaml-backed"
  - "byte identical loop-host dispatch"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/064-deep-command-family-parity/002-direct-dispatch-to-yaml"
    last_updated_at: "2026-07-13T14:15:00Z"
    last_updated_by: "claude"
    recent_action: "WS3 + WS4 conversions implemented and verified byte-identical"
    next_safe_action: "Proceed to child 003 (deep-* agent create-agent reconciliation)"
    completion_pct: 100
---
# Implementation Summary: convert the two direct-dispatch deep commands to yaml-backed

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-direct-dispatch-to-yaml |
| **Completed** | 2026-07-13 |
| **Level** | 2 |
| **Actual Effort** | ~150 minutes (estimated: 150 minutes) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

`/deep:skill-benchmark` (Lane C) and `/deep:ai-system-improvement` (Lane D) — the last two direct-dispatch deep commands — now use the yaml-backed family shape. Each owns an auto workflow YAML, a confirm workflow YAML, and a 4-section presentation asset; each `command.md` resolves setup and then loads its YAML. The loop-host dispatch is byte-identical to the prior inline invocation.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/deep/assets/deep_skill-benchmark_auto.yaml` | Created | Autonomous single-dispatch wrapper for `--mode=skill-benchmark` |
| `.opencode/commands/deep/assets/deep_skill-benchmark_confirm.yaml` | Created | Same, plus one approval gate before dispatch |
| `.opencode/commands/deep/assets/deep_skill-benchmark_presentation.txt` | Created | 4-section presentation (Startup / Dashboard / Results / Next-Step) |
| `.opencode/commands/deep/skill-benchmark.md` | Modified | Rewired to yaml-backed; Phase 0 + input gate preserved |
| `.opencode/commands/deep/assets/deep_ai-system-improvement_auto.yaml` | Created | Autonomous single-dispatch wrapper for `--mode=non-dev-ai-system-refine` (dry-run default) |
| `.opencode/commands/deep/assets/deep_ai-system-improvement_confirm.yaml` | Created | Same, plus one approval gate and the `--live` pre-flight |
| `.opencode/commands/deep/assets/deep_ai-system-improvement_presentation.txt` | Created | 4-section presentation, self-target + kill-switch display |
| `.opencode/commands/deep/ai-system-improvement.md` | Modified | Rewired to yaml-backed; self-target fork + kill-switches preserved |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Read the loop-host flag-forwarding sets (`NON_DEV_AI_SYSTEM_RUN_OPTIONS`, `SKILL_BENCHMARK_RUN_OPTIONS`) and the shared `parse-args.cjs` dialect to fix the exact dispatch surface, captured a real skill-benchmark baseline, authored the minimal single-dispatch wrappers plus presentations, rewired both commands, then proved the converted dispatch byte-identical before writing the docs. The wrapper is deliberately minimal — one dispatch step reproducing the inline invocation — rather than a clone of model-benchmark's multi-iteration phase loop, which would add loop behavior these lanes never had.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Minimal single-dispatch wrapper, not a phase-loop clone | The loop host IS the self-contained loop for both lanes; adding iteration would fabricate behavior |
| `=`-form dispatch flags | `parse-args.cjs` binds `--k=v` and `--k v` identically, so `=`-form is effect-identical and reads cleanly |
| `--live` appended bare | The loop host parses `--live` as a boolean; a key/value form would break the flag |
| Self-target fork stays Markdown-owned | `--self-target` resolves `packaging_root` at setup and is never forwarded to loop-host, preserving the adapter argv |
| Presentation is a plain reference asset | skill-benchmark/ai-system are not compiler-registered, so no `renderMarkers` are needed — unlike alignment (phase 001) |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Adapter argv equivalence | Pass | Both commands, 8 flag combos | `planInvocation` harness → `ALL_ADAPTER_ARGV_IDENTICAL=true` |
| Report parity | Pass | skill-benchmark converted vs baseline | Byte-identical report (timestamps normalized) |
| Router-owned flags | Pass | `--self-target`, `--parallel` | Excluded from `loop-host.cjs` forwarding; absent from dispatch |
| Command conformance | Pass | All 8 deep commands | `validate_document.py --type command` → `8 pass / 0 fail` |
| Gate preservation | Pass | Both commands | Phase 0 + input gate + self-target fork + kill-switches intact |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| Dispatch templates | Covered by the argv-equivalence harness | Covered by the argv-equivalence harness | Covered by the argv-equivalence harness |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | No added dispatch overhead | One dispatch step, same process | Pass |
| NFR-S01 | Dry-run default; `--live` gated | `live` defaults false; pre-flight preserved | Pass |
| NFR-R01 | Deterministic dispatch | Same inputs → same loop-host argv | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The ai-system-improvement conversion was verified by adapter-argv equivalence, not a live execution, because no on-disk packaging implements the `benchmark/_loop/loop.py` contract (the pilot is absent). A dry-run execution diff should be re-run once a packaging root is available.
2. The deep-* agent reconciliation is child 003.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Full live-run behavior diff for both commands | Full report diff for skill-benchmark; adapter-argv equivalence for ai-system-improvement | No on-disk packaging implements the Lane D contract, so a live/dry-run execution was impossible; the argv-equivalence proof covers the same dispatch surface |
| Clone the model-benchmark YAML shape | Cloned only its scaffold, with a single-dispatch workflow | model-benchmark's phase loop reduces multi-iteration state these lanes do not have; a faithful conversion is the minimal wrapper |

<!-- /ANCHOR:deviations -->
