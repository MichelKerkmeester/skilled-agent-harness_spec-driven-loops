---
title: "Iteration 9: The Cross-Package Ledger — Certification, the Coverage-Graph Treaty, the Seam Census"
trigger_phrases: []
---
# Iteration 9: The Cross-Package Ledger — Certification, the Coverage-Graph Treaty, the Seam Census

## Focus

Q6's duplication hunt across the package, ../lib/ and the shared layer, plus the final certification of every no-caller claim at FULL sweep (tests, docs, fixtures included) so the removal list is PR-grade.

## Actions Taken

1. Death-row certification: 19 no-caller candidates, each re-counted across the FULL .opencode + .github tree (tests + docs + fixtures included, dist/node_modules excluded, self-mentions inherent in the count).
2. The cli→@spec-kit/shared import census: every `from '@spec-kit/shared...'` lane, counted and ranked.
3. The coverage-graph trail: the 19+ intra-cli citations resolved into 8+1 test files + 1 stray; the .ts importers outside cli (system-deep-loop) tracked down; the deep-loop's OWN production coverage-graph source located; the parity treaty's import lines read.
4. The shim/dependency reconciliation: who imports lib/trigger-extractor.js vs @spec-kit/shared/trigger-extractor; who imports lib/embeddings.js; who imports js-yaml.

## Findings

