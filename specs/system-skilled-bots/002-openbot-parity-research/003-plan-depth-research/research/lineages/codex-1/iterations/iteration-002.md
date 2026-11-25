# Iteration 2: Messaging channels depth

## Focus
Frontier node F-1-003 (depth 1, scope specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels, specs/system-skilled-bots/context/tinychannels-main, specs/system-skilled-bots/context/rakazo-main): Phase 011-messaging-channels: is the adapter architecture, per-channel transport, identity linking, durable queue, approval rendering and conformance test design deep enough to one-shot, and how should it split into children (shared adapter, Telegram, Slack, Signal, WhatsApp)?

## Findings
1. **Phase 011-messaging-channels — P1:** The shared adapter has message/error fields and a declaredCapabilities member, but the capability vocabulary and per-transport capability matrix are not enumerated; REQ-017 promises five conformance rules while naming only the unsupported-operation and declared-send checks. Add child 011-shared-adapter-contracts with capability enums, each transport's supported/unsupported matrix, all five conformance assertions, and fixture inputs/results. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:183-184,204-205] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:63-66,77]
2. **Phase 011-messaging-channels — P1:** The send queue and provider redelivery are planned, but the inbound commit/ack boundary is not: define when Telegram offsets, Slack event acknowledgements, Signal SSE events, and WhatsApp webhook responses are acknowledged relative to durable bots enqueue, and what survives a crash between receipt and enqueue. Add child 011-inbound-ack-and-dedupe with per-provider cursor/ack state, duplicate rules, and crash-boundary fixtures; tinychannels exposes a receive-ack policy explicitly, a useful model to adapt. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:183-195] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:80] [SOURCE: specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:55-68]
3. **Phase 011-messaging-channels — P1:** The roster and channel config have explicit shapes, but the link record and durable queue record still lack a complete persisted field schema, and bots channel list --json is only described as “the same as an object” without field names or a fixture contract. Add 011-channel-file-and-cli-schemas with JSON Schemas for link, approval, queue, and list --json records, including idempotency, expiry, retry, and unknown-send states. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:61-66,185-195,206-210]
4. **Phase 011-messaging-channels — P1:** Telegram inline keyboards, Slack Block Kit, and numbered/YES/NO replies are described as behaviors, but builders still have to design approval copy and layout for the user-facing messages. Add 011-approval-message-design/design/ with Telegram and Slack mockups plus golden text fixtures for Signal, WhatsApp, and terminal, including long-question and expiry states. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:189-190] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:125-140,165] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-010.md:24]
5. **Phase 011-messaging-channels — P1:** External prerequisites are named, but the operator path is not yet executable: the docs do not pin Telegram/Slack credential setup and validation, Signal daemon pairing/start/health checks, or WhatsApp webhook verification/subscription, tunnel, and recovery steps. Add child 011-provider-setup-and-operations with a provider-by-provider setup, preflight, health, restart, and credential-rotation runbook. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:122,239-241,265-271] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:138-157,165]
6. **Phase 011-messaging-channels — P1:** This is a broad integration phase despite its Level 2 designation: the packet counts nine modules, five transports, seven test files, and a 32/70 complexity score. Promote it to a Level 3 phase parent after expanding its depth, with six children: shared adapter/link/roster contracts; approval index and queue; Telegram; Slack; Signal; WhatsApp plus provider operations, UX fixtures, conformance, and final integration. This matches the decomposition gate's independent phase-score and Level 3 requirements. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:292-295] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:115-140] [SOURCE: .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:59-66]

## Ruled Out
- The phase already covers the main refusal, security, and outbound-reliability rules: default-deny linking, approver checks, secret redaction, signature validation, restart-safe approval prompts, unknown-after-send, and bounded retries. Keep these as shared child invariants rather than reopening their policy decisions. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:185-195,201-210,239-248,264-271]
- Do not copy tinychannels' in-memory approval reply index: phase 011 requires the approval index to survive restart. Use tinychannels first for the adapter/capability model and queue policy, and rakazo for sender linking and bounded polling startup. [SOURCE: specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:58-70] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:120,188]

