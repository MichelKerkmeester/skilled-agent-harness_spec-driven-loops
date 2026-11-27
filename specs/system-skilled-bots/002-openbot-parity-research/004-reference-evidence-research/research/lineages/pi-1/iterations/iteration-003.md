# Iteration 3: channel delivery negotiation and what a routine firing is framed as

## Focus

011-messaging-channels and 002-routine-layer. The strategy's Next Focus is still the terminal sentinel (one frontier node, answered in iteration 1), so the lowest-coverage rule applies again. Two phases are read together because both are about the same seam: a scheduled or channel-triggered run that a person never started, and what the runtime owes it. 011 is read against `tinychannels` (the reference's channel library), 002 against OpenBot's own firing frame and checklist.

## Actions Taken

1. Read the 011 phase parent and its children's requirements (`003-link-roster-and-answer-gate` REQ-001 to REQ-021, `004-approval-index-and-send-queue` REQ-006, REQ-008, REQ-013, REQ-016, REQ-019, REQ-028, REQ-034, and `007-conformance-hardening-and-proof`'s description).
2. Read `tinychannels`' `README.md`, `docs/channel-delivery.md` (durability negotiation, queue state machine, storage-unavailable rule), `docs/channel-providers.md` (the fifteen-provider table), and `crates/tinychannels-conformance/src/lib.rs` (the `AdapterFixture` trait and its capability comparison). Licence: GPLv3 in the workspace `LICENSE`.
3. Read the 002 routine phase's REQ-001 to REQ-011, then OpenBot's `shared/routine-firing.ts` and `shared/routine-checklist.ts`, whose module docs record the failures they were written for. Licence: MIT.

## Findings

1. **002-routine-layer.** OpenBot's firing frame exists because of a silent failure that no exit code catches: a stored instruction ("Every run, append the current date and time …") was sent to the model verbatim, the model read it as a question about routine *management*, called `list_routines`, answered that the routine was already configured, and appended nothing — the module doc says the run "recorded `succeeded`", and calls it "a routine telling somebody it is working while doing nothing at all, which is worse than one that breaks". The fix is one declaration read from both sides: `FIRING_FRAME`, three sentences that tell the turn it is a firing and that the instruction is work to do now, wrapped around the stored instruction with a blank line the reader strips. The plan's routine block has the four parts, the `until_check`, the fifteen-minute floor and the fatigue switch, and no requirement anywhere states how a firing is put to the model, which is exactly the failure this repo already paid for. Licence MIT, so the frame's wording is liftable. Size S: one constant and one wrap. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts:1-30] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:168-183] (observed)

2. **002-routine-layer.** OpenBot bounds a multi-part routine and holds the run to its parts: `routine-checklist.ts` reads the list out of the instruction's own text, caps it at `MOST_PARTS = 10` because "a list longer than this is data rather than parts", quotes at most 80 code points of a part back, and requires every part to end `Done`, `Blocked (with the reason)` or `Skipped (with the reason)` before the run may end — the run harness enforces it and the module "only reads". The plan's routine is one `what` sentence and one `until_check`, so a routine written as a numbered list is a single unit and a run that does the first two steps and stops is indistinguishable from a complete one. The reference's own cap is the useful part: it stops a checklist from becoming a status ritual, which is the failure mode a naive implementation walks into. Size S for the reader and the cap, M if the harness enforces part closure. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/routine-checklist.ts:1-25] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:168] (observed, plan gap inferred)

3. **011-messaging-channels (child 004's queue and child 007's conformance proof).** The reference negotiates durability instead of assuming it: `DeliveryDurability` is `Required`, `BestEffort` or `Disabled`; `negotiate_delivery_durability` downgrades to best effort when the payload's required capabilities are missing (text needs text support, replies need reply support, threads need thread support); and the doc states the limit plainly — "A capability declaration is the provider's statement, not proof of behavior", with the advice to claim `Required` only where conformance coverage verifies enqueue ordering, retries and unknown-send reconciliation. The plan's queue is already stronger on the failure that matters most (REQ-013: an exclusive-flag entry before the I/O, forward-only states, `unknown` never retried, the backoff ladder lifted from `policy.rs:11`), so the additive part is the *negotiation*: the plan's capability is a static per-channel column (`buttons: yes` in a descriptor table) and there is no path where a transport that has lost a capability downgrades a send instead of failing it. Size S: one `durability` field on the queue entry and one downgrade rule with a refusal name. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/docs/channel-delivery.md:17-40] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md:130] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md:135] (observed)

4. **011-messaging-channels (child 007).** `tinychannels-conformance` is a reusable kit rather than a test list: it exports `AdapterFixture` (with `capabilities()`), and a provider test implements it by invoking the concrete adapter against that provider's mocked platform, so the kit "compares those observations with the adapter's declared capabilities and configured scope" and "never substitutes a synthetic transport for the provider fixture". That is what makes a five-transport × five-rule matrix 25 observations with one comparison rather than 25 copies, and it also catches the case finding 3 describes — a declaration that disagrees with behaviour — because the fixture is the real adapter. The plan's 007 child already names "one capability-matrix driver", so this is confirmation of its shape rather than a gap; the additive detail is the *prohibition*: the kit must not substitute a synthetic transport, which is the shortcut that would make the matrix pass while the real adapter breaks. Size 0 (a constraint on the existing driver). [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:1-12] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:299-324] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/spec.md:3] (observed)

