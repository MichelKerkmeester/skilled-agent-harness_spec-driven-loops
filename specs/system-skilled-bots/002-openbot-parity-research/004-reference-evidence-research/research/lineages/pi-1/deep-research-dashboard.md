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
- The build plan: the fourteen phase folders and the contracts/ folder of specs/system-skilled-bots/003-openbot-parity-build (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels, 012-manual-testing-scenarios, 013-skilled-and-doc-alignment, 014-deep-review).
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

- Started: 2026-11-27T07:22:45.211Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: fanout-pi-1-1795763950430-ek4gqy
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
| 1 | Frontier node F-1-003 (depth 1, scope specs/system-skilled-bots/context/openhuman-full/crates/openhuman-tui, specs/system-skilled-bots/context/openhuman-full/vendor, specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen): openhuman-full, never studied before: what do its five vendored crates (tinyagents, tinyconnectors, tinymemory, tinyhumans-sdk, tinysecurity) and its built openhuman-tui crate hold that openhuman-main lacks, and what does that change for phase 003-terminal-screen and its six children and for any other planned phase? | reference-evidence | 0.88 | 8 | complete |
| 2 | 006-approval-grants, 007-per-bot-apps and 008-vault: what the tinysecurity approval engine, policy default and redaction rule set do that the plan's kind-first ladder, item-id answer and value-based leak matcher do not | trust | 0.90 | 5 | complete |
| 3 | 011-messaging-channels and 002-routine-layer: what tinychannels delivers on durability negotiation and conformance fixtures, and what OpenBot's firing frame and routine checklist fix that the plan's four-part routine block does not guard | channels-and-routines | 0.80 | 5 | complete |
| 4 | 005-memory and 004-computer-exposure: turnstone's stable memory identity and body-free index, OpenGhost's crowded-mark compaction, and the pinned prompt block the plan does not refresh on resume | memory-and-computer | 0.85 | 5 | complete |
| 5 | Net-new sweep over OpenBot-main/shared: six ranked candidates for a later packet plus the optimistic-row rule 001 already satisfies by construction | net-new | 0.90 | 7 | complete |
| 6 | 003-terminal-screen child 005-answer-flow and 010-conversations: the command-preview sanitizer exception, the approval card as a diff, the paste guard, and the display-copy rule turnstone states | answer-flow-and-chat | 0.75 | 5 | complete |
| 7 | 012-manual-testing-scenarios, 013-skilled-and-doc-alignment and 014-deep-review: the artifact shapes in openhuman-full that the plan rules do not cover, from a sigpipe test to a findings note that records its rejected hypothesis | rules-phases | 0.90 | 5 | complete |
| 8 | Second net-new sweep over the remaining twenty-one vendored crates, which yields two guards a planned phase needs (tinyskills supply-chain scan for 009, tinyeventqueues inbound dispositions for 011) and a licence-closed ranking of the rest | net-new | 0.92 | 5 | complete |
| 9 | 007-per-bot-apps: the reference tool-call gate (a five-step privilege ladder, a caller maximum, a cron read-only ceiling, an hourly budget and a payload-free typed denial) against the plan server-list filter | trust | 0.85 | 5 | complete |
| 10 | Consolidation: per-phase coverage across the 50 findings, the licence wall across all ten repos, one merged net-new ranking, the three questions the corpus cannot answer, and the three recurring failure classes | consolidation | 0.55 | 5 | insight |

