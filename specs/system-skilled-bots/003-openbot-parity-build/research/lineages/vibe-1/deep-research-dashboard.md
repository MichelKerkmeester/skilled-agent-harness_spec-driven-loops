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
- Topic: Build-readiness review of the eleven planned phases of packet specs/system-skilled-bots/003-openbot-parity-build (001-activity-and-actor, 002-routine-layer, 003-terminal-screen, 004-computer-exposure, 005-memory, 006-approval-grants, 007-per-bot-apps, 008-vault, 009-skills, 010-conversations, 011-messaging-channels). Each phase has spec.md, plan.md, tasks.md and acceptance-criteria.md. They were written in parallel, each alone, and nobody has checked them against the built runtime or against each other. This is a review of plans, not new design research.

Evidence (read-only): the phase docs; the built skilled-bots runtime (.skilled/skills/system-skilled-bots/runtime/lib/, .skilled/bin/bots.cjs, .skilled/skills/system-skilled-bots/scripts/bot-check.cjs, runtime/tests/); the parity research synthesis specs/system-skilled-bots/002-openbot-parity-research/research/research.md; the reference repos under specs/system-skilled-bots/context/ (OpenBot-main, OpenMausBot-main, rakazo-main, openhuman-main, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main, tinychannels-main).

Four angles:
1. Plan versus runtime: do the files, functions, records, fields and verbs each plan names exist with the shapes it assumes, and are its test and verify commands runnable here?
2. Cross-phase consistency: do the phases agree on shared records (by: actor, grants, operators.json, conversation JSONL, memory files, state-root layout, HonoredPosture fields, bots --json output read by the terminal screen and the channels), and are the build order and dependencies sound?
3. Parity gaps and overbuild: for a small team, what is still missing after all eleven phases, and what do the plans build that is not needed or duplicates another phase or the runtime?
4. Security and failure modes: secret leakage, token storage, spoofed chat users, who may approve, restarts, lost or duplicated messages and answers, concurrent approvals from terminal and chat, prompt injection through memory, skills or chat, routine until and fatigue edge cases.

Every finding names the phase, the doc and line, the evidence with [SOURCE: path:line], a severity (P0 blocks the build, P1 wrong or missing, P2 polish) and the exact spec edit that fixes it. End with findings grouped by phase and ranked, plus a cross-phase conflict list.

