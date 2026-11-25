# Iteration 2: Phase 011 messaging channels — adapter depth and child split

## Focus
Frontier node F-1-003 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels, specs/system-skilled-bots/context/tinychannels-main, specs/system-skilled-bots/context/rakazo-main): Phase 011-messaging-channels: is the adapter architecture, per-channel transport, identity linking, durable queue, approval rendering and conformance test design deep enough to one-shot, and how should it split into children (shared adapter, Telegram, Slack, Signal, WhatsApp)?

## Actions Taken
1. Read 011's Scope, Files to Change and the full P0/P1 requirement tables (REQ-001 to REQ-023).
2. Read the plan's Architecture section, which names the adapter contract, the five transports, the queue, the approval index and the reference files each follows.
3. Read the measured-behavior block, which records the five `exit=1` probes proving no adapter, approval id, signal-cli daemon or roster exists today.
4. Compared 011's size against 003's parent and children (spec/plan/tasks line counts) to test the phase-parent question.
5. Listed the two reference trees the node names (`tinychannels-main`, `rakazo-main`) to confirm the cited files exist.

## Findings
1. **P0 — 011 is the packet's largest phase and has no children, so one builder must design the adapter contract, the link and roster, the approval index, the durable queue and five wire protocols in a single pass.** It lists 27 files to change, nine new runtime modules, five transports and seven new test files [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:140-170], and its spec is 311 lines against 003's 279 — yet 003 is a phase parent with six children and 011 is a leaf [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:157]. Closing artifact: make 011 a phase parent with six children — `001-shared-adapter-and-contract` (`channel.ts`, the message model, the capability table, the unsupported rule, `channels/config.json`), `002-identity-link-and-roster` (`channel-link.ts`, the pairing code, the lockout, `operators.json`, the roster check in `answer.ts`), `003-approval-index-and-queue` (`channel-approval.ts`, `channel-queue.ts`, the reply grammar, the backoff table), `004-telegram-and-slack` (the two no-public-URL transports with native buttons), `005-signal-and-whatsapp` (the local daemon and the signed webhook, both on the numbered grammar), `006-conformance-and-hardening` (the five conformance rules, the fake transport, the notices, the operator runbook).
2. **P1 — `declaredCapabilities` has no vocabulary: the contract names the member but never the capability names a transport declares, so the `unsupported` rule has nothing to test against.** REQ-001 fixes the six contract members and the `unsupported` result shape [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:183], and the plan says the table is what the conformance suite checks [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:66], but no list of capability keys (`send`, `edit`, `react`, `buttons`, `attachments`, `threads`, `typing`?) appears anywhere. Closing artifact: a capability table in `contracts/channel-adapter.md` with one row per capability and one column per transport, which is also the conformance fixture's input.
3. **P1 — The link record has no field list and no file name in Files to Change.** REQ-003 says the link "records both that actor and the provider-asserted sender id" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:185], and `links.json` appears only in the Data Flow and in REQ-019/REQ-023 [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:76] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:206], never in the Files to Change table, which names only `channel-link.ts`. A builder must invent the file name, the key (chat id? channel plus chat id?), the field names and the unlink removal rule. Closing artifact: `contracts/channel-link.schema.json` plus one Files to Change row for `links.json` under `state-root.ts`.
4. **P1 — The durable queue entry has no field list.** REQ-013 fixes the semantics (write before I/O, `unknown` never retried, backoff 0/5/25/120/600 s) [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:195] and the plan names the reference's queue and policy files [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:70], but the entry's fields (`id`, `channel`, `conversation`, `body`, `attempts`, `nextAttemptAt`, `state`, `createdAt`?) are unstated, and `bots channel list` prints "queue depth from `queue/`" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:206], so the reader depends on a shape nobody wrote. Closing artifact: `contracts/channel-queue.schema.json` with the state enum and the backoff table as data.
5. **P1 — REQ-017 promises five conformance rules and enumerates two, so a builder invents three of five.** The requirement reads "Five conformance rules run as fixture tests on a fake transport: an undeclared operation returns `unsupported` and reaches no platform; a declared one returns no provider error and produces one matching wire observation with a receipt" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:204], and the test file is described only as "the five conformance rules on a fake transport" [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:159]. Closing artifact: the five rules enumerated in `contracts/channel-adapter.md` (the two stated plus, by the reference's own shape, an idempotency-key replay rule, a chunk-limit rule and a token-redaction rule), each with its fixture.
6. **P2 — The approval index file's key structure is unstated while its fields are listed.** REQ-006 lists the entry's fields (action id, item id, channel, conversation, choices, `expiresAt`) and the expiry removal rule [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:188], but not whether the file is a map keyed by action id or an array, which decides the lookup cost and the concurrent-write rule. Closing artifact: one line in `contracts/channel-approval.schema.json`.
7. **P1 — The per-transport operator prerequisites are a dependency table, not a runbook.** The table names the four prerequisites (a bot token, a Slack app-level token with Socket Mode, a registered Signal number with a local daemon, a public HTTPS URL plus a Meta business account) [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:236-242], but no artifact gives the exact scopes, events and webhook fields an operator must set. `bots-run/references/messaging-channels.md` is already in Files to Change [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:167], so the closing artifact is a per-channel setup checklist in that file: Telegram `allowed_updates` of `message` and `callback_query`, Slack `connections:write` plus `chat:write` and the `block_actions` interaction, Signal `signal-cli daemon --http` on localhost, WhatsApp `messages` webhook field plus the app secret for `X-Hub-Signature-256`.

## Ruled Out
- Reading the acceptance-criteria file for the missing shapes: it asserts behavior per requirement and names no field, so it cannot close a schema gap. Checked 011's AC rows for REQ-001, REQ-006 and REQ-017.
- Treating the plan's Data Flow as the contract: it names `links.json`, `approvals.json` and `queue/` in passing [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:76] but gives no field, so it locates the files without specifying them.
- Looking for a conformance fixture list in `tasks.md`: the tasks name the test files and their verify commands, not the rules.

## Dead Ends
- The adapter contract itself is not a gap: REQ-001 and REQ-002 give the six members and the four message shapes with every field [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:183-184], so the contract is deeper than 001's or 005's. Do not re-raise it; the gap is the capability vocabulary and the conformance rules, not the interface.
- The reference-code question is already answered inside the phase: the plan cites `tinychannels-main`'s `adapter.rs`, `envelope.rs`, `intent.rs`, `receipt.rs`, `error.rs`, `delivery/queue.rs`, `delivery/policy.rs`, `security/mod.rs` and `bus/config.rs`, and states the reference is GPL-3.0 so it is design only [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:66-72]. A child split should keep those citations per child rather than re-deriving them.

## Edge Cases
- Ambiguous input: the node asks both "is it deep enough" and "how should it split". Selected interpretation: answer the depth question per subsystem, then give the split as the closing artifact for the P0. Deferred: the exact task decomposition inside each proposed child, which belongs to the child's own plan.
- Contradictory evidence: none. The spec and plan agree on the module set and the transport order.
- Missing dependencies: `tinychannels-main` and `rakazo-main` both exist under `specs/system-skilled-bots/context/`, so the cited reference files are reachable; no fallback was needed.
- Partial success: none.

## Questions Answered
- Is 011's adapter architecture, per-channel transport, identity linking, durable queue, approval rendering and conformance test design deep enough to one-shot? The adapter contract, the message model, the config file, the roster and the per-transport wire facts are; the capability vocabulary, the link record, the queue entry and three of the five conformance rules are not.
- How should it split into children? Six: shared adapter and contract, identity link and roster, approval index and queue, Telegram and Slack, Signal and WhatsApp, conformance and hardening.

## Questions Remaining
- Which capability names belong in `declaredCapabilities`, and does the terminal transport declare the same set as Telegram?
- Do the three unstated conformance rules match the reference's own suite, or does the packet need a fourth fixture class for the queue's `unknown` state?

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:92-242
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:56-140
- specs/system-skilled-bots/003-openbot-parity-build/spec.md:143-177
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/spec.md (line count comparison)
- specs/system-skilled-bots/context/tinychannels-main/ (tree listing)
- specs/system-skilled-bots/context/rakazo-main/ (tree listing)

## Assessment
- New information ratio: 0.86
- Questions addressed: the F-1-003 node question (adapter depth and child split)
- Questions answered: both parts

## Reflection
- What worked and why: counting files and modules against 003's parent-child ratio turned "is this too big?" into a comparable number, which is what makes the phase-parent recommendation defensible rather than a preference.
- What did not work and why: reading the acceptance criteria for field shapes wasted a call; AC rows assert behavior, so they can only confirm a refusal name.
- What I would do differently: read the P1 requirement tail first, because the contract lives in REQ-001/REQ-002 and the gaps live in REQ-017 to REQ-023, and reading the tail first would have found the conformance gap sooner.

## Recommended Next Focus
Frontier node F-1-005 (shared architecture doc and the small phases 004 and 002), then the two depth-2 nodes this lineage admitted under F-1-001 (the `--json` envelope rule and the `ITEM_KEYS` single-writer question). The six-child split proposed here should be re-tested against 012's scenario corpus before it is ranked, because a channel scenario is the one operator path 012 cannot write until the transports exist.
