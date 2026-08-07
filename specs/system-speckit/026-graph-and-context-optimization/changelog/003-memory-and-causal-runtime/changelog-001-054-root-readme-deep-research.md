---
title: "056: Root README Deep-Research Realignment (20-Iter cli-devin SWE 1.6)"
description: "20-iteration deep-research sweep of the root README across 7 thematic tracks using cli-devin SWE 1.6. Surfaced 263 findings including P0 tool-count drift, broken Quick Start paths and HVR voice violations. Verified delta applied via Sonnet @markdown with surgical edits scoped to confirmed drift."
trigger_phrases:
  - "056 root readme deep research"
  - "20 iteration cli-devin readme sweep"
  - "readme tool count drift"
  - "root readme hvr realignment"
  - "deep research readme audit 054"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/054-root-readme-deep-research` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Phase D (055-root-readme-realignment) ran a deliberately shallow single-pass audit that sampled rather than exhaustively covered the root README. It found 16 claims, marked 1 DRIFTED and 1 UNVERIFIED and shipped 12 surgical edits. This phase ran the deeper sweep Phase D skipped.

Twenty cli-devin SWE 1.6 iterations ran across 7 thematic tracks covering counts, claim accuracy, HVR voice, diagrams, external references, FAQ and Quick Start usability and cross-runtime claims. The sweep surfaced 263 findings including P0 tool-count drift across three README lines (66 tools reported where 69 existed), broken Quick Start build paths referencing non-existent package.json files, a broken agents directory path and 185 HVR voice violations concentrated in Track 3. A synthesis pass produced a consolidated research ledger and a 30-edit verified delta. Sonnet @markdown applied HVR-compliant surgical edits to `./README.md` scoped strictly to the verified delta. Per-edit before/after evidence was captured in `edit-evidence.md`. The final README achieved a DQI score of 94/100.

### Added

- None. Research-only phase.

### Changed

- None. Research-only phase.

### Fixed

- None. Research-only phase.

### Verification

| Check | Result |
|-------|--------|
| 20 iteration markdown files (`research/iterations/iteration-001.md` through `iteration-020.md`) | PASS (20 files) |
| State JSONL row count (`research/deep-research-state.jsonl`) | PASS (22 rows: 1 config + 20 iter + 1 converged) |
| Verified delta shape (`research/delta-verified.md`) | PASS (30 EDITs with FROM/TO/REASON + iter citation) |
| `sk-doc` validate on `./README.md` | PASS (0 issues, validator clean) |
| Strict-validate packet | PASS (0 errors, 0 warnings) |
| Sonnet @markdown HVR double-check | PASS (0 P0, voice clean) |
| Sonnet @review factual double-check | CONDITIONAL post-rewrite (3 P1 + 1 P2 caught, all patched in same Phase 5 commit) |
| Surgical-edit discipline (`git diff README.md`) | PASS (diff scoped to delta + double-check P1 patches) |
| Phase 4 DQI score | 94/100 (excellent, production-ready) |

### Files Changed

| File | What changed |
|------|--------------|
| `054-root-readme-deep-research/research/research.md` (NEW) | Consolidated findings ledger covering all 263 findings across 7 tracks |
| `054-root-readme-deep-research/research/delta-verified.md` (NEW) | 30-edit verified delta with FROM/TO/REASON and iteration citation per drift |
| `054-root-readme-deep-research/research/edit-evidence.md` (NEW) | Per-edit before/after evidence for each applied change |
| `054-root-readme-deep-research/research/track-seeds.md` (NEW) | 7 thematic track seeds with initial research questions |
| `054-root-readme-deep-research/research/deep-research-state.jsonl` (NEW) | Externalized state with 22 rows (1 config + 20 iter + 1 converged event) |
| `054-root-readme-deep-research/research/iterations/iteration-001.md` through `iteration-020.md` (NEW) | Per-iteration pass narratives from cli-devin SWE 1.6 |
| `README.md` | 30 surgical edits applied per verified delta (156 ins / 154 del) |

### Follow-Ups

- The 20-iteration cap is not a quality guarantee. If significant drift exists beyond what this sweep discovered, a follow-on research packet may be needed.
- Track 3 (HVR voice) surfaced 185 violations concentrated in punctuation. A follow-on prose-specialist pass could cover any remaining non-punctuation HVR drift that cli-devin SWE 1.6 may have underweighted.
- cli-devin SWE 1.6 is optimized for code research rather than prose audit. A follow-on with a prose-specialist model could improve Track 3 coverage quality if uneven iteration quality is observed.