## Dead Ends
- No live external provider was needed to answer the planning-depth question: phase 011 deliberately tests transports with a fake and does not open sockets. The remaining gap is the operator runbook and acknowledgement contract, not a need to make credentials a unit-test prerequisite. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:135-140]

## Edge Cases
- Ambiguous input: none; F-1-003 names phase 011 and the two reference trees.
- Contradictory evidence: none. The packet specifies many wire/security rules, while the missing acknowledgement order and capability vocabulary are narrower omissions.
- Missing dependencies: live tokens, WhatsApp public HTTPS, Meta business account, and Signal daemon are operator prerequisites; fake-transport fixtures still permit implementation verification.
- Partial success: the workflow's first frontier-admit attempt failed because its required frontier-known-texts.json had not yet been generated. I created it from the registry and exhausted-approach section, then admission succeeded with no proposals and the reducer was rerun. The workflow also says to record a config_warning, but the append gateway refused a legacy type:event row with legacy-event-has-no-lossless-mode-event; I did not bypass the gateway or edit the state projection. This conflict is recorded here and the iteration proceeds under the dispatcher's ruling. [SOURCE: .skilled/commands/deep/assets/deep-research.yaml:1766-1784] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:553] [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-ledger-schema.vitest.ts:1625]
- steer.md was absent at iteration start.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/spec.md:45-70,117-124,183-210,239-248,264-295,301-308
- specs/system-skilled-bots/003-openbot-parity-build/011-messaging-channels/plan.md:60-80,115-140,145-167
- specs/system-skilled-bots/context/tinychannels-main/crates/tinychannels-runtime/src/channel/adapter.rs:43-68
- specs/system-skilled-bots/context/tinychannels-main/src/approvals/mod.rs:58-70
- specs/system-skilled-bots/context/tinychannels-main/src/delivery/policy.rs:11-28
- specs/system-skilled-bots/context/rakazo-main/apps/api/src/messaging/messaging-inbound.ts:417-425,1081-1115
- specs/system-skilled-bots/context/rakazo-main/apps/api/src/messaging/messaging-runtime.ts:148-165
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-010.md:14-24
- .skilled/commands/deep/assets/deep-research.yaml:1766-1784
- .skilled/skills/system-spec-kit/references/structure/phase-definitions.md:59-66
- deep-research-config.json, deep-research-state.jsonl, deep-research-strategy.md, and steer.md (absent at iteration start) in this lineage

## Assessment
- New information ratio: 0.33
- Questions addressed: Phase 011 adapter, transport, identity, queue, approval, testing depth, children, and reference-code priority.
- Questions answered: Phase 011 is not ready to one-shot to perfection; its main policy/security behavior is detailed, but capability and inbound acknowledgement contracts, persisted/API schemas, message designs, and provider operations still require decisions. Promote it to a Level 3 phase parent with six bounded children.
- Questions remaining: 1
- Finding novelty: inbound acknowledgement ordering is a new gap; the sibling lineage raised several of the other issues, which this pass verified against the current phase docs and reference code.
- Timestamp observed before recording: 2026-11-25 22:03:22 UTC.

## Reflection
- What worked and why: reading the channel requirements beside the reference adapter exposed that outbound retry policy does not define inbound acknowledgement durability.
- What did not work and why: the warning event had no lossless representation through the current append gateway, even though the workflow's failure branch requests one.
- What I would do differently: generate the workflow's known-text file before the first frontier-admission call, and capture provider-specific acknowledgement checkpoints in the shared adapter contract before splitting transports.

## Recommended Next Focus
Work the remaining bound frontier node F-1-005 on phases 002 and 004 plus the target-state architecture, module map, prompt order, answer seam, and state-root layout.
