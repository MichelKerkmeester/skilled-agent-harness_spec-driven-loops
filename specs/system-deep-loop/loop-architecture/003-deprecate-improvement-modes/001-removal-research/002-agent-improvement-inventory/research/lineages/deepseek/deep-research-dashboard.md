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
- Topic: Inventory every reference to the agent-improvement deep-loop mode (workflowMode agent-improvement, command /deep:agent-improvement, assets deep-agent-improvement-*.yaml and deep-agent-improvement-presentation.txt, the deep-improvement agent, the deep-improvement packet and its loop host, and the legacy advisor id deep-improvement whose default mode is agent-improvement) across this whole repository outside specs/, so its full deletion can be planned. Start from .skilled/skills/system-deep-loop/mode-registry.json, hub-router.json, ROUTER.md, SKILL.md, command-metadata.json, leaf-manifest.json, leaf-scopes.json, graph-metadata.json, .skilled/commands/deep/, .skilled/agents/, .skilled/skills/system-deep-loop/deep-improvement/ and runtime/, .skilled/skills/system-skill-advisor/ (projection maps, alias groups, alias-fold and default-mode projection, routing-registry drift guard), .skilled/skills/sk-doc/, .skilled/skills/cli-external-orchestration/, and the runtime directories .claude .opencode .codex .cursor .pi .devin .hermes (agents, commands, prompts, Hermes agent-* skill mirrors, and whether each is a symlink, a generated copy or a hand-written file). Also check hooks, task-dispatch, bin/, scripts/git-hooks, env examples, CROSS-CLI.md, agent and command index files, READMEs, changelogs and the root README.md, and record whether anything outside this repository consumes the mode or the agent. Name every caller of deep-improvement packet scripts or runtime libraries from outside the two improvement modes. For every reference give [SOURCE: path:line] and classify it as DELETE (exists only for this mode or the packet), EDIT (shared file, remove the mention), SHARED-WITH-MODEL-BENCHMARK (also used by the model-benchmark mode, which a sibling run inventories), or KEEP-AS-HISTORY (changelog or archive). List indirect wiring separately: registry projections, alias folds, compiled contracts, drift guards, generated mirrors, tests and fixtures. Finish with the tests, validators and doctor checks that cover the touched surfaces. This run is read-only outside its own research directory: do not edit, move, delete or stage any repository file; no git commit, push, checkout, reset or stash; no installs.
- Started: 2026-10-10T18:39:24Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: fanout-deepseek-1791657289869-1teen6
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Hub surface: system-deep-loop root registries, routers and mode metadata plus /deep:agent-improvement command file and its three owned assets | hub-surface | 0.90 | 12 | complete |
| 2 | Deep-improvement packet: lane-exclusive subtrees vs model-benchmark-shared chassis, loop-host default-mode seam, shared script defaults, allowlist and tests | packet-surface | 0.85 | 13 | complete |
| 3 | Runtime layer: lane-dedicated libraries, authority flip order, mode-append gateway adapter, legacy projections, shipped census, runtime tests | runtime-surface | 0.90 | 11 | complete |
| 4 | Skill-advisor projection surface: Python alias group and router maps, TypeScript alias fold and generated projection, generated bridges and generator, drift guard, scorer tests and routing fixtures | advisor-surface | 0.90 | 15 | complete |
| 5 | Agents/hooks/compiled-routing/cross-skill surfaces plus every external caller of the packet's check-agent-mirror-sync script | cross-skill-surface | 0.85 | 16 | complete |
| 6 | Runtime mirrors A: .claude and .opencode agent-improvement surfaces classified as symlink, generated copy or hand-written file | runtime-mirrors | 0.90 | 10 | complete |
| 7 | Runtime mirrors B: .codex .cursor .pi .devin .hermes agent-improvement surfaces classified as symlink, generated copy or hand-written file, including Hermes agent-* skill mirrors | runtime-mirrors | 0.90 | 13 | complete |
| 8 | History and documentation surfaces: root README, hub changelog, feature-catalog, manual-testing-playbook, benchmark reports, shared progress doc, prose boundary | documentation-surfaces | 0.80 | 10 | complete |
| 9 | Consumer and externality checks: sk-doc Lane A branch, retrieval corpus fixtures, package privatization, full script-caller sweep, dist and per-runtime dispatch negatives | externality | 0.90 | 9 | complete |
| 10 | Tests, validators and doctor checks: runtime unit suite, CI gates (runtime, drift, tree parity, mirror sync), hook/git-hook tests, packet test dirs, behavior-benchmark, doctor negatives, SHARED roll-up | tests-and-validators | 0.80 | 12 | complete |

