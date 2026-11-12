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
- Topic: How should the skill advisor surface slash commands (all 45 under .skilled/commands, not only /doctor) so a model either runs the matching command workflow by itself or asks the user first, and how does a request typed as plain chat with no slash command still reach the proper command workflow on every runtime? Work through ten research angles: inventory, scoring, output contract, run or ask, invocation mechanics, chat-only users, skill and command linkage, measurement, prior art, and failure modes.
- Started: 2026-11-12T09:34:02Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: fanout-codex-luna-1794475749931-e4ukfw
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Angle 1: Inventory, reconcile the 45 command files with bridge sources and runtime-enabled bridge identities. | inventory | 0.42 | 6 | complete |
| 2 | Angle 2: Scoring. Examine how command and skill intent combine, how plain-chat and typed-command evidence affect rank, and how eligibility and run-or-ask gates interact. | scoring | 0.70 | 5 | complete |
| 3 | Angle 3: Output contract. Inspect the current advisor brief and command-rendering surfaces, then specify what a model needs to load or ask across all commands. | output-contract | 0.80 | 5 | complete |
| 4 | Angle 4: Run or ask. Separate workflow selection from required command inputs, execution modes, spec routing choices and high-impact approvals. | run-or-ask | 0.90 | 5 | complete |
| 5 | Angle 5: Invocation mechanics. Trace how plain prompts reach the advisor and how the resulting command or skill workflow can be loaded across supported runtimes. | invocation-mechanics | 0.90 | 5 | complete |
| 6 | Angle 6: Plain-chat-only users. Determine how ordinary language reaches command routes and where the current fallback or runtime coverage leaves gaps. | chat-only-routing | 0.90 | 5 | complete |
| 7 | Angle 7: Skill and command linkage. Compare source-level user intent/choreography with bridge identity, owner mode and model-visible routing. | skill-command-linkage | 0.90 | 5 | complete |
| 8 | Angle 8: Measurement. Assess available route corpora, scoring metrics, ambiguous cases, command coverage and runtime evidence. | measurement | 0.90 | 5 | complete |
| 9 | Angle 9: Prior art. Compare explicit slash command catalogs, metadata-driven plain-language skill activation, evaluation practice and host-specific invocation constraints. | prior-art | 0.90 | 5 | complete |
| 10 | Angle 10: Failure modes. Inspect over/under-triggering, command-skill ambiguity, child recursion, loop stops and prompt-budget loss. | failure-modes | 0.80 | 5 | complete |

