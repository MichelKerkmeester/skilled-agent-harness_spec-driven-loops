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
- Topic: Find bugs, drift and issues in all logic, skills and work changed since v4.1.0.0 (git range v4.1.0.0..HEAD)
- Started: 2026-11-26T11:28:30Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: 2026-11-26T11:28:30Z
- Parent Session: 2026-11-25T16:24:14Z
- Lifecycle Mode: restart
- Generation: 3
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: Does the changed system-deep-loop runtime (dispatch, fan-out, convergence, append gateway, lock, reducer) hold logic bugs, or disagree with its workflow YAML and reference docs? | - | 1.00 | 1 | complete |
| 2 | Q1 follow-up: fan-out stop/retry transitions, dispatch boundary, and append-gateway replay/projection behavior. | deep-loop | 1.00 | 1 | complete |
| 3 | Proceed to Q2, the system-skill-advisor audit. Also trace the legacy-import source for Q1 if its closure affects convergence or focus selection. | skill-advisor | 1.00 | 1 | complete |
| 4 | Proceed to Q3: inspect the changed mcp-browser-use, mcp-tooling, cli-external-orchestration and cli-orca modes for broken paths, registry or hub-router drift and executor-builder bugs. | - | 0.50 | 1 | complete |
| 5 | Q3 follow-up: inspect stage-one hub metadata and the executor-registry consumer, then confirm every declared hub-router resource path resolves. Keep Q4 and Q5 for later iterations. | mcp-hubs | 1.00 | 2 | complete |
| 6 | Q4: inspect the changed system-spec-kit runtime and hooks (decision-capture, session-handover, cli-dispatch, overlay-guard, git hooks) for logic bugs or doc drift against what v4.2.0.0 claims. | system-spec-kit-runtime-hooks | 1.00 | 1 | complete |
| 7 | Continue Q4 by auditing the remaining changed session-handover and system-spec-kit runtime paths, then review the git hook gate behavior beyond the uninstall instructions. | system-spec-kit-runtime-hooks | 1.00 | 1 | complete |
| 8 | Continue Q4 with the remaining session-handover runtime adapters and the changed commit-msg, pre-push, and supporting hook gates, then decide whether the full question is answerable. | system-spec-kit | 1.00 | 2 | complete |
| 9 | Audit Q5 across the doctor commands, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows, and the v4.2.0.0 changelog; prioritize claims that cross multiple mirrored entrypoints. | - | 0.00 | 0 | insight |
| 10 | Finish Q5 by auditing the changed sk-doc validator and rename paths, sk-code routing and quality surfaces, and remaining sk-git gates against the v4.2.0.0 changelog. | cross-surface | 1.00 | 1 | complete |