5. **011-messaging-channels, net-new candidate: provider breadth is not worth copying.** The reference ships fifteen providers (DingTalk, Discord, Email, iMessage, IRC, Lark, Linq, Mattermost, QQ, Signal, Slack, Telegram, WhatsApp, WhatsApp Web, Yuanbao) behind one adapter contract. The plan's five transports (Telegram, Slack, Signal, WhatsApp, terminal) cover a small team's actual channels; the three that could plausibly matter later are Email (a digest as a message), Discord and IRC, and none of them carries a capability the plan's adapter contract cannot express. Ranked low, size S each, and the honest recommendation is *no build* until a team asks. Recorded so the fifteen-provider table is not mistaken for parity debt. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/docs/channel-providers.md:1-28] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:167-178] (observed)

## Ruled Out

- **Finding a duplicate-send gap in the plan's queue.** There is none: REQ-013 already records an uncertain or orphaned `sending` entry as `unknown`, never retries it, writes the state to the run record, and prints M21, with an acceptance criterion that names the exact test. The reference's queue state machine is the same shape, so the comparison confirms the plan and produces no finding.
- **Claiming the plan lacks an inbound dedupe story.** REQ-006 resolves a press or reply with no approval-index entry through `answerItem`'s existing answered-or-expired row, which is what "a second press, a redelivery after a crash and the second chat of a two-target bot" reach. That is a dedupe path, so no gap.
- **Reading OpenBot's routine UI tests** (`routine-plan.test.ts`, `new-routine-form.test.tsx`, `routine-edit.test.tsx` and eleven more) for phase 002. They test a React routine editor the plan deliberately does not build — `bots routines` is a list — so their evidence would land on a surface 003 declined.
- **Comparing the reference's legacy `Channel` API against its v2 `ChannelAdapter`.** The README says the legacy surface "remains for source compatibility and is not the production factory path", which is a two-contract lesson the plan already avoids by defining one adapter contract (REQ-001). Nothing to add.

## Dead Ends

- `find` over `tinychannels` for `*.ts` returned 0 lines and a `wc` of 0, which is not a fact about the repo: the crate is Rust (`crates/tinychannels-*`), so the TypeScript search found nothing. Recorded so a later iteration does not repeat it as a content claim.
- OpenBot's `shared/routine-firing.ts` continues past line 30 with the reader half (`readFiring`) and more failure notes; only the frame's declaration was read. The reader's stripping rule is not claimed here.

## Edge Cases

- **Contradictory evidence:** none. The reference's queue and the plan's queue agree; where the plan is better, that is stated as confirmation rather than as a finding.
- **Ambiguous input:** the topic's "which failures, tests and fixes in those repos the plan does not yet guard against" could be read as *test files* or as *failure notes in code*. The selected reading is the failure notes, because the module doc states the live failure and its fix in one place; a test name alone says what is asserted, not what broke.
- **Missing dependency:** none.
- **Partial success:** finding 5 is a negative finding (do not build) rather than new capability, and finding 4 confirms a plan decision instead of correcting it. Both are recorded because the topic asks for a ranking, and "no build" is a rank.

## Sources Consulted

- specs/system-skilled-bots/context/OpenBot-main/shared/routine-firing.ts:1-30
- specs/system-skilled-bots/context/OpenBot-main/shared/routine-checklist.ts:1-25
- specs/system-skilled-bots/context/tinychannels-main/README.md:1-40
- specs/system-skilled-bots/context/tinychannels-main/docs/channel-delivery.md:1-60
- specs/system-skilled-bots/context/tinychannels-main/docs/channel-providers.md:1-28
- specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:1-12,299-324
- specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:168-183
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:167-178
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md:138-143
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md:128-139
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/spec.md:1-13

## Assessment

- New information ratio: 0.80
- Questions addressed: phases 011 and 002, plus three negative findings that close comparison work
- Questions answered: none tracked; carried by findings

## Reflection

- **What worked and why:** reading the module doc comment before the code. `routine-firing.ts` and `routine-checklist.ts` both state, in prose, the live failure they were written for, and that prose is the most valuable artifact in the file — it is a *post-mortem with a line number*, which is exactly what "failures the plan does not guard against" asks for. The same reading found the plan's own confirmation: 002 REQ-006 already cites OpenBot's count-reset rule from `docs/routines.md:121`.
- **What did not work and why:** searching `tinychannels` for TypeScript found nothing because it is Rust; the mistake came from carrying the mental model of `openhuman-main`'s app tree into a crate-only repo. Cost: one wasted call. The second miss was expecting the conformance child to lack a matrix when it already names one — the plan is further ahead than a fresh gap hunt assumes.
- **What I would do differently:** check a repo's primary language from its `Cargo.toml`/`package.json` before choosing a search tool, and treat "the plan already does this" as a legitimate finding to record, because the topic's value is a ranked evidence base, not a defect list.

## Recommended Next Focus

004-computer-exposure and 005-memory together: read `turnstone`'s typed memory model and `OpenGhost`'s bounded memory against the plan's two memory files, then settle 004's working-place naming against OpenBot's `computer-start.ts` and the run record's worktree fields. Then 001-activity-and-actor with OpenBot's `activity-groups.ts` and `status-index.ts`, 009-skills with `OpenGhost/skills.js` and the `tinyagents-hooks` seam, and 010-conversations with openhuman's in-process chat surface.
