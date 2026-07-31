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
- Topic: align create/doctor commands with skill-advisor index for easy skill creation
- Started: 2026-07-30T18:23:52.000Z
- Status: INITIALIZED
- Iteration: 20 of 20
- Session ID: dr-20260730-182352-create-doctor-skill-advisor
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Current create/doctor lifecycle versus live skill-advisor index and parent-hub metadata contracts | - | 0.88 | 0 | insight |
| 2 | Whether the hook drift is expected for this worktree/runtime generation or should be repaired in the separate runtime-mirror workstream. | - | 0.86 | 0 | insight |
| 3 | Which checkout is canonical when a developer has several linked worktrees, and how should the doctor surface that choice before offering a global install? | - | 0.84 | 0 | insight |
| 4 | Exact operator-facing source-selection syntax for the runtime-mirror route while preserving its read-only default | - | 0.91 | 0 | insight |
| 5 | Should the Codex-hook checker auto-select the Git primary checkout from a linked worktree or require explicit --repo? | - | 0.79 | 0 | insight |
| 6 | Whether description.json should remain a descriptive parent-hub projection or be validated against registry and graph vocabulary. | - | 0.84 | 0 | insight |
| 7 | Whether the runtime-mirror route should propagate the explicit --repo source-selection option beyond the Codex-hook checker. | - | 0.86 | 0 | insight |
| 8 | Should the missing Pi checker invocations be restored before any route-level source-selection work is implemented? | - | 0.90 | 0 | insight |
| 9 | Should the route present the linked-worktree primary-checkout path as an explicit source-selection diagnostic before any repair command is offered? | - | 0.87 | 0 | insight |
| 10 | Should the read-only route automatically select the Git primary checkout for the hook check, or show it and require an explicit --repo confirmation? This remains separate from whether repair commands require approval. | - | 0.82 | 0 | insight |
| 11 | How /create:skill-parent and /doctor:skill-advisor should expose one canonical-checkout/index handoff while leaving advisor rebuild and graph scan operator-owned. | - | 0.78 | 0 | complete |
| 12 | Which exact skill_graph_validate/skill_graph_scan and advisor_rebuild CLI forms should the operator-facing handoff print for a newly created parent? | - | 0.86 | 0 | insight |
| 13 | Should the shared handoff be implemented as one reusable formatter consumed by create and doctor, or as duplicated presentation fields guarded by a contract test? | - | 0.91 | 0 | insight |
| 14 | Should the contract test cover /create:skill as well as /create:skill-parent, given the standalone create path has a separate memory/indexing presentation? | - | 0.72 | 4 | insight |
| 15 | Whether the doctor-side route should expose skill_graph_validate through route metadata or retain a CLI-only validation handoff. | - | 0.80 | 0 | insight |
| 16 | What exact output fields and failure policy should the doctor presentation use for skill_graph_validate alongside graph_scan_report and advisor test results? | - | 0.84 | 0 | insight |
| 17 | Should description.json remain a descriptive parent-hub projection rather than participating in graph-vocabulary validation? | - | 0.88 | 0 | insight |
| 18 | Which exact post-create handoff wording should identify description.json, graph-metadata.json, leaf-manifest.json, and the operator-owned skill_graph_scan/advisor_rebuild steps? | - | 0.92 | 0 | insight |
| 19 | Where should the shared vocabulary contract live, and which create branches need the handoff: parent full-create/full-update only, or standalone full-create/full-update as well? | - | 0.95 | 0 | insight |
| 20 | Should parent generation invoke the scoped generate-leaf-manifest.cjs --write <skillDir> directly or rely on ci-skill-root-metadata.cjs --fix and select the created hub's result? | - | 0.96 | 0 | complete |

