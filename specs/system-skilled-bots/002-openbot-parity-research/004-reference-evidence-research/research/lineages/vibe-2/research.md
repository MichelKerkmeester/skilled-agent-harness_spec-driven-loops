# Reference evidence for the OpenBot parity build

Ten iterations of reference evidence over the ten repos under `specs/system-skilled-bots/context/`, answering two questions: which reference files implement what each of the fourteen 003 phases plans, and what the ten repos have that neither the plan nor the section-13 skip list covers.

Every claim carries a `[SOURCE: path:line]` and is marked *(observed)* when the line was read or *(inferred)* when it follows from a line. A finding one of the three earlier syntheses already carries is cited and not repeated. Findings that fit no phase are under **Net-new**.

**The licence table decides what may be copied, and it is the first thing to read.** Seven of the ten repos are permissive and three are GPL-3.0: OpenBot MIT, OpenGhost MIT, hermes-muse MIT, OpenMausBot Apache-2.0, rakazo Apache-2.0, turnstone Apache-2.0, buzz Apache-2.0, and openhuman-main, openhuman-full and tinychannels-main all GPL-3.0. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/OpenGhost-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/hermes-muse-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/rakazo-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/turnstone-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/buzz-main/LICENSE:1] [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/LICENSE:1-2] *(observed)* The copyleft surface is three repos and not one, and it includes `tinychannels`, whose approval surface 011 mirrors most closely. The build spec's §14 reuse rule names MIT and Apache-2.0 only and has no row for a copyleft source. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:84] *(observed)*

**`openhuman-full` is the repo no earlier run studied, and it is `openhuman-main` plus a vendor tree.** It carries 21 vendored crates, not the five the topic names, and every one is GPL-3.0. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/] *(observed)* It differs from `openhuman-main` only by `vendor/` — 21,332 files against zero, with every other top-level directory identical — and `openhuman-tui` is in both trees, so the built TUI crate is not a `openhuman-full` addition. [SOURCE: specs/system-skilled-bots/context/openhuman-full/] [SOURCE: specs/system-skilled-bots/context/openhuman-main/] *(observed)* The vendor tree's value is that it holds the crate sources the plan's 005, 006, 009 and 011 mirror, and its licence is why none of them may be copied.

---

## 001-activity-and-actor

**What the reference implements.** `OPENBOT_WORKING_EVENT_TYPES` names six event types that are working rows rather than changes, and the plan has no row-level exclusion. `CALLS_RECORDED_AS_CHANGES` drops a call row only when the call succeeded, which is the dedupe rule the plan lacks. `oneRowPerAction` means the same rows are counted twice under two names. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/activity.ts] *(observed)*

**What to lift.** The six-type exclusion list and the succeeded-only dedupe. Both are MIT. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/LICENSE:1] *(observed)*

**Where the plan differs, and which side the evidence supports.** The reference orders working rows first and the plan sorts by `botId`; the reference's order is the one a person reading a trail wants. The plan's `until_check` is its own improvement over the reference. The reference projects an event log where the plan projects a status index, and the plan's index is the stronger read path for a CLI.

**What the plan does not guard against.** A bot that hangs produces no row at all, because every other audit row is something that happened. The reference's `AGENT_STALL_TIMEOUT_MS` watches for exactly that absence and writes `agent.stream_stalled` when a turn ends without producing anything. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md:190-194] *(observed)* See **Net-new rank 2**.

## 002-routine-layer

**What the reference implements.** A refused-schedule routine is persisted and paused rather than dropped, and a routine is edited by conversation rather than by a verb. The reference caps a `does: tell` routine at 24 check-ins a day where the plan's deferral leaves it at 96. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/routines.ts] *(observed)*

**What to lift.** The 24-a-day cap and the persist-and-pause rule. MIT. *(observed)*

**Where the plan differs, and which side the evidence supports.** The plan's `until_check` is its own improvement. The plan's verb-based edit is the stronger surface for a headless CLI, and the reference's conversational edit is what a person wants once 010 lands.

**What the plan does not guard against.** A routine due behind a busy target. The reference stamps it `deferredAt` while it stays queued and dispatches it when the target frees; the plan has no `deferredAt` field and no busy-target rule, and its only occurrence of the word is the P1 priority label. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:41] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:175] *(observed)*

## 003-terminal-screen

