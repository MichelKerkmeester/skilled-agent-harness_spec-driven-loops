---
title: "Changelog: 005-cross-cutting-quality (quality gates, audit cadence and docs alignment across 016)"
description: "Consolidated plain-English changelog for the cross-cutting quality umbrella spanning 002 mk-spec-memory, 003 skill-advisor, 004 cocoindex and 001 foundation stacks. Covers a 20-iteration deep review of the embedder and rescue architecture, a playbook fairness and coverage audit, the skill-local benchmarks folder format and its sk-doc consolidation, a CocoIndex pipx versus local-editable install hygiene diagnosis, a planned skill-docs alignment sweep and a scaffold-only vitest stabilization inventory."
trigger_phrases:
  - "005-cross-cutting-quality changelog"
  - "cross-cutting quality changelog"
  - "016/005 consolidated changelog"
  - "playbook audit changelog"
  - "benchmark format consolidation changelog"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

# Changelog: 005-cross-cutting-quality

> Plain-English changelog covering all 8 sub-phases of the 016 cross-cutting quality umbrella. Read this for the audit, review, docs and infrastructure-hygiene work that spanned the per-stack packets.
>
> **Spec folder:** `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/` (phase parent, 8 sub-phases)
>
> **Scope:** Spans 001-local-embeddings-foundation, 002-spec-memory-stack, 003-skill-advisor-stack, 004-code-index-stack and the sk-doc + system-spec-kit skill surfaces.

---