- iterationsCompleted: 10
- keyFindings: 11
- openQuestions: 2
- resolvedQuestions: 3

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 3/5
- [x] Q1: Does the changed system-deep-loop runtime (dispatch, fan-out, convergence, append gateway, lock, reducer) hold logic bugs, or disagree with its workflow YAML and reference docs?
- [x] Q2: Does the changed system-skill-advisor (scorer, hooks, brief policy, embedding-lane removal) hold routing bugs or drift between code, hook docs and AGENTS.md Gate 2?
- [x] Q3: Do the changed mcp-browser-use, mcp-tooling, cli-external-orchestration and cli-orca modes hold broken paths, registry or hub-router drift, or executor builder bugs?
- [ ] Q4: Do the changed system-spec-kit runtime and hooks (decision-capture, session-handover, cli-dispatch, overlay-guard, git hooks) hold logic bugs or doc drift against what v4.2.0.0 claims? [legacy-import]
- [ ] Q5: Do the doctor commands and skill, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows and the v4.2.0.0 changelog agree with the code they describe? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 2
- [ ] Q4: Do the changed system-spec-kit runtime and hooks (decision-capture, session-handover, cli-dispatch, overlay-guard, git hooks) hold logic bugs or doc drift against what v4.2.0.0 claims?
- [ ] Q5: Do the doctor commands and skill, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows and the v4.2.0.0 changelog agree with the code they describe?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █████▇▅▆▇██████▇▄▁▅█
- score sparkline: █████▇▅▆▇██████▇▄▁▅█
- Last 3 ratios: 1.00 -> 0.00 -> 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"code":147,"other":61}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- The current `keyQuestions` and `answeredQuestions` wording is consistent with the reducer's exact question matching; no defect confirmed in that contract. (iteration 1)
- No duplicate append or stale-head retry defect was confirmed in the inspected append-gateway path. (iteration 2)
- No independent retry-budget defect was confirmed in the inspected path: orphan requeues consume retry credit, and stopped lineages are terminal. (iteration 2)
- No new dispatch-wrapper defect was confirmed in the inspected CLI path. (iteration 2)
- No conflict was found between the reviewed hook mechanics and AGENTS.md Gate 2 policy. Gate 2 gives the surfaced hook brief priority and names the direct advisor call as the fallback; the hook reference describes how the brief is produced and delivered. [SOURCE: AGENTS.md:63] [SOURCE: AGENTS.md:68] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:55] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:59] (iteration 3)
- The removed semantic lane did not leave a mismatch in the live lane registry, active README or architecture description. (iteration 3)
- The semantic embedding-lane removal does not show active scorer or documentation drift in the inspected surface. The live registry lists four active lanes, and the README and architecture describe the same four. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8] [SOURCE: .skilled/skills/system-skill-advisor/README.md:38] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:110] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:126] (iteration 3)
- The user-supplied Gate 2 policy is not contradicted by the hook behavior description reviewed here. (iteration 3)
- No version or mode-key mismatch was found between the current registry and hub-router manifests for `mcp-browser-use`, `mcp-tooling` and `cli-external-orchestration`. The moved Chrome DevTools and Aside modes are listed under `mcp-browser-use`, and absent from `mcp-tooling`'s current registry/router. [SOURCE: .skilled/skills/mcp-browser-use/mode-registry.json:3] [SOURCE: .skilled/skills/mcp-browser-use/hub-router.json:3] [SOURCE: .skilled/skills/mcp-tooling/mode-registry.json:3] [SOURCE: .skilled/skills/mcp-tooling/hub-router.json:3] (iteration 4)
- The current CLI registry/router manifests list eight CLI modes and do not retain `cli-orca`. The changed OpenCode setup helper is an installer/checker, not a dispatch-command builder. Static review found no executor-builder defect; runtime reachability remains unchecked. [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:3] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:19] [SOURCE: .skilled/skills/cli-external-orchestration/mode-registry.json:241] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:3] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:34] [SOURCE: .skilled/skills/cli-external-orchestration/hub-router.json:104] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:8] [SOURCE: .skilled/skills/cli-external-orchestration/cli-opencode/scripts/opencode-setup.sh:28] (iteration 4)
- The reviewed changed CLI helper did not contain executor construction logic, so it yielded no executor-builder defect. (iteration 4)
- The static manifests did not reveal a registry/router key or version drift. (iteration 4)
- No field-shape mismatch was found between the current CLI mode registry and the executor consumer. (iteration 5)
- No missing or broken resource path was found among the 23 declarations checked. (iteration 5)
- None. (iteration 5)
- The iteration 4 registry/version comparison was not repeated because strategy marks it exhausted. (iteration 5)
- The overlay guard's suggested `status` command is accepted by the overlay engine CLI; no command-shape drift was confirmed. [SOURCE: .skilled/hooks/overlay-guard/lib/overlay-guard.cjs:59-63] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:23-26] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9267-9316] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:9344-9348] (iteration 6)
- The reviewed CLI dispatch path applies every rule to an unresolved OpenCode version, matching the release description; no version-gate drift was confirmed. [SOURCE: .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.mjs:1119-1145] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:516-522] (iteration 6)
- The reviewed OpenCode decision-capture sweep reads `session_v2` and `session_message`, consistent with the release's OpenCode 2-only support claim; no version-layout mismatch was confirmed. [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:40-43] [SOURCE: .skilled/hooks/decision-capture/bin/sweep-opencode.mjs:128-145] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:509-522] (iteration 6)
- No additional defect was confirmed in the sampled handover prepare/arm/relaunch/claim transitions. This is limited to those paths, not a full review of every runtime adapter. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1594] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1648] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1909] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1998] (iteration 7)
- No additional defect was confirmed in the sampled pre-commit trust and comment-hygiene gate paths. This is not a conclusion about every Git hook or gate. [SOURCE: .skilled/scripts/git-hooks/pre-commit:36] [SOURCE: .skilled/scripts/git-hooks/pre-commit:63] [SOURCE: .skilled/scripts/git-hooks/pre-commit:199] [SOURCE: .skilled/scripts/git-hooks/pre-commit:209] (iteration 7)
- The two-level working-tree sub-track reader and validator use matching depth bounds in the inspected functions. No mismatch was confirmed in those excerpts. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:122] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/track-roots.mjs:161] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:241] [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:248] (iteration 7)
- No separate issue was confirmed in the sampled OpenCode plugin entrypoint or shared session reader. This is a bounded sample, not a clean bill of health for every session-handover adapter. (iteration 8)
- The previously reviewed handover transition sequence was marked exhausted in the prior iteration and was not repeated. (iteration 8)
- The sampled adapter entrypoint/storage path exposed no new discrepancy requiring another pass in this iteration. (iteration 8)
- A suspected gap caused by treating `agent-mirror-sync.yml` as the only CI mirror gate was not confirmed; the other reviewed workflows run the generated/runtime mirror checks. (iteration 9)
- None. The sk-doc implementation, sk-code routing and quality surfaces, and the remaining sk-git paths still offer productive follow-up work. (iteration 9)
- The six-command move described in the release changelog does not conflict with the current skill's claim to own every doctor command. (iteration 9)
- A first read-only helper assumed the relocation ledger had an applied array and exited 1. The table was re-read using its actual schema; no artifact was changed. (iteration 10)
- No additional defect was confirmed in the sampled validator, rename, quality-router or sk-git paths. (iteration 10)
- The changed sk-doc validator’s required result marker is present in all 57 discovered playbook roots; no uncovered package was found in this scan. (iteration 10)
- The sampled citation-rename redirect chain reaches a tracked path; no stale target was confirmed in that chain. [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs:349-361] [SOURCE: .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json:5] (iteration 10)
- The sampled sk-git gate refusal and provisioning behavior matched the inspected contracts. [SOURCE: .skilled/skills/sk-git/feature-catalog/workflow-playbooks/message-contract-enforcement.md:31-46] [SOURCE: .skilled/skills/sk-git/scripts/worktree-naming.sh:796-815] [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:829-833] (iteration 10)
- The sk-code compiled-route CLI supports the documented stdin option; the shell wrapper is where the delimiter issue sits. [SOURCE: .skilled/bin/compiled-route.cjs:34-59] (iteration 10)

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
If the packet is extended, trace the remaining changed doctor commands and runtime-mirror/CI gates end to end, and verify a delimiter-safe transport for compiled routing.

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
