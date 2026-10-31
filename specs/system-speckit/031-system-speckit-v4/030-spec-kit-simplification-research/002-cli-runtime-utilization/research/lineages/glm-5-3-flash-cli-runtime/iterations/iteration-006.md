---
title: "Iteration 6: The Support Shell — spec-folder/, utils/, types/ + the Undocumented Root Entries"
trigger_phrases: []
---
# Iteration 6: The Support Shell — spec-folder/, utils/, types/ + the Undocumented Root Entries

## Focus

Whether the support directories (spec-folder/ 7 files/3249L, utils/ 20/5275L, types/ 4/765L, config/ 2/25L) carry stranded modules, and the wired status of the root-level entries the README's own topology omitted (doctor.sh, deploy-mcp.sh, registry-loader.sh, check-api-boundary.sh, migrate-deep-research-paths.ts, seed-council-value-fixture.cjs, test-council-matrix.sh, the .scan* seven).

## Actions Taken

1. Production import census: grepped every from/import/soure citation of utils|types|lib modules across all cli sources (tests excluded, dist/node_modules excluded), counted per module, then checked the uncited-complement individually (any spelling, tests included, intra-dir included).
2. Diffed the two alignment-validators; extracted who imports each (core/workflow.ts:98 vs spec-folder/index.ts:20 + folder-detector.ts:27-28).
3. Ran the 5-surface + workflows + skills-wide reference search for each undocumented root entry; read doctor.sh's and .scan-one.sh's self-descriptions.

## Findings

1. `runtime/cli/doctor.sh` ("COMPONENT: SYSTEM SPEC KIT DOCTOR", :2; "Read-only health check for the system-spec-kit runtime package installation. Catches the install-time silent-skip-deps failure", :3) — declared: the package's health check. Observed: ZERO references anywhere (rg over .opencode + .github, docs included: NONE-FOUND outside itself; the /doctor command implements its own machinery under .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh; the two registries: absent — scripts-registry 0 hits, established iteration 1; README: NONE-FOUND, established iteration 1). A 2.7KB superseded health check riding in the tree. Severity P1. Recommendation: remove — or, if the install-time silent-skip-deps check is still wanted, merge it into the /doctor command's bootstrap.

2. The `.scan*` family + 0-byte residue (`.scan-one.sh` "Validate ONE spec folder with a short timeout, print a single summary line", `.scan-validate-all.sh`, `.scan-results.txt` [0 bytes], `.scan-lines.txt`, `.scan-validate-all.txt`, `.no-frontmatter-list.txt`, `.enumerate-no-frontmatter.py`) — declared: none anywhere (the README topology omission, finding f-iter001-005). Observed: ZERO references (rg: NONE-FOUND; the pair of validate-all scripts duplicate, at one-off quality, what tests/test-validation.sh + spec/validate.sh already provide). Severity P1. Recommendation: remove the seven.

3. One-off migration/seed scripts with changelog-only memories — `migrate-deep-research-paths.ts` (7.0KB; sole reference: changelog/v3.0.0.3.md) and `seed-council-value-fixture.cjs` (3.3KB; references: 2 deep-ai-council changelogs + 1 benchmark report JSON). Observed: no wired caller, no current documentation, no registry entry. Severity P1. Recommendation: remove both (their consumption is recorded in the changelogs they point at).

4. The twin-module pattern — same basename, different directory, drifting role: `core/alignment-validator.ts` (227L, "Extracted from workflow.ts to reduce module size", :4-5; imported by core/workflow.ts:98) vs `spec-folder/alignment-validator.ts` (712L; imported by spec-folder/index.ts:20 + folder-detector.ts:27-28) — BOTH production-wired, disjoint concerns, identical names; plus the already-filed scorer twins (core/quality-scorer.ts 0-caller vs extractors/ canonical; f-iter004-002) and a third suspects-pair (utils/phase-classifier vs lib/phase-classifier, 5 citations whose spelling split: caller-not-fully-verified) — against the ONE sanctioned non-twin: cli/config/index.ts, the documented inversion seam (config/index.ts:5-8, 7 importers). The pattern's cost is realized in the package's own testDiscoveries (the disambiguation test exists precisely because two modules share a name and a neighborhood). Severity P2. Recommendation: document the ownership boundary (which directory owns which concern) — the no-rewrite-compliant half of a merge.

