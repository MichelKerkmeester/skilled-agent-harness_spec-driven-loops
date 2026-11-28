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

- Started: 2026-11-27T08:19:00.000Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-vibe-1-1795763950430-ek4gqy
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
| 1 | Frontier node F-1-001 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor, specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer, specs/system-skilled-bots/context/OpenBot-main, specs/system-skilled-bots/context/OpenMausBot-main, specs/system-skilled-bots/context/turnstone-main): Human surface, phases 001-activity-and-actor and 002-routine-layer: which reference files implement an activity feed, an inbox, an actor on a record and routines with an until outcome, what should the builder lift or mirror, and which failures or fixes in those repos does the plan not guard against? | human-surface | 0.93 | 7 | complete |
| 2 | Frontier node F-1-005 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure, specs/system-skilled-bots/003-openbot-parity-build/005-memory, specs/system-skilled-bots/003-openbot-parity-build/009-skills, specs/system-skilled-bots/003-openbot-parity-build/010-conversations, specs/system-skilled-bots/context/OpenGhost-main, specs/system-skilled-bots/context/hermes-muse-main, specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory): Prompt and records, phases 004-computer-exposure, 005-memory, 009-skills and 010-conversations: which reference files implement a working place named in the prompt, shared and per-bot memory with a size bound, a skill list under a cap and an append-only conversation with bot routing, and which pitfalls did those repos hit? | prompt-and-records | 0.83 | 6 | complete |
| 3 | Phase 003-terminal-screen: the built openhuman-tui crate in openhuman-full against the same crate in openhuman-main, and what the screen's six children should lift or mirror. | terminal-screen | 0.92 | 6 | complete |
| 4 | Phases 006-approval-grants and 007-per-bot-apps: the real action-kind classifier, the grant identity, the answer vocabulary and the per-bot app refusal. | approvals-and-apps | 0.92 | 6 | complete |
| 5 | Phase 008-vault: the three lifted rakazo files (secret-matcher.ts, secrets-guard.ts, vault.ts) and the mechanism the plan's lift line does not state. | vault | 0.70 | 5 | complete |
| 6 | Phase 011 messaging channels: capability-declaration honesty, ack policy, retry classification and durability negotiation in tinychannels | messaging-channels | 0.79 | 7 | complete |
| 7 | Phases 012 manual testing scenarios, 013 skilled and doc alignment, 014 deep review: test suites, scenario sets and doc-alignment checks in buzz, hermes-muse and turnstone | testing-and-docs | 0.86 | 7 | complete |
| 8 | Net-new capabilities in openhuman-full vendored crates: which of the 21 crates carry something neither the fourteen phases nor the section 13 skip list covers | net-new | 0.93 | 7 | complete |
| 9 | Net-new capabilities in the remaining six repos (buzz, hermes-muse, rakazo, OpenMausBot, OpenGhost, turnstone): behaviour eval harnesses and their design rules | net-new | 0.90 | 7 | complete |
| 10 | Cross-phase consolidation: the licence table per phase, the failures the plan does not guard against, phase-by-phase evidence completeness, and a correction to iteration 8 | consolidation | 0.60 | 7 | insight |

