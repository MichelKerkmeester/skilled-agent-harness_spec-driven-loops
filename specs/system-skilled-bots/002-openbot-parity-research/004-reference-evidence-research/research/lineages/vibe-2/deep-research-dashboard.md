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

- Started: 2026-11-27T07:19:55.756Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-vibe-2-1795763950430-ek4gqy
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
| 1 | Frontier node F-1-002 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps, specs/system-skilled-bots/003-openbot-parity-build/008-vault, specs/system-skilled-bots/context/rakazo-main, specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity): Trust, phases 006-approval-grants, 007-per-bot-apps and 008-vault: which reference files implement approval grants, per-bot tool or app filtering and a secret store with injection, what should the builder lift or mirror, and which leak, bypass or precedence bugs did those repos hit that the plan does not guard against? | trust | 0.96 | 13 | complete |
| 2 | Frontier node F-1-006 (depth 1, scope specs/system-skilled-bots/context, specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios, specs/system-skilled-bots/003-openbot-parity-build/015-deep-review, specs/system-skilled-bots/context/buzz-main): Net-new and operations: what do the ten reference repos have that neither the 003 build plan nor the skip list of the parity synthesis covers, ranked by value to a small team, and which test corpora, failure-handling patterns and upgrade paths in those repos should feed phases 013-manual-testing-scenarios, 014-skilled-and-doc-alignment and 015-deep-review? | net-new | 0.93 | 15 | complete |
| 3 | Frontier node F-1-002 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps, specs/system-skilled-bots/003-openbot-parity-build/008-vault, specs/system-skilled-bots/context/rakazo-main, specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity): Trust, phases 006-approval-grants, 007-per-bot-apps and 008-vault: which reference files implement approval grants, per-bot tool or app filtering and a secret store with injection, what should the builder lift or mirror, and which leak, bypass or precedence bugs did those repos hit that the plan does not guard against? | trust | 0.90 | 10 | complete |
| 4 | Phases 001-activity-and-actor and 002-routine-layer: which reference files implement the same thing, what a builder should lift or mirror, where the plan differs from the reference and which side the evidence supports, and which failures the plan does not yet guard against. | activity-and-routines | 0.88 | 9 | complete |
| 5 | Phases 004-computer-exposure and 005-memory: which reference files implement the same thing, what a builder should lift or mirror, where the plan differs from the reference and which side the evidence supports, and which failures the plan does not yet guard against. | computer-and-memory | 0.95 | 9 | complete |
| 6 | Phases 009-skills and 010-conversations: reference files implementing the same thing, what to lift or mirror, where the plan differs and which side the evidence supports, and the failures the plan does not yet guard against. | phase-coverage | 0.90 | 9 | complete |
| 7 | Phases 011-messaging-channels and 014-skilled-and-doc-alignment, plus buzz-main: reference files implementing the same thing, what to lift or mirror, where the plan differs and which side the evidence supports, and the failures the plan does not yet guard against. | phase-coverage | 0.62 | 9 | complete |
| 8 | Phases 013-manual-testing-scenarios and 015-deep-review, plus buzz-main TESTING.md and CHANGELOG.md: what the reference proves that the plan's own proof does not. | phase-coverage | 0.83 | 9 | complete |
| 9 | Net-new sweep across the five unread repos (rakazo-main, OpenMausBot-main, OpenGhost-main, hermes-muse-main, turnstone-main) and the licence table across all ten. | net-new | 0.94 | 9 | complete |
| 10 | Phases 003-terminal-screen, 006-approval-grants, 007-per-bot-apps and 008-vault under a phase lens, plus the net-new ranking. | phase-coverage | 0.94 | 9 | complete |

