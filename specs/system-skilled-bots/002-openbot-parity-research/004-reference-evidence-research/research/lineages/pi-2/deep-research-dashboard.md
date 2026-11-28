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
- Topic: Reference evidence for the OpenBot parity build of skilled bots.

Inputs, all read-only. Do not edit any of them.
- The ten reference repos under specs/system-skilled-bots/context/: OpenBot-main (the primary reference), OpenMausBot-main, rakazo-main, openhuman-main, openhuman-full, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main and tinychannels-main.
- The build plan: the fourteen phase folders and the contracts/ folder of specs/system-skilled-bots/003-openbot-parity-build (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels, 013-manual-testing-scenarios, 014-skilled-and-doc-alignment, 015-deep-review).
- The three earlier syntheses: specs/system-skilled-bots/002-openbot-parity-research/001-openbot-parity-research/research/research.md, .../002-plan-review-research/research/research.md and .../003-plan-depth-research/research/research.md.
- The built runtime: .skilled/skills/system-skilled-bots/runtime/lib/, .skilled/bin/bots.cjs and .skilled/skills/system-skilled-bots/scripts/bot-check.cjs.

Answer two things.

1. Evidence per planned phase. For each of the fourteen phases: which reference files and lines implement the same thing; what a builder should lift or mirror, with the licence of the source; where the plan differs from how the references do it, and which side the evidence supports; and which failures, tests and fixes in those repos the plan does not yet guard against.

2. Net-new. What do the ten repos have that neither the build plan nor the skip list in section 13 of the parity synthesis covers? Rank each by its value to a small team and give its size. Read openhuman-full first: no earlier run studied it, and it carries five vendored crates (tinyagents, tinyconnectors, tinymemory, tinyhumans-sdk, tinysecurity) and a built openhuman-tui crate that openhuman-main lacks.

Rules.
- Do not repeat a finding one of the three earlier syntheses already carries. Cite the earlier finding and add only what is new.
- Cite every claim as [SOURCE: path:line]. A claim with no resolving citation is not a finding.
- Mark each claim observed (you read the line) or inferred (you reason from it).
- Name the 003 phase every finding belongs to. A finding that fits no phase goes under net-new.
- Write only inside your own lineage folder.

- Started: 2026-11-27T07:21:04.081Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-pi-2-1795763950430-ek4gqy
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Frontier node F-1-004 at depth 1 of 3, scope specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels, specs/system-skilled-bots/context/tinychannels-main, specs/system-skilled-bots/context/OpenMausBot-main, specs/system-skilled-bots/context/openhuman-full/vendor/tinyconnectors: Phase 011-messaging-channels evidence pass | phase-011-messaging-channels | 0.92 | 6 | complete |
| 2 | Frontier node F-2-005 at depth 2: dedupe window retention plus the sibling depth-2 send-proof, redelivery and button-limit questions | phase-011-messaging-channels | 0.88 | 4 | complete |
| 3 | Phases 001-activity-and-actor and 002-routine-layer: reference evidence, licences of every lift, plan-versus-reference differences and unguarded failures | phase-001-002 | 0.80 | 5 | complete |
| 4 | Phases 003-terminal-screen and 004-computer-exposure: reference renderer properties, secret masking in the render path, and the working-place prompt line | phase-003-004 | 0.90 | 5 | complete |
| 5 | Phases 005-memory and 006-approval-grants: OpenGhost memory bounds and compaction, OpenBot approval ladder, kind recognition and the credential hand-off | phase-005-006 | 0.95 | 5 | complete |
| 6 | Phases 007-per-bot-apps and 008-vault: per-bot connector grants, the insufficient-scope failure path, and the vault access axis | phase-007-008 | 0.88 | 4 | complete |
| 7 | Phases 009-skills and 010-conversations: skill name grammar and caps, the mention path, and the unowned hook rules engine | phase-009-010 | 0.88 | 4 | complete |
| 8 | Phases 013-manual-testing-scenarios, 014-skilled-and-doc-alignment and 015-deep-review: proof surface and reference basis of the three proof phases | phase-012-013-014 | 0.67 | 3 | complete |
| 9 | Net-new from openhuman-full: twenty-one vendored crates sized and ranked against the build plan and the parity skip list | net-new-openhuman-full | 1.00 | 6 | complete |
| 10 | Net-new across the remaining eight repositories against the parity skip list, ranked by value to a small team with sizes and licences | net-new-cross-repo | 0.92 | 7 | complete |

