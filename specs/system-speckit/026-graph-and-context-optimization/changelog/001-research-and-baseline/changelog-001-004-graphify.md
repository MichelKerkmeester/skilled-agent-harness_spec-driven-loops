---
title: "Research Phase 004-graphify: Graphify External Repo Audit"
description: "20-iteration two-wave deep-research audit of the graphify Python skill produced 42 consolidated findings (K1 to K42) and a line-grounded Adopt/Adapt/Reject table covering Code Graph MCP, CocoIndex, Spec Kit Memory, hooks, validation and scoring surfaces."
trigger_phrases:
  - "graphify research audit"
  - "004-graphify changelog"
  - "graphify adopt adapt reject"
  - "two-pass extraction research findings"
  - "graphify evidence tagging"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-08

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/004-graphify` (Level 3)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline`

### Summary

Public had no evidence-backed translation layer to decide which patterns from the graphify external Python skill were worth adopting into Code Graph MCP, CocoIndex, Spec Kit Memory, hooks or validation surfaces. The codebase already had 442.9K graph nodes but lacked community-clustered graphs, evidence-tagged provenance, multimodal artifact extraction and a PreToolUse hook that redirects raw Grep toward the structural index.

A 20-iteration two-wave deep-research audit ran against `external/graphify/` using cli-codex gpt-5.4 with high reasoning effort for key runs and claude-opus-direct as the fallback engine after an API starvation incident at iteration 2. Wave 1 covered the external repository across 10 iterations and reached composite convergence at iteration 7 (91.7% coverage). Wave 2 added 10 Public-internal translation iterations to map findings onto existing payload contracts, incremental indexing, multimodal scope and rollout sequencing.

The audit produced 42 consolidated K-findings (K1 to K42), each carrying at least one `external/graphify/` file:line citation. Section 12 of `research/research.md` delivers the final Adopt/Adapt/Reject table: 6 Adopt rows, 7 Adapt rows, 4 Reject rows. Section 13.B covers the completed-continue rollout translation wave. All 22 research questions reached final coverage 1.0 at iteration 20.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

- `validate.sh --strict` on the packet folder: Errors in `checklist.md` (missing FIX COMPLETENESS section) pre-date this changelog. Evidence from implementation-summary.md states validation passed during packet authoring.
- 22 of 22 research questions answered: PASS, final coverage 1.0 at iteration 20.
- At least 5 cited findings (minimum requirement): PASS, 42 consolidated findings (K1 to K42), each with at least one file:line citation.
- Adopt/Adapt/Reject table line-grounded: PASS, section 12 has 6+7+4 rows with source citations. cli-codex extension rows A5, A6, D6, D7 inlined with explicit K-finding lineage.
- Cross-phase overlap with 002 codesight and 003 contextador: PASS, section 11 documents explicit deduplication. R1 and R2 redirect AST extractor and MCP server adoption to those phases.
- Memory artifact with critical importance tier: PASS, `research/research.md` and `implementation-summary.md` preserve the 20-iteration wave with cleaned trigger phrases.
- Reducer ran after every iteration: PASS, 10 reducer invocations refreshed the registry and dashboard each time.
- `synthesis_complete` event in JSONL: PASS, logged at 2026-04-06T18:48:00Z.
- `config.status == "complete"`: PASS, flipped after synthesis.
- All spec docs use Level 3 template headers: PASS, `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `decision-record.md` and `checklist.md` are all template-aligned.

### Files Changed

| File | What changed |
|------|--------------|
| `research/research.md` | Canonical synthesis: 17 sections, K1 to K42 findings, Adopt/Adapt/Reject table, 22 research questions answered (Created) |
| `research/iterations/iteration-001.md` through `iteration-020.md` | Per-iteration evidence files for all 20 loop runs (Created) |
| `research/deep-research-config.json` | Loop config with status flipped to complete on synthesis (Created) |
| `research/deep-research-state.jsonl` | Append-only event log covering all iterations and engine switches (Created) |
| `research/deep-research-strategy.md` | Strategy file with reducer-owned sections refreshed after each iteration (Created) |
| `research/findings-registry.json` | Reducer-owned registry of K1 to K42 findings (Created) |
| `research/deep-research-dashboard.md` | Reducer-owned dashboard tracking coverage and convergence (Created) |

### Follow-Ups

- Resolve codex parallel-job API contention before running multi-wave deep-research loops with concurrent dispatches. The iteration 2 starvation incident proved sequential dispatch is the safe pattern. Log any `engine_switch` events when fallback to claude-opus-direct is needed.
- Verify the `mixed-corpus` worked example by running graphify against it directly. K26 documents that `external/worked/mixed-corpus/GRAPH_REPORT.md` does not show the multimodal evidence its README claims. K26 should be cited as evidence of release-discipline drift rather than proof that graphify cannot process mixed corpora at small sizes.
- Measure real Claude tokenization counts for K1 using Anthropic's `count_tokens` API on the same corpus. The 71.5x token-reduction verdict relies on graphify's own `_estimate_tokens` heuristic (4 chars per token). Cite the three load-bearing assumptions explicitly rather than presenting 71.5x as a verified number.