- iterationsCompleted: 20
- keyFindings: 97
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] What is the current end-to-end path a developer follows to create a new skill via `/create:skill`/`/create:skill-parent` and `sk-create-skill`'s guides, and where does it diverge from the live skill-advisor index reality (mode-registry.json, hub-router.json, description.json/graph-metadata.json dual schemas, leaf-manifest.json)? [legacy-import]
- [ ] Which `/doctor` routes (`skill-advisor`, related scripts under `.opencode/commands/doctor/scripts/`) diagnose or repair skill-advisor/skill-routing state, and are they complete, current, and correctly wired to the skill-creation lifecycle end to end? [legacy-import]
- [ ] What gaps exist between `sk-create-skill`'s templates/guides/references and the actual parent-hub canon (skill-root metadata contract, mode-registry + hub-router requirements, leaf-manifest, command-metadata) that a new-skill author must satisfy today? [legacy-import]
- [ ] Where is skill-advisor index setup (`advisor_rebuild`, `skill_graph_scan`/`validate`, hub-identity metadata) under-automated or under-documented relative to what `/create:*` and `/doctor` actually do or claim to do? [legacy-import]
- [ ] What specific alignment/automation opportunities (new doctor checks, updated create-skill guides, tighter skill-advisor integration, missing or stale cross-references between the three surfaces) would most reduce friction and drift for creating and maintaining a skill end-to-end? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] What is the current end-to-end path a developer follows to create a new skill via `/create:skill`/`/create:skill-parent` and `sk-create-skill`'s guides, and where does it diverge from the live skill-advisor index reality (mode-registry.json, hub-router.json, description.json/graph-metadata.json dual schemas, leaf-manifest.json)?
- [ ] Which `/doctor` routes (`skill-advisor`, related scripts under `.opencode/commands/doctor/scripts/`) diagnose or repair skill-advisor/skill-routing state, and are they complete, current, and correctly wired to the skill-creation lifecycle end to end?
- [ ] What gaps exist between `sk-create-skill`'s templates/guides/references and the actual parent-hub canon (skill-root metadata contract, mode-registry + hub-router requirements, leaf-manifest, command-metadata) that a new-skill author must satisfy today?
- [ ] Where is skill-advisor index setup (`advisor_rebuild`, `skill_graph_scan`/`validate`, hub-identity metadata) under-automated or under-documented relative to what `/create:*` and `/doctor` actually do or claim to do?
- [ ] What specific alignment/automation opportunities (new doctor checks, updated create-skill guides, tighter skill-advisor integration, missing or stale cross-references between the three surfaces) would most reduce friction and drift for creating and maintaining a skill end-to-end?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▆▅▅▇▃▅▅▆▅▄▃▅▇▁▃▅▆▇██
- score sparkline: ▆▅▅▇▃▅▅▆▅▄▃▅▇▁▃▅▆▇██
- Last 3 ratios: 0.92 -> 0.95 -> 0.96
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.96
- coverageBySources: {"code":16,"other":65}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Auto-running `skill_graph_scan` or `advisor_rebuild` as part of create or a read-only doctor route. The operations change derived/index state and should remain explicit operator actions. (iteration 11)
- Making `description.json` the sole source of advisor truth. The parent-hub contract still assigns authority to the registry, router, graph metadata, and generated leaf/derived checks. (iteration 11)
- Treating `--allow-worktree` as canonical-source selection. It only disables the installer’s safety refusal; it does not identify the authoritative checkout. (iteration 11)
- A single byte-identical formatter/test fixture is not supported by the current ownership model: create and parent-create have distinct presentation assets and distinct result shapes. The useful convergence point is a field vocabulary and command semantics. (iteration 14)
- Requiring mode-registry.json, hub-router.json, description.json, or graph-metadata.json in every /create:skill contract assertion. (iteration 14)
- Treating /create:skill as covered indirectly by the parent-skill test. (iteration 14)
- Auto-running advisor_rebuild or skill_graph_scan as an implicit side effect of a read-only diagnostic route; this remains ruled out by prior iterations. (iteration 15)
- Retaining CLI-only validation as the canonical /doctor path; it leaves the route's native tool contract and workflow blind to structural graph failures. (iteration 15)

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
The route update still needs an explicit decision on whether `skill_graph_validate` is exposed through `_routes.yaml`/router frontmatter or retained as a CLI-only handoff. The live tool registry proves the current omission is real.

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
