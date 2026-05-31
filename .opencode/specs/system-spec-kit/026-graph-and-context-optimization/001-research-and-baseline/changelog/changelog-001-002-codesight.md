---
title: "Research Baseline Phase 001/002: Codesight Deep-Research Audit"
description: "20-iteration source-confirmed audit of the codesight Node.js/TypeScript zero-dependency CLI produced 95 findings, a 22-row Adopt/Adapt/Reject decision matrix, and bounded cross-phase responsibilities for 003-contextador and 004-graphify."
trigger_phrases:
  - "codesight research audit"
  - "codesight adopt adapt reject matrix"
  - "codesight blast radius depth cap bug"
  - "codesight token savings heuristic"
  - "002-codesight deep research"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-12

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/002-codesight` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline`

### Summary

The `Code_Environment/Public` stack lacked an evidence-grounded basis for adopting patterns from the codesight external CLI. Without a source-level audit, any port risked importing the wrong patterns alongside the tool's known bugs and unsupported marketing claims.

A 20-iteration deep-research packet audited the codesight Node.js/TypeScript zero-dependency CLI across all three charter segments: the original 12-question charter (iterations 1-5, 26 findings), the first continuation charter (iterations 6-10, 26 findings) plus a completed-continue extension (iterations 11-20, 43 findings). The investigation covered the execution flow and zero-dependency loader, the AST route-extraction pipeline, 28 framework and 9 ORM detector implementations, all 8 MCP tools and their session-cache lifecycle, the blast-radius reverse-import BFS (including a depth-cap off-by-one bug), per-tool profile generation across Claude Code and four other assistants, benchmark claim cross-checking, watch mode automation, contract enrichment pipeline biases, formatter lifecycle plus the final adoption synthesis.

The packet produced 95 source-confirmed findings with exact `external/src/` line citations, a 22-row Adopt/Adapt/Reject decision matrix in `research/research.md` §18.3 plus explicit cross-phase boundaries assigning AST detector patterns to this phase, query MCP to 003-contextador and graph math to 004-graphify.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

- Deep-research state: 20 of 20 iterations completed. Stop reason: `max_iterations_reached` after all 27 questions (Q1-Q27) answered.
- Convergence: 95 source-confirmed findings across three charter segments. All questions answered with exact `external/src/` line citations.
- Synthesis document: `research/research.md` (872 lines) contains the full 20-iteration synthesis and retains the 22-row decision matrix in §18.3.
- Cross-phase boundaries: `research/research.md` §10 assigns detector design and static artifact emission to 002, query MCP to 003-contextador and graph math to 004-graphify.
- `validate.sh --strict`: 0 blocking errors. The known warning-only ADR-anchor bucket in `decision-record.md` is the only remaining non-zero strict signal.
- Memory artifacts: three chronological saves under `memory/`. The newest save has a documented `has_topical_mismatch` flag and is retained without manual mutation per memory-save rules.

### Files Changed

| File | What changed |
|------|--------------|
| `research/research.md` (NEW) | 872-line canonical synthesis covering all 20 iterations and the 22-row Adopt/Adapt/Reject matrix in §18.3 |
| `research/iterations/` (NEW) | 20 per-iteration finding files (iteration-001.md through iteration-020.md) with source-cited findings |
| `research/deep-research-state.jsonl` (NEW) | 30-line JSONL log covering the original session, first continuation, completed-continue reopen, runs 11-20 plus the final synthesis event |
| `research/deep-research-strategy.md` (NEW) | Analyst-owned strategy file. Machine-owned sections 7-11 maintained by reducer |
| `research/deep-research-dashboard.md` (NEW) | Reducer-generated dashboard. Status=COMPLETE, Iteration=20/20 |
| `research/findings-registry.json` (NEW) | Reducer-refreshed findings registry. 671 derived snippets are not the same as the human total of 95 findings |
| `research/deep-research-config.json` (NEW) | Research config with `status=complete`, `maxIterations=20` |
| `scratch/phase-research-prompt.md` (NEW) | TIDD-EC structured research prompt used to seed the original charter |

### Follow-Ups

- Fix the blast-radius depth-cap off-by-one bug in `external/src/detectors/blast-radius.ts` before adopting the reverse-import BFS pattern. The current loop lets nodes one hop beyond `maxDepth` leak into results.
- Add turbo/nx/lerna/Rush detection to any monorepo aggregation port. Codesight only handles `pnpm-workspace.yaml` and `package.json` workspaces, making it unusable on real-world tool-specific monorepos without those branches.
- Replace the hand-tuned `tokensSaved` linear formula before publishing any benchmark claims. The formula has zero test coverage and any external citation would be marketing rather than measurement.
- Add tRPC contract enrichment to any port of `enrichRouteContracts`. The current implementation is regex-only and strongly biased toward Hono. tRPC has zero contract enrichment despite having AST route detection.
- Fix Go AST labeling before adopting the Go detector pattern. The current `extract-go.ts` uses brace-tracking with regex but labels its output `confidence: "ast"`, which misrepresents the evidence type.
- Supersede the lowest-quality saved memory with a new sanctioned save if retrieval quality becomes a problem. The newest snapshot carries a `has_topical_mismatch` flag and was intentionally left unmodified per memory-save rules.
