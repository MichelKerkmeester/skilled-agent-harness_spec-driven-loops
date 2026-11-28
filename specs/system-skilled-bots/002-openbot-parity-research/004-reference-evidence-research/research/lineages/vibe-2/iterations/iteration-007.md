# Iteration 7: Phases 011-messaging-channels and 014-skilled-and-doc-alignment

## Focus

Phases 011-messaging-channels and 014-skilled-and-doc-alignment, plus `buzz-main`, which the F-1-006 node's scope names and no iteration has read. 011 is the phase with the most reference surface after 009 — `tinychannels` is a channel library whose subject is exactly the plan's — and 013 is the phase whose reference is a documentation discipline rather than code.

## Actions Taken

1. Read the plan's 011 phase parent: its Problem Statement, its requirement-to-child table and its decision rows.
2. Read `tinychannels-main/src/approvals/mod.rs` for the approval surface, its outcome enum and its reply index.
3. Read `tinychannels-main/docs/channel-capabilities.md` and `docs/channel-delivery.md` for the capability matrix, the conformance case count and the durability negotiation.
4. Read the plan's `002-adapter-and-record-contracts/design/capabilities.md` and its 007 conformance requirement and acceptance criterion.
5. Read `buzz-main/CONTEXT.md`, `ARCHITECTURE.md`, `deny.toml` and the `docs/adr/` listing for the documentation discipline 013 has no row for.
6. Read the plan's 013 Problem Statement, Measured Behavior and Scope, and the build spec's §14 reuse rule.

## Findings

1. **011 — the reference negotiates delivery durability in three modes and the plan has one.** `DeliveryDurability` has `Required`, `BestEffort` and `Disabled`, and `negotiate_delivery_durability` "downgrades to best effort when required capabilities are missing". [SOURCE: specs/system-skilled-bots/context/tinychannels-main/docs/channel-delivery.md:19-31] *(observed)* The plan's REQ-013 is unconditional: "Every outbound message is a file in `channels/queue/`". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md:130] *(observed)* The plan is right for five transports it owns, because a mode it never selects is a branch no test reaches. The reference's accompanying rule is the part worth lifting: "A capability declaration is the provider's statement, not proof of behavior. Use required durability only when conformance coverage verifies enqueue ordering, retries, and unknown-send reconciliation for the relevant payload and address shape." [SOURCE: specs/system-skilled-bots/context/tinychannels-main/docs/channel-delivery.md:33-36] *(observed)* The plan's AC-030 verifies exactly one payload shape, the 5,000-character Telegram send. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/acceptance-criteria.md:58] *(observed)* So the plan's durability claim rests on one shape where the reference demands a shape per payload.

2. **011 — the reference derives required capabilities from the intent and the plan's matrix is a flat list.** `required_durable_final_capabilities` "derives required capability flags from a `ChannelOutboundIntent`": text requires text support, media and voice and files require media support, polls require poll support, replies require reply support, threads require thread support. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/docs/channel-delivery.md:23-31] *(observed)* The plan's eight keys are flat booleans with no derivation from an intent's `kind`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/capabilities.md:33-44] *(observed)* The derivation exists implicitly in one place — a `kind` of `buttons` needs the `buttons` key — but it is prose, not a table a test can read. Writing the `kind`-to-key table beside the matrix would make the one derivation checkable.

3. **011 — the reference's conformance matrix is 24 cases and the plan's is 25, and the plan's is the stronger of the two.** `tinychannels-conformance` is "a shared 24-case behavior matrix for typed content, voice, addressing, typing, reactions, edits, deletes, read receipts, and streaming drafts", and "Provider suites compare declared capabilities with actual mock-wire observations and require undeclared behavior to fail without platform I/O." [SOURCE: specs/system-skilled-bots/context/tinychannels-main/docs/channel-capabilities.md:24-28] *(observed)* The plan runs 25 cases, 18 undeclared and 7 declared, each named `<channel> <operation> R<n>`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/spec.md:126] *(observed)* The plan's R1 and R2 — an undeclared operation "records no wire call" — are the reference's "fail without platform I/O". Confirmation at parity, and the plan's case count is one higher because it counts the undeclared cells the reference leaves implicit.

