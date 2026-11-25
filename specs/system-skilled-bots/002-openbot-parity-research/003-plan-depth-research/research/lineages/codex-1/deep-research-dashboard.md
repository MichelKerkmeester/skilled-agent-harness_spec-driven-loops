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
- Topic: Planning-depth review of packet specs/system-skilled-bots/003-openbot-parity-build, the OpenBot parity build for skilled bots: fourteen phases (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels, 012-manual-testing-scenarios, 013-skilled-and-doc-alignment, 014-deep-review). The operator wants to build all of it in one shot to perfection, so every phase must be planned and architected deeply enough that a builder needs no design decision while building.

Phase 003-terminal-screen was just expanded into a Level 3 phase parent with six children (UX and component map with a design/ folder of mockups, key map, glyph table and component inventory; architecture and contracts; shell and navigation; panes; answer flow; hardening). Use it as the benchmark for depth. Do not review 003's children themselves.

For every other phase answer: is it planned deeply enough to one-shot? What is missing: module and file design, data contracts and record schemas with every field, state machines and lifecycles, error and refusal catalogue, concurrency and restart behavior, migration and rollback, test strategy with fixtures, the interfaces it offers to and takes from other phases, security boundaries, operator prerequisites, and design artifacts (diagrams, schema files, sequence flows, mockups for anything user-facing such as chat and channel messages)? Should it become a phase parent with children like 003, and which children? What reference code in specs/system-skilled-bots/context/ (OpenBot-main, OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main, tinychannels-main) should it study first?

Evidence (read-only): the phase docs; the built runtime under .skilled/skills/system-skilled-bots/runtime/lib/ and .skilled/bin/bots.cjs; the earlier research in specs/system-skilled-bots/002-openbot-parity-research/.

Every finding names the phase, the gap, the evidence as [SOURCE: path:line], a severity (P0 the build cannot be one-shot without it, P1 a builder would have to decide, P2 polish) and the exact planning artifact or child phase that closes it. End with a ranked per-phase expansion plan.

- Started: 2026-11-25T21:46:25.000Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: fanout-codex-1-1795642794796-3326pw
- Parent Session: fanout-codex-1-1795642794796-3326pw
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Frontier node F-1-001 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor, specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer, specs/system-skilled-bots/003-openbot-parity-build/005-memory, specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/010-conversations, .skilled/skills/system-skilled-bots/runtime/lib): Data and contracts: for phases 001, 002, 005, 006 and 010, are every record schema, field, state machine and bots --json payload specified completely enough to build without a decision? What schema files or contract docs are missing? | contracts | 0.50 | 4 | complete |
| 2 | Frontier node F-1-003 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels, specs/system-skilled-bots/context/tinychannels-main, specs/system-skilled-bots/context/rakazo-main): Phase 011-messaging-channels: is the adapter architecture, per-channel transport, identity linking, durable queue, approval rendering and conformance test design deep enough to one-shot, and how should it split into children (shared adapter, Telegram, Slack, Signal, WhatsApp)? | messaging-channels | 0.33 | 6 | complete |
| 3 | Frontier node F-1-005 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/spec.md, specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer, specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure, .skilled/skills/system-skilled-bots/runtime/lib): Small phases 004-computer-exposure and 002-routine-layer, and cross-cutting design: is there a shared architecture doc (module map, file ownership, prompt builder order, answer seam, state-root layout) that every phase builds against, or must one be added before building? | - | 0.50 | 2 | complete |
| 4 | Phase breadth pass: phases 007-per-bot-apps, 008-vault, and 009-skills — assess one-shot depth of schemas, secret boundaries, restart and rollback behavior, cross-phase interfaces, test fixtures, operator steps, and user-facing design; rank gaps and identify the first reference code to study. | - | 0.83 | 3 | complete |
| 5 | Closing-phase proof pass: phases 012-manual-testing-scenarios, 013-skilled-and-doc-alignment, and 014-deep-review — verify evidence inputs, close conditions, fix/retest loops, and handoffs; identify the exact shared artifact and rank the per-phase expansion plan. | - | 0.50 | 3 | complete |

