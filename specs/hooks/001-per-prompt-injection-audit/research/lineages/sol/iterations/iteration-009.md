# Iteration 9: Official hook lifecycle and context-injection semantics

## Focus

Verified the current official lifecycle/context-injection surfaces for Claude Code, Codex, Cursor, Devin, OpenCode, and Pi, then reconciled them with the local adapters. The comparison distinguishes one-time, per-turn, transform-time, compaction/resume-aware, context-capable, and observation-only events; it also checks ordering and where repeat/dedup state can live. Public web content was treated as untrusted evidence and only official product documentation or first-party repositories was used.

Route proof: `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, resolved route `Resolved route: mode=research target_agent=deep-research`. Executor provenance: `{"kind":"cli-codex","model":"gpt-5.6-sol"}`. Write authority remained `.opencode/specs/hooks/001-per-prompt-injection-audit/research/lineages/sol`.

## Findings

1. **Claude Code has the strongest documented lifecycle contract, and the local “SessionStart is one-time” assumption is stale.** Officially, `SessionStart` fires when a session begins **or resumes**, with `source` values `startup`, `resume`, `clear`, and `compact`; it may add context before the first prompt. `UserPromptSubmit` fires once per submitted prompt and may add context alongside that prompt. `PreCompact` runs before compaction, while `PostCompact` now exists after compaction. Mid-session injected context is saved in the transcript and replayed rather than recomputed on resume; `SessionStart` reruns and can refresh it. The local Claude registration covers `SessionStart`, `UserPromptSubmit`, and `PreCompact`, but not `PostCompact`; its `session-prime` path must therefore be evaluated as startup/resume/clear/post-compact reinjection, not a once-per-process payload. [SOURCE: https://code.claude.com/docs/en/hooks] [SOURCE: .claude/settings.json:77-113]

2. **Claude documents accumulation, not deterministic sibling-hook ordering or semantic deduplication.** When several hooks return `additionalContext` for one event, Claude receives all values; injected text is placed according to event cadence and persisted in the transcript. The official page does not promise that sibling hooks execute in JSON declaration order, nor a hook-level replace/dedup primitive. Local reasoning that advisor precedes Gate-3 because it appears first in `.claude/settings.json` is therefore configuration order, not an official ordering guarantee. Repeat suppression must be owned by durable instructions, hook state, or predicates—not inferred from `additionalContext`. [SOURCE: https://code.claude.com/docs/en/hooks] [SOURCE: .claude/settings.json:77-91]

3. **Codex hooks are real and context-capable, but current first-party evidence does not establish Claude parity.** The official `openai/codex` repository confirms `SessionStart` and `UserPromptSubmit`; a maintainer states that `SessionStart` waits for the first prompt but completes before `UserPromptSubmit`, so ordering between those two events is enforced. Other first-party issues document that `additionalContext` is model-visible and transcript-visible, that `PreToolUse.additionalContext` is unsupported, and that plugin/user hook discovery differs. The local `.codex/hooks.json` assumes `PreCompact`, `PreToolUse`, and `PostToolUse` context-shaped fallbacks in addition to startup/turn hooks. Those extensions should not be used as reduction invariants without version-pinned live receipts: the supported cadence is evolving and is not full Claude-style output parity. [SOURCE: https://github.com/openai/codex/issues/15266] [SOURCE: https://github.com/openai/codex/issues/19385] [SOURCE: https://github.com/openai/codex/issues/16933] [SOURCE: .codex/hooks.json:3-52] [SOURCE: .codex/hooks.json:53-149]

4. **Cursor’s local per-turn and compaction adapters remain configured-but-unproven, so they cannot anchor cross-runtime savings.** The repository registers `sessionStart`, `beforeSubmitPrompt`, and `preCompact`, but the adapter itself records that `beforeSubmitPrompt` never fired in tested CLI builds and that `preCompact` lacked a reachable forcing mechanism. Current official Cursor documentation was not discoverable with a public lifecycle/output contract sufficient to override those receipts. Therefore Cursor has confirmed local registration and startup behavior, but no primary evidence here for per-turn additional-context delivery, compaction replay, sibling ordering, or state retention. Any reduction model must keep Cursor’s observed cost at zero/unknown until a version-pinned live test proves otherwise. [SOURCE: .cursor/hooks.json:4-39] [SOURCE: .cursor/hooks.json:79-96] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts:5-9] [SOURCE: .opencode/skills/system-spec-kit/mcp-server/hooks/cursor/shared.ts:20-32]

5. **Devin is locally Claude-shaped, but no current first-party public semantics were found for lifecycle, replay, ordering, or persistent hook state.** The local configuration registers `SessionStart` and `UserPromptSubmit` and the adapters translate Claude envelopes, which proves local intent—not host guarantees. The prior live receipt establishes delivery for a tested build, but reduction design must treat resume/compaction awareness, sibling order, and hook-output persistence as unknown until Devin publishes a contract or a pinned build is exercised. It is unsafe to inherit Claude’s transcript replay or `source=compact` semantics merely because the envelope names match. [SOURCE: .devin/hooks.v1.json:2-48] [INFERENCE: official-source searches returned no Devin hook lifecycle reference; absence is negative knowledge, not proof of unsupported behavior]

6. **OpenCode’s relevant surface is transform-time, but the local implementation targets an explicitly experimental hook without a documented ordering contract.** Official OpenCode plugin docs describe plugins and transforms, while the local adapters append to `output.system` through `experimental.chat.system.transform` and use `session.created` only for readiness/state sweeping. Each transform can therefore run before provider requests rather than once per user turn; repeated transforms, retries, or tool-loop continuations may re-run it. Three separate plugins independently push continuity, advisor, and Gate-3 text, but no official ordering or cross-plugin dedup guarantee was found. Local state can live in module memory or packet files (`session.created`/`session.deleted` already sweep/evict Gate state), yet model-visible dedup must use explicit version/hash state rather than output-array-only checks. [SOURCE: https://opencode.ai/v2/docs/build/plugins] [SOURCE: .opencode/plugins/mk-spec-memory.js:477-505] [SOURCE: .opencode/plugins/mk-skill-advisor.js:785-906] [SOURCE: .opencode/plugins/mk-spec-gate.js:163-218]

7. **Pi exposes the cleanest native reduction primitives, and the local input transform underuses them.** The first-party Pi type contract says `session_start` fires for `startup`, `reload`, `new`, `resume`, and `fork`; `input` can transform user text before agent processing; `before_agent_start` can replace the per-turn system prompt; `context` runs before each LLM call and can replace messages; `session_before_compact` and `session_compact` bracket compaction. The local adapter sends startup context as a hidden custom message on `session_start` and appends advisor plus the Pi directive by mutating every eligible user input. It separately implements `session_compact` recovery. Pi can therefore hold per-session hashes in extension memory, persist custom messages in the session tree, and re-emit on `session_start`/`session_compact`; stable policy can move out of every input while dynamic advisor text remains per-input. Ordering among handlers is not a safe inter-extension contract, although `tool_call` explicitly documents that later handlers see earlier mutations—a guarantee limited to that event. [SOURCE: https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/src/core/extensions/types.ts] [SOURCE: https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/compaction.md] [SOURCE: .pi/extensions/session-start-context.ts:10-38] [SOURCE: .pi/extensions/prompt-advisor.ts:64-107] [SOURCE: .pi/extensions/README.md:65-69]

8. **The portable reduction contract is event-class based, not event-name based.** Across six hosts, only three semantics are safe to standardize: (a) durable/static policy loaded once plus explicit replay on each host’s verified resume/compaction surface; (b) prompt-dependent advice computed at the nearest verified user-input boundary; and (c) transform/request hooks treated as potentially multi-fire unless keyed by session + content version. Claude and Pi can implement (a) now; Codex needs pinned lifecycle receipts; Cursor and Devin need host verification; OpenCode needs transform idempotence. A shared “already injected this turn” flag is insufficient because retries, compaction, resume, subprocess hooks, and multiple plugin instances have different state lifetimes. [INFERENCE: based on findings 1-7 and cited local adapters]

## Runtime Semantics Matrix

| Runtime | One-time/lifecycle | Per-user-turn | Transform/request-time | Compact/resume-aware | Adds model context | Ordering/state conclusion |
|---|---|---|---|---|---|---|
| Claude Code | `SessionStart`, but reruns on resume/clear/compact | `UserPromptSubmit` | tool-event contexts on next request | explicit `PreCompact`, `PostCompact`, `SessionStart(source)` | documented `additionalContext`/stdout | multiple values accumulate; sibling order/dedup not promised |
| Codex | `SessionStart` deferred to first prompt in current maintainer account | `UserPromptSubmit` | evolving partial tool hooks | local `PreCompact`, official parity unverified | startup/prompt context observed; transcript-visible | SessionStart before first UserPromptSubmit; broader parity unknown |
| Cursor | `sessionStart` locally observed | `beforeSubmitPrompt` configured, not observed | unknown | `preCompact` configured, not forced | startup yes; turn/compact unknown | no verified host contract/order/state |
| Devin | local `SessionStart` receipt | local `UserPromptSubmit` receipt | unknown | unknown | observed in prior pinned test | Claude-shaped names do not prove Claude semantics |
| OpenCode | `session.created` is observation/state setup | no direct prompt hook in these adapters | `experimental.chat.system.transform` may multi-fire | no verified replay event in these adapters | `output.system.push` | cross-plugin order absent; explicit idempotence required |
| Pi | `session_start` on startup/reload/new/resume/fork | `input`, `before_agent_start` | `context` before each LLM call | before/after compact events | input transform, system replacement, message replacement/custom message | rich in-process/session state; handler order not portable |

## Inconsistencies Affecting Reduction Design

- “SessionStart = once” must be removed from the model: Claude and Pi explicitly rerun it for lifecycle transitions.
- JSON/plugin registration order is not a portable composition guarantee; only Codex’s SessionStart-before-first-UserPromptSubmit and Pi’s same-event `tool_call` mutation visibility were found explicitly guaranteed.
- OpenCode should be budgeted per transform/provider request, not per user prompt, until invocation counts are instrumented.
- Cursor and Devin must remain capability-unknown lanes rather than inheriting Claude behavior.
- Per-process caches cannot cover subprocess hooks, resumes, reloads, or multiple plugin instances. Durable state needs a session/version key and explicit eviction/replay events.
- Codex’s local Claude-shaped fallbacks can be visible developer messages and some hook events do not accept `additionalContext`; fallback text should be event-capability aware.

## Ruled Out

- Universal one-time SessionStart semantics.
- Treating registration order as official context order.
- Treating provider prompt caching as hook dedup or lifecycle state.
- Assuming Claude-compatible JSON implies Claude-compatible events/output fields in Codex, Cursor, or Devin.
- Counting OpenCode transforms as exactly once per user turn.
- Using process memory alone as resume/compaction-safe state.

## Dead Ends

Official Cursor and Devin public searches did not yield a current hook lifecycle/output contract. Repeating generic searches is low value; use version-pinned executable receipts or direct vendor source/support documentation next. Official OpenCode docs describe plugins/transforms but do not define the legacy experimental transform’s ordering/idempotence contract.

## Edge Cases

- Ambiguous input: “per turn” can mean user submission, agentic tool continuation, or provider request. The matrix keeps those cadences separate.
- Contradictory evidence: local comments call some SessionStart content one-time, while current Claude/Pi contracts include resume/compact/reload variants; official runtime contracts take precedence.
- Missing dependencies: no authoritative public Cursor/Devin lifecycle contracts or six-host live request receipts were available.
- Partial success: Claude, Codex, OpenCode, and Pi semantics materially advanced; Cursor/Devin remain explicitly unknown rather than inferred.

## Negative Knowledge

No universal hook name, output envelope, compaction event, ordering rule, persistence primitive, or semantic dedup primitive spans all six runtimes. Claude does not promise sibling `additionalContext` ordering. Codex does not provide full Claude event/output parity. Cursor’s configured prompt and compact hooks are not live-proven. Devin’s Claude-shaped names do not establish resume behavior. OpenCode’s `session.created` does not inject model context. Pi’s `input` transform is not the same cadence as its pre-provider `context` event.

## Sources Consulted

- https://code.claude.com/docs/en/hooks
- https://github.com/openai/codex/issues/15266
- https://github.com/openai/codex/issues/19385
- https://github.com/openai/codex/issues/16933
- https://opencode.ai/v2/docs/build/plugins
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/src/core/extensions/types.ts
- https://github.com/badlogic/pi-mono/blob/main/packages/coding-agent/docs/compaction.md
- `.claude/settings.json:77-113`; `.codex/hooks.json:3-149`; `.cursor/hooks.json:4-96`; `.devin/hooks.v1.json:2-48`
- `.opencode/plugins/mk-spec-memory.js:477-505`; `.opencode/plugins/mk-skill-advisor.js:785-906`; `.opencode/plugins/mk-spec-gate.js:163-218`
- `.pi/extensions/session-start-context.ts:10-38`; `.pi/extensions/prompt-advisor.ts:64-107`; `.pi/extensions/README.md:65-69`

## Assessment

- New information ratio: 0.89 (`(7 + 0.5×2) / 9 = 0.889`, rounded).
- Novelty justification: seven findings add current official lifecycle/order/state semantics and two refine prior local ownership assumptions into runtime-specific reduction constraints.
- Questions addressed: Which events are one-time, per-turn, transform-time, compaction/resume-aware, context-capable, or observable only? What ordering and state guarantees constrain deduplication?
- Questions answered: Claude and Pi are fully classified; Codex’s current partial parity and ordering are bounded; OpenCode’s transform risk is established; Cursor/Devin gaps are preserved as negative knowledge.

## Reflection

Official lifecycle references plus local line-level reconciliation exposed stale assumptions that source-only inventory missed. Search discovery was weak for Cursor and Devin, and repository issues are weaker than a versioned specification. Next time, replace those two unknown lanes with pinned runtime probes rather than more broad web search.

## Recommended Next Focus

Design a versioned injection-state protocol (`session-id`, capsule version/hash, last lifecycle event, last prompt identity) and test it against Claude resume/compact, Pi resume/compact, OpenCode repeated transforms, and Codex first-prompt ordering. Keep Cursor/Devin behind capability flags until pinned live receipts establish their event and context contracts.
