---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Root-level skill metadata JSON contract for .opencode/skills/ across all 12 skills
- Started: 2026-07-27T17:56:03Z
- Status: COMPLETE
- Iteration: 5 of 10
- Session ID: fanout-sol-high-fast-1785174758167-rdrppf
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: converged

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Build the exact 12-skill by eight-file root-level presence census and identify producer evidence for each file type. | metadata-census | 1.00 | 5 | complete |
| 2 | Trace consumers and schemas for description.json, graph-metadata.json, mode-registry.json, and hub-router.json. | hub-metadata-consumers | 1.00 | 5 | complete |
| 3 | Complete schemas and consumer call sites for leaf-manifest.json, leaf-manifest.config.json, leaf-aliases.json, and command-metadata.json. | leaf-command-contracts | 1.00 | 5 | complete |
| 4 | Derive the consumer-based skill taxonomy and resolve every exceptional presence case. | skill-class-taxonomy | 0.80 | 5 | complete |
| 5 | Canonical documentation, safe generation/backfill ownership, and a fleet presence-plus-freshness gate. | contract-and-enforcement | 0.90 | 5 | complete |

- iterationsCompleted: 5
- keyFindings: 25
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What is the complete 12-skill by eight-file root-level census, and who produces each file type?
- [x] What schema and complete consumer call-site set governs each file type, including advisor, benchmark, doctor, and tests?
- [x] What consumer-derived skill class taxonomy maps all 12 skills and makes each presence difference either required, optional by class, or defective?
- [x] How should the five graph-only skills, `leaf-aliases.json`, `command-metadata.json`, and sparse `sk-git` be classified after behavior-impact checks?
- [x] Where should the canonical contract live in `sk-doc/create-skill`, what can be generated/backfilled, and what fleet-wide presence-plus-freshness gate should enforce it?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██████████▇▆▄▃▁▂▂▃▄▅
- score sparkline: ██████████▇▆▄▃▁▂▂▃▄▅
- Last 3 ratios: 1.00 -> 0.80 -> 0.90
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.90
- coverageBySources: {"code":112,"other":9}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- A broad `command-metadata.json` search produced oversized output; narrowing to the create-command and command trees found no producer. Future work should search its consumers and Git history rather than repeat the broad search. (iteration 1)
- Counting `package.json`, `package-lock.json`, or `tsconfig.json`: they are root JSON files but not among the eight named metadata types. (iteration 1)
- Counting nested mode/packet JSON: excluded by the focus contract and direct-child glob. (iteration 1)
- The similarly named root-name consumer-matrix test concerns catalog/playbook directory names, not this eight-file metadata census. [SOURCE: .opencode/skills/sk-doc/scripts/tests/test-root-name-consumer-matrix.cjs:80-138] (iteration 1)
- Treating `leaf-manifest.config.json` or `leaf-aliases.json` as generated because the manifest generator reads them: the implementation identifies them as authored inputs and only writes `leaf-manifest.json`. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-68] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-127] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:215-218] (iteration 1)
- Repository-wide filename searches exceeded output limits because spec continuity metadata and historical documentation dominate results. Narrowing to executable ownership surfaces recovered precise call sites; repeating the broad search is not useful. (iteration 2)
- Treating every filename mention in specs, docs, fixtures, or generated records as a production call site; only executable reads and runtime/compiler inputs were classified as consumers. [INFERENCE: comparison of exact filename search results with the executable reads cited above] (iteration 2)
- Treating the advisor as a runtime consumer of every hub JSON file; it directly ingests graph metadata, reads selected mode registries for projection/delegation, and has no located runtime read of skill description or generic hub-router files. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/skill-graph/skill-graph-db.ts:952-970] [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts:160-180] (iteration 2)
- Counting only four direct reader files is stale: there are five; four is defensible only as the number of consumer surfaces after grouping a validator with its unit test. [INFERENCE: exact executable search results reconciled with the five reader files cited in Finding 5] (iteration 3)
- No standalone JSON Schema or create-command generator owns `command-metadata.json`; its executable schema is embedded in the `sk-design` surface validator, and bounded Git history confirms a hand-authored introduction. [INFERENCE: exact executable filename search plus introduction commit `2aa5fcff4a`] (iteration 3)
- Treating `command-metadata.json` as a generic advisor fleet input: the only multi-hub reader is a test with a fixed four-hub list, while production validation is local to `sk-design`. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-65] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-179] (iteration 3)
- Treating `leaf-aliases.json` as equivalent to registry aliases or standalone root config: neither alternative carries the `{workflowMode, leafResourceId, diskPath}` legacy-resolution mapping. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299] (iteration 3)
- Treating `leaf-manifest.json` as authored truth: all enforcement regenerates it from authored source and checks canonical bytes. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:74-91] (iteration 3)
- Fleet command metadata based only on command ownership: registry commands are already generic, while the singleton validator is interface-specific. [SOURCE: .opencode/skills/sk-doc/mode-registry.json:20-40] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-179] (iteration 4)
- Generating aliases from file presence would erase explicit workflow-mode/shared ownership policy. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs:242-299] (iteration 4)
- Legitimate sparse `sk-git` class: its router/corpus triggers the configured standalone contract. [SOURCE: .opencode/skills/sk-git/SKILL.md:42-95] [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:95-147] (iteration 4)
- Running the current freshness gate cannot classify missing-manifest eligibility because it enumerates only existing manifests. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-71] (iteration 4)
- Standalone-description class: descriptions are enforced for hubs but absent from advisor scoring ingestion. [SOURCE: .opencode/commands/doctor/scripts/parent-skill-check.cjs:1020-1045] [INFERENCE: exact production advisor search found no reader] (iteration 4)
- A generic command-metadata backfill remains unjustified because there is no fleet production consumer or shared schema to generate toward. [SOURCE: .opencode/skills/system-skill-advisor/mcp-server/tests/command-binding-existence.vitest.ts:44-64] [SOURCE: .opencode/skills/sk-design/shared/scripts/design-command-surface-check.mjs:121-180] (iteration 5)
- Creating a third sparse class for `sk-git`: class-first discovery makes it a failing S root and exposes the three missing files. [SOURCE: research/lineages/sol-high-fast/iterations/iteration-004.md:15-15] (iteration 5)
- Extending the current manifest-first scanner alone: it cannot see a required output that does not exist. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/ci-leaf-manifest-freshness.cjs:54-71] (iteration 5)
- Inferring H/S from `graph-metadata.json.family` is not reliable: live families describe domains (`cli`, `mcp`, `sk-hub`, `system`, and others), not the H/S file contract. [INFERENCE: bounded `jq` inventory of `.opencode/skills/*/graph-metadata.json` in this iteration] (iteration 5)
- Treating all eight files as generated: aliases, registries, routers, graph intent, and command policy contain authored semantics. [SOURCE: .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs:50-68] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md:94-126] (iteration 5)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
