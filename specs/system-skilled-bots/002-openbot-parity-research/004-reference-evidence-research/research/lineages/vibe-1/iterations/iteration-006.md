# Iteration 6: Phase 011 messaging channels — capability honesty, ack policy, retry classification, durability negotiation

## Focus

Phase `011-messaging-channels` against `context/tinychannels-main`. The 003 synthesis already
names four reference files to study for this phase and records nine gaps
[SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:011-messaging-channels]. This iteration does not restate those gaps. It reads the four named files and
extracts the *mechanisms* the plan has no counterpart for: how a capability declaration is made
falsifiable, what the capability record actually contains, when the platform is acknowledged, how a
retry is classified, and what happens when a transport cannot honour requested durability.

`steer.md` does not exist in the lineage directory at the time of this iteration; it is listed
among the sources as absent.

## Findings

### F-6-1 — A capability declaration is a two-way honesty contract, and the reference enforces both directions

Phase 011's `declaredCapabilities` has no vocabulary and no per-transport matrix — already recorded
as 003 gap 2 [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:011-messaging-channels]. What the synthesis does not carry is the *rule* that makes a declaration
mean anything. `check_feature` is documented as "Run one honesty and wire-behavior check"
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:373-377]
and branches on `feature.declared(&fixture.capabilities())` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:391].

- **Undeclared** must produce an explicit unsupported result: `error.unsupported && !error.retryable
  && !error.sent_before_error && error.continuation_message_ids.is_empty() &&
  error.partial_overflow.is_none()`, and for the `Ok(Some(outcome))` shape the receipt must also be
  empty — `platform_message_ids.is_empty() && primary_platform_message_id.is_none() &&
  parts.is_empty()` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:395-415].
  A bare `Ok(None)` is explicitly *not* acceptable [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:414].
- **Undeclared must not reach the provider at all**: `if !observations.is_empty() { return Err("undeclared {feature:?} reached the mock platform") }`
  [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:421-423].
  The fixture clears observations before the exercise [SOURCE: specs/system-skilled-bots/context/tinychannels-conformance/src/lib.rs:390], so the assertion is exact.
- **Declared** must succeed: `result.map_err(|error| format!("declared {feature:?} failed: {}", error.message))?`
  [SOURCE: specs/system-skilled-bots/context/tinychannels-conformance/src/lib.rs:427-428].

Observed. The value to phase 011 is that this is a *test*, not a document. A capability table that
nothing checks is a comment; this one fails the build in both directions. The plan's REQ-017 already
says "five conformance rules in one unnumbered sentence" (003 gap 8) — this is the shape those five
rules should take, and the two-way split is the part the plan lacks.

### F-6-2 — The capability record is a 17-field versioned struct with a typed sub-record per concern and an extensions escape hatch

003 gap 2 points at `capabilities.rs:164` for "the capability vocabulary" but does not state its
shape. `ChannelCapabilities` is 17 fields
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/capabilities.rs:164-184]:
`version: u32`, six flat booleans (`remote_control`, `chat_approvals`, `progressive_edits`,
`streaming_reply_pipeline`, `history_key_ignores_thread`, `reactions`), eight typed sub-records
(`content`, `voice_in`, `voice_out`, `events`, `addressing`, `actions`, `text`, `delivery`), one
`account: AccountCapabilities`, and `extensions: BTreeMap<String, serde_json::Value>`.

Three details matter more than the field list:

- `pub const VERSION: u32 = 2` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/capabilities.rs:187] — the record is versioned, so a consumer can tell an old adapter's record from a new one. The struct is described as "Canonical capability descriptor shared by module, host and relay v2" [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/capabilities.rs:161].
- `unknown()` is documented as "Conservative facts for an unconfigured or unknown channel instance" [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/capabilities.rs:189-190] — the default is *pessimistic*, not optimistic. An adapter that has not been configured claims nothing.
- `extensions` is the escape hatch: a provider-specific capability goes in a free-form map rather than forcing a schema change for one transport.

Observed. Phase 011's capability table should be a versioned record with a pessimistic default and
an extensions map, not a flat list of booleans.

### F-6-3 — Account health is data on the capability record, not a send-time failure

`AccountCapabilities` is a separate seven-field record
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/capabilities.rs:148-159]:
`linked`, `configured`, `enabled`, `healthy`, `reconnecting` (all `Option<bool>`), `health:
Option<String>`, `proactive_target: Option<String>`. It is embedded in `ChannelCapabilities` as the
`account` field [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/capabilities.rs:182].