## 2026-05-21

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/` (Phase Parent)

### Summary

This umbrella groups all cross-cutting quality work that does not belong to any single per-stack packet. Each child sweeps across the per-stack work to ensure alignment, correctness and audit cadence. The headline win is a 20-iteration deep review of the 016-019 embedder and rescue architecture using cli-devin SWE 1.6, which produced confirmed P0 findings with concrete file-and-line evidence then verified remediation against the closing commit. Parallel quality sweeps include a playbook fairness and coverage audit that froze the cat-24 fixture-surgery lesson into systematic CSV inventories and deterministic scenario additions.

The stack also formalised the skill-local `benchmarks/` folder convention (date-based subfolders, SOURCE.md pointers back to authoritative spec packets, sk-doc-compliant report structure) and consolidated benchmark format mechanics from two split files into a single canonical `benchmark_creation.md` reference following the `*_creation.md` pattern. CocoIndex install hygiene work diagnosed a pipx versus local-editable install drift that caused benchmark harness integrity issues and documented the sandbox permission blocker preventing repair. A vitest stabilization scaffold inventoried 168 pre-existing test failures across 5 clusters but deferred execution because production code is not broken.

Several phases remain planned or in progress. Phase 003 skill-docs-alignment is scaffolded with three Opus or Sonnet children but not executed. Phase 004 skill-local-benchmarks-format shipped Phase A and B (FORMAT.md plus benchmark folder population) but Phase C (sk-doc-compliant report.md and READMEs) and Phase D (validation) are pending. Phase 007 pipx repair is blocked on operator-side pipx configuration. Phase 008 vitest stabilization is scaffold only, awaiting operator opt-in.

### Included Phases

| Phase | Slug | Status | Shipped |
|---|---|---|---|
| 001 | [playbook-quality-audit](./001-playbook-quality-audit/) | Complete | 2026-05-17 |
| 002 | [deep-review-stack](./002-deep-review-stack/) | Complete (evidence backfilled) | 2026-05-21 |
| 003 | [skill-docs-alignment](./003-skill-docs-alignment/) | Planned (3-child scaffold) | not shipped |
| 004 | [skill-local-benchmarks-format](./004-skill-local-benchmarks-format/) | IN PROGRESS (Phase A+B done) | 2026-05-18 partial |
| 005 | [cocoindex-install-hygiene](./005-cocoindex-install-hygiene/) | Complete (diagnosis only, BLOCKED) | 2026-05-18 |
| 006 | [benchmark-format-to-sk-doc](./006-benchmark-format-to-sk-doc/) | Complete | 2026-05-19 |
| 007 | [cocoindex-install-hygiene-pipx-repair](./007-cocoindex-install-hygiene-pipx-repair/) | Planned (scaffold only) | not shipped |
| 008 | [spec-memory-vitest-stabilization](./008-spec-memory-vitest-stabilization/) | Scaffold only (execution deferred) | not shipped |

### Added

#### 20-iteration deep review of 016-019 stack (002)

The 016-019 stack landed pluggable embedder architecture, the retrieval-rescue layer, dist-freshness vitest coverage, the CocoIndex jina-code swap, MPS (Apple Silicon Metal Performance Shaders) auto-detect and `registered_embedders.py` in a short window. Unit-level coverage existed and smoke-tests passed but no adversarial deep-review had run across the integrated surface. Phase 002 captured a 20-iteration deep-review of the stack using cli-devin SWE 1.6. The primary review produced `review-report.md` with a CONDITIONAL verdict citing 3 confirmed P0 findings after adjudication plus P1/P2 groups across correctness, security, traceability, maintainability, adversarial, supply-chain, cross-stack and testability dimensions. A 7-iteration remediation re-review against commit `ba6816a49` verified that the original 3 P0s were closed and recorded one new dead-code observability advisory.

&nbsp;

#### Playbook fairness and coverage audit (001)

The cat-24 fixture surgery (in phase 008 of `001-local-embeddings-foundation/`) revealed that the playbook test corpus had drifted with stale exact IDs, random sampling and aspirational thresholds that made retrieval-quality scenarios look like model failures when the ground truth itself was wrong. Phase 001 produced three audit children: a fairness audit CSV inventorying 345 scenarios across 25 category folders checking for predicate type, stale fixed ground truth, aspirational thresholds and orphan-row dependencies, a tool-coverage audit CSV cross-referencing the 42 mk-spec-memory MCP tools against pre-expansion playbook scenarios and a scenario-expansion summary CSV that repaired 3 cat-24 scenarios and added 15 deterministic scenarios for uncovered or happy-path-only tool surfaces. All three children used a reproducible JavaScript helper under `evidence/` to regenerate artifacts.

&nbsp;

#### Skill-local benchmarks folder convention (004)

Benchmark evidence was living in spec packets far from the code it informed. Operators asking "which embedder is the production default and why?" had to read packet docs. Phase 004 formalised the `mcp_server/benchmarks/` folder convention with date-based subfolders for ISO sort order and `SOURCE.md` pointers back to authoritative spec packets, then populated the first two adopters: `mk-spec-memory/benchmarks/benchmark-2026-05-17/` and `mcp-coco-index/benchmarks/benchmark-2026-05-18/` both with `results.csv`, per-probe JSONL data, runtime measurements and `SOURCE.md`. Phase C (sk-doc-compliant `benchmark_report.md` plus README files via `@markdown` agents) and Phase D (validation) are pending.

&nbsp;

#### benchmark_creation.md canonical reference (006)

Benchmark format mechanics were split across `references/benchmarks/FORMAT.md` (mechanics, folder shape, report structure, authority hierarchy) and `references/benchmarks_format.md` (decision aid, adoption triggers, case studies). Readers had to consult two documents for the full picture and the symlink topology added maintenance overhead plus path-resolution fragility. Phase 006 consolidated both files into a single ~450-LOC `benchmark_creation.md` at `.opencode/skills/sk-doc/references/` following the established `*_creation.md` pattern. A new `source_template.md` scaffold was added at `.opencode/skills/sk-doc/assets/benchmark/` for fillable SOURCE.md authoring. Legacy files and skill-local `FORMAT.md` symlinks were deleted.

&nbsp;

#### Scaffold-only vitest stabilization inventory (008)

The vitest suite for `mk-spec-memory/mcp_server` is red but the failures are pre-existing infrastructure and fixture issues, not functional regressions. Phase 008 inventoried 168 failures across 33 test files clustered into 5 categories: 13 missing mock exports in `stage1-expansion.vitest.ts`, 25 MCP connection closures in `runtime-routing.vitest.ts`, 7 PID lease timeouts in `launcher-lease.vitest.ts`, 127 assertion-drift cases across `handler-memory-save.vitest.ts`, `embeddings.vitest.ts`, `memory-crud-extended.vitest.ts` and `spec-folder-prefilter.vitest.ts` and 4 flag/config mismatches in `profile-db-filename.vitest.ts` and the local-llm tests. The packet preserves a remediation plan per cluster but execution is deferred until operator opt-in.

### Changed

- **Benchmark cross-references** repointed across `benchmark_report_template.md`, sibling skill READMEs and four historical spec.md files to the new canonical `benchmark_creation.md` path (006).
- **FORMAT.md symlinks** dropped from `system-spec-kit/mcp_server/benchmarks/` and `mcp-coco-index/mcp_server/benchmarks/`. The skills now reference the canonical by path instead of through a symlink (006).
- **Originating-packet docs** updated with a historical note pointing forward to the canonical-mechanics reference (006).
- **Skill READMEs** for both system-spec-kit and mcp-coco-index `benchmarks/` got refreshed to reference the canonical path (006).

### Fixed

This quality arc focuses on alignment, auditing and documentation. There are no functional bug fixes in this changelog. The 20-iteration deep-review in phase 002 surfaced 3 P0 findings which were fixed in the relevant per-stack packets (not in this umbrella). The remediation re-review in phase 002 verified closure against commit `ba6816a49`.

### Verification

- **20-iteration deep-review (002)** -- `review/review-report.md` cites confirmed P0 findings with concrete file-and-line evidence. `review/deep-review-state.jsonl` contains iteration records 1 through 20 with bundle-gate outcomes. The 7-iteration remediation re-review at `review-002-remediation/review-report.md` verified that the original 3 P0s were closed.
- **Playbook audit reproducibility (001)** -- `evidence/generate-playbook-quality-audit.js` regenerates all 3 audit CSVs from the live playbook source, so a future operator can rerun and diff.
- **Benchmark format consolidation (006)** -- stale-path `rg` sweep returns 0 matches outside packet 006 docs. Both shipped `benchmark_report.md` files still validate with `validate_document.py`. `validate.sh --strict` passes.
- **Install hygiene diagnosis (005)** -- `which ccc` confirms PATH resolution to a stale non-editable pipx install. `pipx package direct-url` confirms non-editable. The local venv `direct-url` confirms editable. pipx repair attempts fail as expected under sandbox permissions.
- **Sk-doc compliance (004)** -- `historical FORMAT.md` exists in both skills with the symlink resolving correctly. Phase A and B contents are present.

### Files Changed

| Area | File | Change |
|---|---|---|
| Benchmark format | `.opencode/skills/sk-doc/references/benchmark_creation.md` | Created (~450 LOC merged from FORMAT.md and benchmarks_format.md) (006) |
| Benchmark format | `.opencode/skills/sk-doc/assets/benchmark/source_template.md` | Created (006) |
| Benchmark format | `.opencode/skills/sk-doc/references/benchmarks/FORMAT.md` | Deleted (006) |
| Benchmark format | `.opencode/skills/sk-doc/references/benchmarks/` | Directory deleted (006) |
| Benchmark format | `.opencode/skills/sk-doc/references/benchmarks_format.md` | Deleted (006) |
| Benchmark format | `.opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md` | Deleted (symlink removed) (006) |
| Benchmark format | `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/FORMAT.md` | Deleted (symlink removed) (006) |
| Benchmark format | `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` | Modified (usage comment repointed) (006) |
| Benchmark format | `.opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md` | Modified (006) |
| Benchmark format | `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/README.md` | Modified (006) |
| Benchmark evidence | `.opencode/skills/system-spec-kit/mcp_server/benchmarks/historical FORMAT.md` | Created (004 Phase A) |
| Benchmark evidence | `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/historical FORMAT.md` | Created (004 Phase A) |
| Benchmark evidence | `.opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/` | Created (004 Phase B) |
| Benchmark evidence | `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/` | Created (004 Phase B) |
| Deep review | `002-deep-review-stack/review/review-report.md` | Created (002) |
| Deep review | `002-deep-review-stack/review/deep-review-state.jsonl` | Created (002) |
| Deep review | `002-deep-review-stack/review/iterations/iteration-001.md` through `iteration-020.md` | Created (002) |
| Deep review | `002-deep-review-stack/review-002-remediation/review-report.md` | Created (002) |
| Playbook audit | `001-playbook-quality-audit/001-fairness-audit/evidence/playbook-fairness-audit.csv` | Created (001) |
| Playbook audit | `001-playbook-quality-audit/002-tool-coverage-audit/evidence/tool-coverage-audit.csv` | Created (001) |
| Playbook audit | `001-playbook-quality-audit/003-scenario-expansion/evidence/scenario-expansion-summary.csv` | Created (001) |
| Playbook audit | `001-playbook-quality-audit/evidence/generate-playbook-quality-audit.js` | Created (001) |
| Scaffold | `003-skill-docs-alignment/{001-skill-mds-audit, 002-root-readme-update, 003-embedder-pluggability-narrative}/spec.md` | Created scaffolds (003) |
| Scaffold | `007-cocoindex-install-hygiene-pipx-repair/{spec,plan,tasks,implementation-summary}.md` | Created scaffolds (007) |
| Scaffold | `008-spec-memory-vitest-stabilization/{spec,plan,tasks,implementation-summary}.md` | Created scaffolds (008) |
| Historical specs | 4 historical `spec.md` files in `016-embedder-testing-and-architecture/` | Modified with canonical-mechanics pointer (006) |

### Follow-Ups

- **Phase 003 skill-docs-alignment** has not executed. The three children are scaffolded but never dispatched. A future session should sweep all `.opencode/skills/*/SKILL.md`, README and references for stale gemma or nomic refs and outdated architecture claims, refresh the root README and author the canonical embedder-pluggability narrative.
- **Phase 004 Phase C and Phase D** are pending. The `benchmark_report.md` and README files for both adopters need `@markdown` agent dispatch and strict validation. Without them the shipped benchmark folders are functional but not yet sk-doc compliant.
- **Phase 007 pipx repair** is blocked on operator-side pipx configuration. Once `~/.local/pipx` is writable outside the repo sandbox, the editable repair can run and the benchmark harness will load from the same source as the production MCP path.
- **Phase 008 vitest stabilization** awaits operator opt-in. The 168-failure inventory is preserved with per-cluster remediation plans. Pickup cost is high (≥1 dedicated session per cluster) so the deferral is rational.
- **Periodic playbook-fairness rerun.** The fairness and coverage audits should be rerun semi-annually using the reproducible JavaScript helper. New mk-spec-memory MCP tools added since the audit need scenario coverage. New cat-* surgery lessons should feed back into the inventory.
- **Deep-review cadence.** The 20-iteration review pattern from phase 002 is a heavy investment. A lighter recurring sweep (5 iterations on diff-only scope) would catch regressions without re-paying the full cost each release.