1. The coverage-graph engine is duplicated across two skills and unified by a TEST, not by a module — cli/lib/coverage-graph/*.ts (the spec-kit copy: ZERO production importers inside its own package; 13 test suites exercise it: 8+ here — coverage-graph-integration/core/signals/convergence/stress/contradictions/cross-layer, graph-convergence-parity — plus 5 across the fence) vs .opencode/skills/system-deep-loop/runtime/lib/coverage-graph/{signals,query}.ts (the deep-loop's PRODUCTION copy, with its own types: next-focus-types.ts, better-sqlite3.d.ts). The treaty: tests/graph-convergence-parity.vitest.ts:6-11 imports BOTH sides — from '../../../system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.js', a CROSS-SKILL SIBLING-RELATIVE import — to pin the two signals implementations together. Meanwhile the shared/ package — the sanctioned seam for exactly this (ARCHITECTURE.md:20-22: "shared/ owns neutral modules importable by both scripts and the engine") — hosts neither copy. A fourth exhibit joins the twin-module pattern (f-iter006-004): the stray cli/lib/coverage-graph-convergence.cjs sitting beside the coverage-graph/ DIRECTORY it shadows. Severity P1 (two production-grade implementations of one graph engine, drift-patrolled by a test instead of deduplicated by an import). Recommendation: merge — one copy in @spec-kit/shared (or solely in the deep-loop, if the spec-kit's own graphs never materialize), the treaty retired.

2. Certification rollup (closes Q4) — every prior no-caller claim re-verified at full sweep; the count order (self-mentions included in each number): continuity/ast-parser 0, setup/_utils 0, .scan-one 0 (+6 residual siblings at 0-1), quality-kpi 1 (self only), cli/doctor 1 (self only), migrate-deep-research-paths 1 (one changelog), run-phase2-closure-metrics 2, collect-redaction-calibration-inputs 2, run-redaction-calibration 2 (one each = the evals/README), registry-loader 2 (one conventions doc), check-smart-router 2, spec/sweep-track-roots 2, fix-memory-h1 3 (2 READMEs + self), rank-memories 5 (all documentation), the retrieval quartet rg-wrapper/retrofit-convention/sweep-memory-residue/measure-cold-lookup 4-8 (all documentation + fixture strings). NO claim overturned; the removal bill stands at ~30 files + 2 directories (kpi/, plus the .scan*+fixtures residue), each with its evidence line already filed (f-iter002-003, f-iter003-002/003, f-iter006-001/002/003, f-iter008-002/003). Severity P2 (the rollup; the members carry their own P1s). Recommendation: remove — in one PR, with the docs lines they ship.

3. The sanctioned seam works; its 2023-era shadowRSVP does not — the cli→@spec-kit/shared census: 18 distinct import lanes, 43+ citations, led by shared/frontmatter/parse-frontmatter (11), shared/parsing/memory-sufficiency (5), shared/utils/path-security (4 — the save gate's validateFilePath), shared/trigger-extractor (4) — the dependency (package.json:52-54: @spec-kit/runtime, @spec-kit/shared, js-yaml) earns its file:../../shared. Against that: the registry's libraries[].javascript (8 "Re-exports from ../../shared/..." shims, scripts-registry.json:330-395) tells a staged-migration story: lib/trigger-extractor.js = ZERO importers (everyone imports the shared module directly — dead-but-registered); lib/embeddings.js = ONE caller, for TWO CONSTANTS (core/workflow.ts:56: EMBEDDING_DIM, MODEL_NAME — correcting f-iter004-004's "embeddings arrives nowhere": it arrives, but only as literal. The registry's generate-context.dependencies therefore stands at 3/3 indirect, not 2/3+absent); the other six (content-filter, anchor-generator, simulation-factory, flowchart-generator, ascii-boxes, semantic-summarizer) = 1-6 citations each, alive. Severity P2. Recommendation: fix — re-derive libraries[] from this census (the same parity treatment validator-registry earned, f-iter002-001), or execute that finding's registry-removal.

4. js-yaml: a top-level dependency with ONE production importer — rules/check-grep-convention-helper.mjs (plus 2 tests and the ambient types/js-yaml.d.ts), while 11 lanes take their YAML via shared/frontmatter/parse-frontmatter. Severity P2. Recommendation: merge — put the one helper's YAML need behind the shared seam (or downgrade the dep into that helper), and the top-level dependency drops.

## Positive Controls (verified, not findings)

- The seam census doubles as the utilization proof for the 003-shared-package-utilization packet (the NEXT phase): 18 lanes, no orphaned shared import, the heaviest (frontmatter) exactly where the save pipeline needs it.
- The parity treaty itself is exemplary: it names its both sides, imports them by relative path, and would FAIL CI IF ANYONE RAN CI (f-iter007-003) — the mechanism is right, the wiring is the missing half.
- The deep-loop's runtime/lib/coverage-graph/ imports its OWN better-sqlite3.d.ts — the graphs' persistence lives in the deep-loop's runtime/database (ARCHITECTURE.md:160's ownership row holds: the spec-kit copy never touches a database).

## Questions Answered

- Q6 (the duplication half): the exhibits — coverage-graph ×2 skills + treaty (P1), repo-root ×3 (f-iter005-003), template mechanisms ×3 (f-iter004-003 + template-utils.sh's 6 citations), scorers ×2 (f-iter004-002), alignment-validators ×2 + phase-classifiers ×2 (f-iter006-004), sweep ×4 (f-iter008-007), the registry twins ×2 (f-iter002-001), the shim shadow (this iteration). TEN duplication exhibits, ONE systemic cause: the package accretes a copy where a seam (shared/, or the 2021-2023 staging dirs) already exists.

## Questions Remaining

- Q6 (the framing half) + Q3's last leg (root check-scripts vs package.json) — both are iteration-10's consolidation verdicts.

## What Worked / What Failed

- Worked: chasing the 19th citation instead of stopping at 18 — the treaty import (a cross-skill RELATIVE path) was the answer to "who unifies the copies", and it was a test, not a module.
- Worked: the death-row certification counting SELF-mentions honestly (a "1" means alone) — no finding needed reputational inflation.
- Failed: none; no approach exhausted.

## Ruled Out

- "cli/lib/coverage-graph/ is the production copy" — its own package's production importers: NONE-FOUND; the deep-loop's copy is the one with production neighbors (query, types, its database).
- "js-yaml backs the frontmatter parsing" — that is shared/frontmatter/parse-frontmatter (11 lanes); js-yaml survives on one helper.

## Sources

[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/tests/graph-convergence-parity.vitest.ts:6-11] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/lib/coverage-graph-convergence.cjs] [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts + coverage-graph-query.ts + better-sqlite3.d.ts] [SOURCE: .opencode/skills/system-deep-loop/runtime/tests/unit/ (4-5 coverage-graph-*.vitest.ts)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli (death-row certification, 19 counts, this session)] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/core/workflow.ts:56] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/scripts-registry.json:330-395] [SOURCE: .opencode/skills/system-spec-kit/ARCHITECTURE.md:20-22,160] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/rules/check-grep-convention-helper.mjs (js-yaml)]

## Next Iteration

Iteration 10: the consolidation verdict — the removal/merge list ranked by confidence that nothing documented depends on it, the framing verdict (three self-descriptions vs the caller-quantified reality, incl. the heaviest-caller claim), the Q3 last leg (root check-scripts vs package.json), and the residuals stated honestly (caller-not-verified items, the dynamic-import caveat, this worktree's symlink mechanics).