- iterationsCompleted: 10
- keyFindings: 98
- openQuestions: 0
- resolvedQuestions: 2

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 2/2
- [x] Human surface, phases 001-activity-and-actor and 002-routine-layer: which reference files implement an activity feed, an inbox, an actor on a record and routines with an until outcome, what should the builder lift or mirror, and which failures or fixes in those repos does the plan not guard against?
- [x] Prompt and records, phases 004-computer-exposure, 005-memory, 009-skills and 010-conversations: which reference files implement a working place named in the prompt, shared and per-bot memory with a size bound, a skill list under a cap and an append-only conversation with bot routing, and which pitfalls did those repos hit?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▆▇███▆▄▄▅▅▆▇▇██▇▄▁
- score sparkline: █▇▆▇███▆▄▄▅▅▆▇▇██▇▄▁
- Last 3 ratios: 0.93 -> 0.90 -> 0.60
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.60
- coverageBySources: {"code":122,"other":74}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Looking for an `actor` field in OpenBot's audit trail.** A search of `shared/audit-words.ts` and `server/src` for `actorId`/`actor_id` returns nothing, so phase 001's `actor` has no reference counterpart to lift. The reference attributes by conversation and by routine owner instead, which is a different model and does not settle the plan's `by:` field. (iteration 1)
- **Reading `activity-rows.ts` as the row-shape source.** It is the personal-edition event-row filter, not the activity row type; the row shape lives in `bot-lifecycle/queries.ts` (`ActivityItem`, `BotActivity`). Phase 001's seven row keys are its own and are not contradicted by the reference. (iteration 1)
- **Treating OpenBot's `recurring` group as a routine list.** It mixes routines, goals and check-ins, so it cannot be lifted as a routine list; only its ordering rule is reusable. (iteration 1)
- `endsWhenMet` evaluation: the flag is set and read in the app (`plan.ts:30`, `merged.ts:147-152`, `goal-page.tsx:402`) but the server-side "is the outcome met" evaluation is not in the checkout under a name a search finds, so the reference offers no liftable `until` check. Phase 002's `until_check` command has no counterpart and is the plan's own design; the evidence neither supports nor contradicts it. (iteration 1)
- OpenBot's 20-enabled cap: already out of scope in phase 002 by name [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:114], so not a gap. (iteration 1)
- **OpenGhost's `tidy` rewrite as a phase-005 gap.** Phase 005 refuses it by name and gives its reason — a model call inside a verb [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:100] — so the `TIDY` prompt at `memory.js:12-15` is a decided deferral, not a gap. Recorded here so a later iteration does not re-open it. (iteration 2)
- **Phase 004 has no reference counterpart.** OpenBot's "computer" is a loopback-only container with a per-bot token, not a directory named in a prompt, so there is nothing to lift for a working-place line. The 003 synthesis already records "Reference code to study first: none in `C/`" for 004, so this is a confirmation and not a new finding. (iteration 2)
- **tinymemory's recall/fetch/store engine as a phase-005 design.** It is a three-crate memory service with namespaces and seven model-callable tools; only its `context.md` compiler and its token estimate bear on 005. The engine belongs under net-new. (iteration 2)
- A reference conversation store with `@bot` routing: turnstone keeps conversations in `ChatSession` with no append-only file and no routing grammar, so 010's file format has no counterpart. Only its compaction policy transfers (finding 6). (iteration 2)
- A reference for phase 004's prompt line: searched `turnstone/prompts/` and `turnstone/core/` for a working-directory line and found none, so no repo names its working place in the prompt. 004's design is the plan's own and the evidence neither supports nor contradicts it. (iteration 2)
- **Lifting the reference's `AppTab` set as the screen's tabs.** Its four tabs are Logs, Chat, Config and Settings; the plan's screen draws activity, inbox, routines and chat, so only the cycle shape transfers, not the tab list. (iteration 3)
- **Reading `openhuman-main`'s TUI as a different, older crate.** It is byte-identical to `openhuman-full`'s, so there is no second version to compare and no "built" source to prefer. (iteration 3)
- **Treating the missing `target/` directory as evidence the crate was never built.** The build log records the compile and the link warning; the target directory is simply not in the checkout. (iteration 3)
- A second TUI implementation in `openhuman-full`: `crates/` is identical to `openhuman-main`'s and the only other UI surface is `crates/openhuman-app` (a desktop app), so there is no second terminal client to compare. (iteration 3)
- The reference's `cockpit.rs` overlay and approval banner: read for the approval surface, but phase 003's `005-answer-flow` child already specifies the banner and the overlay, so nothing there is new. (iteration 3)
- **Lifting `tool-name.ts` for the approval ladder.** It is a display humaniser; the classifier is `approvals.ts` plus the `docs/approvals.md` table. Recorded as finding 1 so the correction reaches the synthesis. (iteration 4)
- **Reading `docs/approvals.md:3-13` as new.** Phase 006 already cites the four-rung order at that line [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:63], so the order itself is carried; only the kind-opening rule and the grant identity are new. (iteration 4)
- **Treating `HostCommandPolicy` as a phase-006 gap.** It governs host shell commands, which the runtime's posture matrix already refuses by pair, so it belongs to the deferred per-action packet and not to 006. (iteration 4)
- A per-bot app filter in rakazo: its vault and secret layer is phase 008's, and its app surface is a connector catalogue rather than a per-bot allowlist, so nothing there answers 007. (iteration 4)
- A written `approval-ladder.md` in the runtime: the file does not exist, so the precedence rule has no current home and finding 2 is a gap in a deliverable rather than a contradiction in a document. (iteration 4)
- **rakazo's `connection-catalog.ts` and `connected-apps.ts` as phase-007 evidence.** They are a connector catalogue, not a per-bot allowlist, and 007 is already closed by iteration 4. (iteration 5)
- **The `secrets` name grammar and the environment key mapping.** Both are the 003 synthesis's 008 gaps 1 and 2 and the phase now fixes them in `design/names-and-keys.md`; nothing in rakazo adds to them. (iteration 5)
- **The at-rest encryption toggle as a phase-008 gap.** `resolveContentEncryption` is a real mechanism — `CONTENT_ENCRYPTION=on|off`, with reads decrypting either way so switching off never strands data [SOURCE: specs/system-skilled-bots/context/rakazo-main/packages/core/src/node/secrets-guard.ts:32-44] — but phase 008 refuses encryption beyond the file mode by decision and records turnstone's config-only key rule as the alternative [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:107]. Recorded so a later iteration does not re-open it. (iteration 5)
- A constant-time compare in `secrets-guard.ts`: the plan names one, and the file's first 55 lines hold the placeholder guard and the encryption toggle but no compare, so the compare is further down and adds nothing to the five findings above. (iteration 5)
- A per-bot secret index in rakazo: the vault is per owner and per item, with bots as grantees, so there is no per-bot list to compare against the plan's `secrets:` field beyond finding 4. (iteration 5)
- **`ChannelReceiveAckPolicy` as a global setting.** The enum is per-adapter (`declared_capabilities` and `receive_ack_policy` are both trait methods with defaults), so there is no single correct ack point to write into the plan. Any plan text that names one ack rule for all transports is contradicted by the reference's own structure. Candidates for the reducer's exhausted list: "one global ack rule for phase 011". (iteration 6)
- **A typed error taxonomy for permanent failures.** The reference uses substring matching on provider text. A typed taxonomy would require every transport to map its provider's errors, which is the refactor the reference avoided. Do not propose it as an improvement. (iteration 6)
- **Reading `src/approvals/mod.rs` for the approval index.** The 003 synthesis already rules this out — the reference keeps its approval index in memory and the phase must not copy it [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:011-messaging-channels]. Not re-read. (iteration 6)
- **Reading `src/delivery/queue.rs` for queue-entry fields.** The synthesis names it as a file to study, and 003 gap 4 already records that the queue entry has no field list. Reading it would produce a field list, which is the gap's closing artifact rather than new evidence. Deferred to the phase's own contracts child. (iteration 6)
- **Treating the conformance crate as a test harness only.** First read suggested it was a fixture runner; the `check_feature` body shows it is the enforcement point for the capability contract. Re-read at `:373-430` to confirm, which is why F-6-1 is stated as a contract rather than a test. (iteration 6)
- **A hand-maintained list of scenarios.** `buzz-db/TESTING.md`'s discovery-by-structure plus its guard script is the counter-example; a list is the thing the guard exists to avoid. Candidate for the exhausted list: "register each scenario in an index file". (iteration 7)
- **A single-prompt scenario format.** `tests.json`'s `user_prompts` array of ten paraphrases makes a one-prompt scenario look under-specified by comparison. Any 012 scenario written with one prompt is contradicted by the reference's own design. Candidate for the reducer's exhausted list: "one prompt per manual scenario". (iteration 7)
- **Reading `buzz-main/crates/buzz-acp/TESTING.md` and `buzz-cli/TESTING.md`.** The `buzz-db` file already yielded the discovery-by-structure pattern (F-7-2); the other two are per-crate variants of the same shape. Reading them would produce redundant evidence for a pattern already established. (iteration 7)
- **Reading `hermes-muse-main/scripts/check_boundaries.py`.** Named in the same CI job as `check_callers.py` [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/.github/workflows/test.yml:22], but "boundaries" is an architecture-import check, which belongs to 014's review criteria rather than 013's doc alignment. Deferred. (iteration 7)
- **Treating `tests.json` as a test runner.** First read suggested a runner config; the `cases` array with `expected_actions` and `match_mode` shows it is a declarative manifest whose runner is elsewhere. The manifest is the liftable artifact, not the runner. (iteration 7)
- **A per-crate licence check.** The licence is uniform across all 21 vendored workspaces, so a per-crate table adds nothing beyond F-8-1's two exceptions (`tinyflows`, `tinyhumans-sdk`, both `-or-later`). (iteration 8)
- **Lifting code from `openhuman-full`, `openhuman-main` or `tinychannels-main`.** All three are GPL-3.0 (F-8-1). Any plan text that says "copy this file" from those repos is wrong. Candidate for the reducer's exhausted list: "lift code from a GPL-3.0 reference". (iteration 8)
- **Reading `tinycomputer`, `tinybox`, `tinyagents`, `tinyflows`, `tinymcp`, `tinymemory` and `tinyskills` in depth.** Each is either covered by a phase (005, 009, 002, 010) or by a §13 skip row (row 6 covers the container computer, browser farm and gVisor). Reading them would produce evidence for capabilities the plan has already decided against. Their line counts and member-crate lists are recorded in the table so a later iteration can pick one up without re-inventorying. (iteration 8)
- **Reading `tinywallet`, `tinyhosts`, `tinyhumans-sdk`, `tiny-artifacts`.** Ranked 1 on value; `tinyhumans-sdk` is a typed client for one vendor's backend, which is a lock the plan should not take. (iteration 8)
- **Treating the vendored tree as one artefact.** The first read assumed 21 independent crates. They share a `TinyBus` module protocol and a `tinystoragedrivers` port layer, so they are one product stack. That changes the ranking: a crate that is infrastructure for a stack the plan is not building ranks low even when it is large. (iteration 8)
- **A single-tier eval.** `OpenMausBot`'s three tiers (scripted, golden replay, opt-in live) and `buzz-dataset`'s two layers (regression k=1, workflow k=3) are independent designs that both refuse a single tier. A plan that specifies one kind of scenario test is contradicted twice. Candidate for the reducer's exhausted list: "one eval tier for phase 012". (iteration 9)
- **Averaging behaviour results into one score.** `buzz-dataset` explicitly forbids it: "Report regression results per behavior, not as an average capability score" [SOURCE: specs/system-skilled-bots/context/buzz-main/benchmarks/buzz-dataset/README.md:35]. Candidate for the exhausted list: "a single pass-rate headline for 012". (iteration 9)
- **Reading `buzz-main/benchmarks/harbor-buzz-orchestra`.** The `buzz-dataset` README already states the orchestration model (Harbor tasks, `task.toml`, evaluation layers); the orchestra folder is the runner for it, and the runner is not the liftable artifact. (iteration 9)
- **Reading `OpenGhost-main` for net-new.** Iterations 2 and 4 already extracted its memory bounds, its two-tier skill list, its `CAN` matrix and its `FOREIGN_EVENTS` set. Nothing in the earlier reads suggested a capability outside those. (iteration 9)
- **Reading `rakazo-main/packages/` in depth.** The package taxonomy (`adapter-kit`, `page-kit`, `testkit`, `contracts`, `ui-tokens`, `ui-web`, `chat-ui`, `memory`, `auth`, `db`, `i18n`, `logging`, `core`, `adapters`) is a monorepo layout for a multi-app product, which is closer to §13's multi-tenant and mobile skip rows than to anything the plan builds. The listing is recorded here so a later iteration need not re-inventory it. (iteration 9)
- **Treating `OpenMausBot-main/evals` as a test suite.** It is a behaviour harness with a scripted model. The distinction is the whole point of F-9-1 and reading it as a test suite would have produced "they have tests too" instead of the freeze-then-score seam. (iteration 9)
- **A per-phase licence section in each of the fourteen phase specs.** The plan already has one shared `contracts/` folder; fourteen copies of a licence rule is the drift problem `hermes-muse`'s generated-doc check exists to prevent. Candidate for the reducer's exhausted list: "per-phase licence statements". (iteration 10)
- **Counting findings per phase from the registry.** The registry is reducer-owned and read-only for this agent; the counts in F-10-4 come from the iteration files, which are this lineage's own artifacts. (iteration 10)
- **Importing a copy check from a reference repo.** None has one. The plan's own V9 is the best available and should be extended, not replaced. (iteration 10)
- **Re-reading the fourteen phase specs to build the licence table.** The table in F-10-2 is built from this lineage's own iteration findings plus the ten `LICENSE` files, both already in the packet. A phase-spec reread would add the plan's *intent* per phase, which the 003 synthesis already carries. (iteration 10)
- **Treating F-8-1 as correct.** It was not, in the part that mattered. F-10-1 replaces it. (iteration 10)

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
- Frontier size: 2 nodes (0 open, 0 active, 2 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 2 of 5 iterations spent
- Budget depth2: 0 of 6.5 iterations spent
- Budget depth3: 0 of 8 iterations spent

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