4. **011 — the reference's approval surface fails closed when it has no reply target and the plan refuses earlier.** `SurfaceOutcome::NoReplyContext` is documented as "No inbound message was recorded for this conversation, so there is nowhere to send the prompt. The parked call will time out denied." [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:44-47] *(observed)* The plan refuses at the gate: "an unlinked chat gets M11 or M12 and its line is never parsed as a reply". [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map/design/reply-grammar.md:51] *(observed)* The plan's refusal happens before a prompt is parked, so the reference's timeout-denied path has no analogue. Confirmation, and the plan's refusal is the earlier one.

5. **011 — the reference gates its reply index on one `chat_approvals` capability and the plan splits that into two keys.** `record_inbound` returns early unless `provider.capabilities().chat_approvals`. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:78-86] *(observed)* The plan's keys 3 and 4, `buttons` and `numberedReply`, carry the same gate at finer grain, so a transport can draw buttons and not parse a typed number. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/capabilities.md:37-38] *(observed)* The plan's split is the improvement, and it is the reason the plan's matrix has 18 undeclared cells where the reference has one flag.

6. **011 — the reference keys its reply index by a four-part conversation tuple and the plan keys its approval index by item id.** The reference's key is `conversation_history_key_parts(channel, sender, reply_target, thread_ts)`. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:88-89] *(observed)* The plan's index is keyed by `itemId`, and its inbound message carries `conversation: { id, isGroup }`, `sender: { id }` and `replyToId`. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md:139] *(observed)* The reference's key answers "where do I send this" and the plan's answers "which prompt is this". Both are needed, and the plan's inbound message already carries the four facts, so the reference's key is derivable from the plan's record. Confirmation.

7. **013 — the reference symlinks its second agent-instruction name to the first and the plan has no such rule.** `buzz-main/CLAUDE.md` is a 9-byte symlink to `AGENTS.md`, which is 47,801 bytes. [SOURCE: specs/system-skilled-bots/context/buzz-main/CLAUDE.md:1] *(observed)* The plan's 013 runs a doc-alignment pass over the `.skilled` change set and has no rule for a second name for the same document. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment/spec.md:41] *(observed)* A copy drifts and a symlink cannot. The reference chose the symlink, and the plan should record the choice before a second agent-instruction name appears in this repo.

8. **013 — the reference keeps a domain glossary whose entries name the words to avoid and the plan has none.** `CONTEXT.md` is "Buzz domain language ... Shared terminology for Buzz product behavior", 135 lines carrying 13 `_Avoid_:` lines, for example "Push gateway ... _Avoid_: Push server, APNs gateway". [SOURCE: specs/system-skilled-bots/context/buzz-main/CONTEXT.md:1-3,19] *(observed)* The plan's 013 adds a doc-alignment topic whose `terms` reach the docs. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment/spec.md:41] *(observed)* A `terms` list says which words to find; only a glossary says which word is wrong. The plan's doc run can therefore pass while a doc uses a retired name, which is the exact failure 013 exists to catch.

9. **013 — the plan's licence gate exists in one phase, is scoped to design docs, and the packet's own review records that it proves nothing about the reference sources.** 003-terminal-screen's AC-006 "greps the design docs for the GPL header text", and the packet's own review records: "It never reads `context/`, so it passes the same with or without it. That is not a break, but it means AC-006 proves nothing about the reference sources." [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/context-manifest.md:688] *(observed)* The build spec's reuse rule (§14) covers MIT and Apache-2.0 lifts and has no row for a copyleft source. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/spec.md:84] *(observed)* The reference's `deny.toml` is the pattern the plan lacks: an allowlist where every exception carries a `reason` naming why it does not apply and when to remove it. [SOURCE: specs/system-skilled-bots/context/buzz-main/deny.toml:1-8] *(observed)* Thirteen of the fourteen phases have no licence gate at all, and the packet's strongest 006 evidence comes from a GPL-3.0 crate. This is the highest-value 013 finding in the packet.