5. Two more documented-but-unwired root entries, extending finding f-iter002-007's class — `deploy-mcp.sh` (README:111: "canonical rebuild step after pulling source changes"; references: itself + 1 fixture string + 1 changelog) and `test-council-matrix.sh` (README:113; references: 2 deep-ai-council changelogs + 1 benchmark report — the sk-benchmark harness that USED it: historical). Both: no wired caller in any of the five surfaces or workflows; the humans/AI invocation the docs promise is the only execution path. Severity P2. Recommendation: document their unwired status alongside the six already recorded (or wire deploy-mcp into the 046-series worktree setup, which is the one workflow that would actually want it).

## Positive Controls (verified, not findings)

- The census SATURATES: 14 of 15 strandedness suspects are production-cited — data-validator (4), tool-sanitizer (2), workspace-identity (3), validation-utils (1, its legit caller), memory-telemetry (1: post-save-review.ts:23), semantic-summarizer (1), trigger-extractor (3), ascii-boxes (2), flowchart-generator (2: conversation-extractor + 1), anchor-generator (2: file-extractor.ts:26 + 1), dist-freshness (5: validate.sh:280 + package.json:18,20 + 3), generate-description (5), embeddings (3; the specific import line: not chased — the stale-registry-claim where it matters is already filed at the entrypoint, f-iter004-004), phase-classifier (5). The support shell is NOT the stranded-marbles pit the dir counts suggested.
- types/ is 100% wired: session-types (30 citations), save-mode (4), js-yaml.d.ts (ambient).
- spec-folder/ is 6/6 productive: folder-detector, directory-setup, alignment-validator (712L), generate-description (5 citations), nested-changelog (6 command YAMLs, iteration 2 evidence), index — the save path's detection layer (workflow.ts:23, collect-session-data.ts:22) plus the changelog writer.

## Questions Answered

- (Q1 progress) spec-folder/, utils/, types/, config/: purposes vs callers — done. Everything wired except the twins' uncited halves and the tree-thinning-adjacent 227L/712L name pair.

## Questions Remaining

- Q1 residuals: setup/, ops/, observability/, kpi/, metrics/, optimizer/, resource-map/, sweep/, codex/, pi/, runtime-mirrors/ (iterations 7-8); Q3 root-check-scripts + package.json parity; Q4 rollup; Q5 codex/pi/mirrors/evals; Q6 ../lib + shared.

## What Worked / What Failed

- Worked: the whole-census-then-complement order — it produces saturation evidence (14/15 cited) instead of anecdote, and the complement list came out SHORT.
- Worked: reading each undocumented root entry's own header (doctor.sh:2-3, .scan-one.sh:2) — one-off tools introduce themselves.
- Failed: none; no approach exhausted.

## Ruled Out

- "core/alignment-validator.ts and spec-folder/alignment-validator.ts are duplicates" — 227L vs 712L, disjoint concerns, both wired from different halves (workflow.ts:98 vs spec-folder/index.ts:20).
- "The support shell hides more stranded modules" — the census complement came back with 5-6 candidates, of which most fell on the second pass.

## Sources

[SOURCE: .opencode/skills/system-spec-kit/runtime/cli/doctor.sh:2-3] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/.scan-one.sh:2] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/core/alignment-validator.ts:4-5] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/core/workflow.ts:98] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/spec-folder/alignment-validator.ts (712L); spec-folder/index.ts:20; spec-folder/folder-detector.ts:27-28] [SOURCE: .opencode/skills/system-spec-kit/changelog/v3.0.0.3.md; .opencode/skills/system-deep-loop/deep-ai-council/changelog/v1.1.0.0.md, v1.2.0.0.md] [SOURCE: .opencode/skills/system-spec-kit/runtime/cli/README.md:111,113] [SOURCE: .opencode/commands/doctor/scripts/doctor-runtime-bootstrap.sh] [SOURCE: .opencode/skills/system-deep-loop/benchmark/reports/compiled-routing/2026-07-21--real--luna-high/skill-benchmark-report.json]

## Next Iteration

Iteration 7: the delivery surface — codex/ (4, 938L), pi/ (3, 486L), runtime-mirrors/ (3, 366L), setup/ (6, 525L), ops/ (7, 1347L): whether the mirror generators and drift checks are invoked by their promised workflows (agent-mirror-sync.yml, prompt-card-sync.yml, rule-canary-sync.yml), what setup/check-prerequisites' 6 command-YAML callers actually get, and whether ops/ heals anything.