- iterationsCompleted: 10
- keyFindings: 101
- openQuestions: 5
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/5
- [ ] Trust, phases 006-approval-grants, 007-per-bot-apps and 008-vault: which reference files implement approval grants, per-bot tool or app filtering and a secret store with injection, what should the builder lift or mirror, and which leak, bypass or precedence bugs did those repos hit that the plan does not guard against? [frontier]
- [ ] Net-new and operations: what do the ten reference repos have that neither the 003 build plan nor the skip list of the parity synthesis covers, ranked by value to a small team, and which test corpora, failure-handling patterns and upgrade paths in those repos should feed phases 013-manual-testing-scenarios, 014-skilled-and-doc-alignment and 015-deep-review? [frontier]
- [ ] Does the per-run filtered UTCP config compare a tool name before or after normalisation, and can a normalised alias slip past the apps filter? [frontier]
- [ ] Which of the four non-override rules does a routine-origin approval need, and does a standing answer saved from a check-in survive the next run? [frontier]
- [ ] Does the plan secret-store-unreadable detail ever carry a captured backend message, and what fixed phrase replaces it per cause? [frontier]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 5
- [ ] Trust, phases 006-approval-grants, 007-per-bot-apps and 008-vault: which reference files implement approval grants, per-bot tool or app filtering and a secret store with injection, what should the builder lift or mirror, and which leak, bypass or precedence bugs did those repos hit that the plan does not guard against?
- [ ] Net-new and operations: what do the ten reference repos have that neither the 003 build plan nor the skip list of the parity synthesis covers, ranked by value to a small team, and which test corpora, failure-handling patterns and upgrade paths in those repos should feed phases 013-manual-testing-scenarios, 014-skilled-and-doc-alignment and 015-deep-review?
- [ ] Does the per-run filtered UTCP config compare a tool name before or after normalisation, and can a normalised alias slip past the apps filter?
- [ ] Which of the four non-override rules does a routine-origin approval need, and does a standing answer saved from a check-in survive the next run?
- [ ] Does the plan secret-store-unreadable detail ever carry a captured backend message, and what fixed phrase replaces it per cause?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▇▇▆▇▇█▇▆▃▂▄▆▇███
- score sparkline: ██▇▇▇▇▆▇▇█▇▆▃▂▄▆▇███
- Last 3 ratios: 0.83 -> 0.94 -> 0.94
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.94
- coverageBySources: {"code":159,"other":8}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Deriving the ladder from a `ladder` or `rung` identifier in OpenBot.** A search for both terms across the TypeScript and Markdown returns nothing; the ladder is the plan's own framing of the documented order, not an OpenBot symbol. (iteration 1)
- **Reading the OpenBot approval engine from code.** `server/src/approvals/` is absent from the snapshot; only the shared declarations and `docs/approvals.md` survive. Recorded as finding 13 rather than retried. (iteration 1)
- **Treating tinysecurity as a lift source.** GPL-3.0 rules it out for a build that ships Apache-2.0 and MIT notices. Its contract text is still the best statement of the grant precedence rules, so it is cited as design evidence only. (iteration 1)
- `OpenBot-main/server/` — does not exist. Do not cite it again in a later iteration. (iteration 1)
- `rg "ladder|rung"` over `OpenBot-main` — no hits. The plan's four-rung vocabulary has no counterpart in the reference and must not be presented as lifted. (iteration 1)
- **Ranking `tinyvoice`, `tinyjuice`, `tinysearch` and `tinystoragedrivers` as candidates.** Voice (1,937 files), juice (2,158 files), web search (232 files) and storage drivers (330 files) each solve a problem the plan does not have: a terminal client, a model gateway, a UTCP-named search server and a SQLite index. Named here so a later iteration does not re-open them. (iteration 2)
- **Reading `openhuman-full` for anything but `vendor/`.** The per-directory counts are identical to `openhuman-main`, so a second read of `crates/`, `app/` or `docs/` in the full tree returns the same bytes. Recorded as finding 2. (iteration 2)
- **Treating the vendor tree as a lift source.** All twenty-one crates are GPL-3.0. Recorded as finding 4. (iteration 2)
- `openhuman-main/vendor/` — does not exist. Do not look for the vendor tree in the `-main` tree again. (iteration 2)
- The topic's "five vendored crates" — a subset of twenty-one. Do not carry the number forward into the synthesis. (iteration 2)
- **A normalisation bypass in the `apps:` filter.** The match is exact, case-sensitive, prefix-distinct and fail-closed by default. Recorded as finding 1. (iteration 3)
- **A standing-answer hole in the routine layer.** The plan refuses `--scope always` outright, so there is no standing answer to save. Recorded as finding 4. (iteration 3)
- **An echo risk in `secret-store-unreadable`.** The detail is a fixed phrase per cause. Iteration 1's finding 7 is corrected by finding 5. (iteration 3)
- `contracts/refusals.md` section 3.7 as the place a detail string is fixed — the design files own the detail, the contract owns the name and the exit. Do not read the contract for a detail again. (iteration 3)
- `OpenBot-main/shared/tool-name.ts` as a filter reference — it is a display module, not a filter. Do not read it again for 007's match rule. (iteration 3)
- **A missing `does` key in 002.** The plan has `does: act|tell` at REQ-003 and refuses `tell` beside `delivery`. The reference's "Does" is already covered. (iteration 4)
- **A missing `until` outcome.** The plan's `until` plus `until_check` is stronger than the reference's prose outcome. Recorded as finding 7. (iteration 4)
- **A missing check-in cap as an oversight.** The plan states the deferral at spec.md:120. It is a recorded non-goal, not a gap; finding 5 records only the residual size. (iteration 4)
- `OpenBot-main/docs/routines.md` as a source for the routine *file* shape — the reference has no file, only a store. Do not read it again for a schema. (iteration 4)
- `OpenBot-main/shared/activity-rows.ts` as a source for the seven group ids — it carries exclusions and dedupe, not the groups. The groups are in `app/src/lib/bot-lifecycle/activity-groups.ts`, which the parity synthesis already cites. (iteration 4)
- **A three-state `memory` key as a gap.** The plan's boolean is right for a file with no inheritance chain. Recorded as finding 7 with the condition that would change it. (iteration 5)
- **Porting tinymemory's engine or namespace tree into 005.** The plan's two files and one bound are the right size; the reference's three crates and a namespace tree are not. Recorded as finding 4. (iteration 5)
- **Reading `computer-control.ts` as 004's reference implementation.** The plan excludes the browser computer; the file is a handoff state machine for a page the plan does not have. Recorded as finding 1. (iteration 5)
- `OpenBot-main/docs/` has no memory document; the memory surface is `shared/learning.ts` and `docs/automatic-learning.md`. Do not look for `docs/memory.md`. (iteration 5)
- `OpenBot-main/shared/computer-control.ts` as a source for the plan's working-place line — the two share only the word "computer". (iteration 5)
- **A "never only a reaction" rule for 010.** The plan has no reactions and already refuses a blank line. Recorded as finding 9. (iteration 6)
- **A scope-precedence ladder for 009.** The plan has one tree and one name; the reference's five roots are a multi-root product's problem. Recorded as finding 4. (iteration 6)
- **A task-thread handoff for 010.** The plan's conversation is the run and its Problem Statement already names the limit. Recorded as finding 6. (iteration 6)
- `OpenBot-main/shared/orchestration.ts` as a source for the plan's conversation file format — the reference has no file, only tools and a thread. Do not read it again for a record shape. (iteration 6)
- `tinyskills` as a source for the plan's `skills:` list shape — the reference discovers bundles, the plan names them. Do not read it again for a list schema. (iteration 6)
- **A `chat_approvals` capability flag for 011.** The plan's `buttons` and `numberedReply` keys are the same gate at finer grain. Recorded as finding 5. (iteration 7)
- **A hosted relay for 011.** The plan already lists "A hosted relay or a web UI" as out of scope, citing the 001 synthesis. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:103] Not repeated. (iteration 7)
- **A three-mode durability negotiation for 011.** The plan owns all five transports, so a mode it never selects is a branch no test reaches. Recorded as finding 1, with the reference's conformance-coverage rule kept. (iteration 7)
- `buzz-main/ARCHITECTURE.md` as a source for any 003 phase — it is a 991-line Nostr relay architecture with no analogue in a local CLI. Read once for the documentation discipline, not again. (iteration 7)
- `buzz-main/docs/` as a source for 013's doc-alignment mechanism — it is 70 flat files with no topic or term index, which is the failure mode the plan's `terms` list fixes. Do not read it again for a scoping pattern. (iteration 7)
- **`buzz-main/PLANS/` as a source.** It holds two files, `ANDROID_PUSH.md` and `REPLICA_FULL_READ_ROUTING_DESIGN.md`, both about a mobile and a relay design with no analogue in a local CLI. Read once, not again. (iteration 8)
- **A numbered copy-paste runbook for 012 in place of the scenario table.** The plan's corpus is 25 or more scenarios across ten categories; a numbered procedure does not scale past the first run. Recorded as finding 7, with the reference's shape kept for the opening section. (iteration 8)
- **A post-hoc mining pass for 014.** The plan seeds every review-input row before any lineage spawns, which is the stronger ordering. Recorded as finding 4. (iteration 8)
- `buzz-main/ARCHITECTURE.md` and `docs/` for 014's review method — the reference reviews through pull requests and a changelog generator, not through a review phase. The method is in `TESTING.md` and `AGENTS.md`, not in the architecture. (iteration 8)
- `buzz-main/lefthook.yml` and `ct.yaml` as a review gate — they are pre-commit and chart-testing hooks, and the plan's gate is `validate.sh` plus the suite. No finding. (iteration 8)
- **`OpenGhost-main`'s layout as anything but a caution.** Recorded as finding 9. (iteration 9)
- **`OpenMausBot-main/enterprise/` and `connector/`.** Both are covered by the section-13 skip list's enterprise-roles and connector-catalogue rows, so they are cited and not repeated. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:88-95] (iteration 9)
- **`rakazo-main`'s i18n as a lift.** The plan writes English docs for one team. Recorded as finding 8. (iteration 9)
- **`turnstone-main/HYPOTHESIS.md` as a rule source.** It is a formal definition, not a rule set, and the one rule it yields — split parse failure from authorization rejection — the plan already follows. Recorded as finding 6. (iteration 9)
- `hermes-muse-main` beyond `plugin.yaml` — 125 files of a companion plugin whose goals and notices the plan's 002 and 010 already cover. (iteration 9)
- `OpenMausBot-main` beyond `evals/` — 9,637 files of a desktop and cloud product whose desktop and cloud surfaces the plan excludes. `evals/` is the one transferable part. (iteration 9)
- `rakazo-main` beyond its licence and its README set — 6,365 files of a multi-tenant web app whose tenancy the skip list already excludes. Do not read it again. (iteration 9)
- **`rakazo-main` and `OpenMausBot-main` for 008.** Iteration 1 read rakazo's secret store and iteration 3 read the plan's fail-closed surfaces; nothing new was found in either this iteration, so 008 is closed on those two. (iteration 10)
- **A generated-UI surface for 007.** The plan has none, so the reference's sandbox rule is recorded and not lifted. Recorded as finding 8. (iteration 10)
- **A keyword classifier for 006.** The plan owns its tools and a declaration is the stronger mechanism; the gap is only for a tool it does not own. Recorded as finding 5. (iteration 10)
- **A rules store, an auto-review switch or an extra-vigilant switch for 006.** The plan's scope boundary defers all three and the deferral is right; only the conversation scope is in reach. Recorded as finding 1. (iteration 10)
- `OpenBot-main/docs/approvals.md` beyond line 60 — the rest is the admin settings table and the audit-trail description, both of which the plan's 006 defers by scope boundary. (iteration 10)
- `openhuman-tui`'s `cockpit.rs`, `browser_login.rs` and `demo.rs` — three surfaces the plan's 003 lists out of scope by name, so reading them again would repeat a decision the plan already made. (iteration 10)

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
- Frontier size: 8 nodes (5 open, 0 active, 0 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 3
- Revisits: 1
- Budget depth1: 3 of 5 iterations spent
- Budget depth2: 0 of 3.5 iterations spent
- Budget depth3: 0 of 1.5 iterations spent

<!-- /ANCHOR:frontier -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Frontier node F-1-006 (depth 1, scope specs/system-skilled-bots/context, specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios, specs/system-skilled-bots/003-openbot-parity-build/015-deep-review, specs/system-skilled-bots/context/buzz-main): Net-new and operations: what do the ten reference repos have that neither the 003 build plan nor the skip list of the parity synthesis covers, ranked by value to a small team, and which test corpora, failure-handling patterns and upgrade paths in those repos should feed phases 013-manual-testing-scenarios, 014-skilled-and-doc-alignment and 015-deep-review?

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