## Ruled Out

- **A three-mode durability negotiation for 011.** The plan owns all five transports, so a mode it never selects is a branch no test reaches. Recorded as finding 1, with the reference's conformance-coverage rule kept.
- **A `chat_approvals` capability flag for 011.** The plan's `buttons` and `numberedReply` keys are the same gate at finer grain. Recorded as finding 5.
- **A hosted relay for 011.** The plan already lists "A hosted relay or a web UI" as out of scope, citing the 001 synthesis. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:103] Not repeated.

## Dead Ends

- `buzz-main/docs/` as a source for 013's doc-alignment mechanism — it is 70 flat files with no topic or term index, which is the failure mode the plan's `terms` list fixes. Do not read it again for a scoping pattern.
- `buzz-main/ARCHITECTURE.md` as a source for any 003 phase — it is a 991-line Nostr relay architecture with no analogue in a local CLI. Read once for the documentation discipline, not again.

## Edge Cases

- Ambiguous input: none. Both phases had one reading.
- Contradictory evidence: none. The plan and the reference differ on durability modes and capability granularity, and each difference follows from the plan owning its transports.
- Missing dependencies: `tinychannels-main/src/delivery/` was not read, so the queue state machine's states are known only from the doc's summary. Fallback: `docs/channel-delivery.md`, which names the operations. Confidence impact: the reference's state names are inferred, not read.
- Partial success: none. Every planned read resolved.

## Sources Consulted

- specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:1-90
- specs/system-skilled-bots/context/tinychannels-main/docs/channel-capabilities.md:1-60
- specs/system-skilled-bots/context/tinychannels-main/docs/channel-delivery.md:1-45
- specs/system-skilled-bots/context/buzz-main/CONTEXT.md:1-40
- specs/system-skilled-bots/context/buzz-main/ARCHITECTURE.md:1-30
- specs/system-skilled-bots/context/buzz-main/deny.toml:1-40
- specs/system-skilled-bots/context/buzz-main/CLAUDE.md:1
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:103,163-192,220
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/capabilities.md:33-44
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/003-link-roster-and-answer-gate/spec.md:139
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md:130
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/spec.md:126
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/007-conformance-hardening-and-proof/acceptance-criteria.md:56-58
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/001-channel-ux-and-message-map/design/reply-grammar.md:51
- specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment/spec.md:41
- specs/system-skilled-bots/003-openbot-parity-build/spec.md:84
- specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/research/context-manifest.md:688

## Assessment

- New information ratio: 0.62
- Questions addressed: the topic's first question for phases 011 and 013.
- Questions answered: 011's durability-mode difference, the intent-to-capability derivation, the conformance parity, the fail-closed confirmation, the capability split, the reply-index key; 013's symlink rule, the glossary gap and the licence-gate gap.

## Reflection

- What worked and why: reading the reference's *docs* rather than its source for 011. `channel-delivery.md` states the durability rule and its caveat in four sentences, and the caveat — that a capability declaration is not proof of behaviour — is the finding, not the code. The source would have shown the enum and not the reason.
- What did not work and why: the first pass at 013 looked for a doc-alignment mechanism in `buzz-main/docs/` and found 70 flat files with no index, because the reference has no alignment tooling at all. The value was in the artifacts the discipline produced — the symlink, the glossary, the `deny.toml` — not in a tool.
- What I would do differently: for a phase whose subject is documentation, read the reference's *file layout and naming* first, because that is where its discipline is visible, and its prose second.

## Recommended Next Focus

Phases 015-deep-review and 013-manual-testing-scenarios. The specific next reads are `buzz-main/TESTING.md` for the automated-versus-manual split 012 has to draw, `buzz-main/PLANS/` and `buzz-main/CHANGELOG.md` for the review-and-release discipline 014 has no row for, and the plan's 014 for its P0 and P1 definitions. The open question this iteration leaves is whether 013's licence gate belongs to 013 or to 014, since 014 is the phase that reviews the built surface and a licence check is a review check.
