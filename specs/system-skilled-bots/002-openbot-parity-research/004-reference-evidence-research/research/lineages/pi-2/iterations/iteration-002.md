# Iteration 2: Frontier node F-2-005 — the dedupe window and send-proof edges of phase 011

## Focus
Frontier node F-2-005 (depth 2): "What dedupe window does a transport need when the provider offset resets on restart, and what does the reference's bounded recent-update cache size imply for a durable seen record?" The three sibling depth-2 nodes this iteration's own proposals opened are answered in the same pass because they are the same code path: F-2-006 (which transports can prove a send never left), F-2-007 (Slack envelope redelivery and reply-index idempotency), F-2-008 (button label vocabulary and the secret-literal check).

Interpretation chosen: "dedupe window" means retention of the seen key across a process restart plus the in-process bound, and "proof a send never left" means the transport error carries evidence of non-delivery rather than merely an ambiguous failure.

## Actions Taken
1. Read the bounded recent-update window and its eviction path, plus the test that exercises eviction.
2. Read the plan's inbound acknowledge sequence per transport to see which dedupe questions it already answers.
3. Read the Telegram chunked-send error type and the flags it carries.
4. Read the Slack API failure taxonomy and the Block Kit button validation.
5. Compared each against plan children 004, 005 and 006 and the 002 design documents.

## Findings

1. **The plan fixes where the seen record lives but never how long it is kept, and the reference's only sizing datum is a 4,096-entry in-memory window with eviction.** The reference bounds its dedupe cache at `TELEGRAM_RECENT_UPDATE_CACHE_SIZE: usize = 4096` and evicts from the head when the window is exceeded. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_types.rs:12] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_core.rs:256-263] The offset is a process-local `let mut offset: i64 = 0`, so a restart begins at zero. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs:1854] The consequence is that eviction is safe only inside one process lifetime, and after a restart the reference re-processes every update the provider still holds. The plan's durable `seen/<channel>/<sha256>.json` removes that failure, but the plan names no retention horizon, so the folder grows without bound and nothing says when an entry may be dropped. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:21-30] **Observed.** The 4,096 figure is the only number in the corpus that says how many in-flight messages a single bot actually sees, so the plan should prune `seen/` against the provider's own redelivery horizon rather than leave it unbounded. A retention rule of "older than the provider's maximum redelivery window" is defensible for all four providers; an unbounded folder is not.

2. **A chunked Telegram send reports exactly which chunks landed, and the plan's one-entry-one-state queue cannot represent that.** The reference's partial-send error carries `sent_before_error` and `continuation_message_ids`, and both are set by the caller: `sent_before_error || !message_ids.is_empty()`. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_send.rs:928-946] The plan sends a prompt cut at 4,096 bytes on a code point boundary [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md:99] and records one queue entry that becomes `unknown` on an ambiguous result. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md:130] If chunk 3 of 5 fails, the entry is `unknown`; if any later drain were to retry it, chunks 1 and 2 would be sent again and the person reads a duplicated prompt. **Observed (reference) / inferred (plan).** The evidence supports adding the continuation record to the queue entry: the implementation must either store the chunk ids that landed, or make a multi-chunk message unretryable after the first chunk, and the plan currently does neither explicitly.

3. **Slack separates "nothing was applied" from "the response could not be read", and the plan carries no such split for Slack.** `ApiFailure::Slack { code }` is documented "HTTP 200 with `ok: false`; nothing was applied", while `ApiFailure::Malformed` is "HTTP 200 with a body that is not JSON". [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs:15-21] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs:92-105] Under the plan's rules, a `chat.postMessage` that answers `ok: false` and one whose body cannot be parsed would both land in the same place. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md:100] **Observed.** The evidence supports the reference's split: `ok: false` is a definite `failed` (safe to retry, nothing applied) and an unparseable 200 is `unknown` (never retry). The same distinction the plan already applies to WhatsApp's `4xx` and `408` rows is missing on Slack.