- Started: 2026-11-25T14:06:38.000Z
- Status: COMPLETE
- Iteration: 13 of 13
- Session ID: fanout-vibe-1-1795615532231-nbblrp
- Parent Session: 2026-11-25T14:05:28.691Z
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Frontier node F-1-003 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/spec.md, specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels, specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor, specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer): Cross-phase interfaces and order: does the bots --json output the terminal screen (003) and the channels (011) read match what 001, 002, 006 and 010 promise to emit, and is the build order and dependency list in the parent spec sound? | cross-phase-interfaces | 1.00 | 9 | complete |
| 2 | Frontier node F-2-004 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants, specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels, specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen): Does the approval answer contract survive a restart and a replayed press across the terminal, chat and channel surfaces, and does the grant survive with it? | security-and-failure-modes | 0.89 | 9 | complete |
| 3 | Frontier node F-2-005 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure, 005-memory, 007-per-bot-apps, 008-vault, 009-skills): Do 004, 005, 007, 008 and 009 extend the run record and the status index without breaking the schemaVersion 1 validator or the closed FIELD_GROUPS list? | plan-versus-runtime | 0.88 | 8 | complete |
| 4 | Frontier node F-2-006 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor, 006-approval-grants, 011-messaging-channels): Who may approve: does 011's operators.json roster agree with 001's actor precedence and 006's ladder, and what happens when a channel actor and a terminal actor answer the same item? | security-and-failure-modes | 0.93 | 7 | complete |
| 5 | Frontier node F-2-007 (depth 2, scope specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/plan.md, .github/workflows/bots-runtime.yml, .opencode/bin): Are the phase verify commands runnable in this checkout, and does the crate path 003 fixes collide with the .opencode mirror rule or the CI workflow it edits? | plan-versus-runtime | 1.00 | 6 | complete |
| 6 | Frontier node F-3-008 (depth 3, scope specs/system-skilled-bots/003-openbot-parity-build/005-memory, specs/system-skilled-bots/003-openbot-parity-build/009-skills): Does the memory block 005 prepends to the prompt create a second injection path, and does its secret-literal check cover a fact a bot proposes through a needs-you item? | security-and-failure-modes | 0.92 | 6 | complete |
| 7 | Parity gaps and overbuild after all eleven phases: what does the parity research synthesis name that no phase builds, and what do the phases build that duplicates the runtime or another phase? | parity-gaps-and-overbuild | 0.83 | 6 | complete |
| 8 | 008 vault: does the secret store keep a value out of every surface a run can read, and what happens when the keychain is locked, the store is unreadable, or a secret is rotated while a run holds it? | security-and-failure-modes | 0.90 | 5 | complete |
| 9 | 007 per-bot apps: does the filtered UTCP config fail closed on a server the bot names but the filter drops, does the per-run config path sit somewhere a child can rewrite, and can HonoredPosture.apps be forged? | security-and-failure-modes | 0.88 | 4 | complete |
| 10 | 010 conversations: does the conversation JSONL frame a human message as data or as instruction, can a bot write the conversation file it is later fed, and does bots chat reuse the answer path or write its own? | security-and-failure-modes | 0.80 | 5 | complete |
| 11 | 002 routine layer: does the until check run a command as the bot, can a routine's starts list fire twice or never, and do the 15-minute floor and the ten-failure fatigue switch hold when the status index is stale or a run is parked? | security-and-failure-modes | 0.88 | 4 | complete |
| 12 | 006 approval grants: does the precedence ladder have an actor input and a rung for every answer surface, does the grants field name what it approves, and can a grant outlive the item it was given for? | cross-phase-consistency | 0.75 | 4 | complete |
| 13 | 003 terminal screen: do its acceptance criteria and the CI workflow agree on how the Rust crate is built and tested, and does the crate's fixture seam survive the JSON contracts the other phases change? | plan-versus-runtime | 0.88 | 4 | complete |

