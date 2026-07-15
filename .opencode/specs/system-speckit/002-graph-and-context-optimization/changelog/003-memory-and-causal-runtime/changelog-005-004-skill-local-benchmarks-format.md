---
title: "Phase 005/004: Skill-local benchmarks/ folder format and report promotion"
description: "New mcp_server/benchmarks/ convention introduced for MCP skills in this repo. Promoted spec-packet bake-off evidence for mk-spec-memory (May 17, 2026) and mcp-coco-index (May 18, 2026) into skill-local discoverable folders. Shipped FORMAT.md convention doc, per-skill READMEs, dated benchmark subfolders with sk-doc-compliant benchmark_report.md files plus sk-doc resources for future adopters. FORMAT.md later consolidated into sk-doc as benchmark_creation.md via packet 006."
trigger_phrases:
  - "skill-local benchmarks format"
  - "mcp_server benchmarks convention"
  - "benchmark report promotion"
  - "benchmarks folder discoverability"
  - "benchmark_creation.md sk-doc"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/004-skill-local-benchmarks-format` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality`

### Summary

Benchmark evidence from two spec-packet bake-offs lived exclusively inside the `specs/` tree, making it hard to answer "what embedder does this MCP use and why?" from within the MCP skill folder. There was no convention for skill-local benchmark discoverability and no shared format for structured benchmark reports.

A new `mcp_server/benchmarks/` folder convention was introduced, with a date-folder layout (`benchmark-<YYYY-MM-DD>/`), a canonical `FORMAT.md` convention doc plus a 10-section `benchmark_report.md` structure validated by sk-doc. The first two adopters shipped in the same commit: mk-spec-memory (May 17, 2026 text-embedder bake-off, winner: jina-embeddings-v3 with rescue layer) and mcp-coco-index (May 18, 2026 code-embedder bake-off, winner: BAAI/bge-code-v1). Two sk-doc resources also shipped to support future adopters: `references/benchmarks_format.md` and `assets/benchmark/benchmark_report_template.md`. In a follow-on packet (006), the `FORMAT.md` mechanics were consolidated into a single `sk-doc/references/benchmark_creation.md` reference. The legacy `FORMAT.md` symlinks were replaced with path references in sibling READMEs.

### Added

- `mcp_server/benchmarks/FORMAT.md` in system-spec-kit (canonical single-source convention doc with 10-section structure and authority hierarchy)
- `mcp_server/benchmarks/benchmark-2026-05-17/` in system-spec-kit with `results.csv`, `per-probe-with-rescue.jsonl`, `runtime-measurements.md`, `SOURCE.md`, `benchmark_report.md`
- `mcp_server/benchmarks/README.md` index for system-spec-kit
- `mcp_server/benchmarks/benchmark-2026-05-18/` in mcp-coco-index with `results.csv`, `per-probe.jsonl`, `SOURCE.md`, `benchmark_report.md`
- `mcp_server/benchmarks/README.md` index and `FORMAT.md` relative symlink for mcp-coco-index
- `sk-doc/references/benchmarks_format.md` adoption decision-aid reference
- `sk-doc/assets/benchmark/benchmark_report_template.md` fillable scaffold for future adopters

### Changed

- `sk-doc/SKILL.md` updated to add BENCHMARK intent signal and resource map entry

### Fixed

None.

### Verification

- Strict-validate on sub-phase: PASSED (0 errors, 0 warnings per commit message)
- sk-doc validate on all authored READMEs and benchmark reports: PASSED
- Symlink integrity for `mcp-coco-index/mcp_server/benchmarks/FORMAT.md`: verified
- 20 tasks recorded as completed in checklist

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md` (NEW) | Canonical convention doc for the `mcp_server/benchmarks/` layout and 10-section benchmark_report.md structure |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md` (NEW) | Top-level index listing all benchmark runs for mk-spec-memory |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/benchmark_report.md` (NEW) | sk-doc-compliant 10-section report for the May 17, 2026 text-embedder bake-off |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/results.csv` (NEW) | Aggregate CSV promoted from the spec packet evidence |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/per-probe-with-rescue.jsonl` (NEW) | Per-probe rows with rescue-layer outcomes |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/runtime-measurements.md` (NEW) | Jina runtime measurement notes |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/SOURCE.md` (NEW) | Pointer back to authoritative spec packet and key evidence files |
| `.opencode/skills/sk-doc/references/benchmarks_format.md` (NEW) | Adoption decision-aid reference explaining the convention for future MCP authors |
| `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` (NEW) | Fillable scaffold for new benchmark_report.md files |
| `.opencode/skills/sk-doc/SKILL.md` | BENCHMARK intent signal and resource map entry added |

### Follow-Ups

- Consolidate FORMAT.md mechanics into sk-doc as a single `benchmark_creation.md` reference and replace legacy `FORMAT.md` symlinks. (Completed in packet 006-benchmark-format-to-sk-doc.)
- Add benchmarks for mk-skill-advisor once that MCP has benchmark data to promote.
- Write a `promote-benchmark.sh` helper to automate the CSV copy and benchmark_report.md scaffold step for future runs.