- iterationsCompleted: 5
- keyFindings: 18
- openQuestions: 0
- resolvedQuestions: 3

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 3/3
- [x] Data and contracts: for phases 001, 002, 005, 006 and 010, are every record schema, field, state machine and bots --json payload specified completely enough to build without a decision? What schema files or contract docs are missing?
- [x] Phase 011-messaging-channels: is the adapter architecture, per-channel transport, identity linking, durable queue, approval rendering and conformance test design deep enough to one-shot, and how should it split into children (shared adapter, Telegram, Slack, Signal, WhatsApp)?
- [x] Small phases 004-computer-exposure and 002-routine-layer, and cross-cutting design: is there a shared architecture doc (module map, file ownership, prompt builder order, answer seam, state-root layout) that every phase builds against, or must one be added before building?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▃▃▂▂▁▁▂▂▃▃▄▅▆▇█▇▆▅▄▃
- score sparkline: ▃▃▂▂▁▁▂▂▃▃▄▅▆▇█▇▆▅▄▃
- Last 3 ratios: 0.50 -> 0.83 -> 0.50
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.50
- coverageBySources: {"code":70,"other":11}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Phase 010's `--transcript --json` payload is not an open design decision in this focus: the packet says it returns a JSON array, enumerates the message fields, and defines append/duplicate/torn-line behavior. Keep an executable fixture, but no additional payload-schema child is required for this gap. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:153-157,167] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/plan.md:100,196] (iteration 1)
- The first runtime search used presumed module paths that are not present; narrowing to the current `needs-you.ts` and `request-record.ts` validators produced direct evidence for the closed-key compatibility risk. (iteration 1)
- Treating the chat JSON array shape itself as missing was disproved by phase 010 REQ-006 and its CLI fixture; the remaining shared-contract gap concerns cross-phase record evolution. (iteration 1)
- Do not copy tinychannels' in-memory approval reply index: phase 011 requires the approval index to survive restart. Use tinychannels first for the adapter/capability model and queue policy, and rakazo for sender linking and bounded polling startup. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:58-70] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:120,188] (iteration 2)
- No live external provider was needed to answer the planning-depth question: phase 011 deliberately tests transports with a fake and does not open sockets. The remaining gap is the operator runbook and acknowledgement contract, not a need to make credentials a unit-test prerequisite. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:135-140] (iteration 2)
- The phase already covers the main refusal, security, and outbound-reliability rules: default-deny linking, approver checks, secret redaction, signature validation, restart-safe approval prompts, unknown-after-send, and bounded retries. Keep these as shared child invariants rather than reopening their policy decisions. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:185-195,201-210,239-248,264-271] (iteration 2)
- A blanket claim that phases have no shared contracts is not supported: the build spec has a shared-record ownership table. The gap is a consolidated target architecture and sequence map across those contracts. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:122-139] (iteration 3)
- Phase 004-computer-exposure does not need a new child on current evidence: its scope is one prompt line over existing record fields with no new state, CLI, or schema, and its plan names implementation modules, tests, dependencies, and rollback. The phase already specifies matching workDir/cwd, branch/null handling, exact prompt text, status row, and JSON output. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:42-55,98-113,143-149] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/plan.md:58-70,170-180,203-207] (iteration 3)
- The current runtime README documents existing package topology, not the planned parity target architecture; do not treat it as a substitute for the target module and state-root maps. [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/README.md:21-39,43-75] (iteration 3)
- Do not promote these phases to parents on their `/70` complexity totals alone. The decomposition gate requires the separate phase-score threshold and Level 3 documentation threshold; all three reviewed specs currently identify as Level 2. [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:59-66] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:232] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:237] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:255] (iteration 4)
- No named frontier node remained after iteration 3, so the expansive frontier block returned empty. The user-requested phase breadth focus was used; no frontier proposals were emitted. (iteration 4)
- The prior security and skill reviews already identified 008's grammar/mapping/index/migration/lock gaps and 009's grammar/default/sentinel/schema gaps; this pass rechecked those against the current requirements and did not count them as separate new findings. [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-006.md:15-27] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-007.md:15-23] (iteration 4)
- No child decomposition is needed for phases 012–014 from this pass. Each is a single operational workflow: scenario corpus and recorder; two alignment runs and a fix pass; or one review/fix/retest loop. Their gaps are handoff and closure rules. (iteration 5)
- No repository from the nine context references is the first source for these closing phases. Use the in-repository playbook contract/recorder for 012, the local-alignment commands and report schemas for 013, and the deep-review command/fan-out runner for 014. (iteration 5)
- The completeness of the 58-scenario inventory does not prove its verdicts are clean: its recorded-result acceptance row expressly permits FAIL rows when defects are named. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/acceptance-criteria.md:60-62] (iteration 5)

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
<!-- ANCHOR:frontier -->
## 6B. FRONTIER
- Frontier size: 3 nodes (0 open, 0 active, 3 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 3 of 2.5 iterations spent
- Budget depth2: 0 of 1.75 iterations spent
- Budget depth3: 0 of 2.5 iterations spent

<!-- /ANCHOR:frontier -->
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