- iterationsCompleted: 10
- keyFindings: 121
- openQuestions: 3
- resolvedQuestions: 2

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 2/5
- [x] Are the runtime mirrors (.claude .opencode .codex .cursor .pi .devin .hermes) symlinks, generated copies or hand-written files for the agent-improvement surfaces (agent, command, prompts, Hermes agent-* skill mirror)?
- [x] Which references are SHARED-WITH-MODEL-BENCHMARK, and which tests, validators and doctor checks cover the touched surfaces?
- [ ] Which files across the repository outside specs/ reference the agent-improvement mode (workflowMode agent-improvement, /deep:agent-improvement, deep-agent-improvement-*.yaml, presentation asset, deep-improvement agent, deep-improvement packet, advisor id deep-improvement)? [legacy-import]
- [ ] What indirect wiring carries the mode (registry projections, alias groups and folds, compiled contracts, drift guards, generated mirrors, fixtures)? [legacy-import]
- [ ] Does anything outside this repository or outside the two improvement modes consume the agent-improvement mode, its agent, or the deep-improvement packet scripts and runtime libraries? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 3
- [ ] Which files across the repository outside specs/ reference the agent-improvement mode (workflowMode agent-improvement, /deep:agent-improvement, deep-agent-improvement-*.yaml, presentation asset, deep-improvement agent, deep-improvement packet, advisor id deep-improvement)?
- [ ] What indirect wiring carries the mode (registry projections, alias groups and folds, compiled contracts, drift guards, generated mirrors, fixtures)?
- [ ] Does anything outside this repository or outside the two improvement modes consume the agent-improvement mode, its agent, or the deep-improvement packet scripts and runtime libraries?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▆▅▆███▇▅▅▇██▇▄▂▅█▄▁
- score sparkline: █▆▅▆███▇▅▅▇██▇▄▂▅█▄▁
- Last 3 ratios: 0.80 -> 0.90 -> 0.80
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.80
- coverageBySources: {"code":96,"other":125}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None; the hub surface yielded a complete reference set on the first pass. (iteration 1)
- Searching for a compiled `deep-agent-improvement` contract under `.skilled/commands/deep/assets/compiled/`: the directory README and file listing show compile coverage is limited to the three compiler-registered commands, so no compiled artifact exists to classify. (iteration 1)
- None; the packet surface resolved into lane-exclusive subtrees (`assets|references|scripts/agent-improvement/`) versus shared chassis (`SKILL.md`, `README.md`, `scripts/shared/`, `references/shared/`, allowlist, tests). (iteration 2)
- Searching for an agent-improvement branch inside the runtime-loop convergence layer (`runtime/scripts/convergence.cjs`): the mode registry records `runtimeLoopType: null` and `backendKind: improvement-host`, so the lane has no runtime-loop surface to inventory; the loop-host seam is the orchestration owner. (iteration 2)
- Expecting a committed `authority-agent-improvement.json`: the authority directory ships only its README; records are machine-local and git-ignored, and a never-written record simply defaults to `legacy_authoritative`. (iteration 3)
- None; the runtime split cleanly into lane-dedicated libraries (delete), lane-shared/common surfaces (edit), and mode-agnostic core (untouched). (iteration 3)
- None; the advisor surface resolved into the two projection maps, the fold, the generated bridge pair, the drift guard, and fixture/test updates. (iteration 4)
- Treating `command-bridges.generated.json` and `scoring-compatibility.json` as hand-editable sources: the derive script discovers them as generated outputs of `{skillId}/command-metadata.json`, so the correct deletion order is source edit then regeneration. (iteration 4)
- Classifying the mirror checker as packet-internal: it has repo-wide callers (commit hooks, CI workflow, CI drill, cross-skill checklist, CROSS-CLI.md), so its removal is a cross-repo edit, not a packet-local delete. (iteration 5)
- Search for additional hook mentions beyond the four files was exhaustive: `rg -l` over `.skilled/hooks/` returns only task-dispatch and git hits. (iteration 5)
- `.claude/hooks` carries no agent-improvement mentions (verified by the repo-tree rg over `.claude`). (iteration 6)
- Expecting mirrored copies under `.opencode/`: every deep-loop surface resolves through directory symlinks to `.skilled`, so `.opencode` needs no per-file edits for the mode. (iteration 6)
- Expecting `.cursor`, `.devin` or `.hermes` to hold independent agent bodies: each resolves through a symlink or a generator to a canonical file already inventoried. (iteration 7)
- None; the five trees resolved into three chains (symlink to `.claude`, hand copy in `.pi`, generated in `.hermes`). (iteration 7)
- `AGENTS.md` / `CLAUDE.md` at the repository root carry no canonical-token mentions (checked in the same grep). (iteration 8)
- Treating hub `changelog/` and frozen benchmark `reports/` as edit targets: they are historical records; only their README indexes receive edits. (iteration 8)
- `system-spec-kit/runtime/cli/dist` as a compiled home of the mode (verified empty of matches). (iteration 9)
- Searching for a published or externally installed copy of the mode: both manifests are private with no publish path, so there is no package-level external consumer to inventory. (iteration 9)
- Adding new tests or running repo tooling beyond the lineage: research-only run; the suites are inventoried, not executed, and every write stayed inside the lineage directory. (iteration 10)
- None; the test layer resolved into CI gates (workflows), suites (runtime/hooks/plugins/packet), fixtures (retrieval corpus, git-hook fixtures, behavior scenarios) and name-agnostic validators. (iteration 10)

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
Follow up on: **Convergence telemetry** — with iteration 10 recorded, the run reaches its configured cap; the remaining open questions (full reference list closure, indirect-wiring closure) are answered to the depth the cap allows...

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
