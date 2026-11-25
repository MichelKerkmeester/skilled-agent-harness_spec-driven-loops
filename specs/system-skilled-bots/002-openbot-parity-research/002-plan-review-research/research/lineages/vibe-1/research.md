# Build-Readiness Review of the Eleven Planned Phases: Research Synthesis

Canonical synthesis of one expansive `/deep:research` fan-out lineage (`vibe-1`, 13 iterations, `max-iterations` stop policy). The review covers the eleven phase packets of `specs/system-skilled-bots/003-openbot-parity-build` against the built runtime, against each other, against the parity research synthesis, and against the failure modes a small team will meet. Every claim cites `[SOURCE: path:line]`; a conclusion drawn from several sources is marked `[INFERENCE: ...]`. The 77 findings live in `findings-registry.json` and in `iterations/iteration-001.md` … `iteration-013.md`; this document ranks them, groups them by phase, and states the exact edit for each.

## 1. Executive Summary

The eleven phases are unusually well written for documents produced in parallel and alone. Each has a measured-behavior section, named refusals, a requirement table with ids, acceptance criteria that name a command, and an open-questions section that records the decision and its reversal condition. Read one at a time, every phase is buildable.

Read together, they are not yet build-ready. The review found **77 findings: 0 P0, 45 P1, 32 P2**. No finding makes a phase impossible to start, which is why nothing is rated P0. But nine findings make a phase's own acceptance criteria unpassable as written, and those are the real gate: a builder who follows the task list will reach a criterion that cannot go green and will have to invent the missing decision.

The failures cluster in four places, and none of them is a phase's own logic:

1. **The parent spec was not updated when the packet grew.** It still says ten phases, its Files to Change table omits every 011 surface, its notices owner list names two phases that have no notice task and omits two that do, and its Out of Scope forbids the `operators.json` that 011 builds [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:78,94,109].
2. **Shared records have no single owner.** Four phases edit `answer.ts`, four edit `buildBotPrompt`, two widen the same deep-loop environment gate in two different ways, four change a `--json` shape that one Rust fixture serves, and three add needs-you item writers that bypass the grant field [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:148].
3. **Two controls are inert as specified.** 007's per-bot app filter never reaches the MCP client because all four project configs pin the key to a relative path [SOURCE: .claude/mcp.json:9], and 011's approver roster gates a chat press but not `bots answer --as` because 011 never modifies the answer path it says it reuses [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:49].
4. **The one slice the research says can leak leaks in two places.** 008 accepts a keychain write that puts the value in `ps`-visible argv although `security` offers the prompting form, and its REQ-007 claims the value never reaches the run folder while the child's stdout is captured there [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:154,189].

The verdict: **fix the parent spec and the nine gate blockers first, then build.** The phases' internal quality means the repair is mostly editing, not redesign — 61 of the 77 findings are fixed by a sentence, a field, a refusal name or a task verify.

## 2. Review Question and Scope

The question: are the eleven planned phases of `003-openbot-parity-build` build-ready, judged against the built runtime, against each other, against the parity research, and against the failure modes a small team meets. Four angles:

1. **Plan versus runtime** — do the files, functions, records, fields and verbs each plan names exist with the shapes it assumes, and are its test and verify commands runnable here.
2. **Cross-phase consistency** — do the phases agree on shared records (`by:` actor, grants, `operators.json`, conversation JSONL, memory files, state-root layout, `HonoredPosture` fields, `bots --json` output), and are the build order and dependencies sound.
3. **Parity gaps and overbuild** — what is still missing after all eleven phases, and what is built that is not needed or duplicates another phase or the runtime.
4. **Security and failure modes** — secret leakage, token storage, spoofed chat users, who may approve, restarts, lost or duplicated messages and answers, concurrent approvals, prompt injection through memory, skills or chat, routine `until` and fatigue edges.

Out of scope: new design research, and any change to the phase documents. The output is a review, not a rewrite.

## 3. Method and Evidence Base

