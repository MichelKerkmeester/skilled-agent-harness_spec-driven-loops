---
title: "Code Index Stack 013: Bench Harness Hardening + Full Fixture Audit"
description: "Path-extraction helpers hardened across both Phase 2 bench harnesses. The 18-probe fixture was fully audited against live sqlite evidence. A corrected fixture and re-bench baseline replaced the contaminated historical comparison, giving downstream packets 014-018 a trustworthy measurement foundation."
trigger_phrases:
  - "bench harness hardening"
  - "code retrieval fixture audit"
  - "phase 2 path extraction fix"
  - "corrected phase2 baseline"
  - "probe 10 fixture truth"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/013-bench-harness-and-fixture-audit` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack`

### Summary

The Phase 2 benchmark had two measurement defects that invalidated its verdict. The path-extraction regex in `run-phase2-smoke.sh` failed to strip backtick wrappers, import statement wrappers and quoted paths, causing real retrieval hits to be scored as misses. Probe 10's expected target was an excluded `**/dist` JavaScript file with zero indexed chunks, making it an impossible hit under any pipeline.

Both harnesses now share an embedded `_extract_paths()` helper that strips all wrapper forms and applies mirror-prefix-aware filesystem sanity filtering. All 18 fixture probes were audited against the live sqlite database. Probe 10 was repointed to its indexed TypeScript source. The corrected re-bench produced a clean baseline at 14/18 for all three lanes, which downstream packets 014-018 can use as a trustworthy comparison point.

### Added

- `_extract_paths(stdout)` helper embedded in `run-phase2-smoke.sh` with wrapper stripping, line-range stripping, mirror-prefix awareness, filesystem sanity filtering and rank-order deduplication
- `code-retrieval-fixture-audited.json` annotating all 18 probes with `_fixture_status` and `_audit_evidence` fields derived from live sqlite counts
- `code-retrieval-fixture-corrected.json` repointing probe 10 from excluded dist JavaScript to indexed TypeScript source
- `phase2-comparison-corrected.md` with the hardened-harness corrected-fixture re-bench results for all three lanes
- `phase2-comparison-baseline-vs-corrected-delta.md` showing per-probe flip analysis for harness fix vs fixture fix attribution
- `scratch/test_path_extraction.py` with 14 parametrized pytest assertions covering both harness helpers

### Changed

- `run-extended-bake-off-with-hybrid-rerank.sh` updated with the same `_extract_paths()` helper to match `run-phase2-smoke.sh` behavior
- `phase2-bench/README.md` updated to document the corrected fixture and canonical baseline contract for downstream packets
- `004-spec-memory-embedder-bake-off/decision-record.md` extended with ADR-016 covering the harness defects, fixes and the new measurement contract

### Fixed

- Path-extraction regex in `run-phase2-smoke.sh` misclassified real retrieval hits as misses when results contained backtick wrappers, import statement wrappers or quoted paths (e.g. probe 11 baseline-bge scored `config.py` as a miss despite the file appearing in the result wrapped in backticks)
- Probe 10 expected target was an unindexed `**/dist` JavaScript file with zero vec and FTS rows. The corrected fixture points to the indexed TypeScript source.

### Verification

| Check | Result |
|---|---|
| `python -m pytest .../scratch/test_path_extraction.py -q` | PASS: 14 passed |
| `bash -n run-phase2-smoke.sh` | PASS |
| `bash -n run-extended-bake-off-with-hybrid-rerank.sh` | PASS |
| `python -m json.tool code-retrieval-fixture-audited.json` | PASS |
| `python -m json.tool code-retrieval-fixture-corrected.json` | PASS |
| Corrected re-bench (all three lanes) | PASS: baseline-bge 14/18, bge-path-class 14/18, jina-v3 14/18 |
| SpawnAgent check | PASS: not used |
| `validate.sh --strict` | PASS |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `011-rerank-model-fit-investigation/research/phase2-bench/run-phase2-smoke.sh` | Modified | Added `_extract_paths()` helper with wrapper stripping. Added fixture override and output suffix support. Historical artifacts preserved. |
| `004-extended-bake-off/evidence/run-extended-bake-off-with-hybrid-rerank.sh` | Modified | Applied same `_extract_paths()` hardening as the smoke harness. |
| `011-rerank-model-fit-investigation/research/phase2-bench/README.md` | Modified | Documents corrected fixture and canonical baseline usage for downstream packets. |
| `002-spec-memory-stack/004-spec-memory-embedder-bake-off/decision-record.md` | Modified | ADR-016 appended covering harness defects, fixes and new measurement contract. |
| `011-rerank-model-fit-investigation/research/phase2-bench/code-retrieval-fixture-audited.json` (NEW) | Created | Annotated 18-probe fixture with per-probe sqlite audit evidence. |
| `011-rerank-model-fit-investigation/research/phase2-bench/code-retrieval-fixture-corrected.json` (NEW) | Created | Corrected benchmark fixture with probe 10 repointed to indexed TypeScript source. |
| `011-rerank-model-fit-investigation/research/phase2-bench/phase2-comparison-corrected.md` (NEW) | Created | Corrected 18-probe benchmark result for all three lanes. |
| `011-rerank-model-fit-investigation/research/phase2-bench/phase2-comparison-baseline-vs-corrected-delta.md` (NEW) | Created | Per-probe delta analysis separating harness fixes from fixture fixes. |
| `013-bench-harness-and-fixture-audit/scratch/test_path_extraction.py` (NEW) | Created | 14 parametrized pytest assertions covering both harness helpers. |
| `013-bench-harness-and-fixture-audit/evidence/fixture-audit-summary.md` (NEW) | Created | Human-readable sqlite audit table for the 18-probe fixture. |

### Follow-Ups

- The sequential-thinking MCP was unavailable during implementation. All three call attempts returned a tool cancellation. Planning was documented visibly in the packet rather than relying on tool output.
- Probe 5 recorded a hit-to-miss change in the corrected run. The delta file preserves this residual risk for downstream inspection rather than folding it into the harness-fix claim.