- iterationsCompleted: 10
- keyFindings: 55
- openQuestions: 0
- resolvedQuestions: 1

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 1/1
- [x] openhuman-full, never studied before: what do its five vendored crates (tinyagents, tinyconnectors, tinymemory, tinyhumans-sdk, tinysecurity) and its built openhuman-tui crate hold that openhuman-main lacks, and what does that change for phase 003-terminal-screen and its six children and for any other planned phase?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▇▇█▇▆▆▇▇▇▇▆▅▇███▇▆▄▁
- score sparkline: ▇▇█▇▆▆▇▇▇▇▆▅▇███▇▆▄▁
- Last 3 ratios: 0.92 -> 0.85 -> 0.55
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.55
- coverageBySources: {"code":140,"other":4}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **Adding `--demo` as a phase-003 requirement.** The reference's `--demo` offline preview is the closest thing to a deterministic renderer harness, but `006-hardening-and-proof` names it and rules it out ("a `--demo` binary, a bench flag, mouse support and a theme picker - the parent rules each out"), and REQ-022 already proves the answer path through a release `pty_smoke` run. Not a gap; not a finding. (iteration 1)
- **Lifting any vendored crate.** All five name GPL-3.0-only in their own `LICENSE` (and 25 of their crate manifests say `license = "GPL-3.0-only"`), the same licence as openhuman itself. They are design references only; no function is copyable into this MIT tree. (iteration 1)
- **Recording the sanitizer rule as a new gap in `004-panes`.** It is not a gap: REQ-021 lands exactly the rule the reference's filter is not, and the citation to `theme.rs` is already in the plan. Only the filter-versus-replace divergence is new, and it is finding 5. (iteration 1)
- **Treating openhuman-full as a new TUI design source.** Reading it as a second TUI would have been wasted work: `crates/openhuman-tui/src/` is byte-for-byte the same file list and the same size as `openhuman-main`'s, and the plan already cites that source. Read as a *vendored-crate* source instead, which is where the 658 MB of difference lives. (iteration 1)
- `grep` for a `PermissionLevel` enum across `vendor/tinyagents` returned nothing, so the per-tool permission claim for phase 007 and 009 is **not** established this iteration. `tinyagents/crates/tinyagents-hooks/` holds `command/`, `lifecycle/`, `stop/`, `tool/`, `turn/`, `session/` and `scope.rs`, which is a hook seam worth a later read, but the file names alone are not evidence of a contract. (iteration 1)
- Reading `src/viewport.rs` for selection-anchor semantics (the plan's "a row selected by its index moves under the operator" defect) did not settle it: the cache anchors a *cached block* by index and offset (`anchor: Option<(usize, usize)>`), which is a scroll-position anchor for a transcript, not an identity anchor for a list. Not usable as evidence for the panes defect, so no claim is made. (iteration 1)
- **Claiming `apps:` as a sandbox gap.** It is not a gap: 007's scope boundary says the key is a filter and confines no child, which is the honest statement the reference's `unknown tools deny` default would otherwise be cited against. (iteration 2)
- **Reading `tinysecurity`'s sandbox and egress crates for this iteration.** `tinysecurity-sandbox`, `tinysecurity-egress` and `tinysecurity-crypto` all exist and are large, but 004-computer-exposure already rules out a browser computer and a container per bot, so their evidence would land on a phase that has declined the capability. Recorded for a later iteration only if 004's decision is revisited. (iteration 2)
- **Reusing `tinysecurity-audit`'s journal design as a 006 finding.** The crate's own doc ("Sanitized ordered audit batches and restricted durable native storage") is real, but the plan already writes JSONL under a 0700 state root and defers grant audit rows to a later packet by decision, so the difference is one of degree and produced no finding. (iteration 2)
- `grep` for `pub fn`/`max_`/`rotate` in `tinysecurity-audit/src/rotation.rs` returned nothing, and `journal.rs` has no exported bound either; the rotation story could not be established from exported names, so no claim about audit-log growth is made. (iteration 2)
- The plan-side `grep` for `base64|pem|entropy|luhn|IBAN` over `008-vault/design/leak-checks.md` returned only the base64 and URL-encoded forms, which is what finding 3 rests on; there is no separate entropy or PEM check to compare against, so the finding is stated as an addition, not as a conflict. (iteration 2)
- **Claiming the plan lacks an inbound dedupe story.** REQ-006 resolves a press or reply with no approval-index entry through `answerItem`'s existing answered-or-expired row, which is what "a second press, a redelivery after a crash and the second chat of a two-target bot" reach. That is a dedupe path, so no gap. (iteration 3)
- **Comparing the reference's legacy `Channel` API against its v2 `ChannelAdapter`.** The README says the legacy surface "remains for source compatibility and is not the production factory path", which is a two-contract lesson the plan already avoids by defining one adapter contract (REQ-001). Nothing to add. (iteration 3)
- **Finding a duplicate-send gap in the plan's queue.** There is none: REQ-013 already records an uncertain or orphaned `sending` entry as `unknown`, never retries it, writes the state to the run record, and prints M21, with an acceptance criterion that names the exact test. The reference's queue state machine is the same shape, so the comparison confirms the plan and produces no finding. (iteration 3)
- **Reading OpenBot's routine UI tests** (`routine-plan.test.ts`, `new-routine-form.test.tsx`, `routine-edit.test.tsx` and eleven more) for phase 002. They test a React routine editor the plan deliberately does not build — `bots routines` is a list — so their evidence would land on a surface 003 declined. (iteration 3)
- `find` over `tinychannels` for `*.ts` returned 0 lines and a `wc` of 0, which is not a fact about the repo: the crate is Rust (`crates/tinychannels-*`), so the TypeScript search found nothing. Recorded so a later iteration does not repeat it as a content claim. (iteration 3)
- OpenBot's `shared/routine-firing.ts` continues past line 30 with the reader half (`readFiring`) and more failure notes; only the frame's declaration was read. The reader's stripping rule is not claimed here. (iteration 3)
- **Lifting turnstone's body-free index into 005.** It solves a problem the plan does not have: the index exists because turnstone's memory is unbounded and bodies cannot be injected, while the plan's bound is 3.6 KB, which is cheaper to inject whole than to index and then fetch. The plan's choice is the one the evidence supports; only the pinned-block consequence (finding 3) needs closing. (iteration 4)
- **Re-opening 004's container question.** OpenBot's `computer-start.ts` and `computer-token.ts` are the container's own bootstrap and token derivation; 004 declines the container, so their evidence lands on a refused capability. The parity synthesis's eliminated-alternatives row already records that refusal. (iteration 4)
- **Reading OpenGhost's cross-window reload path (`store.onChange`, `SAVE_DELAY = 400`).** It exists because two Electron windows share one memory; the runtime has one process per run and no second window, so it is dead code for this build. (iteration 4)
- `find … | xargs grep -ln "class StructuredMemory"` returned no file, yet `grep -ln` over the same tree had already named `turnstone/core/memory.py` and `turnstone/core/memory_index.py`. The `xargs` form silently dropped the paths, so the class body was never read; the doc plus the module names were enough, and no claim rests on the class body. (iteration 4)
- Reading `OpenBot-main/docs/routines.md` around the count-reset rule to compare fatigue semantics produced nothing new: 002 REQ-006 already cites the exact line. (iteration 4)
- **Ranking `learning.ts` (335 lines) as a net-new item.** Its per-agent learning targets and its "who reviews what a person's own Learning space proposes" default-to-admins rule is the same question 009's proposal review and 011's roster already answer with `operators.json`; adding a second review-routing mechanism would duplicate the roster. (iteration 5)
- **Ranking `security-floor.ts` (351 lines) as a net-new item.** A signed `security-floor.json` published beside the update feed, which raises a minimum safe app version and shows one notice below it, is real engineering for a product that ships signed desktop installers. This build ships a repository and a CLI, where `git pull` is the update path, so the value to a small team is near zero. Not ranked. (iteration 5)
- **Treating `what-if.ts` as a 006 requirement.** It is not: 006 is a build packet for the grant record and the ladder's first rung, and a what-if verb is a read over deciders that must exist first. It is a net-new candidate for a later packet, and finding 2 says so. (iteration 5)
- `grep` for `actor|onBehalfOf|actedBy|requestedBy` in `app/src/lib/bot-lifecycle/queries.ts` produced one unrelated comment line, so no claim about how OpenBot attributes a scheduled action to a person is made. The parity synthesis's open question 1 (who is the actor for a scheduled run) therefore remains open on the reference side, and this iteration adds nothing to it. (iteration 5)
- The nine headers were read, not the bodies. Each finding's size is an estimate from the module's line count and its stated contract, and is marked as a size, not a measurement. (iteration 5)
- **Lifting `_one_line`'s 400-character summary cap as a requirement.** The plan already clips `grants.action` to 120 characters and puts only stderr's first line in the status row, so the reference's cap is a weaker version of a rule the plan has. The one detail worth keeping is the reason: the reference caps because "its line feeds could push the card and its RISK line off screen", which is the same argument the plan's status-row rule makes. (iteration 6)
- **Reading openhuman's composer** (`src/composer.rs`, 343 lines) for the paste rule. The README's controls table states the rule normatively, and the implementation would only show the escape sequence it listens for, which the plan's crate would pick for itself. (iteration 6)
- **Treating the diff-preview finding as a 010 item.** A conversation shows what was said, not what an action will change; the preview belongs to the approval card. (iteration 6)
- `grep` for `REQ-0` in `010-conversations/spec.md` returned two rows that are *requirement-id history*, not requirements: the phase parent assigns its children's id ranges and records two renumbering decisions. The real requirement tables live in the three children, which is where they were read. Recorded so a later iteration does not mistake the parent's range table for a missing requirement list. (iteration 6)
- Reading `_show_lines`'s CR-LF rule as a finding for the plan's message storage: the plan already keeps every line feed and drops every other control character, "the carriage return included" (REQ-003, decision D10), which is the same rule with a clearer boundary. No finding. (iteration 6)
- **Copying `llms-full.txt` as a second generated artifact.** A 3,231-line concatenation is a distribution format for a published corpus; this repo's docs are read in place, so the index alone earns its place. (iteration 7)
- **Proposing a fourth alignment command.** 013 already runs two generators and a re-run loop with a parsed `Open findings:` grammar; a doc index is a generated artifact of the run, not a third command. (iteration 7)
- **Proposing openhuman's `FINDINGS-*.md` as a required file per review.** One note per finding would duplicate what 014's review report already holds; the finding keeps the two *sections* (rejected hypothesis, correction) and not the file-per-note convention. (iteration 7)
- **Reading openhuman's `e2e/` directory as a corpus.** It is a Docker Compose harness (`docker-compose.yml`, `run-local.sh`, an entrypoint script) for a containerised stack the build does not have, so its shape does not transfer. (iteration 7)
- `014-deep-review/spec.md` was read for the words `ruled out`, `hypothesis` and `correction` and returned nothing, which is what finding 5 rests on; the absence of a word is weaker evidence than the presence of a requirement, so the finding is stated as "does not require" and not "forbids". (iteration 7)
- The `grep -c "^| BOT-"` count of 33 is the scenario table's own count, not a coverage claim: several rows cite the same requirement, so "33 scenarios" does not mean 33 distinct behaviours. No coverage percentage is claimed from it. (iteration 7)
- **Closing the `tinyjuice` question by inspection.** Its README is a logo and a broken image link, and `tinyflows`' README points at tinyjuice's image, so the two are related but neither describes itself. No claim is made; a later iteration can open its crate list. (iteration 8)
- **Lifting any code from the vendor tree.** GPL-3.0-only across all 21 crates. Every item above is a rule set or a design, and the finding says so per item rather than once. (iteration 8)
- **Ranking `tinycomputer` and `tinybox` as net-new candidates.** They are the two largest crates in the tree (630,174 and 159,147 lines) and both exist to give a bot a machine. 004-computer-exposure declined that, with evidence, and the parity synthesis's eliminated-alternatives row records it. Their size is the argument *against* them for a small team, not for them. (iteration 8)
- **Treating `tinymcp` as an MCP client.** Its name promises one; its README opens "A production-ready Rust 2024 TinyBus module template used by TinyHumans AI". Recorded because a name-based search would have cited it as evidence that the reference has first-class MCP support, which it does not. (iteration 8)
- `find … -print0 | xargs -0 wc -l | tail -1` printed `17,485 total`, which is one `xargs` batch's total rather than the tree's; the correct figure came from `… | xargs -0 cat | wc -l` (4,379,258). Recorded because the wrong number was believable and would have understated the tree by two orders of magnitude. (iteration 8)
- `ls tinyartifacts` failed; the directory is `tiny-artifacts`. A hyphenated name is easy to lose in a list, and a later iteration should copy the name from `ls`. (iteration 8)
- **Proposing a full policy engine for 007.** The reference's `tinysecurity-policy` is a 288k-line workspace whose engine folds three inputs into one verdict and whose bus carries a versioned contract; the plan's own scope boundary declines a rule store, and findings 1 to 3 are the three checks that fit without one. (iteration 9)
- **Reading `rakazo-main` for per-agent tool filtering.** A grep for `allowedTools`, `toolAllowlist` and `enabledTools` over its `packages/core/src` returned no file, so rakazo does not carry the pattern; the search is recorded rather than repeated. (iteration 9)
- **Treating the permission ladder as a 009-skills item.** A skill declares `allowed-tools` in its frontmatter (the reference parses it as "scalar or sequence"), but the skill's declaration is a *claim about the skill*, not a ceiling on the caller, and 009's own caps already bound what a skill can inject. The ceiling belongs to the bot. (iteration 9)
- A first draft of finding 1 carried the cite path through a `vendor/../crates` segment, which is both wrong and unreadable; it was replaced with the plain path before the iteration was recorded. Recorded because a SOURCE tag that resolves through `..` can still resolve, so a broken path is easy to leave in place. (iteration 9)
- The first grep for `PermissionLevel` over `vendor/tinyagents/crates` returned nothing, and the type turned out to live one level deeper, in `vendor/tinyagents/vendor/tinytools/crates/tinytools/src/permission/types.rs` — a *vendored crate inside a vendored crate*. Recorded because it explains why iteration 1's search came up empty and why a vendor tree needs a recursive search rather than a `crates/*/src/*.rs` glob. (iteration 9)
- **A per-phase "readiness" score.** The three earlier syntheses already produce verdict-per-phase tables and the plan-depth run downgraded and rejected findings with reasons; a fourth score would be a fourth scale. This iteration states coverage as counts plus the one qualitative fact that matters (whether a reference implementation exists behind the finding), and leaves scoring to 014-deep-review. (iteration 10)
- **Merging the net-new ranking into the parity synthesis's ranked build order.** The two orders answer different questions — the build order ranks *planned phases*, the ranking above ranks *unplanned candidates* — and merging them would put a what-if verb ahead of the routine layer for no reason. (iteration 10)
- **Re-opening any finding to raise its severity.** This is a reading iteration, not a re-adjudication; where a rank moved (finding 3, items 1 and 11) the iteration says which earlier finding it came from. (iteration 10)
- Nothing new was searched, so there is no dead end from searching. The one thing that did not work was attempting to state a coverage percentage: 50 findings over fourteen phases is not a percentage of anything, because a phase's reference surface is not enumerable. The count table is what survived. (iteration 10)
- The delta aggregation read `iter-001` to `iter-009` by name rather than by listing the directory, so a future reader adding an iteration must extend the loop; recorded because a stale script is how a coverage table silently undercounts. (iteration 10)

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
- Frontier size: 1 nodes (0 open, 0 active, 1 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 1 of 5 iterations spent
- Budget depth2: 0 of 7.5 iterations spent
- Budget depth3: 0 of 9 iterations spent

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