- iterationsCompleted: 10
- keyFindings: 49
- openQuestions: 4
- resolvedQuestions: 1

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 1/5
- [x] Phase 011-messaging-channels: which reference files implement a channel adapter seam, Telegram, Slack, Signal and WhatsApp transports, identity linking, a durable queue and approvals rendered as buttons or replies, what should the builder lift or mirror, and which delivery, retry or duplicate-message failures did those repos hit?
- [ ] What dedupe window does a transport need when the provider offset resets on restart, and what does the reference's bounded recent-update cache size imply for a durable seen record? [frontier]
- [ ] Which transports can prove a send never left (NotSent reconciliation) from their own error shape, and which must treat every ambiguous result as unknown? [frontier]
- [ ] Does a Slack envelope redelivered after reconnect double-answer when the press was already applied, and what acknowledgement order keeps the reply index idempotent? [frontier]
- [ ] Which button or block label vocabulary does the reference already carry, and does any of it pass a secret-literal check without new text? [frontier]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 4
- [ ] What dedupe window does a transport need when the provider offset resets on restart, and what does the reference's bounded recent-update cache size imply for a durable seen record?
- [ ] Which transports can prove a send never left (NotSent reconciliation) from their own error shape, and which must treat every ambiguous result as unknown?
- [ ] Does a Slack envelope redelivered after reconnect double-answer when the press was already applied, and what acknowledgement order keeps the reply index idempotent?
- [ ] Which button or block label vocabulary does the reference already carry, and does any of it pass a secret-literal check without new text?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▆▆▅▅▄▅▆▆▇▇▆▅▅▅▃▂▅█▇▆
- score sparkline: ▆▆▅▅▄▅▆▆▇▇▆▅▅▅▃▂▅█▇▆
- Last 3 ratios: 0.67 -> 1.00 -> 0.92
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.92
- coverageBySources: {"code":1,"other":88}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Mining OpenMausBot for channel transports.** Grepped the tree for `telegram`/`slack` path components and found none; the only Slack code is the hosted management URL of finding 6. Not retried. (iteration 1)
- **Re-deriving the wire facts (endpoints, limits, backoff constants).** The plan's children 005 and 006 already cite those lines, and re-deriving them would repeat the earlier syntheses. This iteration read only the control flow around them. (iteration 1)
- `openhuman-full/vendor/tinyconnectors` was in the node scope but not opened: the iteration budget went to tinychannels, which is the only repo holding all four transports. Carried to the net-new iteration rather than promoted to Exhausted Approaches. (iteration 1)
- tinychannels `whatsapp_web/` (a linked-device client) exists and is explicitly out of scope for phase 011; not opened. (iteration 1)
- **Re-deriving the plan's inbound acknowledge sequence.** The 002 design already fixes the seven steps, the per-transport dedupe key, and the `after-seen-record` policy for four transports, citing the reference adapter policy. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:62-93] Not a gap. (iteration 2)
- **Searching for a reference-side durable seen store.** There is none: `TelegramUpdateWindow` is in-memory with an eviction path, and the WhatsApp and Signal paths carry no seen store at all. (iteration 2)
- **Treating Slack's "do not acknowledge an envelope we could not retain" as new.** The plan already cites that exact line and relies on the reconnect redelivery. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:73] No finding added. (iteration 2)
- No reference attempts to size a seen store from provider retention, so finding 1's recommendation is inference from the reference's bound plus the plan's own provider facts, not a lifted constant. (iteration 2)
- The reference's `whatsapp_web/identity.rs` exists but is the linked-device client the phase puts out of scope; not opened beyond confirming its name. (iteration 2)
- **Re-deriving the fatigue rule's ten-failure count.** Plan 002 states it with the run-record citations and the `enabledAt` reset; nothing new to add. (iteration 3)
- **The 20-enabled cap as a gap.** It is an explicit exclusion with a citation and a reason. Re-adding it would contradict a frozen scope decision. (iteration 3)
- **The first-failure notice as a gap.** Explicitly deferred with a reversal condition. (iteration 3)
- Grepping the runtime for DST support found nothing to cite beyond the absence; the finding rests on that absence on three sides plus the plan's own local-time sentence. (iteration 3)
- OpenBot's activity `queries.ts` and `mutations.ts` were not opened: the plan lifts only `activity-groups.ts` and `shared/activity-rows.ts`, and reading the screen-side mutations would not change the grouping rule. (iteration 3)
- **Re-deriving the 24-column and 8-row floor.** The plan already lifts it from `openhuman-tui/src/render.rs:26` and draws the 30x7 frame from it. (iteration 4)
- **Reading OpenBot for a worktree or per-run directory model.** It is a server whose conversations share one deployment; there is no per-run tree to mirror, which is why 004 has no reference implementation. (iteration 4)
- **Treating the missing mouse hit-target rule as a gap.** The plan has no mouse support, so the reference's rule does not apply. (iteration 4)
- A repository-wide grep of `openhuman-tui` for a panic-free resize property beyond the one test name found no second guard; the test name is the evidence. (iteration 4)
- OpenBot's `agent-langgraph-ts` prompt modules were not opened in depth: the two prompt-line searches returned nothing, and reading the whole prompt builder would not have changed the negative. (iteration 4)
- **Copying OpenGhost's LLM tidy as the memory bound's answer.** It rewrites operator-confirmed facts with no record of the rewrite, which contradicts 005's own premise that an entry records who said it. (iteration 5)
- **Re-deriving the rung order.** The plan takes the reference's four rungs and adds a `bot` fallback; the reference has no fallback value, so the addition is the plan's and is already documented. (iteration 5)
- **Treating 006's unimplemented rungs 2 to 4 as a gap.** The plan names them as not implemented in this phase, with the reason (no store supplies them). (iteration 5)
- hermes-muse's staged-write note was not opened beyond its path: the prior synthesis already carries it as a lift for proposal review, and 005's proposal path cites it. (iteration 5)
- OpenBot's `shared/tool-name.ts` was not re-read: the prior synthesis names it as the lifted classifier and the plan's `classifyAction` cites it. (iteration 5)
- **Finding a per-run MCP config equivalent in a reference.** None of the ten repos narrows a connector list per run; they narrow per user or per item. 007 is net-new on the mechanism and borrows only the failure path of finding 1. (iteration 6)
- **Reading OpenMausBot's `connector/` host directory for a second implementation.** It is a connector marketplace host, not a per-bot filter. (iteration 6)
- **Treating the plan's missing echo guard as a gap.** It is measured and guarded three ways: the length refusal, the never-print rule and the post-run scan. (iteration 6)
- rakazo's `secret-matcher.ts` was located but not read: 008's known-secret map is built from stored values rather than from pattern matching, so the matcher's pattern list would not have changed any finding. (iteration 6)
- The `connector-scope-hint` mechanism is reachable only where a connector's OAuth scopes are known per tool slug; the plan would need a per-connector scope table to use it, which is worth naming in 007's design as the cost of finding 1. (iteration 6)
- **Reading `rules.js` in full.** The event table, the matcher grammar and the rule grammar are enough to size and characterise the missing capability; the evaluation loop would not change the finding. (iteration 7)
- **Reading OpenBot's `shared/activity-rows.ts` for 009.** It belongs to 001's activity lift and carries nothing about skills. (iteration 7)
- **Treating the missing mention path as a defect.** It is a deliberate design difference with a stated auditing benefit; recorded as such. (iteration 7)
- 010's transcript envelope and message-record rules are entirely packet-internal (`contracts/records.md` section 10, `contracts/cli-json.md` section 3.1), so there is no reference to compare them with; the only reference-side transcript facts are the shared-transcript attribution and the handoff rule. (iteration 7)
- A grep for `hook` across all fourteen phase specs and their children produced only git-hook matches, which is the negative evidence for finding 2. (iteration 7)
- **Comparing the plan's eight capability keys with the reference's `ConformanceFeature` enum.** The plan flattens a nested record to eight booleans and says why, and it is GPL-3.0 code either way; the count difference is not a gap. (iteration 8)
- **Looking for a manual test script in the references.** None carries one; the closest artefact is the conformance kit, which is a library rather than a playbook. (iteration 8)
- **Re-deriving the five conformance rules from the reference.** The plan already numbers the reference's five assertions and cites the line ranges of the reference's kit for each. (iteration 8)
- 012's scenario table is 30-plus rows that cite their own phases; verifying each would have repeated phase evidence this run already carries in iterations 1 to 7. (iteration 8)
- Searching OpenBot-main for a docs check produced one negative. A second search for a review or audit loop was not worth a call: the earlier iterations found its audit rows described as product behaviour, not as a review process. (iteration 8)
- **Ranking only the five crates the topic names.** The measurement in finding 1 makes that set the smallest end of the tree; the ranking above covers all twenty-one. (iteration 9)
- **Reading `tinyartifacts`.** The directory is `tiny-artifacts` and the crate is 6,720 lines; its value is below the resolution of this ranking. (iteration 9)
- **Reading `tinycomputer` and `tinyvoice`.** Both are excluded surfaces in the parity synthesis, and their sizes settle the ranking without reading them. (iteration 9)
- `tinyagents`'s internal `vendor/tinytools` is patched into the workspace through three `[patch]` entries; [SOURCE: specs/system-skilled-bots/context/openhuman-full/Cargo.toml:50-64] the redirection is a build detail with no product value. (iteration 9)
- No crate in the tree is permissively licensed; the licence check is one file for all twenty-one. (iteration 9)
- **`buzz`'s admin surface, `rakazo`'s auth and DB, `OpenMausBot`'s relay and devices.** Every one is named in the parity synthesis's skip list, and their sizes are platform-sized. (iteration 10)
- **Re-reading `hermes-muse`'s skills folder.** It is a companion's prompt skills, which the plan already handles as skill bodies. (iteration 10)
- **Treating `OpenMausBot`'s `announcements` folder as a new capability.** It is a notification surface, and iteration 6 already took the discipline worth having from the reference. (iteration 10)
- `buzz`'s benchmarks and `HYPOTHESIS.md`/`lint_hypothesis.py` in turnstone are interesting process artefacts and no capability; not ranked. (iteration 10)
- A full read of `turnstone`'s eval module was not needed: the case format and the two scoring tests establish both the mechanism and that it is tested. (iteration 10)

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
- Frontier size: 5 nodes (4 open, 0 active, 1 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 1 of 5 iterations spent
- Budget depth2: 1 of 7.5 iterations spent
- Budget depth3: 0 of 1.5 iterations spent

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Frontier node F-2-006 (depth 2, scope specs/system-skilled-bots/context/tinychannels-main/src/providers/whatsapp/api.rs, specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue): Which transports can prove a send never left (NotSent reconciliation) from their own error shape, and which must treat every ambiguous result as unknown?

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