4. **Slack refuses an over-long or disabled button before dispatch, and the plan's button rule checks only the secret literal.** The reference caps a label at 75 characters and an action id at 255 bytes, refuses a disabled action outright, and copies the action id into the button's `value`. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/blocks.rs:10-11] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/blocks.rs:55-74] The plan derives the action id as `approval-v1:<item-id>:<index>` and requires that the choice block and button labels pass the secret-literal check; it states no length cap. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md:128] **Observed.** A truncated action id silently breaks the derived-index lookup, and the `value` field is a second place a long id is rejected, so the plan should refuse `channel-action-id-invalid` before the send rather than let the provider drop the button. This is a lift the plan can take directly: the caps are constants, not provider limits the plan has to guess.

## Ruled Out
- **Re-deriving the plan's inbound acknowledge sequence.** The 002 design already fixes the seven steps, the per-transport dedupe key, and the `after-seen-record` policy for four transports, citing the reference adapter policy. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:62-93] Not a gap.
- **Treating Slack's "do not acknowledge an envelope we could not retain" as new.** The plan already cites that exact line and relies on the reconnect redelivery. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md:73] No finding added.
- **Searching for a reference-side durable seen store.** There is none: `TelegramUpdateWindow` is in-memory with an eviction path, and the WhatsApp and Signal paths carry no seen store at all.

## Dead Ends
- The reference's `whatsapp_web/identity.rs` exists but is the linked-device client the phase puts out of scope; not opened beyond confirming its name.
- No reference attempts to size a seen store from provider retention, so finding 1's recommendation is inference from the reference's bound plus the plan's own provider facts, not a lifted constant.

## Edge Cases
- Ambiguous input: one iteration worked four depth-2 nodes. The node named in `focus` is F-2-005; the other three are answered inside it because they share the transport error path. Recorded here so the reducer can attribute the coverage.
- Contradictory evidence: none. The plan and the reference do not disagree about a fact here; the plan is silent where the reference is specific.
- Missing dependencies: `steer.md` still absent, checked before the iteration.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_types.rs
- specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_core.rs
- specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_core_tests.rs
- specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_tests.rs
- specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_ops.rs
- specs/system-skilled-bots/context/tinychannels-main/src/providers/telegram/channel_send.rs
- specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/api.rs
- specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/blocks.rs
- specs/system-skilled-bots/context/tinychannels-main/src/providers/slack/socket.rs
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/002-adapter-and-record-contracts/design/inbound-sequence.md
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/004-approval-index-and-send-queue/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/005-polling-transports/spec.md
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/006-daemon-and-webhook-transports/spec.md

## Assessment
- New information ratio: 0.88
- Questions addressed: F-2-005 dedupe window and retention; F-2-006 per-transport proof of non-delivery; F-2-007 Slack redelivery order (confirmed already designed); F-2-008 button limits.
- Questions answered: F-2-005, F-2-006 and F-2-008 are answered by findings 1, 3 and 4. F-2-007 is answered negatively — the plan already fixes the acknowledge order — and is therefore closed without a new finding.

## Reflection
- What worked and why: reading the error *type* rather than the error *message*. `PartialTextSendError`'s two flags and `ApiFailure`'s four variants are the repo's own taxonomy of "did it land", which is exactly the question the plan's `unknown` state has to answer.
- What did not work and why: hunting the plan for a `seen/` retention rule by grepping "seen" only. The design document does define absence-of-pruning implicitly by never mentioning it, which is a weaker signal than a stated rule; a grep for "prune", "retention" or "gc" would have settled it faster.
- What I would do differently: when a plan is silent, say "the plan names no X" and cite the document once, rather than quoting three lines that do not mention X.

## Recommended Next Focus
Phase 001-activity-and-actor and 002-routine-layer: which reference files record a bot's activity and actor identity and drive routines, with the licence of each source, and which activity-record and routine-scheduling failures their tests name.