**What the reference implements.** `openhuman-tui` is a ratatui client with one module per surface — `cockpit.rs`, `activity.rs`, `event_view.rs`, `composer.rs`, `controls.rs`, `actions.rs`, `presentation.rs` — and a `*_tests.rs` beside every module. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/] *(observed)* The plan's 003 already follows its layout, tabs, approval banner, overlay and command palette, and lists the demo binary, the bench flag and the theme picker out of scope by name. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md:104,115] *(observed)*

**What to lift.** Nothing by copy: the crate is GPL-3.0-only and the plan's tree is MIT. [SOURCE: specs/system-skilled-bots/context/openhuman-main/LICENSE:1-2] *(observed)* The layout is a design reference and the plan already treats it as one.

**Where the plan differs, and which side the evidence supports.** The plan's four tabs against the reference's seven modules is a scope choice, and the plan's is right for four surfaces.

**What the plan does not guard against.** A panic in the screen. The reference's terminal binary reports its own crash through the host's shared chain — "the same noise filters, secret scrubbing, PII-off defaults and transport as the CLI and the desktop shell" — and keeps the call site so a build without the feature still compiles to a no-op. [SOURCE: specs/system-skilled-bots/context/openhuman-main/crates/openhuman-tui/src/crash_reporting.rs:1-16] *(observed)* The plan's 003 has no crash reporting, so a panic leaves a dead terminal and no record.

## 004-computer-exposure

**What the reference implements.** "Computer" means a browser container in the reference and a working place in the plan, which is the largest single vocabulary difference in the packet. `resumeSnapshotRequired` re-checks a snapshot on resume where the plan refuses outright, and `keepsPage` is the restart-recovery rule the plan lacks. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/computer.ts] *(observed)*

**What to lift.** `keepsPage`, and the re-check shape of `resumeSnapshotRequired`. MIT. *(observed)*

**Where the plan differs, and which side the evidence supports.** The plan's refusal on a missing snapshot is the safer default and the reference's re-check is the friendlier one; for a single-operator host the plan's is right.

**What the plan does not guard against.** A restart that loses the page without saying so. `keepsPage` is the one-line rule that makes the loss visible.

## 005-memory

**What the reference implements.** tinymemory compiles a token-budgeted `context.md`, which is the plan's byte bound reached independently, and it fixes memory scope at the host rather than at the bot. It ships a `conformance` suite and an in-memory reference engine, and the plan has neither. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinymemory/README.md:33-36] *(observed)*

**What to lift.** The conformance-suite shape and the in-memory reference engine. GPL-3.0, so the shape only. *(observed)*

**Where the plan differs, and which side the evidence supports.** `LearningSettings.agents` is three-state in the reference — missing inherits, null excludes — and a boolean in the plan, which is right for a file with no inheritance chain. The reference approves a memory proposal without review by default and the plan raises a needs-you item; the plan is right, because a memory entry is read into every later prompt as an operator-confirmed fact.

**What the plan does not guard against.** Nothing new. The plan's child-marker refusal closes the bot-writes-memory hole the reference leaves open. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:148] *(observed)*

## 006-approval-grants

**What the reference implements.** A fixed precedence order — kinds of action, then rules, then auto-review, then extra vigilant, first answer wins — and four answers per card. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:3-13,20-27] *(observed)* tinysecurity's `ApprovalGrants2` carries the non-override rules: a denial, a Cron effect, a reviewed reuse and a human-only tool are never overridden, and names are never wildcards. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinysecurity/crates/] *(observed)*

**What to lift.** The ladder's order, which the plan already writes as a doc with rungs 2 to 4 marked not implemented. MIT for the ladder, GPL-3.0 for tinysecurity's rules, so the rules are read and not copied.

**Where the plan differs, and which side the evidence supports.** The plan offers `--scope once|deny` and the reference offers four answers — and the reference records that it once shipped exactly the plan's two-answer model and reversed it: "This reverses [#998](https://github.com/CopilotKit/OpenBot/pull/998), which made deleting, sending, sharing and posting ask every time with Allow once and Deny only ... OpenBot opens these by default; closing them is the organization's call." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:57-59] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/006-approval-grants/spec.md:30] *(observed)* The evidence does not support the plan's two-answer model. The plan's scope boundary rightly defers the rules store, the auto-review and the extra-vigilant switch, but the conversation scope is not a rules store and is the one answer in reach.