Observed. This is the missing half of 003 gap 6 ("operator prerequisites are a risk table, not a
runbook"). The reference does not document prerequisites in prose — it puts them on the capability
record as five independent optional booleans, so a bot can report *"configured but not linked"* or
*"linked, unhealthy, reconnecting"* instead of discovering the problem when a send fails. The
`Option<bool>` (rather than `bool`) is deliberate: `None` means "not known", which is different from
`false`. `proactive_target` is the one non-health field — it names where an unsolicited message may
go, which is the prerequisite a proactive send actually needs.

### F-6-4 — The acknowledge point is a declared per-adapter policy with four positions, defaulting to after-receive-record

003 gap 3 records that "the reference makes it an adapter policy [SOURCE: .../adapter.rs:66-68]"
but not what the policy can say. `ChannelReceiveAckPolicy` has four variants
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:16-22]:
`AfterReceiveRecord` (the `#[default]`), `AfterAgentDispatch`, `AfterDurableSend`, `Manual`.

Observed. The four positions are the four defensible answers to "when do I tell the platform I have
the message", and they trade off differently: acking after the receive record is cheapest but loses
the message if the process dies before the agent runs; acking after durable send is safest but
re-delivers on every crash; `Manual` exists because some transports have no ack at all. The plan's
inbound boundary is undefined per transport (003 gap 3) — the fix is not one rule but a declared
choice per adapter, with the default named.

### F-6-5 — Retry policy separates permanent from transient failures, and a permanent failure does not consume an attempt

The plan has retry but no failure classification. The reference has three pieces:

- A fixed backoff ladder: `const BACKOFF_MS: [u64; 5] = [0, 5_000, 25_000, 120_000, 600_000]` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs:11], read by `compute_backoff_ms(retry_count)` which falls back to `600_000` past the end of the array [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs:24-30]. So: immediate, 5s, 25s, 2min, 10min, then 10min forever.
- A cap: `pub const MAX_RETRIES: u32 = 5` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/types.rs:11], tested by `exceeded_max_retries` as `entry.retry_count >= MAX_RETRIES` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs:143-145].
- A permanent-error classifier: eight literal patterns — `"no conversation reference found"`, `"chat not found"`, `"user not found"`, `"bot was blocked by the user"`, `"forbidden: bot was kicked"`, `"chat_id is empty"`, `"recipient is not a valid"`, `"outbound not configured for channel"` [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs:13-22] — plus three substring heuristics (`"bot"`+`"not"`+`"member"`, `"ambiguous "`+`" recipient"`, `"user "`+`" not in room"`) [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs:33-47]. `is_permanent_delivery_error` lowercases the message and matches on substrings.

Observed. The classifier is the finding. Without it, "chat not found" burns five attempts over
twelve minutes and then reports a timeout, when the truth is that the chat is gone and no retry will
help. The implementation is deliberately crude — substring matching on provider error text — and
that crudeness is itself worth copying: it is a table a maintainer can extend in one line, not a
typed error taxonomy that requires every transport to be refactored.

### F-6-6 — Durability is negotiated down and the loss is reported, not failed

`DeliveryDurability` has three values — `Required`, `BestEffort` (the `#[default]`), `Disabled`
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/intent.rs:15-20].
`negotiate_delivery_durability(requested, required, supported)` computes `missing_capabilities` as
every capability that is required but not supported, then returns
`durability: if missing_capabilities.is_empty() { requested } else { DeliveryDurability::BestEffort }`
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs:110-141]. The
result type carries both halves: `DurabilityNegotiation { durability, missing_capabilities }`
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/types.rs:134-137].

The requirements are derived from the payload, not declared by the caller:
`required_durable_final_capabilities` maps `Text` → `Text`, `Media|Voice|Files` → `Media`, `Poll` →
`Poll`, `PresentationBlocks|NativeChannelData|Parts` → `Payload`, and adds `ReplyTo` when
`reply_to_id.is_some()` and `Thread` when `thread_id.is_some()`
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs:148-176].

Observed. Two things the plan lacks. First, the requirement set is *derived from the message shape*,
so a caller cannot forget to declare that a threaded reply needs thread support. Second, a transport
that cannot honour `Required` degrades to `BestEffort` and returns the list of what it dropped — the
send still happens, and the caller learns exactly what was lost. The plan's send path either works
or errors, which turns a degraded-but-useful send into a failure.

### F-6-7 — Adding a capability to an adapter trait without breaking adapters that lack it

`push_ingress` is an additive interface: its default implementation returns an explicit unsupported
result, which the doc comment says preserves "envelope-only sinks"
[SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:30-40].
The same pattern appears in `declared_capabilities()`, whose default is deliberately conservative —
`ChannelCapabilities::unknown()` plus text outbound plus `send` — "so older adapters do not
accidentally claim operations they have not implemented"
[SOURCE: specs/system-skilled-bots/context/tinychannels-runtime/src/channel/adapter.rs:55-64].

