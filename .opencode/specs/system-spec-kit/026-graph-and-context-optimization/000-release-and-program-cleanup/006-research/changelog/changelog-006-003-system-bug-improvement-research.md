---
title: "System Deep Research: Bugs and Improvements, 20-Iteration Audit"
description: "20-iteration cli-codex gpt-5.5 high-reasoning sweep across system-spec-kit, mcp_server, code_graph, skill_advisor. Produced 82 findings (0 P0, 31 P1, 51 P2) across four categories: production code bugs, wiring/automation, refinement opportunities, architecture/organization."
trigger_phrases:
  - "system bug improvement research"
  - "003-system-bug-improvement-research"
  - "82 findings deep research"
  - "daemon concurrency research"
  - "spec-kit production bug audit"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research/003-system-bug-improvement-research` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/006-research`

### Summary

After packets 042-045 closed the documented stress-coverage backlog, the next layer of risk was unknowns: latent production bugs, miswired automation paths, architectural shortcuts across `system-spec-kit`, `mcp_server`, `code_graph`, `skill_advisor`. A 20-angle charter was defined across four categories (production code bugs, wiring/automation bugs, refinement opportunities, architecture/organization) and a full 20-iteration deep research loop was executed using `cli-codex gpt-5.5` at high reasoning.

The run produced 82 findings: 0 P0, 31 P1, 51 P2. No release-blocking P0s surfaced. Key finding clusters include daemon/code-graph concurrency (iter-001, fixed in packet 048), SQLite contention in the code-graph write path (iter-002), silent error recovery that masks real corruption (iter-004), schema validation gaps (iter-005), CLI orchestrator skill drift (iter-007), memory MCP causal-key mismatch (iter-008), spec-kit validator regex gaps (iter-009), code-graph staleness detection inaccuracies (iter-014), architecture boundary leaks (iter-016). All 82 findings are packed into `research/research.md` (17 sections) with a per-file path inventory in `research/resource-map.md`. Iter-001 findings (4 items, daemon concurrency) were remediated in parallel packet 048 before synthesis completed.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Check | Result |
|-------|--------|
| 20 iteration files produced | PASS. All 20 present under `research/iterations/` with file:line citations. |
| Each iteration has Findings table with Priority column | PASS. Spot-checked 5 random iterations. |
| `research/research.md` 17 sections in locked order | PASS |
| `research/resource-map.md` non-empty path inventory | PASS. 119 lines. |
| `research/findings-registry.json` aggregated | PASS. 82 entries. |
| Executor verified cli-codex gpt-5.5 high | PASS. `deep-research-config.json` records executor block. |
| Stayed on `main` branch throughout | PASS |
| Iter-001 findings remediated in packet 048 | PASS. Commit `267b4d7a6` closed all 4 concurrency findings. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `research/iterations/iteration-001.md` through `iteration-020.md` | Created | Per-iteration audit narratives covering all 20 angles (5 per category). Each cites file:line evidence. |
| `research/research.md` | Created | 17-section synthesis of 82 findings (361 lines). Includes triage priority and remediation seed for follow-on packets. |
| `research/resource-map.md` | Created | Path-grouped resource inventory (119 lines) mapping all analyzed files. |
| `research/findings-registry.json` | Created | Aggregated per-iteration finding manifest with 82 entries. |
| `research/deep-research-config.json` | Created | Workflow config recording executor (cli-codex, gpt-5.5, high reasoning, 20 max iterations, 0.01 convergence threshold). |
| `research/deep-research-strategy.md` | Created | 20-angle to iteration mapping document. |
| `research/deep-research-state.jsonl` | Created | Externalized state log accumulating 20 iteration deltas. |
| `research/deltas/iter-001.jsonl` through per-iteration JSONL | Created | Per-iteration JSONL findings deltas. |
| `research/prompts/` | Created | Pre-rendered prompt packs (20 iteration prompts plus synthesis). |

### Follow-Ups

- Prioritize remediation of the 31 P1 findings in follow-on packets, starting with A2 SQLite contention, A4 silent fallbacks, A5 schema gaps, B3 memory causal-key mismatch, B2 CLI skill drift, C4 staleness detection.
- Fix or deprecate `research/run_all.sh`: it uses `declare -A` which is unsupported in macOS bash 3.2. Replace the associative array with a portable `eval`/`mktemp` hash or mark it deprecated in favor of manual dispatch.
- Validate the full packet with `validate.sh --strict` after changelog lands to close the PENDING verification row.