**What the plan does not guard against.** Three things. A conversation answer is bounded by four facts — "the same Bot, the same tool, the same place and the same account. It doesn't reach another conversation, another Bot or another tool" — and the plan's grant has no place to record them. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:24] *(observed)* A task started from a check-in asks before every change whatever the rules say, and the plan has no run-origin override. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:17] *(observed)* A human-only credential card offers "I did it myself" and "Don't do it" rather than an approval, and the plan has no such card shape. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/approvals.md:52-55] *(observed)*

## 007-per-bot-apps

**What the reference implements.** A component catalogue with separate per-bot grants, where a component is drafted, previewed and published, and "only published code renders in conversations and the administrator's gallery; invalid JSON blocks saving and publishing". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md:182-186] *(observed)*

**What to lift.** The draft-preview-publish lifecycle. MIT. *(observed)*

**Where the plan differs, and which side the evidence supports.** The plan's `apps:` grants a bot a set of connector servers by name with no lifecycle. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:63] *(observed)* The reference's lifecycle is what makes a grant reviewable before it takes effect, and it is the same staged-write shape 009's `revisionRead` already uses — so the plan has the pattern and has not applied it here.

**What the plan does not guard against.** Generated UI that inherits the host's session. The reference runs generated HTML "without the app's session or same-origin access to its data" and lets a deployment disable CDN loading. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/docs/configuration.md:188-189] *(observed)* The plan has no generated-UI surface, so this is a rule to record rather than a gap to close.

## 008-vault

**What the reference implements.** rakazo's secret store gates a placeholder bypass behind `isDevSecretAllowed`, refuses to echo a secret in an error through `secretAnswerRefusal`, and bounds its matcher at `MAX_SECRET_MATCHER_STATES = 1_000_000` with `BUILD_COST = 8`. [SOURCE: specs/system-skilled-bots/context/rakazo-main/] *(observed)*

**What to lift.** The error-echo refusal and the matcher bound. Apache-2.0. *(observed)*

**Where the plan differs, and which side the evidence supports.** The plan fails closed on every surface, which is stronger than rakazo's env-gated bypass. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md] *(observed)* The plan is right.

**What the plan does not guard against.** Nothing new. Iterations 1 and 3 closed this phase.

## 009-skills

**What the reference implements.** tinyskills parses YAML frontmatter with scalar or sequence `allowed-tools`, resolves a name across five scope roots, bounds a resource read by traversal, symlink, size and UTF-8, and pins an installed document by `document_digest`. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:27-45] *(observed)*

**What to lift.** The `allowed-tools` declaration and the symlink refusal. GPL-3.0, so the shape only. *(observed)*

**Where the plan differs, and which side the evidence supports.** The plan resolves one name against one tree and refuses `skill-unknown`, which is right: a five-root precedence ladder is a multi-root product's problem. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161] *(observed)* The plan's `revisionRead` hashes the bytes as read where the reference hashes a rendered document, and the plan's is the correct choice. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:164] *(observed)*

**What the plan does not guard against.** Two things, and the first is the strongest gap in the packet. The reference's `scan_skill` blocks invisible and bidi code points, hard-coded credentials and escaping resource paths, and warns on agent-addressed text and fetch-and-exec pipelines; the plan scans only the draft for secret literals and never scans a loaded body, so a bidi override in a skill body goes straight into the prompt as instructions. [SOURCE: specs/system-skilled-bots/context/openhuman-full/vendor/tinyskills/README.md:38] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:173] *(observed)* Second, a symlinked `SKILL.md` is not refused, so the byte cap measures the wrong file.

## 010-conversations

**What the reference implements.** A conversation is a front for a task thread: `delegate` hands work into a thread of the bot's own, and `link_to_thread`, `follow_up` and `stop` find, extend and stop it. [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/orchestration.ts:11-27] *(observed)*

**What to lift.** The retirement rule: `react` is documented as "The tool a Bot once reacted to the person's message with ... A Bot now answers in words in a conversation and is offered no such tool; the name stays so a transcript still draws the reactions and the calls from before." [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/orchestration.ts:16-21] *(observed)* MIT. *(observed)*

**Where the plan differs, and which side the evidence supports.** The plan's conversation is the run and the reference's survives the work. The plan is right for a headless CLI, and its own Problem Statement names the limit. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/010-conversations/spec.md:56] *(observed)*

