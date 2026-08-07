---
title: "Benchmark Format Consolidation: FORMAT.md and benchmarks_format.md merged into benchmark_creation.md in sk-doc"
description: "The benchmark format mechanics for MCP skill-local benchmark folders were split across two files and mirrored via symlinks. This phase consolidated them into a single benchmark_creation.md reference following the *_creation.md pattern, added a source_template.md scaffold, dropped the FORMAT.md symlinks and updated all cross-link references."
trigger_phrases:
  - "benchmark format consolidation"
  - "benchmark_creation.md shipped"
  - "FORMAT.md removed sk-doc"
  - "sk-doc benchmark reference"
  - "benchmark format to sk-doc"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-19

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/006-benchmark-format-to-sk-doc` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality`

### Summary

The benchmark format mechanics for MCP skill-local benchmark folders were split across two separate files (`references/benchmarks/FORMAT.md` and `references/benchmarks_format.md`) in sk-doc and mirrored to sibling MCP skills via relative symlinks. Authors had to consult both files to get the full picture. The symlink topology added maintenance overhead and the file names did not follow the `*_creation.md` pattern used by sk-doc's other creation references.

The two source documents were merged into a single `benchmark_creation.md` reference (~450 LOC, 10 sections) following the `*_creation.md` pattern. A fillable `source_template.md` scaffold was added to the benchmark assets folder. The FORMAT.md symlinks were dropped from sibling skills and all cross-link references were updated to point to the new canonical path.

The consolidation shipped in commit `99c0aa08ef` on 2026-05-19. All seven success criteria passed. sk-doc is now the single source of truth for benchmark folder mechanics.

### Added

- `.opencode/skills/sk-doc/references/benchmark_creation.md` consolidating FORMAT.md and benchmarks_format.md into a single 10-section `*_creation.md`-pattern reference (~450 LOC)
- `.opencode/skills/sk-doc/assets/benchmark/source_template.md` as a fillable SOURCE.md scaffold based on two shipped SOURCE.md files

### Changed

- `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` usage comment repointed from `benchmarks/FORMAT.md` to `benchmark_creation.md`
- `.opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md` FORMAT.md references repointed to `benchmark_creation.md`
- Four historical spec.md files in `013-embedder-testing-and-architecture` had canonical-mechanics pointers updated to `benchmark_creation.md`
- `004-skill-local-benchmarks-format` docs (spec, plan, tasks, implementation-summary) had a historical relocation note appended naming packet 006

### Fixed

- Authors were required to read two separate files to understand benchmark folder mechanics. A single `*_creation.md`-pattern reference now covers the full workflow.
- The `references/benchmarks/` subdirectory and `benchmarks_format.md` naming diverged from sk-doc's established `*_creation.md` convention. The consolidated file follows the pattern.
- Symlinks from sibling skills (`system-spec-kit` and `mcp-coco-index`) to FORMAT.md created path-resolution fragility. Explicit prose paths in sibling READMEs replaced them.

### Verification

| Check | Result |
|-------|--------|
| `test -f .opencode/skills/sk-doc/references/benchmark_creation.md` | PASS |
| `test -f .opencode/skills/sk-doc/assets/benchmark/source_template.md` | PASS |
| `test ! -e .opencode/skills/sk-doc/references/benchmarks` | PASS |
| `test ! -e .opencode/skills/sk-doc/references/benchmarks_format.md` | PASS |
| `test ! -e .opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md` | PASS |
| `test ! -e .opencode/skills/mcp-coco-index/mcp_server/benchmarks/FORMAT.md` | PASS |
| `rg` stale-path sweep | 0 matches outside packet 006 docs |
| `validate.sh --strict` on this packet | PASS |
| `validate_document.py --type readme` on benchmark-2026-05-17 report | PASS |
| `validate_document.py --type readme` on benchmark-2026-05-18 report | PASS |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/sk-doc/references/benchmark_creation.md` | Created (NEW) | New canonical reference, ~450 LOC, 10 sections, `*_creation.md` pattern |
| `.opencode/skills/sk-doc/assets/benchmark/source_template.md` | Created (NEW) | Fillable SOURCE.md scaffold |
| `.opencode/skills/sk-doc/references/benchmarks/FORMAT.md` | Deleted | Consolidated into `benchmark_creation.md` |
| `.opencode/skills/sk-doc/references/benchmarks_format.md` | Deleted | Consolidated into `benchmark_creation.md` |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md` | Deleted | Symlink dropped. README references canonical by path. |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/FORMAT.md` | Deleted | Symlink dropped. Skill later removed in a separate commit. |
| `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` | Modified | Usage comment repointed to `benchmark_creation.md` |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md` | Modified | FORMAT.md references repointed to `benchmark_creation.md` |
| Four historical spec.md files in `013-embedder-testing-and-architecture` | Modified | Canonical-mechanics pointer updated to `benchmark_creation.md` |
| `004-skill-local-benchmarks-format/{spec,plan,tasks,implementation-summary}.md` | Modified | Historical relocation note appended naming packet 006 |

### Follow-Ups

- The four `004-skill-local-benchmarks-format` docs still contain REQ-001 and REQ-002 lines that name old paths. These are historical statements true at time-of-ship, preserved per the "do not rewrite history" decision. The appended historical note in each file points readers to packet 006 as the relocation event.
- No automated lint prevents a future `FORMAT.md` file from reappearing at the legacy path. A follow-on packet could add a `validate.sh` lint rule if needed.