Observed. This is the migration recipe for phase 011's seven planned children: each new transport
capability arrives as a trait method with an explicit-unsupported default, so the five existing
transports keep compiling and keep *honestly* reporting that they cannot do the new thing. It pairs
directly with F-6-1: the conservative default is what makes the conformance honesty check pass for
an adapter that has not been updated.

## Ruled Out

- **Reading `src/approvals/mod.rs` for the approval index.** The 003 synthesis already rules this out — the reference keeps its approval index in memory and the phase must not copy it [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md:011-messaging-channels]. Not re-read.
- **Reading `src/delivery/queue.rs` for queue-entry fields.** The synthesis names it as a file to study, and 003 gap 4 already records that the queue entry has no field list. Reading it would produce a field list, which is the gap's closing artifact rather than new evidence. Deferred to the phase's own contracts child.
- **Treating the conformance crate as a test harness only.** First read suggested it was a fixture runner; the `check_feature` body shows it is the enforcement point for the capability contract. Re-read at `:373-430` to confirm, which is why F-6-1 is stated as a contract rather than a test.

## Dead Ends

- **`ChannelReceiveAckPolicy` as a global setting.** The enum is per-adapter (`declared_capabilities` and `receive_ack_policy` are both trait methods with defaults), so there is no single correct ack point to write into the plan. Any plan text that names one ack rule for all transports is contradicted by the reference's own structure. Candidates for the reducer's exhausted list: "one global ack rule for phase 011".
- **A typed error taxonomy for permanent failures.** The reference uses substring matching on provider text. A typed taxonomy would require every transport to map its provider's errors, which is the refactor the reference avoided. Do not propose it as an improvement.

## Edge Cases

- Ambiguous input: none. The focus named one phase and one reference repo.
- Contradictory evidence: none. The four files agree with each other; `adapter.rs` re-exports the `ChannelCapabilities` type from `tinychannels-bus`, so there is one definition.
- Missing dependencies: `steer.md` is absent from the lineage directory (checked before this iteration). Treated as "no ruling issued" rather than as an error, per the dispatch contract. No other dependency was missing.
- Partial success: none. All planned reads resolved.

## Sources Consulted

- `specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-conformance/src/lib.rs:373-430`
- `specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/capabilities.rs:148-190`
- `specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/adapter.rs:16-22`
- `specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-bus/src/channel/intent.rs:15-20`
- `specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:30-68`
- `specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs:11-176`
- `specs/system-skilled-bots/context/tinychannels-main/src/delivery/types.rs:11,134-137`
- `specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md` (phase 011 section)
- `specs/system-skilled-bots/002-openbot-parity-research/004-reference-evidence-research/research/lineages/vibe-1/steer.md` (absent)

## Assessment

- New information ratio: 0.79
- Questions addressed: phase 011 capability vocabulary; phase 011 inbound ack boundary; phase 011 retry and failure classification; phase 011 durability negotiation; phase 011 operator prerequisites
- Questions answered: what a capability declaration must be checked against (F-6-1); what the capability record contains (F-6-2); where account health lives (F-6-3); what the ack policy can say (F-6-4); how retries are classified (F-6-5); what happens when durability cannot be honoured (F-6-6)

Four of seven findings are fully new to the packet (F-6-3, F-6-5, F-6-6, F-6-7). Three are
partially new: the 003 synthesis names the file and the gap for F-6-1, F-6-2 and F-6-4 but not the
mechanism, so each adds the rule rather than the location. (4 + 0.5×3) / 7 = 0.79.

## Reflection

- What worked and why: reading the *enforcement* code rather than the type definitions. `capabilities.rs` gives the vocabulary, but `check_feature` gives the contract, and the contract is what the plan is missing. The same held for `policy.rs`: the interesting part was `is_permanent_delivery_error`, not the queue struct.
- What did not work and why: the first pass at `adapter.rs` read only the trait method signatures and concluded the ack policy was a single setting. The enum body at `:16-22` corrected that. Reading a declaration without its definition is how a four-value choice gets flattened into a rule.
- What I would do differently: for the remaining phases, read the conformance or test crate *before* the implementation crate. In this repo the tests state the invariant in one sentence, and the implementation takes ten times as long to yield the same claim.

## Recommended Next Focus

Phases `013-manual-testing-scenarios`, `014-skilled-and-doc-alignment` and `015-deep-review` together,
against the test and documentation surfaces of `buzz-main`, `hermes-muse-main` and `turnstone-main`.
The open question is what a reference repo's *test suite* looks like when it is the artifact a phase
is supposed to produce — 012's closing artifact is a scenario set, and no iteration has yet looked at
how any of the ten repos structures one. Secondary: whether any repo keeps a doc-alignment check that
013 could mirror, since 013's gap 1 is that its handoff to 014 does not connect.