**What the plan does not guard against.** A prompt leak. The reference makes its conversation section "conditional on holding the tool, because the task thread's own turn reads the same prompt and holds no such tool, and a routine or a check-in is offered none". [SOURCE: specs/system-skilled-bots/context/OpenBot-main/shared/orchestration.ts:42-44] *(observed)* The plan adds the section to the one prompt builder that 002's routine runs also read, so a routine's prompt would tell a bot to answer a person who is not there. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:168] *(observed)*

## 011-messaging-channels

**What the reference implements.** `tinychannels` owns durable outbound delivery with a three-mode `DeliveryDurability` that downgrades to best effort when required capabilities are missing, a shared 24-case conformance matrix, and an approval surface that routes a prompt back to the chat the turn came from. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/docs/channel-delivery.md:19-36] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/docs/channel-capabilities.md:24-28] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:1-90] *(observed)*

**What to lift.** The rule that a capability declaration is not proof of behaviour: "Use required durability only when conformance coverage verifies enqueue ordering, retries, and unknown-send reconciliation for the relevant payload and address shape." [SOURCE: specs/system-skilled-bots/context/tinychannels-main/docs/channel-delivery.md:33-36] *(observed)* GPL-3.0, so the rule only.

**Where the plan differs, and which side the evidence supports.** The plan's durable queue is unconditional, which is right for five transports it owns. Its 25 conformance cases against the reference's 24 put it at parity and one ahead, and its `buttons` and `numberedReply` keys split the reference's single `chat_approvals` flag at finer grain. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/spec.md:126] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/capabilities.md:37-38] *(observed)* The plan's refusal of an unlinked chat at the gate is earlier than the reference's `NoReplyContext` timeout-denied path. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:44-47] *(observed)*

**What the plan does not guard against.** Its durability claim rests on one payload shape, the 5,000-character Telegram send, where the reference demands a shape per payload. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/acceptance-criteria.md:58] *(observed)* And its intent-to-capability derivation is prose rather than a table a test can read.

## 013-manual-testing-scenarios

**What the reference implements.** `buzz-main/TESTING.md` is a 452-line operator runbook: a numbered procedure with copy-pasteable commands and expected output, a configuration reference and a troubleshooting section. [SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:231-260,405,439] *(observed)*

**What to lift.** The silent-failure warning beside a step: "Skip this and the agent boots to \"discovered 0 channel(s) → agent will sit idle\" and silently ignores every mention." [SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:344-345] *(observed)* Apache-2.0. *(observed)*

**Where the plan differs, and which side the evidence supports.** The plan's scenario table with a `PASS` or `FAIL` verdict and saved evidence is the stronger shape for 25 or more scenarios; the reference's numbered procedure is the stronger one for a first run. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/spec.md:66] *(observed)*

**What the plan does not guard against.** Three things. A precondition is an index-level list, not a named failure mode, so a scenario that runs with a missing precondition and still prints `PASS` is the gap. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/spec.md:194,255] *(observed)* No rule stops a scenario destroying operator state, and 008's vault and 005's memory are exactly the stores a scenario would wipe. [SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:55] *(observed)* No field records a `FAIL`'s cause, so a second run repeats the diagnosis.

## 014-skilled-and-doc-alignment

**What the reference implements.** `buzz-main` keeps a 135-line domain glossary with 13 `_Avoid_:` lines naming the wrong words, symlinks its second agent-instruction name to the first, and gates its dependencies through a `deny.toml` allowlist where every exception carries a `reason`. [SOURCE: specs/system-skilled-bots/context/buzz-main/CONTEXT.md:1-3,19] [SOURCE: specs/system-skilled-bots/context/buzz-main/CLAUDE.md:1] [SOURCE: specs/system-skilled-bots/context/buzz-main/deny.toml:1-8] *(observed)*

**What to lift.** All three. Apache-2.0. *(observed)*

**Where the plan differs, and which side the evidence supports.** The plan's doc-alignment topic carries a `terms` list, which says which words to find; only a glossary says which word is wrong, so the plan's run can pass while a doc uses a retired name. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment/spec.md:41] *(observed)*

**What the plan does not guard against.** The licence gate. The plan's only one is 003-terminal-screen's AC-006, which greps the design docs, and the packet's own review records that "It never reads `context/`, so it passes the same with or without it ... AC-006 proves nothing about the reference sources." [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/context-manifest.md:688] *(observed)* Thirteen of fourteen phases have no licence gate at all, and the packet's strongest 006 evidence comes from a GPL-3.0 crate. This is the highest-value 013 finding.