- iterationsCompleted: 10
- keyFindings: 51
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Which one canonical inventory reconciles command metadata, active bridge allow-list rows and doctor routing declarations for all 45 slash commands? [legacy-import]
- [ ] How should command intent and skill intent combine so plain planning and research prompts reach the matching workflow with acceptable recall and precision? [legacy-import]
- [ ] What should a command recommendation show, and which commands can the model invoke directly versus asking first? [legacy-import]
- [ ] How does a plain chat request reach the appropriate command workflow across supported runtimes, and how should skills link to command front doors? [legacy-import]
- [ ] What benchmark evidence, prior art and failure controls should validate the design? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] Which one canonical inventory reconciles command metadata, active bridge allow-list rows and doctor routing declarations for all 45 slash commands?
- [ ] How should command intent and skill intent combine so plain planning and research prompts reach the matching workflow with acceptable recall and precision?
- [ ] What should a command recommendation show, and which commands can the model invoke directly versus asking first?
- [ ] How does a plain chat request reach the appropriate command workflow across supported runtimes, and how should skills link to command front doors?
- [ ] What benchmark evidence, prior art and failure controls should validate the design?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▁▃▅▆▆▇████████████▇▇
- score sparkline: ▁▃▅▆▆▇████████████▇▇
- Last 3 ratios: 0.90 -> 0.90 -> 0.80
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.80
- coverageBySources: {"code":93,"developers.openai.com":2,"docs.github.com":1,"other":21}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Counting only the top-level doctor route command fields misses the /doctor:mcp subroutes that the deriver adds. (iteration 1)
- Recursive markdown counting as a command denominator, because it includes nested test fixtures. (iteration 1)
- The first filtered rg listing returned 44 grouped markdown files and missed the root-level command file; direct directory enumeration and the file itself resolved the count. (iteration 1)
- Treating 62 bridge rows as 62 commands, because the projection includes aliases and route-target multiplicity. (iteration 1)
- Treating a legacy alias as proof that a shipped command has a bridge under its own identifier. (iteration 1)
- None established. Plain-chat ranking quality and cross-runtime recall remain unmeasured. (iteration 2)
- Treating command-file presence as proof of an eligible route; projection has explicit disabled states, and compatibility rows can diverge by runtime identity. (iteration 2)
- Using the command ranking adjustment as an authorization rule; it appears only in result ordering. (iteration 2)
- Adding a static table of all commands to every fallback; the prior packet rejected universal route guidance in the fallback. (iteration 3)
- None established. Current output coverage beyond doctor routes remains to be traced through invocation mechanics and measured against real prompt contexts. (iteration 3)
- Using bridge ids as visible labels for every command; the current renderer maps runnable strings only for doctor bridges. (iteration 3)
- Inferring required route targets from prior conversation or workspace state where the route contract forbids inference. (iteration 4)
- Letting a confidence score choose :auto or :autopilot; command workflows assign these execution modes separately. (iteration 4)
- None established. The representative routes show that confirmation is workflow-specific; the remaining question is how each runtime loads the workflow after the advisor selects it. (iteration 4)
- Assuming every runtime has an API to invoke slash commands from model context; DSH has no command loader and dispatches prompt stubs as task text. (iteration 5)
- None established. The supported hook path injects route advice; direct command execution still depends on each host's native loader or explicit workflow-file loading. (iteration 5)
- Treating a runtime enum value or stale validation example as proof that an adapter is currently registered. (iteration 5)
- Assuming TypeScript and Python doctor matching are equivalent for chat-only requests; the bridge documentation says Python's doctor match requires a typed slash command. (iteration 6)
- None established. Exact-name gaps and runtime-specific matching remain open; an all-command phrase coverage map is still needed. (iteration 6)
- Requiring a leading slash before command intent can be scored; bridge metadata can carry natural-language keywords and intentSignals. (iteration 6)
- Linking a command only to a parent skill without retaining its ownerMode and leaf workflow. (iteration 7)
- None established. The current metadata gives a strong linkage pattern, but its source families and runtime identifiers remain split. (iteration 7)
- Treating the generated bridge projection as the full execution recipe; source metadata holds the task-specific choreography and argument contract. (iteration 7)
- Copying doctor-specific thresholds unchanged across all command families. (iteration 8)
- None established. Existing corpora and scoring scripts are useful, but their label schema does not yet answer command-route and action questions. (iteration 8)
- Treating skill top-1 accuracy as command identity or action correctness. (iteration 8)
- Adding a static table of all commands to every fallback; the reducer marks this direction BLOCKED because prior work rejected universal route guidance in the fallback. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:123-127] (iteration 9)
- Assuming every runtime can invoke slash commands from model context; the reducer marks this direction BLOCKED because DSH uses prompt stubs and has no command loader. [SOURCE: specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:129-132] (iteration 9)
- None newly established. The comparison supports a dual entry point, but it does not establish that every host can call a native slash command. (iteration 9)
- Treating a skill match as approval to execute a command; local policy separates confidence routing from artifact, write and stop-for-yes gates. [SOURCE: AGENTS.md:63-89] (iteration 9)
- Allowing a one-iteration child to restart the parent loop or recursively call its own executor. (iteration 10)
- None newly established. Existing code has ambiguity, leaf and max-iteration controls, but command-specific action authority and full brief-budget behavior still need explicit coverage. (iteration 10)
- Relying on the token cap to preserve every field when the command is a truncatable companion. (iteration 10)
- Treating command confidence as authorization to execute. (iteration 10)
- Using the positive-only prompt-fire replay as the only false-trigger regression test. (iteration 10)

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
Q1: Which source should own command identity, alias status and route targets when the files, metadata, allow-list and route manifest disagree?

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