- iterationsCompleted: 13
- keyFindings: 77
- openQuestions: 0
- resolvedQuestions: 6

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 6/6
- [x] Cross-phase interfaces and order: does the bots --json output the terminal screen (003) and the channels (011) read match what 001, 002, 006 and 010 promise to emit, and is the build order and dependency list in the parent spec sound?
- [x] Does the approval answer contract survive a restart and a replayed press across the terminal, chat and channel surfaces, and does the grant survive with it?
- [x] Do 004, 005, 007, 008 and 009 extend the run record and the status index without breaking the schemaVersion 1 validator or the closed FIELD_GROUPS list?
- [x] Who may approve: does 011's operators.json roster agree with 001's actor precedence and 006's ladder, and what happens when a channel actor and a terminal actor answer the same item?
- [x] Are the phase verify commands runnable in this checkout, and does the crate path 003 fixes collide with the .opencode mirror rule or the CI workflow it edits?
- [x] Does the memory block 005 prepends to the prompt create a second injection path, and does its secret-literal check cover a fact a bot proposes through a needs-you item?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▆▅▅▅▆█▇▆▄▄▅▅▄▃▃▄▂▂▅
- score sparkline: █▆▅▅▅▆█▇▆▄▄▅▅▄▃▃▄▂▂▅
- Last 3 ratios: 0.88 -> 0.75 -> 0.88
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.88
- coverageBySources: {"code":132,"other":11}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Reading the reference repos for this node: the question is about this packet's own contracts, and every claim resolved against the built runtime instead. Deferred to the parity-gap angle. (iteration 1)
- Searching for a written `bots activity --json` row schema anywhere in the packet: no phase, plan or acceptance criterion enumerates the row fields. The gap is real, not a missed document. (iteration 1)
- Treating 003's "no new JSON contract" claim as evidence that the contracts match: it is a scope statement, not a check, and findings 6 and 8 show the contracts are under-specified rather than absent. (iteration 1)
- Looking for a scope field on `NeedsYouAnswer` in the runtime: the answer object holds `text` and `answeredAt` only [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts:24-27], so 006's scope is a new field on a new object, not an extension of an existing one. That is why the idempotency comparison cannot see it. (iteration 2)
- Reading 011's transports for wire-protocol correctness: the question is about the answer contract, and the transports' own conformance rules (REQ-017) are a separate concern. (iteration 2)
- Treating 011's restart claim (NFR-R01) as unverified: it is backed by a file written before the I/O, and the runtime's queue already dedupes by request id. (iteration 2)
- Looking for a record-level allowlist that would reject `apps` or `secretsUsed`: there is none. The only strict list is `DISPATCH_ENV_KEYS` on the executor side, which is a different surface. (iteration 3)
- Reading 005's memory file format for this node: 005 touches no record and no index field, so its only interface here is the prompt builder. (iteration 3)
- Treating the closed `FIELD_GROUPS` list as a blocker for new fields: it is a presence check, not an allowlist, and the posture object is validated only as an object. (iteration 3)
- Looking for an existing lock primitive on the item path: the runtime has a run lease and a queue lease, and neither covers the item file. The fix has to add one. (iteration 4)
- Reading 011's transports for the roster check: the check is one function in `channel-link.ts`, and the transports only call it. (iteration 4)
- Treating the atomic write as sufficient: it makes one write indivisible, not one read-modify-write, which is the operation that races. (iteration 4)
- Looking for a mirror script that copies `.skilled/` into `.opencode/`: there is none, because the tree is symlinked. The "wholesale mirror" phrasing in 003 and in the parent's own conventions describes a mechanism the repository does not use. (iteration 5)
- Running the runtime suite to prove the commands work: it writes temporary state roots outside this lineage's write surface, so I verified the entry points and the installed binaries instead. (iteration 5)
- Treating the `.opencode` rows as harmless duplication: they are harmless to the build and harmful to the plan, because a task that cannot be done cannot be verified. (iteration 5)
- Looking for a sanitizer in the runtime that already strips control characters from a question: there is none on the item path, so the fix has to be added. (iteration 6)
- Reading 005's memory file format for its own sake: the format is bounded and clear; the finding is where the block sits in the prompt, not how it is stored. (iteration 6)
- Treating 009's `<skill_content>` wrapper as sufficient for both phases: it is the right pattern, and 005 does not use it, which is the finding. (iteration 6)
- Counting tasks as a size measure on its own: 007 has 20 tasks and 20 checks, so the count was used only where a phase's own scope boundary corroborated the size. (iteration 7)
- Looking for a `bots answer` roster check in 006: 006's ladder is a precedence order over action kinds, not an actor check, and it defers the roster by name. (iteration 7)
- Looking for a phase that builds the 0770 mode under another name: none does. 005, 008, 010 and 011 all create their own folders 0700/0600, which is the opposite direction. (iteration 7)
- Reading the reference repos again for this angle: the parity synthesis already carries the per-repo evidence with citations, and every claim here resolved against the packet and the runtime instead. (iteration 7)
- Treating the parent's notices table as authoritative: it disagrees with five of the eleven phases, so the phases are the evidence and the table is the defect. (iteration 7)
- Looking for a locked-keychain path: the matrix already covers an unreadable store and the refusal is named `secret-store-unreadable` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:220]. No finding. (iteration 8)
- Looking for a place where the runtime writes the child environment to disk: `dispatchEnv` is passed to the audited runner and never recorded, so the leak is the child's own output, not the runtime's bookkeeping. (iteration 8)
- Looking for a rotation path: the value is resolved once before dispatch and the child keeps it, so a rotation mid-run changes nothing for that run and the next run resolves the new value. No finding. (iteration 8)
- Reading 008's acceptance criteria line by line for a missing case: the criteria follow the requirements, so a requirement gap shows up as a criterion gap and the requirement is the place to fix. (iteration 8)
- Treating the keychain as the safe backend by default: it is the safer store at rest and the less safe one in flight, and the phase's risk row already says so. (iteration 8)
- Looking for a child-side rewrite of `<runFolder>/utcp.json`: the child can write it, but the child's own config is pinned elsewhere, so the rewrite changes nothing it reads. (iteration 9)
- Looking for a missing refusal on a malformed config: the risk row already names `utcp-config-missing` and `utcp-config-invalid` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:179]. No finding. (iteration 9)
- Looking for a schema-version requirement in 007 or 008: neither names `schemaVersion`, and the record validator treats the posture object as an object rather than a closed field list, so an added field needs no bump. No finding. (iteration 9)
- Looking for a way a bot could forge `HonoredPosture.apps`: the runner writes it from the resolved names after the refusal, so the record cannot claim a server the filter dropped. (iteration 9)
- Treating the checker's `apps-unknown-server` as a duplicate of the runner's refusal: `bot-check.cjs` loads the runtime's own predicates through `tsx` and restates no field rule [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:74-77], so the two share one implementation. (iteration 9)
- Looking for a `bots chat` path that writes its own answer record instead of reusing the queue: the phase adds a `requestIds` filter to `request-drain.ts` so one message runs through the same claim and routing path. That is the reuse the focus asked about, and it is correct. (iteration 10)
- Looking for a conversation-scoped approval grant: 010 defers it to 006 by name [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:106], and 006 owns the `grants` field. (iteration 10)
- Looking for a missing `by` on a chat message: REQ-003 carries it, and 001's actor resolver fills it. No finding. (iteration 10)
- Looking for a second writer to the conversation file inside the runtime: the CLI is the only writer, and the drain appends nothing today, which is finding 1 rather than a race. (iteration 10)
- Treating the append-only file as a torn-write risk: REQ-002 skips a torn last line and reports it [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:149], and the append is one line. (iteration 10)
- Looking for a `completed` switch that a run can clear itself: the switch is cleared by `bots enable` only, which is the intended one-way latch. (iteration 11)
- Looking for a floor gap on a non-cron start: a queue or git-hook start is demand-driven rather than a standing instruction, so the 15-minute floor applies to cron alone and the phase's reading matches the research's. (iteration 11)
- Looking for a missed-window replay: slot accounting already skips rather than replays, and the phase leaves it unchanged [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:118]. (iteration 11)
- Looking for a way a routine fires twice from one cron start: `starts[0]` renders into the single `trigger` the installer and slot accounting already read, so one start is one schedule. (iteration 11)
- Treating the `until` command as a new arbitrary-execution surface: the precheck field already runs `/bin/sh -c` as the operator, and a BOT.md change is refused as `definition-drifted` until re-enabled, so the surface is gated the same way. (iteration 11)
- Looking for a grant that outlives its item: the phase states that `always` is recorded on the item and read by the resumed prompt, not by a later item [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:104]. That is iteration 2's finding and it is already recorded. (iteration 12)
- Looking for a missing `deny` path: `deny` is one of the four answers and needs no kind, so an `other` item can always be refused. (iteration 12)
- Looking for a rules store that rung 2 needs: `approval-ladder.ts` is a pure function over four inputs, so the strictest-rule rule is testable with an injected list and the phase says so [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/plan.md:59]. (iteration 12)
- Looking for a secret in the grant: NFR-S02 states a grant is a kind, a phrase, a rung and a scope and never a credential [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:204]. No finding. (iteration 12)
- Looking for an actor input on the ladder: iteration 4 recorded that the ladder has none, and 011's roster is the phase that would supply it. (iteration 12)
- Looking for a `.opencode` mirror row that cannot be done: iteration 5 recorded that the tree is symlinked, and 003's two mirror rows are the same no-op. (iteration 13)
- Looking for a crate that copies openhuman code: REQ-002 refuses it by grep and the licence is MIT [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:162]. (iteration 13)
- Looking for a missing path entry: the two entries are one per trigger list, which is what the workflow needs, and `crates/bots-tui/**` covers the lock file. (iteration 13)
- Looking for a second language toolchain problem: the local toolchain exists and the phase confirms it in T002, so the only toolchain gap is the CI step, which iteration 5 recorded. (iteration 13)
- Looking for an unrunnable verify command: `cargo` and `rustc` are installed here, so `cargo test`, `cargo clippy` and `cargo fmt --check` run in this checkout. The gap is the CI job, not the local commands. (iteration 13)

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
- Frontier size: 6 nodes (0 open, 0 active, 6 answered, 0 exhausted, 0 blocked, 0 abstained)
- Pruned nodes: 0
- Revisits: 0
- Budget depth1: 1 of 6.5 iterations spent
- Budget depth2: 4 of 10.05 iterations spent
- Budget depth3: 1 of 8 iterations spent

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
