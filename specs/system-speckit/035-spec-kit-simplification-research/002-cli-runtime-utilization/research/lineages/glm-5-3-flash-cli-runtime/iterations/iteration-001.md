---
title: "Iteration 1: Package Topology and Declared Purpose"
trigger_phrases: []
---
# Iteration 1: Package Topology and Declared Purpose

## Focus

Baseline the audited package: what it declares itself to be (package.json, scripts-registry.json, README.md, ../../ARCHITECTURE.md, ../lib/MODULE-MAP.md, system-spec-kit/SKILL.md), what the tree actually contains, and where the 002 packet says this research must land. No caller conclusions yet beyond what these files themselves state; every later iteration tests one subsystem against this baseline.

## Actions Taken

1. Listed the full tree with per-directory file counts and LOC; identified dist/ and node_modules/ as symlinks and runtime/ as a symlink to ../dist.
2. Read package.json and scripts-registry.json in full; cross-counted their self-metadata.
3. Read README.md, ../../ARCHITECTURE.md, ../lib/MODULE-MAP.md in full; grepped SKILL.md for every runtime/cli invocation it mandates.
4. Read the 002 packet goal.md and spec.md directive; confirmed this lineage's research.md is a named deliverable and confirmed-findings.md is the downstream remediation child's input (produced later, outside this lineage's write surface).
5. Grepped the registry for any coverage of 11 subsystem directories.

## Findings

1. `package.json:4` — declared: "CLI tools for spec-kit context generation and continuity management". Observed: the same package ships the validation engine front ends (spec/, rules/ — 52 files), the retrieval subsystem (retrieval/ — 31 files), the import-boundary enforcement checks (evals/, wired at package.json:24), telemetry (observability/), cross-runtime mirror generators (codex/, pi/, runtime-mirrors/), and a CI freshness sweep (sweep/). Two-sided citation: the 002 packet's own problem statement, spec.md:83-85, already flags "a README that describes it as context generation while its heaviest callers are validation and retrieval". Three self-descriptions diverge: package.json:4 (continuity), cli/README.md:17 ("spec lifecycle work, continuity saves, metadata refresh, evaluations, setup checks and script regression coverage"), ../../ARCHITECTURE.md:23 ("CLI generation, validation, indexing, evals, and packet tooling"). Severity P2 (misleading description, not broken behavior). Recommendation: fix — pick one accurate scope sentence.

2. `scripts-registry.json:4` — declared: "Spec Kit Script Registry - Centralized catalog of all scripts for dynamic discovery". Observed: the registry's scripts[] (14 entries) plus libraries cover 14 scripts; grep found 0 path references for each of retrieval/, graph/, observability/, codex/, pi/, runtime-mirrors/, sweep/, optimizer/, resource-map/, kpi/, metrics/. The most consequential omission: retrieval/lookup-trigger-index.mjs and retrieval/generate-trigger-index.mjs are the mandated Gate 1 surfaces (system-spec-kit/SKILL.md:428, 432, 530-531; the root behavioral document §2 hard-codes the lookup invocation), yet the "dynamic discovery" catalog cannot discover them. Severity P1 (registry undercount makes discovery incomplete; not broken execution). Recommendation: fix — either register the 11 subsystems' entrypoints or scope the description to what it actually catalogs.

3. `scripts-registry.json:382-386` — declared counts: totalScripts 13, essentialScripts 7, optionalScripts 6, totalRules 14, essentialRules 3. Observed (programmatically recounted from the same file): scripts[] holds 14 entries — 7 essential:true and 7 essential:false — so totalScripts 13 and optionalScripts 6 are both one short; rules[] holds 9 entries, not 14; 4 of them (check-files, check-folder-naming, check-level-match, check-toc-policy) carry essential:true, not 3. Only essentialScripts 7 survives verification. (Mechanism corrected in place during this iteration: the count arithmetic, not a missing essential field, drops the 14th entry.) Severity P2. Recommendation: fix the metadata block or derive it.

4. `scripts-registry.json:7` — declared: lastUpdated 2025-12-31. Observed: the packet operates 2026-09-06 (002 spec.md Created field) and the registry's own invention dated 2025-12-31; the freshness field is ~8 months stale while the registry claims to be the living catalog. Severity P2. Recommendation: fix (or drop the field — that is the "remove" variant of the same line).

5. `README.md:33-105` (PACKAGE TOPOLOGY block) — declared: the complete tree. Observed: NONE-FOUND in README.md for doctor.sh, common.sh, registry-loader.sh, check-api-boundary.sh, migrate-deep-research-paths.ts, seed-council-value-fixture.cjs (grep across the file); the seven .scan* dotfiles (.enumerate-no-frontmatter.py, .no-frontmatter-list.txt, .scan-lines.txt, .scan-one.sh, .scan-results.txt [0 bytes], .scan-validate-all.sh, .scan-validate-all.txt) and the three symlink entries (dist, node_modules, runtime) are also absent from the topology. Six real shell/TS entrypoints and a residue family are undocumented. Severity P2. Recommendation: document the six; the .scan* residue is a removal candidate pending its caller check (iteration 6).

6. Worktree symlink resolution (observed via ls -la and readlink, no single file:line) — dist/ and node_modules/ are symlinks to absolute paths in the main checkout (/Users/michelkerkmeester/MEGA/.../runtime/cli/dist), and runtime/ → ../dist. In this 046 worktree the package's compiled output and dependency tree therefore live outside the worktree; a source edit here builds against the main checkout's state. Severity P2, worktree-scoped (may be intentional 046-experiment mechanics, caller-not-checked). Recommendation: document.

7. `package.json:19-20` — declared: "test" runs vitest with --config ../../vitest.config.ts (system-spec-kit/vitest.config.ts), while "test:task-enrichment" runs with --config ../vitest.config.ts (runtime/vitest.config.ts). Observed: both configs exist (ls -la: 2165 and 1616 bytes), so nothing is broken; the same package selects two different vitest configs for two test lanes with no documentation of why. Severity P2. Recommendation: document.

## Questions Answered

- (partial, Q1) The declared purposes are now sourced: package.json:4, cli/README.md:17/33-105/KEY FILES, ARCHITECTURE.md:23, MODULE-MAP.md (lib ownership only). Caller attribution for each directory remains open.

## Questions Remaining

- Q1 callers per directory (iterations 2-9); Q2 save pipeline stages (iterations 3-4); Q3/Q4 registry-vs-script parity deep dive (iterations 2, 6, 9); Q5 codex/pi/mirrors/evals invocation (iterations 7-8); Q6 framing + duplication verdict (iterations 9-10).

## What Worked / What Failed

- Worked: reading the registry's counts against its own arrays (not trusting the metadata block) surfaced three wrong numbers in one read.
- Failed: none; no approach exhausted.

## Ruled Out

- Nothing ruled out yet; the vitest-config discrepancy (finding 7) was checked for breakage before being filed and both configs exist.

## Sources

[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/package.json:4,6,19-24] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/scripts-registry.json:4,7,382-386] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/README.md:17,33-105] [SOURCE: .opencode/skills/system-spec-kit/ARCHITECTURE.md:23,28,100,148,182] [SOURCE: .opencode/skills/system-spec-kit/runtime/lib/MODULE-MAP.md (full)] [SOURCE: .opencode/skills/system-spec-kit/SKILL.md:428,430,432,526-535,547,549] [SOURCE: specs/.../002-cli-runtime-utilization/spec.md:76-90] [SOURCE: specs/.../002-cli-runtime-utilization/goal.md]

## Next Iteration

Iteration 2: spec/ + rules/ + validation/ — the validation lane. Inventory spec/ (20 files), rules/ (32), validation/ (8); grep the five caller surfaces (commands, bin, hooks, plugins, workflows) for spec/validate.sh, create.sh, check-completion.sh, recommend-level.sh, upgrade-level.sh, archive.sh, calculate-completeness.sh, nested-changelog, and each rules/check-*.sh; start the rules/-vs-registry-vs-package.json parity ledger.
