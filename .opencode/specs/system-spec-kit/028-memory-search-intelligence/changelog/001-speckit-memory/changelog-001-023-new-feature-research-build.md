---
title: "Changelog: New-Feature Research and Build [001-speckit-memory/023-new-feature-research-build]"
description: "Chronological changelog for the TRACK B new-feature arc: eval-v2 built and kept as the measurability gate, 3 features built default-off and fresh-Opus held, and the append-not-displace truncation finding."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-20

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/001-speckit-memory` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence`

### Summary

This milestone is the TRACK B new-feature arc that ran after the flag-resolution reckoning closed. The deleted-10 teachings were read as a research input and produced four candidate features. eval-v2 was built first as the measurability gate, because the old harness had hidden the deleted features behind eval-saturation and a new candidate measured on it would repeat that mistake. eval-v2 was built and kept on its own merit. Three features were then built default-off, benchmarked in prod mode and taken through a fresh-Opus hold decision. None earned a flip. The arc ran research to eval-v2 to build to benchmark to a fresh-Opus hold, and it surfaced the append-not-displace truncation finding that explains why a tail-additive feature reads as zero at prod K by construction. The full method lives in `008-new-feature-research-build/`.

### Added

- Added eval-v2 as kept measurability infrastructure: three non-self-recall classes (`thematic_multi_target`, `causal_chain` and `hard_negative`), a completeRecall@K metric at K of 3, 5 and 8 and a dual-mode eval-vs-prod fidelity measurement. The headline is the eval-saturation it exposed, eval-mode completeRecall@8 0.212 against prod-mode 0.036, a +0.176 fidelity gap.
- Added `SPECKIT_DETERMINISTIC_MULTIHOP` default-off, a second-hop append that gives an edge-hop target a recall path, recorded in [`../../feature-flags.md`](../../feature-flags.md).
- Added `SPECKIT_LANE_CHAMPION_BACKFILL` default-off, a reserved backfill slot for each lane champion.
- Added `SPECKIT_TRUE_CITATION_EMITTER` default-off, a clean shadow that produces the corpus's missing negative-citation labels.

### Changed

- Recorded the append-not-displace pattern as the key architectural finding. It is the only non-regressing architecture the campaign found, and because it appends to the tail while prod confidence-truncation keeps about three results, tail-additive recall is 0 at prod K by construction.

### Held

- Held `SPECKIT_DETERMINISTIC_MULTIHOP` on a prod completeRecall delta of 0.000. The appended hop-2 docs land at the tail and prod truncation cuts them. Next step is a scoped truncation-exemption probe on the causal_chain class with displacement accounting, which earns the flip on that class or proves tail-recall structurally doomed at prod K.
- Held `SPECKIT_LANE_CHAMPION_BACKFILL` on a 0.000 delta. It is structurally redundant with RRF, which already absorbs every lane champion. Next step is to retire the investment.
- Held `SPECKIT_TRUE_CITATION_EMITTER` on an under-counted positive label. The shadow is clean and produces the missing negatives, but its positive label depends on the assistant echoing the memory id. Next step is to fix the label with content-attribution and run a one-shot offline mining pass before any collection decision.

### Verification

- Strict parent validation on 028: PASS.
- Em-dash scan on the changelog folder: PASS, 0 matches.
- eval-v2 dual-mode fidelity: eval-mode completeRecall@8 0.212 versus prod-mode 0.036, the +0.176 gap that exposed the eval-saturation.
- Per-feature prod-mode benchmark: deterministic-multihop 0.000, lane-champion 0.000, true-citation-emitter held on the label limit rather than a measured failure.
- Fresh-Opus hold gate: all three held, eval-v2 kept as infrastructure independent of any feature decision.

### Files Changed

| File | Action | What changed |
|---|---|---|
| `feature-flags.md` | Modified | Added the 3 built-but-held flags with reasons and next steps, plus the eval-v2 kept-infrastructure note |
| `graph-metadata.json` | Modified | Added 008 to the parent children_ids |
| `spec.md` | Modified | Added the 008 row to the phase documentation map |
| `timeline.md` | Modified | Added the TRACK B research-and-build arc |

### Follow-Ups

- Run the multihop truncation-exemption probe on the causal_chain class with displacement accounting to settle whether a tail-additive feature can flip at prod K.
- Fix the true-citation-emitter positive label with content-attribution so its clean shadow can be scored.
- Retire the lane-champion-backfill candidate, redundant with RRF.