Thirteen iterations, each with a written focus, a delta, and a gateway-recorded state row. The frontier seeded one depth-1 node (cross-phase interfaces and order) which admitted four depth-2 children (approval contract, record and index extension, who may approve, verify commands) and one depth-3 child (memory injection). After the frontier drained, the remaining iterations took the lowest-coverage angle: parity gaps and overbuild, then the vault, the app filter, conversations, routines, the ladder, and the Rust crate.

Evidence, all read-only: the eleven phase packets (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`), the parent `spec.md`, the parity synthesis `specs/system-skilled-bots/002-openbot-parity-research/research/research.md`, the built runtime under `.skilled/skills/system-skilled-bots/runtime/lib/` and `.skilled/bin/bots.cjs`, the checker `scripts/bot-check.cjs`, the deep-loop `executor-audit.ts` and `executor-config.ts`, `.github/workflows/bots-runtime.yml`, `.utcp_config.json`, the four project MCP configs, and the macOS `security` man page.

Two corrections were made inside the run and are recorded rather than hidden: iteration 3 corrected iteration 2's claim that the executor env prefix machinery does not exist (it does, on the parent-env side, at `executor-audit.ts:307-317`), and iteration 9 corrected its own first hypothesis that 007 had modified the wrong allowlist (it had not; the parent-env path is the one it uses).

## 4. Verdict and Build-Readiness

**Not build-ready as written; repairable by editing.** The distinction matters: no phase needs a redesign, and the four largest defects are all in the parent document or in the seams between phases.

The nine gate blockers — findings that make a phase's own acceptance criteria unpassable:

| # | Phase | Finding | Why the criterion cannot pass |
|---|-------|---------|-------------------------------|
| 1 | 001 | AC-006 requires a notice for two lifted files while the plan allows writing the rule from research and dropping the entry | The artifact the criterion greps may not exist by design |
| 2 | 001 | The schema bump to `'3'` strands an existing index and the rebuild is not a requirement | `bots status` fails on an upgraded install |
| 3 | 006 | `THIRD_PARTY_NOTICES.md` is `Create` in four phases and the file does not exist | The second phase to land cannot create a file that exists |
| 4 | 007 | The filtered UTCP config never reaches the MCP client | SC-002 proves the file was written, not that the child read it |
| 5 | 008 | REQ-007 says the value never reaches the run folder while the child's stdout is captured there | The criterion cannot be satisfied by any implementation |
| 6 | 011 | The roster has no writer and no enforcement on the terminal path | REQ-005's check has no call site on `bots answer` |
| 7 | 011 | The parent's Out of Scope forbids the `operators.json` the phase builds | The phase contradicts its own parent |
| 8 | 002 | A second non-cron start is accepted and silently dropped | The phase's own standard is "refuse by name rather than ignore" |
| 9 | 013 | The crate fixture is a contract four phases change and one lists | 003's integration tests pass against shapes the runtime no longer emits |

## 5. Plan Versus Runtime

The plans are accurate about the runtime far more often than not. Every module a plan says it will modify exists, every refusal name it introduces is new, and the three verify commands that need a toolchain (`cargo`, `vitest`, `jq`) all run in this checkout — `cargo` and `rustc` are installed at `~/.cargo/bin` [SOURCE: which cargo rustc → /Users/michelkerkmeester/.cargo/bin/cargo].

Where the plans misread the runtime:

- **001's schema bump.** The record validator refuses a schema version it does not know, and 001 bumps to `'3'` while 004 requires `'2'` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:150]. The status index is built from those records, so the bump strands it.
- **003's `.opencode` mirror rows.** `.opencode/bin` and `.opencode/skills` are symlinks, so three phases' "Modify mirror" rows are no-ops and 003's `diff -q` definition of done is vacuous [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:147].
- **007's environment gate.** The phase adds `UTCP_CONFIG_FILE` to the common allowlist, which is the parent-env filter, and that is the correct gate for the path it uses [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1147-1160]. The finding is not the gate but that 008 uses a different one for the same problem.
- **008's keychain write.** The plan accepts a `ps`-visible argv exposure that `security` itself avoids: "`-w password` Specify password to be added. Put at end of command to be prompted (recommended)" [SOURCE: man security, add-generic-password, -w].
- **010's completed outcome.** The runner's `completed` outcome carries `runId` and `recordPath` and no text [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:208], so 010's task to add the answer text is real work, not a no-op.
- **013's fixture.** The crate's fake CLI is spawned as a program, and no task sets its executable bit; the task's own verify runs it through `bash`, so the task passes while the integration test fails on a fresh clone.

## 6. Cross-Phase Consistency

Four shared surfaces have no single owner, and each produces a finding:

**`answer.ts`.** Four phases edit it — 001 writes `by`, 006 records the scope, 008 adds the store's values to the literal check, 011 would add the roster check and does not [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:49]. No phase states the order, and 005 and 009 each add a "no resume" branch that must compose with the existing one.

**`buildBotPrompt`.** Four phases add a section — 004's working place, 005's memory, 009's skills, 010's transcript — and no phase states the order or the total budget. The per-source bounds are 7,200 bytes of memory, 65,536 of skills and 8,000 characters of transcript, so the largest legal prompt is about 80 KB with no refusal [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:161].

**The deep-loop environment gate.** 007 adds one key to the common allowlist, which admits it for every kind and every caller; 008 adds a prefix to the strict per-kind list, which admits a namespace. The file's own comment says the strict list "is therefore the only place that says which keys a caller may name" [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts:1494-1497]. Two mechanisms, two blast radii, no cross-reference.

**The needs-you item.** 006 adds `grants` at the runner's gate, and 002, 005 and 009 each add a writer that never passes through it, so the packet's own new items are the ones with a null grant [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:148].

The build order is sound in one direction and broken in another. Sound: 001 before 003 (the screen reads `activity --json`), 002 before 003 (the screen reads `routines --json`), 007 before 008 (the research lands the leaking slice last), 003 before 010 (the chat pane edits the crate). Broken: 003 ships an approval overlay before 006 defines the grant vocabulary, and 011 builds a roster that 006 explicitly defers to 001 and 001 does not build.

## 7. Parity Gaps and Overbuild

**Gaps.** The parity research's small-team model has four parts: no sign-in, an actor on every decision, two roles in one `operators.json`, and a shared host at mode 0770 [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:95]. The parent takes the actor and excludes the rest [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:94], 006 repeats the deferral, and 011 then builds the roster on the premise that "a shared host has one identity across several repositories" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:282]. The result is a roster for a host that cannot be shared: the state root stays 0700 [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/state-root.ts:46], so the `members` list names people who cannot read the queue, the records or the roster itself.

Two smaller gaps: the notices owner list is wrong in both directions, and no phase owns the total prompt budget.

**Overbuild.** 011 is the packet's largest phase at 60 tasks against a median of 34, and the only one outside the parent's ten-slice scope. It builds five transports where the research asked one open question about a single delivery channel [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/research/research.md:184], and two of the five need operator prerequisites the checkout does not have. Its `channel-terminal.ts` duplicates both 010's `bots chat` and 011's own fake transport. 008's `vault-policy.ts` answers a question `definition.ts` already answers, because `secrets:` stays one name.

## 8. Security and Failure Modes

**Secret leakage.** Two paths. The keychain write puts the value in argv, which any local user can read from `ps` during the window, and the phase accepts it although the prompting form exists. The child's stdout is captured to `runFolder/stdout.log` [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:1062], and the literal scan covers the body, the question, the answer and the request prompt but never the log [SOURCE: .skilled/skills/system-skilled-bots/runtime/lib/runner.ts:942-953].

**Token storage.** 011 reads the token at send time, but two transports need it before any send, and the Telegram token travels in the request URL with no redaction requirement.

**Spoofed chat users.** A channel answer records the host user rather than the person who pressed the button, the link lockout counts per chat rather than per actor, and the roster's absent-file default is unspecified, so the default is either fail-open or a lockout.

**Who may approve.** Authority is split three ways: 011 gates a channel answer on `owner` or `members`, 006's ladder has no actor input, and the terminal path has no check at all. Two answers to one item race, and the loser's answer is silently replaced because `answerItem` reads, checks and writes with no lock.

**Lost and duplicated messages.** An `unknown` send is never retried and never surfaced. A re-sent chat message duplicates in the transcript while the queue suppresses the second run. A parked chat run's answer never returns to the conversation.

**Prompt injection.** Three paths, in increasing order of persistence: memory entries land in the instruction region with no data framing while 009 wraps skill bodies in `<skill_content>`; the conversation transcript is fed as the request prompt with no role framing and includes bot-authored messages, so one injected reply is replayed on every later turn; and a bot declaring `danger-full-access` can append a fake human message to its own transcript.

**Routine edges.** A second non-cron start is silently dropped, the fatigue switch raises an item that holds the bot it just disabled, the `until` check runs in the checkout rather than the run's worktree, and the failure streak's treatment of a parked run is undefined.

**Approval classification.** The kind is classified from the question's first sentence, which the bot writes, so a benign first sentence makes a delete read as `other`.

## 9. Findings by Phase

Counts are findings, not severity-weighted. Every finding is in `findings-registry.json` with its id, and in the iteration file named.

| Phase | Findings | P1 | P2 | The two that matter most |
|-------|----------|----|----|--------------------------|
| parent `spec.md` | 6 | 5 | 1 | Ten phases versus eleven, and the Out of Scope that forbids `operators.json` |
| 001 activity and actor | 8 | 6 | 2 | The schema bump strands the index; AC-006 cannot pass under the plan's own fallback |
| 002 routine layer | 6 | 3 | 3 | A second non-cron start is silently dropped; the fatigue item holds the bot it disabled |
| 003 terminal screen | 9 | 4 | 5 | The crate is the first Rust toolchain with no CI toolchain step; the fixture is a shared contract |
| 004 computer exposure | 3 | 2 | 1 | It requires index schema `'2'` while 001 bumps to `'3'` |
| 005 memory | 7 | 4 | 3 | Memory entries land in the instruction region unframed; the proposal item cannot hold no bot |
| 006 approval grants | 8 | 4 | 4 | The kind is classified from a bot-authored sentence; the grant is missing from `inbox --json` |
| 007 per-bot apps | 6 | 2 | 4 | The filter never reaches the MCP client; two phases widen the same gate two ways |
| 008 vault | 8 | 4 | 4 | The value reaches `stdout.log`; the keychain write is `ps`-visible |
| 009 skills | 3 | 1 | 2 | Its `<skill_content>` wrapper is the pattern 005 and 010 do not follow |
| 010 conversations | 7 | 3 | 4 | A parked run's answer never returns; the transcript replays bot text as instruction |
| 011 messaging channels | 12 | 8 | 4 | The roster has no writer and no terminal enforcement; the token travels in the URL |
| cross-phase | 4 | 2 | 2 | Four phases edit `answer.ts` and `buildBotPrompt` with no stated order |

## 10. Ranked Findings

Ranked by what a builder hits first and what costs most if missed. The full text of each is in its iteration file.

1. **The parent spec still describes ten phases and forbids `operators.json`** (parent, P1). Every downstream reader trusts it. Fix the scope list, the phase table, the Files to Change table and the Out of Scope in one edit.
2. **001's schema bump strands the status index** (001, P1). An upgrade breaks `bots status` for every existing install, and the rebuild is not a requirement.
3. **011's roster has no writer and no terminal enforcement** (011, P1). The phase builds a record nothing can create and nothing reads on the path that matters.
4. **007's app filter never reaches the MCP client** (007, P1). The phase's purpose is not delivered, and its own Out of Scope presents removing the pins as the only alternative.
5. **008's value reaches `stdout.log`** (008, P1). The requirement claims the opposite, so the criterion cannot be satisfied.
6. **008's keychain write is `ps`-visible** (008, P1). The exposure is avoidable with the tool's own prompting form.
7. **The approval kind is classified from a bot-authored sentence** (006, P1). The operator is told `other` about a delete.
8. **The conversation transcript replays bot text as instruction** (010, P1). One injected reply persists for the life of the conversation.
9. **A parked chat run's answer never returns** (010, P1). The one outcome that needs a person is the one the person cannot see.
10. **The fatigue switch holds the bot it disabled** (002, P1). The documented recovery path does not recover.
11. **A second non-cron start is silently dropped** (002, P1). The phase's own standard is to refuse by name.
12. **The notices owner list is wrong in both directions** (parent, P1). Two phases are named that have no task, two are omitted that have one, and four label the same absent file `Create`.
13. **The shared-host mode is excluded and built by nobody** (parent, P1). The roster's premise is false.
14. **Two phases widen the same gate two ways** (007/008, P2). One mechanism should serve both.
15. **The crate fixture is a contract four phases change and one lists** (003, P1). The screen's tests pass against shapes the runtime no longer emits.
16. **`bots ui` assumes a source checkout** (003, P1). A packaged install has no crate.
17. **The prompt budget is bounded per source and never in total** (cross-phase, P2). About 80 KB with no refusal.
18. **Three item writers bypass the grant** (cross-phase, P2). The packet's own new items are the ones with no grant.
19. **The `until` check runs in the checkout** (002, P2). It cannot see what the run produced.
20. **The filtered copy relocates a relative dotenv path** (007, P2). The same config means two files.

The remaining 57 findings are P2 polish: refusal names, verify commands, doc rows, edge cases and one duplicated module. They are listed by phase in §9 and stated in full in the iteration files.

## 11. Cross-Phase Conflict List

Seven conflicts, each with the two documents that disagree and the resolution the review recommends.

| # | Conflict | Side A | Side B | Resolution |
|---|----------|--------|--------|------------|
| 1 | Ten phases or eleven | Parent In Scope names ten slices [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:78] | The phase table and the directory list eleven | Add 011 to the In Scope list and record the operator decision that added it |
| 2 | `operators.json` in or out | Parent Out of Scope: "No child builds them" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:94] | 011 builds it and says so [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:281] | Move the roster into scope and assign it to 011, or drop it from 011 |
| 3 | Who owns the notices file | Parent names 001, 002, 008, 009, 010 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:109] | The tasks are in 001, 006, 008, 010, 011 | Parent names 001, 006, 008, 010, 011; 001 creates, the rest modify |
| 4 | Where the approver check lives | 011 REQ-005 puts it in `channel-link.ts` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:177] | 006's ladder has no actor input, and `answer.ts` is unmodified | One check in `answer.ts`, called by both surfaces |
| 5 | The answer grammar | 003 free text, 006 `--scope`, 011 numbered or YES/NO | One item, three grammars | One grammar in the item, rendered per surface |
| 6 | The record schema version | 001 bumps to `'3'` | 004 requires `'2'` [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:150] | One bump, owned by 001, with the index rebuild as a requirement |
| 7 | The crate fixture | 003 creates it with canned JSON per verb | 001, 002, 006 and 010 change those shapes; only 010 lists it | Every phase that changes a `--json` shape updates the fixture |

## 12. What Is Missing After All Eleven Phases

1. **A shared host.** The state root stays 0700, no phase changes it, and 011's roster assumes otherwise. A second operator cannot read the queue, the records or the roster.
2. **A total prompt budget.** Three phases bound their own section and none bounds the sum.
3. **A roster writer.** 011 creates `operators.json` and no verb writes it.
4. **A terminal-side approver check.** The roster gates a chat press and not `bots answer --as`.
5. **A post-run secret scan.** The child's stdout is captured and never scanned.
6. **A migration statement for `apps:`.** A bot outside this repository silently loses every server on upgrade, and the checker has no advisory for it.
7. **A packaged-install path for the screen.** `bots ui` resolves a binary inside the source tree.
8. **A conversation answer path.** A parked chat run's answer never returns to the transcript.

## 13. What Is Overbuilt

1. **011's five transports.** Telegram, Slack, Signal, WhatsApp and a terminal transport, 60 tasks, two of them needing prerequisites the checkout lacks, where the research asked one open question about a single channel.
2. **011's `channel-terminal.ts`.** It duplicates 010's `bots chat` and 011's own fake transport, and no test needs it.
3. **008's `vault-policy.ts`.** It answers a question `definition.ts` already answers, because `secrets:` stays one name.
4. **003's approval overlay before 006.** The screen draws a grant vocabulary four phases before the vocabulary exists.
5. **The `.opencode` mirror rows.** Three phases list a file edit that is a no-op because the tree is symlinked.

## 14. The Exact Spec Edits

Every finding carries its edit in its iteration file. The edits that touch more than one document, and so must land together:

1. **Parent `spec.md`** — add 011 to the In Scope list at line 78; move the shared-host mode into scope at line 94 or drop 011's premise at line 282; correct the notices owner list at line 109; add 011's surfaces to the Files to Change table; assign the total prompt budget to 001.
2. **001** — make the index rebuild a requirement beside the schema bump; make AC-006 conditional or keep the notice under the fallback; add `grants` to the inbox JSON; add the crate fixture to Files to Change.
3. **002** — refuse a `starts` list with more than one entry; give the fatigue item a reserved id that does not hold the bot; run `until` in the run's working directory; define the streak's parked case.
4. **003** — name the CI toolchain action and strengthen T024's verify; set the fixture's executable bit; refuse `ui-unavailable` when the crate is absent; state that the fixture is the copy of every `--json` contract.
5. **005, 009, 010** — wrap memory entries and the transcript in a data block the way 009 wraps skill bodies; add the grant to each new item writer.
6. **006** — classify the whole question and prefer a structured `[ACTION: kind]` line; add `grants` to `inbox --json`; key the conversation scope to a conversation id.
7. **007** — write the filtered config at the pinned path in the worktree and refuse `apps-unenforceable` without one; rewrite `env_file_path` to an absolute path; add the `apps-absent` advisory; use the same gate mechanism as 008.
8. **008** — use `security`'s prompting form; scan `stdout.log` after the run; replace the prefix widening with a per-dispatch key list; fold `vault-policy.ts` into `secrets.ts`; define the piped stdin path.
9. **011** — add `answer.ts` to Files to Change with the roster check; cut Signal and WhatsApp or record the operator decision; drop `channel-terminal.ts`; redact the Telegram token from the URL; give the approval index an expiry.

## 15. Recommended Gates and Build Order

**Gate 0 — the parent edit.** Land the parent `spec.md` corrections before any phase starts. Every phase reads it, and three of the seven conflicts are resolved by that one file.

**Gate 1 — the shared records.** Land 001's schema bump with the index rebuild, the `answer.ts` and `buildBotPrompt` section order, and the one environment-gate mechanism. These are the seams four phases each touch.

**Gate 2 — the leaking slices.** 007 and 008 land after the gate above and before 011, with the worktree-local config write and the post-run stdout scan in place.

**Gate 3 — the surfaces.** 003, 010 and 011 land last, in that order, with the fixture updated by each phase that changes a `--json` shape.

The build order the parent states is otherwise sound and needs no change: 001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 011.

## Eliminated Alternatives

| Approach | Why it was not taken |
|----------|----------------------|
| Rate the packet P0 and stop | No finding makes a phase impossible to start, so a P0 would have overstated the case and hidden the nine gate blockers inside one label |
| Review each phase in isolation and report per phase | The four largest defects are in the parent and in the seams, so a per-phase review would have found none of them |
| Re-derive the parity research | The synthesis already carries the per-repo evidence with citations; every claim here resolved against the packet and the runtime instead |
| Run the runtime suite to prove the verify commands | It writes temporary state roots outside this lineage's write surface, so the entry points and the installed binaries were verified instead |
| Treat the parent's tables as authoritative | They disagree with five of the eleven phases, so the phases are the evidence and the tables are the defect |
| Read the reference repos again for the parity angle | The synthesis's §12, §14 and §15 are the distilled evidence, and re-reading eight repos would have spent the budget on material already cited |

## Divergence Map

- **Saturated directions:** none. No direction was retried to exhaustion; each iteration took a new surface.
- **Pivots taken:** one. After the frontier drained at iteration 6, the run pivoted from frontier-driven depth to angle-driven breadth (parity gaps, then vault, apps, conversations, routines, ladder, crate).
- **Pivot failures:** none. The breadth pivot produced 30 of the 77 findings.
- **Audited overrides:** two self-corrections, both recorded in the iteration that made them (iteration 3 on the executor env prefix machinery, iteration 9 on which allowlist 007 modifies).
- **Remaining frontier:** none open. F-1-003 and its four children are answered; F-3-008 closed at the depth cap.
- **Disagreements carried into the ranking:** whether 011 belongs in the packet at all (the review says it is out of the parent's scope and overbuilt, and records the operator decision as the missing authority), and whether the shared-host mode should be built now or deferred (the review says 011's roster cannot work without it).

## 16. Open Questions

1. **Does 011 belong in this packet?** The parent says ten slices, the directory has eleven, and 011's own open questions record the conflict without resolving it upward. The review recommends either adding it to the parent's scope with the operator decision named, or moving it to its own packet.
2. **Should the shared-host mode land in 001 or in a twelfth phase?** The research calls it "the whole change" and the parent excludes it. 011 cannot work without it, so the choice is between widening 001 and adding a phase.
3. **Which transport set does a small team actually need?** The review recommends Telegram, Slack and the terminal; the phase builds five. The operator decision that would settle it is not recorded anywhere in the packet.
4. **Should the approval kind be structured or inferred?** A `[ACTION: kind]` line is precise and asks the bot to declare; classifying the whole question is inference and cannot be spoofed by sentence order alone. The review recommends both, with the structured line preferred.
5. **What is the total prompt budget?** The review proposes 96,000 bytes with a named refusal; no phase states a number, and the largest legal prompt today is about 80 KB.
6. **Does the screen ship to packaged installs?** `bots ui` resolves a binary inside the source tree. Either the crate ships in the package or the verb is documented as source-only.

## 17. Convergence Report

- **Stop reason:** `maxIterationsReached`. The stop policy was `max-iterations`, so convergence was telemetry only and the run ended at its budget rather than at saturation.
- **Iterations:** 13 of 13. No iteration failed, timed out or was recorded as stuck.
- **Findings:** 77 (0 P0, 45 P1, 32 P2), all with a source or inference citation, all with a severity and an exact edit.
- **Questions:** 6 seeded and 6 answered; 10 carried-forward questions opened during the run and all resolved inside it; 0 open at close.
- **Convergence score:** 0.88, above the 0.05 threshold, which is expected for a review that kept finding new surfaces rather than re-confirming old ones.
- **New-information ratios:** 0.92, 0.90, 0.85, 0.80, 0.85, 0.92, 0.83, 0.90, 0.88, 0.80, 0.88, 0.75, 0.88. The two lowest are the two iterations that extended an earlier finding rather than opening a surface (iteration 12 on the ladder, iteration 10 on conversations).
- **Source coverage:** 132 code and runtime citations, 11 document and tool citations. Every finding resolved to a file and a line; no finding rests on a single web source.
- **Corruption:** 0. The gateway recorded 14 ledger events (one run-open plus 13 iterations) and the reducer rebuilt the registry, dashboard and strategy after each.
- **Divergence:** one pivot, no failed pivots, two self-corrections recorded in place.

## References

- Iteration evidence: `iterations/iteration-001.md` … `iteration-013.md`, and `deltas/iter-001.jsonl` … `iter-013.jsonl`
- Registry and dashboard: `findings-registry.json`, `deep-research-dashboard.md`, `deep-research-strategy.md`
- Reviewed packet: `specs/system-skilled-bots/003-openbot-parity-build/spec.md` and the eleven phase directories
- Parity research: `specs/system-skilled-bots/002-openbot-parity-research/research/research.md`
- Runtime compared: `.skilled/bin/bots.cjs`, `.skilled/skills/system-skilled-bots/runtime/lib/`, `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`
- Repository surfaces: `.github/workflows/bots-runtime.yml`, `.utcp_config.json`, `.claude/mcp.json`, `.codex/config.toml`, `opencode.json`, `.cursor/mcp.json`
- Tool contract: `man security`, `add-generic-password`, `-w`
