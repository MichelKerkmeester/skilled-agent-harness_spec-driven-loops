---
title: "013: Post-Deprecation Deep Review, CocoIndex/Rerank Arc (30 Surfaces, FAIL verdict)"
description: "7-iteration deep-review of the 014 CocoIndex/rerank deprecation across 30 surfaces (6 clusters x 4 dimensions) via cli-devin/SWE-1.6 + orchestrator exec-verify. Found 7 residual items (1 P0, 2 P1, 4 P2) the executor's own greps missed. Verdict FAIL routes to remediation."
trigger_phrases:
  - "post-deprecation deep review coco"
  - "014 deep review 30 surfaces"
  - "cli-devin swe-1.6 coco review"
  - "coco rerank deprecation verdict fail"
  - "gemini.md routing deleted mcp"
importance_tier: "important"
contextType: "review"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-25

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index/013-post-deprecation-deep-review` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/002-deprecate-coco-index`

### Summary

The 014 CocoIndex/rerank deprecation was declared complete, but repeated grep refinements during the session kept surfacing more residue (`cocoindex` to `ccc` to `ccc_*`) and a pre-review sweep confirmed four additional misses. The executor had demonstrable pattern and scope blind spots, including the `.gemini/`, `.codex/` scopes and the `ccc` CLI token. An independent, systematic deep-review was needed before closing the deprecation.

A 7-iteration deep-review ran across 30 defined surfaces (6 clusters: reference completeness, config/mirror integrity, build/test/dist/type, behavior/runtime, incident blast-radius plus kept exceptions, spec/doc/governance) using cli-devin/SWE-1.6 in four read-only passes (one dimension each: correctness, security, traceability, maintainability) plus an orchestrator exec-verify pass for execution-only targets. Seven residual items were found: 1 P0 (GEMINI.md routes Gemini to the deleted `mcp__cocoindex_code__search` MCP tool), 2 P1 (memory:manage still declares removed `ccc` subcommands, 014 phase-map marks phases complete despite known residue) and 4 P2 (stale advisor skill-graph.json copy, dead .gitignore entry, embedder_pluggability.md obsolete ccc run-daemon commands, doctor_deep-loop.yaml vestigial coco glob). No behavioral regressions were found. The verdict FAIL routes the entire bundle to a remediation packet.

Two config items were remediated inline during the review: the dead `SPECKIT_RERANK_LAYER` flag was removed from all four MCP config files and the `.devin/config.local.json` server key was corrected from `mk_spec_memory` to `mk-spec-memory`. All 9 MCP configs now have zero coco/rerank references.

### Added

None. Review-only phase.

### Changed

None. Review-only phase.

### Fixed

None. Review-only phase.

### Verification

- 7 iteration files (`iteration-001.md` through `iteration-007.md`) in `review/iterations/`.
- 7 delta records in `review/deltas/` (`iter-001.jsonl` through `iter-007.jsonl`).
- `review/deep-review-findings-registry.json` with 7 primary findings (F001-F007, plus F008-F014 from extended iters 5-7).
- `review/deep-review-state.jsonl` capturing all 7 iteration events plus synthesis and resume events.
- `review/review-report.md` synthesis document with verdict FAIL, active P0/P1/P2 counts, remediation workstreams and plan seed.
- Exec-verify (orchestrator pass): memory typecheck 0 errors, code-graph 562 pass / 1 skip, advisor code-search intent returned 0 coco hits, on-disk scan found no `.cocoindex_code`, port 8765 free.
- Convergence: new-findings ratio 4 to 2 to 1 to 0 across iters 1-4. All 4 dimensions covered.

### Files Changed

| File | What changed |
|------|--------------|
| `review/review-report.md` (NEW) | Review synthesis document. Verdict FAIL. Active findings: P0:1, P1:2, P2:4. Remediation workstreams and plan seed. |
| `review/deep-review-strategy.md` (NEW) | Charter and 30-surface definition across 6 clusters and 4 dimensions. |
| `review/deep-review-findings-registry.json` (NEW) | Structured findings registry with severity, file:line evidence and recommendations. |
| `review/deep-review-state.jsonl` (NEW) | Externalized state log covering all 7 iterations, synthesis and resume events. |
| `review/deep-review-dashboard.md` (NEW) | Per-iteration progress and finding summary dashboard. |
| `review/iterations/iteration-001.md` through `iteration-007.md` (NEW) | Per-iteration review pass narratives covering all 4 dimensions (correctness, security, traceability, maintainability). |
| `review/deltas/iter-001.jsonl` through `iter-007.jsonl` (NEW) | Per-iteration delta records. |
| `review/prompts/` (NEW) | Per-iteration prompt files used for the cli-devin review-iter dispatches. |
| `review/agent-config-review-iter.json` (NEW) | Agent configuration for the cli-devin review-iter recipe. |
| `review/deep-review-config.json` (NEW) | Deep-review run configuration. |

### Follow-Ups

- Remediate F001 (P0): rewrite `.gemini/GEMINI.md:5` SEARCH ROUTING line to the HYBRID policy (Code Graph + Grep) matching the other four runtime routing docs.
- Remediate F003 (P1): strip the `ccc` subcommand declarations and CCC MODE section from `.opencode/commands/memory/manage.md`.
- Remediate F007 (P1): update or qualify the 014 phase-map completion claim after WS-1 and WS-2 land.
- Remediate P2 batch (F002/F004/F005/F006): regenerate `database/skill-graph.json`, remove `.gitignore:123` stale entry, collapse `embedder_pluggability.md` dead ccc columns, remove `doctor_deep-loop.yaml:97` coco glob.
- Reconcile the external devin profile: `devin mcp list` shows a broken `spec_kit_memory` path and duplicate memory registrations in `~/.config/devin/`. Run `devin mcp remove spec_kit_memory` to resolve this.