## 015-deep-review

**What the reference implements.** A review-derived test standard: "Regression tests must bind the production seam and be falsifiable. A guard whose removal doesn't fail any test protects nothing — mutations survived the full mobile suite twice (PRs #6996, #7013)." It names its anti-patterns with the pull request that proved each, and it is "Mined from the last 25 PRs' review threads". [SOURCE: specs/system-skilled-bots/context/buzz-main/TESTING.md:19-33] *(observed)*

**What to lift.** The falsifiability rule and the anti-pattern list. Apache-2.0. *(observed)*

**Where the plan differs, and which side the evidence supports.** The plan seeds every review-input row before any lineage spawns, which is stronger than the reference's after-the-fact mining. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/spec.md:188] *(observed)*

**What the plan does not guard against.** A test that asserts nothing. The plan's only mention of a guard is the suite and the validator as a guard against a wrong fix, so a test that never could fail passes the review. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/spec.md:288] *(observed)* Its Problem Statement names the opposite failure — "a test that asserts a shape a later phase changed" — which is a test that breaks rather than one that never could. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/spec.md:75] *(observed)* And the plan records no version, so a person who pulls the repo has no record of what changed.

---

## Net-new

Ranked by value to a small team, with size. None of these is in the plan or in the section-13 skip list.

| # | What | Source | Licence | Size | Why it ranks here |
|---|------|--------|---------|------|-------------------|
| 1 | A three-tier offline behaviour eval harness | `OpenMausBot-main/evals/` | Apache-2.0 | M (81 files, 464K, 6 scenarios) | The only way to test that a bot does the right thing without calling a model. "evaluate the harness, never the models" — a scripted engine replays deterministic turns from a plan file, no external API is called, and the scorers never touch a server. [SOURCE: specs/system-skilled-bots/context/OpenMausBot-main/evals/README.md:5,27] |
| 2 | A stall watchdog for the absence of an event | `OpenBot-main/docs/configuration.md:190-194` | MIT | S | Every other audit row is something that happened; this one is the absence of anything happening, which leaves no trace of its own. One timer, one row type, one default — and the default is on for a new clone and off for an upgrade. |
| 3 | A skill-adherence eval | `turnstone-main/eval_skill_adherence.json` | Apache-2.0 | S (56 lines) | Each case carries a skill, a prompt, the expected tool calls, an ordered-subset match and three runs. It tests whether loading a skill makes the agent call the tool it names, which 009 never checks. |
| 4 | A plugin manifest declaring tools and hooks | `hermes-muse-main/plugin.yaml` | MIT | S (14 lines) | `provides_tools` and `provides_hooks` with four hook points and a required host version. It is how a third party adds a capability without forking. |
| 5 | An inbound dedupe queue | `openhuman-full/vendor/tinyeventqueues/` | GPL-3.0 | S | The plan has no inbound dedupe at all, and a redelivered message is the failure every channel transport produces. |
| 6 | A document-output path | `openhuman-full/vendor/tinydocs/` | GPL-3.0 | S | The only document-output path in the ten repos; the plan writes JSON and markdown and nothing a person would call a document. |
| 7 | A bus abstraction between host and providers | `openhuman-full/vendor/tinybus/` | GPL-3.0 | M | The architectural idea behind `tinychannels`: the host supplies scoped services and retains authorization, and the module never takes delivery policy. |
| 8 | A static HTML preview per proposed feature | `OpenMausBot-main/*-preview.html` | Apache-2.0 | S each | A design-review artifact a non-engineer can open before the feature is built, where the plan's 010 carries text frames. |
| 9 | Four READMEs in four languages | `rakazo-main/README.*.md` | Apache-2.0 | S | The only translation discipline in the ten repos. Low value for a team that writes English docs. |
| — | `tinywallet` | `openhuman-full/vendor/tinywallet/` | GPL-3.0 | — | **Do not lift.** A wallet in a bot runtime is a liability with no parity value. |

Six further vendored crates are out of scope for the same reason the skip list gives: they serve a hosted product's concerns, not a local CLI's.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| A five-root scope precedence for skill discovery | The plan has one tree and one name; a precedence ladder is a multi-root product's problem | `tinyskills/README.md:31` vs `009-skills/spec.md:161` | 6 |
| A three-mode durability negotiation for 011 | The plan owns all five transports, so a mode it never selects is a branch no test reaches | `channel-delivery.md:19-31` | 7 |
| A `chat_approvals` capability flag for 011 | The plan's `buttons` and `numberedReply` keys are the same gate at finer grain | `approvals/mod.rs:78-86` | 7 |
| A hosted relay for 011 | Already out of scope in the plan, citing the 001 synthesis | `011/spec.md:103` | 7 |
| A task-thread handoff for 010 | The plan's conversation is the run and its Problem Statement names the limit | `orchestration.ts:11-27` | 6 |
| A "never only a reaction" rule for 010 | The plan has no reactions and already refuses a blank line | `orchestration.ts:33-38` | 6 |
| A numbered copy-paste runbook for 012 in place of the scenario table | The corpus is 25 or more scenarios; a numbered procedure does not scale past the first run | `TESTING.md:231-260` | 8 |
| A post-hoc mining pass for 014 | The plan seeds every review-input row before any lineage spawns, which is stronger | `014/spec.md:188` | 8 |
| A rules store, auto-review or extra-vigilant switch for 006 | The plan's scope boundary defers all three and the deferral is right | `006/spec.md:40` | 10 |
| A keyword classifier for 006 | The plan owns its tools and a declaration is the stronger mechanism | `approvals.md:38-47` | 10 |
| A generated-UI surface for 007 | The plan has none, so the reference's sandbox rule is recorded and not lifted | `configuration.md:188-189` | 10 |
| `turnstone-main/HYPOTHESIS.md` as a rule source | A formal definition, and the one rule it yields the plan already follows | `HYPOTHESIS.md:14` | 9 |
| `rakazo-main`'s i18n as a lift | The plan writes English docs for one team | `rakazo-main/` | 9 |
| `OpenGhost-main`'s layout as anything but a caution | 350 flat files with no source directory | `OpenGhost-main/` | 9 |
| `OpenMausBot-main/enterprise/` and `connector/` | Covered by the skip list's enterprise-roles and connector-catalogue rows | `spec.md:88-95` | 9 |
| `buzz-main/docs/` as a doc-alignment mechanism | 70 flat files with no topic or term index — the failure mode the plan's `terms` list fixes | `buzz-main/docs/` | 7 |
| `buzz-main/ARCHITECTURE.md` for any 003 phase | A 991-line Nostr relay architecture with no analogue in a local CLI | `ARCHITECTURE.md:1-30` | 7 |
| `buzz-main/PLANS/` as a source | Two files about a mobile and a relay design | `PLANS/` | 8 |
| `buzz-main/lefthook.yml` and `ct.yaml` as a review gate | Pre-commit and chart-testing hooks; the plan's gate is `validate.sh` plus the suite | — | 8 |
| `OpenBot-main/server/` as a source | The directory does not exist in the snapshot | — | 1 |
| `openhuman-main/vendor/` as a source | The directory does not exist; the vendor tree is only in `openhuman-full` | — | 2 |

## Open Questions

1. **Does 009's body scan belong to 009 or to 012?** It is a check on a file the phase does not write. The evidence favours 009, because 009 owns the loader that reads the body.
2. **Does 013's licence gate belong to 013 or to 014?** 014 is the phase that reviews the built surface, and a licence check is a review check. The evidence favours 014, with 013 owning the allowlist file.
3. **Is the eval harness a new phase or a child of 014?** 014 reviews the built surface and an eval harness is a review instrument, so a child of 014 is the smaller change.
4. **Is 006's conversation scope a 006 change or a 010 change?** 010 owns the conversation record the scope would be keyed on, so the record belongs to 010 and the answer belongs to 006.
5. **Does 014's falsifiability rule belong to 014 or to 013?** 013 aligns the docs and a test standard is a doc, but 014 is the phase that would enforce it.

## Coverage

All fourteen 003 phase folders are named above. Iterations 4 to 10 covered 001, 002, 003, 004, 005, 006, 007, 008, 009, 010, 011, 012, 013 and 014 under a phase lens; iterations 1 and 3 covered 006, 007 and 008 under a trust lens first. All ten reference repos were read: OpenBot-main, OpenMausBot-main, rakazo-main, openhuman-main, openhuman-full, OpenGhost-main, hermes-muse-main, turnstone-main, buzz-main and tinychannels-main.
